import '../../styles/landingModules.css';

const topModules = [
  { icon: '◎', title: 'Lead Management', text: 'Capture, qualify and move leads with a clean visual pipeline.', stat: '1,250 leads' },
  { icon: '↻', title: 'Activity Tracking', text: 'Calls, meetings, notes and follow-ups organized in one timeline.', stat: 'Live timeline' },
  { icon: '⚙', title: 'Team Control', text: 'Admin and super admin modules stay clean, separate and secure.', stat: 'Role based' },
];

const bottomModules = [
  { icon: '▣', title: 'Resources', text: 'Guides, templates and sales playbooks for faster team setup.' },
  { icon: '₹', title: 'Simple Pricing', text: 'Start free and upgrade only when your team needs more power.' },
  { icon: '★', title: 'About SalesFlow', text: 'A fast CRM made for lead follow-up and sales operations.' },
];

export default function LandingModules({ action, openModal }) {
  return (
    <section id="products" className="landing-shell modules-section">
      <div className="modules-heading">
        <span>BUILT FOR GROWING TEAMS</span>
        <h2>Everything your sales team needs, separated into clean modules.</h2>
        <p>No messy files, no broken buttons and no mixed logic. Each CRM area stays easy to improve and safe to fix.</p>
      </div>

      <div className="module-card-grid primary-modules">
        {topModules.map((item) => (
          <article className="module-card premium-module-card" key={item.title}>
            <div className="module-icon">{item.icon}</div>
            <div>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </div>
            <div className="module-footer-row">
              <span>{item.stat}</span>
              <button onClick={() => action(`${item.title} module opened`)}>Open →</button>
            </div>
          </article>
        ))}
      </div>

      <div className="modules-showcase-card" id="solutions">
        <div className="modules-showcase-copy">
          <span>MODULAR CRM ARCHITECTURE</span>
          <h3>Professional CRM that stays stable as features grow.</h3>
          <p>Landing page, dashboard, admin, super admin, leads and lead activity will stay in separate files so future fixes are fast and safe.</p>
          <button className="btn btn-primary" onClick={() => openModal('Start Free Trial')}>🚀 Start with SalesFlow</button>
        </div>
        <div className="modules-mini-ui" aria-label="CRM module preview">
          <div className="mini-ui-sidebar"><span /><span /><span /></div>
          <div className="mini-ui-panel">
            <div className="mini-ui-top" />
            <div className="mini-ui-grid"><span /><span /><span /></div>
            <div className="mini-ui-line" />
          </div>
        </div>
      </div>

      <div id="resources" className="module-card-grid secondary-modules">
        {bottomModules.map((item) => (
          <article className="module-card small-module-card" key={item.title}>
            <div className="module-icon small">{item.icon}</div>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
            <button onClick={() => action(`${item.title} opened`)}>Explore</button>
          </article>
        ))}
      </div>
    </section>
  );
}
