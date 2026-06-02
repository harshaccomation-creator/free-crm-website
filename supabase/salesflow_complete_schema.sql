-- SalesFlow CRM Complete Supabase Schema
-- Run this file in Supabase SQL Editor once per project.
-- Safe to re-run: uses IF NOT EXISTS and non-destructive policies/triggers where possible.

create extension if not exists "pgcrypto";

-- =====================================================
-- Helpers
-- =====================================================
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.current_profile_company_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select company_id from public.profiles where id = auth.uid()
$$;

create or replace function public.current_profile_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid()
$$;

create or replace function public.is_company_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce((select role in ('super_admin','company_admin','admin','manager') from public.profiles where id = auth.uid()), false)
$$;

-- =====================================================
-- Core SaaS tables
-- =====================================================
create table if not exists public.companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  phone text,
  website text,
  gst_number text,
  plan text not null default 'trial',
  plan_status text not null default 'trial' check (plan_status in ('trial','active','expired','cancelled','inactive')),
  trial_start_at timestamptz default now(),
  trial_ends_at timestamptz default (now() + interval '7 days'),
  max_users integer default 5,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  company_id uuid references public.companies(id) on delete set null,
  full_name text,
  email text,
  phone text,
  role text not null default 'employee' check (role in ('super_admin','company_admin','admin','manager','employee')),
  avatar_url text,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- =====================================================
