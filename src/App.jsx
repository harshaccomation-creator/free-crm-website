import { useEffect, useState } from 'react';
import LandingPage from './pages/LandingPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import EmployeeDashboard from './pages/dashboards/EmployeeDashboard.jsx';
import AdminDashboard from './pages/dashboards/AdminDashboard.jsx';
import SuperAdminDashboard from './pages/dashboards/SuperAdminDashboard.jsx';
import SuperAdminSectionPage from './pages/dashboards/SuperAdminSectionPage.jsx';
import LeadListPage from './pages/leads/LeadListPageClean.jsx';
import LeadDetailPage from './pages/leads/LeadDetailPage.jsx';
import EmployeeReportsPage from './pages/employee/EmployeeReportsPage.jsx';
import PremiumProfilePage from './pages/employee/ProfilePagePremium.jsx';
import EmployeeActivitiesPage from './pages/employee/EmployeeActivitiesPage.jsx';
import EmployeeContactsPage from './pages/employee/EmployeeContactsPage.jsx';
import EmployeeCalendarPage from './pages/employee/EmployeeCalendarPage.jsx';
import SettingsPage from './pages/shared/SettingsPage.jsx';
import NotificationsPage from './pages/shared/NotificationsPage.jsx';
import SupportPage from './pages/shared/SupportPage.jsx';
import WonPageFixed from './pages/employee/WonPageFixed.jsx';
import TasksPageFixed from './pages/employee/TasksPageFixed.jsx';
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
import './styles/crmReadabilityFix.css';
import './styles/zzzzFinalPageOffsetLock.css';
import './styles/superAdminFinalDarkLock.css';
import './styles/superAdminDesignSystem.css';

function getSavedRole() {
  const raw = window.localStorage.getItem('salesflow_user_role') || window.localStorage.getItem('salesflowRole') || '';
  return String(raw).toLowerCase().replace(/[\s-]+/g, '_');
}

function isSuperAdminRole(role) { return role === 'super_admin' || role === 'superadmin'; }
function isAdminRole(role) { return role === 'admin' || role === 'company_admin'; }
function isManagerRole(role) { return role === 'manager'; }
function isEmployeeRole(role) { return !role || role === 'employee'; }
function isStaffRole(role) { return isEmployeeRole(role) || isManagerRole(role); }

function hasActiveCrmSession() {
  if (typeof window === 'undefined') return false;
  return Boolean(
    window.localStorage.getItem('salesflow_user_email') ||
    window.localStorage.getItem('salesflow_session')
  );
}

function isSupportPath(pathname) {
  return pathname === '/support' ||
    pathname === '/support/' ||
    pathname === '/employee/support' ||
    pathname === '/employee/support/' ||
    pathname === '/admin/support' ||
    pathname === '/admin/support/';
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
    pathname.startsWith('/leads/') ||
    pathname === '/contacts' ||
    isSupportPath(pathname) ||
    pathname === '/settings' ||
    pathname === '/notifications';
}

