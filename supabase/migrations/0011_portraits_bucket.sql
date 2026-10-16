-- ETAPA 5 — Bucket de retratos de personagens (público)
--
-- Cria o bucket 'portraits' (público, como 'covers'/'avatars'), adiciona a
-- leitura pública à policy storage_public_read existente e cria as policies
-- de escrita (admin ou autor aprovado), espelhando as de 'covers'.
--
-- ROLLBACK:
--   alter policy storage_public_read on storage.objects
--     using (bucket_id = any (array['covers','avatars']));
--   drop policy if exists portraits_write on storage.objects;
--   drop policy if exists portraits_update on storage.objects;
--   drop policy if exists portraits_delete on storage.objects;
--   delete from storage.buckets where id = 'portraits';

insert into storage.buckets (id, name, public)
values ('portraits', 'portraits', true)
on conflict (id) do nothing;

alter policy storage_public_read on storage.objects
  using (bucket_id = any (array['covers', 'avatars', 'portraits']));

drop policy if exists portraits_write on storage.objects;
create policy portraits_write on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'portraits'
    and (
      is_admin()
      or exists (
        select 1 from authors a
        where a.profile_id = (select auth.uid()) and a.is_approved
      )
    )
  );

drop policy if exists portraits_update on storage.objects;
create policy portraits_update on storage.objects
  for update to authenticated
  using (
    bucket_id = 'portraits'
    and (
      is_admin()
      or exists (
        select 1 from authors a
        where a.profile_id = (select auth.uid()) and a.is_approved
      )
    )
  );

drop policy if exists portraits_delete on storage.objects;
create policy portraits_delete on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'portraits'
    and (
      is_admin()
      or exists (
        select 1 from authors a
        where a.profile_id = (select auth.uid()) and a.is_approved
      )
    )
  );
