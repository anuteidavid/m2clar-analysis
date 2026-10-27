-- University Analysis learning domain. Additive migration: preserves existing user data.
alter table public.users add column if not exists university_program text;

create table if not exists public.analysis_modules (
  id smallint primary key check (id between 0 and 19),
  title text not null,
  position smallint not null,
  editorial_status text not null default 'structure' check (editorial_status in ('draft','review','published','archived')),
  updated_at timestamptz not null default now()
);
create table if not exists public.analysis_units (
  id text primary key,
  module_id smallint not null references public.analysis_modules(id),
  title text not null,
  position smallint not null,
  difficulty text not null default 'introductory',
  estimated_minutes smallint,
  editorial_status text not null default 'structure' check (editorial_status in ('draft','review','published','archived')),
  current_version integer not null default 1,
  published_version integer,
  updated_at timestamptz not null default now(),
  unique(module_id, position)
);
create table if not exists public.analysis_unit_versions (
  unit_id text not null references public.analysis_units(id),
  version integer not null,
  content jsonb not null,
  editorial_status text not null default 'draft' check (editorial_status in ('draft','review','published','archived')),
  author_id uuid references auth.users(id),
  source text,
  created_at timestamptz not null default now(),
  primary key(unit_id, version)
);
alter table public.analysis_units add column if not exists published_version integer;
alter table public.analysis_unit_versions add column if not exists editorial_status text not null default 'draft' check (editorial_status in ('draft','review','published','archived'));
create table if not exists public.analysis_unit_prerequisites (
  unit_id text not null references public.analysis_units(id) on delete cascade,
  prerequisite_unit_id text not null references public.analysis_units(id),
  primary key(unit_id, prerequisite_unit_id),
  check(unit_id <> prerequisite_unit_id)
);
create or replace function public.reject_analysis_prerequisite_cycle() returns trigger language plpgsql as $$
declare has_cycle boolean;
begin
  with recursive chain(node) as (
    select new.prerequisite_unit_id
    union
    select p.prerequisite_unit_id from public.analysis_unit_prerequisites p join chain c on p.unit_id=c.node
  ) select exists(select 1 from chain where node=new.unit_id) into has_cycle;
  if has_cycle then raise exception 'Circular prerequisite dependency: % -> %', new.unit_id, new.prerequisite_unit_id; end if;
  return new;
end;
$$;
drop trigger if exists analysis_prerequisite_cycle_guard on public.analysis_unit_prerequisites;
create trigger analysis_prerequisite_cycle_guard before insert or update on public.analysis_unit_prerequisites for each row execute function public.reject_analysis_prerequisite_cycle();
create or replace function public.set_analysis_unit_prerequisites(target_unit text, required_units text[]) returns void language plpgsql as $$
begin
  if not public.is_analysis_admin() then raise exception 'Administrator role required'; end if;
  delete from public.analysis_unit_prerequisites where unit_id=target_unit;
  insert into public.analysis_unit_prerequisites(unit_id,prerequisite_unit_id)
    select target_unit, item.prerequisite_id from unnest(coalesce(required_units,'{}'::text[])) as item(prerequisite_id);
end;
$$;
create table if not exists public.analysis_competencies (
  id text primary key,
  title text not null,
  description text not null default ''
);
create table if not exists public.analysis_unit_competencies (
  unit_id text not null references public.analysis_units(id) on delete cascade,
  competency_id text not null references public.analysis_competencies(id),
  primary key(unit_id, competency_id)
);
create table if not exists public.analysis_programs (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  module_order smallint[] not null default '{}',
  enabled_extensions text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table if not exists public.analysis_program_units (
  program_id uuid not null references public.analysis_programs(id) on delete cascade,
  unit_id text not null references public.analysis_units(id),
  position integer not null,
  primary key(program_id, unit_id),
  unique(program_id, position)
);
create table if not exists public.analysis_attempts (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  unit_id text not null references public.analysis_units(id),
  content_version integer not null,
  activity_id text not null,
  answer jsonb not null,
  is_correct boolean,
  hint_level smallint not null default 0,
  used_solution boolean not null default false,
  difficulty text not null default 'introductory',
  competence text,
  created_at timestamptz not null default now(),
  foreign key(unit_id, content_version) references public.analysis_unit_versions(unit_id, version)
);
create table if not exists public.analysis_unit_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  unit_id text not null references public.analysis_units(id),
  state text not null default 'not_started' check (state in ('not_started','in_progress','assisted','independent','consolidated')),
  concept_score numeric,
  method_score numeric,
  method_selection_score numeric,
  justification_score numeric,
  resume_stage smallint not null default 0,
  updated_at timestamptz not null default now(),
  primary key(user_id, unit_id)
);
create table if not exists public.analysis_content_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  added_at timestamptz not null default now()
);

