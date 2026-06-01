import { useEffect, useMemo, useState } from 'react';
import DashboardSidebar from '../../components/dashboard/DashboardSidebar.jsx';
import { isBackendConfigured, listActivities } from '../../services/crmApi.js';
import './EmployeePages.css';
import './EmployeePagesLayoutFix.css';

const demoActivities = [
  { stage: 'Lead Created', text: 'Rohan Mehta captured from website form.', time: '20 May 2025, 10:30 AM', tone: 'blue' },
  { stage: 'Contacted', text: 'Call completed with Priya Sharma.', time: '19 May 2025, 03:15 PM', tone: 'green' },
  { stage: 'Proposal', text: 'Proposal sent to Amit Verma.', time: '18 May 2025, 11:45 AM', tone: 'purple' },
  { stage: 'Negotiation', text: 'Budget discussion with Neha Singh.', time: '17 May 2025, 04:20 PM', tone: 'orange' },
  { stage: 'Won', text: 'Deepak Kumar converted successfully.', time: '16 May 2025, 12:10 PM', tone: 'green' },
];

const filterOptions = ['All', 'Lead Created', 'Contacted', 'Proposal', 'Negotiation', 'Won', 'Call', 'Follow-up', 'Demo Done', 'Lost'];

function PremiumIcon({ type }) {
  const common = { fill: 'none', stroke: 'currentColor', strokeWidth: 2.15, strokeLinecap: 'round', strokeLinejoin: 'round' };
  if (type === 'phone') return <svg viewBox="0 0 24 24" aria-hidden="true" {...common}><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.4 19.4 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.7 2Z" /></svg>;
  if (type === 'mail') return <svg viewBox="0 0 24 24" aria-hidden="true" {...common}><rect x="3.5" y="5.5" width="17" height="13" rx="2.2" /><path d="m4.5 7 7.5 6 7.5-6" /></svg>;
  if (type === 'badge-check') return <svg viewBox="0 0 24 24" aria-hidden="true" {...common}><circle cx="12" cy="12" r="8.5" /><path d="m8.4 12.2 2.3 2.2 5-5.1" /></svg>;
  if (type === 'sparkles') return <svg viewBox="0 0 24 24" aria-hidden="true" {...common}><path d="M12 3l1.8 5 5.2 1.8-5.2 1.8L12 17l-1.8-5.4L5 9.8 10.2 8 12 3Z" /><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15Z" /></svg>;
  return <svg viewBox="0 0 24 24" aria-hidden="true" {...common}><path d="M12 2l2.7 6.3L21 11l-6.3 2.7L12 20l-2.7-6.3L3 11l6.3-2.7L12 2Z" /></svg>;
}

function Stats({ items }) {
  return <section className="emp-grid cards">{items.map((item) => <article className="emp-card emp-stat" key={item.label}><span className={`emp-icon ${item.tone || ''}`}><PremiumIcon type={item.icon || 'sparkles'} /></span><div><p>{item.label}</p><h2>{item.value}</h2></div></article>)}</section>;
}

function Shell({ title, subtitle, children, actions }) {
  return <div className="emp-page"><DashboardSidebar role="employee" /><main className="emp-main"><div className="emp-container"><header className="emp-head"><div><span className="emp-kicker">Employee Workspace</span><h1>{title}</h1><p>{subtitle}</p></div><div className="emp-actions">{actions}</div></header>{children}</div></main></div>;
}

function formatActivityTime(value) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }).replace(',', '');
}

function titleFromType(type = '') {
  const key = String(type).toLowerCase();
  if (key.includes('lead_created')) return 'Lead Created';
  if (key.includes('call')) return 'Contacted';
  if (key.includes('proposal')) return 'Proposal';
  if (key.includes('negotiation')) return 'Negotiation';
  if (key.includes('won')) return 'Won';
  if (key.includes('demo')) return 'Demo Done';
  if (key.includes('follow')) return 'Follow-up';
  if (key.includes('lost')) return 'Lost';
  return 'Activity';
}

