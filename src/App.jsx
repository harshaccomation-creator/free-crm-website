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
import EmployeeActivitiesPage from './pages/employee/EmployeeActivitiesPage.jsx';
import EmployeeCalendarPage from './pages/employee/EmployeeCalendarPage.jsx';
import { WonPage, TasksPage } from './pages/employee/EmployeeWorkPages.jsx';
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
import './styles/leadDetailActivityPremiumPolish.css';
import './styles/superAdminCompactFix.css';
import './styles/brandUnifiedCrmTheme.css';
import './styles/salesflowLogoEverywhere.css';
import './styles/zzLogoForce.css';
import './styles/wonPagePremiumFix.css';
import './styles/leadDetailFinalPremiumPolish.css';
import './styles/leadDetailHeaderHardFix.css';
import './styles/leadActivityTopSpacingFix.css';

const TAWK_WIDGET_ID = '6a185c426034501c34c0b3b0';
const TAWK_PROPERTY_ID = '1jpnigpq8';

function isPublicSupportPage(pathname) {
  return pathname === '/login';
}

function getSavedRole() {
  const raw = window.localStorage.getItem('salesflow_user_role') || window.localStorage.getItem('salesflowRole') || '';
  return String(raw).toLowerCase().replace(/[\s-]+/g, '_');
}

function isSuperAdminRole(role) {
  return role === 'super_admin' || role === 'superadmin';
}

function isAdminRole(role) {
  return role === 'admin' || role === 'company_admin';
}

function isEmployeeRole(role) {
  return !role || role === 'employee' || role === 'manager';
}

function hasActiveCrmSession() {
  if (typeof window === 'undefined') return false;
  return Boolean(
    window.localStorage.getItem('salesflow_user_email') ||
    window.localStorage.getItem('salesflow_auth_token') ||
    window.localStorage.getItem('salesflow_session')
  );
}

function redirectTo(path, setPath) {
  window.history.replaceState({}, '', path);
  setPath(path);
  window.dispatchEvent(new Event('salesflow:navigate'));
}

function isProtectedRoute(pathname) {
  return pathname.startsWith('/employee') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/super-admin') ||
    pathname === '/leads' ||
    pathname.startsWith('/leads/');
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

function installEmployeeLeftAlignFix() {
  if (typeof document === 'undefined') return;
  if (document.getElementById('salesflow-employee-left-align-fix')) return;
  const style = document.createElement('style');
  style.id = 'salesflow-employee-left-align-fix';
  style.textContent = `
    .emp-page{grid-template-columns:300px minmax(0,1fr)!important;}
    .emp-page .emp-main{grid-column:2!important;padding:22px 22px 42px 18px!important;margin-left:-38px!important;min-width:0!important;}
    .emp-page .emp-container{width:100%!important;max-width:none!important;margin:0!important;padding:0!important;}
    .emp-page .emp-head{margin-left:0!important;margin-right:0!important;margin-bottom:16px!important;}
    .emp-page .emp-grid.cards,.emp-page .emp-two,.emp-page .calendar-wrap,.emp-page .reports-grid,.emp-page .report-main{margin-left:0!important;margin-right:0!important;}
    .emp-page .emp-grid.cards{gap:14px!important;margin-bottom:16px!important;}
    .emp-page .emp-two{gap:16px!important;}
    .emp-page .calendar-wrap{gap:16px!important;grid-template-columns:minmax(0,1.45fr) minmax(350px,.85fr)!important;align-items:start!important;}
    .emp-page .emp-section{padding:18px 20px!important;}
    .emp-page .cal-day{min-height:76px!important;}
    .emp-page .task-row{padding:12px 0!important;}
    @media(max-width:1200px){.emp-page{grid-template-columns:1fr!important}.emp-page .emp-main{grid-column:1!important;margin-left:0!important;padding:18px 14px 42px!important}.emp-page .calendar-wrap{grid-template-columns:1fr!important}}
    @media(max-width:700px){.emp-page .emp-main{padding-left:12px!important;padding-right:12px!important;}}
  `;
  document.head.appendChild(style);
}

export default function App() {
  const [path, setPath] = useState(window.location.pathname);
  useEffect(() => { loadTawkWidget(path); }, []);
  useEffect(() => { applyTawkVisibility(path); }, [path]);
  useEffect(() => { installEmployeeLeftAlignFix(); }, []);
  useEffect(() => {
    const role = getSavedRole();
    if (!hasActiveCrmSession()) return;

    if (isSuperAdminRole(role) && path.startsWith('/employee')) {
      redirectTo('/super-admin/dashboard', setPath);
      return;
    }

    if (isSuperAdminRole(role) && path.startsWith('/admin')) {
      redirectTo('/super-admin/dashboard', setPath);
      return;
    }

    if (isAdminRole(role) && path.startsWith('/employee')) {
      redirectTo('/admin/dashboard', setPath);
      return;
    }

    if (isEmployeeRole(role) && path.startsWith('/admin')) {
      redirectTo('/employee/dashboard', setPath);
      return;
    }

    if (!isSuperAdminRole(role) && path.startsWith('/super-admin')) {
      redirectTo(isAdminRole(role) ? '/admin/dashboard' : '/employee/dashboard', setPath);
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
  const isProtected = isProtectedRoute(path);
  const isLoggedIn = hasActiveCrmSession();

  if (isProtected && !isLoggedIn) return <LoginPage />;
  if (path === '/login') return <LoginPage />;
  if (isLoggedIn && isSuperAdminRole(savedRole) && path.startsWith('/employee')) return <SuperAdminDashboard view="dashboard" />;
  if (isLoggedIn && isEmployeeRole(savedRole) && path.startsWith('/admin')) return <EmployeeDashboard />;
  if (isLoggedIn && !isSuperAdminRole(savedRole) && path.startsWith('/super-admin')) return isAdminRole(savedRole) ? <AdminDashboard /> : <EmployeeDashboard />;
  if (path === '/employee/dashboard') return <EmployeeDashboard />;
  if (path === '/employee/won') return <WonPage />;
  if (path === '/employee/tasks') return <TasksPage />;
  if (path === '/employee/calendar') return <EmployeeCalendarPage />;
  if (path === '/employee/activities') return <EmployeeActivitiesPage />;
  if (path === '/employee/reports') return <EmployeeReportsPage />;
  if (path === '/employee/profile') return <PremiumProfilePage />;
  if (path === '/admin/dashboard') return <AdminDashboard />;
  if (path === '/super-admin/dashboard') return <SuperAdminDashboard />;
  if (path.startsWith('/super-admin/')) return <SuperAdminSectionPage view={path.split('/')[2] || 'users'} />;
  if (path === '/leads') return <LeadListPage />;
  if (path.startsWith('/leads/')) return <LeadDetailPage leadId={path.split('/')[2]} />;
  return <LandingPage />;
}
