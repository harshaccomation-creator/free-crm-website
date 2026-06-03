import { useEffect, useMemo, useState } from 'react';
import DashboardSidebar from '../../components/dashboard/DashboardSidebar.jsx';
import '../../styles/dashboardBase.css';
import '../../styles/superAdminPremium.css';
import '../../styles/superAdminPanelPolish.css';

const pageMeta = {
  companies: ['Companies', 'Manage all companies and their subscriptions in one place.'],
  'users-roles': ['Users & Roles', 'Manage platform users, roles, and access permissions.'],
  subscriptions: ['Subscriptions', 'Manage all company subscriptions, trials, payments, and billing in one place.'],
  'revenue-plans': ['Revenue & Plans', 'Track revenue performance, analyze plans, and manage pricing.'],
  'leads-monitor': ['Leads Monitor', 'Track, manage and follow up on leads across all companies in real time.'],
  notifications: ['Notifications', 'Monitor system notifications and platform alerts.'],
  'email-logs': ['Email Logs', 'Monitor OTP, reports, reminders and delivery failures.'],
  security: ['Security', 'Monitor security events, access and system protection.'],
  'platform-settings': ['Platform Settings', 'Manage platform configuration and global controls.'],
  reports: ['Reports', 'Export platform revenue, growth, trial and user reports.'],
  'activity-logs': ['Activity Logs', 'Review recent signup, access and platform activity.'],
  'support-tickets': ['Support Tickets', 'Handle client issues, billing problems and support requests.'],
  users: ['Users & Roles', 'Manage platform users, roles, and access permissions.'],
  roles: ['Users & Roles', 'Manage platform users, roles, and access permissions.'],
  organizations: ['Companies', 'Manage all companies and their subscriptions in one place.'],
  billing: ['Subscriptions', 'Manage all company subscriptions, trials, payments, and billing in one place.'],
  settings: ['Platform Settings', 'Manage platform configuration and global controls.'],
  'system-logs': ['Security', 'Monitor security events, access and system protection.'],
  integrations: ['Platform Settings', 'Manage connected support, email and CRM services.'],
  backup: ['Reports', 'Backup, export and restore platform data.'],
};

const normalizeView = (view) => ({ users: 'users-roles', roles: 'users-roles', organizations: 'companies', billing: 'subscriptions', settings: 'platform-settings', 'system-logs': 'security', integrations: 'platform-settings', backup: 'reports' }[view] || view || 'companies');

function statusClass(status) {
  const text = String(status || '').toLowerCase();
  if (text.includes('active') || text.includes('paid') || text.includes('sent') || text.includes('resolved')) return 'green';
  if (text.includes('trial') || text.includes('pending') || text.includes('medium') || text.includes('progress')) return 'orange';
  if (text.includes('expired') || text.includes('inactive') || text.includes('failed') || text.includes('high') || text.includes('suspend') || text.includes('open')) return 'red';
  return 'blue';
}

function dateText(value) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function initials(value) { return String(value || 'S').trim().slice(0, 1).toUpperCase(); }

function StatCard({ icon, label, value, tone = 'blue', hint = 'vs last 30 days' }) {
  return <article className={`sa-stat-card tone-${tone}`}><span className="sa-stat-icon">{icon}</span><div><small>{label}</small><strong>{value}</strong><em>{hint}</em></div><i>i</i></article>;
}

function PageShell({ children, title, subtitle, query, setQuery, loading, loadData, message }) {
  return (
    <div className="sf-dashboard super-admin-premium-page sa-dark-shell super-panel-polish">
      <DashboardSidebar role="superAdmin" />
      <main className="super-admin-main sa-main">
        <header className="sa-topbar">
          <div><span className="super-kicker">SalesFlow Hub · Super Admin</span><h1>{title}</h1><p>{subtitle}</p></div>
          <div className="super-actions sa-actions"><label><span>⌕</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search companies, users, emails..." /></label><button type="button" onClick={loadData}>{loading ? 'Loading...' : 'Refresh'}</button></div>
        </header>
        {message && <div className="super-message sa-message">{message}</div>}
        {children}
      </main>
    </div>
  );
}

function SimpleDonut({ total = 0, label = 'Total' }) {
  return <div className="sa-donut"><div><strong>{total}</strong><small>{label}</small></div></div>;
}

