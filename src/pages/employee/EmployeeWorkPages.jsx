import { useEffect, useMemo, useState } from 'react';
import DashboardSidebar from '../../components/dashboard/DashboardSidebar.jsx';
import { leads } from '../leads/leadsData.js';
import { createTask, getCurrentProfile, isBackendConfigured, listTasks, updateTask } from '../../services/crmApi.js';
import './EmployeePages.css';
import './EmployeePagesLayoutFix.css';
import './EmployeeReportsPremiumFix.css';

const seedTasks = [
  { id: 'seed-1', title: 'Call with Rohan Sharma', lead: 'Rohan Sharma', time: '10:00 AM', date: '20 May 2025', status: 'Today', type: 'Call' },
  { id: 'seed-2', title: 'Follow-up: Neha Patel', lead: 'Neha Patel', time: '11:30 AM', date: '20 May 2025', status: 'Today', type: 'Follow-up' },
  { id: 'seed-3', title: 'Demo Presentation', lead: 'Amit Kumar', time: '02:00 PM', date: '20 May 2025', status: 'Today', type: 'Demo' },
  { id: 'seed-4', title: 'Internal Team Sync', lead: 'Team', time: '04:00 PM', date: '20 May 2025', status: 'Today', type: 'Meeting' },
  { id: 'seed-5', title: 'Proposal reminder', lead: 'Amit Verma', time: '10:00 AM', date: '19 May 2025', status: 'Overdue', type: 'Task' },
  { id: 'seed-6', title: 'Payment follow-up', lead: 'Neha Singh', time: '03:00 PM', date: '18 May 2025', status: 'Overdue', type: 'Follow-up' },
];

const activities = [
  { stage: 'Lead Created', text: 'Rohan Mehta captured from website form.', time: '20 May 2025, 10:30 AM', tone: 'blue' },
  { stage: 'Contacted', text: 'Call completed with Priya Sharma.', time: '19 May 2025, 03:15 PM', tone: 'green' },
  { stage: 'Proposal', text: 'Proposal sent to Amit Verma.', time: '18 May 2025, 11:45 AM', tone: 'purple' },
  { stage: 'Negotiation', text: 'Budget discussion with Neha Singh.', time: '17 May 2025, 04:20 PM', tone: 'orange' },
  { stage: 'Won', text: 'Deepak Kumar converted successfully.', time: '16 May 2025, 12:10 PM', tone: 'green' },
];

function Shell({ title, subtitle, children, actions }) {
  const pageClass = title === 'Won Leads' ? ' won-page' : '';
  return (
    <div className={`emp-page${pageClass}`}>
      <DashboardSidebar role="employee" />
      <main className="emp-main">
        <div className="emp-container">
          <header className="emp-head">
            <div>
              <span className="emp-kicker">Employee Workspace</span>
              <h1>{title}</h1>
              <p>{subtitle}</p>
            </div>
            <div className="emp-actions">{actions}</div>
          </header>
          {children}
        </div>
      </main>
    </div>
  );
}

