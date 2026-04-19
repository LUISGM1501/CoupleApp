-- 0004_storage.sql
-- Buckets 'memories' y 'avatars' públicos en lectura.
-- Estructura: memories/<couple_id>/<memory_id>/<archivo>
--             avatars/<user_id>/<archivo>

-- ============================================================================
-- BUCKETS
-- ============================================================================
insert into storage.buckets (id, name, public)
  values ('memories', 'memories', true)
  on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
  values ('avatars', 'avatars', true)
  on conflict (id) do nothing;

-- ============================================================================
-- POLICIES: memories
-- Lectura pública ya está implícita si el bucket es public, pero igual damos select
-- a authenticated para consistencia. Write/delete solo a miembros de la pareja.
-- ============================================================================
drop policy if exists "memories_read_public" on storage.objects;
create policy "memories_read_public"
  on storage.objects for select
  to public
  using (bucket_id = 'memories');

drop policy if exists "memories_write_couple" on storage.objects;
create policy "memories_write_couple"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'memories'
    and (storage.foldername(name))[1]::uuid = public.my_couple_id()
  );

drop policy if exists "memories_update_couple" on storage.objects;
create policy "memories_update_couple"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'memories'
    and (storage.foldername(name))[1]::uuid = public.my_couple_id()
  );

drop policy if exists "memories_delete_couple" on storage.objects;
create policy "memories_delete_couple"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'memories'
    and (storage.foldername(name))[1]::uuid = public.my_couple_id()
  );

-- ============================================================================
-- POLICIES: avatars
-- ============================================================================
drop policy if exists "avatars_read_public" on storage.objects;
create policy "avatars_read_public"
  on storage.objects for select
  to public
  using (bucket_id = 'avatars');

drop policy if exists "avatars_write_self" on storage.objects;
create policy "avatars_write_self"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1]::uuid = auth.uid()
  );

drop policy if exists "avatars_update_self" on storage.objects;
create policy "avatars_update_self"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1]::uuid = auth.uid()
  );

drop policy if exists "avatars_delete_self" on storage.objects;
create policy "avatars_delete_self"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1]::uuid = auth.uid()
  );
