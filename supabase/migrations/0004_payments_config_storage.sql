-- =============================================================================
-- RomanceHub · 0004 · Configuração de pagamento + Storage de comprovativos
-- =============================================================================

-- 1. Instruções de pagamento nas settings (valores VAZIOS por omissão) --------
insert into public.settings (key, value, description)
values (
  'payment.instructions',
  jsonb_build_object(
    'emola', jsonb_build_object(
      'number', '', 'holder', '', 'instructions', '', 'reader_guidance', '', 'active', false
    ),
    'mpesa', jsonb_build_object(
      'number', '', 'holder', '', 'instructions', '', 'reader_guidance', '', 'active', false
    )
  ),
  'Instruções de pagamento manual (e-Mola / Mpesa)'
)
on conflict (key) do nothing;

-- 2. Leitura pública apenas das chaves de pagamento --------------------------
-- (as instruções são, por natureza, informação pública para o leitor)
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'settings'
      and policyname = 'settings_payment_read'
  ) then
    create policy "settings_payment_read"
      on public.settings
      for select
      to anon, authenticated
      using (key like 'payment.%');
  end if;
end $$;

-- 3. Bucket privado para comprovativos ---------------------------------------
insert into storage.buckets (id, name, public)
values ('payment-proofs', 'payment-proofs', false)
on conflict (id) do update set public = false;

-- 4. Policies do Storage -----------------------------------------------------
-- Upload: o utilizador autenticado só escreve na sua própria pasta <uid>/...
drop policy if exists "payment_proofs_insert_own" on storage.objects;
create policy "payment_proofs_insert_own"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'payment-proofs'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Leitura: o dono ou um administrador
drop policy if exists "payment_proofs_select_own_or_admin" on storage.objects;
create policy "payment_proofs_select_own_or_admin"
  on storage.objects
  for select
  to authenticated
  using (
    bucket_id = 'payment-proofs'
    and (
      (storage.foldername(name))[1] = auth.uid()::text
      or public.is_admin()
    )
  );

-- Admin: gestão total
drop policy if exists "payment_proofs_admin_all" on storage.objects;
create policy "payment_proofs_admin_all"
  on storage.objects
  for all
  to authenticated
  using (bucket_id = 'payment-proofs' and public.is_admin())
  with check (bucket_id = 'payment-proofs' and public.is_admin());