function PremiumIcon({ type }) {
  const common = { fill: 'none', stroke: 'currentColor', strokeWidth: 2.15, strokeLinecap: 'round', strokeLinejoin: 'round' };
  if (type === 'badge-check') return <svg viewBox="0 0 24 24" aria-hidden="true" {...common}><circle cx="12" cy="12" r="8.5" /><path d="m8.4 12.2 2.3 2.2 5-5.1" /></svg>;
  if (type === 'rupee') return <svg viewBox="0 0 24 24" aria-hidden="true" {...common}><path d="M7 5h10" /><path d="M7 9h10" /><path d="M8 5c6 0 6 8 0 8H7l7.2 6" /></svg>;
  if (type === 'trending-up') return <svg viewBox="0 0 24 24" aria-hidden="true" {...common}><path d="M4 17 10 11l4 4 6-8" /><path d="M15 7h5v5" /></svg>;
  if (type === 'mail') return <svg viewBox="0 0 24 24" aria-hidden="true" {...common}><rect x="3.5" y="5.5" width="17" height="13" rx="2.2" /><path d="m4.5 7 7.5 6 7.5-6" /></svg>;
  if (type === 'circle-check') return <svg viewBox="0 0 24 24" aria-hidden="true" {...common}><circle cx="12" cy="12" r="8.5" /><path d="m8.4 12.2 2.3 2.2 5-5.1" /></svg>;
  if (type === 'arrow-up-right') return <svg viewBox="0 0 24 24" aria-hidden="true" {...common}><path d="M7 17 17 7" /><path d="M9 7h8v8" /></svg>;
  if (type === 'sparkles') return <svg viewBox="0 0 24 24" aria-hidden="true" {...common}><path d="M12 3l1.8 5 5.2 1.8-5.2 1.8L12 17l-1.8-5.4L5 9.8 10.2 8 12 3Z" /><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15Z" /></svg>;
  if (type === 'alert') return <svg viewBox="0 0 24 24" aria-hidden="true" {...common}><path d="M12 8v5" /><path d="M12 17h.01" /><path d="M10.3 3.9 2.5 17.5A2 2 0 0 0 4.2 20h15.6a2 2 0 0 0 1.7-2.5L13.7 3.9a2 2 0 0 0-3.4 0Z" /></svg>;
  if (type === 'phone') return <svg viewBox="0 0 24 24" aria-hidden="true" {...common}><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.4 19.4 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.7 2Z" /></svg>;
  return <svg viewBox="0 0 24 24" aria-hidden="true" {...common}><path d="M12 2l2.7 6.3L21 11l-6.3 2.7L12 20l-2.7-6.3L3 11l6.3-2.7L12 2Z" /></svg>;
}

function getIconType(label, explicitIcon) {
  if (explicitIcon) return explicitIcon;
  const key = String(label || '').toLowerCase();
  if (key.includes('won') || key.includes('task') || key.includes('completed')) return 'badge-check';
  if (key.includes('value') || key.includes('revenue')) return 'rupee';
  if (key.includes('conversion')) return 'trending-up';
  if (key.includes('best') || key.includes('source')) return 'mail';
  if (key.includes('overdue')) return 'alert';
  if (key.includes('call')) return 'phone';
  return 'sparkles';
}

function Stats({ items }) {
  return <section className="emp-grid cards">{items.map((item) => <article className="emp-card emp-stat" key={item.label}><span className={`emp-icon ${item.tone || ''}`}><PremiumIcon type={getIconType(item.label, item.icon)} /></span><div><p>{item.label}</p><h2>{item.value}</h2></div></article>)}</section>;
}

function Modal({ title, subtitle, children, onClose }) {
  return <div className="emp-modal-backdrop" onClick={onClose}><div className="emp-modal" onClick={(event) => event.stopPropagation()}><div className="emp-modal-head"><div><h3>{title}</h3><p>{subtitle}</p></div><button type="button" onClick={onClose}>×</button></div>{children}</div></div>;
}

function exportWonCsv(rows) {
  const header = ['Lead', 'Company', 'Source', 'Status', 'Owner', 'Closed'];
  const body = rows.map((lead) => [lead.name, lead.company, lead.source, 'Won', lead.owner, lead.lastActivity]);
  const csv = [header, ...body].map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(',')).join('\n');
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'won-leads.csv';
  anchor.click();
  URL.revokeObjectURL(url);
}

