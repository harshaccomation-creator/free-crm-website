import './DashboardSidebar.css';
import './DashboardSidebarLogoFix.css';

const menus = {
  employee: ['Dashboard', 'My Leads', 'Contacts', 'Won', 'Tasks', 'Calendar', 'Activities', 'Reports', 'Help & Support', 'Notifications', 'Profile', 'Settings'],
  manager: ['Dashboard', 'Team Leads', 'Contacts', 'Won', 'Tasks', 'Calendar', 'Activities', 'Reports', 'Help & Support', 'Notifications', 'Profile', 'Settings'],
  admin: ['Dashboard', 'Leads', 'Contacts', 'Tasks', 'Activities', 'Reports', 'Calendar', 'Users', 'Help & Support', 'Notifications', 'Settings'],
  superAdmin: ['Overview', 'Companies', 'Users & Roles', 'Subscriptions', 'Revenue & Plans', 'Leads Monitor', 'Notifications', 'Email Logs', 'Security', 'Platform Settings', 'Reports', 'Activity Logs', 'Support Tickets'],
};

const routes = {
  employee: {
    Dashboard: '/employee/dashboard',
    'My Leads': '/leads',
    Contacts: '/contacts',
    Won: '/employee/won',
    Tasks: '/employee/tasks',
    Calendar: '/employee/calendar',
    Activities: '/employee/activities',
    Reports: '/employee/reports',
    'Help & Support': '/support',
    Notifications: '/notifications',
    Profile: '/employee/profile',
    Settings: '/settings',
  },
  manager: {
    Dashboard: '/employee/dashboard',
    'Team Leads': '/leads',
    Contacts: '/contacts',
    Won: '/employee/won',
    Tasks: '/employee/tasks',
    Calendar: '/employee/calendar',
    Activities: '/employee/activities',
    Reports: '/employee/reports',
    'Help & Support': '/support',
    Notifications: '/notifications',
    Profile: '/employee/profile',
    Settings: '/settings',
  },
  admin: {
    Dashboard: '/admin/dashboard',
    Leads: '/leads',
    Contacts: '/contacts',
    Tasks: '/admin/tasks',
    Activities: '/admin/activities',
    Reports: '/admin/reports',
    Calendar: '/admin/calendar',
    Users: '/admin/users',
    'Help & Support': '/support',
    Notifications: '/notifications',
    Settings: '/settings',
  },
  superAdmin: {
    Overview: '/super-admin/dashboard',
    Companies: '/super-admin/companies',
    'Users & Roles': '/super-admin/users-roles',
    Subscriptions: '/super-admin/subscriptions',
    'Revenue & Plans': '/super-admin/revenue-plans',
    'Leads Monitor': '/super-admin/leads-monitor',
    Notifications: '/super-admin/notifications',
    'Email Logs': '/super-admin/email-logs',
    Security: '/super-admin/security',
    'Platform Settings': '/super-admin/platform-settings',
    Reports: '/super-admin/reports',
    'Activity Logs': '/super-admin/activity-logs',
    'Support Tickets': '/super-admin/support-tickets',
  },
};

const icons = {
  Dashboard: '▦',
  Overview: '▦',
  'My Leads': '♙',
  'Team Leads': '♙',
  Leads: '♙',
  Contacts: '♙',
  Won: '✓',
  Tasks: '☑',
  Calendar: '▣',
  Activities: '☷',
  Reports: '▥',
  'Help & Support': '?',
  Notifications: '♢',
  Profile: '♙',
  Settings: '∘',
  Users: '♙',
  Companies: '▤',
  Subscriptions: '₹',
  'Revenue & Plans': '▥',
  'Users & Roles': '♙',
  'Leads Monitor': '♙',
  'Email Logs': '✉',
  Security: '◇',
  'Platform Settings': '∘',
  'Activity Logs': '☷',
  'Support Tickets': '?',
};

function nav(path) {
  if (!path) return;
  window.history.pushState({}, '', path);
  window.dispatchEvent(new Event('salesflow:navigate'));
}

function active(item, path) {
  const current = window.location.pathname;
  if (current === path) return true;
  if ((item === 'My Leads' || item === 'Team Leads' || item === 'Leads') && current.startsWith('/leads')) return true;
  return false;
}

export default function DashboardSidebar({ role = 'employee' }) {
  const safeRole = menus[role] ? role : 'employee';
  const items = menus[safeRole];
  const home = routes[safeRole]?.Dashboard || routes[safeRole]?.Overview || '/employee/dashboard';

  return (
    <aside
      className="sfx-sidebar"
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        width: 300,
        minWidth: 300,
        maxWidth: 300,
        height: '100vh',
        boxSizing: 'border-box',
        background: '#050b1f',
        color: '#eaf2ff',
        padding: '22px 16px',
        zIndex: 50,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          marginBottom: 34,
        }}
      >
        <button
          type="button"
          onClick={() => nav(home)}
          style={{
            border: '1px solid rgba(148,163,184,.45)',
            background: '#08213f',
            borderRadius: 24,
            padding: '10px 14px',
            cursor: 'pointer',
            width: 210,
          }}
        >
          <img
            src="/assets/salesflow-hub-logo-transparent.png"
            alt="SalesFlow Hub"
            style={{
              display: 'block',
              width: '100%',
              height: 'auto',
            }}
          />
        </button>

        <button
          type="button"
          style={{
            border: 0,
            background: 'transparent',
            color: '#94a3b8',
            fontSize: 22,
            cursor: 'pointer',
          }}
        >
          ≡
        </button>
      </div>

      <nav
        style={{
          display: 'grid',
          gap: 8,
          height: 'calc(100vh - 150px)',
          overflowY: 'auto',
          paddingRight: 4,
        }}
      >
        {items.map((item) => {
          const path = routes[safeRole]?.[item];
          const isActive = active(item, path);

          return (
            <button
              key={item}
              type="button"
              onClick={() => nav(path)}
              style={{
                width: '100%',
                height: 48,
                border: '1px solid transparent',
                borderRadius: 14,
                background: isActive
                  ? 'linear-gradient(135deg,#2563eb,#f97316)'
                  : 'transparent',
                color: '#eaf2ff',
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                padding: '0 16px',
                fontSize: 15,
                fontWeight: 800,
                cursor: 'pointer',
                textAlign: 'left',
                boxSizing: 'border-box',
              }}
            >
              <span
                style={{
                  width: 26,
                  height: 26,
                  display: 'grid',
                  placeItems: 'center',
                  borderRadius: 9,
                  background: isActive ? 'rgba(255,255,255,.14)' : 'transparent',
                  fontSize: 17,
                  flex: '0 0 26px',
                }}
              >
                {icons[item] || '•'}
              </span>
              <span>{item}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
