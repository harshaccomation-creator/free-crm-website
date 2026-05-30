import { useEffect, useRef } from 'react';
import './DashboardSidebar.css';
import './DashboardSidebarLogoFix.css';

const menuByRole = {
  employee: ['Dashboard', 'My Leads', 'Won', 'Tasks', 'Calendar', 'Activities', 'Reports', 'Profile'],
  admin: ['Dashboard', 'Leads', 'Deals', 'Contacts', 'Companies', 'Tasks', 'Activities', 'Reports', 'Calendar', 'Users', 'Settings'],
  superAdmin: ['Dashboard', 'Users', 'Roles & Permissions', 'Organizations', 'Modules', 'Plans & Billing', 'Settings', 'Activity Logs', 'System Logs', 'Integrations', 'Backup & Restore'],
};

const routes = {
  employee: { Dashboard: '/employee/dashboard', 'My Leads': '/leads', Won: '/employee/won', Tasks: '/employee/tasks', Calendar: '/employee/calendar', Activities: '/employee/activities', Reports: '/employee/reports', Profile: '/employee/profile' },
  admin: { Dashboard: '/admin/dashboard', Leads: '/leads' },
  superAdmin: { Dashboard: '/super-admin/dashboard', Users: '/super-admin/users', 'Roles & Permissions': '/super-admin/roles', Organizations: '/super-admin/organizations', Modules: '/super-admin/modules', 'Plans & Billing': '/super-admin/billing', Settings: '/super-admin/settings', 'Activity Logs': '/super-admin/activity-logs', 'System Logs': '/super-admin/system-logs', Integrations: '/super-admin/integrations', 'Backup & Restore': '/super-admin/backup' },
};

const iconByItem = {
  Dashboard: 'grid', 'My Leads': 'users', Leads: 'users', Won: 'won', Tasks: 'check', Calendar: 'calendar', Activities: 'list', Reports: 'chart', Profile: 'user', Deals: 'deal', Contacts: 'users', Companies: 'building', Users: 'users', Settings: 'settings', 'Roles & Permissions': 'shield', Organizations: 'building', Modules: 'box', 'Plans & Billing': 'rupee', 'Activity Logs': 'list', 'System Logs': 'list', Integrations: 'plug', 'Backup & Restore': 'refresh',
};

function Icon({ name }) {
  const path = {
    grid: 'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z',
    users: 'M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2M9.5 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM21 21v-2a4 4 0 0 0-3-3.8M16 3.2a4 4 0 0 1 0 7.6',
    refresh: 'M21 12a9 9 0 0 1-15.5 6.3L3 16m0 0v5h5M3 12A9 9 0 0 1 18.5 5.7L21 8m0 0V3h-5',
    won: 'M20 6 9 17l-5-5',
    check: 'M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11',
    calendar: 'M7 3v4m10-4v4M4 9h16M5 5h14a1 1 0 0 1 1 1v14H4V6a1 1 0 0 1 1-1Z',
    list: 'M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01',
    chart: 'M4 19V5M4 19h16M8 16v-5M12 16V8M16 16v-9',
    user: 'M20 21a8 8 0 0 0-16 0M12 13a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z',
    deal: 'm12 3 9 9-9 9-9-9 9-9Z',
    building: 'M4 21V5a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v16M9 7h1M14 7h1M9 11h1M14 11h1M9 15h1M2 21h20',
    settings: 'M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM19.4 15a1.8 1.8 0 0 0 .4 2l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.8 1.8 0 0 0-2-.4 1.8 1.8 0 0 0-1 1.6V21a2 2 0 1 1-4 0v-.1a1.8 1.8 0 0 0-1-1.6 1.8 1.8 0 0 0-2 .4l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.8 1.8 0 0 0 .4-2 1.8 1.8 0 0 0-1.6-1H3a2 2 0 1 1 0-4h.1a1.8 1.8 0 0 0 1.6-1 1.8 1.8 0 0 0-.4-2l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.8 1.8 0 0 0 2 .4 1.8 1.8 0 0 0 1-1.6V3a2 2 0 1 1 4 0v.1a1.8 1.8 0 0 0 1 1.6 1.8 1.8 0 0 0 2-.4l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.8 1.8 0 0 0-.4 2 1.8 1.8 0 0 0 1.6 1h.1a2 2 0 1 1 0 4h-.1a1.8 1.8 0 0 0-1.6 1Z',
    shield: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Zm-3-10 2 2 4-5',
    box: 'm21 8-9-5-9 5 9 5 9-5ZM3 8v8l9 5 9-5V8M12 13v8',
    rupee: 'M6 4h12M6 8h12M7 4c6 0 7 8 0 8h-1l8 8',
    plug: 'M9 7V2m6 5V2M7 7h10v4a5 5 0 0 1-5 5v6m-4 0h8',
    menu: 'M5 7h14M5 12h14M5 17h14',
  }[name] || 'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z';
  return <svg className="sfx-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={path} /></svg>;
}

