-- SalesFlow CRM pending signup patch
-- Run this in Supabase SQL Editor after signup employee trial patch.

create table if not exists public.pending_signups (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  phone text not null,
  phone_normalized text,
  company_name text,
  otp_id uuid references public.otp_codes(id) on delete set null,
  status text not null default 'pending' check (status in ('pending','verified','cancelled','expired')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.pending_signups enable row level security;

drop trigger if exists pending_signups_updated_at on public.pending_signups;
create trigger pending_signups_updated_at before update on public.pending_signups
for each row execute function public.set_updated_at();

create index if not exists idx_pending_signups_email_status on public.pending_signups(email, status, created_at desc);
create index if not exists idx_pending_signups_phone_status on public.pending_signups(phone_normalized, status);

-- No public policies: server APIs use service role.
