# SalesFlow Hub — Super Admin Data Schema
# Supabase / PostgreSQL Table Definitions

## 1. companies
```sql
create table companies (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  email        text unique not null,
  country      text,
  owner_name   text,
  plan_id      uuid references plans(id),
  status       text check (status in ('Active','Trial','Suspended','Cancelled')) default 'Trial',
  trial_ends   timestamptz,
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);
```

## 2. users
```sql
create table users (
  id           uuid primary key default gen_random_uuid(),
  company_id   uuid references companies(id) on delete cascade,
  name         text not null,
  email        text unique not null,
  role         text check (role in ('Admin','Manager','Sales Rep')) default 'Sales Rep',
  status       text check (status in ('Active','Suspended','Invited')) default 'Active',
  last_login   timestamptz,
  created_at   timestamptz default now()
);
```

## 3. plans
```sql
create table plans (
  id               uuid primary key default gen_random_uuid(),
  name             text unique not null,
  price            numeric(10,2) not null,
  billing_cycle    text check (billing_cycle in ('Monthly','Yearly')) default 'Monthly',
  max_users        int default 5,
  max_leads        int default 500,
  features         jsonb default '[]',
  is_active        boolean default true,
  created_at       timestamptz default now()
);
```

## 4. subscriptions
```sql
create table subscriptions (
  id               uuid primary key default gen_random_uuid(),
  company_id       uuid references companies(id) on delete cascade,
  plan_id          uuid references plans(id),
  status           text check (status in ('Active','Trial','Suspended','Cancelled')) default 'Trial',
  mrr              numeric(10,2) default 0,
  start_date       date not null,
  next_billing     date,
  payment_method   text,
  stripe_sub_id    text,
  created_at       timestamptz default now(),
  updated_at       timestamptz default now()
);
```

## 5. demo_requests
```sql
create table demo_requests (
  id             uuid primary key default gen_random_uuid(),
  name           text not null,
  company        text not null,
  email          text not null,
  phone          text,
  plan_interest  text,
  status         text check (status in ('Pending','Scheduled','Completed','No-Show','Cancelled')) default 'Pending',
  notes          text,
  requested_at   timestamptz default now(),
  scheduled_at   timestamptz,
  assigned_to    uuid references users(id)
);
```

## 6. website_health_checks
```sql
create table website_health_checks (
  id             uuid primary key default gen_random_uuid(),
  service_name   text not null,
  status         text check (status in ('Operational','Degraded','Down')),
  latency_ms     int,
  uptime_pct     numeric(5,2),
  checked_at     timestamptz default now()
);
```

## 7. activity_logs
```sql
create table activity_logs (
  id           uuid primary key default gen_random_uuid(),
  type         text not null,
  action       text not null,
  user_id      uuid references users(id),
  company_id   uuid references companies(id),
  ip_address   text,
  severity     text check (severity in ('Info','Success','Warning','Error')) default 'Info',
  metadata     jsonb default '{}',
  created_at   timestamptz default now()
);
```

## 8. email_logs
```sql
create table email_logs (
  id           uuid primary key default gen_random_uuid(),
  to_email     text not null,
  subject      text not null,
  type         text not null,
  status       text check (status in ('Delivered','Failed','Bounced','Pending')) default 'Pending',
  sent_at      timestamptz default now(),
  opened_at    timestamptz,
  metadata     jsonb default '{}'
);
```

## 9. support_tickets
```sql
create table support_tickets (
  id           uuid primary key default gen_random_uuid(),
  subject      text not null,
  description  text,
  user_id      uuid references users(id),
  company_id   uuid references companies(id),
  category     text check (category in ('Bug','How-to','Billing','Account','Feature Request')),
  priority     text check (priority in ('Critical','High','Medium','Low')) default 'Medium',
  status       text check (status in ('Open','In Progress','Resolved','Closed')) default 'Open',
  assigned_to  uuid references users(id),
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);
```

## Row Level Security (RLS)
```sql
-- Enable RLS on all tables
alter table companies enable row level security;
alter table users enable row level security;
alter table subscriptions enable row level security;

-- Super Admin bypasses all RLS
create policy "super_admin_all" on companies for all to service_role using (true);
create policy "super_admin_all" on users for all to service_role using (true);
```

## API Endpoints (REST)

| Method | Endpoint                        | Description                    |
|--------|---------------------------------|--------------------------------|
| GET    | /api/super/dashboard            | Dashboard KPIs + charts data   |
| GET    | /api/super/companies            | List all companies              |
| GET    | /api/super/companies/:id        | Company details                |
| PATCH  | /api/super/companies/:id        | Update company                 |
| GET    | /api/super/users                | List all users                 |
| PATCH  | /api/super/users/:id/suspend    | Suspend user                   |
| GET    | /api/super/subscriptions        | List all subscriptions         |
| PATCH  | /api/super/subscriptions/:id    | Update subscription             |
| GET    | /api/super/plans                | List all plans                 |
| POST   | /api/super/plans                | Create plan                    |
| PATCH  | /api/super/plans/:id            | Update plan                    |
| GET    | /api/super/demo-requests        | List demo requests             |
| PATCH  | /api/super/demo-requests/:id    | Update demo request status     |
| GET    | /api/super/website-health       | Service health status          |
| GET    | /api/super/activity-logs        | Activity logs with filters     |
| GET    | /api/super/email-logs           | Email logs                     |
| GET    | /api/super/support-tickets      | Support tickets                |
| PATCH  | /api/super/support-tickets/:id  | Update ticket status           |
