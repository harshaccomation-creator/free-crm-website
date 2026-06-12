import { requireBackend, supabase, isBackendConfigured } from '../lib/supabaseClient.js';

export { supabase, isBackendConfigured };

const FULL_LEAD_STATUSES = new Set([
  'New',
  'Contacted',
  'In Progress',
  'Qualified',
  'Proposal Sent',
  'Converted',
  'Won',
  'Lost',
  'Not Connected',
  'Demo Scheduled',
  'Demo Done',
  'Follow-up',
  'Post Demo Follow Up',
  'Junk',
  'Overdue',
]);

export function normalizeRole(role) {
  const value = String(role || 'employee').toLowerCase().replace(/[\s-]+/g, '_');
  if (value === 'company_admin' || value === 'admin') return 'company_admin';
  if (value === 'super_admin' || value === 'superadmin') return 'super_admin';
  if (value === 'manager') return 'manager';
  return 'employee';
}

export function normalizeSupabaseError(error, fallbackMessage = 'Something went wrong') {
  if (!error) return new Error(fallbackMessage);
  const message = String(error.message || error.details || fallbackMessage);
  if (message.includes('uniq_leads_company_phone') || message.toLowerCase().includes('duplicate key')) return new Error('This phone number already exists for another lead in this company. Use a different number or open the existing lead.');
  if (message.toLowerCase().includes('row-level security') || error.code === '42501') return new Error('You do not have permission to perform this action.');
  return new Error(message || fallbackMessage);
}

function handleError(error, fallbackMessage = 'Something went wrong') {
  if (error) {
    console.error('[SalesFlow CRM API]', error);
    throw normalizeSupabaseError(error, fallbackMessage);
  }
}

function isEmployee(profile) { return normalizeRole(profile?.role) === 'employee'; }
function profileName(profile) { return profile?.full_name || profile?.email || 'User'; }
function plusHours(hours) { return new Date(Date.now() + hours * 60 * 60 * 1000).toISOString(); }
function plusDays(days) { return new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString(); }
function isCompletedTask(task) { return String(task.status || '').toLowerCase() === 'completed' || Boolean(task.completed_at); }
function isOverdueTask(task) { return !isCompletedTask(task) && task.due_at && new Date(task.due_at).getTime() < Date.now(); }
function isWon(status) { return ['won', 'converted', 'demo done'].includes(String(status || '').toLowerCase()); }

function safePayloadStatus(status, fallback = 'New') {
  const raw = String(status || fallback || 'New').trim();
  if (FULL_LEAD_STATUSES.has(raw)) return raw;
  const key = raw.toLowerCase();
  if (key.includes('won') || key.includes('payment')) return 'Won';
  if (key.includes('lost')) return 'Lost';
  if (key.includes('junk')) return 'Junk';
  if (key.includes('not connected') || key.includes('not pick') || key.includes('dnp')) return 'Not Connected';
  if (key.includes('demo done')) return 'Demo Done';
  if (key.includes('post demo')) return 'Post Demo Follow Up';
  if (key.includes('demo')) return 'Demo Scheduled';
  if (key.includes('follow')) return 'Follow-up';
  if (key.includes('proposal')) return 'Proposal Sent';
  if (key.includes('qualif')) return 'Qualified';
  if (key.includes('progress')) return 'In Progress';
  if (key.includes('contact') || key.includes('call')) return 'Contacted';
  return 'New';
}

function statusKey(status = '') {
  const key = String(status || '').toLowerCase();
  if (key.includes('won') || key.includes('converted') || key.includes('demo done')) return 'Won';
  if (key.includes('lost') || key.includes('junk')) return 'Lost';
  if (key.includes('contact') || key.includes('not connected')) return 'Contacted';
  if (key.includes('progress') || key.includes('proposal') || key.includes('negotiation') || key.includes('demo') || key.includes('follow')) return 'In Progress';
  return 'New';
}

function activityText(activity = {}) {
  const type = String(activity.type || '').toLowerCase();
  return `${type} ${activity.title || ''} ${activity.note || activity.description || ''}`.toLowerCase();
}

