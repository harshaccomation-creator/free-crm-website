import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import DashboardSidebar from '../../components/dashboard/DashboardSidebar.jsx';
import '../../styles/dashboardBase.css';
import '../../styles/referenceDashboardExact.css';
import '../../styles/sidebarGlobalFinalLock.css';
import '../../styles/zzzSidebarBlackFix.css';
import '../../styles/dashboardFontPolish.css';
import '../../styles/employeeDashboardPremiumFix.css';
import '../../styles/employeeDashboardVisibleFix.css';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

function DashIcon({ type }) {
  const icons = {
    users: <path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2M9.5 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M21 21v-2a4 4 0 0 0-3-3.8M16 3.2a4 4 0 0 1 0 7.6" />,
    check: <path d="M20 6 9 17l-5-5" />,
    phone: <path d="M22 16.9v3a2 2 0 0 1-2.2 2A19.8 19.8 0 0 1 3.1 5.2 2 2 0 0 1 5.1 3h3a2 2 0 0 1 2 1.7c.1.9.3 1.7.6 2.5a2 2 0 0 1-.5 2.1L9 10.5a16 16 0 0 0 4.5 4.5l1.2-1.2a2 2 0 0 1 2.1-.5c.8.3 1.6.5 2.5.6a2 2 0 0 1 1.7 2Z" />,
    target: <path d="M12 21a9 9 0 1 0-9-9 9 9 0 0 0 9 9Zm0-4a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0-4a1 1 0 1 0-1-1 1 1 0 0 0 1 1Z" />,
    search: <path d="m21 21-4.3-4.3M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z" />,
    bell: <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 7h18s-3 0-3-7M13.7 21a2 2 0 0 1-3.4 0" />,
  };
  return <svg className="dash-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">{icons[type]}</svg>;
}

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
  const [employee, setEmployee] = useState({ name: 'Employee', role: 'Sales Executive', initial: 'E' });

  useEffect(() => {
    let alive = true;
    async function loadEmployee() {
      const userEmail = localStorage.getItem('salesflow_user_email') || '';
      const userId = localStorage.getItem('salesflow_user_id') || '';
      if (!supabase) return;

      let query = supabase.from('profiles').select('full_name,email,role,created_at').limit(1);
      if (userId) query = query.eq('id', userId);
      else if (userEmail) query = query.eq('email', userEmail.toLowerCase());
      else query = query.eq('role', 'employee').order('created_at', { ascending: false });

      const { data, error } = await query.maybeSingle();
      if (!alive || error || !data) return;
      const name = data.full_name || data.email || 'Employee';
      setEmployee({
        name,
        role: data.role === 'employee' ? 'Sales Executive' : data.role || 'Employee',
        initial: name.slice(0, 1).toUpperCase(),
      });
    }
    loadEmployee();
    return () => { alive = false; };
  }, []);

  const leads = [
    ['Rohan Sharma','Sharma Industries','New','May 24, 2025 10:00 AM'],
    ['Neha Patel','Patel Healthcare','Contacted','May 23, 2025 11:30 AM'],
    ['Amit Kumar','Kumar Solutions','Proposal','May 26, 2025 02:00 PM'],
    ['Pooja Singh','Singh Enterprises','Follow-up','May 22, 2025 03:00 PM'],
  ];
  const schedule = [
    ['Call with Rohan Sharma', '10:00 AM', 'Call'],
    ['Follow-up: Neha Patel', '11:30 AM', 'Follow'],
    ['Demo Presentation', '02:00 PM', 'Join'],
    ['Internal Team Sync', '04:00 PM', 'View'],
    ['Call with Dinesh Gupta', '05:00 PM', 'Call'],
  ];
  return (
    <div className="sf-dashboard reference-dashboard employee-reference-dashboard">
      <DashboardSidebar role="employee" />
      <main className="reference-main">
        <header className="reference-topbar">
          <div className="reference-title"><h1>Welcome back, {employee.name.split(' ')[0]}!</h1><p>Here’s what’s happening with your work today.</p></div>
          <div className="reference-actions"><label className="reference-search"><DashIcon type="search" /><input placeholder="Search leads, contacts, tasks..." /></label><button className="reference-icon-btn"><DashIcon type="bell" /><i>5</i></button><button className="reference-profile"><span className="reference-avatar">{employee.initial}</span><span><strong>{employee.name}</strong><small>{employee.role}</small></span></button></div>
        </header>
        <section className="reference-stats">
          <article className="reference-stat"><span className="stat-icon"><DashIcon type="users" /></span><p>Assigned Leads</p><h2>128</h2><small>↑ 12% from last week</small></article>
          <article className="reference-stat danger"><span className="stat-icon"><DashIcon type="check" /></span><p>Tasks Due Today</p><h2>8</h2><small>3 overdue</small></article>
          <article className="reference-stat"><span className="stat-icon"><DashIcon type="phone" /></span><p>Calls Scheduled</p><h2>6</h2><small>Today</small></article>
          <article className="reference-stat target"><span className="stat-icon"><DashIcon type="target" /></span><p>Monthly Target Progress</p><h2>68%</h2><small>₹6,80,000 / ₹10,00,000</small><div className="progress"><b style={{width:'68%'}} /></div></article>
        </section>
        <section className="reference-row employee-row-one">
          <article className="reference-card performance-card"><div className="reference-card-head"><h2>My Performance <small>(This Week)</small></h2><button>This Week ▾</button></div><LineChart /></article>
          <article className="reference-card schedule-card"><div className="reference-card-head"><h2>Today's Schedule</h2><button>View</button></div>{schedule.map(([t, time, action])=><div className="task-list-row" key={t}><span className="check"/><div><strong>{t}</strong><small>{time}</small></div><time className={action === 'Join' ? 'join' : action === 'View' ? 'view' : ''}>{action}</time></div>)}</article>
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
