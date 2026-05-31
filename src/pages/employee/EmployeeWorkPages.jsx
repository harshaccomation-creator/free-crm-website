import { useEffect, useMemo, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import DashboardSidebar from '../../components/dashboard/DashboardSidebar.jsx';
import { leads } from '../leads/leadsData.js';
import './EmployeePages.css';
import './EmployeePagesLayoutFix.css';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

const seedTasks = [
  { title: 'Call with Rohan Sharma', lead: 'Rohan Sharma', time: '10:00 AM', date: '20 May 2025', status: 'Today', type: 'Call' },
  { title: 'Follow-up: Neha Patel', lead: 'Neha Patel', time: '11:30 AM', date: '20 May 2025', status: 'Today', type: 'Follow-up' },
  { title: 'Demo Presentation', lead: 'Amit Kumar', time: '02:00 PM', date: '20 May 2025', status: 'Today', type: 'Demo' },
  { title: 'Internal Team Sync', lead: 'Team', time: '04:00 PM', date: '20 May 2025', status: 'Today', type: 'Meeting' },
  { title: 'Proposal reminder', lead: 'Amit Verma', time: '10:00 AM', date: '19 May 2025', status: 'Overdue', type: 'Task' },
  { title: 'Payment follow-up', lead: 'Neha Singh', time: '03:00 PM', date: '18 May 2025', status: 'Overdue', type: 'Follow-up' },
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
  return <div className={`emp-page${pageClass}`}><DashboardSidebar role="employee" /><main className="emp-main"><div className="emp-container"><header className="emp-head"><div><span className="emp-kicker">Employee Workspace</span><h1>{title}</h1><p>{subtitle}</p></div><div className="emp-actions">{actions}</div></header>{children}</div></main></div>;
}

function Stats({ items }) {
  return <section className="emp-grid cards">{items.map((item) => <article className="emp-card emp-stat" key={item.label}><span className={`emp-icon ${item.tone || ''}`}>{item.icon}</span><div><p>{item.label}</p><h2>{item.value}</h2></div></article>)}</section>;
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

export function WonPage() {
  const wonLeads = leads.filter((lead) => lead.status === 'Converted' || lead.status === 'Won');
  const value = wonLeads.length * 245000;
  return <Shell title="Won Leads" subtitle="Converted leads, total value aur closing details ek jagah." actions={<button className="emp-btn primary" onClick={() => exportWonCsv(wonLeads)}>Export Won</button>}><Stats items={[{ icon: '✓', label: 'Won Leads', value: wonLeads.length, tone: 'green' }, { icon: '₹', label: 'Won Value', value: `₹${value.toLocaleString('en-IN')}` }, { icon: '↗', label: 'Conversion', value: '16.4%', tone: 'purple' }, { icon: '🏆', label: 'Best Source', value: 'Email', tone: 'orange' }]} /><section className="emp-card emp-section"><div className="emp-section-head"><h2>Won Lead List</h2><span className="emp-pill green">Converted Status</span></div><div className="emp-table-wrap"><table className="emp-table"><thead><tr><th>Lead</th><th>Company</th><th>Source</th><th>Status</th><th>Owner</th><th>Closed</th></tr></thead><tbody>{wonLeads.map((lead) => <tr key={lead.id}><td><div className="emp-person"><span className="emp-avatar">{lead.initials}</span><div><strong>{lead.name}</strong><small>{lead.phone}</small></div></div></td><td>{lead.company}</td><td>{lead.source}</td><td><span className="emp-pill green">Won</span></td><td>{lead.owner}</td><td>{lead.lastActivity}</td></tr>)}</tbody></table></div></section></Shell>;
}

export function TasksPage() {
  const [items, setItems] = useState(seedTasks);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: '', lead: '', type: 'Call', date: '20 May 2025', time: '05:00 PM', status: 'Today' });
  const today = items.filter((task) => task.status === 'Today');
  const overdue = items.filter((task) => task.status === 'Overdue');
  const saveTask = (event) => { event.preventDefault(); if (!form.title.trim()) return; setItems([{ ...form, title: form.title.trim(), lead: form.lead.trim() || 'New Lead' }, ...items]); setShowModal(false); setForm({ title: '', lead: '', type: 'Call', date: '20 May 2025', time: '05:00 PM', status: 'Today' }); };
  return <Shell title="Tasks" subtitle="Aaj ke tasks aur overdue follow-ups yahan dikhenge." actions={<button className="emp-btn primary" onClick={() => setShowModal(true)}>+ Add Task</button>}><Stats items={[{ icon: '✓', label: 'Today Tasks', value: today.length, tone: 'green' }, { icon: '!', label: 'Overdue', value: overdue.length, tone: 'red' }, { icon: '☎', label: 'Calls', value: items.filter((task) => task.type === 'Call').length }, { icon: '📌', label: 'Pending', value: items.length, tone: 'purple' }]} /><section className="emp-two"><article className="emp-card emp-section"><div className="emp-section-head"><h2>Today</h2><span className="emp-pill green">{today.length} Tasks</span></div>{today.map((task) => <div className="task-row" key={`${task.title}-${task.time}`}><span className="task-check" /><div><strong>{task.title}</strong><small>{task.lead} • {task.type}</small></div><span className="task-time">{task.time}</span></div>)}</article><article className="emp-card emp-section"><div className="emp-section-head"><h2>Overdue</h2><span className="emp-pill red">{overdue.length} Late</span></div>{overdue.map((task) => <div className="task-row" key={`${task.title}-${task.date}`}><span className="task-check danger" /><div><strong>{task.title}</strong><small>{task.lead} • {task.date}</small></div><span className="task-time red">{task.time}</span></div>)}</article></section>{showModal && <Modal title="Add Task" subtitle="Call, demo ya follow-up task add karo." onClose={() => setShowModal(false)}><form onSubmit={saveTask} className="emp-form"><label>Task Title<input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Call with client" /></label><label>Lead Name<input value={form.lead} onChange={(e) => setForm({ ...form, lead: e.target.value })} placeholder="Rohan Mehta" /></label><label>Type<select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}><option>Call</option><option>Follow-up</option><option>Demo</option><option>Meeting</option></select></label><label>Time<input value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} /></label><label>Status<select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}><option>Today</option><option>Overdue</option></select></label><div className="emp-modal-actions"><button type="button" className="emp-btn" onClick={() => setShowModal(false)}>Cancel</button><button className="emp-btn primary">Save Task</button></div></form></Modal>}</Shell>;
}

export function CalendarPage() {
  const days = Array.from({ length: 31 }, (_, index) => index + 1);
  const eventMap = { 18: [{ title: 'Payment follow-up', tone: 'orange' }], 19: [{ title: 'Proposal reminder', tone: 'orange' }], 20: [{ title: 'Demo Presentation', tone: 'green' }, { title: 'Follow-up Neha', tone: '' }], 22: [{ title: 'Rohan follow-up', tone: '' }], 24: [{ title: 'Next follow-up', tone: 'green' }] };
  return <Shell title="Calendar" subtitle="Jis date ko demo, follow-up ya task hai us date ke aage naam dikhega." actions={<button className="emp-btn primary">+ Schedule</button>}><section className="calendar-wrap"><article className="emp-card emp-section"><div className="emp-section-head"><h2>May 2025</h2><span className="emp-pill blue">Scheduled Pipeline</span></div><div className="calendar-grid">{days.map((day) => <div className={`cal-day ${day === 20 ? 'today' : ''}`} key={day}><b>{day}</b>{(eventMap[day] || []).map((event) => <span className={`cal-event ${event.tone}`} key={event.title}>{event.title}</span>)}</div>)}</div></article><article className="emp-card emp-section"><div className="emp-section-head"><h2>Upcoming</h2></div>{seedTasks.map((task) => <div className="task-row" key={`${task.title}-${task.date}`}><span className="task-check" /><div><strong>{task.title}</strong><small>{task.date} • {task.lead}</small></div><span className="task-time">{task.time}</span></div>)}</article></section></Shell>;
}

export function ActivitiesPage() {
  const [filter, setFilter] = useState('All');
  const list = filter === 'All' ? activities : activities.filter((item) => item.stage === filter);
  return <Shell title="Activities" subtitle="Pipeline wise recent activity timeline." actions={<select className="emp-select" value={filter} onChange={(e) => setFilter(e.target.value)}><option>All</option><option>Lead Created</option><option>Contacted</option><option>Proposal</option><option>Negotiation</option><option>Won</option></select>}><Stats items={[{ icon: '◎', label: 'New', value: '18' }, { icon: '☎', label: 'Contacted', value: '12', tone: 'green' }, { icon: '▣', label: 'Proposal', value: '7', tone: 'purple' }, { icon: '✓', label: 'Won', value: '3', tone: 'green' }]} /><section className="emp-card emp-section"><div className="emp-section-head"><h2>Pipeline Activity</h2><span className="emp-pill blue">Latest</span></div><div className="pipeline">{list.map((item, index) => <div className="pipe-row" key={item.stage}><span className={`pipe-dot ${item.tone}`}>{index + 1}</span><div><strong>{item.stage}</strong><p>{item.text}</p></div><span className="pipe-meta">{item.time}</span></div>)}</div></section></Shell>;
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
      if (!supabase) {
        if (alive) setProfile({ name: 'Employee User', role: 'Employee', email: 'Profile env missing', phone: '-', team: 'Sales', location: 'India' });
        return;
      }
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name,email,phone,role,created_at')
        .eq('role', 'employee')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!alive) return;
      if (error || !data) {
        setProfile({ name: 'Employee User', role: 'Employee', email: 'No profile found', phone: '-', team: 'Sales', location: 'India' });
        return;
      }

      setProfile({
        name: data.full_name || 'Employee User',
        role: data.role === 'employee' ? 'Sales Executive' : data.role || 'Employee',
        email: data.email || '-',
        phone: data.phone || '-',
        team: 'Sales',
        location: 'India',
      });
    }
    loadProfile();
    return () => { alive = false; };
  }, []);

  const save = (event) => { event.preventDefault(); setShowModal(false); };
  return <Shell title="Profile" subtitle="Apna employee profile aur account details manage karo." actions={<button className="emp-btn primary" onClick={() => setShowModal(true)}>Edit Profile</button>}><section className="emp-card emp-section profile-box"><div className="profile-photo">{profile.name?.[0] || 'E'}</div><div className="profile-info"><h2>{profile.name}</h2><p>{profile.role}</p><div className="profile-details"><div><span>Email</span><strong>{profile.email}</strong></div><div><span>Phone</span><strong>{profile.phone}</strong></div><div><span>Team</span><strong>{profile.team}</strong></div><div><span>Location</span><strong>{profile.location}</strong></div></div></div></section>{showModal && <Modal title="Edit Profile" subtitle="Profile details update karo." onClose={() => setShowModal(false)}><form className="emp-form" onSubmit={save}><label>Full Name<input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} /></label><label>Phone<input value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} /></label><label>Team<input value={profile.team} onChange={(e) => setProfile({ ...profile, team: e.target.value })} /></label><label>Location<input value={profile.location} onChange={(e) => setProfile({ ...profile, location: e.target.value })} /></label><div className="emp-modal-actions"><button type="button" className="emp-btn" onClick={() => setShowModal(false)}>Cancel</button><button className="emp-btn primary">Save Profile</button></div></form></Modal>}</Shell>;
}
