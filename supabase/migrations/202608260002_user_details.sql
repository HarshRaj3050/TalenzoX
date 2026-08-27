create table if not exists public."user_details" (
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

alter table public."user_details" enable row level security;

drop policy if exists "Users can manage their own profile" on public."user_details";
create policy "Users can manage their own profile"
  on public."user_details" for all
  using (auth.uid() = auth_uid)
  with check (auth.uid() = auth_uid);