function CompaniesPage({ data, query }) {
  const companies = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (data.companies || []).filter((c) => !q || `${c.name} ${c.adminEmail} ${c.plan} ${c.status}`.toLowerCase().includes(q));
  }, [data.companies, query]);
  const stats = data.stats || {};
  const active = stats.activeCompanies || companies.filter((c) => String(c.status || '').toLowerCase().includes('active')).length;
  const trial = stats.trialCompanies || companies.filter((c) => String(c.status || '').toLowerCase().includes('trial')).length;
  const suspended = companies.filter((c) => String(c.status || '').toLowerCase().includes('suspend')).length;
  return <>
    <section className="sa-filter-pills"><span className="active">All <b>{companies.length}</b></span><span>Trial <b>{trial}</b></span><span>Active <b>{active}</b></span><span>Suspended <b>{suspended}</b></span><button type="button">+ Add Company</button></section>
    <section className="sa-stats-grid four"><StatCard icon="🏢" label="Total Companies" value={stats.totalCompanies || companies.length} tone="blue" /><StatCard icon="✅" label="Active Companies" value={active} tone="green" /><StatCard icon="⏱" label="Trial Companies" value={trial} tone="purple" /><StatCard icon="⛔" label="Suspended Companies" value={suspended} tone="red" /></section>
    <section className="sa-feature-grid right-rail"><article className="super-card sa-panel"><div className="super-card-head sa-panel-head"><div><h2>Company Management</h2><p>{companies.length} records</p></div><span>Export</span></div><div className="super-table-wrap sa-table-wrap"><table><thead><tr><th>Company Name</th><th>Owner Email</th><th>Plan</th><th>Trial Status</th><th>Status</th><th>Total Users</th><th>Created Date</th><th>Actions</th></tr></thead><tbody>{companies.slice(0, 12).map((c) => <tr key={c.id || c.name}><td><strong>{c.name}</strong><small>{c.adminEmail}</small></td><td>{c.adminEmail || '-'}</td><td><span className="super-pill blue">{c.plan || 'Starter'}</span></td><td>{c.trialDaysLeft === null || c.trialDaysLeft === undefined ? 'Completed' : c.trialDaysLeft >= 0 ? `${c.trialDaysLeft} days left` : 'Expired'}</td><td><span className={`super-pill ${statusClass(c.status)}`}>{c.status || 'Active'}</span></td><td>{c.users || 0}</td><td>{dateText(c.createdAt)}</td><td><button className="sa-small-btn">View</button></td></tr>)}</tbody></table></div></article><aside className="sa-rail"><article className="super-card sa-panel"><div className="super-card-head sa-panel-head"><div><h2>Recent Registrations</h2><p>Latest companies</p></div></div><div className="sa-activity-list">{companies.slice(0, 5).map((c) => <div className="sa-activity-row" key={c.id || c.name}><span>{initials(c.name)}</span><div><strong>{c.name}</strong><small>{c.adminEmail || 'Company admin'}</small></div><em>{dateText(c.createdAt)}</em></div>)}</div></article><article className="super-card sa-panel"><div className="super-card-head sa-panel-head"><div><h2>Company Health</h2><p>Active vs trial overview</p></div></div><SimpleDonut total={companies.length} label="Companies" /><div className="sa-health-list"><span><b />Active {active}</span><span><b />Trial {trial}</span><span><b />Suspended {suspended}</span></div></article></aside></section>
  </>;
}

