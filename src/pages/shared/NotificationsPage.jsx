import { useEffect, useState } from 'react';
import DashboardSidebar from '../../components/dashboard/DashboardSidebar.jsx';
import { getMyDashboardSummary, markAllNotificationsRead } from '../../services/crmApi.js';
import '../../styles/settingsNotificationsPolish.css';

function getRole() {
  return localStorage.getItem('salesflow_user_role') || localStorage.getItem('salesflowRole') || 'employee';
}
function getSidebarRole(role) {
  if (role === 'admin' || role === 'company_admin') return 'admin';
  if (role === 'super_admin' || role === 'superadmin') return 'superAdmin';
  if (role === 'manager') return 'manager';
  return 'employee';
}
function formatDate(value) {
  const date = value ? new Date(value) : null;
  if (!date || Number.isNaN(date.getTime())) return 'Just now';
  return date.toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', hour12: true }).replace(',', '');
}
function go(path) {
  window.history.pushState({}, '', path);
  window.dispatchEvent(new Event('salesflow:navigate'));
}

export default function NotificationsPage() {
  const role = getRole();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  async function loadNotifications() {
    try {
      setLoading(true);
      const summary = await getMyDashboardSummary();
      const notifs = summary?.notifications ?? summary?.data?.notifications ?? [];
      setItems(Array.isArray(notifs) ? notifs : []);
      setMessage('');
    } catch (error) {
      setItems([]);
      setMessage(error.message || 'Notifications are unavailable right now.');
    } finally {
      setLoading(false);
    }
  }

  async function markRead() {
    try {
      await markAllNotificationsRead();
      await loadNotifications();
      setMessage('All notifications marked as read.');
    } catch (error) {
      setMessage(error.message || 'Unable to mark notifications read.');
    }
  }

  useEffect(() => { loadNotifications(); }, []);

  return (
    <div className="sf-dashboard settings-shell">
      <DashboardSidebar role={getSidebarRole(role)} />
      <main className="settings-main">
        <header className="settings-hero">
          <div>
            <span className="settings-eyebrow">CRM Inbox</span>
            <h1>Notifications</h1>
            <p>Track overdue follow-ups, task alerts, lead updates and CRM reminders in one professional inbox.</p>
          </div>
          <button type="button" onClick={markRead}>Mark All Read</button>
        </header>
        {message ? <div className="settings-alert">{message}</div> : null}
        <section className="notifications-panel">
          {loading ? (
            <div className="notification-empty">
              <p>Loading notifications...</p>
            </div>
          ) : items.length ? (
            items.map((item) => (
              <article className={`notification-row ${item.read_at ? 'read' : 'unread'}`} key={item.id || item.title}>
                <span>{item.read_at ? '✓' : '!'}</span>
                <div>
                  <h3>{item.title || 'CRM Notification'}</h3>
                  <p>{item.message || 'New SalesFlow CRM activity available.'}</p>
                  <small>{formatDate(item.created_at)}</small>
                </div>
              </article>
            ))
          ) : (
            <div className="notification-empty">
              <h2>No notifications</h2>
              <p>You are all caught up. New overdue, follow-up and task alerts will appear here.</p>
              <button type="button" onClick={() => go('/employee/dashboard')}>Back to Dashboard</button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
