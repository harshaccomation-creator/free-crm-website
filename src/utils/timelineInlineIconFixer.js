const ICONS = {
  calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" class="sf-meta-svg"><rect x="3" y="4" width="18" height="18" rx="2"></rect><path d="M16 2v4"></path><path d="M8 2v4"></path><path d="M3 10h18"></path></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" class="sf-meta-svg"><circle cx="12" cy="12" r="9"></circle><path d="M12 7v5l3 2"></path></svg>',
  duration: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" class="sf-meta-svg"><path d="M6 2h12"></path><path d="M6 22h12"></path><path d="M8 2c0 5 8 5 8 10s-8 5-8 10"></path><path d="M16 2c0 5-8 5-8 10s8 5 8 10"></path></svg>',
};

function addStyle() {
  if (document.getElementById('sf-timeline-inline-icon-style')) return;
  const style = document.createElement('style');
  style.id = 'sf-timeline-inline-icon-style';
  style.textContent = `
    .sf-meta-svg{width:16px;height:16px;display:inline-block;vertical-align:-3px;margin-right:6px;color:#64748b;}
    .sf-meta-text{display:inline-flex;align-items:center;gap:0;color:#475569;font-weight:700;}
  `;
  document.head.appendChild(style);
}

function replaceMetaLine(node) {
  if (!node || node.nodeType !== 3) return;
  const text = node.nodeValue || '';
  if (!text.includes('🗓') && !text.includes('🕒') && !text.includes('⏳')) return;

  const safe = text
    .replace(/🗓\s*/g, `<span class="sf-meta-text">${ICONS.calendar}`)
    .replace(/🕒\s*/g, `</span><span class="mx-2 text-slate-400">|</span><span class="sf-meta-text">${ICONS.clock}`)
    .replace(/⏳\s*/g, `</span><span class="mx-2 text-slate-400">|</span><span class="sf-meta-text">${ICONS.duration}`);

  const span = document.createElement('span');
  span.innerHTML = safe + '</span>';
  node.parentNode?.replaceChild(span, node);
}

function scan(root = document.body) {
  if (!root) return;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  nodes.forEach(replaceMetaLine);
}

export function startTimelineInlineIconFixer() {
  if (typeof window === 'undefined') return;
  addStyle();
  window.setTimeout(() => scan(), 250);
  const observer = new MutationObserver(() => scan());
  observer.observe(document.body, { childList: true, subtree: true });
}