function UsersRolesPage({ data, query, toggleUser }) {
  const users = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (data.recentUsers || []).filter((u) => !q || `${u.name} ${u.email} ${u.role}`.toLowerCase().includes(q));
  }, [data.recentUsers, query]);
  const stats = data.stats || {};
  const admins = users.filter((u) => String(u.role || '').toLowerCase().includes('admin')).length;
  const managers = users.filter((u) => String(u.role || '').toLowerCase().includes('manager')).length;
  const employees = Math.max(users.length - admins - managers, 0);
  return <>
    <section className="sa-stats-grid five"><StatCard icon="👥" label="Total Users" value={stats.totalUsers || users.length} tone="cyan" /><StatCard icon="👑" label="Company Admins" value={admins} tone="purple" /><StatCard icon="🧑‍💼" label="Managers" value={managers} tone="blue" /><StatCard icon="🧑" label="Employees" value={employees} tone="green" /><StatCard icon="⛔" label="Suspended Users" value={stats.inactiveUsers || 0} tone="red" /></section>
    <section className="sa-feature-grid right-rail"><article className="super-card sa-panel"><div className="sa-filter-row"><span>All Companies</span><span>All Roles</span><span>All Status</span><button>Filters</button></div><div className="super-table-wrap sa-table-wrap"><table><thead><tr><th>User Name</th><th>Email</th><th>Role</th><th>Status</th><th>Trial</th><th>Created Date</th><th>Action</th></tr></thead><tbody>{users.slice(0, 12).map((u) => <tr key={u.id || u.email}><td><strong>{u.name || 'User'}</strong></td><td>{u.email}</td><td><span className="super-pill blue">{u.role || 'Employee'}</span></td><td><span className={`super-pill ${u.isActive ? 'green' : 'red'}`}>{u.isActive ? 'Active' : 'Inactive'}</span></td><td>{u.trialDaysLeft === null ? '-' : u.trialDaysLeft >= 0 ? `${u.trialDaysLeft} days` : 'Expired'}</td><td>{dateText(u.createdAt)}</td><td><button className={u.isActive ? 'table-danger' : 'table-success'} type="button" onClick={() => toggleUser(u)}>{u.isActive ? 'Deactivate' : 'Activate'}</button></td></tr>)}</tbody></table></div></article><aside className="sa-rail"><article className="super-card sa-panel"><div className="super-card-head sa-panel-head"><div><h2>Role Distribution</h2><p>Users by role</p></div></div><SimpleDonut total={stats.totalUsers || users.length} label="Users" /><div className="sa-health-list"><span><b />Admins {admins}</span><span><b />Managers {managers}</span><span><b />Employees {employees}</span></div></article><article className="super-card sa-panel"><div className="super-card-head sa-panel-head"><div><h2>Recent User Activity</h2><p>Latest user records</p></div></div><div className="sa-activity-list">{users.slice(0, 5).map((u) => <div className="sa-activity-row" key={u.id || u.email}><span>{initials(u.name || u.email)}</span><div><strong>{u.name || 'User'}</strong><small>{u.email}</small></div><em>{u.isActive ? 'Active' : 'Inactive'}</em></div>)}</div></article></aside></section>
  </>;
}

function SubscriptionsPage({ data, query }) {
  const companies = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (data.companies || []).filter((c) => !q || `${c.name} ${c.adminEmail} ${c.plan} ${c.status}`.toLowerCase().includes(q));
  }, [data.companies, query]);
  const trial = companies.filter((c) => String(c.status || '').toLowerCase().includes('trial')).length;
  const expired = companies.filter((c) => Number(c.trialDaysLeft) < 0).length;
  const paid = companies.filter((c) => String(c.plan || '').toLowerCase() !== 'free').length;
  return <><section className="sa-stats-grid five"><StatCard icon="💳" label="Active Paid Companies" value={paid} tone="green" /><StatCard icon="⏱" label="Trial Companies" value={trial} tone="purple" /><StatCard icon="⌛" label="Expired Trials" value={expired} tone="orange" /><StatCard icon="❌" label="Cancelled Plans" value="0" tone="red" /><StatCard icon="₹" label="Monthly Revenue" value="₹0" tone="purple" hint="billing connect ready" /></section><section className="super-card sa-panel"><div className="sa-filter-row"><span>All Plans</span><span>All Statuses</span><span>Trial Ending Soon</span><span>Date Range</span><button>Reset Filters</button></div><div className="super-table-wrap sa-table-wrap"><table><thead><tr><th>Company</th><th>Owner Email</th><th>Plan</th><th>Trial End Date</th><th>Payment Status</th><th>Subscription Status</th><th>Billing Cycle</th><th>Action</th></tr></thead><tbody>{companies.slice(0, 12).map((c) => <tr key={c.id || c.name}><td><strong>{c.name}</strong></td><td>{c.adminEmail || '-'}</td><td><span className="super-pill blue">{c.plan || 'Starter'}</span></td><td>{c.trialDaysLeft === null || c.trialDaysLeft === undefined ? '-' : c.trialDaysLeft >= 0 ? `${c.trialDaysLeft} days left` : 'Expired'}</td><td><span className="super-pill green">Paid</span></td><td><span className={`super-pill ${statusClass(c.status)}`}>{c.status || 'Active'}</span></td><td>Monthly</td><td><button className="sa-small-btn">Manage</button></td></tr>)}</tbody></table></div></section></>;
}

