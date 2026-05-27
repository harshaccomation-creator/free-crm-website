-- SalesFlow CRM pending signup patch
-- Run this in Supabase SQL Editor before using signup OTP APIs.

create table if not exists public.pending_signups (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  phone text not null,
  phone_normalized text,
  company_name text,
  otp_id uuid references public.otp_codes(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending','verified','expired','cancelled')),
  created_at timestamptz not null default now(),
  verified_at timestamptz
);

create or replace function public.set_pending_signup_normalized_fields()
returns trigger as $$
begin
  new.email := lower(trim(new.email));
  new.phone_normalized := public.normalize_phone(new.phone);
  return new;
end;
$$ language plpgsql;

drop trigger if exists pending_signups_set_normalized on public.pending_signups;
create trigger pending_signups_set_normalized before insert or update on public.pending_signups
for each row execute function public.set_pending_signup_normalized_fields();

create index if not exists idx_pending_signups_email_status on public.pending_signups(email, status, created_at desc);
create index if not exists idx_pending_signups_phone_status on public.pending_signups(phone_normalized, status, created_at desc);

alter table public.pending_signups enable row level security;

-- No public policies. Serverless APIs with service role manage this table.
