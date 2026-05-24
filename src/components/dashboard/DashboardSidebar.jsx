import '../../styles/dashboardBase.css';

const menuByRole = {
  employee: ['Dashboard', 'My Leads', 'Follow-ups', 'Tasks', 'Calendar', 'Messages', 'Profile'],
  admin: ['Dashboard', 'Team Management', 'Leads', 'Deals', 'Tasks', 'Attendance', 'Reports', 'Billing', 'Settings'],
  superAdmin: ['Dashboard', 'Companies', 'Users', 'Subscriptions', 'Plans', 'Support Tickets', 'Integrations', 'Analytics', 'Security', 'System Settings'],
};

const icons = {
  Dashboard: '▦',
  'My Leads': '♙',
  'Follow-ups': '◴',
  Tasks: '☑',
  Calendar: '▣',
  Messages: '✉',
  Profile: '♙',
  'Team Management': '👥',
  Leads: '◉',
  Deals: '◆',
  Attendance: '◷',
  Reports: '▤',
  Billing: '₹',
  Settings: '⚙',
  Companies: '▥',
  Users: '♙',
  Subscriptions: '↻',
  Plans: '▣',
  'Support Tickets': '☏',
  Integrations: '◇',
  Analytics: '▥',
  Security: '🛡',
  'System Settings': '⚙',
};

export default function DashboardSidebar({ role = 'employee' }) {
  const items = menuByRole[role] || menuByRole.employee;
  const upgradeText = role === 'superAdmin' ? 'Upgrade to Enterprise' : 'Upgrade to Premium';
  const upgradeSub = role === 'superAdmin' ? 'Unlock advanced controls, SSO, audit logs and more.' : 'Unlock advanced features, automations and analytics.';

  return (
    <aside className="sf-sidebar">
      <button className="sf-sidebar-brand" onClick={() => window.location.href = '/'}>
        <span className="sf-logo-cube">S</span>
        <strong>Sales<span>Flow</span></strong>
      </button>

      <nav className="sf-side-nav">
        {items.map((item, index) => (
          <button className={index === 0 ? 'active' : ''} key={item} type="button">
            <span>{icons[item] || '•'}</span>
            {item}
            {item === 'Messages' && <i>3</i>}
            {item === 'Support Tickets' && <i>12</i>}
          </button>
        ))}
      </nav>

      <div className="sf-upgrade-card">
        <span>♕</span>
        <h3>{upgradeText}</h3>
        <p>{upgradeSub}</p>
        <button type="button">Upgrade Now</button>
      </div>

      <div className="sf-help-box">
        <span>☊</span>
        <div>
          <strong>Need Help?</strong>
          <small>Contact Support</small>
        </div>
      </div>
    </aside>
  );
}
