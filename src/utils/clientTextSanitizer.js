const REPLACEMENTS = [
  [/Supabase leads/gi, "leads"],
  [/Supabase data/gi, "CRM data"],
  [/Supabase/gi, "SalesFlow"],
  [/Supadata/gi, "SalesFlow"],
  [/supadata/gi, "SalesFlow"],

  // CRM label and badge capitalization fixes
  [/\bemail\b/g, "Email"],
  [/\bfollow up\b/g, "Follow Up"],
  [/\bfollow-up\b/g, "Follow-Up"],
  [/\bpost demo follow up\b/g, "Post Demo Follow Up"],
  [/\bpost demo follow-up\b/g, "Post Demo Follow-Up"],
  [/\bdemo book\b/g, "Demo Book"],
  [/\bdemo booked\b/g, "Demo Booked"],
  [/\bdemo scheduled\b/g, "Demo Scheduled"],
  [/\bdemo done\b/g, "Demo Done"],
  [/\bcall connected\b/g, "Call Connected"],
  [/\bnot connected\b/g, "Not Connected"],
  [/\bswitch off\b/g, "Switch Off"],
  [/\bwarm follow up\b/g, "Warm Follow Up"],
  [/\bpayment discussion\b/g, "Payment Discussion"],
  [/\bqualified\b/g, "Qualified"],
  [/\bpending\b/g, "Pending"],
  [/\bcompleted\b/g, "Completed"],
  [/\boverdue\b/g, "Overdue"],
  [/\bwon\b/g, "Won"],
  [/\blost\b/g, "Lost"],
  [/\bjunk\b/g, "Junk"],
];

const TIMELINE_EMOJI_ICON_SVG = {
  '🎥': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" class="sf-left-timeline-svg"><path d="M15 10.5 21 7v10l-6-3.5V17a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v3.5z"></path></svg>',
  '🎬': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" class="sf-left-timeline-svg"><path d="M4 11h16v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8z"></path><path d="M4 11 6 3h12l2 8"></path><path d="M8 3l-2 8"></path><path d="M14 3l-2 8"></path></svg>',
  '📝': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" class="sf-left-timeline-svg"><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><path d="M14 3v6h6"></path><path d="M8 13h8"></path><path d="M8 17h5"></path></svg>',
  '📄': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" class="sf-left-timeline-svg"><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><path d="M14 3v6h6"></path></svg>',
  '⏰': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" class="sf-left-timeline-svg"><circle cx="12" cy="13" r="8"></circle><path d="M12 9v4l3 2"></path><path d="M5 3 2 6"></path><path d="M19 3l3 3"></path></svg>',
  '⚠️': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" class="sf-left-timeline-svg"><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"></path><path d="M12 9v4"></path><path d="M12 17h.01"></path></svg>',
  '⚡': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" class="sf-left-timeline-svg"><path d="M13 2 3 14h8l-1 8 11-14h-8l0-6z"></path></svg>',
};

function cleanText(value) {
  return REPLACEMENTS.reduce((text, [pattern, replacement]) => text.replace(pattern, replacement), value);
}

function addLeftTimelineIconStyle() {
  if (document.getElementById('sf-left-timeline-svg-style')) return;
  const style = document.createElement('style');
  style.id = 'sf-left-timeline-svg-style';
  style.textContent = '.sf-left-timeline-svg{width:16px;height:16px;display:block;color:#f97316}';
  document.head.appendChild(style);
}

function replaceTimelineEmojiIcon(node) {
  if (!node || node.nodeType !== Node.TEXT_NODE) return false;
  const text = (node.nodeValue || '').trim();
  const svg = TIMELINE_EMOJI_ICON_SVG[text];
  if (!svg) return false;
  const span = document.createElement('span');
  span.innerHTML = svg;
  node.parentNode?.replaceChild(span.firstChild, node);
  return true;
}

function sanitizeNode(node) {
  if (!node) return;

  if (replaceTimelineEmojiIcon(node)) return;

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

  addLeftTimelineIconStyle();
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
