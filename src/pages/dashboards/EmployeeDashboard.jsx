import DashboardSidebar from '../../components/dashboard/DashboardSidebar.jsx';
import DashboardTopbar from '../../components/dashboard/DashboardTopbar.jsx';
import StatCard from '../../components/dashboard/StatCard.jsx';
import MiniChart from '../../components/dashboard/MiniChart.jsx';
import DataTable from '../../components/dashboard/DataTable.jsx';
import '../../styles/dashboardBase.css';
import '../../styles/employeeDashboard.css';

export default function EmployeeDashboard() {
  const rows = [
    ['Rohan Sharma', 'Sharma Industries', 'New', 'May 21, 2025', 'May 24, 2025', 'Alex'],
    ['Neha Patel', 'Patel Healthcare', 'Contacted', 'May 20, 2025', 'May 23, 2025', 'Alex'],
    ['Amit Kumar', 'Kumar Solutions', 'Proposal Sent', 'May 19, 2025', 'May 26, 2025', 'Alex']
  ];

  return (
    <div className="sf-dashboard employee-dashboard">
      <DashboardSidebar role="employee" />
      <main className="sf-main">
        <DashboardTopbar title="Welcome back, Alex" subtitle="Your SalesFlow work dashboard." userName="Alex Morgan" roleLabel="Employee" searchPlaceholder="Search leads and tasks" />
        <section className="sf-stats">
          <StatCard icon="L" label="Assigned Leads" value="128" change="12 percent" />
          <StatCard icon="T" label="Tasks Due Today" value="8" change="3 overdue" danger />
          <StatCard icon="C" label="Calls Scheduled" value="6" change="Today" />
          <StatCard icon="M" label="Monthly Target" value="68%" change="On track" />
        </section>
        <section className="sf-dashboard-layout">
          <div className="sf-main-stack">
            <MiniChart title="My Performance" />
            <DataTable title="Recent Leads" columns={['Lead', 'Company', 'Status', 'Last Contact', 'Next Follow-up', 'Owner']} rows={rows} />
          </div>
          <aside className="sf-right-stack">
            <div className="sf-right-card"><div className="sf-card-head compact"><h2>Todays Schedule</h2><button>View</button></div><div className="sf-right-list"><div className="sf-right-item"><span className="sf-right-icon">C</span><div><strong>Call with Rohan Sharma</strong><small>10 AM</small></div></div><div className="sf-right-item"><span className="sf-right-icon">F</span><div><strong>Follow-up Neha Patel</strong><small>11:30 AM</small></div></div></div></div>
            <div className="sf-right-card"><div className="sf-card-head compact"><h2>Recent Activity</h2><button>View</button></div><div className="sf-right-list"><div className="sf-right-item"><span className="sf-right-icon">C</span><div><strong>Called Ritu Verma</strong><small>2 min ago</small></div></div><div className="sf-right-item"><span className="sf-right-icon">D</span><div><strong>Created new deal</strong><small>15 min ago</small></div></div></div></div>
          </aside>
        </section>
      </main>
    </div>
  );
}
