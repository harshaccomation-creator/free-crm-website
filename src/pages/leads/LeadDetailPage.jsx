import { useMemo, useState } from 'react';
import DashboardSidebar from '../../components/dashboard/DashboardSidebar.jsx';
import { getLead } from './leadsData.js';
import './LeadDetailStable.css';
import './LeadDetailProfessionalFix.css';
import '../../styles/leadDetailFinalLock.css';
import '../../styles/leadDetailTabContent.css';

function getCurrentRole() {
  const saved = window.localStorage.getItem('salesflowRole');
  return saved === 'admin' || saved === 'superAdmin' || saved === 'employee' ? saved : 'employee';
}

const tabs = [
  ['overview', '▦', 'Overview'],
  ['activity', '⌁', 'Activity'],
  ['tasks', '☷', 'Tasks'],
  ['notes', '□', 'Notes'],
  ['documents', '▱', 'Documents'],
  ['email', '✉', 'Email History'],
  ['whatsapp', '◌', 'WhatsApp History'],
];

const activityTypes = {
  call: { label: 'Call', icon: '☎', tone: 'green', title: 'Call Completed' },
  demo_done: { label: 'Demo Done', icon: '◈', tone: 'blue', title: 'Demo Completed' },
  lost: { label: 'Lost', icon: '✕', tone: 'red', title: 'Lead Marked as Lost' },
  demo_scheduled: { label: 'Demo Scheduled', icon: '▣', tone: 'orange', title: 'Demo Scheduled' },
  follow_up: { label: 'Follow-up', icon: '↻', tone: 'orange', title: 'Follow-up Scheduled' },
  won: { label: 'Won', icon: '✓', tone: 'green', title: 'Lead Marked as Won' },
  website: { label: 'From Website', icon: '◎', tone: 'purple', title: 'Lead Captured from Website' },
};

const taskTypes = {
  call: { label: 'Call', icon: '☎', title: 'Call task' },
  demo_scheduled: { label: 'Demo Scheduled', icon: '▣', title: 'Demo scheduled task' },
  follow_up: { label: 'Follow-up', icon: '↻', title: 'Follow-up task' },
};

const baseActivities = [
  { icon: '☎', title: 'Called Rohan Mehta', text: 'Discussed requirements and solution overview.', time: 'Today, 10:30 AM', user: 'Amit Kumar', tone: 'green' },
  { icon: '✉', title: 'Sent Proposal', text: 'Proposal for CRM Software Implementation sent.', time: 'Yesterday, 04:15 PM', user: 'Amit Kumar', tone: 'blue' },
  { icon: '▣', title: 'Follow-up Scheduled', text: 'Next follow-up scheduled on 24 May 2025.', time: 'Yesterday, 04:10 PM', user: 'Amit Kumar', tone: 'orange' },
  { icon: '◎', title: 'Lead Captured from Website', text: 'Lead captured from website contact form.', time: '20 May 2025, 10:30 AM', user: 'System', tone: 'purple' },
];

const notes = [
  ['Requirement Note', 'Client is interested in CRM automation, lead assignment, follow-up reminders and reporting dashboard.', 'Today, 12:20 PM'],
  ['Budget Discussion', 'Budget available. Decision expected after product demo and final proposal review.', 'Yesterday, 04:50 PM'],
];
const docs = [['Proposal_Rohan_Mehta.pdf', 'PDF • 1.2 MB'], ['CRM_Demo_Requirements.docx', 'DOCX • 860 KB'], ['Quotation_v2.xlsx', 'XLSX • 420 KB']];
const emails = [['CRM Software Implementation Proposal', 'rohan.mehta@technova.com • Yesterday, 04:15 PM', 'Sent'], ['Demo Confirmation', 'rohan.mehta@technova.com • 20 May 2025, 02:10 PM', 'Opened']];
const chats = [['Shared demo meeting link on WhatsApp.', 'Today, 09:15 AM', 'Delivered'], ['Client confirmed availability for follow-up call.', 'Yesterday, 06:35 PM', 'Read']];

function todayAt(hour, minute) {
  const date = new Date();
  date.setHours(hour, minute, 0, 0);
  return date.toISOString();
}
function dateTimeToIso(date, time) {
  return new Date(`${date}T${time}`).toISOString();
}
function formatDue(iso) {
  const date = new Date(iso);
  return date.toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
}
function formatActivityTime(date, time) {
  return formatDue(dateTimeToIso(date, time));
}
function getTaskStatus(task) {
  if (task.completed) return { label: 'Completed', tone: 'done' };
  if (new Date(task.dueAt).getTime() < Date.now()) return { label: 'Overdue', tone: 'danger' };
  return { label: 'Pending', tone: 'pending' };
}
function Icon({ children }) { return <span className="ld-text-icon">{children}</span>; }
function goToLeads() { window.history.pushState({}, '', '/leads'); window.dispatchEvent(new Event('salesflow:navigate')); }

