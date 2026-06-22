import SalesFlowHubBridge from '../super-admin/SalesFlowHubBridge.jsx';

const viewMap = {
  companies: 'companies',
  'users-roles': 'users',
  users: 'users',
  roles: 'users',
  subscriptions: 'invoices',
  billing: 'invoices',
  'revenue-plans': 'plans',
  plans: 'plans',
  'leads-monitor': 'leads',
  leads: 'leads',
  notifications: 'notifications',
  'email-logs': 'email-logs',
  security: 'security',
  'platform-settings': 'settings',
  settings: 'settings',
  reports: 'reports',
  'activity-logs': 'activity-logs',
  'system-logs': 'activity-logs',
  'support-tickets': 'support-tickets',
  integrations: 'settings',
  backup: 'reports',
  organizations: 'companies',
};

export default function SuperAdminSectionPage({ view = 'overview' }) {
  const mappedView = viewMap[view] || 'overview';
  const target = mappedView === 'overview' ? '/super-admin/dashboard' : `/super-admin/dashboard?view=${mappedView}`;

  if (typeof window !== 'undefined' && window.location.pathname !== '/super-admin/dashboard') {
    window.history.replaceState({}, '', target);
  }

  return <SalesFlowHubBridge />;
}
