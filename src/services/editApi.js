import { supabase, normalizeSupabaseError } from './crmApi.js';

function throwIfError(error, fallback) {
  if (error) throw normalizeSupabaseError(error, fallback);
}

export async function editLeadActivity({ activityId, title, note, activityAt }) {
  const { data, error } = await supabase.rpc('salesflow_edit_activity', {
    p_activity_id: activityId,
    p_title: title ?? null,
    p_note: note ?? null,
    p_activity_at: activityAt ?? null,
  });
  throwIfError(error, 'Activity edit failed');
  return data;
}

export async function editLeadTask({ taskId, title, note, dueAt, durationMinutes, status }) {
  const { data, error } = await supabase.rpc('salesflow_edit_task', {
    p_task_id: taskId,
    p_title: title ?? null,
    p_note: note ?? null,
    p_due_at: dueAt ?? null,
    p_duration_minutes: durationMinutes ? Number(durationMinutes) : null,
    p_status: status ?? null,
  });
  throwIfError(error, 'Task edit failed');
  return data;
}