function RevenuePlansPage({ data }) {
  const companies = data.companies || [];
  const paid = companies.filter((c) => String(c.plan || '').toLowerCase() !== 'free').length;
  return <><section className="sa-stats-grid five"><StatCard icon="₹" label="MRR" value="₹0" tone="blue" hint="billing ready" /><StatCard icon="₹" label="ARR" value="₹0" tone="green" hint="billing ready" /><StatCard icon="👥" label="Avg Revenue" value="₹0" tone="purple" /><StatCard icon="📉" label="Churn Rate" value="0%" tone="red" /><StatCard icon="🚀" label="New Upgrades" value={paid} tone="blue" /></section><section className="sa-overview-grid revenue"><article className="super-card sa-panel"><div className="super-card-head sa-panel-head"><div><h2>Revenue Analytics</h2><p>Total revenue over time with growth trend.</p></div><span>Monthly</span></div><div className="sa-fake-line-chart"><i /><i /><i /><i /><i /></div></article><article className="super-card sa-panel"><div className="super-card-head sa-panel-head"><div><h2>Plan Performance</h2><p>Revenue by plan over time.</p></div><span>Monthly</span></div><div className="sa-fake-line-chart small"><i /><i /><i /><i /></div></article></section><section className="super-card sa-panel"><div className="super-card-head sa-panel-head"><div><h2>Pricing Plans</h2><p>Manage your subscription plans and pricing.</p></div><button type="button">+ Create Plan</button></div><div className="super-table-wrap sa-table-wrap"><table><thead><tr><th>Plan Name</th><th>Price</th><th>Billing Cycle</th><th>User Limit</th><th>Feature Access</th><th>Status</th><th>Action</th></tr></thead><tbody>{[['Starter','₹999','Monthly','5 users','Basic features','Active'],['Professional','₹2499','Monthly','25 users','Core features','Active'],['Enterprise','Custom','Monthly','Unlimited','All features','Active']].map((p) => <tr key={p[0]}><td><strong>{p[0]}</strong></td><td>{p[1]}</td><td>{p[2]}</td><td>{p[3]}</td><td>{p[4]}</td><td><span className="super-pill green">{p[5]}</span></td><td><button className="sa-small-btn">Edit</button></td></tr>)}</tbody></table></div></section></>;
}

function LeadsMonitorPage({ data }) {
  const companies = data.companies || [];
  const leads = companies.slice(0, 8).map((c, i) => ({ company: c.name, lead: ['John Smith','Michael Brown','Emily Davis','Robert Wilson','Jessica Taylor','Daniel Martinez','Tony Stark','Bruce Wayne'][i] || 'Lead', assigned: ['Sarah Johnson','David Lee','James Carter'][i % 3], status: ['Assigned','Demo Done','Won','Overdue','Assigned','Lost','Demo Done','Junk'][i] || 'Assigned', date: i === 3 ? '2 days overdue' : i % 2 ? 'In 2 days' : 'Tomorrow' }));
  return <><section className="sa-filter-row wide"><span>All Companies</span><span>All Statuses</span><span>All Users</span><span>Date Range</span><button>Export</button></section><section className="sa-stats-grid five"><StatCard icon="👥" label="Total Leads" value={leads.length || 0} tone="blue" /><StatCard icon="👤" label="Assigned Leads" value={leads.filter(l => l.status === 'Assigned').length} tone="cyan" /><StatCard icon="🏆" label="Won Leads" value={leads.filter(l => l.status === 'Won').length} tone="green" /><StatCard icon="⚠️" label="Overdue Leads" value={leads.filter(l => l.status === 'Overdue').length} tone="orange" /><StatCard icon="❌" label="Lost Leads" value={leads.filter(l => l.status === 'Lost').length} tone="red" /></section><section className="super-card sa-panel"><div className="super-card-head sa-panel-head"><div><h2>Leads List</h2><p>Company-wise monitor view.</p></div></div><div className="super-table-wrap sa-table-wrap"><table><thead><tr><th>Company Name</th><th>Lead Name</th><th>Assigned To</th><th>Status</th><th>Follow-up Date</th><th>Created By</th><th>Updated Date</th></tr></thead><tbody>{leads.map((l, i) => <tr key={`${l.company}-${i}`}><td><strong>{l.company}</strong></td><td>{l.lead}</td><td>{l.assigned}</td><td><span className={`super-pill ${statusClass(l.status)}`}>{l.status}</span></td><td>{l.date}</td><td>Super Admin</td><td>Today</td></tr>)}</tbody></table></div></section></>;
}

