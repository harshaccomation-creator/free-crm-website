import { useEffect, useMemo, useState } from 'react';
import DashboardSidebar from '../../components/dashboard/DashboardSidebar.jsx';
import '../../styles/dashboardBase.css';
import '../../styles/referenceDashboardExact.css';
import '../../styles/sidebarGlobalFinalLock.css';
import '../../styles/superAdminPremium.css';

const emptyData = {
  stats: {},
  recentUsers: [],
  companies: [],
  pendingSignups: [],
  growth: [],
  generatedAt: '',
};

function formatDate(value) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function statusClass(status) {
  const text = String(status || '').toLowerCase();
  if (text.includes('active') || text.includes('paid')) return 'green';
  if (text.includes('trial') || text.includes('pending')) return 'orange';
  if (text.includes('expired') || text.includes('inactive') || text.includes('suspend')) return 'red';
  return 'blue';
}

function initials(value) {
  return String(value || 'S').trim().slice(0, 1).toUpperCase();
}

function navigateTo(path) {
  window.history.pushState({}, '', path);
  window.dispatchEvent(new Event('salesflow:navigate'));
}

function StatCard({ icon, label, value, trend, tone = 'blue' }) {
  return (
    <article className={`sa-stat-card tone-${tone}`}>
      <span className="sa-stat-icon">{icon}</span>
      <div>
        <small>{label}</small>
        <strong>{value}</strong>
        <em>{trend}</em>
      </div>
      <i>i</i>
    </article>
  );
}

function RevenueChart({ growth = [] }) {
  const points = useMemo(() => {
    const source = growth.length ? growth : [
      { month: 'May 12', users: 30 }, { month: 'May 19', users: 48 },
      { month: 'May 26', users: 42 }, { month: 'Jun 02', users: 70 },
      { month: 'Jun 09', users: 61 }, { month: 'Jun 12', users: 92 },
    ];
    const max = Math.max(...source.map((item) => Number(item.users) || 0), 1);
    return source.slice(-8).map((item, index, arr) => {
      const x = arr.length === 1 ? 80 : 50 + (index * 610) / Math.max(arr.length - 1, 1);
      const y = 210 - ((Number(item.users) || 0) / max) * 150;
      return { ...item, x, y };
    });
  }, [growth]);

  const line = points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ');
  const fill = `${line} L ${points[points.length - 1]?.x || 50} 226 L ${points[0]?.x || 50} 226 Z`;

  return (
    <div className="sa-chart sa-revenue-chart">
      <svg viewBox="0 0 720 260" aria-label="Platform growth chart">
        {[60, 100, 140, 180, 220].map((y) => <line key={y} x1="44" y1={y} x2="680" y2={y} className="sa-chart-grid" />)}
        <path d={fill} className="sa-chart-fill" />
        <path d={line} className="sa-chart-line" />
        {points.map((point) => <circle key={`${point.month}-${point.x}`} cx={point.x} cy={point.y} r="5" className="sa-chart-dot" />)}
        {points.map((point, index) => <text key={`${point.month}-${index}`} x={point.x - 18} y="248" className="sa-chart-label">{point.month}</text>)}
      </svg>
    </div>
  );
}

function BarChart() {
  const bars = [48, 35, 70, 44, 82, 52, 64, 88, 46, 72, 91, 55];
  return (
    <div className="sa-bar-chart">
      {bars.map((height, index) => (
        <span key={index} style={{ '--h': `${height}%` }}><b /></span>
      ))}
    </div>
  );
}