function toDateInput(date = new Date()) {
  return date.toISOString().slice(0, 10);
}
function toTimeInput(date = new Date()) {
  return date.toTimeString().slice(0, 5);
}
function parseTaskDateTime(date, time) {
  const safeDate = date || toDateInput(new Date());
  const safeTime = time || '17:00';
  return new Date(`${safeDate}T${safeTime}`).toISOString();
}
function formatTaskDate(iso) {
  const date = iso ? new Date(iso) : new Date();
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}
function formatTaskTime(iso) {
  const date = iso ? new Date(iso) : new Date();
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
}
function isSameDay(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}
function normalizeTask(record) {
  const due = record.due_at || record.dueAt || null;
  const dueDate = due ? new Date(due) : null;
  const now = new Date();
  const completed = record.status === 'Completed' || Boolean(record.completed_at);
  const overdue = !completed && dueDate && dueDate.getTime() < now.getTime() && !isSameDay(dueDate, now);
  const today = !completed && dueDate && isSameDay(dueDate, now);
  const status = completed ? 'Completed' : overdue ? 'Overdue' : today ? 'Today' : (record.status || 'Pending');
  return {
    id: record.id || `task-${Date.now()}-${Math.random()}`,
    title: record.title || 'Untitled Task',
    lead: record.lead?.name || record.lead || 'General',
    time: due ? formatTaskTime(due) : (record.time || '-'),
    date: due ? formatTaskDate(due) : (record.date || '-'),
    status,
    type: record.type || record.task_type || 'Call',
    due_at: due,
    note: record.note || record.description || '',
    isReal: Boolean(record.id && record.company_id),
  };
}
function useRealTasks() {
  const [items, setItems] = useState(seedTasks.map(normalizeTask));
  const [isLive, setIsLive] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(Boolean(isBackendConfigured));

  useEffect(() => {
    let alive = true;
    async function load() {
      if (!isBackendConfigured) {
        setLoading(false);
        setMessage('Demo mode: Supabase env missing. Showing sample tasks.');
        return;
      }
      try {
        setLoading(true);
        const rows = await listTasks({ limit: 300 });
        if (!alive) return;
        setItems(rows.length ? rows.map(normalizeTask) : []);
        setIsLive(true);
        setMessage(rows.length ? 'Live Supabase tasks connected.' : 'Live Supabase connected. No tasks found yet.');
      } catch (error) {
        if (!alive) return;
        setIsLive(false);
        setMessage(`Demo mode: ${error.message}. Showing sample tasks.`);
      } finally {
        if (alive) setLoading(false);
      }
    }
    load();
    return () => { alive = false; };
  }, []);

  return { items, setItems, isLive, message, loading };
}

export function WonPage() {
  const wonLeads = leads.filter((lead) => lead.status === 'Converted' || lead.status === 'Won');
  const value = wonLeads.length * 245000;
  const rowsPerPage = 5;
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(wonLeads.length / rowsPerPage));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedWonLeads = wonLeads.slice(startIndex, startIndex + rowsPerPage);
  const showingStart = wonLeads.length ? startIndex + 1 : 0;
  const showingEnd = Math.min(startIndex + rowsPerPage, wonLeads.length);
  useEffect(() => { if (page > totalPages) setPage(totalPages); }, [page, totalPages]);
  return <Shell title="Won Leads" subtitle="Converted leads, total value aur closing details ek jagah." actions={<button className="emp-btn primary" onClick={() => exportWonCsv(wonLeads)}>Export Won</button>}><Stats items={[{ icon: 'badge-check', label: 'Won Leads', value: wonLeads.length, tone: 'green' }, { icon: 'rupee', label: 'Won Value', value: `₹${value.toLocaleString('en-IN')}`, tone: 'blue' }, { icon: 'trending-up', label: 'Conversion', value: '16.4%', tone: 'purple' }, { icon: 'mail', label: 'Best Source', value: 'Email', tone: 'orange' }]} /><section className="emp-card emp-section"><div className="emp-section-head"><h2>Won Lead List</h2><span className="emp-pill green">Converted Status</span></div><div className="emp-table-wrap"><table className="emp-table"><thead><tr><th>Lead</th><th>Company</th><th>Source</th><th>Status</th><th>Owner</th><th>Closed</th></tr></thead><tbody>{paginatedWonLeads.map((lead) => <tr key={lead.id}><td><div className="emp-person"><span className="emp-avatar">{lead.initials}</span><div><strong>{lead.name}</strong><small>{lead.phone}</small></div></div></td><td>{lead.company}</td><td>{lead.source}</td><td><span className="emp-pill green">Won</span></td><td>{lead.owner}</td><td>{lead.lastActivity}</td></tr>)}</tbody></table></div><div className="won-pagination"><span>Showing {showingStart}-{showingEnd} of {wonLeads.length}</span><div><button type="button" disabled={currentPage === 1} onClick={() => setPage((value) => Math.max(1, value - 1))}>Previous</button><strong>Page {currentPage} of {totalPages}</strong><button type="button" disabled={currentPage === totalPages} onClick={() => setPage((value) => Math.min(totalPages, value + 1))}>Next</button></div></div></section><section className="won-premium-grid"><article className="won-insight-card"><span className="won-insight-icon success"><PremiumIcon type="circle-check" /></span><div><p>Revenue secured</p><strong>₹{value.toLocaleString('en-IN')}</strong><small>Closed from {wonLeads.length} verified deal</small></div></article><article className="won-insight-card"><span className="won-insight-icon blue"><PremiumIcon type="arrow-up-right" /></span><div><p>Next best action</p><strong>Ask for referral</strong><small>Follow up within 2 days after closure</small></div></article><article className="won-insight-card dark"><span className="won-insight-icon dark-icon"><PremiumIcon type="sparkles" /></span><div><p>Premium summary</p><strong>Sales quality is improving</strong><small>Email campaign is your strongest channel right now.</small></div></article></section></Shell>;
}

