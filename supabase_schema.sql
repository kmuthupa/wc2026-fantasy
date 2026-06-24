-- SQL Schema for WC2026 Fantasy League Persistence
-- Copy and paste this into the Supabase SQL Editor (https://supabase.com)

-- 1. Create the players table
create table if not exists public.players (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  passcode text not null default '1234',
  champion_pick text not null,
  picks jsonb not null default '{"r32": [], "r16": [], "qf": [], "sf": [], "final": ""}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Create the tournament_results table
create table if not exists public.tournament_results (
  id integer primary key default 1 check (id = 1),
  r32 jsonb not null default '[]'::jsonb,
  r16 jsonb not null default '[]'::jsonb,
  qf jsonb not null default '[]'::jsonb,
  sf jsonb not null default '[]'::jsonb,
  final text not null default '',
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Insert the initial empty tournament results row
insert into public.tournament_results (id, r32, r16, qf, sf, final)
values (1, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, '')
on conflict (id) do nothing;

-- 4. Enable Row Level Security (RLS)
alter table public.players enable row level security;
alter table public.tournament_results enable row level security;

-- 5. Create policies for public access (Read-only or Read/Write depending on setup)
-- Note: In a production app, you might restrict write access behind user authentication.
-- For a casual friendly league, we allow public read and write.

-- Policies for players table
create policy "Allow public read access to players"
  on public.players for select
  using (true);

create policy "Allow public insert to players"
  on public.players for insert
  with check (true);

create policy "Allow public update to players"
  on public.players for update
  using (true);

create policy "Allow public delete to players"
  on public.players for delete
  using (true);

-- Policies for tournament_results table
create policy "Allow public read access to tournament_results"
  on public.tournament_results for select
  using (true);

create policy "Allow public update to tournament_results"
  on public.tournament_results for update
  using (true);