alter table public.analysis_modules enable row level security;
alter table public.analysis_units enable row level security;
alter table public.analysis_unit_versions enable row level security;
alter table public.analysis_unit_prerequisites enable row level security;
alter table public.analysis_competencies enable row level security;
alter table public.analysis_unit_competencies enable row level security;
alter table public.analysis_programs enable row level security;
alter table public.analysis_program_units enable row level security;
alter table public.analysis_attempts enable row level security;
alter table public.analysis_unit_progress enable row level security;
alter table public.analysis_content_admins enable row level security;

create or replace function public.is_analysis_admin() returns boolean language sql stable security definer set search_path=public as $$
  select exists(select 1 from public.analysis_content_admins where user_id=auth.uid());
$$;
create policy "published modules visible" on public.analysis_modules for select using (editorial_status='published' or public.is_analysis_admin());
create policy "admin edits modules" on public.analysis_modules for all using (public.is_analysis_admin()) with check (public.is_analysis_admin());
create policy "published units visible" on public.analysis_units for select using (editorial_status='published' or public.is_analysis_admin());
create policy "admin edits units" on public.analysis_units for all using (public.is_analysis_admin()) with check (public.is_analysis_admin());
create policy "published versions visible" on public.analysis_unit_versions for select using ((editorial_status='published' and exists(select 1 from public.analysis_units u where u.id=unit_id and u.published_version=version and u.editorial_status='published')) or public.is_analysis_admin());
create policy "admin edits versions" on public.analysis_unit_versions for all using (public.is_analysis_admin()) with check (public.is_analysis_admin());
create policy "prerequisites visible" on public.analysis_unit_prerequisites for select using (true);
create policy "admin edits prerequisites" on public.analysis_unit_prerequisites for all using (public.is_analysis_admin()) with check (public.is_analysis_admin());
create policy "competencies visible" on public.analysis_competencies for select using (true);
create policy "admin edits competencies" on public.analysis_competencies for all using (public.is_analysis_admin()) with check (public.is_analysis_admin());
create policy "unit competencies visible" on public.analysis_unit_competencies for select using (true);
create policy "admin edits unit competencies" on public.analysis_unit_competencies for all using (public.is_analysis_admin()) with check (public.is_analysis_admin());
create policy "owners manage programs" on public.analysis_programs for all using (auth.uid()=owner_id) with check (auth.uid()=owner_id);
create policy "owners manage program units" on public.analysis_program_units for all using (exists(select 1 from public.analysis_programs p where p.id=program_id and p.owner_id=auth.uid())) with check (exists(select 1 from public.analysis_programs p where p.id=program_id and p.owner_id=auth.uid()));
create policy "students read own attempts" on public.analysis_attempts for select using (auth.uid()=user_id or public.is_analysis_admin());
create policy "students add own attempts" on public.analysis_attempts for insert with check (auth.uid()=user_id);
create policy "students read own progress" on public.analysis_unit_progress for select using (auth.uid()=user_id or public.is_analysis_admin());
create policy "students update own progress" on public.analysis_unit_progress for insert with check (auth.uid()=user_id);
create policy "students maintain own progress" on public.analysis_unit_progress for update using (auth.uid()=user_id) with check (auth.uid()=user_id);
create policy "admin roster visible to self" on public.analysis_content_admins for select using (auth.uid()=user_id or public.is_analysis_admin());

-- Add the initial admin explicitly with the service role after creating the account:
-- insert into public.analysis_content_admins(user_id) values ('<auth.users UUID>');