function ActivityTimeline({ items, onAdd }) {
  return <article className="ld-card ld-activity-panel"><header className="ld-panel-header"><h2>Activity Timeline</h2><button type="button" className="ld-add-activity-btn" onClick={onAdd}>+ Add Activity</button></header><div className="ld-activity-list">{items.map((item) => <div className={`ld-activity-row ${item.tone}`} key={item.title + item.time}><span className="ld-activity-icon"><Icon>{item.icon}</Icon></span><div className="ld-activity-text"><strong>{item.title}</strong><p>{item.text}</p></div><div className="ld-activity-meta">{item.time}<small>{item.user}</small></div></div>)}</div></article>;
}

function ActivityModal({ form, onChange, onClose, onSave }) {
  return <div className="ld-modal-backdrop" onClick={onClose}><div className="ld-modal" onClick={(event) => event.stopPropagation()}><div className="ld-modal-top"><div><h3>Add Activity</h3><p>Activity type select karo aur note box me details likho.</p></div><button type="button" className="ld-modal-close" onClick={onClose}>×</button></div><form onSubmit={onSave}><div className="ld-form-grid"><label className="ld-field"><span>Activity Type</span><select value={form.type} onChange={(event) => onChange('type', event.target.value)}>{Object.entries(activityTypes).map(([key, value]) => <option key={key} value={key}>{value.label}</option>)}</select></label><label className="ld-field"><span>Title</span><input value={form.title} onChange={(event) => onChange('title', event.target.value)} placeholder="Activity title" /></label><label className="ld-field"><span>Date</span><input type="date" value={form.date} onChange={(event) => onChange('date', event.target.value)} /></label><label className="ld-field"><span>Time</span><input type="time" value={form.time} onChange={(event) => onChange('time', event.target.value)} /></label><label className="ld-field full"><span>Note</span><textarea value={form.note} onChange={(event) => onChange('note', event.target.value)} placeholder="Yaha activity ka note likho..." /></label></div><div className="ld-modal-actions"><button type="button" className="ghost" onClick={onClose}>Cancel</button><button type="submit" className="primary">Save Activity</button></div></form></div></div>;
}

function TaskModal({ form, onChange, onClose, onSave }) {
  return <div className="ld-modal-backdrop" onClick={onClose}><div className="ld-modal" onClick={(event) => event.stopPropagation()}><div className="ld-modal-top"><div><h3>Add Task</h3><p>From Website se task banao: Call, Demo Scheduled ya Follow-up.</p></div><button type="button" className="ld-modal-close" onClick={onClose}>×</button></div><form onSubmit={onSave}><div className="ld-form-grid"><label className="ld-field"><span>Task Source</span><select value={form.source} onChange={(event) => onChange('source', event.target.value)}><option value="From Website">From Website</option></select></label><label className="ld-field"><span>Task Type</span><select value={form.type} onChange={(event) => onChange('type', event.target.value)}>{Object.entries(taskTypes).map(([key, value]) => <option key={key} value={key}>{value.label}</option>)}</select></label><label className="ld-field"><span>Date</span><input type="date" value={form.date} onChange={(event) => onChange('date', event.target.value)} /></label><label className="ld-field"><span>Time</span><input type="time" value={form.time} onChange={(event) => onChange('time', event.target.value)} /></label><label className="ld-field full"><span>Task Title</span><input value={form.title} onChange={(event) => onChange('title', event.target.value)} placeholder="Task title optional" /></label><label className="ld-field full"><span>Note</span><textarea value={form.note} onChange={(event) => onChange('note', event.target.value)} placeholder="Task ka note likho..." /></label></div><div className="ld-modal-actions"><button type="button" className="ghost" onClick={onClose}>Cancel</button><button type="submit" className="primary">Save Task</button></div></form></div></div>;
}

function SideInfo() {
  return <aside className="ld-activity-side"><article className="ld-card ld-about-card"><h2>About Lead</h2>{[['Industry', 'IT Services'], ['Company Size', '51-200 Employees'], ['Annual Revenue', '₹ 10Cr - ₹ 50Cr'], ['Interested In', 'CRM Software']].map(([a, b]) => <div className="ld-about-row" key={a}><span>{a}</span><strong>{b}</strong></div>)}<button>View Full Details <span>›</span></button></article><article className="ld-card ld-files-card"><h2>Files & Documents</h2><div className="ld-file-row"><span>PDF</span><div><strong>Proposal_Rohan_Mehta.pdf</strong><small>PDF • 1.2 MB</small></div><button>↓</button></div><a className="ld-file-link">View All Files <span>›</span></a></article></aside>;
}

