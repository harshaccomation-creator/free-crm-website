import { useEffect, useMemo, useState } from 'react';
import DashboardSidebar from '../../components/dashboard/DashboardSidebar.jsx';
import { getLead as getMockLead } from './leadsData.js';
import { createActivity, createTask, getLead as getRealLead, isBackendConfigured, listActivities, listTasks, updateLead, updateTask } from '../../services/crmApi.js';
import './LeadDetailPageLayout.css';
import '../../styles/leadDetailTabContent.css';
import '../../styles/leadDetailKpiFinalFix.css';

function getCurrentRole() {
  const saved = window.localStorage.getItem('salesflowRole') || window.localStorage.getItem('salesflow_user_role');
  return saved === 'admin' || saved === 'company_admin' || saved === 'superAdmin' || saved === 'super_admin' || saved === 'employee' ? saved : 'employee';
}

const tabItems = [
  ['overview', 'overview', 'Overview'],
  ['activity', 'activity', 'Activity'],
  ['tasks', 'tasks', 'Tasks'],
  ['notes', 'notes', 'Notes'],
  ['documents', 'documents', 'Documents'],
  ['email', 'email', 'Email History'],
  ['whatsapp', 'whatsapp', 'WhatsApp History'],
];

const tagPalette = {
  green: { bg: '#e8f8ef', color: '#039855', border: '#d1f2df', label: 'Green' },
  blue: { bg: '#eef5ff', color: '#0b63f6', border: '#dbeafe', label: 'Blue' },
  purple: { bg: '#f0e7ff', color: '#7c3aed', border: '#eadcff', label: 'Purple' },
  orange: { bg: '#fff1dc', color: '#f59e0b', border: '#ffe4b5', label: 'Orange' },
  red: { bg: '#fff1f2', color: '#ef4444', border: '#ffe0e5', label: 'Red' },
};

const activityTypes = {
  call: { label: 'Call', icon: '☎', tone: 'green', title: 'Call Completed' },
  not_connected: { label: 'Not Connected', icon: '☎', tone: 'red', title: 'Call Not Connected' },
  demo_done: { label: 'Demo Done', icon: '✓', tone: 'green', title: 'Demo Completed' },
  lost: { label: 'Lost', icon: '✕', tone: 'red', title: 'Lead Marked as Lost' },
  demo_scheduled: { label: 'Demo Scheduled', icon: '▣', tone: 'orange', title: 'Demo Scheduled' },
  follow_up: { label: 'Follow-up', icon: '↻', tone: 'orange', title: 'Follow-up Scheduled' },
  won: { label: 'Won', icon: '✓', tone: 'green', title: 'Lead Marked as Won' },
};

const taskTypes = {
  call: { label: 'Call', icon: '☎' },
  demo_scheduled: { label: 'Demo Scheduled', icon: '▣' },
  follow_up: { label: 'Follow-up', icon: '↻' },
};

const baseActivities = [
  { id: 'act-web-1', type: 'website', icon: '◎', title: 'Lead Captured from Website', text: 'Lead captured from website contact form.', time: '20 May 2025, 10:30 AM', user: 'System', tone: 'purple' },
  { id: 'act-follow-1', type: 'follow_up', icon: '▣', title: 'Follow-up Scheduled', text: 'Next follow-up scheduled on 24 May 2025.', time: 'Yesterday, 04:10 PM', user: 'Amit Kumar', tone: 'orange' },
  { id: 'act-demo-1', type: 'demo_done', icon: '✓', title: 'Demo Completed', text: 'Product demo completed successfully.', time: 'Yesterday, 04:15 PM', user: 'Amit Kumar', tone: 'green' },
  { id: 'act-call-1', type: 'call', icon: '☎', title: 'Called Rohan Mehta', text: 'Discussed requirements and solution overview.', time: 'Today, 10:30 AM', user: 'Amit Kumar', tone: 'green' },
];

const notes = [
  ['Requirement Note', 'Client is interested in CRM automation, lead assignment, follow-up reminders and reporting dashboard.', 'Today, 12:20 PM'],
  ['Budget Discussion', 'Budget available. Decision expected after product demo and final proposal review.', 'Yesterday, 04:50 PM'],
];
const docs = [['Proposal_Rohan_Mehta.pdf', 'PDF • 1.2 MB'], ['CRM_Demo_Requirements.docx', 'DOCX • 860 KB'], ['Quotation_v2.xlsx', 'XLSX • 420 KB']];
const emails = [['CRM Software Implementation Proposal', 'rohan.mehta@technova.com • Yesterday, 04:15 PM', 'Sent'], ['Demo Confirmation', 'rohan.mehta@technova.com • 20 May 2025, 02:10 PM', 'Opened']];
const chats = [['Shared demo meeting link on WhatsApp.', 'Today, 09:15 AM', 'Delivered'], ['Client confirmed availability for follow-up call.', 'Yesterday, 06:35 PM', 'Read']];

