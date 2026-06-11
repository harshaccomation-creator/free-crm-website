export function installLeadActionColumnFix() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  if (window.__salesflowLeadActionColumnFixInstalled) return;
  window.__salesflowLeadActionColumnFixInstalled = true;

  function moveActions() {
    const table = document.querySelector('table.sf-leads-table');
    if (!table) return;

    const headerRow = table.querySelector('thead tr');
    if (headerRow && headerRow.children.length === 5) {
      const th = document.createElement('th');
      th.textContent = 'Action';
      th.className = 'w-[80px] font-black text-center';
      headerRow.appendChild(th);
    }

    table.querySelectorAll('tbody tr').forEach((row) => {
      const cells = row.children;
      if (!cells || cells.length < 1) return;

      const firstCell = cells[0];
      const actionWrap = firstCell.querySelector('.relative.shrink-0');
      if (!actionWrap) return;

      let actionCell = row.querySelector('td[data-sf-action-cell="true"]');
      if (!actionCell) {
        actionCell = document.createElement('td');
        actionCell.setAttribute('data-sf-action-cell', 'true');
        actionCell.className = 'relative px-4 py-4 text-center';
        row.appendChild(actionCell);
      }

      actionWrap.style.marginLeft = 'auto';
      actionWrap.style.display = 'inline-flex';
      actionWrap.style.justifyContent = 'center';
      actionCell.appendChild(actionWrap);
    });

    table.querySelectorAll('tbody td[colspan="5"]').forEach((td) => {
      td.setAttribute('colspan', '6');
    });
  }

  const observer = new MutationObserver(moveActions);
  observer.observe(document.body, { childList: true, subtree: true });
  window.addEventListener('salesflow:navigate', () => setTimeout(moveActions, 0));
  window.addEventListener('load', moveActions);
  setInterval(moveActions, 800);
  moveActions();
}
