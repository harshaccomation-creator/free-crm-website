import LandingPage from './pages/LandingPage.jsx';
import AdminDashboard from './pages/dashboards/AdminDashboard.jsx';

export default function AppSecure() {
  const path = window.location.pathname;

  if (path.startsWith('/admin/dashboard')) {
    return <AdminDashboard />;
  }

  return <LandingPage />;
}
