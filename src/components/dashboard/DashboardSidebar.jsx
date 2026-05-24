import '../../styles/dashboardBase.css';

const menuByRole = {
  employee: ['Dashboard', 'My Leads', 'Follow-ups', 'Tasks', 'Calendar', 'Activities', 'Reports', 'Profile'],
  admin: ['Dashboard', 'Leads', 'Deals', 'Contacts', 'Companies', 'Tasks', 'Activities', 'Reports', 'Calendar', 'Users', 'Settings'],
  superAdmin: ['Dashboard', 'Users', 'Roles & Permissions', 'Organizations', 'Modules', 'Plans & Billing', 'Settings', 'Activity Logs', 'System Logs', 'Integrations', 'Backup & Restore'],
};

const icons = {
  Dashboard: '▦',
  'My Leads': '♙',
  'Follow-ups': '↻',
  Tasks: '☑',
  Calendar: '▣',
  Activities: '▤',
  Reports: '◔',
  Profile: '♙',
  Leads: '◎',
  Deals: '◆',
  Contacts: '♙',
  Companies: '▥',
  Users: '♙',
  Settings: '⚙',
  'Roles & Permissions': '♙',
  Organizations: '▥',
  Modules: '◇',
  'Plans & Billing': '₹',
  'Activity Logs': '▤',
  'System Logs': '☷',
  Integrations: '◇',
  'Backup & Restore': '↻',
};

const routes = {
  employee: {
    Dashboard: '/employee/dashboard',
    'My Leads': '/leads',
    Activities: '/leads/rohan-mehta',
  },
  admin: {
    Dashboard: '/admin/dashboard',
    Leads: '/leads',
    Activities: '/leads/rohan-mehta',
  },
  superAdmin: {
    Dashboard: '/super-admin/dashboard',
  },
};

function navigateTo(path) {
  if (!path) return;
  window.history.pushState({}, '', path);
  window.dispatchEvent(new Event('salesflow:navigate'));
}

export default function DashboardSidebar({ role = 'employee' }) {
  const items = menuByRole[role] || menuByRole.employee;
  const upgradeText = role === 'superAdmin' ? 'Upgrade to Enterprise' : 'Upgrade to Premium';
  const upgradeSub = role === 'superAdmin' ? 'Unlock advanced controls, SSO, audit logs and more.' : 'Unlock advanced features, automations and analytics.';
  const currentPath = window.location.pathname;

  return (
    <aside className="sf-sidebar">
      <button className="sf-sidebar-brand" onClick={() => navigateTo('/')}>
        <span className="sf-logo-cube orange-logo">S</span>
        <strong>Sales<span>Flow</span></strong>
      </button>

      <nav className="sf-side-nav">
        {items.map((item, index) => {
          const itemPath = routes[role]?.[item];
          const isActive = itemPath ? currentPath === itemPath || (itemPath === '/leads' && currentPath.startsWith('/leads')) : index === 0;
          return (
            <button className={isActive ? 'active' : ''} key={item} type="button" onClick={() => navigateTo(itemPath)}>
              <span>{icons[item] || '•'}</span>
              {item}
            </button>
          );
        })}
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