export function TasksPage() {
  const { items, setItems, isLive, message, loading } = useRealTasks();
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ title: '', lead: '', type: 'Call', date: toDateInput(new Date()), time: '17:00', status: 'Today' });
  const today = items.filter((task) => task.status === 'Today');
  const overdue = items.filter((task) => task.status === 'Overdue');
  const pending = items.filter((task) => !['Today', 'Overdue', 'Completed'].includes(task.status));
  const saveTask = async (event) => {
    event.preventDefault();
    if (!form.title.trim() || saving) return;
    setSaving(true);
    try {
      const dueAt = parseTaskDateTime(form.date, form.time);
      if (isLive) {
        const saved = await createTask({ title: form.title.trim(), note: form.lead.trim() ? `Lead: ${form.lead.trim()}` : '', type: form.type, status: form.status === 'Overdue' ? 'Overdue' : 'Pending', due_at: dueAt });
        setItems((rows) => [normalizeTask(saved), ...rows]);
      } else {
        setItems((rows) => [normalizeTask({ id: `demo-${Date.now()}`, title: form.title.trim(), lead: form.lead.trim() || 'New Lead', type: form.type, status: form.status, dueAt }), ...rows]);
      }
      setShowModal(false);
      setForm({ title: '', lead: '', type: 'Call', date: toDateInput(new Date()), time: '17:00', status: 'Today' });
    } finally {
      setSaving(false);
    }
  };
  const completeTask = async (task) => {
    try {
      if (isLive && task.isReal) await updateTask(task.id, { status: 'Completed' });
      setItems((rows) => rows.map((item) => item.id === task.id ? { ...item, status: 'Completed' } : item));
    } catch {}
  };
  const renderTask = (task, danger = false) => <div className="task-row" key={task.id}><span className={`task-check ${danger ? 'danger' : ''}`} /><div><strong>{task.title}</strong><small>{task.lead} • {task.type} • {task.date}</small></div><span className={`task-time ${danger ? 'red' : ''}`}>{task.time}</span><button type="button" className="task-complete-mini" onClick={() => completeTask(task)}>{task.status === 'Completed' ? 'Done' : 'Done'}</button></div>;
  return <Shell title="Tasks" subtitle="Aaj ke tasks aur overdue follow-ups yahan dikhenge." actions={<button className="emp-btn primary" onClick={() => setShowModal(true)}>+ Add Task</button>}><Stats items={[{ icon: 'badge-check', label: 'Today Tasks', value: loading ? '...' : today.length, tone: 'green' }, { icon: 'alert', label: 'Overdue', value: loading ? '...' : overdue.length, tone: 'red' }, { icon: 'phone', label: 'Calls', value: loading ? '...' : items.filter((task) => task.type === 'Call').length }, { icon: 'sparkles', label: 'Pending', value: loading ? '...' : pending.length, tone: 'purple' }]} />{message ? <div className={`emp-data-banner ${isLive ? 'live' : 'demo'}`}>{message}</div> : null}<section className="emp-two"><article className="emp-card emp-section"><div className="emp-section-head"><h2>Today</h2><span className="emp-pill green">{today.length} Tasks</span></div>{today.length ? today.map((task) => renderTask(task)) : <p className="emp-empty-note">No tasks for today.</p>}</article><article className="emp-card emp-section"><div className="emp-section-head"><h2>Overdue</h2><span className="emp-pill red">{overdue.length} Late</span></div>{overdue.length ? overdue.map((task) => renderTask(task, true)) : <p className="emp-empty-note">No overdue tasks.</p>}</article></section>{showModal && <Modal title="Add Task" subtitle="Call, demo ya follow-up task add karo." onClose={() => setShowModal(false)}><form onSubmit={saveTask} className="emp-form"><label>Task Title<input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Call with client" /></label><label>Lead Name<input value={form.lead} onChange={(e) => setForm({ ...form, lead: e.target.value })} placeholder="Rohan Mehta" /></label><label>Type<select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}><option>Call</option><option>Follow-up</option><option>Demo</option><option>Meeting</option></select></label><label>Date<input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></label><label>Time<input type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} /></label><label>Status<select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}><option>Today</option><option>Overdue</option><option>Pending</option></select></label><div className="emp-modal-actions"><button type="button" className="emp-btn" onClick={() => setShowModal(false)}>Cancel</button><button className="emp-btn primary" disabled={saving}>{saving ? 'Saving...' : 'Save Task'}</button></div></form></Modal>}</Shell>;
}

