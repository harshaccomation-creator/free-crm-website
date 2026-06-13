const REPLACEMENTS = [
  [/Supabase leads/gi, "leads"],
  [/Supabase data/gi, "CRM data"],
  [/Supabase/gi, "SalesFlow"],
  [/Supadata/gi, "SalesFlow"],
  [/supadata/gi, "SalesFlow"],
];

const SVG = {
  calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" class="sf-meta-svg"><rect x="3" y="4" width="18" height="18" rx="2"></rect><path d="M16 2v4"></path><path d="M8 2v4"></path><path d="M3 10h18"></path></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" class="sf-meta-svg"><circle cx="12" cy="12" r="9"></circle><path d="M12 7v5l3 2"></path></svg>',
  duration: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" class="sf-meta-svg"><path d="M6 2h12"></path><path d="M6 22h12"></path><path d="M8 2c0 5 8 5 8 10s-8 5-8 10"></path><path d="M16 2c0 5-8 5-8 10s8 5 8 10"></path></svg>',
};

function cleanText(value) {
  return REPLACEMENTS.reduce((text, [pattern, replacement]) => text.replace(pattern, replacement), value);
}

function addTimelineIconStyles() {
  if (document.getElementById('sf-meta-svg-style')) return;
  const style = document.createElement('style');
  style.id = 'sf-meta-svg-style';
  style.textContent = '.sf-meta-svg{width:16px;height:16px;display:inline-block;vertical-align:-3px;margin-right:6px;color:#64748b}.sf-meta-token{display:inline-flex;align-items:center;color:#475569;font-weight:700}';
  document.head.appendChild(style);
}

function replaceTimelineMeta(node) {
  if (!node || node.nodeType !== Node.TEXT_NODE) return false;
  const text = node.nodeValue || '';
  if (!text.includes('🗓') && !text.includes('🕒') && !text.includes('⏳')) return false;
  const html = text
    .replace(/🗓\s*/g, `<span class="sf-meta-token">${SVG.calendar}`)
    .replace(/🕒\s*/g, `<span class="sf-meta-token">${SVG.clock}`)
    .replace(/⏳\s*/g, `<span class="sf-meta-token">${SVG.duration}`);
  const span = document.createElement('span');
  span.innerHTML = html.replace(/&nbsp;/g, ' ');
  node.parentNode?.replaceChild(span, node);
  return true;
}

function sanitizeNode(node) {
  if (!node) return;

  if (replaceTimelineMeta(node)) return;

  if (node.nodeType === Node.TEXT_NODE) {
    const next = cleanText(node.nodeValue || "");
    if (next !== node.nodeValue) node.nodeValue = next;
    return;
  }

  if (node.nodeType !== Node.ELEMENT_NODE) return;

  const element = node;
  if (["SCRIPT", "STYLE", "TEXTAREA", "INPUT"].includes(element.tagName)) return;

  element.childNodes.forEach(sanitizeNode);
}

let observerStarted = false;

export function startClientTextSanitizer() {
  if (typeof window === "undefined" || typeof document === "undefined") return;
  if (observerStarted) return;
  observerStarted = true;

  addTimelineIconStyles();
  const run = () => sanitizeNode(document.body);
  if (document.body) run();
  else document.addEventListener("DOMContentLoaded", run, { once: true });

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach(sanitizeNode);
      if (mutation.type === "characterData") sanitizeNode(mutation.target);
    });
  });

  const start = () => {
    if (!document.body) return;
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });
  };

  if (document.body) start();
  else document.addEventListener("DOMContentLoaded", start, { once: true });
}
