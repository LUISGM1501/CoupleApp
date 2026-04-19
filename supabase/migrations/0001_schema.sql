-- 0001_schema.sql
-- Esquema base: enums, tablas, triggers, realtime.

-- ============================================================================
-- ENUMS
-- ============================================================================
do $$ begin
  create type mood_key as enum (
    'enamorado', 'feliz', 'tranquilo', 'extrano',
    'horny', 'ocupado', 'cansado', 'pensativo'
  );
exception when duplicate_object then null; end $$;

-- ============================================================================
-- TABLAS
-- ============================================================================

create table if not exists public.couples (
  id             uuid primary key default gen_random_uuid(),
  user1_id       uuid not null references auth.users(id) on delete cascade,
  user2_id       uuid references auth.users(id) on delete set null,
  user1_name     text not null,
  user2_name     text not null,
  start_date     date not null,
  couple_code    text not null unique,
  created_at     timestamptz not null default now()
);

create table if not exists public.profiles (
  id               uuid primary key references auth.users(id) on delete cascade,
  email            text not null,
  display_name     text not null,
  photo_url        text,
  couple_id        uuid references public.couples(id) on delete set null,
  couple_code      text,
  mood             mood_key,
  mood_message     text,
  mood_updated_at  timestamptz,
  created_at       timestamptz not null default now()
);

create table if not exists public.memories (
  id           uuid primary key default gen_random_uuid(),
  couple_id    uuid not null references public.couples(id) on delete cascade,
  created_by   uuid not null references public.profiles(id) on delete cascade,
  title        text not null,
  description  text,
  location     text,
  date         date not null,
  photos       text[] not null default '{}',
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create table if not exists public.comments (
  id                uuid primary key default gen_random_uuid(),
  memory_id         uuid not null references public.memories(id) on delete cascade,
  author_id         uuid not null references public.profiles(id) on delete cascade,
  author_name       text not null,
  author_photo_url  text,
  text              text not null,
  created_at        timestamptz not null default now()
);

-- ============================================================================
-- ÍNDICES
-- ============================================================================
create index if not exists idx_profiles_couple_id   on public.profiles(couple_id);
create index if not exists idx_memories_couple_id   on public.memories(couple_id, date desc);
create index if not exists idx_memories_created_by  on public.memories(created_by);
create index if not exists idx_comments_memory_id   on public.comments(memory_id, created_at);
create index if not exists idx_couples_code         on public.couples(couple_code);

-- ============================================================================
-- TRIGGER: crea profile al registrarse un usuario
-- ============================================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, display_name)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data->>'display_name', split_part(coalesce(new.email,''), '@', 1))
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================================
-- TRIGGER: updated_at automático
-- ============================================================================
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_memories_updated_at on public.memories;
create trigger trg_memories_updated_at
  before update on public.memories
  for each row execute function public.set_updated_at();

-- ============================================================================
-- REALTIME
-- ============================================================================
alter publication supabase_realtime add table public.profiles;
alter publication supabase_realtime add table public.memories;
alter publication supabase_realtime add table public.comments;
