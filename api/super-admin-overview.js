import { getAdminClient, json } from './_utils.js';

function daysLeft(dateValue) {
  if (!dateValue) return null;
  const diff = new Date(dateValue).getTime() - Date.now();
  return Math.ceil(diff / (24 * 60 * 60 * 1000));
}

function safeArray(result) {
  return Array.isArray(result?.data) ? result.data : [];
}

async function safeSelect(query, fallback = []) {
  try {
    const result = await query;
    if (result?.error) return fallback;
    return Array.isArray(result?.data) ? result.data : fallback;
  } catch {
    return fallback;
  }
}

async function safeCount(supabase, table, build = (query) => query) {
  try {
    const query = build(supabase.from(table).select('*', { count: 'exact', head: true }));
    const { count, error } = await query;
    if (error) return 0;
    return count || 0;
  } catch {
    return 0;
  }
}

function monthKey(value) {
  const date = value ? new Date(value) : new Date();
  return date.toLocaleString('en-US', { month: 'short' });
}

function dateText(value) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function statusKey(value) {
  return String(value || '').trim().toLowerCase();
}

function isActiveCompany(company) {
  const status = statusKey(company.account_status || company.plan_status || company.status);
  return status === 'active' || status === 'paid';
}

function isTrialCompany(company) {
  const status = statusKey(company.account_status || company.plan_status || company.status);
  return status === 'trial' || status === 'free';
}

function isCompletedTask(task) {
  return ['completed', 'done'].includes(statusKey(task.status)) || Boolean(task.completed_at);
}

function isOverdueTask(task) {
  return !isCompletedTask(task) && task.due_at && new Date(task.due_at).getTime() < Date.now();
}

function normalizeRole(role) {
  const value = String(role || 'employee').toLowerCase().replace(/[\s-]+/g, '_');
  if (value === 'company_admin' || value === 'admin') return 'Company Admin';
  if (value === 'super_admin' || value === 'superadmin') return 'Super Admin';
  if (value === 'manager') return 'Manager';
  return 'Employee';
}

function profileName(user) {
  return user?.full_name || user?.email?.split('@')[0] || 'User';
}

