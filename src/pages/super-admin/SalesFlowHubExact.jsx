import { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Bell,
  Building2,
  CheckCircle2,
  ChevronDown,
  ClipboardList,
  Clock,
  CreditCard,
  DollarSign,
  ExternalLink,
  Flame,
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
  TrendingUp,
  Users2,
  Zap,
} from 'lucide-react';
import '../../styles/salesFlowHubExact.css';

const storage = {
  companies: 'salesflow_companies_v1',
  users: 'salesflow_users_v1',
  plans: 'salesflow_plans_v1',
  leads: 'salesflow_leads_v1',
  logs: 'salesflow_logs_v1',
  announcement: 'salesflow_announcement_v1',
  tickets: 'salesflow_tickets_v1',
  health: 'salesflow_health_v1',
};

const companiesSeed = [
  { id: 'c1', name: 'Apex Systems Inc.', domain: 'apexsystems.com', adminEmail: 'admin@apexsystems.com', plan: 'Enterprise', status: 'Active', users: 42, revenue: 49500, trialDays: 0, createdAt: '2026-06-10' },
  { id: 'c2', name: 'Blue Horizon Ltd.', domain: 'bluehorizon.net', adminEmail: 'owner@bluehorizon.net', plan: 'Pro', status: 'Trial', users: 14, revenue: 0, trialDays: 4, createdAt: '2026-06-14' },
  { id: 'c3', name: 'Zeta Tech Solutions', domain: 'zetatech.io', adminEmail: 'crm@zetatech.io', plan: 'Growth', status: 'Active', users: 28, revenue: 22900, trialDays: 0, createdAt: '2026-06-11' },
  { id: 'c4', name: 'Nordic Craft Design', domain: 'nordiccraft.dk', adminEmail: 'lars@nordiccraft.dk', plan: 'Starter', status: 'Expired Trial', users: 5, revenue: 0, trialDays: -2, createdAt: '2026-06-01' },
];

const usersSeed = [
  { id: 'u1', name: 'Raj Mehta', email: 'raj@apexsystems.com', company: 'Apex Systems Inc.', role: 'Company Admin', status: 'Active' },
  { id: 'u2', name: 'Amrit Sinha', email: 'amrit@zetatech.io', company: 'Zeta Tech Solutions', role: 'Manager', status: 'Active' },
  { id: 'u3', name: 'Lars Nielsen', email: 'lars@nordiccraft.dk', company: 'Nordic Craft Design', role: 'Company Admin', status: 'Suspended' },
];

const leadsSeed = [
  { id: 'l1', company: 'Apex Systems Inc.', lead: 'Hindustan Retail Ltd.', status: 'Won', owner: 'Raj Mehta', value: 11500, nextFollowup: 'Today' },
  { id: 'l2', company: 'Blue Horizon Ltd.', lead: 'Green Valley Foods', status: 'Demo Done', owner: 'Karan Shah', value: 8200, nextFollowup: 'Tomorrow' },
  { id: 'l3', company: 'Zeta Tech Solutions', lead: 'Metro Textiles', status: 'Overdue', owner: 'Amrit Sinha', value: 5400, nextFollowup: '2 days overdue' },
];

const logsSeed = [
  { id: 'log1', type: 'billing', title: 'Subscription upgraded', description: 'Apex Systems moved to Enterprise plan.', time: '42 mins ago', severity: 'success' },
  { id: 'log2', type: 'security', title: 'Multiple bad passwords detected', description: 'IP 103.44.11.23 failed login limit.', time: '3 hours ago', severity: 'danger' },
  { id: 'log3', type: 'system', title: 'Hourly backup constructed', description: '4 database snapshots created safely.', time: '5 hours ago', severity: 'info' },
];

const ticketsSeed = [
  { id: 't1', companyName: 'Apex Systems Inc.', userEmail: 'raj@apexsystems.com', subject: 'Webhooks delay in production shard', category: 'Technical', priority: 'critical', status: 'Open', createdAt: '2026-06-18 09:20' },
  { id: 't2', companyName: 'Zeta Tech Solutions', userEmail: 'amrit@zetatech.io', subject: 'Stripe failed bill grace periods info', category: 'Billing', priority: 'medium', status: 'In Progress', createdAt: '2026-06-17 11:15' },
  { id: 't3', companyName: 'Nordic Craft Design', userEmail: 'lars@nordiccraft.dk', subject: 'API gateway token renewal limits', category: 'Integration', priority: 'low', status: 'Resolved', createdAt: '2026-06-16 14:02' },
];

