-- SalesFlow CRM initial backend schema
-- Run this file in Supabase SQL Editor.

create extension if not exists "pgcrypto";

create table if not exists public.companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  plan text default 'free',
  created_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  company_id uuid references public.companies(id) on delete set null,
  full_name text not null,
  role text not null default 'employee' check (role in ('super_admin','admin','employee')),
  phone text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references public.companies(id) on delete cascade,
  owner_id uuid references public.profiles(id) on delete set null,
  name text not null,
  email text,
  phone text,
  company text,
  source text default 'Website',
  status text default 'New' check (status in ('New','Contacted','In Progress','Converted','Won','Lost')),
  priority text default 'Warm',
  job_title text,
  notes text,
  score integer default 60,
  value numeric default 0,
  next_follow_up timestamptz,
  last_activity_at timestamptz default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.lead_activities (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  company_id uuid references public.companies(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete set null,
  type text not null default 'call',
  title text not null,
  note text,
  activity_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references public.companies(id) on delete cascade,
  lead_id uuid references public.leads(id) on delete cascade,
  owner_id uuid references public.profiles(id) on delete set null,
  type text default 'Call',
  title text not null,
  note text,
  status text default 'Pending' check (status in ('Pending','Completed','Overdue')),
  due_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.lead_tags (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references public.companies(id) on delete cascade,
  lead_id uuid references public.leads(id) on delete cascade,
  name text not null,
  color text default 'blue',
  created_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at before update on public.profiles for each row execute function public.set_updated_at();

drop trigger if exists leads_updated_at on public.leads;
create trigger leads_updated_at before update on public.leads for each row execute function public.set_updated_at();

drop trigger if exists lead_activities_updated_at on public.lead_activities;
create trigger lead_activities_updated_at before update on public.lead_activities for each row execute function public.set_updated_at();

drop trigger if exists tasks_updated_at on public.tasks;
create trigger tasks_updated_at before update on public.tasks for each row execute function public.set_updated_at();

alter table public.companies enable row level security;
alter table public.profiles enable row level security;
alter table public.leads enable row level security;
alter table public.lead_activities enable row level security;
alter table public.tasks enable row level security;
alter table public.lead_tags enable row level security;

-- Development policies. Tighten these before production launch.
drop policy if exists "dev read companies" on public.companies;
create policy "dev read companies" on public.companies for select using (true);

drop policy if exists "dev manage profiles" on public.profiles;
create policy "dev manage profiles" on public.profiles for all using (true) with check (true);

drop policy if exists "dev manage leads" on public.leads;
create policy "dev manage leads" on public.leads for all using (true) with check (true);

drop policy if exists "dev manage activities" on public.lead_activities;
create policy "dev manage activities" on public.lead_activities for all using (true) with check (true);

drop policy if exists "dev manage tasks" on public.tasks;
create policy "dev manage tasks" on public.tasks for all using (true) with check (true);

drop policy if exists "dev manage tags" on public.lead_tags;
create policy "dev manage tags" on public.lead_tags for all using (true) with check (true);

insert into public.companies (id, name, plan)
values ('00000000-0000-0000-0000-000000000001', 'SalesFlow Demo Company', 'pro')
on conflict (id) do nothing;

insert into public.leads (company_id, name, email, phone, company, source, status, priority, job_title, score, value, next_follow_up)
values
('00000000-0000-0000-0000-000000000001', 'Rohan Mehta', 'rohan.mehta@techsolutions.com', '+91 98765 43210', 'Tech Solutions Pvt. Ltd.', 'Website', 'New', 'Hot', 'IT Manager', 85, 245000, now() + interval '2 days'),
('00000000-0000-0000-0000-000000000001', 'Priya Sharma', 'priya@innovatech.com', '+91 91234 56789', 'Innovatech Systems', 'Referral', 'Contacted', 'Warm', 'Founder', 72, 180000, now() + interval '1 day')
on conflict do nothing;
