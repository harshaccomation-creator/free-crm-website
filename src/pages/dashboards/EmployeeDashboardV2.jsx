import { useMemo, useState } from 'react';
import DashboardSidebar from '../../components/dashboard/DashboardSidebar.jsx';
import '../../styles/dashboardBase.css';
import '../../styles/sidebarGlobalFinalLock.css';
import '../../styles/zzzSidebarBlackFix.css';
import '../../styles/employeeDashboardV2.css';
import '../../styles/edc.css';
import '../../styles/edc2.css';

function go(path) {
  window.history.pushState({}, '', path);
  window.dispatchEvent(new Event('salesflow:navigate'));
}

const followups = [
  ['AS', 'Aisha Shaikh', 'Shaikh Enterprises', '10:00 AM', 'Interested'],
  ['RK', 'Rakesh Kumar', 'Kumar & Co.', '12:00 PM', 'Follow-up'],
  ['NP', 'Neha Patel', 'Patel Solutions', '03:30 PM', 'Proposal Sent'],
  ['IQ', 'Imran Qureshi', 'Qureshi Traders', '05:00 PM', 'Quotation'],
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
          <button type="button" className="employee-menu-btn">☰</button>
          <label className="employee-search"><span>⌕</span><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search leads, clients, follow-ups..." /><kbd>⌘ K</kbd></label>
          <div className="employee-top-actions"><button type="button" className="employee-bell" onClick={() => toast('5 notifications')}>🔔<i>5</i></button><button type="button" className="employee-profile" onClick={() => go('/employee/profile')}><b>{displayName[0] || 'R'}</b><span>{displayName || 'Rohan Mehta'}<small>Sales Executive</small></span><em>⌄</em></button></div>
        </header>
        {notice && <div className="employee-v2-toast">{notice}</div>}

        <section className="employee-kpis">
          <button type="button" className="kpi-card blue" onClick={() => go('/leads')}><i>👥</i><div><span>Assigned Leads</span><strong>128</strong><small>↑ 18% vs last week</small></div><svg viewBox="0 0 120 62"><path d="M5 52 C30 20 42 50 62 25 S93 8 115 18" /></svg></button>
          <button type="button" className="kpi-card purple" onClick={() => go('/employee/tasks')}><i>📅</i><div><span>Today Follow-ups</span><strong>07</strong><small>↑ 12% vs yesterday</small></div><svg viewBox="0 0 120 62"><path d="M5 50 C28 30 45 44 60 26 S92 12 115 18" /></svg></button>
          <button type="button" className="kpi-card green" onClick={() => go('/employee/won')}><i>🏆</i><div><span>Won Leads</span><strong>23</strong><small>↑ 27% vs last month</small></div><svg viewBox="0 0 120 62"><path d="M5 55 C28 30 44 42 64 30 S90 4 116 14" /></svg></button>
          <button type="button" className="kpi-card orange" onClick={() => go('/employee/tasks')}><i>⏱</i><div><span>Overdue Leads</span><strong>15</strong><small className="bad">↓ 8% vs yesterday</small></div><svg viewBox="0 0 120 62"><path d="M5 52 C26 25 43 40 62 22 S92 10 115 14" /></svg></button>
        </section>

        <section className="employee-main-grid">
          <article className="emp-card followup-card"><div className="emp-card-head"><h2><span>▣</span> Today&apos;s Follow-ups</h2><button type="button" onClick={() => go('/employee/calendar')}>View All ›</button></div><div className="followup-list">{visibleFollowups.map(([avatar, name, company, time, status]) => <div className="followup-row" key={name}><span className="avatar-badge">{avatar}</span><div><strong>{name}</strong><small>{company}</small></div><time>◷ {time}</time><em className={`status ${statusClass(status)}`}>• {status}</em><button type="button" onClick={() => toast(`Call action for ${name}`)}>📞 Call</button><button type="button" className="wa" onClick={() => toast(`Message action for ${name}`)}>🟢 Message</button></div>)}</div></article>
          <article className="emp-card tasks-panel"><div className="emp-card-head"><h2>My Tasks</h2><button type="button" onClick={() => go('/employee/tasks')}>View All ›</button></div>{visibleTasks.map((task) => <label className={`task-row ${task.done ? 'done' : ''}`} key={task.id}><input type="checkbox" checked={task.done} onChange={() => toggleTask(task.id)} /><div><strong>{task.title}</strong><small>{task.sub}</small></div><em className={task.priority.toLowerCase()}>{task.priority}</em><time>{task.due}</time></label>)}</article>
        </section>

        <section className="employee-bottom-grid">
          <article className="emp-card recent-panel"><div className="emp-card-head"><h2>Recent Leads</h2><button type="button" onClick={() => go('/leads')}>View All ›</button></div><table><thead><tr><th>Name</th><th>Source</th><th>Status</th><th>Follow-up Date</th><th>Assigned By</th></tr></thead><tbody>{visibleLeads.map(([name, source, status, followup, assigned]) => <tr key={name} onClick={() => go('/leads')}><td>{name}</td><td>{source}</td><td><span className={`status ${statusClass(status)}`}>• {status}</span></td><td>{followup}</td><td><b className="mini-face">RM</b> {assigned}</td></tr>)}</tbody></table><footer>Showing 1 to {visibleLeads.length} of {leads.length} leads <button type="button" onClick={() => go('/leads')}>View All Leads →</button></footer></article>
          <article className="emp-card performance-panel"><div className="emp-card-head"><h2>Performance</h2><button type="button" onClick={() => toast('Monthly filter selected')}>This Month⌄</button></div><div className="perf-body"><div className="perf-chart"><p>Leads vs Conversions <span><i /> Leads</span><span><i className="orange-dot" /> Won Leads</span></p><svg viewBox="0 0 520 260"><g className="grid"><line x1="40" y1="35" x2="500" y2="35"/><line x1="40" y1="85" x2="500" y2="85"/><line x1="40" y1="135" x2="500" y2="135"/><line x1="40" y1="185" x2="500" y2="185"/></g><rect x="60" y="205" width="18" height="28"/><rect x="96" y="195" width="18" height="38"/><rect x="132" y="178" width="18" height="55"/><rect x="168" y="188" width="18" height="45"/><rect x="204" y="194" width="18" height="39"/><rect x="240" y="184" width="18" height="49"/><rect x="276" y="174" width="18" height="59"/><rect x="312" y="158" width="18" height="75"/><rect x="348" y="146" width="18" height="87"/><rect x="384" y="154" width="18" height="79"/><rect x="420" y="130" width="18" height="103"/><path className="lead-line" d="M55 170 L91 168 L127 122 L163 108 L199 118 L235 112 L271 98 L307 76 L343 58 L379 66 L415 45 L455 24"/><path className="won-line" d="M55 202 L91 198 L127 178 L163 170 L199 184 L235 168 L271 150 L307 128 L343 110 L379 120 L415 92 L455 72"/><text x="40" y="246">1 May</text><text x="140" y="246">8 May</text><text x="250" y="246">15 May</text><text x="360" y="246">22 May</text><text x="455" y="246">29 May</text></svg></div><aside className="perf-stats"><div><i>🎯</i><span>Conversion Rate</span><strong>17.9%</strong><small>↑ 3.2% vs last month</small></div><div><i>👥</i><span>Total Leads</span><strong>128</strong><small>↑ 18% vs last month</small></div><div><i>🏆</i><span>Won Leads</span><strong>23</strong><small>↑ 27% vs last month</small></div></aside></div></article>
          <article className="emp-card quick-panel"><div className="emp-card-head"><h2><span>⚡</span> Quick Actions</h2></div><button type="button" className="orange-action" onClick={() => toast('Follow-up form ready')}><i>📅</i><span>Add Follow-up<small>Schedule a new follow-up</small></span></button><button type="button" className="blue-action" onClick={() => go('/leads')}><i>👥</i><span>Open My Leads<small>View all assigned leads</small></span></button><button type="button" className="red-action" onClick={() => go('/employee/tasks')}><i>⏱</i><span>View Overdue<small>Check overdue leads</small></span></button></article>
        </section>
      </main>
    </div>
  );
}
