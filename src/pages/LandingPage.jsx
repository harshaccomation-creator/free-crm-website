import '../styles/landingPage.css';

const navItems = ['Products', 'Solutions', 'Resources', 'Pricing', 'About'];
const stats = [
  { label: 'Total Leads', value: '1,250', trend: '+12.5%' },
  { label: 'Qualified', value: '540', trend: '+8.2%' },
  { label: 'Deals Won', value: '320', trend: '+15.7%' },
];
const actions = ['Call with new lead', 'Follow-up with Raj', 'Send proposal'];

export default function LandingPage() {
  return (
    <div className="landing-page">
      <header className="landing-top-strip">
        <div className="landing-container top-strip-inner">
          <div className="top-links">
            <span>English</span>
            <span>High Contrast</span>
          </div>
          <div className="top-links right">
            <span>Customer Support</span>
            <span>Contact Sales</span>
            <span>Log in</span>
          </div>
        </div>
      </header>

      <nav className="landing-navbar">
        <div className="landing-container navbar-inner">
          <a className="brand" href="#top" aria-label="SalesFlow home">
            <span className="brand-icon">S</span>
            <span>Sales<span>Flow</span></span>
          </a>

          <div className="nav-links" aria-label="Main navigation">
            {navItems.map((item) => (
              <a href={`#${item.toLowerCase()}`} key={item}>{item}</a>
            ))}
          </div>

          <div className="nav-actions">
            <a className="btn ghost" href="#demo">Book a Demo</a>
            <a className="btn solid" href="#trial">Start Free Trial <small>7 Days Free Trial</small></a>
          </div>
        </div>
      </nav>

      <main id="top" className="hero-section">
        <div className="landing-container hero-grid">
          <section className="hero-copy">
            <p className="eyebrow">All-in-one CRM platform</p>
            <h1>Where Sales Teams <span>Close More.</span> Faster.</h1>
            <p className="hero-text">Manage leads, automate follow-ups, close deals and grow your revenue with SalesFlow CRM.</p>

            <div className="hero-features" aria-label="Key benefits">
              <div><strong>Capture More Leads</strong><span>From every channel</span></div>
              <div><strong>Automate Follow-ups</strong><span>Never miss a lead</span></div>
              <div><strong>Close More Deals</strong><span>With smart insights</span></div>
            </div>

            <div className="hero-buttons">
              <a className="btn solid large" href="#trial">Start 7 Days Free Trial</a>
              <a className="btn outline large" href="#demo">View Live Demo</a>
            </div>
          </section>

          <section className="crm-preview" aria-label="CRM dashboard preview">
            <aside className="preview-sidebar">
              <strong>SalesFlow</strong>
              {['Dashboard', 'Leads', 'Deals', 'Contacts', 'Tasks', 'Reports', 'Settings'].map((item) => (
                <span className={item === 'Dashboard' ? 'active' : ''} key={item}>{item}</span>
              ))}
            </aside>

            <div className="preview-panel">
              <div className="preview-header">
                <div>
                  <small>Good morning, Aman</small>
                  <h3>Sales Overview</h3>
                </div>
                <span>May 1 - May 31</span>
              </div>

              <div className="stat-grid">
                {stats.map((stat) => (
                  <article className="stat-card" key={stat.label}>
                    <span>{stat.label}</span>
                    <strong>{stat.value}</strong>
                    <small>{stat.trend}</small>
                  </article>
                ))}
              </div>

              <div className="chart-card">
                <span>Sales Overview</span>
                <div className="line-chart" />
              </div>
            </div>

            <div className="task-card">
              <strong>Upcoming Tasks</strong>
              {actions.map((item) => <span key={item}>{item}</span>)}
            </div>
          </section>
        </div>
      </main>

      <section className="landing-container feature-row" id="products">
        <article><strong>Lead Management</strong><span>Clean lead pipeline with smart status tracking.</span></article>
        <article><strong>Activity Tracking</strong><span>Calls, meetings, notes and follow-ups in one place.</span></article>
        <article><strong>Team Control</strong><span>Admin and super admin modules stay separate.</span></article>
      </section>

      <footer className="landing-footer">
        <div className="landing-container footer-inner">
          <strong>SalesFlow CRM</strong>
          <span>Built for faster follow-ups and cleaner sales operations.</span>
        </div>
      </footer>

      <button className="chat-bubble" type="button" aria-label="Open chat">●</button>
    </div>
  );
}