function NotificationsEmailPage({ data, isEmail = false }) {
  const items = (data.pendingSignups || []).slice(0, 5);
  return <><section className="sa-stats-grid four"><StatCard icon="🔔" label="Unread Alerts" value={items.length} tone="blue" /><StatCard icon="⏱" label="Trial Alerts" value="0" tone="purple" /><StatCard icon="₹" label="Payment Alerts" value="0" tone="orange" /><StatCard icon="✉️" label="SMTP Failures" value="0" tone="red" /></section><section className="sa-feature-grid"><article className="super-card sa-panel"><div className="super-card-head sa-panel-head"><div><h2>Notifications</h2><p>System alerts and signup events.</p></div><span>All</span></div><div className="sa-activity-list large">{items.map((item) => <div className="sa-activity-row" key={item.id || item.email}><span>{initials(item.name || item.email)}</span><div><strong>{item.name || 'Pending signup'}</strong><small>{item.email}</small></div><em>{item.status || 'Pending'}</em></div>)}{!items.length && <p className="super-empty">No notifications found.</p>}</div></article><article className="super-card sa-panel"><div className="super-card-head sa-panel-head"><div><h2>Email Logs</h2><p>{isEmail ? 'Email delivery log view.' : 'Recent email status.'}</p></div><span>Sent</span></div><div className="super-table-wrap sa-table-wrap"><table><thead><tr><th>Email Type</th><th>To Email</th><th>Status</th><th>Error Message</th></tr></thead><tbody>{['OTP Email','Trial Expiry','Weekly Report','Payment Reminder'].map((type, i) => <tr key={type}><td>{type}</td><td>{items[i]?.email || 'admin@salesflowhub.cloud'}</td><td><span className="super-pill green">Ready</span></td><td>-</td></tr>)}</tbody></table></div></article></section></>;
}

function SecurityActivityPage({ data }) {
  const users = data.recentUsers || [];
  return <><section className="sa-stats-grid four"><StatCard icon="🔐" label="Failed Login Attempts" value="0" tone="red" /><StatCard icon="🌐" label="Blocked IPs" value="0" tone="orange" /><StatCard icon="👤" label="Suspicious Sessions" value="0" tone="purple" /><StatCard icon="↪" label="Force Logout Actions" value="0" tone="blue" /></section><section className="sa-overview-grid security"><article className="super-card sa-panel"><div className="super-card-head sa-panel-head"><div><h2>Security Incidents</h2><p>Security monitor ready.</p></div></div><div className="sa-activity-list"><div className="sa-activity-row"><span>✓</span><div><strong>No critical incident</strong><small>Platform security looks clean</small></div><em>Now</em></div></div></article><article className="super-card sa-panel"><div className="super-card-head sa-panel-head"><div><h2>Access Control</h2><p>User actions</p></div></div><div className="sa-control-stack"><button>Block User</button><button>Unblock User</button><button>Force Logout</button><button>Reset Access</button></div></article></section><section className="super-card sa-panel"><div className="super-card-head sa-panel-head"><div><h2>Activity Logs</h2><p>Recent user records as activity source.</p></div></div><div className="super-table-wrap sa-table-wrap"><table><thead><tr><th>Date & Time</th><th>User</th><th>Action</th><th>Module</th><th>Details</th></tr></thead><tbody>{users.slice(0, 8).map((u) => <tr key={u.id || u.email}><td>{dateText(u.createdAt)}</td><td><strong>{u.name || 'User'}</strong><small>{u.email}</small></td><td><span className={`super-pill ${u.isActive ? 'green' : 'red'}`}>{u.isActive ? 'Active' : 'Inactive'}</span></td><td>User Management</td><td>{u.role || 'Employee'}</td></tr>)}</tbody></table></div></section></>;
}

