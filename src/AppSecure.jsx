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
import WonPageFixed from './pages/employee/WonPageFixed.jsx';
import TasksPageFixed from './pages/employee/TasksPageFixed.jsx';
import SettingsPage from './pages/shared/SettingsPage.jsx';
import NotificationsPage from './pages/shared/NotificationsPage.jsx';
import ModuleRouter, { isPlatformModuleRoute } from './pages/modules/ModuleRouter.jsx';
import AdminModulePage from './pages/modules/AdminModulePage.jsx';
import { roleHome, useAuthProfile } from './hooks/useAuthProfile.js';
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
import './styles/salesflowSaasModules.css';
import './styles/saasSidebarOverlapFix.css';
import './styles/zzzzFinalPageOffsetLock.css';
import './styles/wonFixedHardOverride.css';

function isProtected(path) {
  return path.startsWith('/employee') ||
    path.startsWith('/admin') ||
    path.startsWith('/super-admin') ||
    path === '/leads' ||
    path.startsWith('/leads/') ||
    path === '/settings' ||
    path === '/notifications' ||
    isPlatformModuleRoute(path);
}
function go(path, setPath) { window.history.replaceState({}, '', path); setPath(path); window.dispatchEvent(new Event('salesflow:navigate')); }
function isSuper(role) { return role === 'super_admin'; }
function isAdmin(role) { return role === 'company_admin'; }
function isEmployee(role) { return role === 'employee' || role === 'manager'; }

export default function AppSecure() {
  const [path, setPath] = useState(window.location.pathname);
  const auth = useAuthProfile();
  const role = auth.role;
  const loggedIn = Boolean(auth.user);
  const protectedRoute = isProtected(path);
  useEffect(() => { const sync = () => setPath(window.location.pathname); window.addEventListener('popstate', sync); window.addEventListener('salesflow:navigate', sync); return () => { window.removeEventListener('popstate', sync); window.removeEventListener('salesflow:navigate', sync); }; }, []);
  useEffect(() => { if (auth.loading || !loggedIn || !protectedRoute) return; if (isSuper(role) && (path.startsWith('/employee') || path.startsWith('/admin'))) go('/super-admin/dashboard', setPath); if (isAdmin(role) && (path.startsWith('/employee') || path.startsWith('/super-admin'))) go('/admin/dashboard', setPath); if (isEmployee(role) && (path.startsWith('/admin') || path.startsWith('/super-admin'))) go('/employee/dashboard', setPath); }, [auth.loading, loggedIn, protectedRoute, role, path]);
  if (auth.loading && protectedRoute) return <div className="login-dark-page"><div className="login-message">Checking secure session...</div></div>;
  if (protectedRoute && !loggedIn) return <LoginPage />;
  if (path === '/login') return <LoginPage />;
  if (loggedIn && path === '/') { const home = roleHome(role); if (home.startsWith('/super-admin')) return <SuperAdminDashboard />; if (home.startsWith('/admin')) return <AdminDashboard />; return <EmployeeDashboard />; }
  if (path === '/employee/dashboard') return <EmployeeDashboard />;
  if (path === '/employee/won') return <WonPageFixed />;
  if (path === '/employee/tasks') return <TasksPageFixed />;
  if (path === '/settings') return <SettingsPage />;
  if (path === '/notifications') return <NotificationsPage />;
  if (path === '/employee/calendar') return <EmployeeCalendarPage />;
  if (path === '/employee/activities') return <EmployeeActivitiesPage />;
  if (path === '/employee/reports') return <EmployeeReportsPage />;
  if (path === '/employee/profile') return <PremiumProfilePage />;
  if (isPlatformModuleRoute(path)) return <ModuleRouter path={path} role={role} />;
  if (path.startsWith('/admin/') && path !== '/admin/dashboard') return <AdminModulePage view={path.split('/')[2] || 'users'} />;
  if (path === '/admin/dashboard') return <AdminDashboard />;
  if (path === '/super-admin/dashboard') return <SuperAdminDashboard />;
  if (path.startsWith('/super-admin/')) return <SuperAdminSectionPage view={path.split('/')[2] || 'users'} />;
  if (path === '/leads') return <LeadListPage />;
  if (path.startsWith('/leads/')) return <LeadDetailPage leadId={path.split('/')[2]} />;
  return <LandingPage />;
}
