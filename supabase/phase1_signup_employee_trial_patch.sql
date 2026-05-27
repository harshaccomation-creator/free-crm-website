-- SalesFlow CRM Phase 1 signup patch
-- Run this in Supabase SQL Editor after the core schema.
-- Adds: employee signup fields, email OTP purpose, mobile duplicate prevention, trial account status.

-- Companies: normal signup user is employee, but every signup gets a trial workspace/account.
alter table public.companies add column if not exists admin_phone text;
alter table public.companies add column if not exists signup_user_id uuid references public.profiles(id) on delete set null;
alter table public.companies add column if not exists account_status text not null default 'trial' check (account_status in ('trial','active','expired','blocked','cancelled'));
alter table public.companies add column if not exists activated_by uuid references public.profiles(id) on delete set null;
alter table public.companies add column if not exists activated_at timestamptz;

-- Profiles: signup validation + email verification + mobile duplicate prevention.
alter table public.profiles add column if not exists phone_normalized text;
alter table public.profiles add column if not exists is_email_verified boolean not null default false;
alter table public.profiles add column if not exists email_verified_at timestamptz;
alter table public.profiles add column if not exists trial_started_at timestamptz;
alter table public.profiles add column if not exists trial_ends_at timestamptz;
alter table public.profiles add column if not exists signup_source text default 'website';

-- OTP purpose for login/signup separation.
alter table public.otp_codes add column if not exists purpose text not null default 'login' check (purpose in ('signup','login','password_reset'));
alter table public.otp_codes add column if not exists verified_at timestamptz;

-- Normalize profile mobile numbers.
create or replace function public.set_profile_normalized_fields()
returns trigger as $$
begin
  new.email := lower(trim(new.email));
  new.phone_normalized := public.normalize_phone(new.phone);
  return new;
end;
$$ language plpgsql;

drop trigger if exists profiles_set_normalized on public.profiles;
create trigger profiles_set_normalized before insert or update on public.profiles
for each row execute function public.set_profile_normalized_fields();

update public.profiles
set phone_normalized = public.normalize_phone(phone),
    email = lower(trim(email))
where phone_normalized is null or email <> lower(trim(email));

create unique index if not exists uniq_profiles_email on public.profiles(email);
create unique index if not exists uniq_profiles_phone_normalized
  on public.profiles(phone_normalized)
  where phone_normalized is not null;

create index if not exists idx_otp_email_purpose on public.otp_codes(email, purpose, created_at desc);
create index if not exists idx_companies_trial_status on public.companies(account_status, trial_ends_at);

-- Signup helper: account will be employee by default, not company admin.
create or replace function public.mark_signup_verified(profile_id uuid)
returns void as $$
begin
  update public.profiles
  set is_email_verified = true,
      email_verified_at = now(),
      role = 'employee',
      trial_started_at = coalesce(trial_started_at, now()),
      trial_ends_at = coalesce(trial_ends_at, now() + interval '7 days')
  where id = profile_id;
end;
$$ language plpgsql security definer set search_path = public;

-- Super admin can see all trial signups. Company/user can see own data through existing policies.
