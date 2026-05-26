import '../../styles/dashboardBase.css';
import './DashboardSidebar.css';

const menuByRole = {
  employee: ['Dashboard', 'My Leads', 'Follow-ups', 'Tasks', 'Calendar', 'Activities', 'Reports', 'Profile'],
  admin: ['Dashboard', 'Leads', 'Deals', 'Contacts', 'Companies', 'Tasks', 'Activities', 'Reports', 'Calendar', 'Users', 'Settings'],
  superAdmin: ['Dashboard', 'Users', 'Roles & Permissions', 'Organizations', 'Modules', 'Plans & Billing', 'Settings', 'Activity Logs', 'System Logs', 'Integrations', 'Backup & Restore'],
};

const iconByItem = {
  Dashboard: 'dashboard',
  'My Leads': 'users',
  'Follow-ups': 'refresh',
  Tasks: 'checkSquare',
  Calendar: 'calendar',
  Activities: 'list',
  Reports: 'chart',
  Profile: 'user',
  Leads: 'target',
  Deals: 'diamond',
  Contacts: 'users',
  Companies: 'building',
  Users: 'users',
  Settings: 'settings',
  'Roles & Permissions': 'shield',
  Organizations: 'building',
  Modules: 'box',
  'Plans & Billing': 'rupee',
  'Activity Logs': 'list',
  'System Logs': 'logs',
  Integrations: 'plug',
  'Backup & Restore': 'refresh',
};

const routes = {
  employee: {
    Dashboard: '/employee/dashboard',
    'My Leads': '/leads',
  },
  admin: {
    Dashboard: '/admin/dashboard',
    Leads: '/leads',
  },
  superAdmin: {
    Dashboard: '/super-admin/dashboard',
  },
};

function SidebarIcon({ type }) {
  const icons = {
    dashboard: <path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z" />,
    users: <path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2M9.5 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM21 21v-2a4 4 0 0 0-3-3.8M16 3.2a4 4 0 0 1 0 7.6" />,
    refresh: <path d="M21 12a9 9 0 0 1-15.5 6.3L3 16m0 0v5h5M3 12A9 9 0 0 1 18.5 5.7L21 8m0 0V3h-5" />,
    checkSquare: <path d="M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />,
    calendar: <path d="M7 3v4m10-4v4M4 9h16M5 5h14a1 1 0 0 1 1 1v14H4V6a1 1 0 0 1 1-1Z" />,
    list: <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />,
    chart: <path d="M4 19V5M4 19h16M8 16v-5M12 16V8M16 16v-9" />,
    user: <path d="M20 21a8 8 0 0 0-16 0M12 13a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z" />,
    target: <path d="M12 21a9 9 0 1 0-9-9 9 9 0 0 0 9 9Zm0-4a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0-4a1 1 0 1 0-1-1 1 1 0 0 0 1 1Z" />,
    diamond: <path d="m12 3 9 9-9 9-9-9 9-9Z" />,
    building: <path d="M4 21V5a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v16M9 7h1M14 7h1M9 11h1M14 11h1M9 15h1M14 15h1M2 21h20" />,
    settings: <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM19.4 15a1.8 1.8 0 0 0 .4 2l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.8 1.8 0 0 0-2-.4 1.8 1.8 0 0 0-1 1.6V21a2 2 0 1 1-4 0v-.1a1.8 1.8 0 0 0-1-1.6 1.8 1.8 0 0 0-2 .4l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.8 1.8 0 0 0 .4-2 1.8 1.8 0 0 0-1.6-1H3a2 2 0 1 1 0-4h.1a1.8 1.8 0 0 0 1.6-1 1.8 1.8 0 0 0-.4-2l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.8 1.8 0 0 0 2 .4 1.8 1.8 0 0 0 1-1.6V3a2 2 0 1 1 4 0v.1a1.8 1.8 0 0 0 1 1.6 1.8 1.8 0 0 0 2-.4l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.8 1.8 0 0 0-.4 2 1.8 1.8 0 0 0 1.6 1h.1a2 2 0 1 1 0 4h-.1a1.8 1.8 0 0 0-1.6 1Z" />,
    shield: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Zm-3-10 2 2 4-5" />,
    box: <path d="m21 8-9-5-9 5 9 5 9-5ZM3 8v8l9 5 9-5V8M12 13v8" />,
    rupee: <path d="M6 4h12M6 8h12M7 4c6 0 7 8 0 8h-1l8 8" />,
    logs: <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />,
    plug: <path d="M9 7V2m6 5V2M7 7h10v4a5 5 0 0 1-5 5v6m-4 0h8" />,
    menu: <path d="M5 7h14M5 12h14M5 17h14" />,
  };

  return (
    <svg className="sf-v2-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {icons[type] || icons.dashboard}
    </svg>
  );
}