function companyName(company, fallback = 'Workspace') {
  return company?.name || company?.admin_email || fallback;
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
        if (!['active', 'trial', 'inactive', 'expired', 'suspended'].includes(accountStatus)) return json(res, 400, { ok: false, message: 'Invalid status.' });

        const { error } = await supabase.from('companies').update({ account_status: accountStatus }).eq('id', companyId);
        if (error) throw error;
        return json(res, 200, { ok: true, message: 'Company status updated.' });
      }

      if (body.action === 'updateSupportTicket') {
        const ticketId = String(body.ticketId || '').trim();
        const status = String(body.status || '').trim();
        if (!ticketId) return json(res, 400, { ok: false, message: 'Ticket id is required.' });
        if (!status) return json(res, 400, { ok: false, message: 'Ticket status is required.' });

        const { error } = await supabase.from('support_tickets').update({ status }).eq('id', ticketId);
        if (error) throw error;
        return json(res, 200, { ok: true, message: 'Support ticket updated.' });
      }

      return json(res, 400, { ok: false, message: 'Invalid action.' });
    }

    if (req.method !== 'GET') return json(res, 405, { ok: false, message: 'Method not allowed.' });

    const [profilesResult, companiesResult, pendingResult] = await Promise.all([
      supabase.from('profiles').select('id,company_id,full_name,email,phone,role,is_active,trial_ends_at,created_at,signup_source').order('created_at', { ascending: false }).limit(500),
      supabase.from('companies').select('id,name,admin_email,admin_phone,signup_user_id,plan,plan_status,account_status,trial_start_at,trial_ends_at,created_at').order('created_at', { ascending: false }).limit(500),
      supabase.from('pending_signups').select('id,full_name,email,phone,company_name,status,created_at').order('created_at', { ascending: false }).limit(200),
    ]);

    const profiles = safeArray(profilesResult);
    const companies = safeArray(companiesResult);
    const pendingSignups = safeArray(pendingResult);

    const [leads, tasks, activities, notifications, supportTickets] = await Promise.all([
      safeSelect(supabase.from('leads').select('id,company_id,created_by,owner_id,name,email,phone,company,source,status,priority,score,value,next_follow_up,created_at,updated_at,is_deleted').eq('is_deleted', false).order('created_at', { ascending: false }).limit(500)),
      safeSelect(supabase.from('tasks').select('id,company_id,created_by,owner_id,lead_id,title,note,type,status,due_at,completed_at,created_at,updated_at').order('due_at', { ascending: true }).limit(500)),
      safeSelect(supabase.from('lead_activities').select('id,company_id,lead_id,user_id,type,title,note,activity_at,created_at').order('activity_at', { ascending: false }).limit(300)),
      safeSelect(supabase.from('notifications').select('id,company_id,user_id,title,message,type,read_at,created_at,related_lead_id').order('created_at', { ascending: false }).limit(200)),
      safeSelect(supabase.from('support_tickets').select('id,company_id,user_id,email,requester_name,subject,category,priority,status,agent_name,zoho_ticket_id,created_at').order('created_at', { ascending: false }).limit(200)),
    ]);

    const [leadsCount, tasksCount, notificationsCount, supportTicketCount] = await Promise.all([
      safeCount(supabase, 'leads', (query) => query.eq('is_deleted', false)),
      safeCount(supabase, 'tasks'),
      safeCount(supabase, 'notifications'),
      safeCount(supabase, 'support_tickets'),
    ]);

    const usersById = new Map(profiles.map((user) => [user.id, user]));
    const companiesById = new Map(companies.map((company) => [company.id, company]));

    const activeUsers = profiles.filter((user) => user.is_active !== false).length;
    const inactiveUsers = profiles.filter((user) => user.is_active === false).length;
    const activeCompanies = companies.filter(isActiveCompany).length;
    const trialCompanies = companies.filter(isTrialCompany).length;
    const expiredTrials = companies.filter((company) => {
      const left = daysLeft(company.trial_ends_at);
      return left !== null && left < 0 && !isActiveCompany(company);
    }).length;
    const openTickets = supportTickets.filter((ticket) => !['closed', 'resolved'].includes(statusKey(ticket.status))).length;
    const unreadNotifications = notifications.filter((item) => !item.read_at).length;

    const monthlyGrowthMap = profiles.reduce((acc, user) => {
      const key = monthKey(user.created_at);
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    const growth = Object.entries(monthlyGrowthMap).slice(-6).map(([month, users]) => ({ month, users }));

    const recentUsers = profiles.slice(0, 20).map((user) => {
      const company = companiesById.get(user.company_id);
      return {
        id: user.id,
        name: profileName(user),
        email: user.email || '-',
        phone: user.phone || '-',
        role: user.role || 'employee',
        roleLabel: normalizeRole(user.role),
        status: user.is_active === false ? 'Suspended' : 'Active',
        isActive: user.is_active !== false,
        company: companyName(company, '-'),
        companyId: user.company_id,
        createdAt: user.created_at,
        trialEndsAt: user.trial_ends_at,
        trialDaysLeft: daysLeft(user.trial_ends_at),
      };
    });

    const companyRows = companies.slice(0, 50).map((company) => {
      const status = company.account_status || company.plan_status || 'trial';
      const revenue = statusKey(company.plan) === 'free' ? 0 : 0;
      return {
        id: company.id,
        name: companyName(company),
        domain: company.admin_email?.split('@')[1] || '-',
        adminEmail: company.admin_email || '-',
        adminPhone: company.admin_phone || '-',
        plan: company.plan || 'free',
        planStatus: company.plan_status || 'trial',
        status,
        trialEndsAt: company.trial_ends_at,
        trialDaysLeft: daysLeft(company.trial_ends_at),
        trialDays: daysLeft(company.trial_ends_at) ?? 0,
        users: profiles.filter((user) => user.company_id === company.id).length,
        leads: leads.filter((lead) => lead.company_id === company.id).length,
        tasks: tasks.filter((task) => task.company_id === company.id).length,
        revenue,
        createdAt: company.created_at,
      };
    });

    const leadRows = leads.slice(0, 100).map((lead) => {
      const company = companiesById.get(lead.company_id);
      const owner = usersById.get(lead.owner_id) || usersById.get(lead.created_by);
      return {
        id: lead.id,
        companyId: lead.company_id,
        company: companyName(company, lead.company || 'Workspace'),
        lead: lead.name || 'Lead',
        name: lead.name || 'Lead',
        email: lead.email || '-',
        phone: lead.phone || '-',
        assigned: profileName(owner),
        owner: profileName(owner),
        ownerEmail: owner?.email || '-',
        status: lead.status || 'New',
        source: lead.source || 'Manual',
        priority: lead.priority || 'Warm',
        score: Number(lead.score || 0),
        value: Number(lead.value || 0),
        nextFollowup: lead.next_follow_up ? dateText(lead.next_follow_up) : '-',
        nextFollowUpAt: lead.next_follow_up,
        createdAt: lead.created_at,
        updatedAt: lead.updated_at,
      };
    });

    const taskRows = tasks.slice(0, 100).map((task) => {
      const company = companiesById.get(task.company_id);
      const owner = usersById.get(task.owner_id) || usersById.get(task.created_by);
      const lead = leads.find((item) => item.id === task.lead_id);
      return {
        id: task.id,
        companyId: task.company_id,
        company: companyName(company, '-'),
        title: task.title || 'Task',
        note: task.note || '',
        type: task.type || 'Task',
        status: task.status || 'Pending',
        dueAt: task.due_at,
        due: task.due_at ? dateText(task.due_at) : '-',
        isOverdue: isOverdueTask(task),
        isCompleted: isCompletedTask(task),
        lead: lead?.name || 'General',
        owner: profileName(owner),
        createdAt: task.created_at,
      };
    });

    const activityRows = activities.slice(0, 80).map((activity) => {
      const company = companiesById.get(activity.company_id);
      const user = usersById.get(activity.user_id);
      const lead = leads.find((item) => item.id === activity.lead_id);
      return {
        id: activity.id,
        time: activity.activity_at || activity.created_at,
        user: profileName(user),
        company: companyName(company, '-'),
        action: activity.title || activity.type || 'Activity',
        module: lead ? 'Leads' : 'CRM',
        details: activity.note || lead?.name || '-',
      };
    });

    const notificationRows = [
      ...notifications.slice(0, 60).map((item) => ({
        id: item.id,
        title: item.title || 'CRM Notification',
        desc: item.message || item.type || 'Notification',
        message: item.message || '',
        type: item.type || 'info',
        time: dateText(item.created_at),
        createdAt: item.created_at,
        readAt: item.read_at,
      })),
      ...pendingSignups.filter((item) => item.status === 'pending').slice(0, 20).map((item) => ({
        id: `pending-${item.id}`,
        title: 'Pending signup',
        desc: `${item.full_name || item.email} is waiting for OTP verification.`,
        message: item.email || '',
        type: 'signup',
        time: dateText(item.created_at),
        createdAt: item.created_at,
      })),
    ];

    const supportRows = supportTickets.slice(0, 80).map((ticket) => {
      const company = companiesById.get(ticket.company_id);
      return {
        id: ticket.id,
        companyId: ticket.company_id,
        companyName: companyName(company, ticket.company_id ? 'Workspace' : 'Public Support'),
        userEmail: ticket.email || usersById.get(ticket.user_id)?.email || '-',
        requesterName: ticket.requester_name || profileName(usersById.get(ticket.user_id)),
        subject: ticket.subject || 'Support request',
        category: ticket.category || 'General',
        priority: ticket.priority || 'Medium',
        status: ticket.status || 'Open',
        agentName: ticket.agent_name || 'SalesFlow Support Team',
        zohoTicketId: ticket.zoho_ticket_id || null,
        createdAt: ticket.created_at,
      };
    });

    const emailRows = [
      ...pendingSignups.slice(0, 40).map((item) => ({
        type: 'Signup OTP',
        to: item.email || '-',
        status: item.status === 'verified' ? 'Verified' : item.status || 'Pending',
        error: '-',
        createdAt: item.created_at,
      })),
      ...notifications.slice(0, 20).map((item) => ({
        type: item.type || 'Notification',
        to: usersById.get(item.user_id)?.email || '-',
        status: item.read_at ? 'Read' : 'Sent',
        error: '-',
        createdAt: item.created_at,
      })),
    ];

    const pendingRows = pendingSignups.slice(0, 50).map((item) => ({
      id: item.id,
      name: item.full_name || item.email || 'Signup',
      email: item.email || '-',
      phone: item.phone || '-',
      company: item.company_name || '-',
      status: item.status || 'pending',
      createdAt: item.created_at,
    }));

    return json(res, 200, {
      ok: true,
      stats: {
        totalCompanies: companies.length,
        activeCompanies,
        totalUsers: profiles.length,
        activeUsers,
        inactiveUsers,
        trialCompanies,
        expiredTrials,
        pendingSignups: pendingSignups.filter((item) => item.status === 'pending').length,
        totalLeads: leadsCount || leads.length,
        wonLeads: leads.filter((lead) => ['won', 'converted', 'demo done'].includes(statusKey(lead.status))).length,
        lostLeads: leads.filter((lead) => ['lost', 'junk'].includes(statusKey(lead.status))).length,
        totalTasks: tasksCount || tasks.length,
        openTasks: tasks.filter((task) => !isCompletedTask(task)).length,
        overdueTasks: tasks.filter(isOverdueTask).length,
        notifications: notificationsCount || notifications.length,
        unreadNotifications,
        supportTickets: supportTicketCount || supportTickets.length,
        openTickets,
        uptime: '99.98%',
      },
      recentUsers,
      companies: companyRows,
      leads: leadRows,
      tasks: taskRows,
      activities: activityRows,
      logs: activityRows,
      notifications: notificationRows,
      emailLogs: emailRows,
      supportTickets: supportRows,
      tickets: supportRows,
      pendingSignups: pendingRows,
      growth: growth.length ? growth : [{ month: 'Now', users: profiles.length }],
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    return json(res, 500, { ok: false, message: error.message || 'Unable to load super admin data.' });
  }
}
