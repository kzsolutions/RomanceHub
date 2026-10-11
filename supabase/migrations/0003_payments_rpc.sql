-- =============================================================================
-- RomanceHub · 0003 · Payments RPCs + has_access
-- Toda a lógica sensível corre no servidor (SECURITY DEFINER).
-- O preço é SEMPRE lido da base de dados — nunca do frontend.
-- =============================================================================

-- 0. Gerador de referência legível -------------------------------------------
create or replace function public.gen_payment_reference()
returns text
language sql
volatile
as $$
  select 'RH-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8));
$$;

revoke all on function public.gen_payment_reference() from public, anon, authenticated;

-- 1. Criar pedido de pagamento -----------------------------------------------
create or replace function public.create_payment_order(
  p_story_id   uuid,
  p_chapter_id uuid default null
)
returns table (
  id          uuid,
  reference   text,
  price_cents integer,
  kind        public.purchase_kind,
  story_id    uuid,
  chapter_id  uuid
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user     uuid := auth.uid();
  v_story    record;
  v_chapter  record;
  v_kind     public.purchase_kind;
  v_price    integer;
  v_existing uuid;
  v_ref      text;
  v_id       uuid;
begin
  if v_user is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;

  select id, is_free, status, author_id, price_cents
    into v_story
    from public.stories
   where id = p_story_id;

  if not found or v_story.status <> 'published' then
    raise exception 'story_not_found' using errcode = 'P0002';
  end if;
  if v_story.is_free then
    raise exception 'story_is_free' using errcode = 'P0001';
  end if;

  if p_chapter_id is not null then
    select id, story_id, is_free, is_published, price_cents
      into v_chapter
      from public.chapters
     where id = p_chapter_id;

    if not found or v_chapter.story_id <> p_story_id then
      raise exception 'chapter_not_found' using errcode = 'P0002';
    end if;
    if not v_chapter.is_published then
      raise exception 'chapter_not_published' using errcode = 'P0001';
    end if;
    if v_chapter.is_free then
      raise exception 'chapter_is_free' using errcode = 'P0001';
    end if;

    v_kind  := 'chapter';
    v_price := coalesce(v_chapter.price_cents, v_story.price_cents);
  else
    v_kind  := 'story';
    v_price := v_story.price_cents;
  end if;

  -- Já possui? (compra concluída do capítulo, da obra, ou da obra que cobre o capítulo)
  if exists (
    select 1
      from public.purchases p
     where p.user_id = v_user
       and p.status = 'completed'
       and (
         (v_kind = 'story'   and p.kind = 'story'   and p.story_id   = p_story_id)
         or (v_kind = 'chapter' and p.kind = 'chapter' and p.chapter_id = p_chapter_id)
         or (v_kind = 'chapter' and p.kind = 'story'   and p.story_id   = p_story_id)
       )
  ) then
    raise exception 'already_owned' using errcode = 'P0001';
  end if;

  if v_price is null or v_price <= 0 then
    raise exception 'price_not_set' using errcode = 'P0001';
  end if;

  -- Pedido pendente ativo para o mesmo alvo → devolve o existente (idempotente)
  select p.id into v_existing
    from public.purchases p
   where p.user_id = v_user
     and p.status = 'pending'
     and (
       (v_kind = 'story'   and p.kind = 'story'   and p.story_id   = p_story_id)
       or (v_kind = 'chapter' and p.kind = 'chapter' and p.chapter_id = p_chapter_id)
     )
   order by p.created_at desc
   limit 1;

  if v_existing is not null then
    return query
      select p.id, p.reference, p.price_cents, p.kind, p.story_id, p.chapter_id
        from public.purchases p
       where p.id = v_existing;
    return;
  end if;

  v_ref := public.gen_payment_reference();

  insert into public.purchases
    (user_id, story_id, chapter_id, kind, status, price_cents, reference, payment_method, author_id)
  values
    (v_user, p_story_id, p_chapter_id, v_kind, 'pending', v_price, v_ref, 'emola', v_story.author_id)
  returning purchases.id into v_id;

  return query
    select p.id, p.reference, p.price_cents, p.kind, p.story_id, p.chapter_id
      from public.purchases p
     where p.id = v_id;
end;
$$;

-- 2. Submeter referência da transferência + comprovativo ----------------------
create or replace function public.submit_payment_proof(
  p_order_id    uuid,
  p_payment_ref text,
  p_proof_path  text default null
)
returns public.purchase_status
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user   uuid := auth.uid();
  v_status public.purchase_status;
begin
  if v_user is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;

  update public.purchases
     set payment_ref = nullif(trim(p_payment_ref), ''),
         proof_path  = coalesce(nullif(trim(p_proof_path), ''), proof_path),
         updated_at  = now()
   where id = p_order_id
     and user_id = v_user
     and status = 'pending'
   returning status into v_status;

  if v_status is null then
    raise exception 'order_not_pending_or_not_owner' using errcode = 'P0001';
  end if;

  return v_status;
end;
$$;

-- 3. Aprovar pagamento (admin) — idempotente ---------------------------------
create or replace function public.approve_payment_order(p_order_id uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_admin uuid := auth.uid();
  v_row   public.purchases%rowtype;
begin
  if not public.is_admin() then
    raise exception 'not_admin' using errcode = '42501';
  end if;

  update public.purchases
     set status       = 'completed',
         paid_at      = now(),
         reviewed_by  = v_admin,
         reviewed_at  = now(),
         updated_at   = now()
   where id = p_order_id
     and status = 'pending'
   returning * into v_row;

  if not found then
    -- Já processado (duplo clique) ou inexistente: não duplica nada.
    return false;
  end if;

  insert into public.payment_audit (order_id, admin_id, action, amount_cents)
  values (p_order_id, v_admin, 'approved', v_row.price_cents);

  insert into public.notifications (user_id, type, title, body, link)
  values (
    v_row.user_id,
    'system',
    'Pagamento confirmado',
    'O teu pagamento foi confirmado. O conteúdo já está desbloqueado.',
    '/biblioteca'
  );

  return true;
end;
$$;

-- 4. Rejeitar pagamento (admin) ----------------------------------------------
create or replace function public.reject_payment_order(p_order_id uuid, p_reason text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_admin uuid := auth.uid();
  v_row   public.purchases%rowtype;
begin
  if not public.is_admin() then
    raise exception 'not_admin' using errcode = '42501';
  end if;
  if coalesce(trim(p_reason), '') = '' then
    raise exception 'reason_required' using errcode = 'P0001';
  end if;

  update public.purchases
     set status           = 'failed',
         reviewed_by      = v_admin,
         reviewed_at      = now(),
         rejection_reason = trim(p_reason),
         updated_at       = now()
   where id = p_order_id
     and status = 'pending'
   returning * into v_row;

  if not found then
    return false;
  end if;

  insert into public.payment_audit (order_id, admin_id, action, reason, amount_cents)
  values (p_order_id, v_admin, 'rejected', trim(p_reason), v_row.price_cents);

  insert into public.notifications (user_id, type, title, body, link)
  values (
    v_row.user_id,
    'system',
    'Pagamento não confirmado',
    'O teu pedido foi rejeitado: ' || trim(p_reason) || '. Podes criar um novo pedido.',
    '/compras'
  );

  return true;
end;
$$;

-- 5. Permissões das funções --------------------------------------------------
revoke all on function public.create_payment_order(uuid, uuid)   from public, anon;
revoke all on function public.submit_payment_proof(uuid, text, text) from public, anon;
revoke all on function public.approve_payment_order(uuid)         from public, anon;
revoke all on function public.reject_payment_order(uuid, text)    from public, anon;

grant execute on function public.create_payment_order(uuid, uuid)    to authenticated;
grant execute on function public.submit_payment_proof(uuid, text, text) to authenticated;
grant execute on function public.approve_payment_order(uuid)         to authenticated;
grant execute on function public.reject_payment_order(uuid, text)    to authenticated;

-- 6. has_access: fonte única de verdade para conteúdo premium -----------------
create or replace function public.has_access(p_chapter_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
      from public.chapters c
      join public.stories s on s.id = c.story_id
     where c.id = p_chapter_id
       and (
         c.is_free
         or s.is_free
         or s.author_id = auth.uid()
         or public.is_admin()
         or exists (
           select 1
             from public.purchases p
            where p.user_id = auth.uid()
              and p.status = 'completed'
              and (
                (p.kind = 'chapter' and p.chapter_id = c.id)
                or (p.kind = 'story' and p.story_id = s.id)
              )
         )
       )
  );
$$;
