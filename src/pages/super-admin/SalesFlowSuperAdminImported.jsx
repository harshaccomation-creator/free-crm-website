import { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  AlertCircle,
  BarChart3,
  Bell,
  Building2,
  CalendarCheck,
  CheckCircle2,
  CreditCard,
  Globe2,
  LayoutDashboard,
  LogOut,
  Mail,
  Package,
  RefreshCw,
  Search,
  Shield,
  Ticket,
  Users,
  XCircle,
} from 'lucide-react';
import '../../styles/salesFlowSuperAdminImported.css';

const fallbackCompanies = [
  { id: 'CO-001', name: 'TechNova Global', adminEmail: 'admin@technova.io', plan: 'Enterprise', status: 'Active', users: 48, leads: 312, mrr: 24999, owner: 'Sarah Jenkins', country: 'USA' },
  { id: 'CO-002', name: 'Infosys BPO', adminEmail: 'crm@infosys.com', plan: 'Professional', status: 'Active', users: 22, leads: 187, mrr: 9999, owner: 'Aarav Patel', country: 'India' },
  { id: 'CO-003', name: 'HDFC Growth', adminEmail: 'sales@hdfc.com', plan: 'Enterprise', status: 'Active', users: 65, leads: 521, mrr: 24999, owner: 'Rahul Sharma', country: 'India' },
  { id: 'CO-004', name: 'Reliance Retail', adminEmail: 'tech@ril.com', plan: 'Starter', status: 'Trial', users: 5, leads: 34, mrr: 0, owner: 'Priya Desai', country: 'India' },
  { id: 'CO-005', name: 'Acme Corp', adminEmail: 'it@acme.co', plan: 'Professional', status: 'Active', users: 18, leads: 142, mrr: 9999, owner: 'Michael Chang', country: 'USA' },
  { id: 'CO-006', name: 'Vanguard Systems', adminEmail: 'ops@vanguardsys.com', plan: 'Enterprise', status: 'Active', users: 55, leads: 489, mrr: 24999, owner: 'Elena Rodriguez', country: 'USA' },
];

const fallbackUsers = [
  { id: 'U-001', name: 'Sarah Jenkins', email: 'sarah@technova.io', company: 'TechNova Global', role: 'Admin', plan: 'Enterprise', status: 'Active' },
  { id: 'U-002', name: 'Aarav Patel', email: 'aarav@infosys.com', company: 'Infosys BPO', role: 'Sales Rep', plan: 'Professional', status: 'Active' },
  { id: 'U-003', name: 'Rahul Sharma', email: 'rahul@hdfc.com', company: 'HDFC Growth', role: 'Manager', plan: 'Enterprise', status: 'Active' },
  { id: 'U-004', name: 'Priya Desai', email: 'priya@ril.com', company: 'Reliance Retail', role: 'Admin', plan: 'Starter', status: 'Trial' },
  { id: 'U-005', name: 'Vikram Singh', email: 'vikram@wipro.com', company: 'Wipro Digital', role: 'Sales Rep', plan: 'Professional', status: 'Suspended' },
];

const demoRequests = [
  { id: 'DM-001', name: 'Ravi Verma', email: 'ravi@zomato.com', phone: '+91 98765 43210', company: 'Zomato Enterprise', status: 'Pending', source: 'Website' },
  { id: 'DM-002', name: 'Pooja Nair', email: 'pooja@razorpay.com', phone: '+91 91234 56789', company: 'Razorpay CRM', status: 'Scheduled', source: 'Landing Page' },
  { id: 'DM-003', name: 'Amit Kumar', email: 'amit@mahindra.com', phone: '+91 99887 77665', company: 'Mahindra Tech', status: 'Completed', source: 'Website' },
];

const supportTickets = [
  { id: 'TKT-12548', subject: 'Unable to access billing page', user: 'John Smith', company: 'TechNova Global', category: 'Billing', priority: 'High', status: 'Open' },
  { id: 'TKT-12547', subject: 'Login OTP delay', user: 'Sarah Johnson', company: 'Infosys BPO', category: 'Login', priority: 'Medium', status: 'In Progress' },
  { id: 'TKT-12546', subject: 'Need new report filter', user: 'Michael Brown', company: 'HDFC Growth', category: 'Feature Request', priority: 'Low', status: 'Resolved' },
];

