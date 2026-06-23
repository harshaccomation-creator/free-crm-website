import { lazy, Suspense, useEffect, useState } from 'react';
import '../../salesflow-hub/hubScoped.css';

const SalesFlowHubApp = lazy(() => import('../../salesflow-hub/App.tsx'));

const STORAGE_KEYS = {
  COMPANIES: 'salesflow_companies_v1',
  USERS: 'salesflow_users_v1',
  LEADS: 'salesflow_leads_v1',
  LOGS: 'salesflow_logs_v1',
  NOTIFICATIONS: 'salesflow_notifications_v1',
  TICKETS: 'salesflow_tickets_v1',
};

function normalizePlan(value) {
  const text = String(value || '').toLowerCase();
  if (text.includes('enterprise')) return 'Enterprise';
  if (text.includes('professional') || text.includes('pro') || text.includes('growth')) return 'Professional';
  if (text.includes('trial') || text.includes('free')) return 'Trial';
  return 'Starter';
}

function normalizeCompanyStatus(value) {
  const text = String(value || '').toLowerCase();
  if (text.includes('paid')) return 'Paid';
  if (text.includes('active')) return 'Active';
  if (text.includes('expired') || text.includes('inactive') || text.includes('suspend')) return 'Expired';
  return 'Trial';
}

function normalizeUserRole(value) {
  const text = String(value || '').toLowerCase();
  if (text.includes('super')) return 'Super Admin';
  if (text.includes('owner') || text.includes('company_admin') || text === 'admin') return 'Owner';
  if (text.includes('manager') || text.includes('admin')) return 'Admin';
  return 'User';
}

function normalizeUserStatus(value, isActive) {
  if (isActive === false) return 'Suspended';
  const text = String(value || '').toLowerCase();
  if (text.includes('pending')) return 'Pending';
  if (text.includes('suspend') || text.includes('inactive')) return 'Suspended';
  return 'Active';
}

function normalizeLeadStatus(value) {
  const text = String(value || '').toLowerCase();
  if (text.includes('won') || text.includes('converted') || text.includes('demo done')) return 'Won';
  if (text.includes('lost') || text.includes('junk')) return 'Lost';
  if (text.includes('proposal')) return 'Proposal';
  if (text.includes('negotiat') || text.includes('follow') || text.includes('demo')) return 'Negotiating';
  if (text.includes('contact')) return 'Contacted';
  return 'New';
}

function normalizeTicketCategory(value) {
  const text = String(value || '').toLowerCase();
  if (text.includes('bill') || text.includes('payment')) return 'Billing';
  if (text.includes('integr')) return 'Integration';
  if (text.includes('account') || text.includes('login') || text.includes('otp')) return 'Account';
  return 'Technical';
}

function normalizePriority(value) {
  const text = String(value || '').toLowerCase();
  if (text.includes('critical')) return 'critical';
  if (text.includes('high')) return 'high';
  if (text.includes('low')) return 'low';
  return 'medium';
}

function normalizeTicketStatus(value) {
  const text = String(value || '').toLowerCase();
  if (text.includes('resolved') || text.includes('closed')) return 'Resolved';
  if (text.includes('progress')) return 'In Progress';
  return 'Open';
}

function notificationCategory(value) {
  const text = String(value || '').toLowerCase();
  if (text.includes('bill') || text.includes('payment')) return 'billing';
  if (text.includes('security') || text.includes('login')) return 'security';
  if (text.includes('signup') || text.includes('onboard')) return 'onboarding';
  return 'system';
}

function logCategory(value) {
  const text = String(value || '').toLowerCase();
  if (text.includes('bill') || text.includes('payment')) return 'Billing';
  if (text.includes('email') || text.includes('otp')) return 'Email';
  if (text.includes('security') || text.includes('login') || text.includes('user')) return 'Security';
  return 'System';
}

