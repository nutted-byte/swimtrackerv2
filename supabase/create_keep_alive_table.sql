-- keep_alive: single-row heartbeat table for the GitHub Actions keep-alive.
--
-- Why: Supabase tracks the free-tier 7-day inactivity timer against actual
-- database WRITES, not HTTP/API reads. The keep-alive workflow
-- (.github/workflows/supabase-keepalive.yml) PATCHes this row's timestamp on a
-- schedule so the project is never auto-paused.
--
-- Run this once in the Supabase SQL editor for project wfifvskrqesbihwyhpkk.

create table if not exists public.keep_alive (
  id int primary key default 1,
  last_ping timestamptz not null default now(),
  constraint keep_alive_single_row check (id = 1)
);

insert into public.keep_alive (id) values (1)
  on conflict (id) do nothing;

alter table public.keep_alive enable row level security;

-- Allow the (public) anon key to UPDATE only the single heartbeat row.
-- The CHECK constraint + policy mean the row can't be created, deleted, or
-- multiplied via the API, so there is no abuse surface beyond overwriting a
-- timestamp.
drop policy if exists "anon can update heartbeat" on public.keep_alive;
create policy "anon can update heartbeat"
  on public.keep_alive
  for update
  to anon
  using (id = 1)
  with check (id = 1);