function TasksPanel({ tasks, onAdd, onComplete }) {
  const counts = tasks.reduce((acc, task) => { acc[getTaskStatus(task).tone] += 1; return acc; }, { danger: 0, pending: 0, done: 0 });
  return <section className="ld-card ld-tab-panel ld-tasks-panel"><header><div><h2>Tasks</h2><p>From Website se Call/Demo/Follow-up task banao. Time cross hone par Overdue ho jayega.</p></div><button type="button" onClick={onAdd}>+ Add Task</button></header><div className="ld-task-stats"><span><b>{tasks.length}</b>Total</span><span className="danger"><b>{counts.danger}</b>Overdue</span><span><b>{counts.pending}</b>Pending</span><span className="done"><b>{counts.done}</b>Done</span></div>{tasks.map((task) => { const status = getTaskStatus(task); return <div className={`ld-task-row ${status.tone}`} key={task.id}><span className="ld-task-icon">{task.icon}</span><div><strong>{task.title}</strong><p>{task.source} • Due {formatDue(task.dueAt)}{task.note ? ` • ${task.note}` : ''}</p></div><b>{status.label}</b><button type="button" onClick={() => onComplete(task.id)}>{task.completed ? 'Done' : 'Complete'}</button></div>; })}</section>;
}

function SimplePanel({ title, action, rows, icon = '☷' }) { return <section className="ld-card ld-tab-panel"><header><h2>{title}</h2><button>{action}</button></header>{rows.map((row) => <div className="ld-tab-row" key={row[0]}><span className="ld-tab-dot blue"><Icon>{icon}</Icon></span><div><strong>{row[0]}</strong><p>{row[1]}</p></div><b>{row[2]}</b></div>)}</section>; }
function NotesPanel() { return <section className="ld-card ld-tab-panel"><header><h2>Notes</h2><button>+ Add Note</button></header>{notes.map(([a, b, c]) => <div className="ld-tab-note" key={a}><strong>{a}</strong><p>{b}</p><small>{c}</small></div>)}</section>; }
function FilesPanel() { return <section className="ld-card ld-tab-panel"><header><h2>Documents</h2><button>Upload File</button></header>{docs.map(([name, meta]) => <div className="ld-file-row wide" key={name}><span>FILE</span><div><strong>{name}</strong><small>{meta}</small></div><button>↓</button></div>)}</section>; }
function TabContent({ activeTab, activities, onAddActivity, tasks, onAddTask, onCompleteTask }) {
  if (activeTab === 'overview') return <section className="ld-activity-layout"><ActivityTimeline items={activities} onAdd={onAddActivity} /><SideInfo /></section>;
  if (activeTab === 'activity') return <section className="ld-tab-single"><ActivityTimeline items={activities} onAdd={onAddActivity} /></section>;
  if (activeTab === 'tasks') return <TasksPanel tasks={tasks} onAdd={onAddTask} onComplete={onCompleteTask} />;
  if (activeTab === 'notes') return <NotesPanel />;
  if (activeTab === 'documents') return <FilesPanel />;
  if (activeTab === 'email') return <SimplePanel title="Email History" action="Send Email" rows={emails} icon="✉" />;
  return <SimplePanel title="WhatsApp History" action="Send Message" rows={chats} icon="◌" />;
}

