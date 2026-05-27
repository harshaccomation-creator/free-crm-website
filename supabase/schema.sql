-- SalesFlow CRM Phase 1 backend schema
-- Run this file in Supabase SQL Editor.
-- Scope: OTP login support, 7 day trial, company-wise security, leads/tasks/activities, duplicate prevention,
-- soft delete audit, imports, overdue/monthly report logs.

create extension if not exists "pgcrypto";

-- =========================
-- Core tables
-- =========================

create table if not exists public.companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  admin_email text,
  plan_status text not null default 'trial' check (plan_status in ('trial','active','expired','cancelled')),
  trial_start_at timestamptz not null default now(),
  trial_ends_at timestamptz not null default (now() + interval '7 days'),
  plan text default 'free',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  company_id uuid references public.companies(id) on delete set null,
  full_name text not null,
  email text not null unique,
  role text not null default 'employee' check (role in ('super_admin','company_admin','admin','employee')),
  phone text,
  avatar_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.otp_codes (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  otp_hash text not null,
  expires_at timestamptz not null,
  is_used boolean not null default false,
  attempts integer not null default 0,
  sent_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  owner_id uuid references public.profiles(id) on delete set null,
  created_by uuid references public.profiles(id) on delete set null,
  name text not null,
  email text,
  email_normalized text generated always as (nullif(lower(trim(email)), '')) stored,
  phone text,
  phone_normalized text,
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
  is_deleted boolean not null default false,
  deleted_by uuid references public.profiles(id) on delete set null,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.lead_activities (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  company_id uuid not null references public.companies(id) on delete cascade,
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
  company_id uuid not null references public.companies(id) on delete cascade,
  lead_id uuid references public.leads(id) on delete cascade,
  owner_id uuid references public.profiles(id) on delete set null,
  created_by uuid references public.profiles(id) on delete set null,
  type text default 'Call',
  title text not null,
  note text,
  status text default 'Pending' check (status in ('Pending','Completed','Overdue')),
  due_at timestamptz,
  overdue_notified_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.lead_tags (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  lead_id uuid not null references public.leads(id) on delete cascade,
  name text not null,
  color text default 'blue',
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references public.companies(id) on delete set null,
  user_id uuid references public.profiles(id) on delete set null,
  action text not null,
  module text not null,
  record_id uuid,
  old_data jsonb,
  new_data jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.import_jobs (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  uploaded_by uuid references public.profiles(id) on delete set null,
  file_name text,
  total_rows integer default 0,
  imported_rows integer default 0,
  duplicate_rows integer default 0,
  invalid_rows integer default 0,
  status text default 'pending' check (status in ('pending','processing','completed','failed')),
  result jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.monthly_reports (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  month integer not null check (month between 1 and 12),
  year integer not null,
  sent_to text not null,
  status text default 'pending' check (status in ('pending','sent','failed')),
  report_data jsonb,
  sent_at timestamptz,
  created_at timestamptz not null default now()
);

-- =========================
-- Indexes / duplicate prevention
-- =========================

create index if not exists idx_profiles_company on public.profiles(company_id);
create index if not exists idx_leads_company on public.leads(company_id);
create index if not exists idx_leads_owner on public.leads(owner_id);
create index if not exists idx_leads_status on public.leads(company_id, status) where is_deleted = false;
create index if not exists idx_tasks_owner_due on public.tasks(owner_id, due_at);
create index if not exists idx_activities_lead on public.lead_activities(lead_id, activity_at desc);

create unique index if not exists uniq_leads_company_email
  on public.leads(company_id, email_normalized)
  where email_normalized is not null and is_deleted = false;

create unique index if not exists uniq_leads_company_phone
  on public.leads(company_id, phone_normalized)
  where phone_normalized is not null and is_deleted = false;

-- =========================
-- Helper functions
-- =========================

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create or replace function public.normalize_phone(raw_phone text)
returns text as $$
declare
  digits text;
begin
  digits := regexp_replace(coalesce(raw_phone, ''), '[^0-9]', '', 'g');
  if length(digits) = 0 then
    return null;
  end if;
  if length(digits) > 10 and left(digits, 2) = '91' then
    digits := right(digits, 10);
  end if;
  if length(digits) = 11 and left(digits, 1) = '0' then
    digits := right(digits, 10);
  end if;
  return digits;
end;
$$ language plpgsql immutable;

create or replace function public.set_lead_normalized_fields()
returns trigger as $$
begin
  new.phone_normalized := public.normalize_phone(new.phone);
  return new;
end;
$$ language plpgsql;

create or replace function public.current_profile()
returns public.profiles as $$
  select * from public.profiles where id = auth.uid() limit 1;
$$ language sql stable security definer set search_path = public;

create or replace function public.current_company_id()
returns uuid as $$
  select company_id from public.profiles where id = auth.uid() limit 1;
$$ language sql stable security definer set search_path = public;

create or replace function public.current_role()
returns text as $$
  select role from public.profiles where id = auth.uid() limit 1;
$$ language sql stable security definer set search_path = public;

create or replace function public.is_super_admin()
returns boolean as $$
  select coalesce(public.current_role() = 'super_admin', false);
$$ language sql stable security definer set search_path = public;

create or replace function public.is_company_admin()
returns boolean as $$
  select coalesce(public.current_role() in ('company_admin','admin'), false);
$$ language sql stable security definer set search_path = public;

create or replace function public.can_access_lead(lead_row public.leads)
returns boolean as $$
  select
    public.is_super_admin()
    or (
      lead_row.company_id = public.current_company_id()
      and (
        public.is_company_admin()
        or lead_row.owner_id = auth.uid()
        or lead_row.created_by = auth.uid()
      )
    );
$$ language sql stable security definer set search_path = public;

create or replace function public.prevent_unauthorized_lead_soft_delete()
returns trigger as $$
begin
  if old.is_deleted = false and new.is_deleted = true and not (public.is_company_admin() or public.is_super_admin()) then
    raise exception 'Only company admin can delete leads';
  end if;
  if old.is_deleted = false and new.is_deleted = true then
    new.deleted_at := coalesce(new.deleted_at, now());
    new.deleted_by := coalesce(new.deleted_by, auth.uid());
  end if;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

create or replace function public.audit_lead_delete()
returns trigger as $$
begin
  if old.is_deleted = false and new.is_deleted = true then
    insert into public.audit_logs(company_id, user_id, action, module, record_id, old_data, new_data)
    values (new.company_id, auth.uid(), 'soft_delete', 'leads', new.id, to_jsonb(old), to_jsonb(new));
  end if;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

-- =========================
-- Triggers
-- =========================

drop trigger if exists companies_updated_at on public.companies;
create trigger companies_updated_at before update on public.companies for each row execute function public.set_updated_at();

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at before update on public.profiles for each row execute function public.set_updated_at();

drop trigger if exists leads_set_normalized on public.leads;
create trigger leads_set_normalized before insert or update on public.leads for each row execute function public.set_lead_normalized_fields();

drop trigger if exists leads_prevent_soft_delete on public.leads;
create trigger leads_prevent_soft_delete before update on public.leads for each row execute function public.prevent_unauthorized_lead_soft_delete();

drop trigger if exists leads_updated_at on public.leads;
create trigger leads_updated_at before update on public.leads for each row execute function public.set_updated_at();

drop trigger if exists leads_audit_delete on public.leads;
create trigger leads_audit_delete after update on public.leads for each row execute function public.audit_lead_delete();

drop trigger if exists lead_activities_updated_at on public.lead_activities;
create trigger lead_activities_updated_at before update on public.lead_activities for each row execute function public.set_updated_at();

drop trigger if exists tasks_updated_at on public.tasks;
create trigger tasks_updated_at before update on public.tasks for each row execute function public.set_updated_at();

drop trigger if exists import_jobs_updated_at on public.import_jobs;
create trigger import_jobs_updated_at before update on public.import_jobs for each row execute function public.set_updated_at();

-- =========================
-- Row Level Security
-- =========================

alter table public.companies enable row level security;
alter table public.profiles enable row level security;
alter table public.otp_codes enable row level security;
alter table public.leads enable row level security;
alter table public.lead_activities enable row level security;
alter table public.tasks enable row level security;
alter table public.lead_tags enable row level security;
alter table public.audit_logs enable row level security;
alter table public.import_jobs enable row level security;
alter table public.monthly_reports enable row level security;

-- Remove old dev policies
drop policy if exists "dev read companies" on public.companies;
drop policy if exists "dev manage profiles" on public.profiles;
drop policy if exists "dev manage leads" on public.leads;
drop policy if exists "dev manage activities" on public.lead_activities;
drop policy if exists "dev manage tasks" on public.tasks;
drop policy if exists "dev manage tags" on public.lead_tags;

-- Companies
drop policy if exists "companies_select_scope" on public.companies;
create policy "companies_select_scope" on public.companies
for select using (public.is_super_admin() or id = public.current_company_id());

drop policy if exists "companies_update_scope" on public.companies;
create policy "companies_update_scope" on public.companies
for update using (public.is_super_admin() or (id = public.current_company_id() and public.is_company_admin()))
with check (public.is_super_admin() or (id = public.current_company_id() and public.is_company_admin()));

-- Profiles
drop policy if exists "profiles_select_scope" on public.profiles;
create policy "profiles_select_scope" on public.profiles
for select using (public.is_super_admin() or id = auth.uid() or (company_id = public.current_company_id() and public.is_company_admin()));

drop policy if exists "profiles_update_scope" on public.profiles;
create policy "profiles_update_scope" on public.profiles
for update using (public.is_super_admin() or id = auth.uid() or (company_id = public.current_company_id() and public.is_company_admin()))
with check (public.is_super_admin() or id = auth.uid() or (company_id = public.current_company_id() and public.is_company_admin()));

-- OTP table: no anon/user policy. Edge functions with service role manage it.

-- Leads
drop policy if exists "leads_select_scope" on public.leads;
create policy "leads_select_scope" on public.leads
for select using (is_deleted = false and public.can_access_lead(leads));

drop policy if exists "leads_insert_scope" on public.leads;
create policy "leads_insert_scope" on public.leads
for insert with check (
  public.is_super_admin()
  or (company_id = public.current_company_id() and (public.is_company_admin() or owner_id = auth.uid() or created_by = auth.uid()))
);

drop policy if exists "leads_update_scope" on public.leads;
create policy "leads_update_scope" on public.leads
for update using (public.can_access_lead(leads))
with check (public.can_access_lead(leads));

drop policy if exists "leads_delete_company_admin_only" on public.leads;
create policy "leads_delete_company_admin_only" on public.leads
for delete using (public.is_super_admin() or (company_id = public.current_company_id() and public.is_company_admin()));

-- Activities
drop policy if exists "activities_select_scope" on public.lead_activities;
create policy "activities_select_scope" on public.lead_activities
for select using (
  public.is_super_admin()
  or (company_id = public.current_company_id() and (public.is_company_admin() or user_id = auth.uid() or exists (
    select 1 from public.leads l where l.id = lead_id and public.can_access_lead(l)
  )))
);

drop policy if exists "activities_insert_scope" on public.lead_activities;
create policy "activities_insert_scope" on public.lead_activities
for insert with check (
  public.is_super_admin()
  or (company_id = public.current_company_id() and (public.is_company_admin() or user_id = auth.uid()))
);

drop policy if exists "activities_update_scope" on public.lead_activities;
create policy "activities_update_scope" on public.lead_activities
for update using (public.is_super_admin() or (company_id = public.current_company_id() and (public.is_company_admin() or user_id = auth.uid())))
with check (public.is_super_admin() or (company_id = public.current_company_id() and (public.is_company_admin() or user_id = auth.uid())));

-- Tasks
drop policy if exists "tasks_select_scope" on public.tasks;
create policy "tasks_select_scope" on public.tasks
for select using (public.is_super_admin() or (company_id = public.current_company_id() and (public.is_company_admin() or owner_id = auth.uid() or created_by = auth.uid())));

drop policy if exists "tasks_insert_scope" on public.tasks;
create policy "tasks_insert_scope" on public.tasks
for insert with check (public.is_super_admin() or (company_id = public.current_company_id() and (public.is_company_admin() or owner_id = auth.uid() or created_by = auth.uid())));

drop policy if exists "tasks_update_scope" on public.tasks;
create policy "tasks_update_scope" on public.tasks
for update using (public.is_super_admin() or (company_id = public.current_company_id() and (public.is_company_admin() or owner_id = auth.uid() or created_by = auth.uid())))
with check (public.is_super_admin() or (company_id = public.current_company_id() and (public.is_company_admin() or owner_id = auth.uid() or created_by = auth.uid())));

-- Tags
drop policy if exists "tags_select_scope" on public.lead_tags;
create policy "tags_select_scope" on public.lead_tags
for select using (public.is_super_admin() or (company_id = public.current_company_id() and (public.is_company_admin() or created_by = auth.uid())));

drop policy if exists "tags_manage_scope" on public.lead_tags;
create policy "tags_manage_scope" on public.lead_tags
for all using (public.is_super_admin() or (company_id = public.current_company_id() and (public.is_company_admin() or created_by = auth.uid())))
with check (public.is_super_admin() or (company_id = public.current_company_id() and (public.is_company_admin() or created_by = auth.uid())));

-- Audit logs
drop policy if exists "audit_select_scope" on public.audit_logs;
create policy "audit_select_scope" on public.audit_logs
for select using (public.is_super_admin() or (company_id = public.current_company_id() and public.is_company_admin()));

-- Import jobs: company admin only
drop policy if exists "imports_admin_scope" on public.import_jobs;
create policy "imports_admin_scope" on public.import_jobs
for all using (public.is_super_admin() or (company_id = public.current_company_id() and public.is_company_admin()))
with check (public.is_super_admin() or (company_id = public.current_company_id() and public.is_company_admin()));

-- Monthly reports: company admin only
drop policy if exists "monthly_reports_admin_scope" on public.monthly_reports;
create policy "monthly_reports_admin_scope" on public.monthly_reports
for select using (public.is_super_admin() or (company_id = public.current_company_id() and public.is_company_admin()));

-- =========================
-- Realtime publications
-- =========================

do $$
begin
  begin alter publication supabase_realtime add table public.leads; exception when duplicate_object then null; end;
  begin alter publication supabase_realtime add table public.lead_activities; exception when duplicate_object then null; end;
  begin alter publication supabase_realtime add table public.tasks; exception when duplicate_object then null; end;
  begin alter publication supabase_realtime add table public.lead_tags; exception when duplicate_object then null; end;
end $$;

-- =========================
-- Demo seed data
-- =========================

insert into public.companies (id, name, admin_email, plan_status, plan)
values ('00000000-0000-0000-0000-000000000001', 'SalesFlow Demo Company', 'admin@salesflowhub.com', 'active', 'pro')
on conflict (id) do nothing;

insert into public.leads (company_id, name, email, phone, company, source, status, priority, job_title, score, value, next_follow_up)
values
('00000000-0000-0000-0000-000000000001', 'Rohan Mehta', 'rohan.mehta@techsolutions.com', '+91 98765 43210', 'Tech Solutions Pvt. Ltd.', 'Website', 'New', 'Hot', 'IT Manager', 85, 245000, now() + interval '2 days'),
('00000000-0000-0000-0000-000000000001', 'Priya Sharma', 'priya@innovatech.com', '+91 91234 56789', 'Innovatech Systems', 'Referral', 'Contacted', 'Warm', 'Founder', 72, 180000, now() + interval '1 day')
on conflict do nothing;
