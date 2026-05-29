import { useMemo, useState } from 'react';
import DashboardSidebar from '../../components/dashboard/DashboardSidebar.jsx';
import '../../styles/dashboardBase.css';
import '../../styles/sidebarGlobalFinalLock.css';
import '../../styles/zzzSidebarBlackFix.css';
import '../../styles/employeeDashboardV2.css';

function go(path) {
  window.history.pushState({}, '', path);
  window.dispatchEvent(new Event('salesflow:navigate'));
}

const leads = [
  ['Rohan Sharma', 'Sharma Enterprises', 'New', '85'],
  ['Neha Patel', 'Patel & Co.', 'Contacted', '78'],
  ['Amit Kumar', 'Kumar Solutions', 'Qualified', '65'],
  ['Pooja Singh', 'Singh Industries', 'New', '60'],
  ['Vikram Mehta', 'Mehta Tech', 'Contacted', '55'],
];

const schedule = [
  ['10:00 AM', 'Call with Rohan Sharma', 'Product Demo', 'Call'],
  ['11:30 AM', 'Follow-up Neha Patel', 'Proposal Discussion', 'Follow'],
  ['02:00 PM', 'Demo Presentation', 'SalesFlow CRM', 'Join'],
  ['04:00 PM', 'Team Sync Meeting', 'Monthly Review', 'View'],
];

const activities = [
  ['Called Rohan Sharma', '10:00 AM · 29 May 2026', 'Completed'],
  ['Follow-up with Neha Patel', '11:30 AM · 29 May 2026', 'Upcoming'],
  ['Demo Presentation Scheduled', '02:00 PM · 29 May 2026', 'Upcoming'],
  ['Team Sync Meeting', '04:00 PM · 29 May 2026', 'Upcoming'],
];

const tasks = [
  ['Send Proposal to Rohan', 'High', '29 May'],
  ['Follow-up with Neha', 'High', '29 May'],
  ['Prepare Demo for Amit', 'Medium', '30 May'],
  ['Monthly Report Update', 'Low', '31 May'],
  ['Client Feedback Call', 'Medium', '31 May'],
];

