import { useEffect, useRef } from 'react';
import './DashboardSidebar.css';
import './DashboardSidebarLogoFix.css';

const menuByRole = {
  employee: ['Dashboard', 'My Leads', 'Won', 'Tasks', 'Calendar', 'Activities', 'Reports', 'Notifications', 'Profile', 'Settings'],
  manager: ['Dashboard', 'Team Leads', 'Won', 'Tasks', 'Calendar', 'Activities', 'Reports', 'Notifications', 'Profile', 'Settings'],
  admin: ['Dashboard', 'Leads', 'Tasks', 'Activities', 'Reports', 'Calendar', 'Users', 'Notifications', 'Settings'],
  superAdmin: ['Overview', 'Companies', 'Users & Roles', 'Subscriptions', 'Revenue & Plans', 'Leads Monitor', 'Notifications', 'Email Logs', 'Security', 'Platform Settings', 'Reports', 'Activity Logs', 'Support Tickets'],
};

const routes = {
  employee: { Dashboard: '/employee/dashboard', 'My Leads': '/leads', Won: '/employee/won', Tasks: '/employee/tasks', Calendar: '/employee/calendar', Activities: '/employee/activities', Reports: '/employee/reports', Notifications: '/notifications', Profile: '/employee/profile', Settings: '/settings' },
  manager: { Dashboard: '/employee/dashboard', 'Team Leads': '/leads', Won: '/employee/won', Tasks: '/employee/tasks', Calendar: '/employee/calendar', Activities: '/employee/activities', Reports: '/employee/reports', Notifications: '/notifications', Profile: '/employee/profile', Settings: '/settings' },
  admin: { Dashboard: '/admin/dashboard', Leads: '/leads', Tasks: '/admin/tasks', Activities: '/admin/activities', Reports: '/admin/reports', Calendar: '/admin/calendar', Users: '/admin/users', Notifications: '/notifications', Settings: '/settings' },
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

const iconByItem = { Dashboard: 'grid', Overview: 'grid', 'My Leads': 'users', 'Team Leads': 'users', Leads: 'users', 'Leads Monitor': 'users', Won: 'won', Tasks: 'check', Calendar: 'calendar', Activities: 'list', Reports: 'chart', Profile: 'user', Users: 'users', 'Users & Roles': 'users', Settings: 'settings', 'Platform Settings': 'settings', Notifications: 'bell', 'Email Logs': 'mail', Security: 'shield', 'Roles & Permissions': 'shield', Companies: 'building', Organizations: 'building', Modules: 'box', Subscriptions: 'rupee', 'Revenue & Plans': 'chart', 'Plans & Billing': 'rupee', 'Activity Logs': 'list', 'System Logs': 'list', Integrations: 'plug', Backup: 'refresh', 'Support Tickets': 'help' };

function Icon({ name }) {
  const path = {
    bell: 'M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0',
    grid: 'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z',
    users: 'M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2M9.5 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8',
    refresh: 'M21 12a9 9 0 0 1-15.5 6.3L3 16m0 0v5h5',
    won: 'M20 6 9 17l-5-5',
    check: 'M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11',
    calendar: 'M7 3v4m10-4v4M4 9h16M5 5h14a1 1 0 0 1 1 1v14H4V6a1 1 0 0 1 1-1Z',
    list: 'M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01',
    chart: 'M4 19V5M4 19h16M8 16v-5M12 16V8M16 16v-9',
    user: 'M20 21a8 8 0 0 0-16 0M12 13a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z',
    building: 'M4 21V5a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v16M2 21h20',
    settings: 'M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7',
    shield: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z',
    box: 'm21 8-9-5-9 5 9 5 9-5ZM3 8v8l9 5 9-5V8',
    rupee: 'M6 4h12M6 8h12M7 4c6 0 7 8 0 8h-1l8 8',
    plug: 'M9 7V2m6 5V2M7 7h10v4a5 5 0 0 1-5 5v6m-4 0h8',
    mail: 'M4 6h16v12H4zM4 7l8 6 8-6',
    help: 'M12 18h.01M9.1 9a3 3 0 1 1 5.8 1c0 2-3 2.2-3 4',
    menu: 'M5 7h14M5 12h14M5 17h14'
  }[name] || 'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z';
  return <svg className="sfx-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={path} /></svg>;
}

function navigateTo(path) { if (!path) return; window.history.pushState({}, '', path); window.dispatchEvent(new Event('salesflow:navigate')); }
function isActive(item, path, currentPath, index) { if (path) return currentPath === path || (item === 'Overview' && currentPath === '/super-admin/dashboard') || ((item === 'My Leads' || item === 'Team Leads') && currentPath.startsWith('/leads')); return index === 0 && currentPath.includes('/dashboard'); }
function SidebarBrand() { return <img className="sfx-real-logo" src="/assets/salesflow-hub-logo-transparent.png" alt="SalesFlow Hub" />; }

export default function DashboardSidebar({ role = 'employee' }) {
  const sidebarRef = useRef(null);
  const safeRole = menuByRole[role] ? role : 'employee';
  const items = menuByRole[safeRole];
  const currentPath = window.location.pathname;
  const homePath = routes[safeRole]?.Dashboard || routes[safeRole]?.Overview || '/employee/dashboard';
  const label = safeRole === 'superAdmin' ? 'Super Admin Control' : safeRole === 'admin' ? 'Company Admin' : safeRole === 'manager' ? 'Manager Workspace' : 'Premium CRM';
  useEffect(() => { const nav = sidebarRef.current?.querySelector('.sfx-nav'); if (nav && nav.scrollTop < 4) nav.scrollTop = 0; });
  return <aside className="sfx-sidebar" ref={sidebarRef}><div className="sfx-brand-row"><button className="sfx-brand sfx-brand-image sfx-brand-dark" onClick={() => navigateTo(homePath)} type="button"><SidebarBrand /></button><button className="sfx-menu" type="button" aria-label="Toggle menu"><Icon name="menu" /></button></div><nav className="sfx-nav">{items.map((item, index) => { const path = routes[safeRole]?.[item]; return <button key={item} type="button" className={isActive(item, path, currentPath, index) ? 'active' : ''} onClick={() => navigateTo(path)}><span className="sfx-nav-icon"><Icon name={iconByItem[item]} /></span><em>{item}</em></button>; })}</nav><div className="sfx-upgrade"><span>*</span><h3>{label}</h3><p>{safeRole === 'superAdmin' ? 'Platform companies, users, trials and system health.' : 'Clean CRM workspace with role based navigation.'}</p><button type="button" onClick={() => navigateTo(safeRole === 'superAdmin' ? '/super-admin/platform-settings' : '/settings')}>Open Settings</button></div><button className="sfx-help" type="button" onClick={() => navigateTo(safeRole === 'superAdmin' ? '/super-admin/notifications' : '/notifications')}><span>?</span><div><strong>{safeRole === 'superAdmin' ? 'Platform Alerts' : 'CRM Alerts'}</strong><small>Open Notifications</small></div></button></aside>;
}
