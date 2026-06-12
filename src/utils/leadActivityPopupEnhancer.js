import { supabase } from '../services/crmApi.js';

function pad(value) {
  return String(value).padStart(2, '0');
}

function defaultDateTimeLocal() {
  const date = new Date(Date.now() + 2 * 60 * 60 * 1000);
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function dispatchInput(element) {
  element.dispatchEvent(new Event('input', { bubbles: true }));
  element.dispatchEvent(new Event('change', { bubbles: true }));
}

function getDisposition(root) {
  const selects = root.querySelectorAll('select');
  return selects?.[0]?.value || '';
}

function needsDate(disposition) {
  return ['Call Connected', 'Follow Up', 'Demo Book', 'Demo Done', 'Post Demo Follow Up'].includes(disposition);
}

function ensureField() {
  const root = document.querySelector('.fixed.inset-0.z-\\[9999\\]') || document.querySelector('.fixed.inset-0');
  if (!root || root.querySelector('[data-sf-activity-datetime]')) return;

  const disposition = getDisposition(root);
  const textarea = root.querySelector('textarea');
  if (!textarea) return;

  const wrapper = document.createElement('label');
  wrapper.setAttribute('data-sf-activity-datetime', 'true');
  wrapper.className = 'block';
  wrapper.innerHTML = `
    <span class="text-xs font-black uppercase tracking-wide text-slate-500">Task / Reminder Date Time</span>
    <input type="datetime-local" value="${needsDate(disposition) ? defaultDateTimeLocal() : ''}" class="mt-1 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm font-bold outline-none focus:ring-2 focus:ring-orange-500/20" />
    <p class="mt-1 text-xs font-semibold text-slate-500">Task time se 15 minutes pehle email reminder trigger hoga.</p>
  `;

  textarea.closest('label')?.before(wrapper);
}

function appendDateToNote(root) {
  const input = root.querySelector('[data-sf-activity-datetime] input');
  const textarea = root.querySelector('textarea');
  if (!input || !textarea || !input.value) return;

  const iso = new Date(input.value).toISOString();
  const line = `Task Date Time: ${iso}`;
  if (textarea.value.includes('Task Date Time:')) return;

  const setter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value')?.set;
  const next = `${textarea.value ? `${textarea.value}\n` : ''}${line}`;
  if (setter) setter.call(textarea, next);
  else textarea.value = next;
  dispatchInput(textarea);
}

function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
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
  const dateKey = date.toDateString();
  if (dateKey === today.toDateString()) return `Today, ${formatDate(value)}`;
  return formatDate(value);
}