export default function LeadDetailPage({ leadId }) {
  const role = getCurrentRole();
  const lead = getLead(leadId);
  const score = lead.score || 85;
  const today = new Date().toISOString().slice(0, 10);
  const autoTasks = useMemo(() => [
    { id: 'auto-followup', icon: '☎', title: `Follow-up call with ${lead.name}`, source: 'Auto from Next Follow-up', dueAt: todayAt(17, 0), completed: false },
    { id: 'auto-demo', icon: '▣', title: `Demo scheduled for ${lead.company}`, source: 'Auto from demo schedule', dueAt: todayAt(14, 0), completed: false },
    { id: 'auto-proposal', icon: '✉', title: 'Send revised proposal', source: 'Auto from proposal stage', dueAt: todayAt(11, 30), completed: false },
  ], [lead.name, lead.company]);
  const [activeTab, setActiveTab] = useState('overview');
  const [activities, setActivities] = useState(baseActivities);
  const [manualTasks, setManualTasks] = useState([]);
  const [completedIds, setCompletedIds] = useState([]);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [activityForm, setActivityForm] = useState({ type: 'call', title: '', note: '', date: today, time: '10:30' });
  const [taskForm, setTaskForm] = useState({ source: 'From Website', type: 'call', title: '', note: '', date: today, time: '18:00' });
  const tasks = [...manualTasks, ...autoTasks].map((task) => ({ ...task, completed: task.completed || completedIds.includes(task.id) }));
  const changeActivityForm = (key, value) => setActivityForm((current) => ({ ...current, [key]: value }));
  const changeTaskForm = (key, value) => setTaskForm((current) => ({ ...current, [key]: value }));
  const saveActivity = (event) => { event.preventDefault(); const meta = activityTypes[activityForm.type]; const title = activityForm.title.trim() || meta.title; const text = activityForm.note.trim() || `${meta.label} activity added for this lead.`; setActivities([{ icon: meta.icon, title, text, time: formatActivityTime(activityForm.date, activityForm.time), user: 'Amit Kumar', tone: meta.tone }, ...activities]); setShowActivityModal(false); setActivityForm({ type: 'call', title: '', note: '', date: today, time: '10:30' }); };
  const saveTask = (event) => { event.preventDefault(); const meta = taskTypes[taskForm.type]; const title = taskForm.title.trim() || `${meta.label} for ${lead.name}`; setManualTasks([{ id: `manual-${Date.now()}`, icon: meta.icon, title, source: `${taskForm.source} • ${meta.label}`, dueAt: dateTimeToIso(taskForm.date, taskForm.time), note: taskForm.note.trim(), completed: false }, ...manualTasks]); setShowTaskModal(false); setActiveTab('tasks'); setTaskForm({ source: 'From Website', type: 'call', title: '', note: '', date: today, time: '18:00' }); };
  const completeTask = (id) => setCompletedIds((ids) => ids.includes(id) ? ids : [...ids, id]);
  return <div className="ld-shell"><DashboardSidebar role={role} /><main className="ld-main"><header className="ld-topbar"><div className="ld-breadcrumb"><button onClick={goToLeads} type="button">Leads</button><span>›</span><strong>Lead Details</strong></div><div className="ld-actions"><button>↗ Share</button><button>✎ Edit Lead</button><button className="primary">☎ Follow Up</button><button className="dots">⋮</button></div></header><section className="ld-profile-card"><div className="ld-profile-left"><div className="ld-avatar-large">{lead.initials}<span /></div><div className="ld-profile-main"><div className="ld-profile-title"><h1>{lead.name}</h1><b>Hot Lead</b></div><p>{lead.jobTitle || 'Marketing Manager'} at {lead.company}</p><div className="ld-contact-list"><span>✉ {lead.email || 'rohan.mehta@technova.com'}</span><span>☎ {lead.phone}</span><span>⌖ Mumbai, Maharashtra, India</span></div></div></div><div className="ld-profile-facts"><div className="ld-fact owner"><small>Lead Owner</small><div><span className="ld-owner-avatar">AK</span><strong>Amit Kumar<em>Sales Executive</em></strong></div></div><div className="ld-fact"><small>Source</small><strong>{lead.source}</strong></div><div className="ld-fact"><small>Created On</small><strong>20 May 2025, 10:30 AM</strong></div></div></section><section className="ld-summary-metrics"><article className="ld-metric-card purple"><span className="ld-metric-icon">◎</span><div className="ld-metric-body"><small>Lead Score</small><div className="ld-metric-value"><strong>{score}</strong><b>High</b></div><p>Great potential</p></div></article><article className="ld-metric-card"><span className="ld-metric-icon">▽</span><div className="ld-metric-body"><small>Pipeline Stage</small><div className="ld-metric-value"><strong>Proposal</strong></div><div className="ld-progress"><i /><em>75%</em></div></div></article><article className="ld-metric-card orange"><span className="ld-metric-icon">▣</span><div className="ld-metric-body"><small>Next Follow-up</small><div className="ld-metric-value"><strong>24 May 2025</strong></div><p>In 3 days</p></div></article><article className="ld-metric-card green"><span className="ld-metric-icon">₹</span><div className="ld-metric-body"><small>Potential Deal Value</small><div className="ld-metric-value"><strong>₹ 2,45,000</strong></div><p>High Value</p></div></article></section><section className="ld-tag-strip"><h2>Tags</h2><div><span className="green">Interested</span><span className="blue">Budget Available</span><span className="purple">Quick Decision Maker</span><span className="orange">SaaS</span><button>+ Add Tag</button></div></section><nav className="ld-tabs">{tabs.map(([key, icon, label]) => <button key={key} type="button" className={activeTab === key ? 'active' : ''} onClick={() => setActiveTab(key)}><Icon>{icon}</Icon>{label}</button>)}</nav><TabContent activeTab={activeTab} activities={activities} onAddActivity={() => setShowActivityModal(true)} tasks={tasks} onAddTask={() => setShowTaskModal(true)} onCompleteTask={completeTask} /></main>{showActivityModal && <ActivityModal form={activityForm} onChange={changeActivityForm} onClose={() => setShowActivityModal(false)} onSave={saveActivity} />}{showTaskModal && <TaskModal form={taskForm} onChange={changeTaskForm} onClose={() => setShowTaskModal(false)} onSave={saveTask} />}</div>;
}
