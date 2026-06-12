-- Run this in Supabase SQL Editor on the live project.
-- Adds safe edit logic for lead activities and tasks.

-- Activity edit: update only the selected activity row.
create or replace function public.salesflow_edit_activity(
  p_activity_id uuid,
  p_title text default null,
  p_note text default null,
  p_activity_at timestamptz default null
)
returns public.lead_activities
language plpgsql
security definer
set search_path = public
as $$
declare
  v_profile public.profiles%rowtype;
  v_activity public.lead_activities%rowtype;
begin
  select * into v_profile
  from public.profiles
  where id = auth.uid();

  if v_profile.id is null then
    raise exception 'Profile not found';
  end if;

  select * into v_activity
  from public.lead_activities
  where id = p_activity_id
    and company_id = v_profile.company_id;

  if v_activity.id is null then
    raise exception 'Activity not found or permission denied';
  end if;

  update public.lead_activities
  set
    title = coalesce(nullif(trim(p_title), ''), title),
    note = case when p_note is null then note else nullif(trim(p_note), '') end,
    activity_at = coalesce(p_activity_at, activity_at),
    updated_at = now()
  where id = p_activity_id
    and company_id = v_profile.company_id
  returning * into v_activity;

  return v_activity;
end;
$$;

-- Task edit: update due time, duration and status safely.
create or replace function public.salesflow_edit_task(
  p_task_id uuid,
  p_title text default null,
  p_note text default null,
  p_due_at timestamptz default null,
  p_duration_minutes integer default null,
  p_status text default null
)
returns public.tasks
language plpgsql
security definer
set search_path = public
as $$
declare
  v_profile public.profiles%rowtype;
  v_task public.tasks%rowtype;
  v_status text;
begin
  select * into v_profile
  from public.profiles
  where id = auth.uid();

  if v_profile.id is null then
    raise exception 'Profile not found';
  end if;

  select * into v_task
  from public.tasks
  where id = p_task_id
    and company_id = v_profile.company_id;

  if v_task.id is null then
    raise exception 'Task not found or permission denied';
  end if;

  if lower(coalesce(v_profile.role, 'employee')) = 'employee' and v_task.owner_id <> v_profile.id then
    raise exception 'Employee can edit only assigned task';
  end if;

  v_status := coalesce(nullif(trim(p_status), ''), v_task.status);

  update public.tasks
  set
    title = coalesce(nullif(trim(p_title), ''), title),
    note = case when p_note is null then note else nullif(trim(p_note), '') end,
    due_at = coalesce(p_due_at, due_at),
    duration_minutes = case
      when p_duration_minutes in (15, 30, 45, 60, 90, 120) then p_duration_minutes
      else duration_minutes
    end,
    status = v_status,
    completed_at = case
      when lower(v_status) = 'completed' and completed_at is null then now()
      when lower(v_status) <> 'completed' then null
      else completed_at
    end,
    updated_at = now()
  where id = p_task_id
    and company_id = v_profile.company_id
  returning * into v_task;

  return v_task;
end;
$$;
