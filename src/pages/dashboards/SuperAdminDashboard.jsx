import DashboardSidebar from '../../components/dashboard/DashboardSidebar.jsx';
import '../../styles/dashboardBase.css';
import '../../styles/referenceDashboardExact.css';

function GrowthChart() {
  return (
    <div className="reference-chart">
      <svg viewBox="0 0 700 270" aria-label="Platform growth chart">
        {[45,85,125,165,205].map((y) => <line key={y} x1="44" y1={y} x2="660" y2={y} className="chart-grid" />)}
        <line x1="44" y1="24" x2="44" y2="218" className="chart-axis" /><line x1="44" y1="218" x2="660" y2="218" className="chart-axis" />
        <path d="M52 188 C120 150 164 132 230 108 C298 84 344 138 418 92 C492 52 548 72 640 30 L640 218 L52 218 Z" className="chart-fill" />
        <path d="M52 188 C120 150 164 132 230 108 C298 84 344 138 418 92 C492 52 548 72 640 30" className="chart-line" />
        {[[52,188],[164,132],[230,108],[344,138],[418,92],[548,72],[640,30]].map(([x,y]) => <circle key={`${x}-${y}`} cx={x} cy={y} r="6" className="chart-dot" />)}
        {['May 1','May 6','May 11','May 16','May 21','May 26','May 31'].map((m,i) => <text key={m} x={58+i*96} y="250" className="chart-label">{m}</text>)}
      </svg>
    </div>
  );
}

export default function SuperAdminDashboard() {
  const companies = [
    ['Sharma Industries','Professional','24','Active','₹24,000/mo'],
    ['Verma & Co.','Starter','6','Active','₹4,800/mo'],
    ['Patel Healthcare','Professional','18','Active','₹18,000/mo'],
    ['Kumar Solutions','Starter','5','Trial','Trial ends Jun 10'],
  ];
  return (
    <div className="sf-dashboard reference-dashboard super-reference-dashboard">
      <DashboardSidebar role="superAdmin" />
      <main className="reference-main">
        <header className="reference-topbar">
          <div className="reference-title"><h1>Welcome back, Harsh! 👋</h1><p>Super Admin · Manage and monitor your entire CRM platform.</p></div>
          <div className="reference-actions"><label className="reference-search"><span>⌕</span><input placeholder="Search companies, users, tickets..." /></label><button className="reference-icon-btn">🔔<i>8</i></button><button className="reference-profile"><span className="reference-avatar">H</span><span><strong>Harsh Goyal</strong><small>Super Admin</small></span></button></div>
        </header>
        <section className="reference-stats six">
          <article className="reference-stat"><span className="stat-icon">🏢</span><p>Total Companies</p><h2>256</h2><small>↑ 18% from last month</small></article>
          <article className="reference-stat"><span className="stat-icon">♙</span><p>Active Users</p><h2>4,892</h2><small>↑ 23% from last month</small></article>
          <article className="reference-stat"><span className="stat-icon">₹</span><p>Monthly Recurring Revenue</p><h2>₹48.72L</h2><small>↑ 16% from last month</small></article>
          <article className="reference-stat"><span className="stat-icon">⌛</span><p>Trial Accounts</p><h2>38</h2><small>↑ 7 new</small></article>
          <article className="reference-stat danger"><span className="stat-icon">◇</span><p>Open Support Tickets</p><h2>12</h2><small>14% from last month</small></article>
          <article className="reference-stat"><span className="stat-icon">♢</span><p>System Uptime</p><h2>99.98%</h2><small>Healthy</small></article>
        </section>
        <section className="reference-row super-row-one">
          <article className="reference-card"><div className="reference-card-head"><h2>Platform Growth & Revenue</h2><button>This Month ▾</button></div><GrowthChart /></article>
          <article className="reference-card"><div className="reference-card-head"><h2>Recent Signups</h2><button>View All</button></div>{['Sharma Industries — Professional Plan','Verma & Co. — Starter Plan','Patel Healthcare — Professional Plan','Kumar Solutions — Starter Plan','Gupta Traders — Enterprise Plan'].map((t,i)=><div className="activity-list-row" key={t}><span className="reference-avatar">{t[0]}</span><div><strong>{t.split(' — ')[0]}</strong><small>{t.split(' — ')[1]}</small></div><small>{i+1}h ago</small></div>)}</article>
        </section>
        <section className="reference-row super-row-two">
          <article className="reference-card"><div className="reference-card-head"><h2>Company Overview</h2><button>View All Companies</button></div><table className="reference-table"><thead><tr><th>Company Name</th><th>Plan</th><th>Users</th><th>Status</th><th>Billing</th></tr></thead><tbody>{companies.map(r=><tr key={r[0]}><td>{r[0]}</td><td><span className="pill blue">{r[1]}</span></td><td>{r[2]}</td><td><span className="pill">{r[3]}</span></td><td>{r[4]}</td></tr>)}</tbody></table></article>
          <article className="reference-card"><div className="reference-card-head"><h2>System Health</h2><button>View Status</button></div>{['Web Server','API Server','Database','File Storage','Email Service','Backup Service'].map((t,i)=><div className="health-list-row" key={t}><strong>{t}</strong><small>{i===1?'99.99%':'100%'}</small><span>Operational</span></div>)}</article>
        </section>
      </main>
    </div>
  );
}
