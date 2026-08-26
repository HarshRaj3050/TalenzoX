create table if not exists public."user" (
  id uuid primary key default gen_random_uuid(),
  auth_uid uuid not null unique references auth.users(id) on delete cascade,
  name text,
  email text,
  "onGoingProcess" boolean not null default false,
  dob date,
  phone text,
  college text,
  status text,
  focus text,
  source text,
  invite_email text,
  created_at timestamptz not null default now()
);

alter table public."user" add column if not exists dob date;
alter table public."user" add column if not exists phone text;
alter table public."user" add column if not exists college text;
alter table public."user" add column if not exists status text;
alter table public."user" add column if not exists focus text;
alter table public."user" add column if not exists source text;
alter table public."user" add column if not exists invite_email text;

alter table public."user" enable row level security;

drop policy if exists "Users can manage their own profile" on public."user";
create policy "Users can manage their own profile"
  on public."user" for all
  using (auth.uid()::text = auth_uid)
  with check (auth.uid()::text = auth_uid);