export function installLeadActionColumnFix() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  if (window.__salesflowLeadActionColumnFixInstalled) return;
  window.__salesflowLeadActionColumnFixInstalled = true;

  function ensureActionHeader(table) {
    const headerRow = table.querySelector('thead tr');
    if (!headerRow) return;

    const headers = Array.from(headerRow.children);
    const hasAction = headers.some((th) => String(th.textContent || '').trim().toLowerCase() === 'action');
    if (!hasAction) {
      const th = document.createElement('th');
      th.textContent = 'ACTION';
      th.className = 'w-[80px] font-black text-center';
      headerRow.appendChild(th);
    }
  }

  function findActionWrap(firstCell) {
    const candidates = Array.from(firstCell.querySelectorAll('button'));
    const button = candidates.find((btn) => {
      const text = String(btn.textContent || '').trim();
      const title = String(btn.getAttribute('title') || '').toLowerCase();
      return text === '⋯' || text === '...' || title.includes('lead actions');
    });
    if (!button) return null;
    return button.parentElement || button;
  }

  function makeActionCell(row) {
    let actionCell = row.querySelector('td[data-sf-action-cell="true"]');
    if (!actionCell) {
      actionCell = document.createElement('td');
      actionCell.setAttribute('data-sf-action-cell', 'true');
      actionCell.className = 'relative px-4 py-4 text-center';
      actionCell.style.textAlign = 'center';
      actionCell.style.verticalAlign = 'middle';
      row.appendChild(actionCell);
    }
    return actionCell;
  }

  function moveActions() {
    const table = document.querySelector('table.sf-leads-table');
    if (!table) return;

    ensureActionHeader(table);

    table.querySelectorAll('tbody tr').forEach((row) => {
      const firstCell = row.children && row.children[0];
      if (!firstCell || firstCell.getAttribute('colspan')) return;

      const actionWrap = findActionWrap(firstCell);
      if (!actionWrap) return;

      const actionCell = makeActionCell(row);
      actionWrap.style.marginLeft = '0';
      actionWrap.style.display = 'inline-flex';
      actionWrap.style.justifyContent = 'center';
      actionWrap.style.alignItems = 'center';
      actionCell.appendChild(actionWrap);
    });

    table.querySelectorAll('tbody td[colspan="5"]').forEach((td) => {
      td.setAttribute('colspan', '6');
    });

    window.__salesflowLeadActionColumnFixLastRun = Date.now();
  }

  const observer = new MutationObserver(() => requestAnimationFrame(moveActions));
  observer.observe(document.body, { childList: true, subtree: true });
  window.addEventListener('salesflow:navigate', () => setTimeout(moveActions, 50));
  window.addEventListener('load', moveActions);
  setInterval(moveActions, 300);
  setTimeout(moveActions, 0);
  setTimeout(moveActions, 300);
  setTimeout(moveActions, 1000);
}
