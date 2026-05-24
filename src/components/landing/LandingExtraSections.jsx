import '../../styles/landingExtras.css';

const sections = [
  {
    id: 'secure',
    tag: 'Security',
    title: 'Data Secure',
    text: 'Protect customer data with controlled access, encrypted records and safe activity tracking across your CRM.',
    bullets: ['Role-based access', 'Encrypted records', 'Secure customer history'],
    type: 'secure',
  },
  {
    id: 'time',
    tag: 'Automation',
    title: 'Save Time',
    text: 'Automate repetitive work like follow-up reminders, status updates and task scheduling so your team can focus on selling.',
    bullets: ['Smart reminders', 'Auto follow-ups', 'Task automation'],
    type: 'time',
  },
  {
    id: 'revenue',
    tag: 'Growth',
    title: 'Grow Revenue',
    text: 'Track pipeline health, deal stages and team performance with clear visual insights that help you close more deals faster.',
    bullets: ['Pipeline visibility', 'Deal tracking', 'Revenue insights'],
    type: 'revenue',
  },
  {
    id: 'teams',
    tag: 'Collaboration',
    title: 'Built for Teams',
    text: 'Keep sales reps, admins and managers aligned with shared activity logs, follow-up notes and real-time collaboration.',
    bullets: ['Shared notes', 'Live collaboration', 'Admin visibility'],
    type: 'teams',
  },
];

function FeatureVisual({ type, action }) {
  if (type === 'secure') {
    return (
      <div className="feature-visual secure-visual">
        <div className="secure-card main">
          <div className="secure-top"><span className="mini-badge">Protected</span><span className="mini-dot" /></div>
          <div className="shield-wrap">🛡</div>
          <strong>CRM Security Layer</strong>
          <span>Encrypted lead records</span>
        </div>
        <button className="floating-chip chip-1" onClick={() => action('Access control opened')}>🔐 Access</button>
        <button className="floating-chip chip-2" onClick={() => action('Encryption opened')}>🧾 Encrypted</button>
      </div>
    );
  }

  if (type === 'time') {
    return (
      <div className="feature-visual time-visual">
        <div className="time-panel"><div className="clock-circle">⏱</div><div className="time-lines"><span /><span /><span /></div></div>
        <button className="task-pill pill-a" onClick={() => action('Reminder automation opened')}>↻ Follow-up reminder</button>
        <button className="task-pill pill-b" onClick={() => action('Task schedule opened')}>✓ Task scheduled</button>
      </div>
    );
  }

  if (type === 'revenue') {
    return (
      <div className="feature-visual revenue-visual">
        <div className="chart-panel"><div className="bars"><span /><span /><span /><span /></div><div className="line-up" /><div className="chart-foot"><strong>+28%</strong><span>Revenue growth</span></div></div>
        <button className="floating-chip chip-revenue" onClick={() => action('Growth report opened')}>📈 Growth report</button>
      </div>
    );
  }

  return (
    <div className="feature-visual teams-visual">
      <div className="team-board"><div className="avatars"><span>👩</span><span>🧑</span><span>👨</span></div><div className="message-card">Shared notes updated</div><div className="message-card soft">Manager reviewed activity</div></div>
      <button className="floating-chip chip-team" onClick={() => action('Team workspace opened')}>👥 Team workspace</button>
    </div>
  );
}

export default function LandingExtraSections({ action }) {
  return (
    <section id="platform-highlights" className="landing-shell feature-showcase-wrap">
      {sections.map((item, index) => (
        <article key={item.id} className={`feature-showcase-row ${index % 2 === 1 ? 'reverse' : ''}`}>
          <div className="feature-copy">
            <span className="feature-tag">{item.tag}</span>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
            <div className="feature-bullets">
              {item.bullets.map((bullet) => (
                <button key={bullet} onClick={() => action(`${bullet} opened`)}><span>●</span>{bullet}</button>
              ))}
            </div>
          </div>
          <FeatureVisual type={item.type} action={action} />
        </article>
      ))}
    </section>
  );
}
