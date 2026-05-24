import DashboardSidebar from '../../components/dashboard/DashboardSidebar.jsx';
import '../../styles/dashboardBase.css';
import '../../styles/platformDashboard.css';
import '../../styles/roleDashboards.css';

export default function SuperAdminDashboard() {
  const orgRows = [
    ['Tech Solutions', '325', '₹2,45,000', 'Active'],
    ['Digital Agency', '210', '₹1,85,000', 'Active'],
    ['Business Corp', '180', '₹1,25,000', 'Active'],
    ['Innovate LLC', '150', '₹95,000', 'Inactive'],
    ['Creative Minds', '130', '₹75,000', 'Active'],
  ];
  const modules = [
    ['Leads', 'Enabled', 'Manage leads and conversions'],
    ['Deals', 'Enabled', 'Manage deals and pipeline'],
    ['Tasks', 'Enabled', 'Task management and reminders'],
    ['Invoices', 'Disabled', 'Create and manage invoices'],
    ['Reports', 'Enabled', 'Reports and analytics'],
  ];

  return (
    <div className="sf-dashboard super-admin-dashboard exact-dashboard">
      <DashboardSidebar role="superAdmin" />
      <main className="exact-main super-exact-main">
        <header className="exact-topbar">
          <div>
            <h1>Dashboard</h1>
            <p>System overview and key metrics for the entire SalesFlow platform.</p>
          </div>
          <div className="exact-actions">
            <label className="exact-search"><span>⌕</span><input placeholder="Search anything..." /></label>
            <button className="exact-bell">🔔<i>4</i></button>
            <button className="exact-profile"><span>S</span><strong>Super Admin</strong></button>
          </div>
        </header>

        <section className="exact-stats super-stats">
          <article><span>👥</span><p>Total Users</p><h2>2,543</h2><small>↑ 18.6%</small></article>
          <article><span>🏢</span><p>Organizations</p><h2>156</h2><small>↑ 12.4%</small></article>
          <article><span>₹</span><p>Total Revenue</p><h2>₹12,45,000</h2><small>↑ 20.5%</small></article>
          <article><span>◇</span><p>Active Modules</p><h2>24</h2><small>↑ 4.3%</small></article>
        </section>

        <section className="super-grid-one">
          <article className="exact-card users-overview-card">
            <div className="exact-card-head"><h2>Users Overview</h2><button>This Month ▾</button></div>
            <div className="donut-wrap"><div className="donut-chart"><span>2,543<small>Total Users</small></span></div><div className="legend-list"><p><i className="blue" /> Admins <b>120</b></p><p><i className="cyan" /> Managers <b>320</b></p><p><i className="green" /> Users <b>1,893</b></p><p><i className="orange" /> Inactive <b>210</b></p></div></div>
          </article>
          <article className="exact-card system-activity-card">
            <div className="exact-card-head"><h2>System Activity</h2><button>View All</button></div>
            {['New user registered','New organization added','Plan upgraded','Module setting updated'].map((item, index) => <div className="activity-row-exact" key={item}><span>✓</span><div><strong>{item}</strong><small>{index + 2} min ago</small></div></div>)}
          </article>
        </section>

        <section className="super-grid-two">
          <article className="exact-card org-card">
            <div className="exact-card-head"><h2>Top Organizations</h2><button>View All Organizations</button></div>
            <table><thead><tr><th>Organization</th><th>Users</th><th>Revenue</th><th>Status</th></tr></thead><tbody>{orgRows.map((row) => <tr key={row[0]}>{row.map((cell, index) => <td key={cell}><span className={index === 3 ? 'status-pill' : ''}>{cell}</span></td>)}</tr>)}</tbody></table>
          </article>
          <article className="exact-card health-card">
            <div className="exact-card-head"><h2>System Health</h2><button>View Logs</button></div>
            {['Server Status','Database','Storage','Backup'].map((item) => <div className="health-row" key={item}><strong>{item}</strong><span>Operational</span></div>)}
          </article>
        </section>

        <section className="super-grid-three">
          <article className="exact-card module-card">
            <div className="exact-card-head"><h2>Module Management</h2><button>Manage</button></div>
            <table><thead><tr><th>Module</th><th>Status</th><th>Description</th><th>Action</th></tr></thead><tbody>{modules.map((row, index) => <tr key={row[0]}><td>{row[0]}</td><td><span className={row[1] === 'Enabled' ? 'status-pill' : 'status-pill disabled'}>{row[1]}</span></td><td>{row[2]}</td><td><button className={index === 3 ? 'toggle off' : 'toggle'} /></td></tr>)}</tbody></table>
          </article>
        </section>
      </main>
    </div>
  );
}
