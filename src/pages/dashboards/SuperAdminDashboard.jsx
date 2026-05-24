import DashboardSidebar from '../../components/dashboard/DashboardSidebar.jsx';
import DashboardTopbar from '../../components/dashboard/DashboardTopbar.jsx';
import StatCard from '../../components/dashboard/StatCard.jsx';
import MiniChart from '../../components/dashboard/MiniChart.jsx';
import DataTable from '../../components/dashboard/DataTable.jsx';
import '../../styles/dashboardBase.css';
import '../../styles/platformDashboard.css';

export default function SuperAdminDashboard() {
  const rows = [
    ['Acme Inc.', 'Business', 'Active', '248000'],
    ['Globex Corp.', 'Starter', 'Trial', '99000'],
    ['TechNova Pvt Ltd', 'Business', 'Active', '186000'],
    ['Bright Future Ltd', 'Starter', 'Overdue', '49000']
  ];

  return (
    <div className="sf-dashboard super-admin-dashboard">
      <DashboardSidebar role="superAdmin" />
      <main className="sf-main">
        <DashboardTopbar title="Super Admin Dashboard" subtitle="Monitor companies, users, subscriptions and platform health." userName="Harsh Goyal" roleLabel="Super Admin" searchPlaceholder="Search companies, users, tickets..." />
        <section className="sf-stats six">
          <StatCard icon="C" label="Companies" value="248" change="16 percent" />
          <StatCard icon="U" label="Active Users" value="12.8k" change="24 percent" />
          <StatCard icon="R" label="MRR" value="42.5L" change="18 percent" />
          <StatCard icon="T" label="Trial Accounts" value="37" change="8 new" />
          <StatCard icon="S" label="Tickets" value="12" change="4 urgent" danger />
          <StatCard icon="H" label="Uptime" value="99.9%" change="Healthy" />
        </section>
        <section className="sf-dashboard-layout super-layout">
          <div className="sf-main-stack">
            <MiniChart title="Platform Growth and Revenue" />
            <DataTable title="Company Overview" columns={['Company', 'Plan', 'Status', 'MRR']} rows={rows} />
          </div>
          <aside className="sf-right-stack">
            <div className="sf-right-card"><div className="sf-card-head compact"><h2>System Health</h2><button>Live</button></div><div className="sf-right-list"><div className="sf-right-item"><span className="sf-right-icon">A</span><div><strong>API Status</strong><small>Operational</small></div><em>99.9%</em></div><div className="sf-right-item"><span className="sf-right-icon">D</span><div><strong>Database</strong><small>Healthy</small></div><em>23ms</em></div><div className="sf-right-item"><span className="sf-right-icon">Q</span><div><strong>Queue Jobs</strong><small>Normal</small></div><em>128</em></div></div></div>
            <div className="sf-right-card"><div className="sf-card-head compact"><h2>Recent Signups</h2><button>View</button></div><div className="sf-right-list"><div className="sf-right-item"><span className="sf-right-icon">A</span><div><strong>Acme Inc.</strong><small>Business plan</small></div><em>2h</em></div><div className="sf-right-item"><span className="sf-right-icon">G</span><div><strong>Globex Corp.</strong><small>Trial started</small></div><em>4h</em></div><div className="sf-right-item"><span className="sf-right-icon">T</span><div><strong>TechNova</strong><small>Starter plan</small></div><em>1d</em></div></div></div>
            <div className="sf-right-card"><div className="sf-card-head compact"><h2>Platform Alerts</h2><button>All</button></div><div className="sf-right-list"><div className="sf-right-item"><span className="sf-right-icon">!</span><div><strong>Payment retry needed</strong><small>Bright Future Ltd</small></div></div><div className="sf-right-item"><span className="sf-right-icon">S</span><div><strong>Support SLA warning</strong><small>4 tickets pending</small></div></div></div></div>
          </aside>
        </section>
      </main>
    </div>
  );
}
