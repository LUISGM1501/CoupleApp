-- 0002_rls.sql
-- Helper functions + Row Level Security.
-- Clave: la policy de profiles NO puede leer profiles (recursión), por eso usamos
-- una función SECURITY DEFINER que hace el lookup una sola vez (fix v1).

-- ============================================================================
-- HELPERS
-- ============================================================================
create or replace function public.my_couple_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select couple_id from public.profiles where id = auth.uid();
$$;

grant execute on function public.my_couple_id() to authenticated;

-- ============================================================================
-- RLS: habilitar en todas las tablas
-- ============================================================================
alter table public.profiles enable row level security;
alter table public.couples  enable row level security;
alter table public.memories enable row level security;
alter table public.comments enable row level security;

-- ============================================================================
-- PROFILES
-- ============================================================================
drop policy if exists "profiles_select_self_or_partner" on public.profiles;
create policy "profiles_select_self_or_partner"
  on public.profiles for select
  to authenticated
  using (
    id = auth.uid()
    or (couple_id is not null and couple_id = public.my_couple_id())
  );

drop policy if exists "profiles_update_self" on public.profiles;
create policy "profiles_update_self"
  on public.profiles for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

-- insert lo hace el trigger handle_new_user (SECURITY DEFINER), no hace falta policy de insert

-- ============================================================================
-- COUPLES
-- ============================================================================
drop policy if exists "couples_select_members" on public.couples;
create policy "couples_select_members"
  on public.couples for select
  to authenticated
  using (user1_id = auth.uid() or user2_id = auth.uid());

drop policy if exists "couples_update_members" on public.couples;
create policy "couples_update_members"
  on public.couples for update
  to authenticated
  using (user1_id = auth.uid() or user2_id = auth.uid())
  with check (user1_id = auth.uid() or user2_id = auth.uid());

-- insert de couples se hace vía RPC (create_couple_and_join), no hace falta policy de insert

-- ============================================================================
-- MEMORIES
-- ============================================================================
drop policy if exists "memories_select_couple" on public.memories;
create policy "memories_select_couple"
  on public.memories for select
  to authenticated
  using (couple_id = public.my_couple_id());

drop policy if exists "memories_insert_couple" on public.memories;
create policy "memories_insert_couple"
  on public.memories for insert
  to authenticated
  with check (
    couple_id = public.my_couple_id()
    and created_by = auth.uid()
  );

drop policy if exists "memories_update_couple" on public.memories;
create policy "memories_update_couple"
  on public.memories for update
  to authenticated
  using (couple_id = public.my_couple_id())
  with check (couple_id = public.my_couple_id());

drop policy if exists "memories_delete_couple" on public.memories;
create policy "memories_delete_couple"
  on public.memories for delete
  to authenticated
  using (couple_id = public.my_couple_id());

-- ============================================================================
-- COMMENTS
-- ============================================================================
drop policy if exists "comments_select_couple" on public.comments;
create policy "comments_select_couple"
  on public.comments for select
  to authenticated
  using (
    memory_id in (
      select id from public.memories where couple_id = public.my_couple_id()
    )
  );

drop policy if exists "comments_insert_self" on public.comments;
create policy "comments_insert_self"
  on public.comments for insert
  to authenticated
  with check (
    author_id = auth.uid()
    and memory_id in (
      select id from public.memories where couple_id = public.my_couple_id()
    )
  );

drop policy if exists "comments_delete_self" on public.comments;
create policy "comments_delete_self"
  on public.comments for delete
  to authenticated
  using (author_id = auth.uid());
