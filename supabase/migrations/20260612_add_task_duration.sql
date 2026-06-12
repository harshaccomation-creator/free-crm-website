-- Run this in Supabase SQL Editor on the live project.
-- Adds actual task duration support.

alter table public.tasks
add column if not exists duration_minutes integer not null default 30;

alter table public.tasks
add constraint tasks_duration_minutes_check
check (duration_minutes in (15, 30, 45, 60, 90, 120));

update public.tasks
set duration_minutes = 30
where duration_minutes is null;