function navigateTo(path, role) {
  if (!path) return;
  if (role) window.localStorage.setItem('salesflowRole', role);
  window.history.pushState({}, '', path);
  window.dispatchEvent(new Event('salesflow:navigate'));
}

function getActiveState({ item, itemPath, currentPath, index }) {
  if (currentPath.startsWith('/leads')) return item === 'Leads' || item === 'My Leads';
  if (itemPath) return currentPath === itemPath;
  return index === 0 && currentPath.includes('/dashboard');
}

const sidebarHardLockCss = `
  .sf-sidebar,
  .sf-sidebar-v2,
  .reference-dashboard .sf-sidebar,
  .reference-dashboard .sf-sidebar-v2,
  .ld-shell .sf-sidebar-v2 {
    background: #020617 !important;
    background-image: linear-gradient(180deg, #020617 0%, #020817 45%, #01040d 100%) !important;
  }
  .sf-v2-brand-row,
  .reference-dashboard .sf-v2-brand-row,
  .ld-shell .sf-v2-brand-row {
    margin-bottom: 26px !important;
  }
  .sf-v2-nav,
  .reference-dashboard .sf-v2-nav,
  .ld-shell .sf-v2-nav {
    gap: 7px !important;
  }
  .sf-v2-nav button,
  .reference-dashboard .sf-v2-nav button,
  .ld-shell .sf-v2-nav button {
    min-height: 38px !important;
    height: 38px !important;
  }
  .sf-v2-nav button.active,
  .reference-dashboard .sf-v2-nav button.active,
  .ld-shell .sf-v2-nav button.active {
    background: #1d4ed8 !important;
    background-image: linear-gradient(90deg, #6d38ff 0%, #1677ff 100%) !important;
    color: #ffffff !important;
    box-shadow: 0 12px 24px rgba(37,99,235,.30), inset 0 1px 0 rgba(255,255,255,.16) !important;
  }
  .reference-main {
    padding-left: 18px !important;
    padding-right: 22px !important;
  }
  .ld-main {
    padding-left: 14px !important;
    padding-right: 16px !important;
  }
  .ld-topbar,
  .ld-profile-card,
  .ld-summary-metrics,
  .ld-tag-strip,
  .ld-tabs {
    margin-bottom: 12px !important;
  }
`;

export default function DashboardSidebar({ role = 'employee' }) {
  const safeRole = menuByRole[role] ? role : 'employee';
  const items = menuByRole[safeRole] || menuByRole.employee;
  const upgradeText = safeRole === 'superAdmin' ? 'Upgrade to Enterprise' : 'Upgrade to Premium';
  const upgradeSub = safeRole === 'superAdmin' ? 'Unlock advanced controls, SSO, audit logs and more.' : 'Unlock advanced features, automations and analytics.';
  const currentPath = window.location.pathname;

  return (
    <>
      <style>{sidebarHardLockCss}</style>
      <aside className="sf-sidebar sf-sidebar-v2">
        <div className="sf-v2-brand-row">
          <button className="sf-v2-brand" onClick={() => navigateTo('/', safeRole)}>
            <span className="sf-v2-logo">S</span>
            <strong>Sales<span>Flow</span></strong>
          </button>
          <button className="sf-v2-menu" type="button" aria-label="Toggle menu">
            <SidebarIcon type="menu" />
          </button>
        </div>

        <nav className="sf-v2-nav">
          {items.map((item, index) => {
            const itemPath = routes[safeRole]?.[item];
            const isActive = getActiveState({ item, itemPath, currentPath, index });
            return (
              <button className={isActive ? 'active' : ''} key={item} type="button" onClick={() => navigateTo(itemPath, safeRole)}>
                <span className="sf-v2-icon"><SidebarIcon type={iconByItem[item]} /></span>
                <em>{item}</em>
              </button>
            );
          })}
        </nav>

        <div className="sf-v2-upgrade">
          <span>♕</span>
          <h3>{upgradeText}</h3>
          <p>{upgradeSub}</p>
          <button type="button">Upgrade Now</button>
        </div>

        <div className="sf-v2-help">
          <span>☊</span>
          <div>
            <strong>Need Help?</strong>
            <small>Contact Support</small>
          </div>
        </div>
      </aside>
    </>
  );
}
