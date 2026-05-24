import '../../styles/landingFooter.css';

const footerGroups = [
  {
    title: 'CRM Workspace',
    links: ['Lead Inbox', 'Follow-up Hub', 'Deal Pipeline', 'Activity Notes', 'Task Board', 'Reports Studio'],
  },
  {
    title: 'Sales Tools',
    links: ['Lead Form Builder', 'Reminder Calendar', 'Quote Tracker', 'WhatsApp Follow-up', 'Email Templates', 'Sales Checklist'],
  },
  {
    title: 'Business',
    links: ['Why SalesFlow', 'Roadmap', 'Release Notes', 'Security', 'Integrations', 'Contact Team'],
  },
  {
    title: 'Support',
    links: ['Help Center', 'Setup Guide', 'Admin Guide', 'Super Admin Guide', 'Training', 'Partner Program'],
  },
];

export default function LandingFooter({ openModal }) {
  return (
    <footer className="salesflow-footer" id="footer">
      <section className="salesflow-cta-panel">
        <div className="landing-shell salesflow-cta-card">
          <div className="cta-copy-block">
            <span className="footer-kicker">SALESFLOW NEXT STEP</span>
            <h2>Turn every lead into a clear next action.</h2>
            <p>One clean CRM for follow-ups, lead activity, team tasks, admin control and revenue visibility — built for growing sales teams.</p>
          </div>
          <div className="cta-action-card">
            <span>Launch faster</span>
            <strong>7 days free trial</strong>
            <button className="btn btn-primary" onClick={() => openModal('Book a Demo')}>📅 Schedule Demo</button>
            <button className="btn footer-outline" onClick={() => openModal('Start Free Trial')}>🚀 Start Trial</button>
          </div>
        </div>
      </section>

      <section className="salesflow-footer-links">
        <div className="landing-shell footer-brand-row">
          <div>
            <strong>SalesFlow CRM</strong>
            <span>Lead follow-ups, activity tracking and sales operations in one workspace.</span>
          </div>
          <button onClick={() => openModal('Customer Support')}>💬 Talk to Support</button>
        </div>

        <div className="landing-shell footer-grid">
          {footerGroups.map((group) => (
            <div className="footer-col" key={group.title}>
              <h3>{group.title}</h3>
              {group.links.map((link) => (
                <button key={link} onClick={() => openModal(link)}>{link}</button>
              ))}
            </div>
          ))}
        </div>

        <div className="landing-shell footer-bottom">
          <span>© 2026 SalesFlow. All rights reserved.</span>
          <div>
            <button onClick={() => openModal('Privacy')}>Privacy</button>
            <button onClick={() => openModal('Terms')}>Terms</button>
            <button onClick={() => openModal('Status')}>Status</button>
          </div>
        </div>
      </section>
    </footer>
  );
}