function getActivityLeadStatus(activity = {}) {
  const type = String(activity.type || '').toLowerCase();
  const combined = activityText(activity);
  if (type === 'lead_created' || type === 'lead_updated' || type === 'task_created' || combined.includes('lead created')) return null;
  if (combined.includes('junk')) return 'Junk';
  if (combined.includes('lost')) return 'Lost';
  if (combined.includes('won') || combined.includes('payment done')) return 'Won';
  if (type === 'demo_done' || combined.includes('demo done')) return 'Demo Done';
  if (type === 'not_connected' || combined.includes('not connected') || combined.includes('not pick') || combined.includes('dnp')) return 'Not Connected';
  if (type === 'demo_scheduled' || combined.includes('demo scheduled') || combined.includes('book demo') || combined.includes('demo booked') || combined.includes('demo book')) return 'Demo Scheduled';
  if (type === 'post_demo_follow_up' || combined.includes('post demo')) return 'Post Demo Follow Up';
  if (type === 'follow_up' || combined.includes('follow')) return 'Follow-up';
  if (type === 'call_connected' || combined.includes('call connected') || combined.includes('connected') || type === 'call' || combined.includes('called') || combined.includes('contacted')) return 'Contacted';
  return null;
}

function getActivityScoreEvent(activity = {}) {
  const type = String(activity.type || '').toLowerCase();
  const combined = activityText(activity);
  if (type === 'lead_created' || type === 'lead_updated' || type === 'task_created' || combined.includes('lead created')) return null;
  if (combined.includes('not connected') || combined.includes('not pick') || combined.includes('dnp') || combined.includes('lost') || combined.includes('junk')) return null;
  if (combined.includes('won') || combined.includes('payment done')) return 'won';
  if (type === 'demo_done' || combined.includes('demo done')) return 'demo_done';
  if (type === 'demo_scheduled' || combined.includes('book demo') || combined.includes('demo booked') || combined.includes('demo scheduled') || combined.includes('demo book')) return 'demo_booked';
  if (type === 'call_connected' || combined.includes('call connected') || combined.includes('connected') || type === 'call' || combined.includes('called') || combined.includes('contacted')) return 'call_connected';
  return null;
}

function calculateLeadScoreFromActivities(activities = []) {
  const earned = new Set();
  activities.forEach((activity) => {
    const event = getActivityScoreEvent(activity);
    if (event) earned.add(event);
  });
  if (earned.has('won')) return 100;
  if (earned.has('demo_done')) return 65;
  if (earned.has('demo_booked')) return 35;
  if (earned.has('call_connected')) return 15;
  return 0;
}

function toDbLeadStatus(nextStatus) {
  return nextStatus ? safePayloadStatus(nextStatus, 'Contacted') : null;
}

function parseTaskDueAt(activity = {}) {
  const direct = activity.task_due_at || activity.taskDueAt;
  if (direct && !Number.isNaN(new Date(direct).getTime())) return new Date(direct).toISOString();
  const note = String(activity.note || '');
  const match = note.match(/Task Date Time:\s*([^\n]+)/i);
  if (!match) return null;
  const parsed = new Date(match[1].trim());
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
}

function autoTaskForActivity(activity, taskDueAt) {
  const type = String(activity.type || '').toLowerCase();
  const combined = activityText(activity);
  const dueAt = taskDueAt || parseTaskDueAt(activity);
  if (type === 'not_connected' || combined.includes('not connected') || combined.includes('not pick') || combined.includes('busy') || combined.includes('ringing')) return { title: 'Call again', type: 'Call', due_at: dueAt || plusHours(2) };
  if (type === 'demo_scheduled' || combined.includes('demo book') || combined.includes('demo scheduled') || combined.includes('demo booked')) return { title: 'Demo scheduled', type: 'Demo', due_at: dueAt || plusHours(2) };
  if (type === 'demo_done' || combined.includes('demo done')) return { title: 'Post demo follow up', type: 'Post Demo Follow Up', due_at: dueAt || plusDays(1) };
  if (type === 'post_demo_follow_up' || combined.includes('post demo')) return dueAt ? { title: 'Post demo follow up', type: 'Post Demo Follow Up', due_at: dueAt } : null;
  if (type === 'follow_up' || combined.includes('follow up')) return dueAt ? { title: 'Follow-up', type: 'Follow Up', due_at: dueAt } : null;
  if (type === 'call_connected' || combined.includes('call connected') || combined.includes('connected')) return dueAt ? { title: 'Follow-up call', type: 'Follow Up', due_at: dueAt } : null;
  return null;
}