function toneFromStage(stage = '') {
  const key = stage.toLowerCase();
  if (key.includes('won') || key.includes('contact')) return 'green';
  if (key.includes('proposal') || key.includes('demo')) return 'purple';
  if (key.includes('negotiation') || key.includes('follow')) return 'orange';
  if (key.includes('lost')) return 'red';
  return 'blue';
}

function normalizeActivity(row) {
  const stage = row.stage || titleFromType(row.type || row.activity_type);
  return {
    id: row.id || `${stage}-${row.created_at || Date.now()}`,
    stage,
    text: row.note || row.description || row.title || row.text || 'Activity added for lead.',
    time: formatActivityTime(row.activity_at || row.created_at || row.time),
    tone: row.tone || toneFromStage(stage),
    user: row.user?.full_name || row.actor?.full_name || row.user_name || 'User',
  };
}

function useRealActivities() {
  const [items, setItems] = useState(demoActivities.map(normalizeActivity));
  const [isLive, setIsLive] = useState(false);
  const [loading, setLoading] = useState(Boolean(isBackendConfigured));
  const [message, setMessage] = useState('');

  useEffect(() => {
    let alive = true;
    async function load() {
      if (!isBackendConfigured) {
        setLoading(false);
        setMessage('Demo mode: Supabase env missing. Showing sample activities.');
        return;
      }
      try {
        setLoading(true);
        const rows = await listActivities({ limit: 200 });
        if (!alive) return;
        setItems(rows.length ? rows.map(normalizeActivity) : []);
        setIsLive(true);
        setMessage(rows.length ? 'Live Supabase activities connected.' : 'Live Supabase connected. No activities found yet.');
      } catch (error) {
        if (!alive) return;
        setIsLive(false);
        setItems(demoActivities.map(normalizeActivity));
        setMessage(`Demo mode: ${error.message}. Showing sample activities.`);
      } finally {
        if (alive) setLoading(false);
      }
    }
    load();
    return () => { alive = false; };
  }, []);

  return { items, isLive, loading, message };
}

export default function EmployeeActivitiesPage() {
  const [filter, setFilter] = useState('All');
  const { items, isLive, loading, message } = useRealActivities();
  const list = useMemo(() => filter === 'All' ? items : items.filter((item) => item.stage === filter), [filter, items]);

  const stats = useMemo(() => {
    const contacted = items.filter((item) => item.stage === 'Contacted' || item.stage === 'Call').length;
    const proposal = items.filter((item) => item.stage === 'Proposal' || item.stage === 'Demo Done').length;
    const won = items.filter((item) => item.stage === 'Won').length;
    return [
      { icon: 'sparkles', label: 'Total', value: loading ? '...' : items.length },
      { icon: 'phone', label: 'Contacted', value: loading ? '...' : contacted, tone: 'green' },
      { icon: 'mail', label: 'Proposal/Demo', value: loading ? '...' : proposal, tone: 'purple' },
      { icon: 'badge-check', label: 'Won', value: loading ? '...' : won, tone: 'green' },
    ];
  }, [items, loading]);

  return <Shell title="Activities" subtitle="Pipeline wise recent activity timeline." actions={<select className="emp-select" value={filter} onChange={(e) => setFilter(e.target.value)}>{filterOptions.map((item) => <option key={item}>{item}</option>)}</select>}><Stats items={stats} />{message ? <div className={`emp-data-banner ${isLive ? 'live' : 'demo'}`}>{message}</div> : null}<section className="emp-card emp-section"><div className="emp-section-head"><h2>Pipeline Activity</h2><span className="emp-pill blue">{isLive ? 'Live' : 'Demo'}</span></div><div className="pipeline">{list.length ? list.map((item, index) => <div className="pipe-row" key={item.id}><span className={`pipe-dot ${item.tone}`}>{index + 1}</span><div><strong>{item.stage}</strong><p>{item.text}</p></div><span className="pipe-meta">{item.time}<small>{item.user}</small></span></div>) : <p className="emp-empty-note">No activities found.</p>}</div></section></Shell>;
}
