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

export async function completeWonLeadTasks(leadId) {
  if (!leadId) return null;
  const { data: authData, error: authError } = await supabase.auth.getUser();
  throwIfError(authError, 'Unable to read login user');
  const userId = authData?.user?.id;
  if (!userId) return null;

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('company_id')
    .eq('id', userId)
    .maybeSingle();
  throwIfError(profileError, 'Unable to read profile');
  if (!profile?.company_id) return null;

  const { data, error } = await supabase.rpc('salesflow_complete_open_tasks_for_lead', {
    p_lead_id: leadId,
    p_company_id: profile.company_id,
  });
  throwIfError(error, 'Unable to complete lead tasks');
  return data;
}
