-- =============================================================================
-- RomanceHub · 0007 · Compra única por história + prévia gratuita configurável
-- -----------------------------------------------------------------------------
-- Modelo comercial: deixa de haver compra por capítulo individual. O leitor
-- compra a HISTÓRIA COMPLETA (purchases.kind = 'story') e lê gratuitamente os
-- primeiros capítulos (prévia), configurável por história.
--
-- ADITIVO e não destrutivo:
--   * novas colunas com DEFAULT (metadata-only, sem reescrita de tabela);
--   * a nova policy de leitura é um SUPERCONJUNTO da atual (nunca retira acesso
--     a quem já tem direitos: mantém capítulos grátis, histórias grátis, autor,
--     admin e compras concluídas de capítulo);
--   * compras de capítulo já existentes continuam a valer (compatibilidade).
--
-- ROLLBACK (se necessário):
--   drop policy if exists chapter_contents_select on public.chapter_contents;
--   -- e restaurar a definição anterior da policy (ver 0006 / initial_schema_rls)
--   drop function if exists public.story_preview_limit(uuid);
--   alter table public.stories drop column if exists preview_min;
--   alter table public.stories drop column if exists preview_percent;
-- =============================================================================

-- 1. Configuração da prévia gratuita (por história) ---------------------------
--    A regra inicial é 50% dos capítulos PUBLICADOS, arredondado para baixo,
--    com um mínimo de `preview_min` capítulos quando a história tem >= 6
--    capítulos publicados. Só se contam capítulos publicados (c.is_published).
alter table public.stories
  add column if not exists preview_percent integer not null default 50,
  add column if not exists preview_min     integer not null default 3;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'stories_preview_percent_range'
      and conrelid = 'public.stories'::regclass
  ) then
    alter table public.stories
      add constraint stories_preview_percent_range
      check (preview_percent between 0 and 100);
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'stories_preview_min_nonneg'
      and conrelid = 'public.stories'::regclass
  ) then
    alter table public.stories
      add constraint stories_preview_min_nonneg
      check (preview_min >= 0);
  end if;
end $$;

-- 2. Limite de prévia: fonte única da regra -----------------------------------
--    Devolve quantos capítulos publicados são legíveis gratuitamente.
--    SECURITY INVOKER (não eleva privilégios); lê apenas dados publicados e
--    configuração pública da história, pelo que é seguro expor a anon.
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

-- Chamada a partir de policies (role public) e, se necessário, da aplicação.
grant execute on function public.story_preview_limit(uuid) to anon, authenticated;

-- 3. Leitura de conteúdo: mantém tudo o que já existia e acrescenta a prévia --
--    Regra (auth.uid() em cache via subselect) para evitar chamadas por linha.
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
           c.is_free
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

-- 4. has_access: alinhar com a mesma regra (continua não exposta a RPC) -------
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

-- 5. Índices ------------------------------------------------------------------
--    Nenhum índice novo é necessário: public.chapters já tem
--    chapters_story_idx (story_id) e chapters_story_id_number_key
--    (story_id, number), e public.purchases já cobre user_id, story_id,
--    chapter_id e (user_id, status). O volume atual não justifica mais.
