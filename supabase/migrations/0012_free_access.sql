-- =============================================================================
-- 0012_free_access.sql — Acesso livre temporário a todas as histórias
-- =============================================================================
-- OBJECTIVO
--   Durante uma janela limitada no tempo, todos os capítulos publicados ficam
--   legíveis para utilizadores com sessão, incluindo histórias premium.
--   Visitantes sem sessão continuam limitados ao primeiro capítulo.
--   Nada é apagado: a lógica de compra, prévia e RLS mantém-se intacta e volta
--   a aplicar-se automaticamente quando a janela terminar.
--
-- COMO FUNCIONA
--   * public.free_access_until()  -> instante em que o acesso livre termina;
--   * public.free_access_active() -> true enquanto now() < free_access_until();
--   * public.story_preview_limit() passa a devolver o total de capítulos
--     publicados enquanto o acesso livre estiver activo.
--
--   A policy chapter_contents_select e a função has_access já dependem de
--   story_preview_limit, pelo que não precisam de ser alteradas.
--
-- IMPORTANTE
--   A data está duplicada em src/lib/access.ts (FREE_ACCESS_UNTIL). Mantém as
--   duas em sincronia. A BD é a fonte de verdade para a segurança (RLS); a
--   constante TypeScript serve apenas para a UI (badges, CTAs, contagens).
--
-- ROLLBACK / DESACTIVAR ANTES DO PRAZO
--   select public.free_access_until();  -- confirmar a data
--   create or replace function public.free_access_until()
--   returns timestamptz language sql stable
--   as $$ select now() - interval '1 second' $$;
--   -- (free_access_active() passa imediatamente a false)
-- =============================================================================

-- 1. Janela de acesso livre ---------------------------------------------------
create or replace function public.free_access_until()
returns timestamptz
language sql
stable
as $$
  select timestamptz '2026-12-26 23:59:59+00';
$$;

create or replace function public.free_access_active()
returns boolean
language sql
stable
as $$
  select now() < public.free_access_until();
$$;

grant execute on function public.free_access_until() to anon, authenticated;
grant execute on function public.free_access_active() to anon, authenticated;

-- 2. Limite de prévia: fonte única da regra -----------------------------------
--    (substitui a definição da migração 0007; mesma assinatura)
create or replace function public.story_preview_limit(p_story_id uuid)
returns integer
language sql
stable
security invoker
set search_path = public
as $$
  with cfg as (
    select coalesce(preview_percent, 50) as percent,
           coalesce(preview_min, 3)     as min_chapters,
           coalesce(is_free, false)     as is_free
      from public.stories
     where id = p_story_id
  ),
  cnt as (
    select count(*)::int as published
      from public.chapters
     where story_id = p_story_id
       and is_published
  )
  select case
    -- Acesso livre temporário: toda a obra é legível para quem tem sessão.
    -- Visitantes continuam limitados ao capítulo 1 (ver policy abaixo).
    when public.free_access_active() and (select auth.uid()) is not null
      then (select published from cnt)
    -- Histórias gratuitas: toda a obra é legível.
    when (select is_free from cfg) then (select published from cnt)
    else least(
      (select published from cnt),
      greatest(
        case
          when (select published from cnt) >= 6
            then greatest(
              (select min_chapters from cfg),
              floor((select published from cnt) * (select percent from cfg) / 100.0)::int
            )
          else floor((select published from cnt) * (select percent from cfg) / 100.0)::int
        end,
        0
      )
    )
  end;
$$;

grant execute on function public.story_preview_limit(uuid) to anon, authenticated;

-- 3. Primeiro capítulo sempre livre (mesmo sem sessão) ------------------------
--    A regra de produto é: visitantes leem o capítulo 1 e precisam de conta a
--    partir do 2.º. Garantimos isso também na RLS, para o caso de a prévia
--    configurada ser 0 (obras com poucos capítulos) e para o período depois da
--    janela de acesso livre.
drop policy if exists chapter_contents_select on public.chapter_contents;

create policy chapter_contents_select
  on public.chapter_contents
  for select
  to public
  using (
    (select public.is_admin())
    or exists (
      select 1
        from public.chapters c
        join public.stories s on s.id = c.story_id
       where c.id = chapter_contents.chapter_id
         and c.is_published
         and s.status = 'published'
         and (
           c.number = 1
           or c.is_free
           or s.is_free
           or s.author_id = (select auth.uid())
           or c.number <= public.story_preview_limit(s.id)
           or exists (
             select 1
               from public.purchases p
              where p.user_id = (select auth.uid())
                and p.status = 'completed'
                and (
                  (p.kind = 'story'   and p.story_id   = s.id)
                  or (p.kind = 'chapter' and p.chapter_id = c.id)
                )
           )
         )
    )
  );

-- 4. has_access alinhado com a mesma regra ------------------------------------
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
         c.number = 1
         or c.is_free
         or s.is_free
         or s.author_id = auth.uid()
         or public.is_admin()
         or c.number <= public.story_preview_limit(s.id)
         or exists (
           select 1
             from public.purchases p
            where p.user_id = auth.uid()
              and p.status = 'completed'
              and (
                (p.kind = 'story'   and p.story_id   = s.id)
                or (p.kind = 'chapter' and p.chapter_id = c.id)
              )
         )
       )
  );
$$;

revoke execute on function public.has_access(uuid) from public, anon, authenticated;
