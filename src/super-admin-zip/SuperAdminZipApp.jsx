import { MemoryRouter, Routes, Route, Navigate } from 'react-router-dom';
import '../super-admin-exact/index.css';
import AppLayout from '../super-admin-exact/components/layout/AppLayout';
import Dashboard from '../super-admin-exact/pages/Dashboard';
import Companies from '../super-admin-exact/pages/Companies';
import Users from '../super-admin-exact/pages/Users';
import Subscriptions from '../super-admin-exact/pages/Subscriptions';
import Plans from '../super-admin-exact/pages/Plans';
import Revenue from '../super-admin-exact/pages/Revenue';
import LeadsMonitor from '../super-admin-exact/pages/LeadsMonitor';
import Notifications from '../super-admin-exact/pages/Notifications';
import Security from '../super-admin-exact/pages/Security';
import PlatformSettings from '../super-admin-exact/pages/PlatformSettings';
import Reports from '../super-admin-exact/pages/Reports';
import DemoRequests from '../super-admin-exact/pages/DemoRequests';
import WebsiteHealth from '../super-admin-exact/pages/WebsiteHealth';
import ActivityLogs from '../super-admin-exact/pages/ActivityLogs';
import EmailLogs from '../super-admin-exact/pages/EmailLogs';
import SupportTickets from '../super-admin-exact/pages/SupportTickets';

export default function SuperAdminZipApp() {
  return (
    <MemoryRouter initialEntries={["/dashboard"]}>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="companies" element={<Companies />} />
          <Route path="users" element={<Users />} />
          <Route path="subscriptions" element={<Subscriptions />} />
          <Route path="plans" element={<Plans />} />
          <Route path="revenue" element={<Revenue />} />
          <Route path="leads-monitor" element={<LeadsMonitor />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="security" element={<Security />} />
          <Route path="platform-settings" element={<PlatformSettings />} />
          <Route path="reports" element={<Reports />} />
          <Route path="demo-requests" element={<DemoRequests />} />
          <Route path="website-health" element={<WebsiteHealth />} />
          <Route path="activity-logs" element={<ActivityLogs />} />
          <Route path="email-logs" element={<EmailLogs />} />
          <Route path="support-tickets" element={<SupportTickets />} />
        </Route>
      </Routes>
    </MemoryRouter>
  );
}