const healthSeed = [
  { id: 'h1', service: 'PostgreSQL DB Shard 3', status: 'critical', message: 'Replication buffer peak hit 94% threshold.', metric: '94% CPU Limit', impactLevel: 'High Delay Alert' },
  { id: 'h2', service: 'Redis Caching Service', status: 'critical', message: 'Memory pool nearing maximum capacity.', metric: '98% Memory Pool', impactLevel: 'Medium Latency Alert' },
  { id: 'h3', service: 'EU CDN Edge server', status: 'warning', message: 'European edge peak latencies crossed SLA.', metric: '420ms Peak', impactLevel: 'European Ingress Peaks' },
];

const plansSeed = [
  { id: 'p1', name: 'Starter', price: 1999, companies: 48, status: 'Active', features: 'Basic CRM, leads, follow-ups' },
  { id: 'p2', name: 'Growth', price: 4999, companies: 76, status: 'Active', features: 'Reports, tasks, manager access' },
  { id: 'p3', name: 'Enterprise', price: 14999, companies: 22, status: 'Active', features: 'Advanced support, API, premium controls' },
];

const emailLogsSeed = [
  { type: 'OTP Verification', to: 'admin@apexsystems.com', status: 'Delivered', error: 'None' },
  { type: 'Monthly Report', to: 'owner@bluehorizon.net', status: 'Delivered', error: 'None' },
  { type: 'Payment Reminder', to: 'lars@nordiccraft.dk', status: 'Failed', error: 'SMTP Timeout' },
];

const activityLogsSeed = [
  { id: 'al1', time: '2026-06-20 10:15', user: 'Raj Mehta', action: 'Login Success', module: 'Auth', details: 'Session started from IP 103.44.11.23' },
  { id: 'al2', time: '2026-06-20 09:30', user: 'Amrit Sinha', action: 'Lead Created', module: 'Leads', details: 'Created lead Hindustan Retail Ltd.' },
  { id: 'al3', time: '2026-06-20 08:45', user: 'Lars Nielsen', action: 'Profile Update', module: 'Settings', details: 'Updated business address' },
];

const reportsSeed = [
  { name: 'Monthly Revenue Report', desc: 'Detailed breakdown of active subscriptions, upgrades, and gross invoices.' },
  { name: 'Company Growth Stats', desc: 'Analysis of active, trial, and expired company profiles.' },
  { name: 'Trial Conversion Audit', desc: 'Conversion ratios from trial status to paid subscriptions.' },
];

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

function readStore(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function viewFromUrl() {
  const raw = new URLSearchParams(window.location.search).get('view') || 'overview';
  const map = { 'users-roles': 'users', subscriptions: 'invoices', 'revenue-plans': 'plans', 'leads-monitor': 'leads', 'platform-settings': 'settings' };
  return map[raw] || raw;
}

function formatINR(value) {
  return `₹${Number(value || 0).toLocaleString('en-IN')}`;
}

function badgeTone(value) {
  const s = String(value || '').toLowerCase();
  if (s.includes('active') || s.includes('won') || s.includes('success') || s.includes('resolved')) return 'green';
  if (s.includes('trial') || s.includes('medium') || s.includes('progress') || s.includes('warning')) return 'yellow';
  if (s.includes('expired') || s.includes('suspended') || s.includes('critical') || s.includes('open') || s.includes('overdue') || s.includes('danger')) return 'red';
  return 'blue';
}

function changeView(next, setActiveTab) {
  setActiveTab(next);
  const url = next === 'overview' ? '/super-admin/dashboard' : `/super-admin/dashboard?view=${next}`;
  window.history.pushState({}, '', url);
  window.dispatchEvent(new Event('salesflow:navigate'));
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
      <div className="sfh-status"><span /><b>NOC PLATFORM STATUS</b><Activity size={16} /></div>
      <p className="sfh-version">v4.8.2-enterprise · <b>STABLE</b></p>
    </aside>
  );
}

