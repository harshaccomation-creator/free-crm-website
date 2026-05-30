import { useMemo, useState } from 'react';
import DashboardSidebar from '../../components/dashboard/DashboardSidebar.jsx';
import '../../styles/dashboardBase.css';
import '../../styles/sidebarGlobalFinalLock.css';
import '../../styles/zzzSidebarBlackFix.css';
import '../../styles/employeeDashboardV2.css';
import '../../styles/edc.css';
import '../../styles/edc2.css';
import '../../styles/employeeTopbarDarkFix.css';
import '../../styles/employeeHeaderFinal.css';
import '../../styles/employeeDashboardVisualPolish.css';

function go(path) {
  window.history.pushState({}, '', path);
  window.dispatchEvent(new Event('salesflow:navigate'));
}

const iconPaths = {
  search: 'M21 21l-4.35-4.35M11 18a7 7 0 1 1 0-14 7 7 0 0 1 0 14Z',
  bell: 'M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0',
  menu: 'M4 7h16M4 12h16M4 17h16',
  users: 'M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2M9.5 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM21 21v-2a4 4 0 0 0-3-3.8M16 3.2a4 4 0 0 1 0 7.6',
  calendar: 'M7 3v4m10-4v4M4 9h16M5 5h14a1 1 0 0 1 1 1v14H4V6a1 1 0 0 1 1-1Z',
  trophy: 'M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4ZM17 6h3a2 2 0 0 1-2 4h-1M7 6H4a2 2 0 0 0 2 4h1',
  clock: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20ZM12 6v6l4 2',
  square: 'M5 5h14v14H5z',
  phone: 'M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.77.63 2.6a2 2 0 0 1-.45 2.11L8 9.7a16 16 0 0 0 6.3 6.3l1.27-1.27a2 2 0 0 1 2.11-.45c.83.3 1.7.51 2.6.63A2 2 0 0 1 22 16.92Z',
  whatsapp: 'M20.5 11.7a8.5 8.5 0 0 1-12.6 7.45L3 20.5l1.35-4.75A8.5 8.5 0 1 1 20.5 11.7ZM8.9 8.2c.2-.45.42-.46.74-.46h.55c.18 0 .42.06.64.5.23.45.78 1.9.85 2.04.06.15.1.32.02.5-.08.2-.12.32-.28.5-.15.18-.32.4-.45.53-.15.15-.3.32-.13.62.18.3.78 1.28 1.68 2.08 1.15 1.02 2.12 1.34 2.42 1.49.3.15.48.13.66-.08.2-.22.75-.87.95-1.17.2-.3.4-.25.67-.15.27.1 1.75.82 2.05.97.3.15.5.22.57.35.08.13.08.75-.17 1.47-.25.72-1.48 1.38-2.03 1.43-.52.05-1.18.08-1.9-.12-.44-.13-1-.32-1.72-.63-3.03-1.3-5-4.35-5.15-4.55-.15-.2-1.23-1.63-1.23-3.12 0-1.48.77-2.2 1.05-2.52.27-.3.6-.38.8-.38',
  lightning: 'M13 2 3 14h8l-1 8 11-13h-8l1-7Z',
  target: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20ZM12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12ZM12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z',
};

