import '../../styles/superAdminPaidExactPanel.css';

export default function SuperAdminPanelOnly() {
  const users = [];
  const companies = [];
  return (
    <main className="paid-super-admin-app" style={{ display: 'block', minHeight: '100vh', padding: '34px 30px 60px' }}>
      <div className="super-admin-page">
        <div className="super-admin-header">
          <div>
            <h1>Super Admin Panel</h1>
            <p>Platform control only. Client leads, customers, notes, payments and tasks are hidden for privacy.</p>
          </div>
          <div className="super-admin-badge">SUPER ADMIN</div>
        </div>
        <div className="super-admin-grid">
          <div className="super-admin-card"><p>Total Companies</p><h2>{companies.length}</h2><small>Privacy-safe overview</small></div>
          <div className="super-admin-card"><p>Total Users</p><h2>{users.length}</h2><small>Across platform</small></div>
          <div className="super-admin-card"><p>Active Subscriptions</p><h2>0</h2><small>Paid/active accounts</small></div>
          <div className="super-admin-card"><p>Trial Users</p><h2>0</h2><small>Trial/free accounts</small></div>
        </div>
        <div className="super-admin-table-wrap">
          <div className="super-admin-table-head"><h2>User & Subscription Control</h2><span className="role-badge">No client CRM data shown</span></div>
          <table className="super-admin-table"><thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Plan</th><th>Subscription</th><th>Change Role</th><th>Subscription Action</th></tr></thead><tbody><tr><td colSpan="7">No users found yet.</td></tr></tbody></table>
        </div>
        <div className="privacy-note">🔒 Privacy enabled: Super Admin can manage platform, roles and subscriptions but cannot view client leads, notes, customer details, tasks or internal payment entries.</div>
      </div>
    </main>
  );
}
