import { useEffect, useMemo, useState } from 'react';
import { listTasks } from '../../services/crmApi.js';

function safeText(value = '') {
  return String(value || '');
}

function dateObj(value) {
  const date = value ? new Date(value) : new Date();
  return Number.isNaN(date.getTime()) ? new Date() : date;
}

function formatDate(value) {
  return dateObj(value).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatTime(value) {
  return dateObj(value).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
}

function formatDateTime(value) {
  return dateObj(value).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

function dayHeading(value) {
  const date = dateObj(value);
  const today = new Date();
  if (date.toDateString() === today.toDateString()) return `Today, ${formatDate(value)}`;
  return formatDate(value);
}

function relativeTime(value) {
  const diff = Date.now() - dateObj(value).getTime();
  const mins = Math.max(0, Math.round(diff / 60000));
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins} mins ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours} hours ago`;
  return `${Math.round(hours / 24)} days ago`;
}

function groupByDay(items, field) {
  return items.reduce((groups, item) => {
    const key = formatDate(item[field]);
    if (!groups[key]) groups[key] = [];
    groups[key].push(item);
    return groups;
  }, {});
}

function typeLabel(type = '') {
  return safeText(type).replaceAll('_', ' ') || 'Activity';
}

function statusBadge(status = '') {
  const key = safeText(status).toLowerCase();
  const color = key === 'completed' || key === 'won'
    ? 'bg-green-50 text-green-700'
    : key.includes('lost') || key.includes('over')
      ? 'bg-red-50 text-red-700'
      : 'bg-orange-50 text-orange-700';
  return <span className={`rounded-lg px-3 py-1 text-xs font-black ${color}`}>{safeText(status || 'Pending')}</span>;
}

function ActivityIcon({ type }) {
  const key = safeText(type).toLowerCase();
  const icon = key.includes('call') ? '☎️' : key.includes('demo') ? '📅' : key.includes('won') ? '🏆' : key.includes('task') ? '✅' : key.includes('note') ? '📝' : key.includes('not') ? '⚠️' : '⚡';
  return <div className="relative z-10 grid h-9 w-9 place-items-center rounded-xl bg-orange-50 text-orange-600 shadow-sm">{icon}</div>;
}

function TaskIcon({ status }) {
  const done = safeText(status).toLowerCase() === 'completed';
  return (
    <div className="relative z-10 grid h-9 w-9 place-items-center rounded-xl bg-blue-50 text-blue-600 shadow-sm">
      📅
      {done ? <span className="absolute -right-1 -bottom-1 grid h-4 w-4 place-items-center rounded-full bg-green-500 text-[10px] text-white">✓</span> : null}
    </div>
  );
}

function ActivityCard({ item }) {
  const actor = item.user?.full_name || item.user?.email || 'Not assigned';
  const activityAt = item.activity_at || item.created_at;
  return (
    <div className="relative flex gap-4">
      <div className="flex w-10 flex-col items-center">
        <ActivityIcon type={item.type} />
        <div className="h-full w-px bg-slate-200" />
      </div>
      <div className="mb-4 flex-1 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-base font-black text-slate-900">{item.title || typeLabel(item.type)}</p>
            <p className="mt-2 text-sm font-semibold text-slate-600">🗓 {formatDate(activityAt)} &nbsp; | &nbsp; 🕒 {formatTime(activityAt)}</p>
          </div>
          {statusBadge(typeLabel(item.type))}
        </div>
        {item.note ? <p className="mt-3 whitespace-pre-line text-sm text-slate-600">{item.note}</p> : null}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-500">
          <span className="rounded-md bg-slate-100 px-2 py-1 font-bold text-slate-700">{actor}</span>
          <span>Added By {actor} &nbsp; | &nbsp; {formatDateTime(item.created_at || activityAt)} &nbsp; • &nbsp; {relativeTime(item.created_at || activityAt)}</span>
        </div>
      </div>
    </div>
  );
}

function TaskCard({ task }) {
  const owner = task.owner?.full_name || task.owner?.email || 'Not assigned';
  const addedBy = task.created_by_profile?.full_name || task.created_by_profile?.email || owner;
  return (
    <div className="relative flex gap-4">
      <div className="flex w-10 flex-col items-center">
        <TaskIcon status={task.status} />
        <div className="h-full w-px bg-slate-200" />
      </div>
      <div className="mb-4 flex-1 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-base font-black text-slate-900">{task.title || 'Task'}</p>
            <p className="mt-2 text-sm font-semibold text-slate-600">🗓 {formatDate(task.due_at)} &nbsp; | &nbsp; 🕒 {formatTime(task.due_at)} &nbsp; | &nbsp; ⏳ 30m</p>
          </div>
          {statusBadge(task.status || 'Pending')}
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-500">
          <span className="rounded-md bg-slate-100 px-2 py-1 font-bold text-slate-700">{owner}</span>
          <span>Added By {addedBy} &nbsp; | &nbsp; {formatDateTime(task.created_at)} &nbsp; • &nbsp; {relativeTime(task.created_at)}</span>
        </div>
        {task.note ? <p className="mt-3 whitespace-pre-line text-sm text-slate-500">{task.note}</p> : null}
      </div>
    </div>
  );
}

function EmptyState({ text }) {
  return <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center text-slate-500">{text}</div>;
}

export default function LeadTimelinePanels({ activeTab, leadId, activities = [] }) {
  const [tasks, setTasks] = useState([]);
  const [tasksLoading, setTasksLoading] = useState(false);

  useEffect(() => {
    if (activeTab !== 'Tasks' || !leadId) return;
    let mounted = true;
    setTasksLoading(true);
    listTasks({ limit: 500 })
      .then((rows) => {
        if (!mounted) return;
        setTasks((rows || []).filter((task) => task.lead_id === leadId || task.lead?.id === leadId));
      })
      .catch(() => mounted && setTasks([]))
      .finally(() => mounted && setTasksLoading(false));
    return () => { mounted = false; };
  }, [activeTab, leadId]);

  const groupedActivities = useMemo(() => groupByDay(activities, 'activity_at'), [activities]);
  const groupedTasks = useMemo(() => groupByDay(tasks, 'due_at'), [tasks]);

  if (activeTab === 'Activity Timeline') {
    if (!activities.length) return <EmptyState text="No Supabase activities found." />;
    return (
      <div className="space-y-2">
        {Object.entries(groupedActivities).map(([date, list]) => (
          <div key={date}>
            <div className="mb-3 text-sm font-black text-slate-800">{dayHeading(list[0]?.activity_at || list[0]?.created_at)}</div>
            <div>{list.map((item) => <ActivityCard key={item.id} item={item} />)}</div>
          </div>
        ))}
      </div>
    );
  }

  if (activeTab === 'Tasks') {
    if (tasksLoading) return <div className="text-slate-500 font-bold">Loading lead tasks...</div>;
    if (!tasks.length) return <EmptyState text="No task found for this lead." />;
    return (
      <div>
        <div className="mb-5 flex flex-wrap items-center gap-3">
          <button type="button" className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm font-bold text-slate-700">↕</button>
          <button type="button" className="h-9 rounded-lg border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700">Status⌄</button>
          <button type="button" className="h-9 rounded-lg border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700">Due Date⌄</button>
        </div>
        {Object.entries(groupedTasks).map(([date, list]) => (
          <div key={date}>
            <div className="mb-3 text-sm font-black text-slate-800">{dayHeading(list[0]?.due_at)}</div>
            <div>{list.map((task) => <TaskCard key={task.id} task={task} />)}</div>
          </div>
        ))}
      </div>
    );
  }

  return null;
}
