import '../../styles/landingExtras.css';

const sections = [
  {
    id: 'secure',
    tag: 'Enterprise Security',
    title: 'Data Secure',
    text: 'Keep every lead, note and activity protected with clean permissions, encrypted records and a safer sales workspace.',
    bullets: ['Role-based access', 'Encrypted records', 'Secure customer history'],
    type: 'secure',
    metric: '99.9% safe workspace',
  },
  {
    id: 'time',
    tag: 'Workflow Automation',
    title: 'Save Time',
    text: 'Remove repetitive work from your sales team with reminders, task queues and automatic follow-up tracking.',
    bullets: ['Smart reminders', 'Auto follow-ups', 'Task automation'],
    type: 'time',
    metric: '3x faster follow-ups',
  },
  {
    id: 'revenue',
    tag: 'Revenue Intelligence',
    title: 'Grow Revenue',
    text: 'See pipeline movement, deal health and team performance with premium dashboards made for faster decisions.',
    bullets: ['Pipeline visibility', 'Deal tracking', 'Revenue insights'],
    type: 'revenue',
    metric: '+28% deal growth',
  },
  {
    id: 'teams',
    tag: 'Team Collaboration',
    title: 'Built for Teams',
    text: 'Bring sales reps, admins and managers into one shared CRM workspace with notes, tasks and activity context.',
    bullets: ['Shared notes', 'Live collaboration', 'Admin visibility'],
    type: 'teams',
    metric: 'Live team sync',
  },
];

function FeatureVisual({ type, action }) {
  if (type === 'secure') {
    return (
      <div className="feature-visual premium-visual secure-visual">
        <div className="orb orb-orange" />
        <div className="orb orb-blue" />
        <div className="premium-device security-device">
          <div className="device-head"><span>Security Center</span><i /></div>
          <div className="shield-wrap">🛡</div>
          <strong>Protected CRM Vault</strong>
          <span>Encrypted lead records</span>
          <div className="status-line"><b />Permission verified</div>
        </div>
        <button className="floating-chip chip-1" onClick={() => action('Access control opened')}>🔐 Access Control</button>
        <button className="floating-chip chip-2" onClick={() => action('Encryption opened')}>🧾 Encrypted Data</button>
      </div>
    );
  }

  if (type === 'time') {
    return (
      <div className="feature-visual premium-visual time-visual">
        <div className="orb orb-orange" />
        <div className="premium-device timeline-device">
          <div className="clock-circle">⏱</div>
          <div className="timeline-list"><span /><span /><span /></div>
          <strong>Smart Task Queue</strong>
        </div>
        <button className="task-pill pill-a" onClick={() => action('Reminder automation opened')}>↻ Follow-up reminder</button>
        <button className="task-pill pill-b" onClick={() => action('Task schedule opened')}>✓ Task scheduled</button>
      </div>
    );
  }

  if (type === 'revenue') {
    return (
      <div className="feature-visual premium-visual revenue-visual">
        <div className="orb orb-green" />
        <div className="premium-device chart-device">
          <div className="device-head"><span>Revenue Pulse</span><i /></div>
          <div className="bars"><span /><span /><span /><span /></div>
          <div className="line-up" />
          <div className="chart-foot"><strong>+28%</strong><span>Revenue growth</span></div>
        </div>
        <button className="floating-chip chip-revenue" onClick={() => action('Growth report opened')}>📈 Growth report</button>
      </div>
    );
  }

  return (
    <div className="feature-visual premium-visual teams-visual">
      <div className="orb orb-purple" />
      <div className="premium-device team-device">
        <div className="avatars"><span>👩</span><span>🧑</span><span>👨</span></div>
        <div className="message-card">Shared notes updated</div>
        <div className="message-card soft">Manager reviewed activity</div>
        <div className="message-card orange">New lead assigned</div>
      </div>
      <button className="floating-chip chip-team" onClick={() => action('Team workspace opened')}>👥 Team workspace</button>
    </div>
  );
}

export default function LandingExtraSections({ action }) {
  return (
    <section id="platform-highlights" className="landing-shell feature-showcase-wrap">
      <div className="showcase-heading">
        <span>WHY SALESFLOW</span>
        <h2>Premium CRM tools for serious sales teams</h2>
        <p>Each module is designed to look clean, work fast and keep every button useful.</p>
      </div>

      {sections.map((item, index) => (
        <article key={item.id} className={`feature-showcase-row premium-row ${index % 2 === 1 ? 'reverse' : ''}`}>
          <div className="feature-copy">
            <span className="feature-tag">{item.tag}</span>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
            <div className="feature-metric">{item.metric}</div>
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