const emailLogs = [
  { id: 'EM-001', to: 'admin@technova.io', subject: 'OTP Verification', type: 'OTP', status: 'Delivered' },
  { id: 'EM-002', to: 'crm@infosys.com', subject: 'Trial expiry reminder', type: 'Reminder', status: 'Delivered' },
  { id: 'EM-003', to: 'sales@hdfc.com', subject: 'Weekly report', type: 'Report', status: 'Failed' },
];

const activityLogs = [
  { id: 'LOG-001', severity: 'Success', type: 'Login', action: 'Super admin logged in', user: 'Super Admin', company: 'Platform', ip: '103.21.XX.XX' },
  { id: 'LOG-002', severity: 'Info', type: 'Plan Change', action: 'Subscription upgraded', user: 'Sarah Jenkins', company: 'TechNova Global', ip: '192.168.XX.XX' },
  { id: 'LOG-003', severity: 'Warning', type: 'Payment', action: 'Payment retry scheduled', user: 'Priya Desai', company: 'Reliance Retail', ip: '172.16.XX.XX' },
];

const plans = [
  { name: 'Starter', price: 1999, cycle: 'Monthly', users: '5 users', features: 'Basic CRM, email tracking', active: 18 },
  { name: 'Professional', price: 9999, cycle: 'Monthly', users: '25 users', features: 'Advanced CRM, reports, API', active: 34 },
  { name: 'Enterprise', price: 24999, cycle: 'Monthly', users: 'Unlimited', features: 'White-label, SLA, dedicated support', active: 12 },
];

const navGroups = [
  { label: 'Main', items: [
    { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { key: 'companies', label: 'Companies', icon: Building2 },
    { key: 'users', label: 'Users', icon: Users },
  ] },
  { label: 'Billing', items: [
    { key: 'subscriptions', label: 'Subscriptions', icon: CreditCard },
    { key: 'plans', label: 'Plans', icon: Package },
  ] },
  { label: 'Operations', items: [
    { key: 'demo-requests', label: 'Demo Requests', icon: CalendarCheck },
    { key: 'support-tickets', label: 'Support Tickets', icon: Ticket },
  ] },
  { label: 'System', items: [
    { key: 'website-health', label: 'Website Health', icon: Globe2 },
    { key: 'activity-logs', label: 'Activity Logs', icon: Activity },
    { key: 'email-logs', label: 'Email Logs', icon: Mail },
  ] },
];

function formatINR(value) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Number(value || 0));
}

function statusClass(status) {
  const text = String(status || '').toLowerCase();
  if (text.includes('active') || text.includes('delivered') || text.includes('completed') || text.includes('resolved')) return 'green';
  if (text.includes('trial') || text.includes('pending') || text.includes('medium') || text.includes('scheduled') || text.includes('progress')) return 'orange';
  if (text.includes('suspend') || text.includes('failed') || text.includes('high') || text.includes('open')) return 'red';
  return 'blue';
}

function initialView() {
  const view = new URLSearchParams(window.location.search).get('view');
  if (view === 'users-roles') return 'users';
  if (view === 'revenue-plans') return 'plans';
  if (view === 'leads-monitor') return 'dashboard';
  if (view === 'notifications') return 'activity-logs';
  if (view === 'security' || view === 'platform-settings' || view === 'reports') return 'website-health';
  return view || 'dashboard';
}

function Sidebar({ view, setView }) {
  const go = (key) => {
    setView(key);
    const suffix = key === 'dashboard' ? '' : `?view=${key}`;
    window.history.pushState({}, '', `/super-admin/dashboard${suffix}`);
    window.dispatchEvent(new Event('salesflow:navigate'));
  };

  return (
    <aside className="sfsa-sidebar">
      <div className="sfsa-brand">
        <div className="sfsa-brand-mark"><Shield size={21} /></div>
        <div>
          <strong>SalesFlow Hub</strong>
          <span>Super Admin</span>
        </div>
      </div>

      <nav className="sfsa-nav">
        {navGroups.map((group) => (
          <section key={group.label}>
            <p>{group.label}</p>
            {group.items.map(({ key, label, icon: Icon }) => (
              <button key={key} type="button" className={view === key ? 'active' : ''} onClick={() => go(key)}>
                <Icon size={18} />
                <span>{label}</span>
              </button>
            ))}
          </section>
        ))}
      </nav>

      <div className="sfsa-sidebar-user">
        <div className="sfsa-avatar">SA</div>
        <div>
          <strong>Super Admin</strong>
          <span>admin@salesflowhub.com</span>
        </div>
      </div>
      <button className="sfsa-logout" type="button"><LogOut size={16} /> Logout</button>
    </aside>
  );
}

