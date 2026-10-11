-- =============================================================================
-- RomanceHub · 0002 · Payments RLS
-- Um leitor só vê os seus pedidos. Ninguém escreve pedidos por UPDATE direto:
-- toda a criação/aprovação passa por RPC SECURITY DEFINER (0003).
-- =============================================================================

alter table public.purchases    enable row level security;
alter table public.payment_audit enable row level security;

-- Limpa policies existentes em purchases para garantir estado auditável --------
do $$
declare
  r record;
begin
  for r in
    select policyname
    from pg_policies
    where schemaname = 'public' and tablename = 'purchases'
  loop
    execute format('drop policy if exists %I on public.purchases', r.policyname);
  end loop;
end $$;

-- SELECT: o próprio utilizador ou admin --------------------------------------
create policy "purchases_select_own_or_admin"
  on public.purchases
  for select
  to authenticated
  using (user_id = auth.uid() or public.is_admin());

-- Admin: leitura/gestão total (as aprovações usam RPC; isto é defensivo) ------
create policy "purchases_admin_all"
  on public.purchases
  for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- payment_audit: apenas admin lê -------------------------------------------------
do $$
declare
  r record;
begin
  for r in
    select policyname
    from pg_policies
    where schemaname = 'public' and tablename = 'payment_audit'
  loop
    execute format('drop policy if exists %I on public.payment_audit', r.policyname);
  end loop;
end $$;

create policy "payment_audit_admin_read"
  on public.payment_audit
  for select
  to authenticated
  using (public.is_admin());
