import { useEffect, useMemo, useState } from 'react';
import { SaasEmpty, SaasLayout, SaasStats, goTo } from '../../components/saas/SaasLayout.jsx';
import { listMyNotifications, markAllNotificationsRead, markNotificationRead } from '../../services/crmModulesApi.js';

function fmt(value) { return value ? new Date(value).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', hour12: true }) : '-'; }

export default function NotificationsCenterPage({ role = 'employee' }) {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function load() {
    setLoading(true); setError('');
    try { setItems(await listMyNotifications({ limit: 200 })); }
    catch (err) { setError(err.message || 'Unable to load notifications.'); }
    finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);

  const unread = items.filter((n) => !n.read_at).length;
  const visible = useMemo(() => filter === 'Unread' ? items.filter((n) => !n.read_at) : items, [filter, items]);
  async function openNotification(item) {
    if (!item.read_at) await markNotificationRead(item.id);
    await load();
    if (item.related_lead_id) goTo(`/leads/${item.related_lead_id}`);
  }
  async function markAll() { await markAllNotificationsRead(); await load(); }

  return (
    <SaasLayout role={role} title="Notification Center" subtitle="Unread alerts, follow-up reminders, task updates and CRM system notifications." actions={<><button className="saas-btn" onClick={load}>Refresh</button><button className="saas-btn primary" onClick={markAll}>Mark all read</button></>}>
      {error ? <div className="saas-banner error">{error}</div> : null}
      <SaasStats items={[{ label: 'Total Alerts', value: loading ? '...' : items.length, icon: '🔔' }, { label: 'Unread', value: unread, icon: '●' }, { label: 'Read', value: items.length - unread, icon: '✓' }, { label: 'Lead Linked', value: items.filter(n => n.related_lead_id).length, icon: '↗' }]} />
      <section className="saas-card saas-toolbar"><div className="saas-actions"><button className={`saas-btn ${filter === 'All' ? 'primary' : ''}`} onClick={() => setFilter('All')}>All</button><button className={`saas-btn ${filter === 'Unread' ? 'primary' : ''}`} onClick={() => setFilter('Unread')}>Unread</button></div></section>
      <section className="saas-card saas-table-card"><div className="saas-table-wrap"><table className="saas-table"><thead><tr><th>Status</th><th>Notification</th><th>Type</th><th>Created</th><th>Action</th></tr></thead><tbody>{visible.map((item) => <tr key={item.id} onClick={() => openNotification(item)}><td><span className={`saas-badge ${item.read_at ? 'green' : 'orange'}`}>{item.read_at ? 'Read' : 'Unread'}</span></td><td className="saas-title-cell"><strong>{item.title}</strong><small>{item.message || 'No message'}</small></td><td>{item.type || 'info'}</td><td>{fmt(item.created_at)}</td><td>{item.related_lead_id ? 'Open Lead' : 'Mark Read'}</td></tr>)}</tbody></table></div>{!loading && !visible.length ? <SaasEmpty title="No notifications" text="You are all caught up. New reminders and alerts will appear here." /> : <footer className="saas-footer"><span>Showing {visible.length} notifications</span></footer>}</section>
    </SaasLayout>
  );
}