function Topbar({ title, subtitle }) {
  return (
    <header className="sfsa-topbar">
      <div>
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
      <div className="sfsa-actions">
        <label><Search size={16} /><input placeholder="Search..." /></label>
        <button type="button"><Bell size={20} /><i /></button>
        <button type="button"><RefreshCw size={20} /></button>
        <div className="sfsa-mini-profile"><span>SA</span><b>Super Admin</b></div>
      </div>
    </header>
  );
}

function PageHeader({ title, subtitle }) {
  return (
    <div className="sfsa-page-header">
      <h2>{title}</h2>
      <p>{subtitle}</p>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, tone = 'orange', subtitle, trend }) {
  return (
    <article className="sfsa-stat-card">
      <div className={`sfsa-stat-icon ${tone}`}><Icon size={22} /></div>
      <div>
        <span>{title}</span>
        <strong>{value}</strong>
        {trend ? <em className="up">{trend}</em> : <small>{subtitle}</small>}
      </div>
    </article>
  );
}

function Badge({ children }) {
  return <span className={`sfsa-badge ${statusClass(children)}`}>{children}</span>;
}

function Table({ headers, rows }) {
  return (
    <div className="sfsa-table-card">
      <div className="sfsa-table-wrap">
        <table>
          <thead><tr>{headers.map((h) => <th key={h}>{h}</th>)}</tr></thead>
          <tbody>{rows}</tbody>
        </table>
      </div>
    </div>
  );
}

