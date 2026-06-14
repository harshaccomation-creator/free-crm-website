import SuperAdminPortal from '../super-admin/SuperAdminPortal.jsx';

export default function SuperAdminSectionPage({ view = 'dashboard' }) {
  return <SuperAdminPortal view={view} />;
}
