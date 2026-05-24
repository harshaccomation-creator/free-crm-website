import DashboardSidebar from '../../components/dashboard/DashboardSidebar.jsx';
import '../../styles/dashboardBase.css';
import '../../styles/employeeDashboard.css';
import '../../styles/roleDashboards.css';

export default function EmployeeDashboard() {
  const leads = [
    ['Neha Sharma', 'Tech Solutions', 'Website', 'May 20, 2025', 'Interested'],
    ['Amit Verma', 'Digital Agency', 'Referral', 'May 19, 2025', 'Follow-up'],
    ['Rajesh Singh', 'Business Corp', 'Cold Call', 'May 19, 2025', 'Contacted'],
    ['New Age Ltd.', 'New Age Ltd.', 'Event', 'May 18, 2025', 'Proposal'],
    ['Priya Mehta', 'Creative Minds', 'LinkedIn', 'May 17, 2025', 'New'],
  ];

  return (
    <div className="sf-dashboard employee-dashboard exact-dashboard">
      <DashboardSidebar role="employee" />
      <main className="exact-main">
        <header className="exact-topbar">
          <div>
            <h1>Dashboard</h1>
            <p>Welcome back, Alex! Here is what is happening with your work today.</p>
          </div>
          <div className="exact-actions">
            <label className="exact-search"><span>⌕</span><input placeholder="Search leads, contacts, tasks..." /></label>
            <button className="exact-bell">🔔<i>3</i></button>
            <button className="exact-profile"><span>A</span><strong>Alex Morgan</strong></button>
          </div>
        </header>

        <section className="exact-stats employee-stats">
          <article><span>👥</span><p>Assigned Leads</p><h2>48</h2><small>↑ 12% vs yesterday</small></article>
          <article><span>✅</span><p>Tasks Due Today</p><h2>12</h2><small>↑ 9% vs yesterday</small></article>
          <article><span>☎</span><p>Calls Scheduled</p><h2>6</h2><small>↑ 5% vs yesterday</small></article>
          <article className="target-card"><span>◎</span><p>Target Progress</p><h2>76%</h2><small>₹1,52,000 / ₹2,00,000</small><b /></article>
        </section>

        <section className="employee-grid-one">
          <article className="exact-card performance-card">
            <div className="exact-card-head"><h2>My Performance Overview</h2><button>This Month ▾</button></div>
            <div className="line-chart"><i /><b /><span className="p1" /><span className="p2" /><span className="p3" /><span className="p4" /><span className="p5" /><span className="p6" /></div>
          </article>
          <article className="exact-card tasks-card">
            <div className="exact-card-head"><h2>Today's Tasks</h2><button>View All</button></div>
            {['Follow up with Neha Sharma','Send proposal to Amit Verma','Call back Rajesh Singh','Product demo with New Age Ltd.','Update lead notes & status'].map((task, index) => (
              <div className="task-row" key={task}><em /> <div><strong>{task}</strong><small>Lead task</small></div><time>{['10:00 AM','11:30 AM','02:00 PM','04:00 PM','05:30 PM'][index]}</time></div>
            ))}
          </article>
        </section>

        <section className="employee-grid-two">
          <article className="exact-card leads-table-card">
            <div className="exact-card-head"><h2>Recent Leads & Follow-ups</h2><button>View All</button></div>
            <table><thead><tr><th>Lead Name</th><th>Company</th><th>Source</th><th>Last Contact</th><th>Status</th></tr></thead><tbody>{leads.map((row) => <tr key={row[0]}>{row.map((cell, index) => <td key={cell}><span className={index === 4 ? 'status-pill' : ''}>{cell}</span></td>)}</tr>)}</tbody></table>
          </article>
          <article className="exact-card mini-calendar"><div className="exact-card-head"><h2>My Calendar</h2><button>View</button></div><div className="calendar-grid">{['Mo','Tu','We','Th','Fr','Sa','Su','28','29','30','1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25'].map((d) => <span className={d==='21' ? 'active' : ''} key={d}>{d}</span>)}</div></article>
          <article className="exact-card activity-card"><div className="exact-card-head"><h2>Recent Activity</h2><button>View</button></div>{['Call completed with Neha Sharma','Email sent to Amit Verma','Lead status updated','Meeting scheduled'].map((a) => <div className="activity-row-exact" key={a}><span>✓</span><div><strong>{a}</strong><small>Just now</small></div></div>)}</article>
        </section>
      </main>
    </div>
  );
}
