import { useEffect, useMemo, useState } from 'react';
import DashboardSidebar from '../../components/dashboard/DashboardSidebar.jsx';
import { getMyDashboardSummary, markAllNotificationsRead, updateTask } from '../../services/crmApi.js';
import '../../styles/employeeDashboardClean.css';

function go(path) {
  window.history.pushState({}, '', path);
  window.dispatchEvent(new Event('salesflow:navigate'));
}

const iconPaths = {
  search: 'M21 21l-4.35-4.35M11 18a7 7 0 1 1 0-14 7 7 0 0 1 0 14Z',
  bell: 'M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0',
  users: 'M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2M9.5 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM21 21v-2a4 4 0 0 0-3-3.8M16 3.2a4 4 0 0 1 0 7.6',
  calendar: 'M7 3v4m10-4v4M4 9h16M5 5h14a1 1 0 0 1 1 1v14H4V6a1 1 0 0 1 1-1Z',
  trophy: 'M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4ZM17 6h3a2 2 0 0 1-2 4h-1M7 6H4a2 2 0 0 0 2 4h1',
  clock: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20ZM12 6v6l4 2',
  check: 'M20 6 9 17l-5-5',
  lightning: 'M13 2 3 14h8l-1 8 11-13h-8l1-7Z',
};

function Icon({ name }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={iconPaths[name] || iconPaths.users} /></svg>;
}

function formatTime(value) {
  const date = value ? new Date(value) : null;
  return date && !Number.isNaN(date.getTime()) ? date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }) : '-';
}

function formatDate(value) {
  const date = value ? new Date(value) : null;
  return date && !Number.isNaN(date.getTime()) ? date.toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }).replace(',', '') : '-';
}

function initials(name = '') {
  return String(name || 'J').split(/\s+/).map((p) => p[0]).join('').slice(0, 2).toUpperCase();
}

function KpiCard({ icon, title, value, note, tone, onClick }) {
  return <button className={`clean-kpi ${tone}`} type="button" onClick={onClick}><i><Icon name={icon} /></i><div><span>{title}</span><strong>{value}</strong><small>{note}</small></div><em /></button>;
}

export default function EmployeeDashboardClean() {
  const [summary, setSummary] = useState(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const displayName = summary?.profile?.full_name || localStorage.getItem('salesflow_user_name') || 'Jayraj';
  const q = search.toLowerCase().trim();

  async function load() {
    setLoading(true);
    try { setSummary(await getMyDashboardSummary()); } finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  const leads = summary?.recentLeads || [];
  const tasks = summary?.tasks || [];
  const visibleLeads = useMemo(() => q ? leads.filter((lead) => JSON.stringify(lead).toLowerCase().includes(q)) : leads.slice(0, 6), [q, leads]);
  const visibleTasks = useMemo(() => q ? tasks.filter((task) => JSON.stringify(task).toLowerCase().includes(q)) : tasks.slice(0, 3), [q, tasks]);

  async function completeTask(task) {
    await updateTask(task.id, { status: 'Completed' });
    await load();
  }

  async function readNotifications() {
    await markAllNotificationsRead();
    await load();
  }

  return <div className="clean-dashboard-page">
    <DashboardSidebar role="employee" />
    <main className="clean-main">
      <header className="clean-topbar">
        <label className="clean-search"><Icon name="search" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search leads, clients, follow-ups..." /></label>
        <button className="clean-bell" type="button" onClick={readNotifications}><Icon name="bell" /><span>{summary?.unreadNotifications || 0}</span></button>
        <div className="clean-user"><b>{displayName[0] || 'J'}</b><div><strong>{displayName}</strong><small>Sales Executive</small></div></div>
        <button className="clean-logout" type="button" onClick={() => { localStorage.clear(); go('/login'); }}>Logout</button>
      </header>

      <section className="clean-kpi-grid">
        <KpiCard tone="blue" icon="users" title="Assigned Leads" value={loading ? '...' : summary?.assignedLeads || 0} note="live from Supabase" onClick={() => go('/leads')} />
        <KpiCard tone="purple" icon="calendar" title="Today Follow-ups" value={loading ? '...' : summary?.todayFollowups || 0} note="today scheduled" onClick={() => go('/employee/calendar')} />
        <KpiCard tone="green" icon="trophy" title="Won Leads" value={loading ? '...' : summary?.wonLeads || 0} note="live closed" onClick={() => go('/employee/won')} />
        <KpiCard tone="orange" icon="clock" title="Overdue Leads" value={loading ? '...' : summary?.overdueLeads || 0} note="live overdue" onClick={() => go('/employee/tasks')} />
      </section>

      <section className="clean-two-col">
        <article className="clean-card clean-actions-card">
          <div className="clean-card-head"><h2><Icon name="lightning" /> Quick Actions</h2></div>
          <div className="clean-actions">
            <button className="qa orange" type="button" onClick={() => go('/employee/tasks')}><Icon name="calendar" /><span>Add Follow-up<small>Schedule a new follow-up</small></span></button>
            <button className="qa blue" type="button" onClick={() => go('/leads')}><Icon name="users" /><span>Open My Leads<small>View all assigned leads</small></span></button>
            <button className="qa red" type="button" onClick={() => go('/employee/tasks')}><Icon name="clock" /><span>View Overdue<small>Check overdue leads</small></span></button>
          </div>
        </article>

        <article className="clean-card clean-task-card">
          <div className="clean-card-head"><h2><Icon name="check" /> My Tasks</h2><button type="button" onClick={() => go('/employee/tasks')}>View All ›</button></div>
          {visibleTasks.length ? visibleTasks.map((task) => <label className="clean-task-row" key={task.id}><input type="checkbox" checked={task.status === 'Completed'} onChange={() => completeTask(task)} /><div><strong>{task.title}</strong><small>{task.lead?.name || task.note || 'General'}</small></div><em>{task.type || 'Task'}</em><time>{formatTime(task.due_at)}</time></label>) : <p className="clean-empty">No tasks assigned.</p>}
        </article>
      </section>

      <article className="clean-card clean-recent">
        <div className="clean-card-head"><h2>Recent Leads</h2><button type="button" onClick={() => go('/leads')}>View All ›</button></div>
        <div className="clean-table-wrap"><table><thead><tr><th>Name</th><th>Source</th><th>Status</th><th>Follow-up Date</th><th>Owner</th></tr></thead><tbody>{visibleLeads.length ? visibleLeads.map((lead) => <tr key={lead.id} onClick={() => go(`/leads/${lead.id}`)}><td>{lead.name}</td><td>{lead.source}</td><td><span className="clean-status">• {lead.status}</span></td><td>{formatDate(lead.next_follow_up)}</td><td><b className="clean-face">{initials(lead.owner?.full_name || displayName)}</b>{lead.owner?.full_name || displayName}</td></tr>) : <tr><td colSpan="5">No assigned leads found.</td></tr>}</tbody></table></div>
        <footer><span>Showing {visibleLeads.length} assigned leads</span><button type="button" onClick={() => go('/leads')}>View All Leads →</button></footer>
      </article>
    </main>
  </div>;
}
