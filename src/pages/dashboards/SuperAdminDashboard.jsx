import { useEffect, useState } from 'react';
import SuperAdminOverviewPage from './SuperAdminOverviewPage.jsx';
import SuperAdminSectionPage from './SuperAdminSectionPage.jsx';
import '../../styles/superAdminReferenceTheme.css';

function getCurrentView() {
  return new URLSearchParams(window.location.search).get('view') || '';
}

export default function SuperAdminDashboard() {
  const [view, setView] = useState(getCurrentView());

  useEffect(() => {
    const syncView = () => setView(getCurrentView());
    window.addEventListener('popstate', syncView);
    window.addEventListener('salesflow:navigate', syncView);
    return () => {
      window.removeEventListener('popstate', syncView);
      window.removeEventListener('salesflow:navigate', syncView);
    };
  }, []);

  if (view) return <SuperAdminSectionPage view={view} />;
  return <SuperAdminOverviewPage />;
}
