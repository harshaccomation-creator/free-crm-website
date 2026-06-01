import { requireBackend, supabase, isBackendConfigured } from '../lib/supabaseClient.js';

export { supabase, isBackendConfigured };

function handleError(error, fallbackMessage = 'Something went wrong') {
  if (error) {
    console.error('[SalesFlow CRM API]', error);
    throw new Error(error.message || fallbackMessage);
  }
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
    .select('*, companies(*)')
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
    .from('subscriptions')
    .select('*')
    .eq('company_id', companyId)
    .maybeSingle();

  if (error && error.code !== 'PGRST116') handleError(error, 'Unable to load subscription');
  return data || null;
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
  return data || [];
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
    .select('*, user:profiles(id, full_name, email)')
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
    type,
    title,
    note,
    activity_at: activity_at || new Date().toISOString(),
  };

  const { data, error } = await client.from('lead_activities').insert(record).select('*').single();
  if (error) console.warn('[SalesFlow CRM API] Activity insert failed', error);
  return data || null;
}

export async function getReportsSummary({ from, to } = {}) {
  const leads = await listLeads({ limit: 1000 });
  const tasks = await listTasks({ from, to, limit: 1000 });

  const wonLeads = leads.filter((lead) => ['Won', 'Converted', 'won'].includes(lead.status));
  const lostLeads = leads.filter((lead) => ['Lost', 'lost'].includes(lead.status));
  const completedTasks = tasks.filter((task) => task.status === 'Completed');
  const overdueTasks = tasks.filter((task) => task.status === 'Overdue' || (task.due_at && new Date(task.due_at) < new Date() && task.status !== 'Completed'));
  const revenueWon = wonLeads.reduce((sum, lead) => sum + Number(lead.value || 0), 0);
  const conversionRate = leads.length ? (wonLeads.length / leads.length) * 100 : 0;

  return {
    totalLeads: leads.length,
    wonLeads: wonLeads.length,
    lostLeads: lostLeads.length,
    conversionRate,
    revenueWon,
    totalTasks: tasks.length,
    completedTasks: completedTasks.length,
    overdueTasks: overdueTasks.length,
    leads,
    tasks,
  };
}
