import LandingPage from './pages/LandingPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import AdminDashboard from './pages/dashboards/AdminDashboard.jsx';

export default function AppSecure() {
  const path = window.location.pathname;
  if (path.indexOf('/admin/dashboard') === 0) return <AdminDashboard />;
  if (path === '/login') return <LoginPage />;
  return <LandingPage />;
}