function Header({ onOpenNotifications, unread }) {
  return (
    <header className="sfh-header">
      <div className="sfh-search"><Search size={18} /><input placeholder="Search companies, users, invoices..." /></div>
      <div className="sfh-header-actions">
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

function DashboardCharts() {
  return <div className="sfh-chart-grid"><section className="sfh-card"><h2>Revenue Overview</h2><div className="sfh-area"><span/><span/><span/><span/><span/><span/><span/></div></section><section className="sfh-card"><h2>Company Growth</h2><div className="sfh-bars"><span/><span/><span/><span/><span/><span/><span/></div></section></div>;
}

function Overview({ companies, users, notifications }) {
  const revenue = companies.reduce((sum, c) => sum + Number(c.revenue || 0), 0);
  return <><PageTitle title="Overview Dashboard" subtitle="Monitor companies, subscriptions, growth, users, payments, alerts and activity." /><section className="sfh-stats-grid"><StatCard icon={Building2} label="Total Companies" value={companies.length} change="+12.4% this month" tone="blue"/><StatCard icon={Activity} label="Active Companies" value={companies.filter((c) => c.status === 'Active').length} change="+8.7% this month" tone="green"/><StatCard icon={Clock} label="Trial Companies" value={companies.filter((c) => c.status.includes('Trial')).length} change="+5.3% this month" tone="violet"/><StatCard icon={CreditCard} label="Paid Companies" value={companies.filter((c) => c.revenue > 0).length} change="+14.1% this month" tone="teal"/><StatCard icon={AlertTriangle} label="Expired Trials" value={companies.filter((c) => c.trialDays < 0).length} change="-4.6% this month" tone="orange"/><StatCard icon={Users2} label="Total Users" value={users.length} change="+10.2% this month" tone="blue"/><StatCard icon={IndianRupee} label="Monthly Revenue" value={formatINR(revenue)} change="+16.8% this month" tone="green"/><StatCard icon={Receipt} label="Pending Payments" value={formatINR(48230)} change="-7.3% this month" tone="red"/></section><DashboardCharts/><section className="sfh-grid-3"><div className="sfh-card"><h2>Recent Companies</h2>{companies.map((c) => <div className="sfh-list-row" key={c.id}><span>{c.name[0]}</span><b>{c.name}</b><Badge>{c.status}</Badge></div>)}</div><div className="sfh-card"><h2>System Alerts</h2>{notifications.map((n) => <div className="sfh-list-row" key={n.id}><span><AlertTriangle size={15}/></span><b>{n.title}</b><small>{n.time}</small></div>)}</div><div className="sfh-card"><h2>Quick Actions</h2><button className="sfh-primary"><Megaphone size={16}/> Send Announcement</button><button className="sfh-secondary"><ExternalLink size={16}/> Open Public Website</button></div></section></>;
}

function Companies({ companies }) { return <><PageTitle title="Companies" subtitle="Manage company accounts, plans, users and subscription status."><button className="sfh-primary">+ Add Company</button></PageTitle><Table heads={['Company','Admin Email','Plan','Trial','Status','Users','Created','Actions']}>{companies.map((c) => <tr key={c.id}><td><b>{c.name}</b><small>{c.domain}</small></td><td>{c.adminEmail}</td><td><Badge>{c.plan}</Badge></td><td>{c.trialDays > 0 ? `${c.trialDays} days left` : c.trialDays < 0 ? 'Expired' : 'Completed'}</td><td><Badge>{c.status}</Badge></td><td>{c.users}</td><td>{c.createdAt}</td><td><button className="sfh-secondary">View</button></td></tr>)}</Table></>; }
function Users({ users }) { return <><PageTitle title="Users & Roles" subtitle="Manage platform users, roles and access permissions." /><Table heads={['User','Email','Company','Role','Status','Action']}>{users.map((u) => <tr key={u.id}><td><b>{u.name}</b></td><td>{u.email}</td><td>{u.company}</td><td>{u.role}</td><td><Badge>{u.status}</Badge></td><td><button className="sfh-secondary">Manage</button></td></tr>)}</Table></>; }
function Invoices({ companies }) { return <><PageTitle title="Invoice & Sales Flows" subtitle="Monitor invoice status, billing events and payment flow." /><Table heads={['Company','Plan','Amount','Payment Status','Subscription','Billing Cycle','Action']}>{companies.map((c) => <tr key={c.id}><td><b>{c.name}</b></td><td><Badge>{c.plan}</Badge></td><td>{formatINR(c.revenue)}</td><td><Badge>{c.revenue ? 'Paid' : 'Pending'}</Badge></td><td><Badge>{c.status}</Badge></td><td>Monthly</td><td><button className="sfh-secondary">Invoice</button></td></tr>)}</Table></>; }
function Plans({ plans }) { return <><PageTitle title="Revenue & Plans" subtitle="Revenue analytics, plan performance and pricing controls." /><section className="sfh-grid-3">{plans.map((p) => <article className="sfh-card plan" key={p.id}><BarChart3 size={28}/><h2>{p.name}</h2><strong>{formatINR(p.price)}</strong><p>{p.features}</p><Badge>{p.status}</Badge></article>)}</section></>; }
function Leads({ leads }) { return <><PageTitle title="Leads Monitor" subtitle="Monitor leads across all companies." /><Table heads={['Company','Lead','Assigned To','Status','Follow-up','Value','Action']}>{leads.map((l) => <tr key={l.id}><td>{l.company}</td><td><b>{l.lead}</b></td><td>{l.owner}</td><td><Badge>{l.status}</Badge></td><td>{l.nextFollowup}</td><td>{formatINR(l.value)}</td><td><button className="sfh-secondary">Open</button></td></tr>)}</Table></>; }
function Notifications({ notifications }) { return <><PageTitle title="Notifications" subtitle="System alerts, trial reminders and payment notifications." />{notifications.map((n) => <div className="sfh-alert big" key={n.id}><b>{n.title}</b><p>{n.desc}</p><small>{n.time}</small></div>)}</>; }
function EmailLogs({ logs }) { return <><PageTitle title="Email Logs" subtitle="Monitor all OTP, report and notification emails." /><Table heads={['Type','To','Status','Error']}>{logs.map((e) => <tr key={e.type}><td>{e.type}</td><td>{e.to}</td><td><Badge>{e.status}</Badge></td><td>{e.error}</td></tr>)}</Table></>; }
function Security({ logs }) { return <><PageTitle title="Security" subtitle="Monitor access, incidents and suspicious sessions." /><Table heads={['Time','User','Action','Module','Details']}>{logs.map((l) => <tr key={l.id}><td>{l.time}</td><td>{l.user}</td><td><Badge>{l.action}</Badge></td><td>{l.module}</td><td>{l.details}</td></tr>)}</Table></>; }
function SettingsPage() { return <><PageTitle title="Platform Settings" subtitle="Global settings, SMTP, maintenance and report controls." /><section className="sfh-settings-grid">{['Trial Days: 7 days','Default Plan: Growth','SMTP Settings: Configured','Maintenance Mode: Off','WhatsApp Reminder: On','Auto Reports: Enabled'].map((x) => <div className="sfh-card" key={x}><h2>{x.split(':')[0]}</h2><p>{x.split(':')[1]}</p><button className="sfh-secondary">Configure</button></div>)}</section></>; }
function Reports({ reports }) { return <><PageTitle title="Reports" subtitle="Export platform revenue, growth and trial reports." /><Table heads={['Report','Description','PDF','Excel']}>{reports.map((r) => <tr key={r.name}><td><b>{r.name}</b></td><td>{r.desc}</td><td><button className="sfh-secondary">PDF</button></td><td><button className="sfh-secondary">Excel</button></td></tr>)}</Table></>; }
function ActivityLogs({ logs }) { return <><PageTitle title="Activity Logs" subtitle="Complete audit trail and platform activity." /><Table heads={['Time','User','Action','Module','Details']}>{logs.map((l) => <tr key={l.id}><td>{l.time}</td><td>{l.user}</td><td>{l.action}</td><td>{l.module}</td><td>{l.details}</td></tr>)}</Table></>; }
function SupportTickets({ tickets }) { return <><PageTitle title="Support Tickets" subtitle="Handle client issues and support requests." /><Table heads={['Ticket ID','Company','User','Issue','Priority','Status','Action']}>{tickets.map((t) => <tr key={t.id}><td>{t.id}</td><td>{t.companyName}</td><td>{t.userEmail}</td><td><b>{t.subject}</b><small>{t.category}</small></td><td><Badge>{t.priority}</Badge></td><td><Badge>{t.status}</Badge></td><td><button className="sfh-secondary">View</button></td></tr>)}</Table></>; }
function WebsiteHealth({ health }) { return <><PageTitle title="Website Health" subtitle="Monitor production website, API and deployment status." /><section className="sfh-stats-grid four"><StatCard icon={Globe} label="Website Status" value="Live" change="Operational" tone="green"/><StatCard icon={Activity} label="API Health" value="Healthy" change="Operational" tone="blue"/><StatCard icon={Zap} label="Deployment" value="Success" change="Latest build" tone="teal"/><StatCard icon={AlertTriangle} label="Critical Issues" value={health.filter((h) => h.status === 'critical').length} change="Needs review" tone="red"/></section><Table heads={['Service','Status','Message','Metric','Impact']}>{health.map((h) => <tr key={h.id}><td><b>{h.service}</b></td><td><Badge>{h.status}</Badge></td><td>{h.message}</td><td>{h.metric}</td><td>{h.impactLevel}</td></tr>)}</Table></>; }

function Content({ activeTab, data }) {
  const { companies, users, plans, leads, notifications, emailLogs, logs, tickets, health, reports } = data;
  if (activeTab === 'companies') return <Companies companies={companies} />;
  if (activeTab === 'users') return <Users users={users} />;
  if (activeTab === 'invoices') return <Invoices companies={companies} />;
  if (activeTab === 'plans') return <Plans plans={plans} />;
  if (activeTab === 'leads') return <Leads leads={leads} />;
  if (activeTab === 'notifications') return <Notifications notifications={notifications} />;
  if (activeTab === 'email-logs') return <EmailLogs logs={emailLogs} />;
  if (activeTab === 'security') return <Security logs={logs} />;
  if (activeTab === 'settings') return <SettingsPage />;
  if (activeTab === 'reports') return <Reports reports={reports} />;
  if (activeTab === 'activity-logs') return <ActivityLogs logs={logs} />;
  if (activeTab === 'support-tickets') return <SupportTickets tickets={tickets} />;
  if (activeTab === 'website-health') return <WebsiteHealth health={health} />;
  return <Overview companies={companies} users={users} notifications={notifications} />;
}

export default function SalesFlowHubExact() {
  const [activeTab, setActiveTab] = useState(viewFromUrl());
  const [drawer, setDrawer] = useState(false);
  const data = useMemo(() => ({
    companies: readStore(storage.companies, companiesSeed),
    users: readStore(storage.users, usersSeed),
    plans: readStore(storage.plans, plansSeed),
    leads: readStore(storage.leads, leadsSeed),
    notifications: logsSeed,
    emailLogs: readStore('salesflow_email_logs_v1', emailLogsSeed),
    logs: readStore(storage.logs, activityLogsSeed),
    tickets: readStore(storage.tickets, ticketsSeed),
    health: readStore(storage.health, healthSeed),
    reports: readStore('salesflow_reports_v1', reportsSeed)
  }), []);

  useEffect(() => {
    const sync = () => setActiveTab(viewFromUrl());
    window.addEventListener('popstate', sync);
    window.addEventListener('salesflow:navigate', sync);
    return () => { window.removeEventListener('popstate', sync); window.removeEventListener('salesflow:navigate', sync); };
  }, []);

  return <div className="sfh-exact"><Sidebar activeTab={activeTab} setActiveTab={setActiveTab} notificationCount={data.notifications.length} healthBadgeCount={data.health.length} /><main><Header onOpenNotifications={() => setDrawer(true)} unread={data.notifications.length} /><section className="sfh-content"><Content activeTab={activeTab} data={data} /></section></main><NotificationDrawer open={drawer} notifications={data.notifications} onClose={() => setDrawer(false)} /></div>;
}
