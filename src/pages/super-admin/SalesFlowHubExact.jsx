import { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Bell,
  Building2,
  ChevronDown,
  ClipboardList,
  Clock,
  CreditCard,
  ExternalLink,
  Globe,
  Headphones,
  IndianRupee,
  Laptop,
  Mail,
  Megaphone,
  Receipt,
  Search,
  Settings,
  ShieldCheck,
  Target,
  Users2,
  Zap,
} from 'lucide-react';
import '../../styles/salesFlowHubExact.css';

const navItems = [
  { id: 'overview', label: 'Overview', icon: BarChart3 },
  { id: 'companies', label: 'Companies', icon: Building2 },
  { id: 'users', label: 'Users & Roles', icon: Users2 },
  { id: 'invoices', label: 'Invoice & Sales Flows', icon: CreditCard },
  { id: 'plans', label: 'Revenue & Plans', icon: BarChart3 },
  { id: 'leads', label: 'Leads Monitor', icon: Target },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'email-logs', label: 'Email Logs', icon: Mail },
  { id: 'security', label: 'Security', icon: ShieldCheck },
  { id: 'settings', label: 'Platform Settings', icon: Settings },
  { id: 'reports', label: 'Reports', icon: BarChart3 },
  { id: 'activity-logs', label: 'Activity Logs', icon: ClipboardList },
  { id: 'support-tickets', label: 'Support Tickets', icon: Headphones },
  { id: 'website-health', label: 'Website Health', icon: Globe },
];

const defaultPlans = [
  { id: 'p1', name: 'Free Trial', price: 0, companies: 0, status: 'Active', features: '7 day CRM trial' },
  { id: 'p2', name: 'Growth', price: 4999, companies: 0, status: 'Ready', features: 'Reports, tasks, manager access' },
  { id: 'p3', name: 'Enterprise', price: 14999, companies: 0, status: 'Ready', features: 'Advanced support and controls' },
];

const defaultReports = [
  { name: 'Monthly Revenue Report', desc: 'Subscription, trial, and payment overview.' },
  { name: 'Company Growth Stats', desc: 'Active, trial, and expired company profiles.' },
  { name: 'Trial Conversion Audit', desc: 'Trial to paid conversion tracking.' },
];

const defaultHealth = [
  { id: 'web', service: 'SalesFlow Website', status: 'live', message: 'Frontend is connected to Super Admin API.', metric: 'Online', impactLevel: 'Normal' },
  { id: 'api', service: 'Super Admin API', status: 'healthy', message: 'CRM overview endpoint is active.', metric: 'Connected', impactLevel: 'Normal' },
];

const emptyData = {
  companies: [],
  users: [],
  plans: defaultPlans,
  leads: [],
  notifications: [],
  emailLogs: [],
  logs: [],
  tickets: [],
  health: defaultHealth,
  reports: defaultReports,
  stats: {},
  generatedAt: '',
};

function viewFromUrl() {
  const raw = new URLSearchParams(window.location.search).get('view') || 'overview';
  const map = { 'users-roles': 'users', subscriptions: 'invoices', 'revenue-plans': 'plans', 'leads-monitor': 'leads', 'platform-settings': 'settings' };
  return map[raw] || raw;
}

function formatINR(value) {
  return `₹${Number(value || 0).toLocaleString('en-IN')}`;
}

function formatDate(value) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function badgeTone(value) {
  const s = String(value || '').toLowerCase();
  if (s.includes('active') || s.includes('won') || s.includes('success') || s.includes('resolved') || s.includes('healthy') || s.includes('live')) return 'green';
  if (s.includes('trial') || s.includes('medium') || s.includes('progress') || s.includes('warning') || s.includes('ready')) return 'yellow';
  if (s.includes('expired') || s.includes('suspended') || s.includes('critical') || s.includes('open') || s.includes('overdue') || s.includes('danger') || s.includes('failed')) return 'red';
  return 'blue';
}