export function CalendarPage() {
  const { items, isLive, message } = useRealTasks();
  const days = Array.from({ length: 31 }, (_, index) => index + 1);
  const currentMonth = new Date().toLocaleString('en-IN', { month: 'long', year: 'numeric' });
  const eventMap = useMemo(() => {
    const map = {};
    items.forEach((task) => {
      const due = task.due_at ? new Date(task.due_at) : null;
      if (!due || Number.isNaN(due.getTime())) return;
      const day = due.getDate();
      map[day] = map[day] || [];
      map[day].push({ title: task.title, tone: task.status === 'Overdue' ? 'orange' : task.status === 'Completed' ? 'green' : '' });
    });
    if (!Object.keys(map).length) {
      seedTasks.forEach((task) => {
        const day = Number(String(task.date).match(/^\d+/)?.[0]);
        if (!day) return;
        map[day] = map[day] || [];
        map[day].push({ title: task.title, tone: task.status === 'Overdue' ? 'orange' : 'green' });
      });
    }
    return map;
  }, [items]);
  const upcoming = items.filter((task) => task.status !== 'Completed').slice(0, 8);
  return <Shell title="Calendar" subtitle="Jis date ko demo, follow-up ya task hai us date ke aage naam dikhega." actions={<button className="emp-btn primary" onClick={() => { window.history.pushState({}, '', '/employee/tasks'); window.dispatchEvent(new Event('salesflow:navigate')); }}>+ Schedule</button>}><section className="calendar-wrap"><article className="emp-card emp-section"><div className="emp-section-head"><h2>{currentMonth}</h2><span className="emp-pill blue">{isLive ? 'Live Schedule' : 'Demo Schedule'}</span></div>{message ? <div className={`emp-data-banner ${isLive ? 'live' : 'demo'}`}>{message}</div> : null}<div className="calendar-grid">{days.map((day) => <div className={`cal-day ${day === new Date().getDate() ? 'today' : ''}`} key={day}><b>{day}</b>{(eventMap[day] || []).slice(0, 2).map((event) => <span className={`cal-event ${event.tone}`} key={`${day}-${event.title}`}>{event.title}</span>)}</div>)}</div></article><article className="emp-card emp-section"><div className="emp-section-head"><h2>Upcoming</h2></div>{upcoming.length ? upcoming.map((task) => <div className="task-row" key={task.id}><span className="task-check" /><div><strong>{task.title}</strong><small>{task.date} • {task.lead}</small></div><span className="task-time">{task.time}</span></div>) : <p className="emp-empty-note">No upcoming tasks.</p>}</article></section></Shell>;
}

