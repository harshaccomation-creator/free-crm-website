import { useEffect, useMemo, useState } from 'react';
import LeadTimelinePanels from './LeadTimelinePanels.jsx';
import { listTasks } from '../../services/crmApi.js';
import { editLeadActivity, editLeadTask } from '../../services/editApi.js';

function toLocalInput(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const pad = (n) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function isoFromLocal(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function cleanNote(note = '') {
  return String(note || '')
    .split('\n')
    .filter((line) => {
      const value = line.trim().toLowerCase();
      if (!value) return false;
      if (value.startsWith('disposition:')) return false;
      if (value.startsWith('sub disposition:')) return false;
      if (value.startsWith('task date time:')) return false;
      if (value.startsWith('reminder:')) return false;
      if (value.startsWith('due:')) return false;
      if (value.includes('auto task created')) return false;
      return true;
    })
    .join('\n')
    .replace(/^note:\s*/i, '')
    .trim();
}

export default function LeadTimelinePanelsEditable({ activeTab, leadId, activities = [], onSaved }) {
  const [tasks, setTasks] = useState([]);
  const [editingActivity, setEditingActivity] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function loadTasks() {
    if (!leadId) return;
    const rows = await listTasks({ limit: 500 });
    setTasks((rows || []).filter((task) => task.lead_id === leadId || task.lead?.id === leadId));
  }

  useEffect(() => { loadTasks().catch(() => setTasks([])); }, [leadId, activeTab]);

  const visibleActivities = useMemo(() => {
    return (activities || []).filter((item) => String(item.type || '').toLowerCase() !== 'task_created');
  }, [activities]);

  useEffect(() => {
    const root = document.getElementById('lead-activity-section');
    if (!root) return;
    const timer = window.setTimeout(() => {
      const cards = [...root.querySelectorAll('.rounded-2xl.border.border-slate-200.bg-white.p-4')];
      const source = activeTab === 'Tasks' ? tasks : visibleActivities;
      cards.forEach((card, index) => {
        if (!source[index] || card.querySelector('[data-edit-row="1"]')) return;
        const button = document.createElement('button');
        button.type = 'button';
        button.dataset.editRow = '1';
        button.className = 'mt-3 h-8 rounded-lg border border-slate-200 px-3 text-xs font-black text-slate-600 hover:bg-slate-50';
        button.textContent = 'Edit';
        button.onclick = () => {
          if (activeTab === 'Tasks') {
            const task = source[index];
            setEditingTask({
              id: task.id,
              title: task.title || '',
              note: cleanNote(task.note),
              dueAt: toLocalInput(task.due_at),
              durationMinutes: Number(task.duration_minutes || 30),
              status: task.status || 'Pending',
            });
          } else {
            const item = source[index];
            setEditingActivity({
              id: item.id,
              title: item.title || '',
              note: cleanNote(item.note),
              activityAt: toLocalInput(item.activity_at || item.created_at),
            });
          }
        };
        card.appendChild(button);
      });
    }, 100);
    return () => window.clearTimeout(timer);
  }, [activeTab, tasks, visibleActivities]);

  async function saveActivity() {
    if (!editingActivity) return;
    setSaving(true);
    setError('');
    try {
      await editLeadActivity({
        activityId: editingActivity.id,
        title: editingActivity.title,
        note: editingActivity.note,
        activityAt: isoFromLocal(editingActivity.activityAt),
      });
      setEditingActivity(null);
      await onSaved?.();
    } catch (err) {
      setError(err.message || 'Activity edit failed');
    } finally {
      setSaving(false);
    }
  }

  async function saveTask() {
    if (!editingTask) return;
    setSaving(true);
    setError('');
    try {
      await editLeadTask({
        taskId: editingTask.id,
        title: editingTask.title,
        note: editingTask.note,
        dueAt: isoFromLocal(editingTask.dueAt),
        durationMinutes: Number(editingTask.durationMinutes || 30),
        status: editingTask.status,
      });
      setEditingTask(null);
      await loadTasks();
      await onSaved?.();
    } catch (err) {
      setError(err.message || 'Task edit failed');
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      {error ? <div className="mb-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">{error}</div> : null}
      <LeadTimelinePanels activeTab={activeTab} leadId={leadId} activities={visibleActivities} />

      {editingActivity ? (
        <div className="fixed inset-0 z-[9999] grid place-items-center bg-slate-950/60 px-4">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-2xl">
            <div className="border-b border-slate-100 px-5 py-4"><h2 className="text-xl font-black text-slate-900">Edit Activity</h2></div>
            <div className="space-y-4 p-5">
              <label className="block"><span className="text-xs font-black uppercase text-slate-500">Title</span><input value={editingActivity.title} onChange={(e) => setEditingActivity((p) => ({ ...p, title: e.target.value }))} className="mt-1 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm font-bold" /></label>
              <label className="block"><span className="text-xs font-black uppercase text-slate-500">Activity Time</span><input type="datetime-local" value={editingActivity.activityAt} onChange={(e) => setEditingActivity((p) => ({ ...p, activityAt: e.target.value }))} className="mt-1 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm font-bold" /></label>
              <label className="block"><span className="text-xs font-black uppercase text-slate-500">Note</span><textarea value={editingActivity.note} onChange={(e) => setEditingActivity((p) => ({ ...p, note: e.target.value }))} className="mt-1 min-h-24 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold" /></label>
            </div>
            <div className="flex justify-end gap-3 border-t border-slate-100 px-5 py-4"><button onClick={() => setEditingActivity(null)} className="h-10 rounded-xl border border-slate-200 px-4 text-sm font-bold">Cancel</button><button disabled={saving} onClick={saveActivity} className="h-10 rounded-xl bg-orange-600 px-5 text-sm font-black text-white disabled:opacity-50">Save</button></div>
          </div>
        </div>
      ) : null}

      {editingTask ? (
        <div className="fixed inset-0 z-[9999] grid place-items-center bg-slate-950/60 px-4">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-2xl">
            <div className="border-b border-slate-100 px-5 py-4"><h2 className="text-xl font-black text-slate-900">Edit Task</h2></div>
            <div className="space-y-4 p-5">
              <label className="block"><span className="text-xs font-black uppercase text-slate-500">Title</span><input value={editingTask.title} onChange={(e) => setEditingTask((p) => ({ ...p, title: e.target.value }))} className="mt-1 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm font-bold" /></label>
              <label className="block"><span className="text-xs font-black uppercase text-slate-500">Due Time</span><input type="datetime-local" value={editingTask.dueAt} onChange={(e) => setEditingTask((p) => ({ ...p, dueAt: e.target.value }))} className="mt-1 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm font-bold" /></label>
              <div className="grid grid-cols-2 gap-3">
                <label className="block"><span className="text-xs font-black uppercase text-slate-500">Duration</span><select value={editingTask.durationMinutes} onChange={(e) => setEditingTask((p) => ({ ...p, durationMinutes: Number(e.target.value) }))} className="mt-1 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm font-bold"><option value={15}>15m</option><option value={30}>30m</option><option value={45}>45m</option><option value={60}>60m</option><option value={90}>90m</option><option value={120}>120m</option></select></label>
                <label className="block"><span className="text-xs font-black uppercase text-slate-500">Status</span><select value={editingTask.status} onChange={(e) => setEditingTask((p) => ({ ...p, status: e.target.value }))} className="mt-1 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm font-bold"><option>Pending</option><option>Completed</option></select></label>
              </div>
              <label className="block"><span className="text-xs font-black uppercase text-slate-500">Note</span><textarea value={editingTask.note} onChange={(e) => setEditingTask((p) => ({ ...p, note: e.target.value }))} className="mt-1 min-h-24 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold" /></label>
            </div>
            <div className="flex justify-end gap-3 border-t border-slate-100 px-5 py-4"><button onClick={() => setEditingTask(null)} className="h-10 rounded-xl border border-slate-200 px-4 text-sm font-bold">Cancel</button><button disabled={saving} onClick={saveTask} className="h-10 rounded-xl bg-orange-600 px-5 text-sm font-black text-white disabled:opacity-50">Save</button></div>
          </div>
        </div>
      ) : null}
    </>
  );
}
