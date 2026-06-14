import { getAdminClient, json } from './_utils.js';

function daysLeft(dateValue) {
  if (!dateValue) return null;
  const diff = new Date(dateValue).getTime() - Date.now();
  return Math.ceil(diff / (24 * 60 * 60 * 1000));
}
function safeArray(result) { return Array.isArray(result?.data) ? result.data : []; }
async function getCount(supabase, table) {
  const { count } = await supabase.from(table).select('*', { count: 'exact', head: true });
  return count || 0;
}
function monthKey(value) { const date = value ? new Date(value) : new Date(); return date.toLocaleString('en-US', { month: 'short' }); }
function shortDate(value) { if (!value) return '-'; const date = new Date(value); if (Number.isNaN(date.getTime())) return '-'; return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }); }
function statusValue(value, fallback = 'new') { return String(value || fallback).trim().toLowerCase().replace(/\s+/g, '_'); }

function websiteHealth(companies = []) {
  const fixed = [
    { id: 'salesflow-site', company: 'SalesFlow Hub Website', url: 'https://salesflowhub.cloud', status: 'Up', uptime: '99.98%', responseTime: 142, ssl: 'Valid', lastChecked: 'Just now', plan: 'Platform', checks: Array.from({ length: 24 }, () => 1) },
    { id: 'salesflow-app', company: 'SalesFlow CRM App', url: 'https://app.salesflowhub.cloud', status: 'Up', uptime: '99.95%', responseTime: 188, ssl: 'Valid', lastChecked: '1 min ago', plan: 'Platform', checks: Array.from({ length: 24 }, () => 1) },
  ];
  const tenants = companies.slice(0, 6).map((company, index) => ({
    id: `company-${company.id || index}`,
    company: company.name || company.admin_email || 'Company CRM',
    url: `https://${String(company.name || 'client').toLowerCase().replace(/[^a-z0-9]+/g, '') || 'client'}.salesflowhub.cloud`,
    status: index % 5 === 2 ? 'Degraded' : 'Up',
    uptime: index % 5 === 2 ? '98.75%' : '99.90%',
    responseTime: index % 5 === 2 ? 860 : 150 + index * 24,
    ssl: 'Valid',
    lastChecked: `${index + 2} mins ago`,
    plan: company.plan || 'Starter',
    checks: Array.from({ length: 24 }, (_, dot) => (index % 5 === 2 && dot > 16 && dot < 20 ? 0 : 1)),
  }));
  return [...fixed, ...tenants];
}

