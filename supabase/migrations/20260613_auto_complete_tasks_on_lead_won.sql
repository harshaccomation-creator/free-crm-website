-- Run this in Supabase SQL Editor on the live project.
-- Future logic only: when a lead is marked Won, all open tasks for that lead become Completed.

create or replace function public.salesflow_complete_open_tasks_for_lead(
  p_lead_id uuid,
  p_company_id uuid
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_lead_id is null or p_company_id is null then
    return;
  end if;

  update public.tasks
  set
    status = 'Completed',
    completed_at = coalesce(completed_at, now()),
    updated_at = now()
  where lead_id = p_lead_id
    and company_id = p_company_id
    and lower(coalesce(status, '')) <> 'completed';
end;
$$;

create or replace function public.salesflow_auto_complete_tasks_when_activity_won()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_text text;
begin
  v_text := lower(coalesce(new.type, '') || ' ' || coalesce(new.title, '') || ' ' || coalesce(new.note, ''));

  if v_text ~ '(^|[^a-z])won([^a-z]|$)' then
    perform public.salesflow_complete_open_tasks_for_lead(new.lead_id, new.company_id);
  end if;

  return new;
end;
$$;

drop trigger if exists salesflow_activity_won_complete_tasks_trigger on public.lead_activities;
create trigger salesflow_activity_won_complete_tasks_trigger
after insert or update of type, title, note on public.lead_activities
for each row
execute function public.salesflow_auto_complete_tasks_when_activity_won();

create or replace function public.salesflow_auto_complete_tasks_when_lead_won()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if lower(coalesce(new.status, '')) = 'won' then
    perform public.salesflow_complete_open_tasks_for_lead(new.id, new.company_id);
  end if;

  return new;
end;
$$;

drop trigger if exists salesflow_lead_won_complete_tasks_trigger on public.leads;
create trigger salesflow_lead_won_complete_tasks_trigger
after insert or update of status on public.leads
for each row
execute function public.salesflow_auto_complete_tasks_when_lead_won();
