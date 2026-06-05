import LandingPage from './pages/LandingPage.jsx';
import LoginPage from './pages/LoginPage.jsx';

export default function AppSecure() {
  return window.location.pathname === '/login' ? <LoginPage /> : <LandingPage />;
}
