-- Base learner profile for a fresh m2clar installation.
create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  university_program text,
  created_at timestamptz not null default now()
);
alter table public.users enable row level security;
create policy "learners read own profile" on public.users for select using (auth.uid()=id);
create policy "learners insert own profile" on public.users for insert with check (auth.uid()=id);
create policy "learners update own profile" on public.users for update using (auth.uid()=id) with check (auth.uid()=id);