export default function EmployeeDashboardV2() {
  const [search, setSearch] = useState('');
  const [notice, setNotice] = useState('');
  const [period, setPeriod] = useState('This Week');
  const email = localStorage.getItem('salesflow_user_email') || 'jayrajsinhzala607@gmail.com';
  const rawName = email.split('@')[0].replace(/[._-]+/g, ' ');
  const displayName = rawName.length > 16 ? 'Jay Rajsinh' : rawName.replace(/\b\w/g, (c) => c.toUpperCase());
  const initial = displayName.slice(0, 1).toUpperCase();

  const filteredLeads = useMemo(() => {
    const q = search.toLowerCase().trim();
    return q ? leads.filter((item) => item.join(' ').toLowerCase().includes(q)) : leads;
  }, [search]);

  const filteredSchedule = useMemo(() => {
    const q = search.toLowerCase().trim();
    return q ? schedule.filter((item) => item.join(' ').toLowerCase().includes(q)) : schedule;
  }, [search]);

  const toast = (text) => {
    setNotice(text);
    setTimeout(() => setNotice(''), 1600);
  };

  return (
    <div className="sf-dashboard employee-v2-page emp-mock-dashboard">
      <DashboardSidebar role="employee" />
      <main className="employee-v2-main">
        <header className="employee-v2-top mock-top">
          <div className="mock-title-block">
            <span>Employee Workspace</span>
            <h1>Welcome back, {displayName}! <em>👋</em></h1>
            <p>Here&apos;s what&apos;s happening with your work today.</p>
          </div>
          <div className="employee-v2-actions mock-actions">
            <label><b>⌕</b><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search leads, tasks, calls, contacts..." /><kbd>Ctrl + K</kbd></label>
            <button type="button" className="icon-action" onClick={() => toast('You have 5 notifications today')}>🔔<i>5</i></button>
            <button type="button" className="profile-btn" onClick={() => go('/employee/profile')}><i>{initial}</i><strong>{displayName}<small>Employee</small></strong></button>
          </div>
        </header>

        {notice && <div className="employee-v2-toast">{notice}</div>}

        <section className="mock-date-row"><button type="button" onClick={() => go('/employee/calendar')}>📅 Thursday, 29 May 2026</button></section>

        <section className="mock-kpi-grid">
          <button type="button" onClick={() => go('/leads')}><i className="blue">👥</i><small>Assigned Leads</small><strong>128</strong><em>↑ 12% from last week</em></button>
          <button type="button" onClick={() => go('/leads')}><i className="green">👤</i><small>New Leads Today</small><strong>24</strong><em>↑ 8% from yesterday</em></button>
          <button type="button" onClick={() => go('/employee/tasks')}><i className="orange">☑</i><small>Follow-ups Due</small><strong>18</strong><em className="red">↑ 5 from yesterday</em></button>
          <button type="button" onClick={() => go('/employee/tasks')}><i className="redIcon">◷</i><small>Overdue Tasks</small><strong>7</strong><em>↓ 3 from yesterday</em></button>
          <button type="button" onClick={() => go('/employee/calendar')}><i className="blue">☎</i><small>Calls Scheduled</small><strong>6</strong><em>Today</em></button>
          <button type="button" onClick={() => toast('Monthly target is updated weekly')}><i className="green">◎</i><small>Monthly Target</small><strong>68%</strong><em>6.8L / 10L</em></button>
        </section>

        <section className="mock-main-grid">
          <article className="mock-card performance-wide">
            <div className="mock-card-head"><div><h2>My Performance</h2><p><b>●</b> Leads <b className="green-dot">●</b> Calls <b className="purple-dot">●</b> Deals Won</p></div><button type="button" onClick={() => setPeriod(period === 'This Week' ? 'This Month' : 'This Week')}>{period}⌄</button></div>
            <div className="mock-line-chart"><svg viewBox="0 0 620 260"><line x1="55" y1="55" x2="570" y2="55"/><line x1="55" y1="100" x2="570" y2="100"/><line x1="55" y1="145" x2="570" y2="145"/><line x1="55" y1="190" x2="570" y2="190"/><path d="M55 165 L140 145 L225 82 L310 132 L395 78 L480 132 L570 112" className="line1"/><path d="M55 178 L140 150 L225 116 L310 148 L395 120 L480 154 L570 145" className="line2"/><path d="M55 210 L140 182 L225 205 L310 196 L395 170 L480 202 L570 184" className="line3"/><text x="55" y="238">Mon</text><text x="140" y="238">Tue</text><text x="225" y="238">Wed</text><text x="310" y="238">Thu</text><text x="395" y="238">Fri</text><text x="480" y="238">Sat</text><text x="570" y="238">Sun</text></svg></div>
            <div className="mock-chart-numbers"><span>Leads <b>104</b></span><span>Calls <b>32</b></span><span>Deals Won <b>8</b></span><span>Conversion <b>7.6%</b></span></div>
          </article>

          <article className="mock-card schedule-card-mock">
            <div className="mock-card-head"><div><h2>Today&apos;s Schedule</h2></div><button type="button" onClick={() => go('/employee/calendar')}>View All</button></div>
            {filteredSchedule.map(([time, title, sub, action]) => <div className="mock-schedule-row" key={title}><time>{time}</time><div><strong>{title}</strong><small>{sub}</small></div><button type="button" onClick={() => action === 'View' ? go('/employee/calendar') : toast(`${action} action ready`)}>{action}</button></div>)}
          </article>

          <article className="mock-card priority-card">
            <div className="mock-card-head"><div><h2>Priority Leads</h2></div><button type="button" onClick={() => go('/leads')}>View All</button></div>
            {filteredLeads.slice(0,4).map(([name, company,, score]) => <div className="priority-row" key={name}><span>{name.split(' ').map((p) => p[0]).join('')}</span><div><strong>{name}</strong><small>{company}</small></div><em>{Number(score) > 70 ? 'Hot' : 'Warm'}</em><b>{score}</b></div>)}
          </article>
        </section>

        <section className="mock-bottom-grid">
          <article className="mock-card recent-leads-card">
            <div className="mock-card-head"><div><h2>Recent Leads</h2></div><button type="button" onClick={() => go('/leads')}>View All</button></div>
            <table><thead><tr><th>Name</th><th>Company</th><th>Status</th><th>Score</th></tr></thead><tbody>{filteredLeads.map(([name, company, status, score]) => <tr key={name} onClick={() => go('/leads')}><td>{name}</td><td>{company}</td><td><span>{status}</span></td><td>{score}</td></tr>)}</tbody></table>
          </article>
          <article className="mock-card activity-card-mock"><div className="mock-card-head"><div><h2>Recent Activities</h2></div><button type="button" onClick={() => go('/employee/activities')}>View All</button></div>{activities.map(([title, sub, status]) => <div className="activity-mock-row" key={title}><i>☎</i><div><strong>{title}</strong><small>{sub}</small></div><span>{status}</span></div>)}</article>
          <article className="mock-card tasks-card-mock"><div className="mock-card-head"><div><h2>Upcoming Tasks</h2></div><button type="button" onClick={() => go('/employee/tasks')}>View All</button></div>{tasks.map(([title, priority, date]) => <div className="task-mock-row" key={title}><input type="checkbox"/><div><strong>{title}</strong></div><span className={priority.toLowerCase()}>{priority}</span><time>{date}</time></div>)}</article>
        </section>
      </main>
    </div>
  );
}
