import { requireBackend, supabase, isBackendConfigured } from '../lib/supabaseClient.js';

export { supabase, isBackendConfigured };

function handleError(error, fallbackMessage = 'Something went wrong') {
  if (error) {
    console.error('[SalesFlow CRM API]', error);
    throw new Error(error.message || fallbackMessage);
  }
}

function getActivityLeadStatus(activity = {}) {
  const type = String(activity.type || '').toLowerCase();
  const title = String(activity.title || '').toLowerCase();
  const note = String(activity.note || activity.description || '').toLowerCase();
  const combined = `${type} ${title} ${note}`;

  if (type === 'lead_created' || type === 'lead_updated' || combined.includes('lead created') || combined.includes('lead captured')) return null;
  if (combined.includes('lost')) return 'Lost';
  if (combined.includes('won') || combined.includes('payment done') || combined.includes('payment received') || combined.includes('deal won')) return 'Won';
  if (type === 'demo_done' || combined.includes('demo done') || combined.includes('demo completed') || combined.includes('completed') || combined.includes('done')) return 'Demo Done';
  if (type === 'not_connected' || combined.includes('not connected') || combined.includes('not pick') || combined.includes('dnp')) return 'Not Connected';
  if (type === 'demo_scheduled' || combined.includes('demo scheduled') || combined.includes('scheduled')) return 'Demo Scheduled';
  if (type === 'follow_up' || combined.includes('follow')) return 'Follow-up';
  if (type === 'call' || combined.includes('called') || combined.includes('contacted')) return 'Contacted';
  return null;
}

async function enrichLeadsWithActivityStatus(client, leads = []) {
  if (!leads.length) return [];
  const ids = leads.map((lead) => lead.id).filter(Boolean);
  if (!ids.length) return leads;

  const { data, error } = await client
    .from('lead_activities')
    .select('lead_id, type, title, note, activity_at, created_at')
    .in('lead_id', ids)
    .order('activity_at', { ascending: false })
    .limit(1000);

  if (error) {
    console.warn('[SalesFlow CRM API] Activity status lookup failed', error);
    return leads;
  }

  const statusByLead = new Map();
  (data || []).forEach((activity) => {
    if (statusByLead.has(activity.lead_id)) return;
    const derivedStatus = getActivityLeadStatus(activity);
    if (derivedStatus) statusByLead.set(activity.lead_id, derivedStatus);
  });

  return leads.map((lead) => statusByLead.has(lead.id) ? { ...lead, status: statusByLead.get(lead.id) } : lead);
}

export async function getCurrentUser() {
  const client = requireBackend();
  const { data, error } = await client.auth.getUser();
  handleError(error, 'Unable to read current user');
  return data?.user || null;
}

export async function getCurrentProfile() {
  const client = requireBackend();
  const user = await getCurrentUser();
  if (!user) return null;

  const { data, error } = await client
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();

  handleError(error, 'Unable to load profile');
  return data || null;
}

export async function getCompanyUsers(companyId) {
  const client = requireBackend();
  const { data, error } = await client
    .from('profiles')
    .select('id, full_name, email, role, phone, is_active')
    .eq('company_id', companyId)
    .eq('is_active', true)
    .order('full_name', { ascending: true });

  handleError(error, 'Unable to load company users');
  return data || [];
}

export async function getSubscription(companyId) {
  const client = requireBackend();
  const { data, error } = await client
    .from('companies')
    .select('id, plan, plan_status, trial_start_at, trial_ends_at')
    .eq('id', companyId)
    .maybeSingle();

  if (error && error.code !== 'PGRST116') handleError(error, 'Unable to load subscription');
  return data ? {
    company_id: data.id,
    plan_name: data.plan || 'trial',
    status: data.plan_status || 'trial',
    trial_started_at: data.trial_start_at,
    trial_ends_at: data.trial_ends_at,
  } : null;
}

export function isSubscriptionActive(subscription) {
  if (!subscription) return false;
  if (subscription.status === 'active') return true;
  if (subscription.status === 'trial') {
    return !subscription.trial_ends_at || new Date(subscription.trial_ends_at).getTime() >= Date.now();
  }
  return false;
}

export async function listLeads({ status, assignedToMe = false, search = '', limit = 100 } = {}) {
  const client = requireBackend();
  const profile = await getCurrentProfile();
  if (!profile?.company_id) return [];

  let query = client
    .from('leads')
    .select('*, owner:profiles!leads_owner_id_fkey(id, full_name, email, role)')
    .eq('company_id', profile.company_id)
    .eq('is_deleted', false)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (status) query = query.eq('status', status);
  if (assignedToMe) query = query.eq('owner_id', profile.id);
  if (search.trim()) {
    const value = `%${search.trim()}%`;
    query = query.or(`name.ilike.${value},company.ilike.${value},email.ilike.${value},phone.ilike.${value}`);
  }

  const { data, error } = await query;
  handleError(error, 'Unable to load leads');
  return enrichLeadsWithActivityStatus(client, data || []);
}

export async function getLead(leadId) {
  const client = requireBackend();
  const { data, error } = await client
    .from('leads')
    .select('*, owner:profiles!leads_owner_id_fkey(id, full_name, email, role)')
    .eq('id', leadId)
    .maybeSingle();

  handleError(error, 'Unable to load lead');
  return data || null;
}

