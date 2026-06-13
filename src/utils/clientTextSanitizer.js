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

function cleanText(value) {
  return REPLACEMENTS.reduce((text, [pattern, replacement]) => text.replace(pattern, replacement), value);
}

function sanitizeNode(node) {
  if (!node) return;

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
