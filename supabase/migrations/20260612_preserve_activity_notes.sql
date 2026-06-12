-- Run this in Supabase SQL Editor on the live project.
-- This fixes notes disappearing when internal reminder/task lines are present.

-- Remove old/bad triggers that may null the whole note.
drop trigger if exists clean_lead_activity_internal_notes on public.lead_activities;
drop trigger if exists clean_task_internal_notes on public.tasks;
drop trigger if exists clean_lead_activity_notes_before_save on public.lead_activities;
drop trigger if exists clean_task_notes_before_save on public.tasks;

drop function if exists public.clean_crm_internal_notes();
drop function if exists public.clean_salesflow_notes_before_save();

-- Clean only internal system lines and keep the actual user note.
create or replace function public.clean_salesflow_note(input_note text)
returns text
language plpgsql
as $$
declare
  line text;
  cleaned text;
  output text := '';
begin
  if input_note is null then
    return null;
  end if;

  foreach line in array regexp_split_to_array(input_note, E'\n')
  loop
    cleaned := trim(line);

    if cleaned = '' then
      continue;
    end if;

    -- Hide internal/system lines only.
    if lower(cleaned) like 'disposition:%'
       or lower(cleaned) like 'sub disposition:%'
       or lower(cleaned) like 'task date time:%'
       or lower(cleaned) like 'reminder:%'
       or lower(cleaned) like 'due:%'
       or lower(cleaned) like '%auto task created%' then
      continue;
    end if;

    -- Keep actual user note, but remove the label.
    cleaned := regexp_replace(cleaned, '^note:\s*', '', 'i');

    if trim(cleaned) = '' then
      continue;
    end if;

    if output = '' then
      output := cleaned;
    else
      output := output || E'\n' || cleaned;
    end if;
  end loop;

  if trim(output) = '' then
    return null;
  end if;

  return trim(output);
end;
$$;

-- Clean existing notes safely.
update public.lead_activities
set note = public.clean_salesflow_note(note)
where note is not null;

update public.tasks
set note = public.clean_salesflow_note(note)
where note is not null;

-- Future notes: preserve user note, hide only internal lines.
create or replace function public.clean_salesflow_notes_before_save()
returns trigger
language plpgsql
as $$
begin
  new.note := public.clean_salesflow_note(new.note);
  return new;
end;
$$;

create trigger clean_lead_activity_notes_before_save
before insert or update on public.lead_activities
for each row execute function public.clean_salesflow_notes_before_save();

create trigger clean_task_notes_before_save
before insert or update on public.tasks
for each row execute function public.clean_salesflow_notes_before_save();