function navigateTo(path, role) {
  if (!path) return;
  if (role) window.localStorage.setItem('salesflowRole', role);
  window.history.pushState({}, '', path);
  window.dispatchEvent(new Event('salesflow:navigate'));
}

function openSupportChat() {
  if (window.Tawk_API) {
    window.Tawk_API.showWidget?.();
    window.Tawk_API.maximize?.();
  }
}

function isActive(item, path, currentPath, index) {
  if (path) return currentPath === path || (item === 'My Leads' && currentPath.startsWith('/leads'));
  return index === 0 && currentPath.includes('/dashboard');
}

function SidebarBrand() {
  return (
    <span className="sfx-landing-logo" aria-label="SalesFlow Hub">
      <span className="sfx-landing-mark">S</span>
      <span className="sfx-landing-word">Sales<span>Flow</span></span>
      <span className="sfx-landing-hub">HUB</span>
    </span>
  );
}

export default function DashboardSidebar({ role = 'employee' }) {
  const sidebarRef = useRef(null);
  const safeRole = menuByRole[role] ? role : 'employee';
  const items = menuByRole[safeRole];
  const currentPath = window.location.pathname;
  const upgradeTitle = safeRole === 'superAdmin' ? 'Upgrade to Enterprise' : 'Upgrade to Premium';
  const upgradeText = safeRole === 'superAdmin' ? 'Unlock advanced controls, SSO and audit logs.' : 'Unlock advanced features, automations and analytics.';

  useEffect(() => {
    const sidebar = sidebarRef.current;
    if (!sidebar) return;
    const nav = sidebar.querySelector('.sfx-nav');
    if (nav && nav.scrollTop < 4) nav.scrollTop = 0;
  });

  return (
    <aside className="sfx-sidebar" ref={sidebarRef}>
      <div className="sfx-brand-row">
        <button className="sfx-brand sfx-brand-image sfx-brand-dark" onClick={() => navigateTo('/', safeRole)} type="button"><SidebarBrand /></button>
        <button className="sfx-menu" type="button" aria-label="Toggle menu"><Icon name="menu" /></button>
      </div>
      <nav className="sfx-nav">
        {items.map((item, index) => {
          const path = routes[safeRole]?.[item];
          return <button key={item} type="button" className={isActive(item, path, currentPath, index) ? 'active' : ''} onClick={() => navigateTo(path, safeRole)}><span className="sfx-nav-icon"><Icon name={iconByItem[item]} /></span><em>{item}</em></button>;
        })}
      </nav>
      <div className="sfx-upgrade"><span>♕</span><h3>{upgradeTitle}</h3><p>{upgradeText}</p><button type="button">Upgrade Now</button></div>
      <button className="sfx-help" type="button" onClick={openSupportChat}><span>☊</span><div><strong>Need Help?</strong><small>Open Support Chat</small></div></button>
    </aside>
  );
}
