import { useEffect, useState } from 'react';
import '../../styles/superAdminPaidExact.css';
import '../../styles/superAdminPaidExactPanel.css';

const tabs = ['Super Admin', 'Companies', 'Users', 'Subscriptions', 'Demo Requests', 'Website Health'];
const go = (path) => { window.history.pushState({}, '', path); window.dispatchEvent(new Event('salesflow:navigate')); };

function Panel({ data }) {
  const stats = data.stats || {};
  const users = data.recentUsers || [];
  const demos = data.demoRequests || [];
  const companies = data.companies || [];
  return (
    <div className="super-admin-page">
      <div className="super-admin-header">
        <div>
          <h1>Super Admin Panel</h1>
          <p>Platform control only. Client leads, customers, notes, payments and tasks are hidden for privacy.</p>
        </div>
        <div className="super-admin-badge">SUPER ADMIN</div>
      </div>

      <div className="super-admin-grid">
        <div className="super-admin-card"><p>Total Companies</p><h2>{stats.totalCompanies || companies.length || 0}</h2><small>Privacy-safe overview</small></div>
        <div className="super-admin-card"><p>Total Users</p><h2>{stats.totalUsers || users.length || 0}</h2><small>Across platform</small></div>
        <div className="super-admin-card"><p>Active Subscriptions</p><h2>{stats.activeUsers || 0}</h2><small>Paid/active accounts</small></div>
        <div className="super-admin-card"><p>Trial Users</p><h2>{stats.trialCompanies || 0}</h2><small>Trial/free accounts</small></div>
      </div>

      <div className="super-admin-table-wrap">
        <div className="super-admin-table-head">
          <h2>User & Subscription Control</h2>
          <span className="role-badge">No client CRM data shown</span>
        </div>
        <table className="super-admin-table">
          <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Plan</th><th>Subscription</th><th>Company</th></tr></thead>
          <tbody>{users.length === 0 ? <tr><td colSpan="6">No users found yet.</td></tr> : users.map((u) => <tr key={u.id || u.email}><td>{u.name || 'User'}</td><td>{u.email}</td><td><span className="role-badge">{u.role || 'employee'}</span></td><td><span className="plan-badge">{u.plan || 'trial'}</span></td><td>{u.isActive ? 'active' : 'trial'}</td><td>{u.companyName || '-'}</td></tr>)}</tbody>
        </table>
      </div>

      <div className="super-admin-table-wrap" style={{ marginTop: 24 }}>
        <div className="super-admin-table-head">
          <h2>Book Demo Requests</h2>
          <span className="role-badge">Landing leads</span>
        </div>
        <table className="super-admin-table">
          <thead><tr><th>Name</th><th>Email</th><th>Mobile</th><th>Company</th><th>Need</th><th>Status</th></tr></thead>
          <tbody>{demos.length === 0 ? <tr><td colSpan="6">No demo requests found.</td></tr> : demos.map((d) => <tr key={d.id || d.email}><td>{d.fullName}</td><td>{d.email}</td><td>{d.mobile}</td><td>{d.companyName}</td><td>{d.requirement}</td><td><span className="plan-badge">{d.status}</span></td></tr>)}</tbody>
        </table>
      </div>

      <div className="privacy-note">🔒 Privacy enabled: Super Admin can manage platform, roles and subscriptions but cannot view client private lead notes, payment entries or internal tasks.</div>
    </div>
  );
}

export default function SuperAdminPaidExact() {
  const [data, setData] = useState({ stats: {}, recentUsers: [], companies: [], demoRequests: [] });
  const [loading, setLoading] = useState(true);
  useEffect(() => { fetch('/api/super-admin-overview').then((r) => r.json()).then((j) => setData(j || {})).finally(() => setLoading(false)); }, []);
  return (
    <div className="paid-super-admin-app">
      <aside>
        <div className="paid-sa-brand"><div className="paid-sa-logo">S</div><div><h2>Sales<span>Flow</span></h2><p>Super Admin</p></div></div>
        <div className="paid-sa-nav">{tabs.map((tab) => <button key={tab} className={tab === 'Super Admin' ? 'active' : ''} onClick={() => tab === 'Super Admin' ? null : go('/super-admin/dashboard')}><span>▣</span>{tab}</button>)}</div>
      </aside>
      <main>
        <div className="paid-sa-topbar"><div className="paid-sa-search"><span>⌕</span><input placeholder="Search users, companies..." /></div><div className="paid-sa-profile"><div className="paid-sa-avatar">S</div><div><strong>Super Admin</strong><p style={{ margin: 0, color: '#94a3b8', fontSize: 12 }}>{loading ? 'Loading...' : 'Platform Control'}</p></div></div></div>
        <Panel data={data} />
      </main>
    </div>
  );
}
