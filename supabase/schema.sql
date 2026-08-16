create table if not exists public.tournaments (
  id text primary key,
  name text not null,
  mode text not null,
  status text not null default 'REGISTRATION_OPEN',
  prize_pool integer not null default 0,
  entry_fee integer not null default 0,
  max_teams integer not null default 0,
  registered_teams integer not null default 0,
  starts_at timestamptz not null,
  registration_deadline timestamptz not null,
  maps text[] not null default '{}',
  phase text,
  accent text,
  media_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.tournaments add column if not exists media_url text;

create table if not exists public.teams (
  id text primary key,
  tournament_id text references public.tournaments(id) on delete cascade,
  name text not null,
  short_name text not null,
  region text not null,
  captain text not null,
  matches_played integer not null default 0,
  wwcd integer not null default 0,
  placement_points integer not null default 0,
  finishes integer not null default 0,
  penalty_points integer not null default 0,
  recent_form text[] not null default '{}',
  preferred_drop text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.matches (
  id text primary key,
  tournament_id text references public.tournaments(id) on delete cascade,
  name text not null,
  starts_at timestamptz not null,
  map text not null,
  status text not null default 'UPCOMING',
  group_name text not null default 'Group A',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.announcements (
  id text primary key,
  tournament_id text references public.tournaments(id) on delete cascade,
  category text not null,
  title text not null,
  body text not null,
  pinned boolean not null default false,
  publish_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.registration_submissions (
  id text primary key,
  tournament_id text references public.tournaments(id) on delete set null,
  team_name text not null,
  logo_file_name text,
  captain_name text not null,
  captain_email text not null,
  bgmi_uid text not null,
  players text[] not null default '{}',
  whatsapp text,
  discord text,
  payment_file_name text,
  status text not null default 'SUBMITTED',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.tournaments enable row level security;
alter table public.teams enable row level security;
alter table public.matches enable row level security;
alter table public.announcements enable row level security;
alter table public.registration_submissions enable row level security;

drop policy if exists "public read tournaments" on public.tournaments;
drop policy if exists "public read teams" on public.teams;
drop policy if exists "public read matches" on public.matches;
drop policy if exists "public read announcements" on public.announcements;
drop policy if exists "public insert registration submissions" on public.registration_submissions;
drop policy if exists "admin read registration submissions" on public.registration_submissions;
drop policy if exists "admin update registration submissions" on public.registration_submissions;
drop policy if exists "admin insert tournaments" on public.tournaments;
drop policy if exists "admin insert matches" on public.matches;
drop policy if exists "admin insert announcements" on public.announcements;

create policy "public read tournaments" on public.tournaments for select using (true);
create policy "public read teams" on public.teams for select using (true);
create policy "public read matches" on public.matches for select using (true);
create policy "public read announcements" on public.announcements for select using (true);
create policy "public insert registration submissions" on public.registration_submissions
  for insert with check (true);
create policy "admin read registration submissions" on public.registration_submissions
  for select using (true);
create policy "admin update registration submissions" on public.registration_submissions
  for update using (true) with check (true);
create policy "admin insert tournaments" on public.tournaments
  for insert with check (true);
create policy "admin insert matches" on public.matches
  for insert with check (true);
create policy "admin insert announcements" on public.announcements
  for insert with check (true);