function todayAt(hour, minute) { const d = new Date(); d.setHours(hour, minute, 0, 0); return d.toISOString(); }
function dateTimeToIso(date, time) { return new Date(`${date}T${time}`).toISOString(); }
function formatDue(iso) { if (!iso) return '-'; const d = new Date(iso); if (Number.isNaN(d.getTime())) return String(iso); return d.toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }); }
function formatFullDate(iso) { if (!iso) return '-'; const d = new Date(iso); if (Number.isNaN(d.getTime())) return String(iso); return d.toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }).replace(',', ''); }
function goToLeads() { window.history.pushState({}, '', '/leads'); window.dispatchEvent(new Event('salesflow:navigate')); }
function Icon({ children }) { return <span className="ld-text-icon">{children}</span>; }
function makeInitials(name = '') { const parts = name.trim().split(/\s+/).filter(Boolean); return ((parts[0]?.[0] || 'L') + (parts[1]?.[0] || '')).toUpperCase(); }

function normalizeLead(record) {
  return {
    id: record?.id || 'demo-lead',
    initials: record?.initials || makeInitials(record?.name || 'Lead'),
    name: record?.name || 'Lead Not Found',
    company: record?.company || record?.company_name || '-',
    jobTitle: record?.job_title || record?.jobTitle || 'Customer',
    email: record?.email || '-',
    phone: record?.phone || '-',
    source: record?.source || 'Website',
    status: record?.status || 'New',
    score: record?.score || 60,
    value: Number(record?.value || 245000),
    owner: record?.owner?.full_name || record?.owner || 'Unassigned',
    createdAt: record?.created_at || record?.lastActivity || null,
    nextFollowUp: record?.next_follow_up || record?.nextFollowUp || null,
    notes: record?.notes || '',
    raw: record || {},
  };
}

function isLeadCreatedActivity(item) {
  const title = String(item?.title || '').toLowerCase();
  const text = String(item?.text || item?.note || item?.description || '').toLowerCase();
  const type = String(item?.type || '').toLowerCase();
  return type.includes('website') || type.includes('created') || title.includes('lead created') || title.includes('lead captured') || text.includes('lead created') || text.includes('lead captured');
}

function isCompletionActivity(item) {
  if (isLeadCreatedActivity(item)) return false;
  const title = String(item?.title || '').toLowerCase();
  const text = String(item?.text || item?.note || item?.description || '').toLowerCase();
  const type = String(item?.type || '').toLowerCase();
  const combined = `${title} ${text} ${type}`;
  return type === 'demo_done' || type === 'won' || type === 'call' || combined.includes('demo done') || combined.includes('demo completed') || combined.includes('completed') || combined.includes('complete') || combined.includes('done');
}

function normalizeActivity(item) {
  const originalType = String(item?.type || 'call').toLowerCase();
  const effectiveType = isCompletionActivity(item) && originalType.includes('demo') ? 'demo_done' : originalType;
  const meta = activityTypes[effectiveType] || activityTypes[originalType] || activityTypes.call;
  return {
    id: item.id,
    type: effectiveType,
    icon: meta.icon,
    title: item.title || meta.title,
    text: item.note || item.description || 'Activity added for this lead.',
    time: formatFullDate(item.activity_at || item.created_at),
    user: item.user?.full_name || 'User',
    tone: meta.tone,
    raw: item,
  };
}

function normalizeTask(item) {
  const key = String(item?.type || 'call').toLowerCase().includes('demo') ? 'demo_scheduled' : String(item?.type || 'call').toLowerCase().includes('follow') ? 'follow_up' : 'call';
  const meta = taskTypes[key] || taskTypes.call;
  return { id: item.id, icon: meta.icon, title: item.title || `${meta.label} task`, source: item.source || item.type || meta.label, dueAt: item.due_at || item.dueAt || todayAt(18, 0), note: item.note || '', completed: item.status === 'Completed' || Boolean(item.completed_at), isReal: true };
}
function getTaskStatus(task) { if (task.completed) return { label: 'Completed', tone: 'done' }; if (new Date(task.dueAt).getTime() < Date.now()) return { label: 'Overdue', tone: 'danger' }; return { label: 'Pending', tone: 'pending' }; }