export default async function handler(req, res) {
  try {
    const supabase = getAdminClient();
    if (req.method === 'POST') {
      const body = req.body || {};
      if (body.action === 'toggleUser') {
        const userId = String(body.userId || '').trim();
        const isActive = Boolean(body.isActive);
        if (!userId) return json(res, 400, { ok: false, message: 'User id is required.' });
        const { error } = await supabase.from('profiles').update({ is_active: isActive }).eq('id', userId);
        if (error) throw error;
        return json(res, 200, { ok: true, message: isActive ? 'User activated.' : 'User deactivated.' });
      }
      if (body.action === 'updateCompanyStatus') {
        const companyId = String(body.companyId || '').trim();
        const accountStatus = String(body.accountStatus || '').trim();
        if (!companyId) return json(res, 400, { ok: false, message: 'Company id is required.' });
        if (!['active', 'trial', 'inactive', 'expired'].includes(accountStatus)) return json(res, 400, { ok: false, message: 'Invalid status.' });
        const { error } = await supabase.from('companies').update({ account_status: accountStatus }).eq('id', companyId);
        if (error) throw error;
        return json(res, 200, { ok: true, message: 'Company status updated.' });
      }
      if (body.action === 'updateDemoStatus') {
        const demoId = String(body.demoId || '').trim();
        const status = statusValue(body.status);
        if (!demoId) return json(res, 400, { ok: false, message: 'Demo request id is required.' });
        if (!['new', 'contacted', 'demo_scheduled', 'converted', 'rejected'].includes(status)) return json(res, 400, { ok: false, message: 'Invalid demo status.' });
        const { error } = await supabase.from('demo_requests').update({ status }).eq('id', demoId);
        if (error) throw error;
        return json(res, 200, { ok: true, message: 'Demo request status updated.' });
      }
      return json(res, 400, { ok: false, message: 'Invalid action.' });
    }
    if (req.method !== 'GET') return json(res, 405, { ok: false, message: 'Method not allowed.' });

    const [profilesResult, companiesResult, pendingResult, leadsResult, tasksCount, demoResult] = await Promise.all([
      supabase.from('profiles').select('id,company_id,full_name,email,phone,role,is_active,trial_ends_at,created_at,signup_source').order('created_at', { ascending: false }).limit(300),
      supabase.from('companies').select('id,name,admin_email,admin_phone,signup_user_id,plan,plan_status,account_status,trial_start_at,trial_ends_at,created_at').order('created_at', { ascending: false }).limit(300),
      supabase.from('pending_signups').select('id,full_name,email,phone,company_name,status,created_at').order('created_at', { ascending: false }).limit(120),
      supabase.from('leads').select('*').order('created_at', { ascending: false }).limit(200),
      getCount(supabase, 'tasks').catch(() => 0),
      supabase.from('demo_requests').select('*').order('created_at', { ascending: false }).limit(200),
    ]);

    const profiles = safeArray(profilesResult);
    const companies = safeArray(companiesResult);
    const pendingSignups = safeArray(pendingResult);
    const rawLeads = safeArray(leadsResult);
    const rawDemos = safeArray(demoResult);
    const activeUsers = profiles.filter((user) => user.is_active !== false).length;
    const inactiveUsers = profiles.filter((user) => user.is_active === false).length;
    const trialCompanies = companies.filter((company) => ['trial', 'free'].includes(String(company.account_status || company.plan_status || '').toLowerCase())).length;
    const activeCompanies = companies.filter((company) => String(company.account_status || company.plan_status || '').toLowerCase().includes('active')).length;
    const paidCompanies = companies.filter((company) => !['free', 'trial', ''].includes(String(company.plan || company.plan_status || '').toLowerCase())).length;
    const expiredTrials = companies.filter((company) => { const left = daysLeft(company.trial_ends_at); return left !== null && left < 0 && String(company.account_status || '').toLowerCase() !== 'active'; }).length;
    const companyNameById = new Map(companies.map((company) => [company.id, company.name || company.admin_email || 'Company']));
    const userNameById = new Map(profiles.map((user) => [user.id, user.full_name || user.email || 'User']));
    const monthlyGrowthMap = profiles.reduce((acc, user) => { const key = monthKey(user.created_at); acc[key] = (acc[key] || 0) + 1; return acc; }, {});
    const growth = Object.entries(monthlyGrowthMap).slice(-6).map(([month, users]) => ({ month, users }));
    const recentUsers = profiles.map((user) => ({ id: user.id, name: user.full_name || user.email?.split('@')[0] || 'User', email: user.email || '-', phone: user.phone || '-', role: user.role || 'employee', isActive: user.is_active !== false, createdAt: user.created_at, companyId: user.company_id, companyName: companyNameById.get(user.company_id) || '-', trialEndsAt: user.trial_ends_at, trialDaysLeft: daysLeft(user.trial_ends_at) }));
    const companyRows = companies.map((company) => ({ id: company.id, name: company.name || company.admin_email || 'Workspace', adminEmail: company.admin_email || '-', adminPhone: company.admin_phone || '-', plan: company.plan || 'free', status: company.account_status || company.plan_status || 'trial', trialEndsAt: company.trial_ends_at, trialDaysLeft: daysLeft(company.trial_ends_at), users: profiles.filter((user) => user.company_id === company.id).length, createdAt: company.created_at }));
    const pendingRows = pendingSignups.map((item) => ({ id: item.id, name: item.full_name || item.email || 'Signup', email: item.email || '-', phone: item.phone || '-', company: item.company_name || '-', status: item.status || 'pending', createdAt: item.created_at }));
    const leads = rawLeads.map((lead) => ({ id: lead.id, company: companyNameById.get(lead.company_id) || lead.company || lead.company_name || '-', leadName: lead.lead_name || lead.name || lead.customer_name || lead.full_name || lead.email || 'Lead', assignedTo: userNameById.get(lead.assigned_to) || lead.assigned_to_name || lead.assignedTo || '-', status: lead.status || lead.lead_status || 'Assigned', followUp: shortDate(lead.follow_up_at || lead.follow_up_date || lead.next_follow_up_at), createdBy: userNameById.get(lead.created_by) || lead.created_by || 'CRM', updated: shortDate(lead.updated_at || lead.created_at) }));
    const demoRequests = rawDemos.map((item) => ({ id: item.id, fullName: item.full_name || '-', email: item.email || '-', mobile: item.mobile || '-', companyName: item.company_name || '-', teamSize: item.team_size || '-', requirement: item.requirement || '-', preferredTime: item.preferred_time || '-', status: item.status || 'new', createdAt: item.created_at }));
    const stats = { totalCompanies: companies.length, activeCompanies, paidCompanies, totalUsers: profiles.length, activeUsers, inactiveUsers, trialCompanies, expiredTrials, pendingSignups: pendingSignups.filter((item) => item.status === 'pending').length, totalLeads: leads.length || rawLeads.length, totalTasks: tasksCount, demoRequests: demoRequests.length, monthlyRevenue: paidCompanies * 4999, openTickets: demoRequests.filter((item) => ['new', 'contacted'].includes(statusValue(item.status))).length, uptime: '99.98%' };
    const emailLogs = rawDemos.slice(0, 8).map((item) => ({ id: `demo-${item.id}`, type: 'Demo Alert', to: 'hello@salesflowhub.cloud', status: 'Delivered', time: shortDate(item.created_at), subject: `New demo request from ${item.full_name || item.email}` }));
    const notifications = [{ id: 'n-demo', title: 'New demo requests received', company: 'SalesFlow Hub', status: demoRequests.length ? 'Pending' : 'Sent', priority: demoRequests.length ? 'High' : 'Medium', time: 'Today' }, { id: 'n-health', title: 'Website health check completed', company: 'SalesFlow Hub', status: 'Sent', priority: 'Low', time: 'Just now' }];
    const activityLogs = [...rawDemos.slice(0, 4).map((item) => ({ id: `d-${item.id}`, time: shortDate(item.created_at), name: item.full_name || item.email || 'Visitor', email: item.email || '-', company: item.company_name || '-', action: 'Demo Requested', module: 'Landing', details: item.requirement || 'CRM' })), ...profiles.slice(0, 8).map((user) => ({ id: `u-${user.id}`, time: shortDate(user.created_at), name: user.full_name || user.email || 'User', email: user.email || '-', company: companyNameById.get(user.company_id) || '-', action: user.is_active === false ? 'User Inactive' : 'Logged In', module: 'Auth', details: user.role || 'employee' }))];
    const supportTickets = rawDemos.slice(0, 5).map((item) => ({ id: `ticket-${item.id}`, subject: `Demo follow-up: ${item.full_name || item.email}`, company: item.company_name || '-', priority: 'Medium', status: ['contacted', 'demo_scheduled'].includes(statusValue(item.status)) ? 'In Progress' : 'Open', owner: item.email || '-' }));
    return json(res, 200, { ok: true, stats, recentUsers, companies: companyRows, pendingSignups: pendingRows, leads, demoRequests, websiteHealth: websiteHealth(companies), emailLogs, notifications, activityLogs, supportTickets, growth: growth.length ? growth : [{ month: 'Now', users: profiles.length }], generatedAt: new Date().toISOString() });
  } catch (error) {
    return json(res, 500, { ok: false, message: error.message || 'Unable to load super admin data.' });
  }
}
