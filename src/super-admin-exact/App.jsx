import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import Dashboard from './pages/Dashboard';
import Companies from './pages/Companies';
import Users from './pages/Users';
import Subscriptions from './pages/Subscriptions';
import Plans from './pages/Plans';
import DemoRequests from './pages/DemoRequests';
import WebsiteHealth from './pages/WebsiteHealth';
import ActivityLogs from './pages/ActivityLogs';
import EmailLogs from './pages/EmailLogs';
import SupportTickets from './pages/SupportTickets';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="companies" element={<Companies />} />
          <Route path="users" element={<Users />} />
          <Route path="subscriptions" element={<Subscriptions />} />
          <Route path="plans" element={<Plans />} />
          <Route path="demo-requests" element={<DemoRequests />} />
          <Route path="website-health" element={<WebsiteHealth />} />
          <Route path="activity-logs" element={<ActivityLogs />} />
          <Route path="email-logs" element={<EmailLogs />} />
          <Route path="support-tickets" element={<SupportTickets />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
