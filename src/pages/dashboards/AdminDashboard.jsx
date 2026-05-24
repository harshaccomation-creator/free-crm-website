import DashboardSidebar from '../../components/dashboard/DashboardSidebar.jsx';
import '../../styles/dashboardBase.css';
import '../../styles/referenceDashboardExact.css';

function AdminChart() {
  return (
    <div className="reference-chart">
      <svg viewBox="0 0 700 270" aria-label="Admin sales chart">
        {[45,85,125,165,205].map((y) => <line key={y} x1="44" y1={y} x2="660" y2={y} className="chart-grid" />)}
        <line x1="44" y1="24" x2="44" y2="218" className="chart-axis" /><line x1="44" y1="218" x2="660" y2="218" className="chart-axis" />
        <path d="M52 182 C108 154 164 112 230 130 C288 146 342 76 416 100 C486 126 548 70 640 42 L640 218 L52 218 Z" className="chart-fill" />
        <path d="M52 138 C114 158 176 104 236 126 C292 148 356 88 426 118 C492 146 560 96 640 104" className="chart-line light" />
        <path d="M52 182 C108 154 164 112 230 130 C288 146 342 76 416 100 C486 126 548 70 640 42" className="chart-line" />
        {[[52,182],[164,112],[230,130],[416,100],[548,70],[640,42]].map(([x,y]) => <circle key={`${x}-${y}`} cx={x} cy={y} r="6" className="chart-dot" />)}
        {['Jan','Feb','Mar','Apr','May','Jun','Jul'].map((m,i) => <text key={m} x={58+i*96} y="250" className="chart-label">{m}</text>)}
      </svg>
    </div>
  );
}

export default function AdminDashboard() {
  const deals = [
    ['Enterprise CRM Implementation','Acme Inc.','Rohan Sharma','Proposal','₹12,50,000'],
    ['SaaS Platform Upgrade','Globex Corp.','Neha Patel','Negotiation','₹8,75,000'],
    ['Marketing Automation Suite','TechNova Pvt. Ltd.','Amit Kumar','Qualification','₹5,60,000'],
    ['Customer Support Solution','Bright Future Ltd.','Sneha Iyer','Proposal','₹4,20,000'],
  ];

  return (
    <div className="sf-dashboard reference-dashboard admin-reference-dashboard">
      <DashboardSidebar role="admin" />
      <main className="reference-main">
        <header className="reference-topbar">
          <div className="reference-title"><h1>Good morning, Priya! 👋</h1><p>Here’s what’s happening across your company today.</p></div>
          <div className="reference-actions"><label className="reference-search"><span>⌕</span><input placeholder="Search leads, contacts, deals, reports..." /></label><button className="reference-icon-btn">🔔<i>8</i></button><button className="reference-profile"><span className="reference-avatar">P</span><span><strong>Priya Mehta</strong><small>Company Admin</small></span></button></div>
        </header>
        <section className="reference-stats">
          <article className="reference-stat"><span className="stat-icon">👥</span><p>Total Employees</p><h2>124</h2><small>↑ 12% from last month</small></article>
          <article className="reference-stat"><span className="stat-icon">♙</span><p>Active Leads</p><h2>632</h2><small>↑ 18% from last month</small></article>
          <article className="reference-stat"><span className="stat-icon">▽</span><p>Deals in Pipeline</p><h2>87</h2><small>↑ 15% from last month</small></article>
          <article className="reference-stat"><span className="stat-icon">₹</span><p>Monthly Revenue</p><h2>₹24.8L</h2><small>↑ 22% from last month</small></article>
        </section>
        <section className="reference-row admin-row-one">
          <article className="reference-card"><div className="reference-card-head"><h2>Sales & Team Performance</h2><button>Monthly ▾</button></div><AdminChart /></article>
          <article className="reference-card"><div className="reference-card-head"><h2>Top Performing Employees</h2><button>This Month ▾</button></div>{['Rohan Sharma — ₹8,75,000','Neha Patel — ₹6,20,000','Amit Kumar — ₹4,85,000','Sneha Iyer — ₹3,90,000','Vikram Singh — ₹3,10,000'].map((t,i)=><div className="activity-list-row" key={t}><span className="reference-avatar">{t[0]}</span><div><strong>{t.split(' — ')[0]}</strong><small>{t.split(' — ')[1]} revenue</small></div><b>{98-i*3}%</b></div>)}</article>
        </section>
        <section className="reference-row admin-row-two">
          <article className="reference-card"><div className="reference-card-head"><h2>Recent Deals</h2><button>View Full Deals</button></div><table className="reference-table"><thead><tr><th>Deal Name</th><th>Account</th><th>Owner</th><th>Stage</th><th>Value</th></tr></thead><tbody>{deals.map(r=><tr key={r[0]}><td>{r[0]}</td><td>{r[1]}</td><td>{r[2]}</td><td><span className="pill blue">{r[3]}</span></td><td>{r[4]}</td></tr>)}</tbody></table></article>
          <article className="reference-card"><div className="reference-card-head"><h2>Today's Meetings</h2><button>Calendar</button></div>{['Leadership Standup','Sales Strategy Review','Product Demo for Acme Inc.','Client Onboarding Call','Weekly Operations Sync'].map((t,i)=><div className="task-list-row" key={t}><span className="check"/><div><strong>{t}</strong><small>{['10:00 AM','11:30 AM','02:00 PM','04:30 PM','05:30 PM'][i]}</small></div></div>)}</article>
        </section>
      </main>
    </div>
  );
}
