import { useEffect, useMemo, useState } from 'react';
import { SaasEmpty, SaasLayout, SaasStats, goTo } from '../../components/saas/SaasLayout.jsx';
import { createTask, listLeads, listTasks, updateTask } from '../../services/crmApi.js';

function money(value) { return `₹${Number(value || 0).toLocaleString('en-IN')}`; }
function fmt(value) { return value ? new Date(value).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }).replace(',', '') : '-'; }
function todayInput() { return new Date().toISOString().slice(0, 10); }
function isDone(task) { return task.status === 'Completed' || Boolean(task.completed_at); }
function isToday(value) { return value ? new Date(value).toDateString() === new Date().toDateString() : false; }
function isOverdue(value, task) { return value && new Date(value) < new Date() && !isDone(task) && !isToday(value); }

export function WonPage() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  async function load() { setLoading(true); setError(''); try { setLeads(await listLeads({ limit: 1000 })); } catch (err) { setError(err.message || 'Unable to load won leads.'); } finally { setLoading(false); } }
  useEffect(() => { load(); }, []);
  const won = useMemo(() => leads.filter((lead) => ['Won', 'Converted', 'Demo Done'].includes(lead.status)), [leads]);
  const value = won.reduce((sum, lead) => sum + Number(lead.value || 0), 0);
  return <SaasLayout role="employee" kicker="Employee Workspace" title="Won Leads" subtitle="Closed leads from live Supabase data." actions={<button className="saas-btn" onClick={load}>Refresh</button>}>
    {error ? <div className="saas-banner error">{error}</div> : null}
    <SaasStats items={[{ label: 'Won Leads', value: loading ? '...' : won.length }, { label: 'Won Value', value: money(value) }, { label: 'Conversion', value: `${leads.length ? Math.round((won.length / leads.length) * 100) : 0}%` }, { label: 'Total Leads', value: leads.length }]} />
    <section className="saas-card saas-table-card"><div className="saas-table-wrap"><table className="saas-table"><thead><tr><th>Lead</th><th>Company</th><th>Source</th><th>Status</th><th>Owner</th><th>Closed</th></tr></thead><tbody>{won.map((lead) => <tr key={lead.id} onClick={() => goTo(`/leads/${lead.id}`)}><td className="saas-title-cell"><strong>{lead.name}</strong><small>{lead.phone || '-'}</small></td><td>{lead.company || '-'}</td><td>{lead.source || '-'}</td><td><span className="saas-badge green">{lead.status}</span></td><td>{lead.owner?.full_name || '-'}</td><td>{fmt(lead.updated_at || lead.created_at)}</td></tr>)}</tbody></table></div>{!loading && !won.length ? <SaasEmpty title="No won leads yet" text="Converted leads will appear here after closing." /> : <footer className="saas-footer">Showing {won.length} won leads</footer>}</section>
  </SaasLayout>;
}

export function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [leads, setLeads] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState({ title: '', lead_id: '', type: 'Call', date: todayInput(), time: '17:00' });
  async function load() { setLoading(true); setError(''); try { const [taskRows, leadRows] = await Promise.all([listTasks({ limit: 500 }), listLeads({ limit: 500 })]); setTasks(taskRows); setLeads(leadRows); } catch (err) { setError(err.message || 'Unable to load tasks.'); } finally { setLoading(false); } }
  useEffect(() => { load(); }, []);
  const today = tasks.filter((task) => isToday(task.due_at) && !isDone(task));
  const overdue = tasks.filter((task) => isOverdue(task.due_at, task));
  const pending = tasks.filter((task) => !isDone(task));
  async function saveTask(event) { event.preventDefault(); if (!form.title.trim() || saving) return; setSaving(true); setError(''); setSuccess(''); try { await createTask({ title: form.title.trim(), lead_id: form.lead_id || null, type: form.type, status: 'Pending', due_at: new Date(`${form.date}T${form.time || '17:00'}`).toISOString() }); setSuccess('Task saved successfully.'); setShowModal(false); setForm({ title: '', lead_id: '', type: 'Call', date: todayInput(), time: '17:00' }); await load(); } catch (err) { setError(err.message || 'Unable to save task.'); } finally { setSaving(false); } }
  async function completeTask(task) { try { await updateTask(task.id, { status: 'Completed' }); setSuccess('Task marked completed.'); await load(); } catch (err) { setError(err.message || 'Unable to update task.'); } }
  const renderTask = (task) => <div className="task-row" key={task.id}><span className="task-check" /><div><strong>{task.title}</strong><small>{task.lead?.name || 'General'} • {task.type || 'Task'} • {fmt(task.due_at)}</small></div><button type="button" className="task-complete-mini" onClick={() => completeTask(task)}>{isDone(task) ? 'Done' : 'Complete'}</button></div>;
  return <SaasLayout role="employee" kicker="Employee Workspace" title="Tasks" subtitle="Live assigned tasks, follow-ups and reminders from Supabase." actions={<button className="saas-btn primary" onClick={() => setShowModal(true)}>+ Add Task</button>}>
    {error ? <div className="saas-banner error">{error}</div> : null}{success ? <div className="saas-banner">{success}</div> : null}
    <SaasStats items={[{ label: 'Today Tasks', value: loading ? '...' : today.length }, { label: 'Overdue', value: overdue.length }, { label: 'Pending', value: pending.length }, { label: 'Total Tasks', value: tasks.length }]} />
    <section className="saas-panel-grid"><article className="saas-card saas-panel"><h2>Today</h2>{today.length ? today.map(renderTask) : <SaasEmpty title="No tasks today" text="New tasks due today will appear here." />}</article><article className="saas-card saas-panel"><h2>Overdue</h2>{overdue.length ? overdue.map(renderTask) : <SaasEmpty title="No overdue tasks" text="You are up to date." />}</article></section>
    {showModal ? <div className="saas-modal-backdrop" onClick={() => setShowModal(false)}><form className="saas-modal" onSubmit={saveTask} onClick={(e) => e.stopPropagation()}><div className="saas-modal-head"><div><h2>Add Task</h2><p>Link the task with a real lead when available.</p></div><button type="button" onClick={() => setShowModal(false)}>×</button></div><div className="saas-form"><label>Task Title<input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></label><label>Lead<select value={form.lead_id} onChange={(e) => setForm({ ...form, lead_id: e.target.value })}><option value="">General task</option>{leads.map((lead) => <option value={lead.id} key={lead.id}>{lead.name}</option>)}</select></label><label>Type<select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}><option>Call</option><option>Follow-up</option><option>Demo</option><option>Meeting</option></select></label><label>Date<input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></label><label>Time<input type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} /></label></div><div className="saas-actions" style={{marginTop:16}}><button type="button" className="saas-btn" onClick={() => setShowModal(false)}>Cancel</button><button className="saas-btn primary" disabled={saving}>{saving ? 'Saving...' : 'Save Task'}</button></div></form></div> : null}
  </SaasLayout>;
}
