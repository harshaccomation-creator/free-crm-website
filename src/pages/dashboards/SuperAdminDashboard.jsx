import { useEffect, useMemo, useState } from 'react';
import DashboardSidebar from '../../components/dashboard/DashboardSidebar.jsx';
import '../../styles/dashboardBase.css';
import '../../styles/superAdminDesignSystem.css';

const initialState = { stats: {}, recentUsers: [], companies: [], pendingSignups: [], growth: [] };

function formatDate(value) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function initials(value) {
  return String(value || 'S').trim().slice(0, 1).toUpperCase();
}

function badgeClass(value) {
  const text = String(value || '').toLowerCase();
  if (text.includes('active') || text.includes('paid') || text.includes('won')) return 'green';
  if (text.includes('trial') || text.includes('pending')) return 'orange';
  if (text.includes('expired') || text.includes('inactive') || text.includes('suspend')) return 'red';
  return 'blue';
}

function navigateTo(path) {
  window.history.pushState({}, '', path);
  window.dispatchEvent(new Event('salesflow:navigate'));
}

function StatCard({ icon, label, value, hint, accent = 'blue' }) {
  return (
    <article className={`sa-stat-card sa-accent-${accent}`}>
      <span className="sa-stat-icon">{icon}</span>
      <div className="sa-stat-copy">
        <small>{label}</small>
        <strong>{value}</strong>
        <em>{hint}</em>
      </div>
      <i>i</i>
    </article>
  );
}

function RevenueChart({ growth = [] }) {
  const points = useMemo(() => {
    const fallback = [32, 44, 39, 62, 56, 74, 68, 92];
    const values = growth.length ? growth.slice(-8).map((item) => Number(item.users) || 0) : fallback;
    const max = Math.max(...values, 1);
    return values.map((value, index) => {
      const x = 42 + (index * 616) / Math.max(values.length - 1, 1);
      const y = 220 - (value / max) * 160;
      return { x, y, value };
    });
  }, [growth]);
  const line = points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ');
  const fill = `${line} L ${points[points.length - 1]?.x || 42} 230 L ${points[0]?.x || 42} 230 Z`;
  return (
    <div className="sa-chart sa-line-chart">
      <svg viewBox="0 0 720 260" role="img" aria-label="Revenue growth chart">
        {[60, 100, 140, 180, 220].map((y) => <line key={y} x1="38" y1={y} x2="680" y2={y} className="sa-chart-grid" />)}
        <path d={fill} className="sa-chart-area" />
        <path d={line} className="sa-chart-line" />
        {points.map((point, index) => <circle key={index} cx={point.x} cy={point.y} r="5" className="sa-chart-dot" />)}
      </svg>
    </div>
  );
}

function GrowthBars() {
  const bars = [42, 58, 46, 72, 63, 82, 66, 92, 54, 76, 88, 70];
  return <div className="sa-bar-chart">{bars.map((height, index) => <span key={index} style={{ '--h': `${height}%` }}><b /></span>)}</div>;
}

