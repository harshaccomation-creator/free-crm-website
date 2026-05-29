import { useEffect, useState } from 'react';
import LandingPage from './pages/LandingPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import EmployeeDashboard from './pages/dashboards/EmployeeDashboardV2.jsx';
import AdminDashboard from './pages/dashboards/AdminDashboard.jsx';
import SuperAdminDashboard from './pages/dashboards/SuperAdminDashboard.jsx';
import SuperAdminSectionPage from './pages/dashboards/SuperAdminSectionPage.jsx';
import LeadListPage from './pages/leads/LeadListPage.jsx';
import LeadDetailPage from './pages/leads/LeadDetailPage.jsx';
import EmployeeReportsPage from './pages/employee/EmployeeReportsPage.jsx';
import PremiumProfilePage from './pages/employee/ProfilePagePremium.jsx';
import { WonPage, TasksPage, CalendarPage, ActivitiesPage } from './pages/employee/EmployeeWorkPages.jsx';
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
import './styles/leadActivityTimelineFix.css';
import './styles/superAdminCompactFix.css';
import './styles/brandUnifiedCrmTheme.css';
import './styles/salesflowLogoEverywhere.css';

const TAWK_WIDGET_ID = '6a185c426034501c34c0b3b0';
const TAWK_PROPERTY_ID = '1jpnigpq8';

function isPublicSupportPage(pathname) {
  return pathname === '/' || pathname === '/login';
}

function getSavedRole() {
  return String(window.localStorage.getItem('salesflow_user_role') || '').toLowerCase().replace(/[\s-]+/g, '_');
}

function isSuperAdminRole(role) {
  return role === 'super_admin' || role === 'superadmin';
}

function applyTawkVisibility(pathname) {
  if (typeof window === 'undefined' || !window.Tawk_API) return;
  const showPublicBubble = isPublicSupportPage(pathname);
  try {
    if (showPublicBubble) window.Tawk_API.showWidget?.();
    else window.Tawk_API.hideWidget?.();
  } catch {}
}

function loadTawkWidget(pathname) {
  if (typeof window === 'undefined') return;
  window.Tawk_API = window.Tawk_API || {};
  window.Tawk_API.onLoad = () => applyTawkVisibility(window.location.pathname || pathname);
  window.Tawk_LoadStart = new Date();
  if (document.getElementById('salesflow-tawk-widget')) {
    applyTawkVisibility(pathname);
    return;
  }
  const script = document.createElement('script');
  script.id = 'salesflow-tawk-widget';
  script.async = true;
  script.src = `https://embed.tawk.to/${TAWK_WIDGET_ID}/${TAWK_PROPERTY_ID}`;
  script.charset = 'UTF-8';
  script.setAttribute('crossorigin', '*');
  document.body.appendChild(script);
}

export default function App() {
  const [path, setPath] = useState(window.location.pathname);
  useEffect(() => { loadTawkWidget(path); }, []);
  useEffect(() => { applyTawkVisibility(path); }, [path]);
  useEffect(() => {
    const role = getSavedRole();
    if (isSuperAdminRole(role) && path.startsWith('/employee')) {
      window.history.replaceState({}, '', '/super-admin/dashboard');
      setPath('/super-admin/dashboard');
      window.dispatchEvent(new Event('salesflow:navigate'));
    }
  }, [path]);
  useEffect(() => {
    const syncPath = () => setPath(window.location.pathname);
    window.addEventListener('popstate', syncPath);
    window.addEventListener('salesflow:navigate', syncPath);
    return () => {
      window.removeEventListener('popstate', syncPath);
      window.removeEventListener('salesflow:navigate', syncPath);
    };
  }, []);

  const savedRole = getSavedRole();
  if (isSuperAdminRole(savedRole) && path.startsWith('/employee')) return <SuperAdminDashboard view="dashboard" />;
  if (path === '/login') return <LoginPage />;
  if (path === '/employee/dashboard') return <EmployeeDashboard />;
  if (path === '/employee/won') return <WonPage />;
  if (path === '/employee/tasks') return <TasksPage />;
  if (path === '/employee/calendar') return <CalendarPage />;
  if (path === '/employee/activities') return <ActivitiesPage />;
  if (path === '/employee/reports') return <EmployeeReportsPage />;
  if (path === '/employee/profile') return <PremiumProfilePage />;
  if (path === '/admin/dashboard') return <AdminDashboard />;
  if (path === '/super-admin/dashboard') return <SuperAdminDashboard />;
  if (path.startsWith('/super-admin/')) return <SuperAdminSectionPage view={path.split('/')[2] || 'users'} />;
  if (path === '/leads') return <LeadListPage />;
  if (path.startsWith('/leads/')) return <LeadDetailPage leadId={path.split('/')[2]} />;
  return <LandingPage />;
}
