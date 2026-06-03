/** Shared empty and loading patterns for CRM pages (orange SaaS theme). */

export function CrmLoadingPanel({ label = 'Loading...', compact = false, className = '' }) {
  return (
    <div className={`crm-loading-panel${compact ? ' crm-loading-panel--compact' : ''}${className ? ` ${className}` : ''}`} role="status" aria-live="polite">
      <span className="crm-spinner" aria-hidden="true" />
      <p>{label}</p>
    </div>
  );
}

export function CrmEmptyState({ title = 'No records yet', text = 'Create your first record to get started.', action, icon = '📋' }) {
  return (
    <div className="crm-empty-state">
      <span className="crm-empty-icon" aria-hidden="true">{icon}</span>
      <h3>{title}</h3>
      <p>{text}</p>
      {action}
    </div>
  );
}

export function CrmTableEmpty({ colSpan = 6, title = 'No records found', text }) {
  return (
    <tr className="crm-table-empty-row">
      <td colSpan={colSpan}>
        <CrmEmptyState title={title} text={text} icon="🔍" />
      </td>
    </tr>
  );
}

export function CrmPageSkeleton({ cards = 4 }) {
  return (
    <div className="crm-page-skeleton" aria-hidden="true">
      <div className="crm-skeleton-bar" />
      <div className={`crm-skeleton-grid cols-${Math.min(cards, 4)}`}>
        {Array.from({ length: cards }, (_, i) => (
          <div className="crm-skeleton-card" key={i} />
        ))}
      </div>
      <div className="crm-skeleton-panel" />
    </div>
  );
}
