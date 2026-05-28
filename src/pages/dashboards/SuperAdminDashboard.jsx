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
  return new Date(value).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function statusClass(status) {
  const text = String(status || '').toLowerCase();
  if (text.includes('active')) return 'green';
  if (text.includes('trial') || text.includes('pending')) return 'orange';
  if (text.includes('expired') || text.includes('inactive')) return 'red';
  return 'blue';
}

function GrowthChart({ growth = [] }) {
  const points = useMemo(() => {
    const source = growth.length ? growth : [{ month: 'Now', users: 0 }];
    const max = Math.max(...source.map((item) => Number(item.users) || 0), 1);
    return source.map((item, index) => {
      const x = source.length === 1 ? 80 : 50 + (index * 610) / Math.max(source.length - 1, 1);
      const y = 205 - ((Number(item.users) || 0) / max) * 150;
      return { ...item, x, y };
    });
  }, [growth]);

  const line = points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ');
  const fill = `${line} L ${points[points.length - 1]?.x || 50} 220 L ${points[0]?.x || 50} 220 Z`;

  return (
    <div className="super-chart">
      <svg viewBox="0 0 720 260" aria-label="Real platform growth chart">
        {[55,95,135,175,215].map((y) => <line key={y} x1="44" y1={y} x2="675" y2={y} className="chart-grid" />)}
        <path d={fill} className="chart-fill" />
        <path d={line} className="chart-line" />
        {points.map((point) => <circle key={`${point.month}-${point.x}`} cx={point.x} cy={point.y} r="6" className="chart-dot" />)}
        {points.map((point) => <text key={point.month} x={point.x - 12} y="246" className="chart-label">{point.month}</text>)}
      </svg>
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
      setMessage(result.message);
      loadData();
    } catch (error) {
      setMessage(error.message || 'Unable to update user.');
    }
  };

  const stats = data.stats || {};
  const superName = localStorage.getItem('salesflow_user_email')?.split('@')[0] || 'Super Admin';

  return (
    <div className="sf-dashboard super-admin-premium-page">
      <DashboardSidebar role="superAdmin" />
      <main className="super-admin-main">
        <header className="super-topbar">
          <div>
            <span className="super-kicker">SalesFlow Platform Control</span>
            <h1>Welcome back, {superName}!</h1>
            <p>Real-time CRM platform overview with users, companies, trials and system health.</p>
          </div>
          <div className="super-actions">
            <label><span>⌕</span><input placeholder="Search users, companies, emails..." /></label>
            <button type="button" onClick={loadData}>{loading ? 'Loading...' : 'Refresh'}</button>
          </div>
        </header>

        {message && <div className="super-message">{message}</div>}

        <section className="super-stats-grid">
          <article><span>🏢</span><small>Total Companies</small><strong>{stats.totalCompanies || 0}</strong><em>All registered workspaces</em></article>
          <article><span>👥</span><small>Total Users</small><strong>{stats.totalUsers || 0}</strong><em>{stats.activeUsers || 0} active users</em></article>
          <article><span>🟢</span><small>Active Users</small><strong>{stats.activeUsers || 0}</strong><em>{stats.inactiveUsers || 0} inactive</em></article>
          <article><span>⏳</span><small>Trial Companies</small><strong>{stats.trialCompanies || 0}</strong><em>{stats.expiredTrials || 0} expired trials</em></article>
          <article><span>📥</span><small>Pending Signups</small><strong>{stats.pendingSignups || 0}</strong><em>Waiting verification</em></article>
          <article><span>🎫</span><small>Support Tickets</small><strong>{stats.openTickets || 0}</strong><em>Tawk live chat active</em></article>
        </section>

        <section className="super-content-grid">
          <article className="super-card super-chart-card">
            <div className="super-card-head"><div><h2>Platform Growth</h2><p>Users added by month from real database.</p></div><span>{stats.uptime || '99.98%'} uptime</span></div>
            <GrowthChart growth={data.growth} />
          </article>

          <article className="super-card">
            <div className="super-card-head"><div><h2>Recent Users</h2><p>Latest profiles from Supabase.</p></div></div>
            <div className="super-user-list">
              {(data.recentUsers || []).map((user) => (
                <div className="super-user-row" key={user.id || user.email}>
                  <span>{(user.name || user.email || 'U').slice(0, 1).toUpperCase()}</span>
                  <div><strong>{user.name}</strong><small>{user.email}</small></div>
                  <button type="button" className={user.isActive ? 'danger' : 'success'} onClick={() => toggleUser(user)}>{user.isActive ? 'Deactivate' : 'Activate'}</button>
                </div>
              ))}
              {!loading && !(data.recentUsers || []).length && <p className="super-empty">No users found.</p>}
            </div>
          </article>
        </section>

        <section className="super-table-grid">
          <article className="super-card">
            <div className="super-card-head"><div><h2>Company Overview</h2><p>Real companies, plans, trial and user count.</p></div></div>
            <div className="super-table-wrap">
              <table>
                <thead><tr><th>Company</th><th>Plan</th><th>Users</th><th>Status</th><th>Trial</th><th>Admin</th></tr></thead>
                <tbody>
                  {(data.companies || []).map((company) => (
                    <tr key={company.id}>
                      <td><strong>{company.name}</strong><small>{formatDate(company.createdAt)}</small></td>
                      <td><span className="super-pill blue">{company.plan}</span></td>
                      <td>{company.users}</td>
                      <td><span className={`super-pill ${statusClass(company.status)}`}>{company.status}</span></td>
                      <td>{company.trialDaysLeft === null ? '-' : company.trialDaysLeft >= 0 ? `${company.trialDaysLeft} days left` : 'Expired'}</td>
                      <td>{company.adminEmail}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!loading && !(data.companies || []).length && <p className="super-empty">No companies found.</p>}
            </div>
          </article>

          <article className="super-card">
            <div className="super-card-head"><div><h2>Pending Signups</h2><p>Signup requests and OTP verification status.</p></div></div>
            <div className="super-pending-list">
              {(data.pendingSignups || []).map((item) => (
                <div key={item.id} className="super-pending-row">
                  <div><strong>{item.name}</strong><small>{item.email}</small></div>
                  <span className={`super-pill ${statusClass(item.status)}`}>{item.status}</span>
                </div>
              ))}
              {!loading && !(data.pendingSignups || []).length && <p className="super-empty">No pending signups.</p>}
            </div>
          </article>
        </section>
      </main>
    </div>
  );
}
