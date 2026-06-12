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

function formatDue(value) {
  if (!value) return 'No due time';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

function currentLeadId() {
  const parts = window.location.pathname.split('/').filter(Boolean);
  return parts[parts.length - 1] || '';
}

function findTasksPlaceholder() {
  return [...document.querySelectorAll('div')].find((node) =>
    /Tasks are managed from Tasks page/i.test(node.textContent || '')
  );
}

async function renderLeadTasks() {
  const placeholder = findTasksPlaceholder();
  if (!placeholder || placeholder.dataset.sfTasksLoaded === '1') return;
  const leadId = currentLeadId();
  if (!leadId) return;

  placeholder.dataset.sfTasksLoaded = '1';
  placeholder.innerHTML = '<div class="text-slate-500 font-bold">Loading lead tasks...</div>';

  try {
    const { data, error } = await supabase
      .from('tasks')
      .select('id,title,type,status,due_at,note,created_at')
      .eq('lead_id', leadId)
      .order('due_at', { ascending: true });

    if (error) throw error;
    const tasks = data || [];

    if (!tasks.length) {
      placeholder.innerHTML = '<div class="rounded-lg border border-dashed border-slate-200 p-6 text-center text-slate-500 font-semibold">No task found for this lead.</div>';
      return;
    }

    placeholder.className = 'space-y-3';
    placeholder.innerHTML = tasks.map((task) => `
      <div class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div class="flex items-start justify-between gap-3">
          <div>
            <p class="text-sm font-black text-slate-900">${escapeHtml(task.title || 'Task')}</p>
            <p class="mt-1 text-sm font-semibold text-slate-600">${escapeHtml(task.type || 'Task')} · Due: ${escapeHtml(formatDue(task.due_at))}</p>
            ${task.note ? `<p class="mt-2 text-sm text-slate-500 whitespace-pre-line">${escapeHtml(task.note)}</p>` : ''}
          </div>
          <span class="rounded-lg bg-orange-50 px-3 py-1 text-xs font-black text-orange-700">${escapeHtml(task.status || 'Pending')}</span>
        </div>
      </div>
    `).join('');
  } catch (error) {
    placeholder.innerHTML = `<div class="rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700">Task load failed: ${escapeHtml(error.message || 'Unknown error')}</div>`;
  }
}

let started = false;

export function startLeadActivityPopupEnhancer() {
  if (started || typeof window === 'undefined' || typeof document === 'undefined') return;
  started = true;

  const observer = new MutationObserver(() => {
    ensureField();
    renderLeadTasks();
  });
  const start = () => {
    ensureField();
    renderLeadTasks();
    observer.observe(document.body, { childList: true, subtree: true });
  };

  document.addEventListener('click', (event) => {
    const target = event.target;
    if (!target) return;
    const button = target.closest?.('button');
    if (!button) return;
    if (/^tasks$/i.test(button.textContent?.trim() || '')) {
      setTimeout(renderLeadTasks, 50);
      return;
    }
    if (!/save activity/i.test(button.textContent || '')) return;
    const root = button.closest('.fixed');
    if (root) appendDateToNote(root);
  }, true);

  if (document.body) start();
  else document.addEventListener('DOMContentLoaded', start, { once: true });
}
