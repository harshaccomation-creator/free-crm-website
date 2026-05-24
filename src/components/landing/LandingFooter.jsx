import '../../styles/landingFooter.css';

const footerGroups = [
  {
    title: 'Popular Features',
    links: ['Lead Management', 'Follow-up Tracker', 'Activity Timeline', 'Pipeline Board', 'Reports Dashboard', 'Team Tasks'],
  },
  {
    title: 'Free Tools',
    links: ['Lead Capture Form', 'Follow-up Calendar', 'Deal Calculator', 'CRM Templates', 'Email Reminder Tool', 'Sales Scripts'],
  },
  {
    title: 'Company',
    links: ['About SalesFlow', 'Careers', 'Management Team', 'Product Roadmap', 'Blog', 'Contact Sales'],
  },
  {
    title: 'Customers',
    links: ['Customer Support', 'Join User Group', 'Partners', 'Agency CRM', 'Sales Teams', 'Admin Portal'],
  },
];

export default function LandingFooter({ action, openModal }) {
  return (
    <footer className="premium-footer" id="footer">
      <section className="footer-cta">
        <div className="landing-shell footer-cta-inner">
          <div>
            <span className="footer-kicker">Ready to grow?</span>
            <h2>Make follow-ups faster, cleaner and impossible to miss with SalesFlow.</h2>
            <p>Start with a simple CRM workspace and upgrade into leads, activity, admin and super admin modules as your team grows.</p>
          </div>
          <div className="footer-cta-actions">
            <button className="btn btn-primary" onClick={() => openModal('Book a Demo')}>📅 Get a Demo</button>
            <button className="btn footer-outline" onClick={() => openModal('Start Free Trial')}>🚀 Start Free Trial</button>
          </div>
        </div>
      </section>

      <section className="footer-links-section">
        <div className="landing-shell footer-grid">
          {footerGroups.map((group) => (
            <div className="footer-col" key={group.title}>
              <h3>{group.title}</h3>
              {group.links.map((link) => (
                <button key={link} onClick={() => action(`${link} opened`)}>{link}</button>
              ))}
            </div>
          ))}
        </div>
        <div className="landing-shell footer-bottom">
          <strong>SalesFlow CRM</strong>
          <span>© 2026 SalesFlow. Built for lead follow-ups and sales operations.</span>
          <button onClick={() => openModal('Customer Support')}>💬 Support</button>
        </div>
      </section>
    </footer>
  );
}
