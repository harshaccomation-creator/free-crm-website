import LandingPage from './pages/LandingPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import AdminDashboard from './pages/dashboards/AdminDashboard.jsx';

export default function AppSecure() {
  const rawPath = window.location.pathname || '/';
  const path = rawPath.replace(/\/+$/, '') || '/';

  if (path.indexOf('/admin/dashboard') === 0) return <AdminDashboard />;
  if (path === '/login' || path === '/signin' || path === '/auth/login')