-- CRM tables
-- =====================================================
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  created_by uuid references public.profiles(id) on delete set null,
  owner_id uuid references public.profiles(id) on delete set null,
  name text not null,
  email text,
  phone text,
  company text,
  job_title text,
  source text default 'Website',
  status text default 'New',
  priority text default 'Warm',
  score integer default 60,
  value numeric(14,2) default 0,
  notes text,
  location text,
  next_follow_up timestamptz,
  last_activity_at timestamptz,
  is_deleted boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.lead_activities (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  lead_id uuid not null references public.leads(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete set null,
  task_id uuid,
  type text default 'note',
  title text not null,
  note text,
  activity_at timestamptz default now(),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  lead_id uuid references public.leads(id) on delete cascade,
  created_by uuid references public.profiles(id) on delete set null,
  owner_id uuid references public.profiles(id) on delete set null,
  title text not null,
  note text,
  type text default 'Call',
  status text default 'Pending' check (status in ('Pending','In Progress','Completed','Cancelled','Overdue')),
  due_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  lead_id uuid references public.leads(id) on delete set null,
  recorded_by uuid references public.profiles(id) on delete set null,
  amount numeric(14,2) not null default 0,
  currency text default 'INR',
  status text default 'Pending' check (status in ('Pending','Paid','Failed','Refunded','Cancelled')),
  payment_method text,
  payment_date timestamptz,
  invoice_no text,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  lead_id uuid references public.leads(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete set null,
  title text,
  body text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  lead_id uuid references public.leads(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete set null,
  file_name text not null,
  file_url text,
  file_type text,
  file_size bigint,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  title text not null,
  body text,
  type text default 'info',
  is_read boolean default false,
  related_lead_id uuid references public.leads(id) on delete set null,
  created_at timestamptz default now()
);

create table if not exists public.email_history (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  lead_id uuid references public.leads(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete set null,
  to_email text,
  subject text,
  body text,
  status text default 'sent',
  sent_at timestamptz default now()
);

create table if not exists public.whatsapp_history (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  lead_id uuid references public.leads(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete set null,
  phone text,
  message text,
  status text default 'sent',
  sent_at timestamptz default now()
);

-- Add missing columns if older tables already exist
alter table public.lead_activities add column if not exists task_id uuid;
alter table public.leads add column if not exists last_activity_at timestamptz;
alter table public.leads add column if not exists score integer default 60;
alter table public.leads add column if not exists location text;
alter table public.leads add column if not exists job_title text;

-- Optional FK after tasks exists
alter table public.lead_activities
  drop constraint if exists lead_activities_task_id_fkey;
alter table public.lead_activities
  add constraint lead_activities_task_id_fkey foreign key (task_id) references public.tasks(id) on delete set null;

-- =====================================================
-- Triggers
-- =====================================================
drop trigger if exists companies_set_updated_at on public.companies;
create trigger companies_set_updated_at before update on public.companies for each row execute function public.set_updated_at();

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at before update on public.profiles for each row execute function public.set_updated_at();

drop trigger if exists leads_set_updated_at on public.leads;
create trigger leads_set_updated_at before update on public.leads for each row execute function public.set_updated_at();

drop trigger if exists lead_activities_set_updated_at on public.lead_activities;
create trigger lead_activities_set_updated_at before update on public.lead_activities for each row execute function public.set_updated_at();

drop trigger if exists tasks_set_updated_at on public.tasks;
create trigger tasks_set_updated_at before update on public.tasks for each row execute function public.set_updated_at();

drop trigger if exists payments_set_updated_at on public.payments;
create trigger payments_set_updated_at before update on public.payments for each row execute function public.set_updated_at();

create or replace function public.sync_lead_after_activity()
returns trigger
language plpgsql
as $$
declare
  next_status text;
  combined text;
begin
  combined := lower(coalesce(new.type,'') || ' ' || coalesce(new.title,'') || ' ' || coalesce(new.note,''));

  if combined like '%lost%' then next_status := 'Lost';
  elsif combined like '%won%' or combined like '%payment done%' or combined like '%payment received%' then next_status := 'Won';
  elsif combined like '%demo done%' or combined like '%demo completed%' or combined like '%completed%' or combined like '%done%' then next_status := 'Demo Done';
  elsif combined like '%not connected%' or combined like '%not pick%' or combined like '%dnp%' then next_status := 'Not Connected';
  elsif combined like '%demo scheduled%' or combined like '%scheduled%' then next_status := 'Demo Scheduled';
  elsif combined like '%follow%' then next_status := 'Follow-up';
  elsif combined like '%call%' or combined like '%contacted%' then next_status := 'Contacted';
  else next_status := null;
  end if;

  update public.leads
  set last_activity_at = coalesce(new.activity_at, now()),
      status = coalesce(next_status, status),
      updated_at = now()
  where id = new.lead_id;

  return new;
end;
$$;

drop trigger if exists lead_activity_sync_lead on public.lead_activities;
create trigger lead_activity_sync_lead after insert on public.lead_activities for each row execute function public.sync_lead_after_activity();

-- =====================================================
-- Indexes
-- =====================================================
create index if not exists idx_profiles_company_id on public.profiles(company_id);
create index if not exists idx_leads_company_id on public.leads(company_id);
create index if not exists idx_leads_owner_id on public.leads(owner_id);
create index if not exists idx_leads_status on public.leads(status);
create index if not exists idx_leads_next_follow_up on public.leads(next_follow_up);
create index if not exists idx_activities_lead_id on public.lead_activities(lead_id);
create index if not exists idx_activities_company_id on public.lead_activities(company_id);
create index if not exists idx_tasks_company_id on public.tasks(company_id);
create index if not exists idx_tasks_owner_id on public.tasks(owner_id);
create index if not exists idx_tasks_due_at on public.tasks(due_at);
create index if not exists idx_payments_company_id on public.payments(company_id);
create index if not exists idx_notifications_user_id on public.notifications(user_id);

-- =====================================================
-- RLS
-- =====================================================
alter table public.companies enable row level security;
alter table public.profiles enable row level security;
alter table public.leads enable row level security;
alter table public.lead_activities enable row level security;
alter table public.tasks enable row level security;
alter table public.payments enable row level security;
alter table public.notes enable row level security;
alter table public.documents enable row level security;
alter table public.notifications enable row level security;
alter table public.email_history enable row level security;
alter table public.whatsapp_history enable row level security;

-- Clean old SalesFlow policies so re-run remains predictable
do $$
declare
  r record;
begin
  for r in select schemaname, tablename, policyname from pg_policies where schemaname = 'public' and policyname like 'salesflow_%'
  loop
    execute format('drop policy if exists %I on %I.%I', r.policyname, r.schemaname, r.tablename);
  end loop;
end $$;

create policy salesflow_companies_select on public.companies for select using (id = public.current_profile_company_id() or public.current_profile_role() = 'super_admin');
create policy salesflow_companies_update on public.companies for update using (id = public.current_profile_company_id() and public.is_company_admin()) with check (id = public.current_profile_company_id() and public.is_company_admin());
create policy salesflow_companies_insert on public.companies for insert with check (auth.uid() is not null);

create policy salesflow_profiles_select on public.profiles for select using (company_id = public.current_profile_company_id() or id = auth.uid() or public.current_profile_role() = 'super_admin');
create policy salesflow_profiles_insert on public.profiles for insert with check (id = auth.uid() or public.is_company_admin() or public.current_profile_role() = 'super_admin');
create policy salesflow_profiles_update on public.profiles for update using (id = auth.uid() or (company_id = public.current_profile_company_id() and public.is_company_admin()) or public.current_profile_role() = 'super_admin') with check (id = auth.uid() or company_id = public.current_profile_company_id() or public.current_profile_role() = 'super_admin');

create policy salesflow_leads_select on public.leads for select using (company_id = public.current_profile_company_id() or public.current_profile_role() = 'super_admin');
create policy salesflow_leads_insert on public.leads for insert with check (company_id = public.current_profile_company_id() or public.current_profile_role() = 'super_admin');
create policy salesflow_leads_update on public.leads for update using (company_id = public.current_profile_company_id() or public.current_profile_role() = 'super_admin') with check (company_id = public.current_profile_company_id() or public.current_profile_role() = 'super_admin');
create policy salesflow_leads_delete on public.leads for delete using ((company_id = public.current_profile_company_id() and public.is_company_admin()) or public.current_profile_role() = 'super_admin');

create policy salesflow_activities_all on public.lead_activities for all using (company_id = public.current_profile_company_id() or public.current_profile_role() = 'super_admin') with check (company_id = public.current_profile_company_id() or public.current_profile_role() = 'super_admin');
create policy salesflow_tasks_all on public.tasks for all using (company_id = public.current_profile_company_id() or public.current_profile_role() = 'super_admin') with check (company_id = public.current_profile_company_id() or public.current_profile_role() = 'super_admin');
create policy salesflow_payments_all on public.payments for all using (company_id = public.current_profile_company_id() or public.current_profile_role() = 'super_admin') with check (company_id = public.current_profile_company_id() or public.current_profile_role() = 'super_admin');
create policy salesflow_notes_all on public.notes for all using (company_id = public.current_profile_company_id() or public.current_profile_role() = 'super_admin') with check (company_id = public.current_profile_company_id() or public.current_profile_role() = 'super_admin');
create policy salesflow_documents_all on public.documents for all using (company_id = public.current_profile_company_id() or public.current_profile_role() = 'super_admin') with check (company_id = public.current_profile_company_id() or public.current_profile_role() = 'super_admin');
create policy salesflow_email_history_all on public.email_history for all using (company_id = public.current_profile_company_id() or public.current_profile_role() = 'super_admin') with check (company_id = public.current_profile_company_id() or public.current_profile_role() = 'super_admin');
create policy salesflow_whatsapp_history_all on public.whatsapp_history for all using (company_id = public.current_profile_company_id() or public.current_profile_role() = 'super_admin') with check (company_id = public.current_profile_company_id() or public.current_profile_role() = 'super_admin');
create policy salesflow_notifications_select on public.notifications for select using (user_id = auth.uid() or company_id = public.current_profile_company_id() or public.current_profile_role() = 'super_admin');
create policy salesflow_notifications_update on public.notifications for update using (user_id = auth.uid() or company_id = public.current_profile_company_id() or public.current_profile_role() = 'super_admin') with check (user_id = auth.uid() or company_id = public.current_profile_company_id() or public.current_profile_role() = 'super_admin');
create policy salesflow_notifications_insert on public.notifications for insert with check (company_id = public.current_profile_company_id() or public.current_profile_role() = 'super_admin');

-- =====================================================
-- Setup helper: run after first login if profile/company missing
-- Replace values before running manually if needed.
-- =====================================================
-- insert into public.companies (name, email) values ('SalesFlow Demo Company', 'admin@example.com') returning id;
-- insert into public.profiles (id, company_id, full_name, email, role)
-- values (auth.uid(), '<company_id_here>', 'Admin User', 'admin@example.com', 'company_admin')
-- on conflict (id) do update set company_id = excluded.company_id, role = excluded.role, full_name = excluded.full_name;
