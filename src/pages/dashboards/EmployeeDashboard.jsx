import DashboardSidebar from '../../components/dashboard/DashboardSidebar.jsx';
import '../../styles/dashboardBase.css';
import '../../styles/referenceDashboardExact.css';
import '../../styles/sidebarGlobalFinalLock.css';
import '../../styles/zzzSidebarBlackFix.css';
import '../../styles/dashboardFontPolish.css';

function LineChart() {
  const points = [[52,178],[140,138],[230,98],[326,132],[420,88],[532,76],[640,44]];
  return (
    <div className="reference-chart">
      <svg viewBox="0 0 700 270" aria-label="Employee performance chart">
        {[45,85,125,165,205].map((y) => <line key={y} x1="44" y1={y} x2="660" y2={y} className="chart-grid" />)}
        <line x1="44" y1="24" x2="44" y2="218" className="chart-axis" /><line x1="44" y1="218" x2="660" y2="218" className="chart-axis" />
        <path d="M52 178 C112 132 176 138 230 98 C300 62 354 136 420 88 C492 50 554 82 640 44 L640 218 L52 218 Z" className="chart-fill" />
        <path d="M52 148 C112 158 178 112 240 130 C300 146 354 96 418 116 C492 138 554 92 640 102" className="chart-line light" />
        <path d="M52 178 C112 132 176 138 230 98 C300 62 354 136 420 88 C492 50 554 82 640 44" className="chart-line" />
        {points.map(([x,y]) => <circle key={`${x}-${y}`} cx={x} cy={y} r="6" className="chart-dot" />)}
        {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((m,i) => <text key={m} x={58+i*96} y="250" className="chart-label">{m}</text>)}
      </svg>
    </div>
  );
}

export default function EmployeeDashboard() {
  const leads = [
    ['Rohan Sharma','Sharma Industries','New','May 24, 2025 10:00 AM'],
    ['Neha Patel','Patel Healthcare','Contacted','May 23, 2025 11:30 AM'],
    ['Amit Kumar','Kumar Solutions','Proposal','May 26, 2025 02:00 PM'],
    ['Pooja Singh','Singh Enterprises','Follow-up','May 22, 2025 03:00 PM'],
  ];
  return (
    <div className="sf-dashboard reference-dashboard employee-reference-dashboard">
      <DashboardSidebar role="employee" />
      <main className="reference-main">
        <header className="reference-topbar">
          <div className="reference-title"><h1>Welcome back, Alex! 👋</h1><p>Here’s what’s happening with your work today.</p></div>
          <div className="reference-actions"><label className="reference-search"><span>⌕</span><input placeholder="Search leads, contacts, tasks..." /></label><button className="reference-icon-btn">🔔<i>5</i></button><button className="reference-profile"><span className="reference-avatar">A</span><span><strong>Alex Morgan</strong><small>Sales Executive</small></span></button></div>
        </header>
        <section className="reference-stats">
          <article className="reference-stat"><span className="stat-icon">👥</span><p>Assigned Leads</p><h2>128</h2><small>↑ 12% from last week</small></article>
          <article className="reference-stat danger"><span className="stat-icon">✅</span><p>Tasks Due Today</p><h2>8</h2><small>3 overdue</small></article>
          <article className="reference-stat"><span className="stat-icon">☎</span><p>Calls Scheduled</p><h2>6</h2><small>Today</small></article>
          <article className="reference-stat target"><span className="stat-icon">◎</span><p>Monthly Target Progress</p><h2>68%</h2><small>₹6,80,000 / ₹10,00,000</small><div className="progress"><b style={{width:'68%'}} /></div></article>
        </section>
        <section className="reference-row employee-row-one">
          <article className="reference-card"><div className="reference-card-head"><h2>My Performance <small>(This Week)</small></h2><button>This Week ▾</button></div><LineChart /></article>
          <article className="reference-card"><div className="reference-card-head"><h2>Today's Schedule</h2><button>View</button></div>{['Call with Rohan Sharma','Follow-up: Neha Patel','Demo Presentation','Internal Team Sync','Call with Dinesh Gupta'].map((t,i)=><div className="task-list-row" key={t}><span className="check"/><div><strong>{t}</strong><small>{['10:00 AM','11:30 AM','02:00 PM','04:00 PM','05:00 PM'][i]}</small></div><time>Call</time></div>)}</article>
        </section>
        <section className="reference-row employee-row-two">
          <article className="reference-card"><div className="reference-card-head"><h2>Recent Leads & Follow-ups</h2><button>View All Leads</button></div><table className="reference-table"><thead><tr><th>Lead Name</th><th>Company</th><th>Status</th><th>Next Follow-up</th></tr></thead><tbody>{leads.map(r=><tr key={r[0]}><td>{r[0]}</td><td>{r[1]}</td><td><span className="pill blue">{r[2]}</span></td><td>{r[3]}</td></tr>)}</tbody></table></article>
          <article className="reference-card"><div className="reference-card-head"><h2>May 2025</h2><button>›</button></div><div className="mini-calendar-grid">{['Sun','Mon','Tue','Wed','Thu','Fri','Sat','27','28','29','30','1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31'].map(d=><span className={d==='21'?'active':''} key={d}>{d}</span>)}</div></article>
          <article className="reference-card"><div className="reference-card-head"><h2>Recent Activity</h2><button>View</button></div>{['Called Ritu Verma','Created a new deal','Completed follow-up','Sent email to Neha'].map(t=><div className="activity-list-row" key={t}><span className="pill">✓</span><div><strong>{t}</strong><small>2m ago</small></div></div>)}</article>
        </section>
      </main>
    </div>
  );
}