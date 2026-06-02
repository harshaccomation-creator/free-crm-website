import { getCurrentProfile, listLeads, listTasks, listActivities, listMyNotifications, markNotificationRead, markAllNotificationsRead, createTask, updateTask, supabase } from './crmApi.js';

function safeText(value, fallback = '-') { return value == null || value === '' ? fallback : String(value); }
function safeNumber(value) { return Number(value || 0) || 0; }
function role(profile) { return String(profile?.role || 'employee').toLowerCase(); }
function isAdmin(profile) { return ['company_admin', 'admin', 'super_admin'].includes(role(profile)); }
function isSuper(profile) { return role(profile) === 'super_admin'; }
function todayIsoStart() { const d = new Date(); d.setHours(0,0,0,0); return d.toISOString(); }

export async function getContactsSummary() {
  const leads = await listLeads({ limit: 1000 });
  const contacts = leads.map((lead) => ({
    id: lead.id,
    name: safeText(lead.name, 'Unnamed Contact'),
    email: safeText(lead.email),
    phone: safeText(lead.phone),
    company: safeText(lead.company),
    source: safeText(lead.source, 'Unknown'),
    status: safeText(lead.status, 'New'),
    owner: lead.owner?.full_name || 'Unassigned',
    lastActivity: lead.updated_at || lead.created_at,
  }));
  return { contacts, total: contacts.length, withEmail: contacts.filter(c => c.email !== '-').length, withPhone: contacts.filter(c => c.phone !== '-').length, active: contacts.filter(c => !['Lost', 'Junk'].includes(c.status)).length };
}

export async function getDealsPipeline() {
  const leads = await listLeads({ limit: 1000 });
  const stages = ['New', 'Contacted', 'In Progress', 'Demo Scheduled', 'Demo Done', 'Won', 'Lost'];
  const deals = leads.map((lead) => ({ id: lead.id, title: lead.name, company: lead.company || '-', value: safeNumber(lead.value), stage: stages.includes(lead.status) ? lead.status : 'New', owner: lead.owner?.full_name || 'Unassigned', source: lead.source || 'Unknown', nextFollowUp: lead.next_follow_up }));
  const grouped = stages.map((stage) => ({ stage, deals: deals.filter((deal) => deal.stage === stage), value: deals.filter((deal) => deal.stage === stage).reduce((sum, deal) => sum + deal.value, 0) }));
  return { stages: grouped, deals, totalValue: deals.reduce((sum, deal) => sum + deal.value, 0), wonValue: deals.filter(d => d.stage === 'Won' || d.stage === 'Demo Done').reduce((sum, deal) => sum + deal.value, 0) };
}

export async function getCompanyAdminSummary() {
  const profile = await getCurrentProfile();
  const [leads, tasks, activities, notifications] = await Promise.all([listLeads({ limit: 1000 }), listTasks({ limit: 1000 }), listActivities({ limit: 200 }), listMyNotifications({ limit: 50 })]);
  const users = profile?.company_id ? await getCompanyUsersForAdmin(profile.company_id) : [];
  return { profile, leads, tasks, activities, notifications, users, totalLeads: leads.length, openTasks: tasks.filter(t => t.status !== 'Completed').length, employees: users.filter(u => u.role === 'employee' || u.role === 'manager').length, overdue: tasks.filter(t => t.due_at && new Date(t.due_at) < new Date() && t.status !== 'Completed').length };
}

export async function getCompanyUsersForAdmin(companyId) {
  const profile = await getCurrentProfile();
  if (!isAdmin(profile) || (!isSuper(profile) && profile.company_id !== companyId)) return [];
  const { data, error } = await supabase.from('profiles').select('id, full_name, email, role, phone, is_active, created_at').eq('company_id', companyId).order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function getSuperAdminSummary() {
  const profile = await getCurrentProfile();
  if (!isSuper(profile)) throw new Error('Super admin access required.');
  const [companies, profiles] = await Promise.all([
    supabase.from('companies').select('id, name, email, plan, plan_status, created_at').order('created_at', { ascending: false }).limit(1000),
    supabase.from('profiles').select('id, full_name, email, role, company_id, is_active, created_at').order('created_at', { ascending: false }).limit(1000),
  ]);
  if (companies.error) throw companies.error;
  if (profiles.error) throw profiles.error;
  return { companies: companies.data || [], users: profiles.data || [], totalCompanies: companies.data?.length || 0, totalUsers: profiles.data?.length || 0, activeCompanies: (companies.data || []).filter(c => c.plan_status === 'active').length, trialCompanies: (companies.data || []).filter(c => c.plan === 'trial' || c.plan_status === 'trial').length };
}

export async function getSettingsData() {
  const profile = await getCurrentProfile();
  let company = null;
  if (profile?.company_id) {
    const { data } = await supabase.from('companies').select('id, name, email, plan, plan_status, trial_ends_at').eq('id', profile.company_id).maybeSingle();
    company = data || null;
  }
  return { profile, company };
}

export async function getAdminReportsData() {
  const [leads, tasks, activities] = await Promise.all([listLeads({ limit: 1000 }), listTasks({ limit: 1000 }), listActivities({ limit: 500 })]);
  const won = leads.filter(l => ['Won', 'Converted', 'Demo Done'].includes(l.status));
  const createdToday = leads.filter(l => l.created_at && l.created_at >= todayIsoStart());
  return { leads, tasks, activities, totalLeads: leads.length, wonLeads: won.length, conversionRate: leads.length ? Math.round((won.length / leads.length) * 100) : 0, newToday: createdToday.length, revenue: won.reduce((sum, lead) => sum + safeNumber(lead.value), 0) };
}

export { listTasks, listActivities, listMyNotifications, markNotificationRead, markAllNotificationsRead, createTask, updateTask };