export default function SuperAdminDashboard() {
  const [data, setData] = useState(initialState);
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
  const displayName = localStorage.getItem('salesflow_user_email')?.split('@')[0] || 'Super Admin';

  const activeCompanies = stats.activeCompanies || companies.filter((company) => String(company.status || '').toLowerCase().includes('active')).length || 0;
  const trialCompanies = stats.trialCompanies || companies.filter((company) => String(company.status || '').toLowerCase().includes('trial')).length || 0;
  const paidCompanies = stats.paidCompanies || companies.filter((company) => String(company.plan || '').toLowerCase() !== 'free').length || 0;
  const expiredTrials = stats.expiredTrials || companies.filter((company) => Number(company.trialDaysLeft) < 0).length || 0;

  return (
    <div className="sf-dashboard super-admin-premium-page sa-dashboard-page">
      <DashboardSidebar role="superAdmin" />
      <main className="super-admin-main">
        <div className="sa-dashboard-inner">
          <header className="sa-topbar sa-hero-topbar">
            <div className="sa-title">
              <span className="super-kicker">SalesFlow Hub · Super Admin</span>
              <h1>Overview Dashboard</h1>
              <p>Welcome back, {displayName}. Control companies, trials, subscriptions and platform health from one premium command center.</p>
            </div>
            <label className="sa-search">
              <span>⌕</span>
              <input placeholder="Search company, user, plan, invoice..." />
            </label>
            <div className="sa-top-actions">
              <button className="sa-icon-btn" type="button" aria-label="Notifications">🔔</button>
              <button className="sa-icon-btn" type="button" aria-label="Help">?</button>
              <button className="sa-refresh" type="button" onClick={loadData}>{loading ? 'Loading...' : 'Refresh'}</button>
            </div>
          </header>

          {message && <div className="super-message sa-message">{message}</div>}

          <section className="sa-stats-grid">
            <StatCard icon="🏢" label="Total Companies" value={stats.totalCompanies || companies.length || 0} hint="Platform workspaces" accent="blue" />
            <StatCard icon="✅" label="Active Companies" value={activeCompanies} hint="Healthy accounts" accent="green" />
            <StatCard icon="⏱" label="Trial Companies" value={trialCompanies} hint="Trial pipeline" accent="purple" />
            <StatCard icon="💳" label="Paid Companies" value={paidCompanies} hint="Revenue accounts" accent="blue" />
            <StatCard icon="⌛" label="Expired Trials" value={expiredTrials} hint="Needs follow-up" accent="orange" />
            <StatCard icon="👥" label="Total Users" value={stats.totalUsers || recentUsers.length || 0} hint={`${stats.activeUsers || 0} active users`} accent="cyan" />
            <StatCard icon="₹" label="Monthly Revenue" value={stats.monthlyRevenue ? `₹${stats.monthlyRevenue}` : '₹0'} hint="Billing ready" accent="purple" />
            <StatCard icon="📥" label="Pending Signups" value={stats.pendingSignups || pendingSignups.length || 0} hint="Verification queue" accent="red" />
          </section>

          <section className="sa-main-grid">
            <article className="sa-panel sa-chart-panel">
              <div className="sa-panel-head">
                <div><h2>Revenue / Growth Overview</h2><p>Live platform growth trend from Super Admin overview API.</p></div>
                <span>{stats.uptime || '99.98%'} uptime</span>
              </div>
              <RevenueChart growth={data.growth} />
            </article>
            <article className="sa-panel sa-chart-panel">
              <div className="sa-panel-head">
                <div><h2>Company Growth</h2><p>New signups and activation momentum.</p></div>
                <span>Monthly</span>
              </div>
              <GrowthBars />
            </article>
          </section>

          <section className="sa-secondary-grid">
            <article className="sa-panel">
              <div className="sa-panel-head">
                <div><h2>Recent Companies</h2><p>Company, plan, users, status and trial overview.</p></div>
                <button type="button" onClick={() => navigateTo('/super-admin/companies')}>View All</button>
              </div>
              <div className="sa-table-wrap">
                <table>
                  <thead><tr><th>Company</th><th>Plan</th><th>Users</th><th>Status</th><th>Trial</th><th>Admin</th></tr></thead>
                  <tbody>
                    {companies.slice(0, 7).map((company) => (
                      <tr key={company.id || company.name}>
                        <td><strong>{company.name}</strong><small>{formatDate(company.createdAt)}</small></td>
                        <td><span className="super-pill blue">{company.plan || 'Starter'}</span></td>
                        <td>{company.users || 0}</td>
                        <td><span className={`super-pill ${badgeClass(company.status)}`}>{company.status || 'Active'}</span></td>
                        <td>{company.trialDaysLeft == null ? '-' : company.trialDaysLeft >= 0 ? `${company.trialDaysLeft} days left` : 'Expired'}</td>
                        <td>{company.adminEmail || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {!loading && !companies.length && <p className="super-empty">No companies found.</p>}
              </div>
            </article>

            <article className="sa-panel">
              <div className="sa-panel-head">
                <div><h2>Activity & User Control</h2><p>Recent account activity with quick activation controls.</p></div>
                <button type="button" onClick={() => navigateTo('/super-admin/activity-logs')}>View Logs</button>
              </div>
              <div className="sa-activity-list">
                {recentUsers.slice(0, 5).map((user) => (
                  <div className="sa-activity-row" key={user.id || user.email}>
                    <span>{initials(user.name || user.email)}</span>
                    <div><strong>{user.name || 'User'}</strong><small>{user.email}</small></div>
                    <em>{user.isActive ? 'Active' : 'Inactive'}</em>
                  </div>
                ))}
                {pendingSignups.slice(0, 2).map((item) => (
                  <div className="sa-activity-row" key={item.id || item.email}>
                    <span>{initials(item.name || item.email)}</span>
                    <div><strong>{item.name || 'Signup'}</strong><small>{item.email}</small></div>
                    <em>{item.status || 'Pending'}</em>
                  </div>
                ))}
              </div>
              <div className="sa-user-list">
                {recentUsers.slice(0, 4).map((user) => (
                  <div className="sa-user-row" key={`ctrl-${user.id || user.email}`}>
                    <span>{initials(user.name || user.email)}</span>
                    <div><strong>{user.name || 'User'}</strong><small>{user.email}</small></div>
                    <button type="button" className={user.isActive ? 'danger' : 'success'} onClick={() => toggleUser(user)}>{user.isActive ? 'Deactivate' : 'Activate'}</button>
                  </div>
                ))}
              </div>
            </article>
          </section>
        </div>
      </main>
    </div>
  );
}
