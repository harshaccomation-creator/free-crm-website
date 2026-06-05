import { useEffect, useState } from 'react';
import LandingPage from './pages/LandingPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import EmployeeDashboard from './pages/dashboards/EmployeeDashboardV2.jsx';
import AdminDashboard from './pages/dashboards/AdminDashboard.jsx';
import LeadListPage from './pages/leads/LeadListPage.jsx';
import LeadDetailPage from './pages/leads/LeadDetailPage.jsx';

function cleanPath(path) {
  return (path || '/').replace