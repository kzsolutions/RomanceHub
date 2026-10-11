-- =============================================================================
-- RomanceHub · 0006 · Correções de advisors (segurança + performance)
-- Resultado dos advisors do Supabase sobre a camada de pagamentos.
-- =============================================================================

-- 1. gen_payment_reference: search_path mutável -> fixar ----------------------
alter function public.gen_payment_reference() set search_path = '';

-- 2. has_access: sem referências (nem policies nem app) -> deixar de expor ----
-- Se no futuro for usada numa policy, a execução continua a funcionar dentro
-- da policy; apenas deixa de ser chamável via /rest/v1/rpc como anon/authenticated.
revoke execute on function public.has_access(uuid) from public, anon, authenticated;

-- 3. record_read: chamada apenas por utilizadores autenticados ----------------
revoke execute on function public.record_read(uuid, uuid) from public, anon;

-- 4. purchases: policy de SELECT única e least privilege ----------------------
-- As escritas continuam exclusivamente via RPC SECURITY DEFINER
-- (create/submit/approve/reject). Remove-se a policy ALL de admin.
drop policy if exists "purchases_admin_all" on public.purchases;
drop policy if exists "purchases_select_own_or_admin" on public.purchases;

create policy "purchases_select_own_or_admin"
  on public.purchases
  for select
  to authenticated
  using (
    user_id = (select auth.uid())
    or (select public.is_admin())
  );

-- 5. settings: a policy de pagamento é redundante (settings_select é pública) -
drop policy if exists "settings_payment_read" on public.settings;

-- 6. FK sem índice: purchases.reviewed_by -------------------------------------
create index if not exists purchases_reviewed_by_idx
  on public.purchases (reviewed_by);
