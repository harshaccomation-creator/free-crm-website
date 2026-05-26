import { useEffect, useState } from 'react';
import LandingPage from './pages/LandingPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import EmployeeDashboard from './pages/dashboards/EmployeeDashboard.jsx';
import AdminDashboard from './pages/dashboards/AdminDashboard.jsx';
import SuperAdminDashboard from './pages/dashboards/SuperAdminDashboard.jsx';
import LeadListPage from './pages/leads/LeadListPage.jsx';
import LeadDetailPage from './pages/leads/LeadDetailPage.jsx';
import EmployeeReportsPage from './pages/employee/EmployeeReportsPage.jsx';
import { WonPage, TasksPage, CalendarPage, ActivitiesPage, ProfilePage } from './pages/employee/EmployeeWorkPages.jsx';
import './styles/dashboardBase.css';
import './styles/loginPage.css';
import './styles/loginDarkHero.css';
import './styles/loginHeroStableFix.css';
import './styles/referenceDashboardExact.css';
import './styles/referenceDashboardWidthFix.css';
import './styles/sidebarLogoMenuFinal.css';
import './styles/loginFinalClean.css';
import './styles/finalUnifiedLayoutFix.css';
import './styles/leadOneRowFinal.css';
import './styles/leadActionsFinal.css';
import './styles/leadPremiumPolish.css';
import './styles/sidebarPremiumPolish.css';
import './styles/leadDetailPremiumFix.css';
import './styles/leadHeaderButtonsCompact.css';
import './styles/dashboardBottomTwoColumn.css';
import './styles/leadSaasProductLook.css';
import './styles/leadActivityImageMatch.css';
import './styles/finalCrmSidebarAndLeadFix.css';
import './styles/sidebarGlobalFinalLock.css';
import './styles/zzzSidebarBlackFix.css';
import './styles/sidebarUnified.css';
import './styles/leadDetailFinalLock.css';
import './styles/leadDetailTagTabsAlignment.css';
import './styles/leadDetailPremiumTabs.css';
import './styles/leadDetailTabContent.css';
import './styles/leadDetailActivityClickFix.css';
import './styles/leadTagsWorking.css';
import './styles/leadFinalPolish.css';

export default function App() {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const syncPath = () => setPath(window.location.pathname);
    window.addEventListener('popstate', syncPath);
    window.addEventListener('salesflow:navigate', syncPath);
    return () => {
      window.removeEventListener('popstate', syncPath);
      window.removeEventListener('salesflow:navigate', syncPath);
    };
  }, []);

  if (path === '/login') return <LoginPage />;
  if (path === '/employee/dashboard') return <EmployeeDashboard />;
  if (path === '/employee/won') return <WonPage />;
  if (path === '/employee/tasks') return <TasksPage />;
  if (path === '/employee/calendar') return <CalendarPage />;
  if (path === '/employee/activities') return <ActivitiesPage />;
  if (path === '/employee/reports') return <EmployeeReportsPage />;
  if (path === '/employee/profile') return <ProfilePage />;
  if (path === '/admin/dashboard') return <AdminDashboard />;
  if (path === '/super-admin/dashboard') return <SuperAdminDashboard />;
  if (path === '/leads') return <LeadListPage />;
  if (path.startsWith('/leads/')) return <LeadDetailPage leadId={path.split('/')[2]} />;

  return <LandingPage />;
}