export default function SuperAdminDashboard() {
  const [data, setData] = useState(emptyData);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      setMessage('');
      const response = await fetch('/api/super-admin-overview');
      const result = await response.json();
      if (!response.ok || result.ok === false) throw new Error(result.message || 'Unable to load dashboard data.');
      setData(result);
    } catch (error) {
      setMessage(error.message || 'Unable to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const toggleUser = async (user) => {
    try {
      setMessage('');
      const response = await fetch('/api/super-admin-overview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'toggleUser', userId: user.id, isActive: !user.isActive }),
      });
      const result = await response.json();
      if (!response.ok || result.ok === false) throw new Error(result.message || 'Unable to update user.');
      setMessage(result.message || 'Updated successfully.');
      loadData();
    } catch (error) {
      setMessage(error.message || 'Unable to update user.');
    }
  };

  const stats = data.stats || {};
  const companies = data.companies || [];
  const recentUsers = data.recentUsers || [];
  const pendingSignups = data.pendingSignups || [];
  const superName = localStorage.getItem('salesflow_user_email')?.split('@')[0] || 'Super Admin';
  const activeCompanies = stats.activeCompanies || companies.filter((company) => String(company.status || '').toLowerCase().includes('active')).length || 0;
  const trialCompanies = stats.trialCompanies || companies.filter((company) => String(company.status || '').toLowerCase().includes('trial')).length || 0;
  const paidCompanies = stats.paidCompanies || companies.filter((company) => String(company.plan || '').toLowerCase() !== 'free').length || 0;
  const expiredTrials = stats.expiredTrials || companies.filter((company) => Number(company.trialDaysLeft) < 0).length || 0;

  return (
    <div className="sf-dashboard super-admin-premium-page sa-dark-shell">
      <DashboardSidebar role="superAdmin" />
      <main className="super-admin-main sa-main">
        <header className="sa-topbar">
          <div>
            <span className="super-kicker">SalesFlow Hub · Super Admin</span>
            <h1>Overview Dashboard</h1>
            <p>Welcome back, {superName}. Real-time platform overview and key metrics at a glance.</p>
          </div>
          <div className="super-actions sa-actions">
            <label><span>⌕</span><input placeholder="Search companies, users, invoices..." /></label>
            <button type="button" onClick={loadData}>{loading ? 'Loading...' : 'Refresh'}</button>
          </div>
        </header>

        {message && <div className="super-message sa-message">{message}</div>}

        <section className="sa-stats-grid">
          <StatCard icon="🏢" label="Total Companies" value={stats.totalCompanies || companies.length || 0} trend="↑ platform workspaces" tone="blue" />
          <StatCard icon="✅" label="Active Companies" value={activeCompanies} trend="↑ healthy accounts" tone="green" />
          <StatCard icon="⏱" label="Trial Companies" value={trialCompanies} trend="↑ trial pipeline" tone="purple" />
          <StatCard icon="💳" label="Paid Companies" value={paidCompanies} trend="↑ paid customers" tone="blue" />
          <StatCard icon="⌛" label="Expired Trials" value={expiredTrials} trend="needs follow-up" tone="orange" />
          <StatCard icon="👥" label="Total Users" value={stats.totalUsers || recentUsers.length || 0} trend={`${stats.activeUsers || 0} active users`} tone="cyan" />
          <StatCard icon="₹" label="Monthly Revenue" value={stats.monthlyRevenue ? `₹${stats.monthlyRevenue}` : '₹0'} trend="connect billing data" tone="purple" />
          <StatCard icon="📥" label="Pending Signups" value={stats.pendingSignups || pendingSignups.length || 0} trend="waiting verification" tone="red" />
        </section>

        <section className="sa-overview-grid">
          <article className="super-card sa-panel sa-chart-panel">
            <div className="super-card-head sa-panel-head"><div><h2>Revenue / Growth Overview</h2><p>Connected with Super Admin overview API.</p></div><span>{stats.uptime || '99.98%'} uptime</span></div>
            <RevenueChart growth={data.growth} />
          </article>

          <article className="super-card sa-panel sa-chart-panel">
            <div className="super-card-head sa-panel-head"><div><h2>Company Growth</h2><p>New companies and activation trend.</p></div><span>Monthly</span></div>
            <BarChart />
          </article>

          <article className="super-card sa-panel sa-activity-panel">
            <div className="super-card-head sa-panel-head"><div><h2>Recent Activity</h2><p>Latest users and signups.</p></div><button type="button" onClick={() => navigateTo('/super-admin/activity-logs')}>View All</button></div>
            <div className="sa-activity-list">
              {recentUsers.slice(0, 5).map((user) => (
                <div className="sa-activity-row" key={user.id || user.email}>
                  <span>{initials(user.name || user.email)}</span>
                  <div><strong>{user.name || 'User'}</strong><small>{user.email}</small></div>
                  <em>{user.isActive ? 'Active' : 'Inactive'}</em>
                </div>
              ))}
              {pendingSignups.slice(0, 3).map((item) => (
                <div className="sa-activity-row" key={item.id || item.email}>
                  <span>{initials(item.name || item.email)}</span>
                  <div><strong>{item.name || 'Signup'}</strong><small>{item.email}</small></div>
                  <em>{item.status || 'Pending'}</em>
                </div>
              ))}
              {!loading && !recentUsers.length && !pendingSignups.length && <p className="super-empty">No recent activity found.</p>}
            </div>
          </article>
        </section>

        <section className="sa-bottom-grid">
          <article className="super-card sa-panel">
            <div className="super-card-head sa-panel-head"><div><h2>Recent Companies</h2><p>Company name, plan, users, status and trial.</p></div><button type="button" onClick={() => navigateTo('/super-admin/companies')}>View All</button></div>
            <div className="super-table-wrap sa-table-wrap">
              <table>
                <thead><tr><th>Company</th><th>Plan</th><th>Users</th><th>Status</th><th>Trial</th><th>Admin</th></tr></thead>
                <tbody>
                  {companies.slice(0, 7).map((company) => (
                    <tr key={company.id || company.name}>
                      <td><strong>{company.name}</strong><small>{formatDate(company.createdAt)}</small></td>
                      <td><span className="super-pill blue">{company.plan || 'Starter'}</span></td>
                      <td>{company.users || 0}</td>
                      <td><span className={`super-pill ${statusClass(company.status)}`}>{company.status || 'Active'}</span></td>
                      <td>{company.trialDaysLeft === null || company.trialDaysLeft === undefined ? '-' : company.trialDaysLeft >= 0 ? `${company.trialDaysLeft} days left` : 'Expired'}</td>
                      <td>{company.adminEmail || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!loading && !companies.length && <p className="super-empty">No companies found.</p>}
            </div>
          </article>

          <article className="super-card sa-panel">
            <div className="super-card-head sa-panel-head"><div><h2>Users Control</h2><p>Activate or deactivate recent users safely.</p></div></div>
            <div className="super-user-list sa-user-list">
              {recentUsers.slice(0, 6).map((user) => (
                <div className="super-user-row sa-user-row" key={user.id || user.email}>
                  <span>{initials(user.name || user.email)}</span>
                  <div><strong>{user.name || 'User'}</strong><small>{user.email}</small></div>
                  <button type="button" className={user.isActive ? 'danger' : 'success'} onClick={() => toggleUser(user)}>{user.isActive ? 'Deactivate' : 'Activate'}</button>
                </div>
              ))}
              {!loading && !recentUsers.length && <p className="super-empty">No users found.</p>}
            </div>
          </article>
        </section>
      </main>
    </div>
  );
}
