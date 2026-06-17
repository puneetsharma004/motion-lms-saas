-- Motion Playground — Phase 3a schema.
-- Run this in the Supabase SQL editor (Dashboard → SQL → New query) once.

-- 1) One profile row per auth user. `is_pro` is the seam for paid gating later.
create table if not exists public.profiles (
  id         uuid primary key references auth.users (id) on delete cascade,
  email      text,
  is_pro     boolean not null default false,
  created_at timestamptz not null default now()
);

-- 2) Per-user lesson completion. (user_id, lesson_slug) is unique.
create table if not exists public.lesson_progress (
  user_id      uuid not null references auth.users (id) on delete cascade,
  lesson_slug  text not null,
  completed_at timestamptz not null default now(),
  primary key (user_id, lesson_slug)
);

-- 3) Row Level Security: every user sees/edits only their own rows.
alter table public.profiles        enable row level security;
alter table public.lesson_progress enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

drop policy if exists "progress_select_own" on public.lesson_progress;
create policy "progress_select_own" on public.lesson_progress
  for select using (auth.uid() = user_id);

drop policy if exists "progress_insert_own" on public.lesson_progress;
create policy "progress_insert_own" on public.lesson_progress
  for insert with check (auth.uid() = user_id);

drop policy if exists "progress_delete_own" on public.lesson_progress;
create policy "progress_delete_own" on public.lesson_progress
  for delete using (auth.uid() = user_id);

-- 4) Auto-create a profile when a user signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
