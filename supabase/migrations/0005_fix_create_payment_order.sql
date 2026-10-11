-- =============================================================================
-- RomanceHub · 0005 · Corrige create_payment_order (id ambíguo)
-- As colunas de RETURNS TABLE (id, reference, ...) colidiam com as colunas de
-- public.stories / public.chapters em referências não qualificadas (erro 42702).
-- Solução: qualificar todas as colunas com o alias da tabela.
-- =============================================================================

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

  select s.id, s.is_free, s.status, s.author_id, s.price_cents
    into v_story
    from public.stories s
   where s.id = p_story_id;

  if not found or v_story.status <> 'published' then
    raise exception 'story_not_found' using errcode = 'P0002';
  end if;
  if v_story.is_free then
    raise exception 'story_is_free' using errcode = 'P0001';
  end if;

  if p_chapter_id is not null then
    select c.id, c.story_id, c.is_free, c.is_published, c.price_cents
      into v_chapter
      from public.chapters c
     where c.id = p_chapter_id;

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

  -- Já possui? (capítulo, obra, ou obra que cobre o capítulo)
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

  -- Pedido pendente ativo para o mesmo alvo → devolve-o (idempotente)
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

-- Privileges (create or replace preserva-os, mas garantimos o estado correto)
revoke all on function public.create_payment_order(uuid, uuid) from public, anon;
grant execute on function public.create_payment_order(uuid, uuid) to authenticated;