function logStatus(value) {
  const text = String(value || '').toLowerCase();
  if (text.includes('fail') || text.includes('error') || text.includes('lost') || text.includes('inactive')) return 'error';
  if (text.includes('warn') || text.includes('trial') || text.includes('pending')) return 'warning';
  if (text.includes('active') || text.includes('won') || text.includes('success')) return 'success';
  return 'info';
}

function writeJson(key, value) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

function formatINR(value) {
  return `₹${Number(value || 0).toLocaleString('en-IN')}`;
}

function buildLiveStats(payload, companies, leads, tickets) {
  const stats = payload.stats || {};
  const monthlyRevenue = companies.reduce((sum, company) => sum + Number(company.monthlySpend || 0), 0);
  const pendingPayments = leads
    .filter((lead) => ['Negotiating', 'Proposal'].includes(lead.status))
    .reduce((sum, lead) => sum + Number(lead.value || 0), 0);

  return {
    'TOTAL COMPANIES': Number(stats.totalCompanies ?? companies.length),
    'ACTIVE COMPANIES': Number(stats.activeCompanies ?? companies.filter((company) => ['Active', 'Paid'].includes(company.status)).length),
    'TRIAL COMPANIES': Number(stats.trialCompanies ?? companies.filter((company) => company.status === 'Trial').length),
    'PAID COMPANIES': Number(stats.paidCompanies ?? companies.filter((company) => company.status === 'Paid').length),
    'EXPIRED TRIALS': Number(stats.expiredTrials ?? companies.filter((company) => company.status === 'Expired').length),
    'TOTAL USERS': Number(stats.totalUsers ?? 0),
    'MONTHLY REVENUE': formatINR(monthlyRevenue),
    'PENDING PAYMENTS': formatINR(pendingPayments),
    'TOTAL LEADS': Number(stats.totalLeads ?? leads.length),
    'OVERDUE TASKS': Number(stats.overdueTasks ?? 0),
    'OPEN TICKETS': Number(stats.openTickets ?? tickets.filter((ticket) => ticket.status !== 'Resolved').length),
  };
}

function installOverviewCardHydrator(liveStats) {
  window.__salesflowHubLiveStats = liveStats;
  const apply = () => {
    const stats = window.__salesflowHubLiveStats || {};
    document.querySelectorAll('.salesflow-hub-root span').forEach((label) => {
      const key = String(label.textContent || '').trim().toUpperCase();
      if (!Object.prototype.hasOwnProperty.call(stats, key)) return;
      const card = label.closest('.bg-white');
      const value = card?.querySelector('h3');
      if (!value) return;
      const next = typeof stats[key] === 'number' ? stats[key].toLocaleString('en-IN') : String(stats[key]);
      if (value.textContent !== next) value.textContent = next;
    });
  };

  window.clearInterval(window.__salesflowHubCardTimer);
  window.__salesflowHubCardTimer = window.setInterval(apply, 700);
  window.setTimeout(apply, 100);
  window.setTimeout(apply, 800);
  window.setTimeout(apply, 1600);
}

