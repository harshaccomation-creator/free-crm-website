import { useEffect, useState } from 'react';
import LandingPage from './pages/LandingPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import AdminDashboard from './pages/dashboards/AdminDashboard.jsx';

function cleanPath(value) {
  return (value || '/').replace(/\/+$/, '') || '/';
}

export default function AppSecure() {
  const [path, setPath] = useState(() => cleanPath(window.location.pathname));

  useEffect(() => {
    const