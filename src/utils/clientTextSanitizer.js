const REPLACEMENTS = [
  [/Supabase leads/gi, "leads"],
  [/Supabase data/gi, "CRM data"],
  [/Supabase/gi, "SalesFlow"],
  [/Supadata/gi, "SalesFlow"],
  [/supadata/gi, "SalesFlow"],
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
