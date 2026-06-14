create table if not exists public.demo_requests (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  mobile text not null,
  company_name text not null,
  team_size text not null,
  requirement text not null,
  preferred_time text not null,
  status text not null default 'new',
  created_at timestamptz not null default now()
);

alter table public.demo_requests enable row level security;

drop policy if exists "Anyone can create demo requests" on public.demo_requests;
create policy "Anyone can create demo requests"
on public.demo_requests
for insert
to anon, authenticated
with check (true);

drop policy if exists "Authenticated users can read demo requests" on public.demo_requests;
create policy "Authenticated users can read demo requests"
on public.demo_requests
for select
to authenticated
using (true);
