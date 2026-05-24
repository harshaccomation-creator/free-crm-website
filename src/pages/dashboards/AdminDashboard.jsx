import DashboardSidebar from '../../components/dashboard/DashboardSidebar.jsx';
import CrmLineChart from '../../components/dashboard/CrmLineChart.jsx';
import '../../styles/dashboardBase.css';
import '../../styles/adminDashboard.css';
import '../../styles/roleDashboards.css';

export default function AdminDashboard() {
  const leadRows = [
    ['Rohan Mehta', 'Tech Solutions', 'New', 'Today, 10:30 AM'],
    ['Priya Sharma', 'Consulting Ltd.', 'Contacted', 'Today, 01:15 PM'],
    ['Amit Verma', 'Retail Estate', 'Qualified', 'Yesterday, 04:20 PM'],
    ['Neha Singh', 'Education', 'New', 'Yesterday, 11:45 AM'],
  ];
  const tasks = ['Follow up with Rohan Mehta', 'Send proposal to Priya Sharma', 'Call Amit Verma', 'Prepare quotation for Neha Singh'];

  return (
    <div className="sf-dashboard admin-dashboard exact-dashboard">
      <DashboardSidebar role="admin" />
      <main className="exact-main admin-exact-main">
        <header className="exact-topbar">
          <div><h1>Dashboard</h1><p>Welcome back, Admin! Here is what is happening with your business today.</p></div>
          <div className="exact-actions"><label className="exact-search"><span>⌕</span><input placeholder="Search leads, deals, users..." /></label><button className="exact-bell">🔔<i>5</i></button><button className="exact-profile"><span>A</span><strong>Admin</strong></button></div>
        </header>
        <section className="exact-stats admin-stats">
          <article><span>📊</span><p>Total Leads</p><h2>1,245</h2><small>↑ 12.5%</small></article>
          <article><span>◆</span><p>Total Deals</p><h2>320</h2><small>↑ 8.4%</small></article>
          <article><span>₹</span><p>Total Revenue</p><h2>₹2,45,000</h2><small>↑ 15.3%</small></article>
          <article><span>☑</span><p>Open Tasks</p><h2>56</h2><small className="danger">↓ 4.6%</small></article>
        </section>
        <section className="admin-grid-one">
          <article className="exact-card admin-sales-card"><div className="exact-card-head"><h2>Sales Overview</h2><button>This Month ▾</button></div><CrmLineChart type="admin" /></article>
          <article className="exact-card admin-tasks-card"><div className="exact-card-head"><h2>Tasks</h2><button>View All</button></div>{tasks.map((task, index) => <div className="task-row" key={task}><em /> <div><strong>{task}</strong><small>May {20 + index}, 2025</small></div></div>)}</article>
        </section>
        <section className="admin-grid-two">
          <article className="exact-card admin-leads-card"><div className="exact-card-head"><h2>Recent Leads</h2><button>View All Leads</button></div><table><thead><tr><th>Lead</th><th>Company</th><th>Status</th><th>Time</th></tr></thead><tbody>{leadRows.map((row) => <tr key={row[0]}>{row.map((cell, index) => <td key={cell}><span className={index === 2 ? 'status-pill' : ''}>{cell}</span></td>)}</tr>)}</tbody></table></article>
          <article className="exact-card deals-pipeline-card"><div className="exact-card-head"><h2>Deals Pipeline</h2><button>View Deals</button></div><div className="pipeline-grid">{['New Lead','Qualified','Proposal','Negotiation','Won'].map((stage, index) => <div key={stage}><strong>{stage}</strong><h3>{12 - index}</h3><small>₹{(index + 1) * 25000}</small></div>)}</div></article>
        </section>
      </main>
    </div>
  );
}
