import DashboardSidebar from '../dashboard/DashboardSidebar.jsx';
import '../../styles/salesflowSaasModules.css';

export function goTo(path) {
  window.history.pushState({}, '', path);
  window.dispatchEvent(new Event('salesflow:navigate'));
}

export function SaasLayout({ role = 'employee', kicker = 'SalesFlow Hub', title, subtitle, actions, children }) {
  return (
    <div className="saas-page">
      <DashboardSidebar role={role} />
      <main className="saas-main">
        <div className="saas-wrap">
          <header className="saas-head">
            <div>
              <span className="saas-kicker">{kicker}</span>
              <h1>{title}</h1>
              {subtitle ? <p>{subtitle}</p> : null}
            </div>
            {actions ? <div className="saas-actions">{actions}</div> : null}
          </header>
          {children}
        </div>
      </main>
    </div>
  );
}

export function SaasStats({ items = [] }) {
  return (
    <section className="saas-grid">
      {items.map((item) => (
        <article className="saas-card saas-stat" key={item.label}>
          <span className="saas-icon">{item.icon || '•'}</span>
          <div>
            <p>{item.label}</p>
            <strong>{item.value}</strong>
          </div>
        </article>
      ))}
    </section>
  );
}

export function SaasEmpty({ title = 'No records found', text = 'Create your first record to get started.', action }) {
  return <div className="saas-empty"><h3>{title}</h3><p>{text}</p>{action}</div>;
}