function SettingsReportsSupportPage({ view }) {
  const showReports = view === 'reports';
  const showSupport = view === 'support-tickets';
  return <><section className="sa-settings-grid"><article className="super-card sa-panel"><h2>Trial Days</h2><p>Set default trial period.</p><strong>7 days</strong></article><article className="super-card sa-panel"><h2>Default Plan</h2><p>New signup plan.</p><strong>Professional</strong></article><article className="super-card sa-panel"><h2>SMTP Settings</h2><p>Email server configuration.</p><button>Configure SMTP</button></article><article className="super-card sa-panel"><h2>Maintenance Mode</h2><p>Keep client CRM safe.</p><strong>Off</strong></article><article className="super-card sa-panel"><h2>WhatsApp Reminder</h2><p>Reminder controls.</p><strong>On</strong></article></section>{(showReports || !showSupport) && <section className="sa-report-grid"><article className="super-card sa-panel"><h2>Monthly Revenue Report</h2><p>Detailed monthly revenue breakdown.</p><button>PDF</button><button>Excel</button></article><article className="super-card sa-panel"><h2>Company Growth Report</h2><p>Signup and activation growth.</p><button>PDF</button><button>Excel</button></article><article className="super-card sa-panel"><h2>Trial Conversion Report</h2><p>Trial to paid conversion.</p><button>PDF</button><button>Excel</button></article></section>}<section className="super-card sa-panel"><div className="super-card-head sa-panel-head"><div><h2>Support Tickets</h2><p>Client issues and support status.</p></div></div><div className="super-table-wrap sa-table-wrap"><table><thead><tr><th>Ticket ID</th><th>Company</th><th>User</th><th>Issue Type</th><th>Priority</th><th>Status</th><th>Action</th></tr></thead><tbody>{[['TKT-12548','Acme Corporation','John Smith','Login Issue','High','Open'],['TKT-12547','Globex Corporation','Sarah Johnson','Billing','Medium','In Progress'],['TKT-12546','Soylent Corp','Michael Brown','Feature Request','Low','Resolved']].map((t) => <tr key={t[0]}><td>{t[0]}</td><td>{t[1]}</td><td>{t[2]}</td><td>{t[3]}</td><td><span className={`super-pill ${statusClass(t[4])}`}>{t[4]}</span></td><td><span className={`super-pill ${statusClass(t[5])}`}>{t[5]}</span></td><td><button className="sa-small-btn">View</button></td></tr>)}</tbody></table></div></section></>;
}

export default function SuperAdminSectionPage({ view = 'companies' }) {
  const normalizedView = normalizeView(view);
  const [data, setData] = useState({ stats: {}, recentUsers: [], companies: [], pendingSignups: [] });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [title, subtitle] = pageMeta[normalizedView] || pageMeta.companies;

  const loadData = async () => {
    try {
      setLoading(true);
      setMessage('');
      const res = await fetch('/api/super-admin-overview');
      const json = await res.json();
      if (!res.ok || json.ok === false) throw new Error(json.message || 'Unable to load data.');
      setData(json);
    } catch (err) {
      setMessage(err.message || 'Unable to load data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, [normalizedView]);

  const toggleUser = async (user) => {
    const res = await fetch('/api/super-admin-overview', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'toggleUser', userId: user.id, isActive: !user.isActive }) });
    const json = await res.json();
    setMessage(json.message || 'Updated.');
    loadData();
  };

  let content = <CompaniesPage data={data} query={query} />;
  if (normalizedView === 'users-roles') content = <UsersRolesPage data={data} query={query} toggleUser={toggleUser} />;
  if (normalizedView === 'subscriptions') content = <SubscriptionsPage data={data} query={query} />;
  if (normalizedView === 'revenue-plans') content = <RevenuePlansPage data={data} />;
  if (normalizedView === 'leads-monitor') content = <LeadsMonitorPage data={data} />;
  if (['notifications', 'email-logs'].includes(normalizedView)) content = <NotificationsEmailPage data={data} isEmail={normalizedView === 'email-logs'} />;
  if (['security', 'activity-logs'].includes(normalizedView)) content = <SecurityActivityPage data={data} />;
  if (['platform-settings', 'reports', 'support-tickets'].includes(normalizedView)) content = <SettingsReportsSupportPage view={normalizedView} />;

  return <PageShell title={title} subtitle={subtitle} query={query} setQuery={setQuery} loading={loading} loadData={loadData} message={message}>{content}</PageShell>;
}