function SvgIcon({ name, className = '' }) {
  const path = iconPaths[name] || iconPaths.square;
  return <svg className={`emp-svg-icon ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={path} /></svg>;
}

const followups = [
  ['AS', 'Aisha Shaikh', 'Shaikh Enterprises', '10:00 AM', 'Interested'],
  ['RK', 'Rakesh Kumar', 'Kumar & Co.', '12:00 PM', 'Follow-up'],
  ['NP', 'Neha Patel', 'Patel Solutions', '03:30 PM', 'Proposal Sent'],
];

const leads = [
  ['Aisha Shaikh', 'Website', 'Interested', '20 May 2025, 10:00 AM', 'Rohan Mehta'],
  ['Rakesh Kumar', 'Referral', 'Follow-up', '20 May 2025, 12:00 PM', 'Rohan Mehta'],
  ['Neha Patel', 'Instagram', 'Proposal Sent', '20 May 2025, 03:30 PM', 'Rohan Mehta'],
  ['Imran Qureshi', 'Cold Call', 'New', '21 May 2025, 11:00 AM', 'Rohan Mehta'],
];

const starterTasks = [
  { id: 1, title: 'Send proposal to Aisha Shaikh', sub: 'Shaikh Enterprises', priority: 'High', due: 'Today', done: false },
  { id: 2, title: 'Follow-up call with Rakesh Kumar', sub: 'Kumar & Co.', priority: 'Medium', due: 'Today', done: false },
  { id: 3, title: 'Prepare quotation for Neha Patel', sub: 'Patel Solutions', priority: 'Medium', due: 'Tomorrow', done: false },
  { id: 4, title: 'Check in with Imran Qureshi', sub: 'Qureshi Traders', priority: 'Low', due: 'Tomorrow', done: false },
];

function statusClass(status) {
  return status.toLowerCase().replace(/\s+/g, '-');
}

function Trend({ direction = 'up', value, text }) {
  return <small className={direction === 'down' ? 'trend-down' : 'trend-up'}><b>{direction === 'down' ? '↓' : '↑'} {value}</b> {text}</small>;
}

export default function EmployeeDashboardV2() {
  const [search, setSearch] = useState('');
  const [tasks, setTasks] = useState(starterTasks);
  const [notice, setNotice] = useState('');
  const email = localStorage.getItem('salesflow_user_email') || 'rohan@salesflowhub.cloud';
  const displayName = email.split('@')[0].replace(/[._-]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  const q = search.toLowerCase().trim();

  const visibleFollowups = useMemo(() => q ? followups.filter((item) => item.join(' ').toLowerCase().includes(q)) : followups, [q]);
  const visibleLeads = useMemo(() => q ? leads.filter((item) => item.join(' ').toLowerCase().includes(q)) : leads, [q]);
  const visibleTasks = useMemo(() => q ? tasks.filter((item) => Object.values(item).join(' ').toLowerCase().includes(q)) : tasks, [q, tasks]);

  const toast = (text) => {
    setNotice(text);
    setTimeout(() => setNotice(''), 1600);
  };

  const toggleTask = (id) => {
    setTasks((prev) => prev.map((task) => task.id === id ? { ...task, done: !task.done } : task));
    toast('Task updated');
  };

  return (
    <div className="sf-dashboard employee-v2-page emp-mock-dashboard">
      <DashboardSidebar role="employee" />
      <main className="employee-v2-main">
        <header className="employee-topbar">
          <button type="button" className="employee-menu-btn"><SvgIcon name="menu" /></button>
          <label className="employee-search"><span><SvgIcon name="search" /></span><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search leads, clients, follow-ups..." /><kbd>⌘ K</kbd></label>
          <div className="employee-top-actions"><button type="button" className="employee-bell" onClick={() => toast('5 notifications')}><SvgIcon name="bell" /><i>5</i></button><button type="button" className="employee-profile" onClick={() => go('/employee/profile')}><b>{displayName[0] || 'R'}</b><span>{displayName || 'Rohan Mehta'}<small>Sales Executive</small></span><em>⌄</em></button></div>
        </header>
        {notice && <div className="employee-v2-toast">{notice}</div>}

        <section className="employee-kpis">
          <button type="button" className="kpi-card blue" onClick={() => go('/leads')}><i><SvgIcon name="users" /></i><div><span>Assigned Leads</span><strong>128</strong><Trend value="12%" text="from last week" /></div><svg viewBox="0 0 120 62"><path d="M5 52 C30 20 42 50 62 25 S93 8 115 18" /></svg></button>
          <button type="button" className="kpi-card purple" onClick={() => go('/employee/tasks')}><i><SvgIcon name="calendar" /></i><div><span>Today Follow-ups</span><strong>24</strong><Trend value="8%" text="from yesterday" /></div><svg viewBox="0 0 120 62"><path d="M5 50 C28 30 45 44 60 26 S92 12 115 18" /></svg></button>
          <button type="button" className="kpi-card green" onClick={() => go('/employee/won')}><i><SvgIcon name="trophy" /></i><div><span>Won Leads</span><strong>23</strong><Trend value="27%" text="from last month" /></div><svg viewBox="0 0 120 62"><path d="M5 55 C28 30 44 42 64 30 S90 4 116 14" /></svg></button>
          <button type="button" className="kpi-card orange" onClick={() => go('/employee/tasks')}><i><SvgIcon name="clock" /></i><div><span>Overdue Leads</span><strong>18</strong><Trend direction="down" value="5" text="from yesterday" /></div><svg viewBox="0 0 120 62"><path d="M5 52 C26 25 43 40 62 22 S92 10 115 14" /></svg></button>
        </section>

        <section className="employee-main-grid">
          <article className="emp-card followup-card"><div className="emp-card-head"><h2><span><SvgIcon name="calendar" /></span> Today&apos;s Follow-ups</h2><button type="button" onClick={() => go('/employee/calendar')}>View All ›</button></div><div className="followup-list">{visibleFollowups.map(([avatar, name, company, time, status]) => <div className="followup-row" key={name}><span className="avatar-badge">{avatar}</span><div><strong>{name}</strong><small>{company}</small></div><time><SvgIcon name="clock" /> {time}</time><em className={`status ${statusClass(status)}`}>• {status}</em><button type="button" onClick={() => toast(`Call action for ${name}`)}><SvgIcon name="phone" /> Call</button><button type="button" className="wa" onClick={() => toast(`WhatsApp action for ${name}`)}><SvgIcon name="whatsapp" /> WhatsApp</button></div>)}</div></article>
          <article className="emp-card tasks-panel"><div className="emp-card-head"><h2>My Tasks</h2><button type="button" onClick={() => go('/employee/tasks')}>View All ›</button></div>{visibleTasks.map((task) => <label className={`task-row ${task.done ? 'done' : ''}`} key={task.id}><input type="checkbox" checked={task.done} onChange={() => toggleTask(task.id)} /><div><strong>{task.title}</strong><small>{task.sub}</small></div><em className={task.priority.toLowerCase()}>{task.priority}</em><time>{task.due}</time></label>)}</article>
        </section>

        <section className="employee-bottom-grid">
          <article className="emp-card recent-panel"><div className="emp-card-head"><h2>Recent Leads</h2><button type="button" onClick={() => go('/leads')}>View All ›</button></div><table><thead><tr><th>Name</th><th>Source</th><th>Status</th><th>Follow-up Date</th><th>Assigned By</th></tr></thead><tbody>{visibleLeads.map(([name, source, status, followup, assigned]) => <tr key={name} onClick={() => go('/leads')}><td>{name}</td><td>{source}</td><td><span className={`status ${statusClass(status)}`}>• {status}</span></td><td>{followup}</td><td><b className="mini-face">RM</b> {assigned}</td></tr>)}</tbody></table><footer>Showing 1 to {visibleLeads.length} of 12 leads <button type="button" onClick={() => go('/leads')}>View All Leads →</button></footer></article>
          <article className="emp-card performance-panel"><div className="emp-card-head"><h2>Performance</h2><button type="button" onClick={() => toast('Monthly filter selected')}>This Month⌄</button></div><div className="perf-body"><div className="perf-chart"><p>Leads vs Conversions <span><i /> Leads</span><span><i className="orange-dot" /> Won Leads</span></p><svg viewBox="0 0 520 260"><g className="grid"><line x1="40" y1="35" x2="500" y2="35"/><line x1="40" y1="85" x2="500" y2="85"/><line x1="40" y1="135" x2="500" y2="135"/><line x1="40" y1="185" x2="500" y2="185"/></g><rect x="60" y="205" width="18" height="28"/><rect x="96" y="195" width="18" height="38"/><rect x="132" y="178" width="18" height="55"/><rect x="168" y="188" width="18" height="45"/><rect x="204" y="194" width="18" height="39"/><rect x="240" y="184" width="18" height="49"/><rect x="276" y="174" width="18" height="59"/><rect x="312" y="158" width="18" height="75"/><rect x="348" y="146" width="18" height="87"/><rect x="384" y="154" width="18" height="79"/><rect x="420" y="130" width="18" height="103"/><path className="lead-line" d="M55 170 L91 168 L127 122 L163 108 L199 118 L235 112 L271 98 L307 76 L343 58 L379 66 L415 45 L455 24"/><path className="won-line" d="M55 202 L91 198 L127 178 L163 170 L199 184 L235 168 L271 150 L307 128 L343 110 L379 120 L415 92 L455 72"/><text x="40" y="246">1 May</text><text x="140" y="246">8 May</text><text x="250" y="246">15 May</text><text x="360" y="246">22 May</text><text x="455" y="246">29 May</text></svg></div><aside className="perf-stats"><div><i><SvgIcon name="target" /></i><span>Conversion Rate</span><strong>17.9%</strong><Trend value="3.2%" text="vs last month" /></div><div><i><SvgIcon name="users" /></i><span>Total Leads</span><strong>128</strong><Trend value="12%" text="vs last month" /></div><div><i><SvgIcon name="trophy" /></i><span>Won Leads</span><strong>23</strong><Trend value="27%" text="vs last month" /></div></aside></div></article>
          <article className="emp-card quick-panel"><div className="emp-card-head"><h2><span><SvgIcon name="lightning" /></span> Quick Actions</h2></div><button type="button" className="orange-action" onClick={() => toast('Follow-up form ready')}><i><SvgIcon name="calendar" /></i><span>Add Follow-up<small>Schedule a new follow-up</small></span></button><button type="button" className="blue-action" onClick={() => go('/leads')}><i><SvgIcon name="users" /></i><span>Open My Leads<small>View all assigned leads</small></span></button><button type="button" className="red-action" onClick={() => go('/employee/tasks')}><i><SvgIcon name="clock" /></i><span>View Overdue<small>Check overdue leads</small></span></button></article>
        </section>
      </main>
    </div>
  );
}
