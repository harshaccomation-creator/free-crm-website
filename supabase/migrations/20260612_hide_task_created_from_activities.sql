-- Run this in Supabase SQL Editor on the live project.
-- Tasks will remain in public.tasks, but auto task-created rows will not appear in lead activity timeline.

-- Clean old auto task-created activity rows
delete from public.lead_activities
where type = 'task_created';

-- Prevent future task_created rows from being inserted into activity timeline
create or replace function public.skip_task_created_activity()
returns trigger
language plpgsql
as $$
begin
  if new.type = 'task_created' then
    return null;
  end if;

  return new;
end;
$$;

drop trigger if exists skip_task_created_activity_trigger on public.lead_activities;

create trigger skip_task_created_activity_trigger
before insert on public.lead_activities
for each row
execute function public.skip_task_created_activity();