function changeView(next, setActiveTab) {
  setActiveTab(next);
  const url = next === 'overview' ? '/super-admin/dashboard' : `/super-admin/dashboard?view=${next}`;
  window.history.pushState({}, '', url);
  window.dispatchEvent(new Event('salesflow:navigate'));
}

function normalizeApiData(payload = {}) {
  const stats = payload.stats || {};
  const companies = (payload.companies || []).map((company) => ({
    ...company,
    domain: company.domain || company.adminEmail?.split('@')[1] || '-',
    status: company.status || company.planStatus || 'trial',
    trialDays: company.trialDays ?? company.trialDaysLeft ?? 0,
    createdAt: formatDate(company.createdAt),
    revenue: Number(company.revenue || 0),
  }));

  const users = (payload.recentUsers || []).map((user) => ({
    ...user,
    company: user.company || '-',
    role: user.roleLabel || user.role || 'Employee',
    status: user.status || (user.isActive === false ? 'Suspended' : 'Active'),
  }));

  const leads = (payload.leads || []).map((lead) => ({
    ...lead,
    company: lead.company || '-',
    lead: lead.lead || lead.name || 'Lead',
    owner: lead.owner || lead.assigned || '-',
    nextFollowup: lead.nextFollowup || formatDate(lead.nextFollowUpAt),
    value: Number(lead.value || 0),
  }));

  const notifications = (payload.notifications || []).map((item) => ({
    ...item,
    title: item.title || 'CRM Notification',
    desc: item.desc || item.message || 'Notification',
    time: item.time || formatDate(item.createdAt),
  }));

  const logs = (payload.logs || payload.activities || []).map((item) => ({
    ...item,
    time: item.time ? formatDate(item.time) : '-',
    user: item.user || '-',
    action: item.action || 'Activity',
    module: item.module || 'CRM',
    details: item.details || '-',
  }));

  const tickets = (payload.supportTickets || payload.tickets || []).map((ticket) => ({
    ...ticket,
    companyName: ticket.companyName || 'Public Support',
    userEmail: ticket.userEmail || '-',
    subject: ticket.subject || 'Support request',
    category: ticket.category || 'General',
    priority: ticket.priority || 'Medium',
    status: ticket.status || 'Open',
    createdAt: formatDate(ticket.createdAt),
  }));

  const planCounts = companies.reduce((acc, company) => {
    const key = String(company.plan || 'Free').toLowerCase();
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const plans = defaultPlans.map((plan) => ({
    ...plan,
    companies: planCounts[String(plan.name).toLowerCase()] || planCounts[String(plan.name).replace(/ .*/, '').toLowerCase()] || 0,
  }));

  return {
    companies,
    users,
    plans,
    leads,
    notifications,
    emailLogs: payload.emailLogs || [],
    logs,
    tickets,
    health: defaultHealth,
    reports: defaultReports,
    stats,
    generatedAt: payload.generatedAt || '',
  };
}

function Badge({ children }) {
  return <span className={`sfh-badge ${badgeTone(children)}`}>{children}</span>;
}

function Sidebar({ activeTab, setActiveTab, notificationCount, healthBadgeCount }) {
  return (
    <aside className="sfh-sidebar">
      <div className="sfh-brand-panel">
        <div className="sfh-brand-logo"><span>Sales</span>Flow <b>Hub</b></div>
        <div className="sfh-brand-sub"><i /> Super Admin</div>
      </div>
      <nav className="sfh-nav">
        {navItems.map(({ id, label, icon: Icon }) => {
          const active = activeTab === id;
          const count = id === 'notifications' ? notificationCount : id === 'website-health' ? healthBadgeCount : 0;
          return (
            <button type="button" key={id} className={active ? 'active' : ''} onClick={() => changeView(id, setActiveTab)}>
              <span className="sfh-active-bar" />
              <Icon size={18} />
              <strong>{label}</strong>
              {count > 0 && <em>{count}</em>}
            </button>
          );
        })}
      </nav>
      <div className="sfh-status"><span /><b>CRM DATA CONNECTED</b><Activity size={16} /></div>
      <p className="sfh-version">Super Admin · <b>LIVE CRM</b></p>
    </aside>
  );
}

function Header({ onOpenNotifications, unread, onRefresh, loading }) {
  return (
    <header className="sfh-header">
      <div className="sfh-search"><Search size={18} /><input placeholder="Search companies, users, leads..." /></div>
      <div className="sfh-header-actions">
        <button type="button" onClick={onRefresh} title="Refresh CRM data"><Zap size={18} />{loading && <i>...</i>}</button>
        <button type="button" onClick={onOpenNotifications}><Bell size={18} />{unread > 0 && <i>{unread}</i>}</button>
        <button type="button"><Laptop size={18} /></button>
        <div className="sfh-profile"><span>SA</span><strong>Super Admin</strong><ChevronDown size={15} /></div>
      </div>
    </header>
  );
}

function PageTitle({ title, subtitle, children }) {
  return <div className="sfh-page-title"><div><h1>{title}</h1><p>{subtitle}</p></div>{children}</div>;
}

function StatCard({ icon: Icon, label, value, change, tone = 'orange' }) {
  return (
    <article className="sfh-stat-card">
      <div className={`sfh-stat-icon ${tone}`}><Icon size={24} /></div>
      <small>{label}</small>
      <strong>{value}</strong>
      <span>{change}</span>
    </article>
  );
}

function Table({ heads, children }) {
  return <div className="sfh-table"><table><thead><tr>{heads.map((h) => <th key={h}>{h}</th>)}</tr></thead><tbody>{children}</tbody></table></div>;
}

function NotificationDrawer({ open, notifications, onClose }) {
  if (!open) return null;
  return <div className="sfh-drawer"><button type="button" onClick={onClose}>×</button><h2>Notifications</h2>{notifications.map((n) => <div className="sfh-alert" key={n.id}><b>{n.title}</b><p>{n.desc}</p><small>{n.time}</small></div>)}</div>;
}

function EmptyRow({ colSpan, label = 'No CRM records found.' }) {
  return <tr><td colSpan={colSpan}>{label}</td></tr>;
}

function DashboardCharts({ data }) {
  const growth = data.stats?.totalUsers || data.users.length;
  return <div className="sfh-chart-grid"><section className="sfh-card"><h2>Revenue Overview</h2><div className="sfh-area"><span/><span/><span/><span/><span/><span/><span/></div></section><section className="sfh-card"><h2>Company Growth</h2><div className="sfh-bars"><span/><span/><span/><span/><span/><span/><span/></div><p>{growth} users connected</p></section></div>;
}

function Overview({ data }) {
  const { companies, users, notifications, stats } = data;
  const revenue = companies.reduce((sum, c) => sum + Number(c.revenue || 0), 0);
  return <><PageTitle title="Overview Dashboard" subtitle="Monitor companies, users, leads, tasks, support tickets and platform activity from one Super Admin panel." /><section className="sfh-stats-grid"><StatCard icon={Building2} label="Total Companies" value={stats.totalCompanies ?? companies.length} change="Live CRM" tone="blue"/><StatCard icon={Activity} label="Active Companies" value={stats.activeCompanies ?? companies.filter((c) => String(c.status).toLowerCase().includes('active')).length} change="From companies table" tone="green"/><StatCard icon={Clock} label="Trial Companies" value={stats.trialCompanies ?? companies.filter((c) => String(c.status).toLowerCase().includes('trial')).length} change="Trial monitor" tone="violet"/><StatCard icon={Target} label="Total Leads" value={stats.totalLeads ?? data.leads.length} change="Across all companies" tone="teal"/><StatCard icon={AlertTriangle} label="Overdue Tasks" value={stats.overdueTasks ?? 0} change="Task follow-up risk" tone="orange"/><StatCard icon={Users2} label="Total Users" value={stats.totalUsers ?? users.length} change="All CRM roles" tone="blue"/><StatCard icon={IndianRupee} label="Monthly Revenue" value={formatINR(revenue)} change="Billing ready" tone="green"/><StatCard icon={Receipt} label="Open Tickets" value={stats.openTickets ?? data.tickets.length} change="Support queue" tone="red"/></section><DashboardCharts data={data}/><section className="sfh-grid-3"><div className="sfh-card"><h2>Recent Companies</h2>{companies.slice(0, 5).map((c) => <div className="sfh-list-row" key={c.id}><span>{String(c.name || 'C')[0]}</span><b>{c.name}</b><Badge>{c.status}</Badge></div>)}</div><div className="sfh-card"><h2>System Alerts</h2>{notifications.slice(0, 5).map((n) => <div className="sfh-list-row" key={n.id}><span><AlertTriangle size={15}/></span><b>{n.title}</b><small>{n.time}</small></div>)}</div><div className="sfh-card"><h2>Quick Actions</h2><button className="sfh-primary"><Megaphone size={16}/> Send Announcement</button><button className="sfh-secondary"><ExternalLink size={16}/> Open Public Website</button></div></section></>;
}

function Companies({ companies }) { return <><PageTitle title="Companies" subtitle="Manage company accounts, plans, users and subscription status."><button className="sfh-primary">+ Add Company</button></PageTitle><Table heads={['Company','Admin Email','Plan','Trial','Status','Users','Leads','Created']}>{companies.length ? companies.map((c) => <tr key={c.id}><td><b>{c.name}</b><small>{c.domain}</small></td><td>{c.adminEmail}</td><td><Badge>{c.plan}</Badge></td><td>{c.trialDays > 0 ? `${c.trialDays} days left` : c.trialDays < 0 ? 'Expired' : 'Completed'}</td><td><Badge>{c.status}</Badge></td><td>{c.users}</td><td>{c.leads || 0}</td><td>{c.createdAt}</td></tr>) : <EmptyRow colSpan={8} />}</Table></>; }
function Users({ users }) { return <><PageTitle title="Users & Roles" subtitle="Manage platform users, roles and access permissions." /><Table heads={['User','Email','Company','Role','Status','Action']}>{users.length ? users.map((u) => <tr key={u.id}><td><b>{u.name}</b></td><td>{u.email}</td><td>{u.company}</td><td>{u.role}</td><td><Badge>{u.status}</Badge></td><td><button className="sfh-secondary">Manage</button></td></tr>) : <EmptyRow colSpan={6} />}</Table></>; }
function Invoices({ companies }) { return <><PageTitle title="Invoice & Sales Flows" subtitle="Monitor invoice status, billing events and payment flow." /><Table heads={['Company','Plan','Amount','Payment Status','Subscription','Billing Cycle','Action']}>{companies.length ? companies.map((c) => <tr key={c.id}><td><b>{c.name}</b></td><td><Badge>{c.plan}</Badge></td><td>{formatINR(c.revenue)}</td><td><Badge>{c.revenue ? 'Paid' : 'Billing Ready'}</Badge></td><td><Badge>{c.status}</Badge></td><td>Monthly</td><td><button className="sfh-secondary">Invoice</button></td></tr>) : <EmptyRow colSpan={7} />}</Table></>; }
function Plans({ plans }) { return <><PageTitle title="Revenue & Plans" subtitle="Revenue analytics, plan performance and pricing controls." /><section className="sfh-grid-3">{plans.map((p) => <article className="sfh-card plan" key={p.id}><BarChart3 size={28}/><h2>{p.name}</h2><strong>{formatINR(p.price)}</strong><p>{p.features}</p><Badge>{p.status}</Badge><small>{p.companies || 0} companies</small></article>)}</section></>; }
function Leads({ leads }) { return <><PageTitle title="Leads Monitor" subtitle="Monitor real CRM leads across all companies." /><Table heads={['Company','Lead','Assigned To','Status','Follow-up','Value','Source']}>{leads.length ? leads.map((l) => <tr key={l.id}><td>{l.company}</td><td><b>{l.lead}</b><small>{l.email}</small></td><td>{l.owner}</td><td><Badge>{l.status}</Badge></td><td>{l.nextFollowup}</td><td>{formatINR(l.value)}</td><td>{l.source}</td></tr>) : <EmptyRow colSpan={7} />}</Table></>; }
function Notifications({ notifications }) { return <><PageTitle title="Notifications" subtitle="System alerts, trial reminders and payment notifications." />{notifications.length ? notifications.map((n) => <div className="sfh-alert big" key={n.id}><b>{n.title}</b><p>{n.desc}</p><small>{n.time}</small></div>) : <div className="sfh-alert big"><b>No notifications</b><p>CRM notification table has no current records.</p></div>}</>; }
function EmailLogs({ logs }) { return <><PageTitle title="Email Logs" subtitle="Monitor OTP, report and notification email events." /><Table heads={['Type','To','Status','Error']}>{logs.length ? logs.map((e, index) => <tr key={`${e.type}-${e.to}-${index}`}><td>{e.type}</td><td>{e.to}</td><td><Badge>{e.status}</Badge></td><td>{e.error || '-'}</td></tr>) : <EmptyRow colSpan={4} />}</Table></>; }
function Security({ logs }) { return <><PageTitle title="Security" subtitle="Monitor access, incidents and suspicious sessions." /><Table heads={['Time','User','Action','Module','Details']}>{logs.length ? logs.map((l) => <tr key={l.id}><td>{l.time}</td><td>{l.user}</td><td><Badge>{l.action}</Badge></td><td>{l.module}</td><td>{l.details}</td></tr>) : <EmptyRow colSpan={5} />}</Table></>; }
function SettingsPage() { return <><PageTitle title="Platform Settings" subtitle="Global settings, SMTP, maintenance and report controls." /><section className="sfh-settings-grid">{['Trial Days: 7 days','Default Plan: Free Trial','SMTP Settings: Resend/Zoho Ready','Maintenance Mode: Off','WhatsApp Reminder: Ready','Auto Reports: Ready'].map((x) => <div className="sfh-card" key={x}><h2>{x.split(':')[0]}</h2><p>{x.split(':')[1]}</p><button className="sfh-secondary">Configure</button></div>)}</section></>; }
function Reports({ reports }) { return <><PageTitle title="Reports" subtitle="Export platform revenue, growth and trial reports." /><Table heads={['Report','Description','PDF','Excel']}>{reports.map((r) => <tr key={r.name}><td><b>{r.name}</b></td><td>{r.desc}</td><td><button className="sfh-secondary">PDF</button></td><td><button className="sfh-secondary">Excel</button></td></tr>)}</Table></>; }
function ActivityLogs({ logs }) { return <><PageTitle title="Activity Logs" subtitle="Complete audit trail and platform activity." /><Table heads={['Time','User','Action','Module','Details']}>{logs.length ? logs.map((l) => <tr key={l.id}><td>{l.time}</td><td>{l.user}</td><td>{l.action}</td><td>{l.module}</td><td>{l.details}</td></tr>) : <EmptyRow colSpan={5} />}</Table></>; }
function SupportTickets({ tickets }) { return <><PageTitle title="Support Tickets" subtitle="Handle client issues and support requests." /><Table heads={['Ticket ID','Company','User','Issue','Priority','Status','Created']}>{tickets.length ? tickets.map((t) => <tr key={t.id}><td>{t.id}</td><td>{t.companyName}</td><td>{t.userEmail}</td><td><b>{t.subject}</b><small>{t.category}</small></td><td><Badge>{t.priority}</Badge></td><td><Badge>{t.status}</Badge></td><td>{t.createdAt}</td></tr>) : <EmptyRow colSpan={7} />}</Table></>; }
function WebsiteHealth({ health }) { return <><PageTitle title="Website Health" subtitle="Monitor production website, API and deployment status." /><section className="sfh-stats-grid four"><StatCard icon={Globe} label="Website Status" value="Live" change="Operational" tone="green"/><StatCard icon={Activity} label="API Health" value="Connected" change="Super Admin API" tone="blue"/><StatCard icon={Zap} label="Deployment" value="Main" change="GitHub connected" tone="teal"/><StatCard icon={AlertTriangle} label="Critical Issues" value={health.filter((h) => String(h.status).toLowerCase() === 'critical').length} change="Needs review" tone="red"/></section><Table heads={['Service','Status','Message','Metric','Impact']}>{health.map((h) => <tr key={h.id}><td><b>{h.service}</b></td><td><Badge>{h.status}</Badge></td><td>{h.message}</td><td>{h.metric}</td><td>{h.impactLevel}</td></tr>)}</Table></>; }

function Content({ activeTab, data }) {
  if (activeTab === 'companies') return <Companies companies={data.companies} />;
  if (activeTab === 'users') return <Users users={data.users} />;
  if (activeTab === 'invoices') return <Invoices companies={data.companies} />;
  if (activeTab === 'plans') return <Plans plans={data.plans} />;
  if (activeTab === 'leads') return <Leads leads={data.leads} />;
  if (activeTab === 'notifications') return <Notifications notifications={data.notifications} />;
  if (activeTab === 'email-logs') return <EmailLogs logs={data.emailLogs} />;
  if (activeTab === 'security') return <Security logs={data.logs} />;
  if (activeTab === 'settings') return <SettingsPage />;
  if (activeTab === 'reports') return <Reports reports={data.reports} />;
  if (activeTab === 'activity-logs') return <ActivityLogs logs={data.logs} />;
  if (activeTab === 'support-tickets') return <SupportTickets tickets={data.tickets} />;
  if (activeTab === 'website-health') return <WebsiteHealth health={data.health} />;
  return <Overview data={data} />;
}

export default function SalesFlowHubExact() {
  const [activeTab, setActiveTab] = useState(viewFromUrl());
  const [drawer, setDrawer] = useState(false);
  const [data, setData] = useState(emptyData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const unread = useMemo(() => data.notifications.filter((item) => !item.readAt).length || data.notifications.length, [data.notifications]);

  async function loadData() {
    try {
      setLoading(true);
      setError('');
      const response = await fetch('/api/super-admin-overview');
      const payload = await response.json().catch(() => ({}));
      if (!response.ok || payload.ok === false) throw new Error(payload.message || 'Unable to load Super Admin CRM data.');
      setData(normalizeApiData(payload));
    } catch (err) {
      setError(err.message || 'Unable to load Super Admin CRM data.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadData(); }, []);
  useEffect(() => {
    const sync = () => setActiveTab(viewFromUrl());
    window.addEventListener('popstate', sync);
    window.addEventListener('salesflow:navigate', sync);
    return () => { window.removeEventListener('popstate', sync); window.removeEventListener('salesflow:navigate', sync); };
  }, []);

  return <div className="sfh-exact"><Sidebar activeTab={activeTab} setActiveTab={setActiveTab} notificationCount={data.notifications.length} healthBadgeCount={data.health.length} /><main><Header onOpenNotifications={() => setDrawer(true)} unread={unread} onRefresh={loadData} loading={loading} /><section className="sfh-content">{error && <div className="sfh-alert big"><b>Super Admin connection issue</b><p>{error}</p></div>}{loading && !data.generatedAt && <div className="sfh-alert big"><b>Loading CRM data</b><p>Connecting companies, users, leads, tasks, support and activity logs...</p></div>}<Content activeTab={activeTab} data={data} /></section></main><NotificationDrawer open={drawer} notifications={data.notifications} onClose={() => setDrawer(false)} /></div>;
}