async function insertActivityRow(client, record) {
  const { data, error } = await client.from('lead_activities').insert(record).select('*').single();
  handleError(error, 'Unable to create activity');
  return data || null;
}

async function createAutoTask(client, profile, leadId, task, leadOwnerId) {
  if (!task?.title || !task?.due_at) return null;
  const record = { company_id: profile.company_id, created_by: profile.id, owner_id: leadOwnerId || profile.id, lead_id: leadId, title: task.title, note: 'Auto task created from lead activity. Reminder should be sent 15 minutes before due time.', type: task.type, status: 'Pending', due_at: task.due_at };
  const { data, error } = await client.from('tasks').insert(record).select('*').single();
  if (error) { console.warn('[SalesFlow CRM API] auto task skipped', error); return null; }
  await insertActivityRow(client, { company_id: profile.company_id, lead_id: leadId, user_id: profile.id, type: 'task_created', title: `Task created - ${task.title}`, note: `Due: ${new Date(task.due_at).toLocaleString('en-IN')}\nReminder: 15 minutes before due time`, activity_at: new Date().toISOString() }).catch(() => null);
  return data;
}

async function refreshLeadScoreAndStatus(client, leadId, companyId, nextStatus = null) {
  const { data: activities, error } = await client.from('lead_activities').select('type, title, note, activity_at, created_at').eq('lead_id', leadId).eq('company_id', companyId).limit(1000);
  if (error) { console.warn('[SalesFlow CRM API] score refresh skipped', error); return; }
  const patch = { score: calculateLeadScoreFromActivities(activities || []), last_activity_at: new Date().toISOString(), updated_at: new Date().toISOString() };
  const dbStatus = toDbLeadStatus(nextStatus);
  if (dbStatus) patch.status = dbStatus;
  const { error: updateError } = await client.from('leads').update(patch).eq('id', leadId).eq('company_id', companyId);
  if (updateError) console.warn('[SalesFlow CRM API] score update skipped', updateError);
}

async function enrichLeadsWithActivityStatus(client, leads = []) {
  const ids = leads.map((lead) => lead.id).filter(Boolean);
  if (!ids.length) return leads;
  const { data, error } = await client.from('lead_activities').select('lead_id, type, title, note, activity_at, created_at').in('lead_id', ids).order('activity_at', { ascending: false }).limit(1000);
  if (error) return leads;
  const statusByLead = new Map();
  const activitiesByLead = new Map();
  (data || []).forEach((activity) => {
    if (!activitiesByLead.has(activity.lead_id)) activitiesByLead.set(activity.lead_id, []);
    activitiesByLead.get(activity.lead_id).push(activity);
    if (statusByLead.has(activity.lead_id)) return;
    const next = getActivityLeadStatus(activity);
    if (next) statusByLead.set(activity.lead_id, next);
  });
  return leads.map((lead) => {
    const activities = activitiesByLead.get(lead.id) || [];
    return { ...lead, score: calculateLeadScoreFromActivities(activities), status: statusByLead.has(lead.id) ? statusByLead.get(lead.id) : lead.status };
  });
}

export async function getCurrentUser() { const client = requireBackend(); const { data, error } = await client.auth.getUser(); handleError(error, 'Unable to read current user'); return data?.user || null; }
export async function getCurrentProfile() { const client = requireBackend(); const user = await getCurrentUser(); if (!user) return null; const { data, error } = await client.from('profiles').select('*').eq('id', user.id).maybeSingle(); handleError(error, 'Unable to load profile'); return data || null; }
export async function getCompanyUsers(companyId) { const client = requireBackend(); const { data, error } = await client.from('profiles').select('id, full_name, email, role, phone, is_active').eq('company_id', companyId).eq('is_active', true).order('full_name', { ascending: true }); handleError(error, 'Unable to load company users'); return data || []; }
export async function getSubscription(companyId) { const client = requireBackend(); const { data, error } = await client.from('companies').select('id, plan, plan_status, trial_start_at, trial_ends_at').eq('id', companyId).maybeSingle(); if (error && error.code !== 'PGRST116') handleError(error, 'Unable to load subscription'); return data ? { company_id: data.id, plan_name: data.plan || 'trial', status: data.plan_status || 'trial', trial_started_at: data.trial_start_at, trial_ends_at: data.trial_ends_at } : null; }
export function isSubscriptionActive(subscription) { if (!subscription) return false; if (subscription.status === 'active') return true; if (subscription.status === 'trial') return !subscription.trial_ends_at || new Date(subscription.trial_ends_at).getTime() >= Date.now(); return false; }

