-- ETAPA 5 — Fichas visuais de personagens (anime)
--
-- Nova tabela public.characters: uma ficha por personagem de cada história,
-- com texto editorial (aparência, personalidade, bio) e um slot de imagem
-- (portrait_url) + prompt para geração de retrato estilo anime.
--
-- As imagens são colocadas pelo admin através do campo portrait_url
-- (caminho/URL), tal como acontece com cover_url. O texto é escrito no admin.
--
-- ROLLBACK:
--   drop table if exists public.characters;

create table if not exists public.characters (
  id uuid primary key default gen_random_uuid(),
  story_id uuid not null references public.stories(id) on delete cascade,
  name text not null,
  role text not null default 'secundario'
    check (role in ('protagonista', 'coprotagonista', 'antagonista', 'secundario')),
  age text,
  occupation text,
  appearance text,
  personality text,
  bio text,
  portrait_url text,
  portrait_prompt text,
  sort_order integer not null default 0,
  is_public boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists characters_story_id_idx
  on public.characters (story_id, sort_order);

alter table public.characters enable row level security;

-- Leitura pública das fichas visíveis; admin e o autor dono da história
-- veem tudo (incluindo fichas ainda não públicas).
drop policy if exists characters_select on public.characters;
create policy characters_select on public.characters
  for select
  using (
    is_public
    or public.is_admin()
    or exists (
      select 1 from public.stories s
      where s.id = story_id and s.author_id = auth.uid()
    )
  );

-- Escrita (insert/update/delete) só para admin ou autor dono da história.
drop policy if exists characters_write on public.characters;
create policy characters_write on public.characters
  for all
  using (
    public.is_admin()
    or exists (
      select 1 from public.stories s
      where s.id = story_id and s.author_id = auth.uid()
    )
  )
  with check (
    public.is_admin()
    or exists (
      select 1 from public.stories s
      where s.id = story_id and s.author_id = auth.uid()
    )
  );