export async function createLead(payload) {
  const client = requireBackend();
  const profile = await getCurrentProfile();
  if (!profile?.company_id) throw new Error('Profile company is missing');

  const record = {
    company_id: profile.company_id,
    created_by: profile.id,
    owner_id: payload.owner_id || payload.assigned_to || profile.id,
    name: payload.name,
    email: payload.email || null,
    phone: payload.phone || null,
    company: payload.company || payload.company_name || null,
    source: payload.source || 'Website',
    status: payload.status || 'New',
    priority: payload.priority || 'Warm',
    value: Number(payload.value || 0),
    notes: payload.notes || null,
    next_follow_up: payload.next_follow_up || payload.follow_up_at || null,
  };

  const { data, error } = await client.from('leads').insert(record).select('*').single();
  handleError(error, 'Unable to create lead');
  await createActivity({ lead_id: data.id, type: 'lead_created', title: 'Lead created', note: data.name });
  return data;
}

export async function updateLead(leadId, payload) {
  const client = requireBackend();
  const { data, error } = await client
    .from('leads')
    .update({ ...payload, updated_at: new Date().toISOString() })
    .eq('id', leadId)
    .select('*')
    .single();

  handleError(error, 'Unable to update lead');
  await createActivity({ lead_id: leadId, type: 'lead_updated', title: 'Lead updated', note: payload.status ? `Status: ${payload.status}` : null });
  return data;
}

export async function softDeleteLead(leadId) {
  return updateLead(leadId, { is_deleted: true });
}

export async function listTasks({ status, from, to, assignedToMe = false, limit = 100 } = {}) {
  const client = requireBackend();
  const profile = await getCurrentProfile();
  if (!profile?.company_id) return [];

  let query = client
    .from('tasks')
    .select('*, lead:leads(id, name, company, phone), owner:profiles!tasks_owner_id_fkey(id, full_name, email)')
    .eq('company_id', profile.company_id)
    .order('due_at', { ascending: true })
    .limit(limit);

  if (status) query = query.eq('status', status);
  if (assignedToMe) query = query.eq('owner_id', profile.id);
  if (from) query = query.gte('due_at', from);
  if (to) query = query.lte('due_at', to);

  const { data, error } = await query;
  handleError(error, 'Unable to load tasks');
  return data || [];
}

export async function createTask(payload) {
  const client = requireBackend();
  const profile = await getCurrentProfile();
  if (!profile?.company_id) throw new Error('Profile company is missing');

  const record = {
    company_id: profile.company_id,
    created_by: profile.id,
    owner_id: payload.owner_id || payload.assigned_to || profile.id,
    lead_id: payload.lead_id || null,
    title: payload.title,
    note: payload.note || payload.description || null,
    type: payload.type || payload.task_type || 'Call',
    status: payload.status || 'Pending',
    due_at: payload.due_at || null,
  };

  const { data, error } = await client.from('tasks').insert(record).select('*').single();
  handleError(error, 'Unable to create task');
  if (data.lead_id) await createActivity({ lead_id: data.lead_id, task_id: data.id, type: 'task_created', title: 'Task created', note: data.title });
  return data;
}

export async function updateTask(taskId, payload) {
  const client = requireBackend();
  const patch = { ...payload, updated_at: new Date().toISOString() };
  if (payload.status === 'Completed' && !payload.completed_at) patch.completed_at = new Date().toISOString();

  const { data, error } = await client
    .from('tasks')
    .update(patch)
    .eq('id', taskId)
    .select('*')
    .single();

  handleError(error, 'Unable to update task');
  return data;
}

export async function listActivities({ leadId, limit = 100 } = {}) {
  const client = requireBackend();
  const profile = await getCurrentProfile();
  if (!profile?.company_id) return [];

  let query = client
    .from('lead_activities')
    .select('*, user:profiles!lead_activities_user_id_fkey(id, full_name, email)')
    .eq('company_id', profile.company_id)
    .order('activity_at', { ascending: false })
    .limit(limit);

  if (leadId) query = query.eq('lead_id', leadId);

  const { data, error } = await query;
  handleError(error, 'Unable to load activities');
  return data || [];
}

export async function createActivity({ lead_id, task_id = null, type = 'note', title, note = null, activity_at = null }) {
  const client = requireBackend();
  const profile = await getCurrentProfile();
  if (!profile?.company_id || !lead_id) return null;

  const record = {
    company_id: profile.company_id,
    lead_id,
    user_id: profile.id,
    task_id,
    type,
    title,
    note,
    activity_at: activity_at || new Date().toISOString(),
  };

  const { data, error } = await client.from('lead_activities').insert(record).select('*').single();
  if (error) console.warn('[SalesFlow CRM API] Activity insert failed', error);

  const nextStatus = getActivityLeadStatus(record);
  if (nextStatus) {
    const { error: leadError } = await client
      .from('leads')
      .update({ status: nextStatus, last_activity_at: record.activity_at, updated_at: new Date().toISOString() })
      .eq('id', lead_id);
    if (leadError) console.warn('[SalesFlow CRM API] Lead status update failed', leadError);
  }

  return data || null;
}

export async function getReportsSummary({ from, to } = {}) {
  const leads = await listLeads({ limit: 1000 });
  const tasks = await listTasks({ from, to, limit: 1000 });

  const wonLeads = leads.filter((lead) => ['Won', 'Converted', 'won'].includes(lead.status));
  const revenue = wonLeads.reduce((sum, lead) => sum + Number(lead.value || 0), 0);
  const pendingTasks = tasks.filter((task) => task.status !== 'Completed');
  const overdueTasks = pendingTasks.filter((task) => task.due_at && new Date(task.due_at).getTime() < Date.now());

  return {
    totalLeads: leads.length,
    wonLeads: wonLeads.length,
    openTasks: pendingTasks.length,
    overdueTasks: overdueTasks.length,
    revenue,
    conversionRate: leads.length ? Math.round((wonLeads.length / leads.length) * 100) : 0,
  };
}
