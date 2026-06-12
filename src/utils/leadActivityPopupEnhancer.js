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

let started = false;

export function startLeadActivityPopupEnhancer() {
  if (started || typeof window === 'undefined' || typeof document === 'undefined') return;
  started = true;

  const observer = new MutationObserver(() => ensureField());
  const start = () => {
    ensureField();
    observer.observe(document.body, { childList: true, subtree: true });
  };

  document.addEventListener('click', (event) => {
    const target = event.target;
    if (!target) return;
    const button = target.closest?.('button');
    if (!button) return;
    if (!/save activity/i.test(button.textContent || '')) return;
    const root = button.closest('.fixed');
    if (root) appendDateToNote(root);
  }, true);

  if (document.body) start();
  else document.addEventListener('DOMContentLoaded', start, { once: true });
}
