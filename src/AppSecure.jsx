import EmployeeContactsPage from './pages/employee/EmployeeContactsPage.jsx';
import EmployeeLeadActivityPage from './pages/employee/EmployeeLeadActivityPage.jsx';
import { useEffect, useState } from 'react';
import LandingPage from './pages/LandingPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import EmployeeDashboard from './pages/dashboards/EmployeeDashboardV2.jsx';
import AdminDashboard from './pages/dashboards/AdminDashboard.jsx';
import SuperAdminDashboard from './pages/dashboards/SuperAdminDashboard.jsx';
import LeadListPage from './pages/leads/LeadListPageClean.jsx';
import LeadDetailPage from './pages/leads/LeadDetailPage.jsx';
import EmployeeCalendarPage from './pages/employee/EmployeeCalendarPage.jsx';
import EmployeeActivitiesPage from './pages/employee/EmployeeActivitiesPage.jsx';
import EmployeeReportsPage from './pages/employee/EmployeeReportsPage.jsx';
import PremiumProfilePage from './pages/employee/ProfilePagePremium.jsx';
import WonPageFixed from './pages/employee/WonPageFixed.jsx';
import TasksPageFixed from './pages/employee/TasksPageFixed.jsx';
import SettingsPage from './pages/shared/SettingsPage.jsx';
import NotificationsPage from './pages/shared/NotificationsPage.jsx';
import { useAuthProfile } from './hooks/useAuthProfile.js';

import './styles/dashboardBase.css';
import './styles/loginPage.css';
import './styles/loginDarkHero.css';
import './styles/loginHeroStableFix.css';
import './styles/loginFinalClean.css';
import './styles/referenceDashboardExact.css';
import './styles/sidebarUnified.css';
import './styles/crmDesignSystem.css';
import './styles/crmFixedPageShell.css';
import './styles/crmProductionPolish.css';
import './styles/leadCleanTableSpacing.css';

function go(path, setPath) {
  window.history.pushState({}, '', path);
  setPath(path);
  window.dispatchEvent(new Event('salesflow:navigate'));
}

function isProtected(path) {
  return (
    path.startsWith('/employee') ||
    path.startsWith('/admin') ||
    path.startsWith('/super-admin') ||
    path === '/leads' ||
    path.startsWith('/leads/') ||
    path === '/settings' ||
    path === '/notifications'
  );
}

export default function AppSecure() {
  const [path, setPath] = useState(window.location.pathname);
  const auth = useAuthProfile();
  const loggedIn = Boolean(auth?.user);
  const role = auth?.role || 'employee';

  useEffect(() => {
    const sync = () => setPath(window.location.pathname);
    window.addEventListener('popstate', sync);
    window.addEventListener('salesflow:navigate', sync);

    return () => {
      window.removeEventListener('popstate', sync);
      window.removeEventListener('salesflow:navigate', sync);
    };
  }, []);

  if (auth?.loading && isProtected(path)) {
    return (
      <div className="crm-session-loader">
        <div className="crm-session-loader__card">
          Checking secure session...
        </div>
      </div>
    );
  }

  if (isProtected(path) && !loggedIn) {
    return <LoginPage />;
  }

  if (path === '/login') {
    return <LoginPage />;
  }

  if (loggedIn && path === '/') {
    if (role === 'super_admin') return <SuperAdminDashboard />;
    if (role === 'company_admin') return <AdminDashboard />;
    return <EmployeeDashboard />;
  }

  if (path === '/employee/dashboard') return <EmployeeDashboard />;
  if (path === '/employee/won') return <WonPageFixed />;
  if (path === '/employee/tasks') return <TasksPageFixed />;
  if (path === '/employee/calendar') return <EmployeeCalendarPage />;
  if (path === '/employee/activities') return <EmployeeActivitiesPage />;
  if (path === '/contacts') return <EmployeeContactsPage />;
  if (path === '/employee/lead-activity') return <EmployeeLeadActivityPage />;
  if (path === '/employee/reports') return <EmployeeReportsPage />;
  if (path === '/employee/profile') return <PremiumProfilePage />;

  if (path === '/admin/dashboard') return <AdminDashboard />;
  if (path === '/super-admin/dashboard') return <SuperAdminDashboard />;

  if (path === '/settings') return <SettingsPage />;
  if (path === '/notifications') return <NotificationsPage />;

  if (path === '/leads') return <LeadListPage />;
  if (path.startsWith('/leads/')) {
    return <LeadDetailPage leadId={path.split('/')[2]} />;
  }

  return <LandingPage />;
}