export function ActivitiesPage() {
  const [filter, setFilter] = useState('All');
  const list = filter === 'All' ? activities : activities.filter((item) => item.stage === filter);
  return <Shell title="Activities" subtitle="Pipeline wise recent activity timeline." actions={<select className="emp-select" value={filter} onChange={(e) => setFilter(e.target.value)}><option>All</option><option>Lead Created</option><option>Contacted</option><option>Proposal</option><option>Negotiation</option><option>Won</option></select>}><Stats items={[{ icon: 'sparkles', label: 'New', value: '18' }, { icon: 'phone', label: 'Contacted', value: '12', tone: 'green' }, { icon: 'mail', label: 'Proposal', value: '7', tone: 'purple' }, { icon: 'badge-check', label: 'Won', value: '3', tone: 'green' }]} /><section className="emp-card emp-section"><div className="emp-section-head"><h2>Pipeline Activity</h2><span className="emp-pill blue">Latest</span></div><div className="pipeline">{list.map((item, index) => <div className="pipe-row" key={item.stage}><span className={`pipe-dot ${item.tone}`}>{index + 1}</span><div><strong>{item.stage}</strong><p>{item.text}</p></div><span className="pipe-meta">{item.time}</span></div>)}</div></section></Shell>;
}

export function ReportsPage() {
  return <Shell title="Reports" subtitle="Sales performance, lead source aur conversion reports." actions={<button className="emp-btn primary">Download</button>}><section className="reports-grid"><article className="emp-card report-kpi"><h3>Revenue Won</h3><strong>₹12.4L</strong><div className="bar"><b style={{ width: '72%' }} /></div></article><article className="emp-card report-kpi"><h3>Lead Conversion</h3><strong>16.4%</strong><div className="bar"><b style={{ width: '48%' }} /></div></article><article className="emp-card report-kpi"><h3>Tasks Completed</h3><strong>84%</strong><div className="bar"><b style={{ width: '84%' }} /></div></article></section></Shell>;
}

export function ProfilePage() {
  const [profile, setProfile] = useState({ name: 'Loading...', role: 'Employee', email: 'Loading...', phone: 'Loading...', team: 'Sales', location: 'India' });
  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    let alive = true;
    async function loadProfile() {
      if (!isBackendConfigured) {
        if (alive) setProfile({ name: 'Employee User', role: 'Employee', email: 'Profile env missing', phone: '-', team: 'Sales', location: 'India' });
        return;
      }
      try {
        const data = await getCurrentProfile();
        if (!alive) return;
        if (!data) {
          setProfile({ name: 'Employee User', role: 'Employee', email: 'No profile found', phone: '-', team: 'Sales', location: 'India' });
          return;
        }
        setProfile({ name: data.full_name || 'Employee User', role: data.role === 'employee' ? 'Sales Executive' : data.role || 'Employee', email: data.email || '-', phone: data.phone || '-', team: 'Sales', location: 'India' });
      } catch {
        if (alive) setProfile({ name: 'Employee User', role: 'Employee', email: 'Profile load failed', phone: '-', team: 'Sales', location: 'India' });
      }
    }
    loadProfile();
    return () => { alive = false; };
  }, []);
  const save = (event) => { event.preventDefault(); setShowModal(false); };
  return <Shell title="Profile" subtitle="Apna employee profile aur account details manage karo." actions={<button className="emp-btn primary" onClick={() => setShowModal(true)}>Edit Profile</button>}><section className="emp-card emp-section profile-box"><div className="profile-photo">{profile.name?.[0] || 'E'}</div><div className="profile-info"><h2>{profile.name}</h2><p>{profile.role}</p><div className="profile-details"><div><span>Email</span><strong>{profile.email}</strong></div><div><span>Phone</span><strong>{profile.phone}</strong></div><div><span>Team</span><strong>{profile.team}</strong></div><div><span>Location</span><strong>{profile.location}</strong></div></div></div></section>{showModal && <Modal title="Edit Profile" subtitle="Profile details update karo." onClose={() => setShowModal(false)}><form className="emp-form" onSubmit={save}><label>Full Name<input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} /></label><label>Phone<input value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} /></label><label>Team<input value={profile.team} onChange={(e) => setProfile({ ...profile, team: e.target.value })} /></label><label>Location<input value={profile.location} onChange={(e) => setProfile({ ...profile, location: e.target.value })} /></label><div className="emp-modal-actions"><button type="button" className="emp-btn" onClick={() => setShowModal(false)}>Cancel</button><button className="emp-btn primary">Save Profile</button></div></form></Modal>}</Shell>;
}
