-- =============================================================================
-- RomanceHub · 0001 · Payments schema (manual e-Mola / Mpesa)
-- Idempotente. Reutiliza a tabela public.purchases (pedido + entitlement).
-- =============================================================================

-- 1. Colunas adicionais em purchases -----------------------------------------
alter table public.purchases
  add column if not exists reference        text,
  add column if not exists payment_method   text not null default 'emola',
  add column if not exists proof_path       text,
  add column if not exists paid_at          timestamptz,
  add column if not exists reviewed_by      uuid references public.profiles(id) on delete set null,
  add column if not exists reviewed_at      timestamptz,
  add column if not exists rejection_reason text,
  add column if not exists updated_at       timestamptz not null default now();

-- 2. Preços por item (meticais, em centavos; NULL = não vendável) -------------
alter table public.stories
  add column if not exists price_cents integer
  constraint stories_price_cents_nonneg check (price_cents is null or price_cents >= 0);

alter table public.chapters
  add column if not exists price_cents integer
  constraint chapters_price_cents_nonneg check (price_cents is null or price_cents >= 0);

-- 3. Referência única do pedido ----------------------------------------------
create unique index if not exists purchases_reference_key
  on public.purchases (reference)
  where reference is not null;

-- 4. Anti-duplicação de entitlements concluídos ------------------------------
create unique index if not exists purchases_one_story_per_user
  on public.purchases (user_id, story_id)
  where kind = 'story' and status = 'completed';

create unique index if not exists purchases_one_chapter_per_user
  on public.purchases (user_id, chapter_id)
  where kind = 'chapter' and status = 'completed';

-- 5. Índices de apoio --------------------------------------------------------
create index if not exists purchases_user_status_idx
  on public.purchases (user_id, status);

create index if not exists purchases_status_created_idx
  on public.purchases (status, created_at desc);

-- 6. Auditoria de decisões administrativas -----------------------------------
create table if not exists public.payment_audit (
  id           uuid primary key default gen_random_uuid(),
  order_id     uuid not null references public.purchases(id) on delete cascade,
  admin_id     uuid references public.profiles(id) on delete set null,
  action       text not null check (action in ('approved', 'rejected')),
  reason       text,
  amount_cents integer not null default 0,
  created_at   timestamptz not null default now()
);

create index if not exists payment_audit_order_idx on public.payment_audit (order_id);
create index if not exists payment_audit_admin_idx on public.payment_audit (admin_id, created_at desc);