function TagChip({ tag, onRemove }) { const p = tagPalette[tag.color] || tagPalette.blue; return <span className="ld-custom-tag" style={{ background: p.bg, color: p.color, border: `1px solid ${p.border}` }}>{tag.name}{onRemove && <button type="button" onClick={() => onRemove(tag.id)} aria-label="Remove tag">×</button>}</span>; }
function TabIcon({ type }) { const paths = { overview: <><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></>, activity: <polyline points="3 12 7 12 10 5 14 19 17 12 21 12" />, tasks: <><path d="M9 6h12" /><path d="M9 12h12" /><path d="M9 18h12" /><path d="M3.5 6l1 1 2-2" /><path d="M3.5 12l1 1 2-2" /><path d="M3.5 18l1 1 2-2" /></>, notes: <><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" /><path d="M14 3v6h6" /></>, documents: <><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" /><path d="M14 3v5h5" /><path d="M8 13h8" /><path d="M8 17h6" /></>, email: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></>, whatsapp: <><path d="M20.5 11.8a8.5 8.5 0 0 1-12.4 7.5L4 20.5l1.2-4A8.5 8.5 0 1 1 20.5 11.8z" /><path d="M9.2 8.7c.2 3 2.1 5.1 5.1 6.1l1.2-1.2" /></> }; return <svg className="ld-tab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[type]}</svg>; }

function ActivitySvgIcon({ item }) {
  if (isLeadCreatedActivity(item)) return <svg className="sf-activity-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4" /><path d="M4 21c1.6-4.2 14.4-4.2 16 0" /></svg>;
  if (isCompletionActivity(item)) return <svg className="sf-activity-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="8" /><path d="M8.5 12.2l2.2 2.2 4.8-5" /></svg>;
  const title = String(item?.title || '').toLowerCase();
  const type = String(item?.type || '').toLowerCase();
  const tone = String(item?.tone || '').toLowerCase();
  if (title.includes('not pick') || title.includes('not connected') || title.includes('dnp') || type.includes('not_connected') || tone === 'red') return <svg className="sf-activity-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="8" /><path d="M8 8l8 8" /><path d="M16 8l-8 8" /></svg>;
  return <svg className="sf-activity-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="5" width="16" height="15" rx="3" /><path d="M8 3v4" /><path d="M16 3v4" /><path d="M4 10h16" /></svg>;
}

function getActivityStatus(item) {
  const title = String(item?.title || '').toLowerCase();
  const text = String(item?.text || item?.note || item?.description || '').toLowerCase();
  const type = String(item?.type || '').toLowerCase();
  const tone = String(item?.tone || '').toLowerCase();
  const combined = `${title} ${text} ${type}`;
  if (combined.includes('not pick') || combined.includes('not connected') || combined.includes('dnp') || type.includes('not_connected') || tone === 'red') return { label: 'Not Connected', className: 'danger' };
  if (isLeadCreatedActivity(item) || isCompletionActivity(item)) return { label: 'Completed', className: 'success' };
  if (combined.includes('scheduled') || type.includes('follow_up') || type.includes('demo_scheduled')) return { label: 'Scheduled', className: 'warning' };
  return { label: 'Completed', className: 'success' };
}

function sortTimelineActivities(items) {
  return [...items].sort((a, b) => {
    const aLeadCreated = isLeadCreatedActivity(a);
    const bLeadCreated = isLeadCreatedActivity(b);
    if (aLeadCreated && !bLeadCreated) return -1;
    if (!aLeadCreated && bLeadCreated) return 1;
    return 0;
  });
}

function ActivityTimeline({ items, onAdd, onEdit }) {
  const safeItems = Array.isArray(items) ? items : [];
  const timelineItems = sortTimelineActivities(safeItems);
  return <article className="sf-activity-page"><header className="sf-activity-header"><div><h2>Activity Timeline</h2><p>{timelineItems.length} activities • timeline order</p></div><button type="button" className="sf-add-activity-btn" onClick={onAdd}>+ Add Activity</button></header><div className="sf-activity-controls"><button type="button" className="sf-filter-pill">All Time</button><button type="button" className="sf-filter-pill">Sort: Timeline Order</button></div><div className="sf-activity-list">{timelineItems.map((item, index) => { const status = getActivityStatus(item); return <div className="sf-activity-item" key={item.id || `${item.title}-${item.time}-${index}`}><div className={`sf-activity-icon ${status.className}`}><ActivitySvgIcon item={item} /></div><div className="sf-activity-content"><div className="sf-activity-title-row"><strong>{item.title}</strong><span className={`sf-activity-status ${status.className}`}>{status.label}</span></div><p>{item.text}</p><div className="sf-activity-submeta"><span>🕒 {item.time}</span><span>👤 {item.user}</span></div></div><div className="sf-activity-actions"><button type="button" className="sf-more-btn" aria-label="More options">⋮</button><button type="button" className="sf-edit-activity-btn" onClick={() => onEdit(item)}>✎</button></div></div>; })}<div className="sf-activity-end"><span />You’ve reached the end<span /></div></div></article>;
}

function ActivityModal({ form, onChange, onClose, onSave, saving }) { return <div className="ld-modal-backdrop" onClick={onClose}><div className="ld-modal" onClick={(e) => e.stopPropagation()}><div className="ld-modal-top"><div><h3>{form.id ? 'Edit Activity' : 'Add Activity'}</h3><p>{form.id ? 'Activity details update karo.' : 'Activity type select karo aur note box me details likho.'}</p></div><button type="button" className="ld-modal-close" onClick={onClose}>×</button></div><form onSubmit={onSave}><div className="ld-form-grid"><label className="ld-field"><span>Activity Type</span><select value={form.type} onChange={(e) => onChange('type', e.target.value)}>{Object.entries(activityTypes).map(([key, v]) => <option key={key} value={key}>{v.label}</option>)}</select></label><label className="ld-field"><span>Title</span><input value={form.title} onChange={(e) => onChange('title', e.target.value)} placeholder="Activity title" /></label><label className="ld-field"><span>Date</span><input type="date" value={form.date} onChange={(e) => onChange('date', e.target.value)} /></label><label className="ld-field"><span>Time</span><input type="time" value={form.time} onChange={(e) => onChange('time', e.target.value)} /></label><label className="ld-field full"><span>Note</span><textarea value={form.note} onChange={(e) => onChange('note', e.target.value)} placeholder="Yaha activity ka note likho..." /></label></div><div className="ld-modal-actions"><button type="button" className="ghost" onClick={onClose}>Cancel</button><button type="submit" className="primary" disabled={saving}>{saving ? 'Saving...' : form.id ? 'Update Activity' : 'Save Activity'}</button></div></form></div></div>; }
function TaskModal({ form, onChange, onClose, onSave, saving }) { return <div className="ld-modal-backdrop" onClick={onClose}><div className="ld-modal" onClick={(e) => e.stopPropagation()}><div className="ld-modal-top"><div><h3>Add Task</h3><p>From Website se task banao: Call, Demo Scheduled ya Follow-up.</p></div><button type="button" className="ld-modal-close" onClick={onClose}>×</button></div><form onSubmit={onSave}><div className="ld-form-grid"><label className="ld-field"><span>Task Source</span><select value={form.source} onChange={(e) => onChange('source', e.target.value)}><option value="From Website">From Website</option></select></label><label className="ld-field"><span>Task Type</span><select value={form.type} onChange={(e) => onChange('type', e.target.value)}>{Object.entries(taskTypes).map(([key, v]) => <option key={key} value={key}>{v.label}</option>)}</select></label><label className="ld-field"><span>Date</span><input type="date" value={form.date} onChange={(e) => onChange('date', e.target.value)} /></label><label className="ld-field"><span>Time</span><input type="time" value={form.time} onChange={(e) => onChange('time', e.target.value)} /></label><label className="ld-field full"><span>Task Title</span><input value={form.title} onChange={(e) => onChange('title', e.target.value)} placeholder="Task title optional" /></label><label className="ld-field full"><span>Note</span><textarea value={form.note} onChange={(e) => onChange('note', e.target.value)} placeholder="Task ka note likho..." /></label></div><div className="ld-modal-actions"><button type="button" className="ghost" onClick={onClose}>Cancel</button><button type="submit" className="primary" disabled={saving}>{saving ? 'Saving...' : 'Save Task'}</button></div></form></div></div>; }
function TagModal({ form, onChange, onClose, onSave }) { return <div className="ld-modal-backdrop" onClick={onClose}><div className="ld-modal" onClick={(e) => e.stopPropagation()}><div className="ld-modal-top"><div><h3>Add Tag</h3><p>Employee apna tag bana sakta hai aur color choose kar sakta hai.</p></div><button type="button" className="ld-modal-close" onClick={onClose}>×</button></div><form onSubmit={onSave}><div className="ld-form-grid"><label className="ld-field full"><span>Tag Name</span><input value={form.name} onChange={(e) => onChange('name', e.target.value)} placeholder="Example: High Priority" autoFocus /></label><label className="ld-field full"><span>Tag Color</span><div className="ld-color-palette">{Object.entries(tagPalette).map(([key, value]) => <button type="button" key={key} className={form.color === key ? 'active' : ''} onClick={() => onChange('color', key)} style={{ '--tag-bg': value.bg, '--tag-color': value.color, '--tag-border': value.border }}><i />{value.label}</button>)}</div></label></div><div className="ld-modal-actions"><button type="button" className="ghost" onClick={onClose}>Cancel</button><button type="submit" className="primary">Save Tag</button></div></form></div></div>; }
function EditLeadModal({ form, onChange, onClose, onSave, saving }) { return <div className="ld-modal-backdrop" onClick={onClose}><div className="ld-modal" onClick={(e) => e.stopPropagation()}><div className="ld-modal-top"><div><h3>Edit Lead</h3><p>Lead details update karo.</p></div><button type="button" className="ld-modal-close" onClick={onClose}>×</button></div><form onSubmit={onSave}><div className="ld-form-grid"><label className="ld-field"><span>Name</span><input value={form.name} onChange={(e) => onChange('name', e.target.value)} /></label><label className="ld-field"><span>Company</span><input value={form.company} onChange={(e) => onChange('company', e.target.value)} /></label><label className="ld-field"><span>Job Title</span><input value={form.jobTitle} onChange={(e) => onChange('jobTitle', e.target.value)} /></label><label className="ld-field"><span>Phone</span><input value={form.phone} onChange={(e) => onChange('phone', e.target.value)} /></label><label className="ld-field full"><span>Email</span><input value={form.email} onChange={(e) => onChange('email', e.target.value)} /></label></div><div className="ld-modal-actions"><button type="button" className="ghost" onClick={onClose}>Cancel</button><button type="submit" className="primary" disabled={saving}>{saving ? 'Saving...' : 'Save Lead'}</button></div></form></div></div>; }
function ShareModal({ link, onClose }) { const copy = async () => { try { await navigator.clipboard.writeText(link); alert('Lead link copied'); } catch { alert(link); } }; return <div className="ld-modal-backdrop" onClick={onClose}><div className="ld-modal ld-share-modal" onClick={(e) => e.stopPropagation()}><div className="ld-modal-top"><div><h3>Share Lead</h3><p>Lead detail ka secure link copy karo.</p></div><button type="button" className="ld-modal-close" onClick={onClose}>×</button></div><input value={link} readOnly /><div className="ld-modal-actions"><button type="button" className="ghost" onClick={onClose}>Close</button><button type="button" className="primary" onClick={copy}>Copy Link</button></div></div></div>; }
function SideInfo() { return <aside className="ld-card ld-side-info"><h2>Quick Info</h2><div><small>Preferred Contact</small><strong>Phone + WhatsApp</strong></div><div><small>Decision Timeline</small><strong>This month</strong></div><div><small>Requirement</small><strong>CRM automation</strong></div></aside>; }
function TasksPanel({ tasks, onAdd, onComplete }) { const counts = tasks.reduce((acc, t) => { acc[getTaskStatus(t).tone] += 1; return acc; }, { danger: 0, pending: 0, done: 0 }); return <section className="ld-card ld-tab-panel ld-tasks-panel"><header><div><h2>Tasks</h2><p>From Website se Call/Demo/Follow-up task banao. Time cross hone par Overdue ho jayega.</p></div><button type="button" onClick={onAdd}>+ Add Task</button></header><div className="ld-task-stats"><span><b>{tasks.length}</b>Total</span><span className="danger"><b>{counts.danger}</b>Overdue</span><span><b>{counts.pending}</b>Pending</span><span className="done"><b>{counts.done}</b>Done</span></div>{tasks.map((task) => { const s = getTaskStatus(task); return <div className={`ld-task-row ${s.tone}`} key={task.id}><span className="ld-task-icon">{task.icon}</span><div><strong>{task.title}</strong><p>{task.source} • Due {formatDue(task.dueAt)}{task.note ? ` • ${task.note}` : ''}</p></div><b>{s.label}</b><button type="button" onClick={() => onComplete(task.id)}>{task.completed ? 'Done' : 'Complete'}</button></div>; })}</section>; }
function SimplePanel({ title, action, rows, icon = '☷' }) { return <section className="ld-card ld-tab-panel"><header><h2>{title}</h2><button>{action}</button></header>{rows.map((r) => <div className="ld-tab-row" key={r[0]}><span className="ld-tab-dot blue"><Icon>{icon}</Icon></span><div><strong>{r[0]}</strong><p>{r[1]}</p></div><b>{r[2]}</b></div>)}</section>; }
function NotesPanel({ lead }) { return <section className="ld-card ld-tab-panel"><header><h2>Notes</h2><button>+ Add Note</button></header>{lead.notes ? <div className="ld-tab-note"><strong>Lead Note</strong><p>{lead.notes}</p><small>Saved on lead</small></div> : notes.map(([a, b, c]) => <div className="ld-tab-note" key={a}><strong>{a}</strong><p>{b}</p><small>{c}</small></div>)}</section>; }
function FilesPanel() { return <section className="ld-card ld-tab-panel"><header><h2>Documents</h2><button>Upload File</button></header>{docs.map(([name, meta]) => <div className="ld-file-row wide" key={name}><span>FILE</span><div><strong>{name}</strong><small>{meta}</small></div><button>↓</button></div>)}</section>; }
function TabContent({ activeTab, activities, onAddActivity, onEditActivity, tasks, onAddTask, onCompleteTask, lead }) {
  if (activeTab === 'overview' || activeTab === 'activity') {
    return (
      <section className="ld-tab-single">
        <ActivityTimeline items={activities} onAdd={onAddActivity} onEdit={onEditActivity} />
      </section>
    );
  }
  if (activeTab === 'tasks') return <TasksPanel tasks={tasks} onAdd={onAddTask} onComplete={onCompleteTask} />;
  if (activeTab === 'notes') return <NotesPanel lead={lead} />;
  if (activeTab === 'documents') return <FilesPanel />;
  if (activeTab === 'email') return <SimplePanel title="Email History" action="Send Email" rows={emails} icon="✉" />;
  return <SimplePanel title="WhatsApp History" action="Send Message" rows={chats} icon="◌" />;
}

export default function LeadDetailPage({ leadId }) {
  const role = getCurrentRole();
  const mockLead = normalizeLead(getMockLead(leadId) || {});
  const today = new Date().toISOString().slice(0, 10);
  const [lead, setLead] = useState(mockLead);
  const [activeTab, setActiveTab] = useState('overview');
  const [activities, setActivities] = useState(baseActivities);
  const [manualTasks, setManualTasks] = useState([]);
  const [completedIds, setCompletedIds] = useState([]);
  const [tags, setTags] = useState([{ id: 1, name: 'Interested', color: 'green' }, { id: 2, name: 'Budget Available', color: 'blue' }, { id: 3, name: 'Quick Decision Maker', color: 'purple' }, { id: 4, name: 'SaaS', color: 'orange' }]);
  const [statusMessage, setStatusMessage] = useState('');
  const [isRealLead, setIsRealLead] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showTagModal, setShowTagModal] = useState(false);
  const [activityForm, setActivityForm] = useState({ id: '', type: 'call', title: '', note: '', date: today, time: '10:30' });
  const [taskForm, setTaskForm] = useState({ source: 'From Website', type: 'call', title: '', note: '', date: today, time: '18:00' });
  const [tagForm, setTagForm] = useState({ name: '', color: 'blue' });
  const [editForm, setEditForm] = useState({ name: mockLead.name, company: mockLead.company, jobTitle: mockLead.jobTitle, email: mockLead.email, phone: mockLead.phone });

  useEffect(() => {
    let alive = true;
    async function loadRealLead() {
      if (!isBackendConfigured) { setStatusMessage('Demo mode: Supabase env missing. Showing sample lead.'); return; }
      try {
        const real = await getRealLead(leadId);
        if (!alive || !real) return;
        const normalized = normalizeLead(real);
        setLead(normalized);
        setEditForm({ name: normalized.name, company: normalized.company, jobTitle: normalized.jobTitle, email: normalized.email, phone: normalized.phone });
        setIsRealLead(true);
        setStatusMessage('Live Supabase lead connected.');
        const [realActivities, realTasks] = await Promise.all([listActivities({ leadId, limit: 100 }), listTasks({ limit: 100 })]);
        if (!alive) return;
        setActivities(realActivities.length ? realActivities.map(normalizeActivity) : baseActivities);
        setManualTasks(realTasks.filter((task) => task.lead_id === leadId).map(normalizeTask));
      } catch (error) {
        if (!alive) return;
        setIsRealLead(false);
        setStatusMessage(`Demo mode: ${error.message}. Showing sample lead.`);
      }
    }
    loadRealLead();
    return () => { alive = false; };
  }, [leadId]);

  const score = lead.score || 85;
  const autoTasks = useMemo(() => isRealLead ? [] : [{ id: 'auto-followup', icon: '☎', title: `Follow-up call with ${lead.name}`, source: 'Auto from Next Follow-up', dueAt: todayAt(17, 0), completed: false }, { id: 'auto-demo', icon: '▣', title: `Demo scheduled for ${lead.company}`, source: 'Auto from demo schedule', dueAt: todayAt(14, 0), completed: false }, { id: 'auto-proposal', icon: '✉', title: 'Send revised proposal', source: 'Auto from proposal stage', dueAt: todayAt(11, 30), completed: false }], [isRealLead, lead.name, lead.company]);
  const tasks = [...manualTasks, ...autoTasks].map((t) => ({ ...t, completed: t.completed || completedIds.includes(t.id) }));

  const changeActivityForm = (k, v) => setActivityForm((c) => ({ ...c, [k]: v }));
  const changeTaskForm = (k, v) => setTaskForm((c) => ({ ...c, [k]: v }));
  const changeEditForm = (k, v) => setEditForm((c) => ({ ...c, [k]: v }));
  const changeTagForm = (k, v) => setTagForm((c) => ({ ...c, [k]: v }));
  const openAddActivity = () => { setActivityForm({ id: '', type: 'call', title: '', note: '', date: today, time: '10:30' }); setShowActivityModal(true); };
  const openEditActivity = (activity) => { setActivityForm({ id: activity.id, type: activity.type && activityTypes[activity.type] ? activity.type : 'call', title: activity.title || '', note: activity.text || '', date: today, time: '10:30' }); setShowActivityModal(true); };

  const saveActivity = async (e) => {
    e.preventDefault();
    const selectedMeta = activityTypes[activityForm.type];
    const baseItem = { type: activityForm.type, title: activityForm.title.trim() || selectedMeta.title, text: activityForm.note.trim() || `${selectedMeta.label} activity added for this lead.` };
    const effectiveType = isCompletionActivity(baseItem) && String(activityForm.type).includes('demo') ? 'demo_done' : activityForm.type;
    const meta = activityTypes[effectiveType] || selectedMeta;
    const updated = { id: activityForm.id || `act-${Date.now()}`, type: effectiveType, icon: meta.icon, title: baseItem.title, text: baseItem.text, time: formatDue(dateTimeToIso(activityForm.date, activityForm.time)), user: 'Jayraj', tone: meta.tone };
    setIsSaving(true);
    try {
      if (isRealLead && !activityForm.id) {
        const saved = await createActivity({ lead_id: lead.id, type: effectiveType, title: updated.title, note: updated.text, activity_at: dateTimeToIso(activityForm.date, activityForm.time) });
        if (saved) updated.id = saved.id;
        setStatusMessage('Activity saved to Supabase.');
      }
      setActivities((list) => activityForm.id ? list.map((item) => item.id === activityForm.id ? updated : item) : [updated, ...list]);
      setShowActivityModal(false);
      setActivityForm({ id: '', type: 'call', title: '', note: '', date: today, time: '10:30' });
    } catch (error) { setStatusMessage(`Activity save failed: ${error.message}`); } finally { setIsSaving(false); }
  };

  const saveTask = async (e) => {
    e.preventDefault();
    const meta = taskTypes[taskForm.type];
    const item = { id: `manual-${Date.now()}`, icon: meta.icon, title: taskForm.title.trim() || `${meta.label} for ${lead.name}`, source: `${taskForm.source} • ${meta.label}`, dueAt: dateTimeToIso(taskForm.date, taskForm.time), note: taskForm.note.trim(), completed: false };
    setIsSaving(true);
    try {
      if (isRealLead) { const saved = await createTask({ lead_id: lead.id, title: item.title, note: item.note, type: meta.label, due_at: item.dueAt, status: 'Pending' }); item.id = saved.id; item.isReal = true; setStatusMessage('Task saved to Supabase.'); }
      setManualTasks([item, ...manualTasks]); setShowTaskModal(false); setActiveTab('tasks'); setTaskForm({ source: 'From Website', type: 'call', title: '', note: '', date: today, time: '18:00' });
    } catch (error) { setStatusMessage(`Task save failed: ${error.message}`); } finally { setIsSaving(false); }
  };
  const saveTag = (e) => { e.preventDefault(); const name = tagForm.name.trim(); if (!name) return; setTags((list) => [...list, { id: Date.now(), name, color: tagForm.color }]); setTagForm({ name: '', color: 'blue' }); setShowTagModal(false); };
  const saveLead = async (e) => { e.preventDefault(); const initials = makeInitials(editForm.name); setIsSaving(true); try { if (isRealLead) { const saved = await updateLead(lead.id, { name: editForm.name, company: editForm.company, job_title: editForm.jobTitle, email: editForm.email, phone: editForm.phone }); setLead(normalizeLead(saved)); setStatusMessage('Lead updated in Supabase.'); } else { setLead((old) => ({ ...old, ...editForm, initials })); } setShowEditModal(false); } catch (error) { setStatusMessage(`Lead update failed: ${error.message}`); } finally { setIsSaving(false); } };
  const completeTask = async (id) => { const task = manualTasks.find((item) => item.id === id); try { if (isRealLead && task?.isReal) await updateTask(id, { status: 'Completed' }); setCompletedIds((ids) => ids.includes(id) ? ids : [...ids, id]); setManualTasks((list) => list.map((item) => item.id === id ? { ...item, completed: true } : item)); setStatusMessage('Task marked completed.'); } catch (error) { setStatusMessage(`Task update failed: ${error.message}`); } };

  return (
    <div className="ld-detail-page emp-page">
      <DashboardSidebar role={role} />
      <main className="emp-main ld-detail-main ld-main">
        <div className="emp-container ld-detail-container">
          <header className="ld-topbar">
            <div className="ld-breadcrumb">
              <button onClick={goToLeads} type="button">Leads</button>
              <span>›</span>
              <strong>Lead Details</strong>
            </div>
            <div className="ld-actions">
              <button type="button" onClick={() => setShowShareModal(true)}>↗ Share</button>
              <button type="button" onClick={() => setShowEditModal(true)}>✎ Edit Lead</button>
              <button type="button" className="dots">⋮</button>
            </div>
          </header>

          {statusMessage ? <div className="ld-live-banner">{statusMessage}</div> : null}

          <div className="ld-detail-body">
            <aside className="ld-detail-col ld-detail-col--left">
              <section className="ld-profile-card">
                <div className="ld-profile-left">
                  <div className="ld-avatar-large">{lead.initials}<span /></div>
                  <div className="ld-profile-main">
                    <div className="ld-profile-title">
                      <h1>{lead.name}</h1>
                      <b>{lead.status || 'Hot Lead'}</b>
                    </div>
                    <p>{lead.jobTitle || 'Customer'} at {lead.company}</p>
                    <div className="ld-contact-list">
                      <span>✉ {lead.email || '-'}</span>
                      <span>☎ {lead.phone}</span>
                      <span>⌖ Location not added</span>
                    </div>
                  </div>
                </div>
                <div className="ld-profile-facts">
                  <div className="ld-fact owner">
                    <small>Lead Owner</small>
                    <div>
                      <span className="ld-owner-avatar">{makeInitials(lead.owner || 'U')}</span>
                      <strong>{lead.owner || 'Unassigned'}<em>Sales Executive</em></strong>
                    </div>
                  </div>
                  <div className="ld-fact"><small>Source</small><strong>{lead.source}</strong></div>
                  <div className="ld-fact"><small>Created On</small><strong>{formatFullDate(lead.createdAt) || '-'}</strong></div>
                </div>
              </section>

              <section className="ld-summary-metrics">
                <article className="ld-metric-card purple"><span className="ld-metric-icon">◎</span><div className="ld-metric-body"><small>Lead Score</small><div className="ld-metric-value"><strong>{score}</strong><b>High</b></div><p>Great potential</p></div></article>
                <article className="ld-metric-card"><span className="ld-metric-icon">▽</span><div className="ld-metric-body"><small>Pipeline Stage</small><div className="ld-metric-value"><strong>{lead.status || 'New'}</strong></div><div className="ld-progress"><i /><em>75%</em></div></div></article>
                <article className="ld-metric-card orange"><span className="ld-metric-icon">▣</span><div className="ld-metric-body"><small>Next Follow-up</small><div className="ld-metric-value"><strong>{formatDue(lead.nextFollowUp)}</strong></div><p>{lead.nextFollowUp ? 'Scheduled' : 'Not set'}</p></div></article>
                <article className="ld-metric-card green"><span className="ld-metric-icon">₹</span><div className="ld-metric-body"><small>Potential Deal Value</small><div className="ld-metric-value"><strong>₹ {Number(lead.value || 0).toLocaleString('en-IN')}</strong></div><p>Deal Value</p></div></article>
              </section>

              <section className="ld-tag-strip">
                <h2>Tags</h2>
                <div>
                  {tags.map((tag) => <TagChip key={tag.id} tag={tag} onRemove={(id) => setTags((list) => list.filter((x) => x.id !== id))} />)}
                  <button type="button" onClick={() => setShowTagModal(true)}>+ Add Tag</button>
                </div>
              </section>

              <nav className="ld-tabs" aria-label="Lead sections">
                {tabItems.map(([key, icon, label]) => (
                  <button key={key} type="button" className={activeTab === key ? 'active' : ''} onClick={() => setActiveTab(key)}>
                    <TabIcon type={icon} />
                    {label}
                  </button>
                ))}
              </nav>

              <SideInfo />
            </aside>

            <div className="ld-detail-col ld-detail-col--right">
              <TabContent
                activeTab={activeTab}
                activities={activities}
                onAddActivity={openAddActivity}
                onEditActivity={openEditActivity}
                tasks={tasks}
                onAddTask={() => setShowTaskModal(true)}
                onCompleteTask={completeTask}
                lead={lead}
              />
            </div>
          </div>
        </div>
      </main>

      {showActivityModal && <ActivityModal form={activityForm} onChange={changeActivityForm} onClose={() => setShowActivityModal(false)} onSave={saveActivity} saving={isSaving} />}
      {showTaskModal && <TaskModal form={taskForm} onChange={changeTaskForm} onClose={() => setShowTaskModal(false)} onSave={saveTask} saving={isSaving} />}
      {showTagModal && <TagModal form={tagForm} onChange={changeTagForm} onClose={() => setShowTagModal(false)} onSave={saveTag} />}
      {showEditModal && <EditLeadModal form={editForm} onChange={changeEditForm} onClose={() => setShowEditModal(false)} onSave={saveLead} saving={isSaving} />}
      {showShareModal && <ShareModal link={window.location.href} onClose={() => setShowShareModal(false)} />}
    </div>
  );
}
