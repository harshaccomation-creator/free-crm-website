import DashboardSidebar from '../../components/dashboard/DashboardSidebar.jsx';
import DashboardTopbar from '../../components/dashboard/DashboardTopbar.jsx';
import StatCard from '../../components/dashboard/StatCard.jsx';
import MiniChart from '../../components/dashboard/MiniChart.jsx';
import DataTable from '../../components/dashboard/DataTable.jsx';
import '../../styles/dashboardBase.css';
import '../../styles/adminDashboard.css';

export default function AdminDashboard() {
  const rows = [
    ['Enterprise CRM Setup', 'Acme Inc.', 'Proposal', '1250000'],
    ['SaaS Platform Upgrade', 'Globex', 'Negotiation', '875000'],
    ['Marketing Suite', 'TechNova', 'Qualified', '560000'],
    ['Support Solution', 'Bright Future', 'Demo', '420000']
  ];

  return (
    <div className="sf-dashboard admin-dashboard">
      <DashboardSidebar role="admin" />
      <main className="sf-main">
        <DashboardTopbar title="Company Admin Dashboard" subtitle="Manage your team, leads, deals and company performance." userName="Priya Mehta" roleLabel="Company Admin" searchPlaceholder="Search employees, leads, deals..." />
        <section className="sf-stats five">
          <StatCard icon="E" label="Employees" value="124" change="12 percent" />
          <StatCard icon="L" label="Active Leads" value="632" change="18 percent" />
          <StatCard icon="D" label="Open Deals" value="87" change="15 percent" />
          <StatCard icon="R" label="Revenue" value="24.8L" change="22 percent" />
          <StatCard icon="A" label="Attendance" value="92%" change="5 percent" />
        </section>
        <section className="sf-dashboard-layout admin-layout">
          <div className="sf-main-stack">
            <div className="sf-two-col">
              <MiniChart title="Sales Performance" />
              <div className="sf-right-card admin-team-card"><div className="sf-card-head compact"><h2>Top Employees</h2><button>View All</button></div><div className="sf-right-list"><div className="sf-right-item"><span className="sf-right-icon">R</span><div><strong>Rohan Sharma</strong><small>18 closed deals</small></div><em>98%</em></div><div className="sf-right-item"><span className="sf-right-icon">N</span><div><strong>Neha Patel</strong><small>14 closed deals</small></div><em>94%</em></div><div className="sf-right-item"><span className="sf-right-icon">A</span><div><strong>Amit Kumar</strong><small>11 closed deals</small></div><em>91%</em></div></div></div>
            </div>
            <DataTable title="Recent Deals" columns={['Deal', 'Account', 'Stage', 'Value']} rows={rows} />
          </div>
          <aside className="sf-right-stack">
            <div className="sf-right-card"><div className="sf-card-head compact"><h2>Today Meetings</h2><button>Calendar</button></div><div className="sf-right-list"><div className="sf-right-item"><span className="sf-right-icon">M</span><div><strong>Leadership Standup</strong><small>10:00 AM</small></div></div><div className="sf-right-item"><span className="sf-right-icon">S</span><div><strong>Sales Review</strong><small>11:30 AM</small></div></div><div className="sf-right-item"><span className="sf-right-icon">P</span><div><strong>Product Demo</strong><small>02:00 PM</small></div></div></div></div>
            <div className="sf-right-card"><div className="sf-card-head compact"><h2>Department Overview</h2><button>Report</button></div><div className="sf-right-list"><div className="sf-right-item"><span className="sf-right-icon">S</span><div><strong>Sales</strong><small>42 employees</small></div><em>92%</em></div><div className="sf-right-item"><span className="sf-right-icon">M</span><div><strong>Marketing</strong><small>18 employees</small></div><em>88%</em></div><div className="sf-right-item"><span className="sf-right-icon">C</span><div><strong>Customer Success</strong><small>16 employees</small></div><em>95%</em></div></div></div>
          </aside>
        </section>
      </main>
    </div>
  );
}
