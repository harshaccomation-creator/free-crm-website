import '../../styles/landingExtras.css';

const benefitItems = [
  { icon: '🛡', title: 'Data Secure', text: 'Your data is protected with clean access control.' },
  { icon: '⏱', title: 'Save Time', text: 'Automate follow-ups, reminders and repeat tasks.' },
  { icon: '📈', title: 'Grow Revenue', text: 'Track pipeline health and close deals faster.' },
  { icon: '👥', title: 'Built for Teams', text: 'Work together across sales, admin and managers.' },
];

const smartCards = [
  { label: 'Calls', icon: '📞', tone: 'orange' },
  { label: 'Chat', icon: '💬', tone: 'orange' },
  { label: 'Contacts', icon: '👤', tone: 'soft' },
  { label: 'Reports', icon: '📊', tone: 'soft' },
];

export default function LandingExtraSections({ action }) {
  return (
    <>
      <section id="platform-highlights" className="landing-shell light-benefits-wrap">
        <div className="light-benefits">
          {benefitItems.map((item) => (
            <button className="light-benefit-card" key={item.title} onClick={() => action(`${item.title} opened`)}>
              <span className="light-benefit-icon">{item.icon}</span>
              <strong>{item.title}</strong>
              <span>{item.text}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="smart-crm-section">
        <div className="landing-shell smart-crm-grid">
          <div className="smart-copy">
            <span className="section-chip">SMART CRM EXPERIENCE</span>
            <h2>A CRM that feels simple, smart and made for real sales work.</h2>
            <p>SalesFlow connects leads, calls, notes, follow-ups and reporting in one clean workspace so your team always knows the next step.</p>
            <div className="smart-points">
              <button onClick={() => action('Connected data selected')}><span>●</span>Connected lead and activity data</button>
              <button onClick={() => action('Automation selected')}><span>●</span>Automatic reminders and follow-ups</button>
              <button onClick={() => action('Insights selected')}><span>●</span>Live deal and revenue insights</button>
            </div>
          </div>

          <div className="smart-visual" aria-label="Smart CRM illustration">
            <div className="smart-layer orange-layer" />
            <div className="smart-card-stack">
              {smartCards.map((card) => (
                <button className={`smart-mini-card ${card.tone}`} key={card.label} onClick={() => action(`${card.label} module opened`)}>
                  <span>{card.icon}</span>
                </button>
              ))}
            </div>
            <div className="smart-layer green-layer"><span>Smart CRM</span></div>
            <div className="smart-layer lilac-layer left">Leads</div>
            <div className="smart-layer lilac-layer right">Reports</div>
          </div>
        </div>
      </section>
    </>
  );
}
