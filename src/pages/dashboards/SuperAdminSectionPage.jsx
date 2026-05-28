import { useEffect, useState } from 'react';
import DashboardSidebar from '../../components/dashboard/DashboardSidebar.jsx';
import '../../styles/dashboardBase.css';
import '../../styles/superAdminPremium.css';

const meta = {
  users: ['Users', 'Manage real registered users and account access.'],
  roles: ['Roles & Permissions', 'Review current CRM roles and access levels.'],
  organizations: ['Organizations', 'Monitor real companies and workspaces.'],
  modules: ['Modules', 'CRM module controls and availability.'],
  billing: ['Plans & Billing', 'Plans, trials and workspace billing overview.'],
  settings: ['Settings', 'Global Super Admin settings.'],
  'activity-logs': ['Activity Logs', 'Recent signup and user activity.'],
  'system-logs': ['System Logs', 'Platform health and service status.'],
  integrations: ['Integrations', 'Connected support and email services.'],
  backup: ['Backup & Restore', 'Backup and restore status.'],
};

function statusClass(status) {
  const text = String(status || '').toLowerCase();
  if (text.includes('active')) return 'green';
  if (text.includes('trial') || text.includes('pending')) return 'orange';
  if (text.includes('expired') || text.includes('inactive')) return 'red';
  return 'blue';
}

function dateText(value) {
  if (!value) return '-';
  return new Date(value).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function SuperAdminSectionPage({ view = 'users' }) {
  const [data, setData] = useState({ stats: {}, recentUsers: [], companies: [], pendingSignups: [] });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [title, subtitle] = meta[view] || meta.users;

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

  useEffect(() => { loadData(); }, [view]);

  const toggleUser = async (user) => {
    const res = await fetch('/api/super-admin-overview', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'toggleUser', userId: user.id, isActive: !user.isActive }),
    });
    const json = await res.json();
    setMessage(json.message || 'Updated.');
    loadData();
  };

  const stats = data.stats || {};

  return (
    <div className="sf-dashboard super-admin-premium-page">
      <DashboardSidebar role="superAdmin" />
      <main className="super-admin-main">
        <header className="super-topbar">
          <div>
            <span className="super-kicker">SalesFlow Super Admin</span>
            <h1>{title}</h1>
            <p>{subtitle}</p>
          </div>
          <div className="super-actions">
            <label><span>⌕</span><input placeholder="Search data..." /></label>
            <button type="button" onClick={loadData}>{loading ? 'Loading...' : 'Refresh'}</button>
          </div>
        </header>

        {message && <div className="super-message">{message}</div>}

        <section className="super-stats-grid">
          <article><span>🏢</span><small>Companies</small><strong>{stats.totalCompanies || 0}</strong><em>Real workspace count</em></article>
          <article><span>👥</span><small>Users</small><strong>{stats.totalUsers || 0}</strong><em>{stats.activeUsers || 0} active</em></article>
          <article><span>⏳</span><small>Trials</small><strong>{stats.trialCompanies || 0}</strong><em>{stats.expiredTrials || 0} expired</em></article>
        </section>

        {view === 'users' && (
          <section className="super-card">
            <div className="super-card-head"><div><h2>All Users</h2><p>Activate/deactivate users from the profiles table.</p></div></div>
            <div className="super-user-list">
              {(data.recentUsers || []).map((user) => (
                <div className="super-user-row" key={user.id || user.email}>
                  <span>{(user.name || user.email || 'U').slice(0, 1).toUpperCase()}</span>
                  <div><strong>{user.name}</strong><small>{user.email} · {user.role}</small></div>
                  <button type="button" className={user.isActive ? 'danger' : 'success'} onClick={() => toggleUser(user)}>{user.isActive ? 'Deactivate' : 'Activate'}</button>
                </div>
              ))}
            </div>
          </section>
        )}

        {(view === 'organizations' || view === 'billing') && (
          <section className="super-card">
            <div className="super-card-head"><div><h2>{view === 'billing' ? 'Plans & Billing' : 'Organizations'}</h2><p>Real companies created from signup flow.</p></div></div>
            <div className="super-table-wrap">
              <table>
                <thead><tr><th>Company</th><th>Plan</th><th>Users</th><th>Status</th><th>Trial</th><th>Admin</th></tr></thead>
                <tbody>{(data.companies || []).map((c) => <tr key={c.id}><td><strong>{c.name}</strong><small>{dateText(c.createdAt)}</small></td><td><span className="super-pill blue">{c.plan}</span></td><td>{c.users}</td><td><span className={`super-pill ${statusClass(c.status)}`}>{c.status}</span></td><td>{c.trialDaysLeft === null ? '-' : c.trialDaysLeft >= 0 ? `${c.trialDaysLeft} days` : 'Expired'}</td><td>{c.adminEmail}</td></tr>)}</tbody>
              </table>
            </div>
          </section>
        )}

        {view === 'activity-logs' && (
          <section className="super-card"><div className="super-card-head"><div><h2>Recent Activity</h2><p>Latest signups from the database.</p></div></div><div className="super-pending-list">{(data.pendingSignups || []).map((item) => <div className="super-pending-row" key={item.id}><div><strong>{item.name}</strong><small>{item.email}</small></div><span className={`super-pill ${statusClass(item.status)}`}>{item.status}</span></div>)}</div></section>
        )}

        {!['users', 'organizations', 'billing', 'activity-logs'].includes(view) && (
          <section className="super-placeholder-grid">
            <article className="super-card super-placeholder"><h2>{title}</h2><p>{subtitle}</p><div className="super-feature-list"><span>Connected to real Super Admin layout</span><span>Database overview available</span><span>Detailed controls ready to add next</span></div></article>
            <article className="super-card super-placeholder"><h2>Platform Summary</h2><p>Users: {stats.totalUsers || 0} · Companies: {stats.totalCompanies || 0} · Uptime: {stats.uptime || '99.98%'}</p><button type="button" onClick={loadData}>Refresh Data</button></article>
          </section>
        )}
      </main>
    </div>
  );
}