function installEmployeeLeftAlignFix() {
  if (typeof document === 'undefined') return;
  if (document.getElementById('salesflow-employee-left-align-fix')) return;
  const style = document.createElement('style');
  style.id = 'salesflow-employee-left-align-fix';
  style.textContent = `
    @media(min-width:1201px){
      html body #root .emp-page{display:block!important;position:relative!important;width:100vw!important;max-width:100vw!important;min-height:100vh!important;overflow-x:hidden!important;}
      html body #root .emp-page>.sfx-sidebar{position:fixed!important;left:0!important;top:0!important;bottom:0!important;width:310px!important;min-width:310px!important;max-width:310px!important;z-index:999!important;}
      html body #root .emp-page>.emp-main{position:relative!important;display:block!important;grid-column:auto!important;margin-left:310px!important;width:calc(100vw - 310px)!important;max-width:calc(100vw - 310px)!important;min-width:0!important;padding:24px 28px 44px!important;box-sizing:border-box!important;overflow-x:hidden!important;transform:none!important;}
      html body #root .emp-page>.emp-main>.emp-container{width:100%!important;max-width:1120px!important;min-width:0!important;margin:0!important;padding:0!important;box-sizing:border-box!important;}
      html body #root .emp-page .emp-head,html body #root .emp-page .emp-grid.cards,html body #root .emp-page .emp-two,html body #root .emp-page .emp-section{margin-left:0!important;margin-right:0!important;max-width:100%!important;min-width:0!important;box-sizing:border-box!important;}
      html body #root .emp-page .emp-grid.cards{display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr))!important;gap:14px!important;}
    }
    @media(max-width:1200px){
      html body #root .emp-page>.sfx-sidebar{position:relative!important;width:100%!important;min-width:0!important;max-width:none!important;height:auto!important;min-height:auto!important;}
      html body #root .emp-page>.emp-main{margin-left:0!important;width:100%!important;max-width:100%!important;padding:18px 14px 42px!important;}
    }
  `;
  document.head.appendChild(style);
}

export default function App() {
  const [path, setPath] = useState(window.location.pathname);
  useEffect(() => { installEmployeeLeftAlignFix(); }, []);
  useEffect(() => {
    const role = getSavedRole();
    if (!hasActiveCrmSession()) return;
    if (isSupportPath(path)) return;
    if (isSuperAdminRole(role) && path.startsWith('/employee')) return redirectTo('/super-admin/dashboard', setPath);
    if (isSuperAdminRole(role) && path.startsWith('/admin')) return redirectTo('/super-admin/dashboard', setPath);
    if (isAdminRole(role) && path.startsWith('/employee')) return redirectTo('/admin/dashboard', setPath);
    if (isStaffRole(role) && path.startsWith('/admin')) return redirectTo('/employee/dashboard', setPath);
    if (!isSuperAdminRole(role) && path.startsWith('/super-admin')) redirectTo(isAdminRole(role) ? '/admin/dashboard' : '/employee/dashboard', setPath);
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
  if (isSupportPath(path)) return <SupportPage />;
  if (isLoggedIn && isSuperAdminRole(savedRole) && path.startsWith('/employee')) return <SuperAdminDashboard view="dashboard" />;
  if (isLoggedIn && isStaffRole(savedRole) && path.startsWith('/admin')) return <EmployeeDashboard />;
  if (isLoggedIn && !isSuperAdminRole(savedRole) && path.startsWith('/super-admin')) return isAdminRole(savedRole) ? <AdminDashboard /> : <EmployeeDashboard />;
  if (path === '/settings') return <SettingsPage />;
  if (path === '/notifications') return <NotificationsPage />;
  if (path === '/contacts') return <EmployeeContactsPage />;
  if (path === '/employee/dashboard') return <EmployeeDashboard />;
  if (path === '/employee/won') return <WonPageFixed />;
  if (path === '/employee/tasks') return <TasksPageFixed />;
  if (path === '/employee/calendar') return <EmployeeCalendarPage />;
  if (path === '/employee/activities') return <EmployeeActivitiesPage />;
  if (path === '/employee/contacts') return <EmployeeContactsPage />;
  if (path === '/employee/reports') return <EmployeeReportsPage />;
  if (path === '/employee/profile') return <PremiumProfilePage />;
  if (path === '/admin/dashboard') return <AdminDashboard />;
  if (path.startsWith('/admin/')) return <AdminDashboard />;
  if (path === '/super-admin/dashboard') return <SuperAdminDashboard />;
  if (path.startsWith('/super-admin/')) return <SuperAdminSectionPage view={path.split('/')[2] || 'users'} />;
  if (path === '/leads') return <LeadListPage />;
  if (path.startsWith('/leads/')) return <LeadDetailPage leadId={path.split('/')[2]} />;
  return <LandingPage />;
}