function DashboardPage({ companies, users }) {
  const activeCompanies = companies.filter((c) => String(c.status).toLowerCase().includes('active')).length;
  const totalUsers = companies.reduce((sum, c) => sum + Number(c.users || 0), 0);
  const totalMRR = companies.reduce((sum, c) => sum + Number(c.mrr || 0), 0);
  const pendingDemos = demoRequests.filter((d) => d.status === 'Pending').length;

  return (
    <div className="sfsa-page">
      <PageHeader title="Super Admin Dashboard" subtitle="Platform overview and key metrics" />
      <div className="sfsa-grid sfsa-grid-4">
        <StatCard title="Total MRR" value={formatINR(totalMRR)} icon={CreditCard} tone="orange" trend="+12.4% this month" />
        <StatCard title="Active Companies" value={activeCompanies} icon={Building2} tone="blue" trend="+3 this week" />
        <StatCard title="Total Users" value={totalUsers} icon={Users} tone="purple" trend="+48 this month" />
        <StatCard title="Pending Demos" value={pendingDemos} icon={CalendarCheck} tone="yellow" subtitle="Need scheduling" />
      </div>

      <div className="sfsa-grid sfsa-grid-2">
        <section className="sfsa-card sfsa-chart-card">
          <h3>Monthly Recurring Revenue</h3>
          <div className="sfsa-area-chart"><span /><span /><span /><span /><span /><span /></div>
        </section>
        <section className="sfsa-card sfsa-chart-card">
          <h3>User Growth</h3>
          <div className="sfsa-bar-chart"><span /><span /><span /><span /><span /><span /><span /></div>
        </section>
      </div>

      <div className="sfsa-grid sfsa-grid-3">
        <section className="sfsa-card">
          <h3>Plan Distribution</h3>
          <div className="sfsa-donut"><b>{companies.length}</b><small>Companies</small></div>
          {['Enterprise', 'Professional', 'Starter'].map((plan) => (
            <div className="sfsa-plan-row" key={plan}><span>{plan}</span><b>{companies.filter((c) => c.plan === plan).length}</b></div>
          ))}
        </section>
        <section className="sfsa-card sfsa-wide">
          <h3>Recent Activity</h3>
          {activityLogs.map((log) => (
            <div className="sfsa-activity-item" key={log.id}>
              <span><Activity size={15} /></span>
              <div><strong>{log.action}</strong><small>{log.user} · {log.company}</small></div>
              <em>Now</em>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}

function CompaniesPage({ companies }) {
  return <div className="sfsa-page"><PageHeader title="Companies" subtitle="Manage all companies and organizations using SalesFlow Hub" /><Table headers={['Company', 'Owner', 'Plan', 'Status', 'Users', 'Leads', 'MRR', 'Country']} rows={companies.map((c) => <tr key={c.id || c.name}><td><strong>{c.name}</strong><small>{c.adminEmail}</small></td><td>{c.owner || '-'}</td><td><Badge>{c.plan}</Badge></td><td><Badge>{c.status}</Badge></td><td>{c.users || 0}</td><td>{c.leads || 0}</td><td>{formatINR(c.mrr)}</td><td>{c.country || 'India'}</td></tr>)} /></div>;
}

function UsersPage({ users }) {
  return <div className="sfsa-page"><PageHeader title="Users" subtitle="Manage all users across companies" /><Table headers={['User', 'Email', 'Company', 'Role', 'Plan', 'Status']} rows={users.map((u) => <tr key={u.id || u.email}><td><strong>{u.name || 'User'}</strong></td><td>{u.email}</td><td>{u.company || '-'}</td><td>{u.role || 'Employee'}</td><td><Badge>{u.plan || 'Starter'}</Badge></td><td><Badge>{u.status || (u.isActive ? 'Active' : 'Inactive')}</Badge></td></tr>)} /></div>;
}

function SubscriptionsPage({ companies }) {
  return <div className="sfsa-page"><PageHeader title="Subscriptions" subtitle="Track subscriptions, trials and billing status" /><Table headers={['Company', 'Plan', 'Status', 'MRR', 'Next Billing', 'Payment Method']} rows={companies.map((c) => <tr key={c.id || c.name}><td><strong>{c.name}</strong></td><td><Badge>{c.plan}</Badge></td><td><Badge>{c.status}</Badge></td><td>{formatINR(c.mrr)}</td><td>Next month</td><td>Card / Bank</td></tr>)} /></div>;
}

function PlansPage() {
  return <div className="sfsa-page"><PageHeader title="Plans" subtitle="Create and manage pricing plans" /><div className="sfsa-grid sfsa-grid-3">{plans.map((p) => <article className="sfsa-card sfsa-plan-card" key={p.name}><Package size={28} /><h3>{p.name}</h3><strong>{formatINR(p.price)}</strong><p>{p.cycle}</p><small>{p.users}</small><button type="button">Edit Plan</button></article>)}</div><Table headers={['Plan', 'Price', 'Billing', 'Users', 'Features', 'Active Subs']} rows={plans.map((p) => <tr key={p.name}><td><strong>{p.name}</strong></td><td>{formatINR(p.price)}</td><td>{p.cycle}</td><td>{p.users}</td><td>{p.features}</td><td>{p.active}</td></tr>)} /></div>;
}

function DemoRequestsPage() {
  return <div className="sfsa-page"><PageHeader title="Demo Requests" subtitle="Track all incoming demo and trial requests" /><Table headers={['ID', 'Name', 'Email', 'Phone', 'Company', 'Source', 'Status']} rows={demoRequests.map((d) => <tr key={d.id}><td>{d.id}</td><td><strong>{d.name}</strong></td><td>{d.email}</td><td>{d.phone}</td><td>{d.company}</td><td>{d.source}</td><td><Badge>{d.status}</Badge></td></tr>)} /></div>;
}

function WebsiteHealthPage() {
  return <div className="sfsa-page"><PageHeader title="Website Health" subtitle="Monitor frontend, API and deployment status" /><div className="sfsa-grid sfsa-grid-4"><StatCard title="Frontend" value="Live" icon={CheckCircle2} tone="green" subtitle="Operational" /><StatCard title="API" value="Healthy" icon={Activity} tone="blue" subtitle="Operational" /><StatCard title="Deploy" value="Success" icon={Globe2} tone="orange" subtitle="Latest build" /><StatCard title="Errors" value="0" icon={XCircle} tone="red" subtitle="No critical issues" /></div></div>;
}

function ActivityLogsPage() {
  return <div className="sfsa-page"><PageHeader title="Activity Logs" subtitle="All user and platform events" /><Table headers={['Severity', 'Type', 'Action', 'User', 'Company', 'IP']} rows={activityLogs.map((log) => <tr key={log.id}><td><Badge>{log.severity}</Badge></td><td>{log.type}</td><td><strong>{log.action}</strong></td><td>{log.user}</td><td>{log.company}</td><td>{log.ip}</td></tr>)} /></div>;
}

function EmailLogsPage() {
  return <div className="sfsa-page"><PageHeader title="Email Logs" subtitle="All transactional emails sent from platform" /><Table headers={['To', 'Subject', 'Type', 'Status']} rows={emailLogs.map((e) => <tr key={e.id}><td>{e.to}</td><td><strong>{e.subject}</strong></td><td>{e.type}</td><td><Badge>{e.status}</Badge></td></tr>)} /></div>;
}

function SupportTicketsPage() {
  return <div className="sfsa-page"><PageHeader title="Support Tickets" subtitle="Customer issues and help requests" /><Table headers={['ID', 'Subject', 'User', 'Company', 'Category', 'Priority', 'Status']} rows={supportTickets.map((t) => <tr key={t.id}><td>{t.id}</td><td><strong>{t.subject}</strong></td><td>{t.user}</td><td>{t.company}</td><td>{t.category}</td><td><Badge>{t.priority}</Badge></td><td><Badge>{t.status}</Badge></td></tr>)} /></div>;
}

function CurrentPage({ view, companies, users }) {
  if (view === 'companies') return <CompaniesPage companies={companies} />;
  if (view === 'users') return <UsersPage users={users} />;
  if (view === 'subscriptions') return <SubscriptionsPage companies={companies} />;
  if (view === 'plans') return <PlansPage />;
  if (view === 'demo-requests') return <DemoRequestsPage />;
  if (view === 'website-health') return <WebsiteHealthPage />;
  if (view === 'activity-logs') return <ActivityLogsPage />;
  if (view === 'email-logs') return <EmailLogsPage />;
  if (view === 'support-tickets') return <SupportTicketsPage />;
  return <DashboardPage companies={companies} users={users} />;
}

export default function SalesFlowSuperAdminImported() {
  const [view, setView] = useState(initialView());
  const [data, setData] = useState({ companies: [], recentUsers: [] });

  useEffect(() => {
    const sync = () => setView(initialView());
    window.addEventListener('popstate', sync);
    window.addEventListener('salesflow:navigate', sync);
    return () => {
      window.removeEventListener('popstate', sync);
      window.removeEventListener('salesflow:navigate', sync);
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    fetch('/api/super-admin-overview')
      .then((res) => res.json())
      .then((json) => { if (mounted && json && json.ok !== false) setData(json); })
      .catch(() => {});
    return () => { mounted = false; };
  }, []);

  const companies = useMemo(() => {
    const raw = data.companies?.length ? data.companies : fallbackCompanies;
    return raw.map((c, index) => ({
      id: c.id || `CO-${index + 1}`,
      name: c.name || c.company_name || 'Company',
      adminEmail: c.adminEmail || c.admin_email || c.email || 'admin@salesflowhub.com',
      plan: c.plan || 'Starter',
      status: c.status || 'Active',
      users: c.users || c.totalUsers || 0,
      leads: c.leads || 0,
      mrr: c.mrr || c.monthlyRevenue || 0,
      owner: c.owner || c.adminName || '-',
      country: c.country || 'India',
    }));
  }, [data.companies]);

  const users = useMemo(() => {
    const raw = data.recentUsers?.length ? data.recentUsers : fallbackUsers;
    return raw.map((u, index) => ({
      id: u.id || `U-${index + 1}`,
      name: u.name || u.full_name || 'User',
      email: u.email || 'user@salesflowhub.com',
      company: u.company || u.companyName || '-',
      role: u.role || 'Employee',
      plan: u.plan || 'Starter',
      status: u.status || (u.isActive ? 'Active' : 'Inactive'),
    }));
  }, [data.recentUsers]);

  return (
    <div className="sfsa-shell">
      <Sidebar view={view} setView={setView} />
      <main className="sfsa-main">
        <Topbar title="SalesFlow Super Admin" subtitle="Complete platform control panel" />
        <CurrentPage view={view} companies={companies} users={users} />
      </main>
    </div>
  );
}