function syncHubStorage(payload) {
  const companies = (payload.companies || []).map((company) => ({
    id: String(company.id || company.name),
    name: company.name || 'Workspace',
    domain: company.domain || String(company.adminEmail || '').split('@')[1] || '-',
    plan: normalizePlan(company.plan),
    status: normalizeCompanyStatus(company.status || company.planStatus),
    userCount: Number(company.users || 0),
    monthlySpend: Number(company.revenue || 0),
    createdAt: String(company.createdAt || '').slice(0, 10),
    adminEmail: company.adminEmail || '-',
  }));

  const users = (payload.recentUsers || []).map((user) => ({
    id: String(user.id || user.email),
    name: user.name || user.email || 'User',
    email: user.email || '-',
    companyId: user.companyId || 'unknown-company',
    companyName: user.company || companies.find((company) => company.id === user.companyId)?.name || '-',
    role: normalizeUserRole(user.role || user.roleLabel),
    status: normalizeUserStatus(user.status, user.isActive),
    lastLogin: String(user.createdAt || new Date().toISOString()).replace('T', ' ').slice(0, 16),
  }));

  const leads = (payload.leads || []).map((lead) => ({
    id: String(lead.id || lead.email || lead.name),
    companyName: lead.company || 'Workspace',
    contactName: lead.lead || lead.name || 'Lead',
    contactEmail: lead.email === '-' ? '' : lead.email || '',
    value: Number(lead.value || 0),
    source: lead.source || 'CRM',
    status: normalizeLeadStatus(lead.status),
    createdAt: String(lead.createdAt || new Date().toISOString()).slice(0, 10),
    notes: `${lead.status || 'CRM lead'}${lead.owner ? ` · Owner: ${lead.owner}` : ''}`,
  }));

  const tickets = (payload.supportTickets || payload.tickets || []).map((ticket) => ({
    id: String(ticket.id || ticket.subject),
    companyName: ticket.companyName || 'Public Support',
    userEmail: ticket.userEmail || '-',
    subject: ticket.subject || 'Support request',
    category: normalizeTicketCategory(ticket.category),
    priority: normalizePriority(ticket.priority),
    status: normalizeTicketStatus(ticket.status),
    createdAt: String(ticket.createdAt || new Date().toISOString()).replace('T', ' ').slice(0, 16),
    desc: ticket.message || ticket.desc || ticket.category || 'CRM support ticket',
  }));

  const notifications = (payload.notifications || []).map((item) => ({
    id: String(item.id || item.title),
    title: item.title || 'CRM Notification',
    desc: item.desc || item.message || 'Notification',
    time: item.time || 'Just now',
    category: notificationCategory(item.type || item.title),
    read: Boolean(item.readAt),
  }));

  const logs = (payload.logs || payload.activities || []).map((log) => ({
    id: String(log.id || `${log.user}-${log.action}`),
    timestamp: String(log.time || new Date().toISOString()).replace('T', ' ').slice(0, 19),
    category: logCategory(log.module || log.action),
    message: `${log.action || 'CRM activity'}${log.details && log.details !== '-' ? ` - ${log.details}` : ''}`,
    status: logStatus(log.action || log.details),
    userEmail: log.user || undefined,
    ipAddress: 'CRM',
  }));

  writeJson(STORAGE_KEYS.COMPANIES, companies);
  writeJson(STORAGE_KEYS.USERS, users);
  writeJson(STORAGE_KEYS.LEADS, leads);
  writeJson(STORAGE_KEYS.TICKETS, tickets);
  writeJson(STORAGE_KEYS.NOTIFICATIONS, notifications);
  writeJson(STORAGE_KEYS.LOGS, logs);
  installOverviewCardHydrator(buildLiveStats(payload, companies, leads, tickets));
}

export default function SalesFlowHubBridge() {
  const [ready, setReady] = useState(false);
  const [message, setMessage] = useState('Connecting live CRM data...');

  useEffect(() => {
    let alive = true;

    async function loadLiveData() {
      try {
        const response = await fetch('/api/super-admin-overview', { cache: 'no-store' });
        const payload = await response.json().catch(() => ({}));
        if (!response.ok || payload.ok === false) throw new Error(payload.message || 'Unable to load live CRM data.');
        syncHubStorage(payload);
        if (alive) setMessage('Opening Super Admin workspace...');
      } catch (error) {
        console.warn('[SalesFlow Hub] Live data preload failed', error);
        if (alive) setMessage('Opening Super Admin workspace with saved data...');
      } finally {
        if (alive) setReady(true);
      }
    }

    loadLiveData();
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    if (!ready || !window.__salesflowHubLiveStats) return undefined;
    installOverviewCardHydrator(window.__salesflowHubLiveStats);
    return () => window.clearInterval(window.__salesflowHubCardTimer);
  }, [ready]);

  if (!ready) {
    return <div className="crm-session-loader"><div className="crm-session-loader__card">{message}</div></div>;
  }

  return (
    <Suspense fallback={<div className="crm-session-loader"><div className="crm-session-loader__card">Loading Super Admin workspace...</div></div>}>
      <SalesFlowHubApp />
    </Suspense>
  );
}