export async function listLeads({ status, assignedToMe = false, search = '', limit = 100 } = {}) { const client = requireBackend(); const profile = await getCurrentProfile(); if (!profile?.company_id) return []; let query = client.from('leads').select('*, owner:profiles!leads_owner_id_fkey(id, full_name, email, role)').eq('company_id', profile.company_id).eq('is_deleted', false).order('created_at', { ascending: false }).limit(limit); if (assignedToMe || isEmployee(profile)) query = query.eq('owner_id', profile.id); if (status) query = query.eq('status', safePayloadStatus(status, status)); if (search.trim()) { const value = `%${search.trim()}%`; query = query.or(`name.ilike.${value},company.ilike.${value},email.ilike.${value},phone.ilike.${value}`); } const { data, error } = await query; handleError(error, 'Unable to load leads'); return enrichLeadsWithActivityStatus(client, data || []); }
export async function listMyLeads(options = {}) { return listLeads({ ...options, assignedToMe: true }); }
export async function getLead(leadId) { const client = requireBackend(); const profile = await getCurrentProfile(); if (!profile?.company_id) return null; let query = client.from('leads').select('*, owner:profiles!leads_owner_id_fkey(id, full_name, email, role)').eq('id', leadId).eq('company_id', profile.company_id).maybeSingle(); if (isEmployee(profile)) query = query.eq('owner_id', profile.id); const { data, error } = await query; handleError(error, 'Unable to load lead'); if (!data) return null; const enriched = await enrichLeadsWithActivityStatus(client, [data]); return enriched[0] || data; }
export async function createLead(payload) { const client = requireBackend(); const profile = await getCurrentProfile(); if (!profile?.company_id) throw new Error('Profile company is missing. Logout karke dobara login karo ya profile company mapping check karo.'); const record = { company_id: profile.company_id, created_by: profile.id, owner_id: payload.owner_id || payload.assigned_to || profile.id, name: String(payload.name || '').trim(), email: payload.email ? String(payload.email).trim().toLowerCase() : null, phone: payload.phone ? String(payload.phone).trim() : null, company: payload.company || payload.company_name || null, source: payload.source || 'Website', status: safePayloadStatus(payload.status, 'New'), priority: payload.priority || 'Warm', score: 0, value: Number(payload.value || 0), notes: payload.notes || null, next_follow_up: payload.next_follow_up || payload.follow_up_at || null }; if (!record.name) throw new Error('Lead name is required.'); if (!record.phone) throw new Error('Phone number is required.'); const { data, error } = await client.from('leads').insert(record).select('*').single(); handleError(error, 'Unable to create lead'); try { await createActivity({ lead_id: data.id, type: 'lead_created', title: `Lead created by ${profileName(profile)}`, note: data.name }); } catch {} return { ...data, score: 0 }; }
export async function updateLead(leadId, payload) { const client = requireBackend(); const profile = await getCurrentProfile(); const oldLead = payload.owner_id || payload.assigned_to ? await getLead(leadId).catch(() => null) : null; const patch = { ...payload, updated_at: new Date().toISOString() }; if (Object.prototype.hasOwnProperty.call(patch, 'status')) patch.status = safePayloadStatus(patch.status, 'Contacted'); let query = client.from('leads').update(patch).eq('id', leadId).eq('company_id', profile.company_id); if (isEmployee(profile)) query = query.eq('owner_id', profile.id); const { data, error } = await query.select('*').single(); handleError(error, 'Unable to update lead'); const nextOwner = payload.owner_id || payload.assigned_to; if (nextOwner && oldLead?.owner_id !== nextOwner) { try { await createActivity({ lead_id: leadId, type: 'lead_assigned', title: `Lead assigned by ${profileName(profile)}`, note: `Assigned by ${profileName(profile)}` }); } catch {} } else { try { await createActivity({ lead_id: leadId, type: 'lead_updated', title: 'Lead updated', note: payload.status ? `Status: ${payload.status}` : null }); } catch {} } return data; }
export async function softDeleteLead(leadId) { return updateLead(leadId, { is_deleted: true }); }
export async function listTasks({ status, from, to, assignedToMe = false, limit = 100 } = {}) { const client = requireBackend(); const profile = await getCurrentProfile(); if (!profile?.company_id) return []; let query = client.from('tasks').select('*, lead:leads(id, name, company, phone), owner:profiles!tasks_owner_id_fkey(id, full_name, email)').eq('company_id', profile.company_id).order('due_at', { ascending: true }).limit(limit); if (assignedToMe || isEmployee(profile)) query = query.eq('owner_id', profile.id); if (status) query = query.eq('status', status); if (from) query = query.gte('due_at', from); if (to) query = query.lte('due_at', to); const { data, error } = await query; handleError(error, 'Unable to load tasks'); return data || []; }
export async function listMyTasks(options = {}) { return listTasks({ ...options, assignedToMe: true }); }
export async function createTask(payload) { const client = requireBackend(); const profile = await getCurrentProfile(); if (!profile?.company_id) throw new Error('Profile company is missing'); const record = { company_id: profile.company_id, created_by: profile.id, owner_id: payload.owner_id || payload.assigned_to || profile.id, lead_id: payload.lead_id || null, title: String(payload.title || '').trim(), note: payload.note || payload.description || null, type: payload.type || payload.task_type || 'Call', status: payload.status || 'Pending', due_at: payload.due_at || null }; if (!record.title) throw new Error('Task title is required.'); const { data, error } = await client.from('tasks').insert(record).select('*, lead:leads(id, name, company, phone)').single(); handleError(error, 'Unable to create task'); if (data.lead_id) { try { await createActivity({ lead_id: data.lead_id, type: 'task_created', title: 'Task created', note: data.title }); } catch {} } return data; }
export async function createMyTask(payload) { const profile = await getCurrentProfile(); return createTask({ ...payload, owner_id: profile?.id }); }
export async function updateTask(taskId, payload) { const client = requireBackend(); const profile = await getCurrentProfile(); const patch = { ...payload, updated_at: new Date().toISOString() }; if (payload.status === 'Completed' && !payload.completed_at) patch.completed_at = new Date().toISOString(); let query = client.from('tasks').update(patch).eq('id', taskId).eq('company_id', profile.company_id); if (isEmployee(profile)) query = query.eq('owner_id', profile.id); const { data, error } = await query.select('*, lead:leads(id, name, company, phone)').single(); handleError(error, 'Unable to update task'); return data; }
export async function listActivities({ leadId, limit = 100, assignedToMe = false } = {}) { const client = requireBackend(); const profile = await getCurrentProfile(); if (!profile?.company_id) return []; let query = client.from('lead_activities').select('*, lead:leads!inner(id, name, owner_id, company), user:profiles!lead_activities_user_id_fkey(id, full_name, email)').eq('company_id', profile.company_id).order('activity_at', { ascending: false }).limit(limit); if (leadId) query = query.eq('lead_id', leadId); if (assignedToMe || isEmployee(profile)) query = query.eq('lead.owner_id', profile.id); const { data, error } = await query; handleError(error, 'Unable to load activities'); return data || []; }
export async function listMyActivities(options = {}) { return listActivities({ ...options, assignedToMe: true }); }
export async function createActivity({ lead_id, type = 'note', title, note = null, activity_at = null, task_due_at = null }) { const client = requireBackend(); const profile = await getCurrentProfile(); if (!profile?.company_id || !lead_id) return null; const leadRow = await client.from('leads').select('id, owner_id').eq('id', lead_id).eq('company_id', profile.company_id).maybeSingle(); const record = { company_id: profile.company_id, lead_id, user_id: profile.id, type, title, note, activity_at: activity_at || new Date().toISOString() }; const data = await insertActivityRow(client, record); const nextStatus = getActivityLeadStatus(record); const task = autoTaskForActivity(record, task_due_at); if (task) await createAutoTask(client, profile, lead_id, task, leadRow.data?.owner_id || profile.id); await refreshLeadScoreAndStatus(client, lead_id, profile.company_id, nextStatus); return data || null; }
export async function listMyNotifications({ limit = 20 } = {}) { const client = requireBackend(); const profile = await getCurrentProfile(); if (!profile?.id) return []; const { data, error } = await client.from('notifications').select('*').eq('user_id', profile.id).order('created_at', { ascending: false }).limit(limit); if (error) { console.warn('[SalesFlow CRM API] notifications unavailable', error); return []; } return data || []; }
export async function markNotificationRead(id) { const client = requireBackend(); const profile = await getCurrentProfile(); const { data, error } = await client.from('notifications').update({ read_at: new Date().toISOString() }).eq('id', id).eq('user_id', profile.id).select('*').single(); handleError(error, 'Unable to mark notification read'); return data; }
export async function markAllNotificationsRead() { const client = requireBackend(); const profile = await getCurrentProfile(); const { error } = await client.from('notifications').update({ read_at: new Date().toISOString() }).eq('user_id', profile.id).is('read_at', null); handleError(error, 'Unable to mark notifications read'); return true; }
export async function createNotification(payload) { const client = requireBackend(); const profile = await getCurrentProfile(); const record = { company_id: profile.company_id, user_id: payload.user_id || profile.id, title: payload.title, message: payload.message || null, type: payload.type || 'info', related_lead_id: payload.related_lead_id || payload.lead_id || null }; const { data, error } = await client.from('notifications').insert(record).select('*').single(); if (error) return null; return data; }
export async function getMyDashboardSummary() { const [profile, leads, tasks, activities, notifications] = await Promise.all([getCurrentProfile(), listMyLeads({ limit: 1000 }), listMyTasks({ limit: 1000 }), listMyActivities({ limit: 200 }), listMyNotifications({ limit: 50 })]); const now = new Date(); const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()); const tomorrow = new Date(today.getTime() + 86400000); const todayFollowups = leads.filter((lead) => lead.next_follow_up && new Date(lead.next_follow_up) >= today && new Date(lead.next_follow_up) < tomorrow); const todayTasks = tasks.filter((task) => task.due_at && new Date(task.due_at) >= today && new Date(task.due_at) < tomorrow && !isCompletedTask(task)); const overdueLeads = leads.filter((lead) => lead.next_follow_up && new Date(lead.next_follow_up) < today && !isWon(lead.status) && String(lead.status).toLowerCase() !== 'lost'); const wonLeads = leads.filter((lead) => isWon(lead.status)); return { profile, leads, tasks, activities, notifications, assignedLeads: leads.length, todayFollowups: todayFollowups.length + todayTasks.length, wonLeads: wonLeads.length, overdueLeads: overdueLeads.length + tasks.filter(isOverdueTask).length, recentLeads: leads.slice(0, 6), followups: [...todayFollowups.map((lead) => ({ kind: 'lead', lead, title: lead.name, company: lead.company, time: lead.next_follow_up, status: lead.status })), ...todayTasks.map((task) => ({ kind: 'task', task, title: task.title, company: task.lead?.company || task.lead?.name || 'Task', time: task.due_at, status: task.type }))].sort((a,b) => new Date(a.time || 0) - new Date(b.time || 0)).slice(0, 6), unreadNotifications: notifications.filter((n) => !n.read_at).length, notifications }; }
export async function getReportsSummary({ from, to, mine = false } = {}) { const leads = mine ? await listMyLeads({ limit: 1000 }) : await listLeads({ limit: 1000 }); const tasks = mine ? await listMyTasks({ from, to, limit: 1000 }) : await listTasks({ from, to, limit: 1000 }); const won = leads.filter((lead) => isWon(lead.status)); const lost = leads.filter((lead) => statusKey(lead.status) === 'Lost'); const completed = tasks.filter(isCompletedTask); const overdue = tasks.filter(isOverdueTask); const revenueWon = won.reduce((sum, lead) => sum + Number(lead.value || 0), 0); return { totalLeads: leads.length, wonLeads: won.length, lostLeads: lost.length, conversionRate: leads.length ? Number(((won.length / leads.length) * 100).toFixed(1)) : 0, revenueWon, revenue: revenueWon, totalTasks: tasks.length, completedTasks: completed.length, overdueTasks: overdue.length, openTasks: tasks.length - completed.length, leads, tasks }; }
export async function getMyReportsSummary(options = {}) { return getReportsSummary({ ...options, mine: true }); }
