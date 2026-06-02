import ContactsPage from './ContactsPage.jsx';
import DealsPage from './DealsPage.jsx';
import NotificationsCenterPage from './NotificationsCenterPage.jsx';
import SettingsPage from './SettingsPage.jsx';

function navRole(role) {
  if (role === 'super_admin') return 'superAdmin';
  if (role === 'company_admin') return 'admin';
  return 'employee';
}

export function isPlatformModuleRoute(path) {
  return path === '/contacts' || path === '/deals' || path === '/notifications' || path === '/settings';
}

export default function ModuleRouter({ path, role }) {
  const sidebarRole = navRole(role);
  if (path === '/contacts') return <ContactsPage role={sidebarRole} />;
  if (path === '/deals') return <DealsPage role={sidebarRole} />;
  if (path === '/notifications') return <NotificationsCenterPage role={sidebarRole} />;
  if (path === '/settings') return <SettingsPage role={sidebarRole} />;
  return null;
}
