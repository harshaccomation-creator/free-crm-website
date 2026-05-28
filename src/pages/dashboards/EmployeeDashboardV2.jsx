import { useMemo, useState } from 'react';
import DashboardSidebar from '../../components/dashboard/DashboardSidebar.jsx';
import '../../styles/dashboardBase.css';
import '../../styles/referenceDashboardExact.css';
import '../../styles/sidebarGlobalFinalLock.css';
import '../../styles/zzzSidebarBlackFix.css';
import '../../styles/employeeDashboardV2.css';

function go(path) {
  window.history.pushState({}, '', path);
  window.dispatchEvent(new Event('salesflow:navigate'));
}

const leads = [
  ['Rohan Sharma', 'Sharma Industries', 'New', 'Today 10:00 AM'],
  ['Neha Patel', 'Patel Healthcare', 'Contacted', 'Today 11:30 AM'],
  ['Amit Kumar', 'Kumar Solutions', 'Proposal', 'Today 02:00 PM'],
  ['Pooja Singh', 'Singh Enterprises', 'Follow-up', 'Tomorrow 03:00 PM'],
];

const schedule = [
  ['Call with Rohan Sharma', '10:00 AM', 'Call'],
  ['Follow-up Neha Patel', '11:30 AM', 'Follow'],
  ['Demo Presentation', '02:00 PM', 'Join'],
  ['Team Sync', '04:00 PM', 'View'],
];

export default function EmployeeDashboardV2() {
  const [search, setSearch] = useState('');
  const [notice, setNotice] = useState('');
  const [period, setPeriod] = useState('This Week');
  const email = localStorage.getItem('salesflow_user_email') || 'employee@salesflow.com';
  const name = email.split('@')[0].replace(/[._-]/g, ' ') || 'Employee';
  const firstName = name.split(' ')[0];
  const initial = firstName.slice(0, 1).toUpperCase();

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
    <div className="sf-dashboard employee-v2-page">
      <DashboardSidebar role="employee" />
      <main className="employee-v2-main">
        <header className="employee-v2-top">
          <div>
            <span>Employee Workspace</span>
            <h1>Welcome back, {firstName}</h1>
            <p>Track leads, follow-ups, calls and daily sales activity from one place.</p>
          </div>
          <div className="employee-v2-actions">
            <label><b>Search</b><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search leads, tasks, calls" /></label>
            <button type="button" onClick={() => toast('You have 5 notifications today')}>Notifications</button>
            <button type="button" onClick={() => go('/employee/profile')} className="profile-btn"><i>{initial}</i>{firstName}</button>
          </div>
        </header>

        {notice && <div className="employee-v2-toast">{notice}</div>}

        <section className="employee-v2-stats">
          <button type="button" onClick={() => go('/leads')}><small>Assigned Leads</small><strong>128</strong><span>Open leads page</span></button>
          <button type="button" onClick={() => go('/employee/tasks')}><small>Tasks Due Today</small><strong>8</strong><span>3 overdue</span></button>
          <button type="button" onClick={() => go('/employee/calendar')}><small>Calls Scheduled</small><strong>6</strong><span>View calendar</span></button>
          <button type="button" onClick={() => toast('Target tracking is updated weekly')}><small>Monthly Target</small><strong>68%</strong><span>6.8L / 10L</span></button>
        </section>

        <section className="employee-v2-grid">
          <article className="employee-v2-card big">
            <div className="card-head"><div><h2>My Performance</h2><p>{period}</p></div><button type="button" onClick={() => setPeriod(period === 'This Week' ? 'This Month' : 'This Week')}>{period}</button></div>
            <div className="performance-bars"><span style={{height:'58%'}} /><span style={{height:'72%'}} /><span style={{height:'86%'}} /><span style={{height:'65%'}} /><span style={{height:'92%'}} /><span style={{height:'80%'}} /><span style={{height:'96%'}} /></div>
          </article>
          <article className="employee-v2-card">
            <div className="card-head"><div><h2>Today's Schedule</h2><p>{filteredSchedule.length} items</p></div><button type="button" onClick={() => go('/employee/calendar')}>View All</button></div>
            {filteredSchedule.map(([title, time, action]) => <div className="schedule-row" key={title}><div><strong>{title}</strong><small>{time}</small></div><button type="button" onClick={() => action === 'View' ? go('/employee/calendar') : toast(`${action} action ready`)}>{action}</button></div>)}
            {!filteredSchedule.length && <p className="empty-text">No schedule found.</p>}
          </article>
        </section>

        <section className="employee-v2-grid bottom">
          <article className="employee-v2-card big">
            <div className="card-head"><div><h2>Recent Leads and Follow-ups</h2><p>{filteredLeads.length} matching leads</p></div><button type="button" onClick={() => go('/leads')}>View All Leads</button></div>
            <div className="lead-table"><div className="head"><b>Lead</b><b>Company</b><b>Status</b><b>Follow-up</b></div>{filteredLeads.map((row) => <button type="button" key={row[0]} onClick={() => go('/leads')}><span>{row[0]}</span><span>{row[1]}</span><span className="status-pill">{row[2]}</span><span>{row[3]}</span></button>)}</div>
            {!filteredLeads.length && <p className="empty-text">No leads found.</p>}
          </article>
          <article className="employee-v2-card"><div className="card-head"><div><h2>Recent Activity</h2><p>Latest updates</p></div><button type="button" onClick={() => go('/employee/activities')}>View All</button></div>{['Called Ritu Verma','Created a new deal','Completed follow-up','Sent email to Neha'].map((item) => <div className="activity-row" key={item}><i>OK</i><div><strong>{item}</strong><small>2m ago</small></div></div>)}</article>
        </section>
      </main>
    </div>
  );
}
