-- OpenMaps waitlist. Run once in the Supabase SQL editor.
create extension if not exists pgcrypto;

create table if not exists public.openmaps_waitlist (
  id              uuid primary key default gen_random_uuid(),
  email           text not null,
  first_name      text,
  android_phone   text,
  city_state      text,
  alpha_interest  boolean not null default false,
  source          text not null default 'direct'
                  check (source in ('twitter', 'direct', 'other')),
  created_at      timestamptz not null default now()
);

-- Duplicate prevention: one row per email, case-insensitive.
create unique index if not exists openmaps_waitlist_email_key
  on public.openmaps_waitlist (lower(email));

-- Lock the table down. No policies = anon/authenticated keys can do nothing.
-- Only the server-side service-role key (bypasses RLS) writes to it.
alter table public.openmaps_waitlist enable row level security;

-- Belt and braces: the public API roles get no privileges at all.
revoke all on table public.openmaps_waitlist from anon, authenticated;