function relativeTime(value) {
  const diff = Date.now() - dateObj(value).getTime();
  const mins = Math.max(0, Math.round(diff / 60000));
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins} mins ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours} hours ago`;
  const days = Math.round(hours / 24);
  return `${days} days ago`;
}

function currentLeadId() {
  const parts = window.location.pathname.split('/').filter(Boolean);
  return parts[parts.length - 1] || '';
}

function activeTabName() {
  const section = document.getElementById('lead-activity-section');
  const buttons = section ? [...section.querySelectorAll('button')] : [];
  const active = buttons.find((button) => /border-orange|text-slate-900/.test(button.className || ''));
  return active?.textContent?.trim()?.replace(/\d+$/, '')?.trim() || '';
}

function findTabContent() {
  const section = document.getElementById('lead-activity-section');
  return section?.querySelector('.p-6') || null;
}

function findTasksPlaceholder() {
  return [...document.querySelectorAll('div')].find((node) =>
    /Tasks are managed from Tasks page/i.test(node.textContent || '')
  );
}

function setTabBadge(tabLabel, count) {
  const section = document.getElementById('lead-activity-section');
  if (!section) return;
  const button = [...section.querySelectorAll('button')].find((item) => (item.textContent || '').trim().startsWith(tabLabel));
  if (!button || button.querySelector('[data-sf-tab-badge]')) return;
  const badge = document.createElement('span');
  badge.dataset.sfTabBadge = '1';
  badge.className = 'ml-2 inline-grid min-w-5 h-5 place-items-center rounded-full bg-red-600 px-1 text-[11px] font-black text-white';
  badge.textContent = String(count || 0);
  button.appendChild(badge);
}

function taskIcon(status = '') {
  const done = String(status).toLowerCase() === 'completed';
  return `<div class="relative z-10 grid h-9 w-9 place-items-center rounded-xl bg-blue-50 text-blue-600 shadow-sm">📅${done ? '<span class="absolute -right-1 -bottom-1 grid h-4 w-4 place-items-center rounded-full bg-green-500 text-[10px] text-white">✓</span>' : ''}</div>`;
}

function activityIcon(type = '') {
  const key = String(type || '').toLowerCase();
  const icon = key.includes('call') ? '☎️' : key.includes('demo') ? '📅' : key.includes('won') ? '🏆' : key.includes('task') ? '✅' : key.includes('note') ? '📝' : key.includes('not') ? '⚠️' : '⚡';
  return `<div class="relative z-10 grid h-9 w-9 place-items-center rounded-xl bg-orange-50 text-orange-600 shadow-sm">${icon}</div>`;
}

function statusBadge(status = '') {
  const key = String(status).toLowerCase();
  const cls = key === 'completed' || key === 'won' ? 'bg-green-50 text-green-700' : key.includes('over') || key.includes('lost') ? 'bg-red-50 text-red-700' : 'bg-orange-50 text-orange-700';
  return `<span class="rounded-lg px-3 py-1 text-xs font-black ${cls}">${escapeHtml(status || 'Pending')}</span>`;
}

function groupByDay(items, dateField) {
  return items.reduce((groups, item) => {
    const key = formatDate(item[dateField]);
    if (!groups[key]) groups[key] = [];
    groups[key].push(item);
    return groups;
  }, {});
}

function taskCard(task) {
  const owner = task.owner?.full_name || task.owner?.email || 'Not assigned';
  const added = task.created_by_profile?.full_name || task.created_by_profile?.email || owner;
  return `
    <div class="relative flex gap-4">
      <div class="flex w-10 flex-col items-center">
        ${taskIcon(task.status)}
        <div class="h-full w-px bg-slate-200"></div>
      </div>
      <div class="mb-4 flex-1 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div class="flex items-start justify-between gap-3">
          <div>
            <p class="text-base font-black text-slate-900">${escapeHtml(task.title || 'Task')}</p>
            <p class="mt-2 text-sm font-semibold text-slate-600">🗓 ${escapeHtml(formatDate(task.due_at))} &nbsp; | &nbsp; 🕒 ${escapeHtml(formatTime(task.due_at))} &nbsp; | &nbsp; ⏳ 30m</p>
          </div>
          ${statusBadge(task.status || 'Pending')}
        </div>
        <div class="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-500">
          <span class="rounded-md bg-slate-100 px-2 py-1 font-bold text-slate-700">${escapeHtml(owner)}</span>
          <span>Added By ${escapeHtml(added)} &nbsp; | &nbsp; ${escapeHtml(formatDateTime(task.created_at))} &nbsp; • &nbsp; ${escapeHtml(relativeTime(task.created_at))}</span>
        </div>
        ${task.note ? `<p class="mt-3 whitespace-pre-line text-sm text-slate-500">${escapeHtml(task.note)}</p>` : ''}
      </div>
    </div>
  `;
}

function activityCard(item) {
  const actor = item.user?.full_name || item.user?.email || 'Not assigned';
  const typeLabel = String(item.type || 'Activity').replaceAll('_', ' ');
  const activityAt = item.activity_at || item.created_at;
  return `
    <div class="relative flex gap-4">
      <div class="flex w-10 flex-col items-center">
        ${activityIcon(item.type)}
        <div class="h-full w-px bg-slate-200"></div>
      </div>
      <div class="mb-4 flex-1 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div class="flex items-start justify-between gap-3">
          <div>
            <p class="text-base font-black text-slate-900">${escapeHtml(item.title || typeLabel)}</p>
            <p class="mt-2 text-sm font-semibold text-slate-600">🗓 ${escapeHtml(formatDate(activityAt))} &nbsp; | &nbsp; 🕒 ${escapeHtml(formatTime(activityAt))}</p>
          </div>
          ${statusBadge(typeLabel)}
        </div>
        ${item.note ? `<p class="mt-3 whitespace-pre-line text-sm text-slate-600">${escapeHtml(item.note)}</p>` : ''}
        <div class="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-500">
          <span class="rounded-md bg-slate-100 px-2 py-1 font-bold text-slate-700">${escapeHtml(actor)}</span>
          <span>Added By ${escapeHtml(actor)} &nbsp; | &nbsp; ${escapeHtml(formatDateTime(item.created_at || activityAt))} &nbsp; • &nbsp; ${escapeHtml(relativeTime(item.created_at || activityAt))}</span>
        </div>
      </div>
    </div>
  `;
}

async function renderLeadTasks(force = false) {
  const placeholder = findTasksPlaceholder();
  const content = findTabContent();
  const leadId = currentLeadId();
  if (!leadId) return;
  if (!placeholder && activeTabName() !== 'Tasks') return;
  const target = placeholder || content;
  if (!target || (target.dataset.sfTasksLoaded === '1' && !force)) return;

  target.dataset.sfTasksLoaded = '1';
  target.innerHTML = '<div class="text-slate-500 font-bold">Loading lead tasks...</div>';

  try {
    const { data, error } = await supabase
      .from('tasks')
      .select('id,title,type,status,due_at,note,created_at,owner:profiles!tasks_owner_id_fkey(full_name,email),created_by_profile:profiles!tasks_created_by_fkey(full_name,email)')
      .eq('lead_id', leadId)
      .order('due_at', { ascending: true });

    if (error) throw error;
    const tasks = data || [];
    setTabBadge('Tasks', tasks.length);

    if (!tasks.length) {
      target.innerHTML = '<div class="rounded-lg border border-dashed border-slate-200 p-6 text-center text-slate-500 font-semibold">No task found for this lead.</div>';
      return;
    }

    const groups = groupByDay(tasks, 'due_at');
    target.className = 'p-6';
    target.innerHTML = `
      <div class="mb-5 flex flex-wrap items-center gap-3">
        <button class="h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm font-bold text-slate-700">↕</button>
        <button class="h-9 rounded-lg border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700">Status⌄</button>
        <button class="h-9 rounded-lg border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700">Due Date⌄</button>
      </div>
      ${Object.entries(groups).map(([date, list]) => `
        <div class="mb-3 text-sm font-black text-slate-800">${escapeHtml(dayHeading(list[0]?.due_at || date))}</div>
        <div class="relative">${list.map(taskCard).join('')}</div>
      `).join('')}
    `;
  } catch (error) {
    target.innerHTML = `<div class="rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700">Task load failed: ${escapeHtml(error.message || 'Unknown error')}</div>`;
  }
}

async function renderLeadActivities(force = false) {
  const content = findTabContent();
  const leadId = currentLeadId();
  if (!content || !leadId || activeTabName() !== 'Activity Timeline') return;
  if (content.dataset.sfActivitiesLoaded === '1' && !force) return;

  content.dataset.sfActivitiesLoaded = '1';
  content.innerHTML = '<div class="text-slate-500 font-bold">Loading activity timeline...</div>';

  try {
    const { data, error } = await supabase
      .from('lead_activities')
      .select('id,type,title,note,activity_at,created_at,user:profiles!lead_activities_user_id_fkey(full_name,email)')
      .eq('lead_id', leadId)
      .order('activity_at', { ascending: false });

    if (error) throw error;
    const activities = data || [];
    setTabBadge('Activity Timeline', activities.length);

    if (!activities.length) {
      content.innerHTML = '<div class="rounded-lg border border-dashed border-slate-200 p-6 text-center text-slate-500 font-semibold">No activity found for this lead.</div>';
      return;
    }

    const groups = groupByDay(activities, 'activity_at');
    content.className = 'p-6';
    content.innerHTML = Object.entries(groups).map(([date, list]) => `
      <div class="mb-3 text-sm font-black text-slate-800">${escapeHtml(dayHeading(list[0]?.activity_at || date))}</div>
      <div class="relative">${list.map(activityCard).join('')}</div>
    `).join('');
  } catch (error) {
    content.innerHTML = `<div class="rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700">Activity load failed: ${escapeHtml(error.message || 'Unknown error')}</div>`;
  }
}

let started = false;

export function startLeadActivityPopupEnhancer() {
  if (started || typeof window === 'undefined' || typeof document === 'undefined') return;
  started = true;

  const observer = new MutationObserver(() => {
    ensureField();
    renderLeadTasks();
    renderLeadActivities();
  });
  const start = () => {
    ensureField();
    renderLeadTasks();
    renderLeadActivities();
    observer.observe(document.body, { childList: true, subtree: true });
  };

  document.addEventListener('click', (event) => {
    const target = event.target;
    if (!target) return;
    const button = target.closest?.('button');
    if (!button) return;
    const text = button.textContent?.trim() || '';
    if (/^tasks/i.test(text)) {
      setTimeout(() => renderLeadTasks(true), 80);
      return;
    }
    if (/^activity timeline/i.test(text)) {
      setTimeout(() => renderLeadActivities(true), 80);
      return;
    }
    if (!/save activity/i.test(text)) return;
    const root = button.closest('.fixed');
    if (root) appendDateToNote(root);
    setTimeout(() => {
      renderLeadActivities(true);
      renderLeadTasks(true);
    }, 900);
  }, true);

  if (document.body) start();
  else document.addEventListener('DOMContentLoaded', start, { once: true });
}
