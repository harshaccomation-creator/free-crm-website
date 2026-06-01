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

const TAWK_WIDGET_ID = '6a185c426034501c34c0b3b0';
const TAWK_PROPERTY_ID = '1jpnigpq8';

function isPublicSupportPage(pathname) {
  return pathname === '/login';
}

function getSavedRole() {
  return String(window.localStorage.getItem('salesflow_user_role') || '').toLowerCase().replace(/[\s-]+/g, '_');
}

function isSuperAdminRole(role) {
  return role === 'super_admin' || role === 'superadmin';
}

function hasActiveCrmSession() {
  if (typeof window === 'undefined') return false;
  return Boolean(
    window.localStorage.getItem('salesflow_user_email') ||
    window.localStorage.getItem('salesflow_auth_token') ||
    window.localStorage.getItem('salesflow_session')
  );
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
    .ld-activity-icon{position:relative!important;font-size:0!important;line-height:0!important;overflow:hidden!important;display:grid!important;place-items:center!important;}
    .ld-activity-icon *,.ld-activity-icon .ld-text-icon,.ld-activity-icon svg,.ld-activity-icon i,.ld-activity-icon span{display:none!important;visibility:hidden!important;opacity:0!important;width:0!important;height:0!important;max-width:0!important;max-height:0!important;overflow:hidden!important;position:absolute!important;pointer-events:none!important;}
    .ld-activity-icon:before{content:none!important;display:none!important;}
    .ld-activity-icon:after{content:""!important;display:block!important;visibility:visible!important;opacity:1!important;position:relative!important;z-index:5!important;width:22px!important;height:22px!important;background:currentColor!important;mask:var(--activity-icon) center/contain no-repeat!important;-webkit-mask:var(--activity-icon) center/contain no-repeat!important;}
    .ld-activity-row .ld-activity-icon{--activity-icon:url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="black" d="M12 2a10 10 0 1 0 10 10A10.01 10.01 0 0 0 12 2Zm1 15h-2v-2h2Zm0-4h-2V7h2Z"/></svg>')!important;}
    .ld-activity-row.green .ld-activity-icon{--activity-icon:url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="black" d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.8-.4 1.2-.3c1.3.4 2.6.6 4 .6c.7 0 1.2.5 1.2 1.2v3.5c0 .7-.5 1.2-1.2 1.2C10.3 22 2 13.7 2 3.4C2 2.7 2.5 2 3.2 2h3.5c.7 0 1.2.5 1.2 1.2c0 1.4.2 2.7.6 4c.1.4 0 .9-.3 1.2Z"/></svg>')!important;}
    .ld-activity-row.orange .ld-activity-icon{--activity-icon:url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="black" d="M7 2h10v2h3a1 1 0 0 1 1 1v15a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a1 1 0 0 1 1-1h3Zm2 2v2h6V4Zm-4 6h14V6h-2v2H7V6H5Zm0 2v8h14v-8Zm5 6l-3-3l1.4-1.4l1.6 1.6l4.6-4.6L16 12.5Z"/></svg>')!important;}
    .ld-activity-row.blue .ld-activity-icon{--activity-icon:url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="black" d="M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Zm2 2v2h14V7Zm0 4v8h14v-8Zm3 2h6v2H8Z"/></svg>')!important;}
    .ld-activity-row.purple .ld-activity-icon{--activity-icon:url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="black" d="M12 2l2.2 6.1L20 10.4l-5.8 2.2L12 20l-2.2-7.4L4 10.4l5.8-2.3Z"/></svg>')!important;}
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
    if (hasActiveCrmSession() && isSuperAdminRole(role) && path.startsWith('/employee')) {
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
  const isProtected = isProtectedRoute(path);
  const isLoggedIn = hasActiveCrmSession();

  if (isProtected && !isLoggedIn) return <LoginPage />;
  if (isLoggedIn && isSuperAdminRole(savedRole) && path.startsWith('/employee')) return <SuperAdminDashboard view="dashboard" />;
  if (path === '/login') return <LoginPage />;
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
