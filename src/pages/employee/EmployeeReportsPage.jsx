import { useEffect, useMemo, useState } from 'react';
import DashboardSidebar from '../../components/dashboard/DashboardSidebar.jsx';
import { getReportsSummary, isBackendConfigured } from '../../services/crmApi.js';
import './EmployeePages.css';
import './EmployeeReportsPage.css';
import { CrmLoadingPanel } from '../../components/crm/CrmUiStates.jsx';

const demoSummary = {
  totalLeads: 1245,
  wonLeads: 320,
  lostLeads: 120,
  conversionRate: 25.7,
  revenueWon: 1245000,
  totalTasks: 372,
  completedTasks: 186,
  overdueTasks: 77,
  leads: [
    { status: 'New', source: 'Website', value: 120000, owner: { full_name: 'Amit Kumar' } },
    { status: 'Contacted', source: 'Referral', value: 90000, owner: { full_name: 'Neha Patel' } },
    { status: 'In Progress', source: 'LinkedIn', value: 75000, owner: { full_name: 'Rohan Sharma' } },
    { status: 'Won', source: 'Website', value: 245000, owner: { full_name: 'Amit Kumar' } },
    { status: 'Lost', source: 'Cold Call', value: 0, owner: { full_name: 'Dinesh Gupta' } },
  ],
  tasks: [
    { status: 'Completed', type: 'Call' }, { status: 'Pending', type: 'Email' }, { status: 'Overdue', type: 'WhatsApp' },
  ],
};

function ReportIcon({ type }) {
  const common = { fill: 'none', stroke: 'currentColor', strokeWidth: 2.1, strokeLinecap: 'round', strokeLinejoin: 'round' };
  if (type === 'users') return <svg viewBox="0 0 24 24" aria-hidden="true" {...common}><path d="M16 11a4 4 0 1 0-8 0"/><path d="M3.5 20a6.5 6.5 0 0 1 13 0"/><path d="M17.5 14.5a4.5 4.5 0 0 1 3 4.2V20"/><path d="M17 7.2a3.2 3.2 0 0 1 0 6.1"/></svg>;
  if (type === 'badge-check') return <svg viewBox="0 0 24 24" aria-hidden="true" {...common}><circle cx="12" cy="12" r="8.5"/><path d="m8.4 12.2 2.3 2.2 5-5.1"/></svg>;
  if (type === 'trending-up') return <svg viewBox="0 0 24 24" aria-hidden="true" {...common}><path d="M4 17 10 11l4 4 6-8"/><path d="M15 7h5v5"/></svg>;
  if (type === 'rupee') return <svg viewBox="0 0 24 24" aria-hidden="true" {...common}><path d="M7 5h10"/><path d="M7 9h10"/><path d="M8 5c6 0 6 8 0 8H7l7.2 6"/></svg>;
  if (type === 'clipboard-check') return <svg viewBox="0 0 24 24" aria-hidden="true" {...common}><path d="M9 4h6l1 2h2a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2l1-2Z"/><path d="M9 13l2 2 4-4"/></svg>;
  if (type === 'phone') return <svg viewBox="0 0 24 24" aria-hidden="true" {...common}><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.4 19.4 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.7 2Z"/></svg>;
  if (type === 'mail') return <svg viewBox="0 0 24 24" aria-hidden="true" {...common}><rect x="3.5" y="5.5" width="17" height="13" rx="2.2"/><path d="m4.5 7 7.5 6 7.5-6"/></svg>;
  if (type === 'message') return <svg viewBox="0 0 24 24" aria-hidden="true" {...common}><path d="M21 11.5a8.5 8.5 0 0 1-12.8 7.3L3 20l1.4-5A8.5 8.5 0 1 1 21 11.5Z"/><path d="M8 12h.01M12 12h.01M16 12h.01"/></svg>;
  if (type === 'presentation') return <svg viewBox="0 0 24 24" aria-hidden="true" {...common}><rect x="4" y="4" width="16" height="11" rx="1.8"/><path d="M12 15v5"/><path d="m8 20 4-5 4 5"/></svg>;
  if (type === 'note') return <svg viewBox="0 0 24 24" aria-hidden="true" {...common}><path d="M4 20h4l10.5-10.5a2.1 2.1 0 0 0-3-3L5 17l-1 3Z"/><path d="m13.5 8.5 3 3"/><path d="M12 20h8"/></svg>;
  return <svg viewBox="0 0 24 24" aria-hidden="true" {...common}><path d="M12 2l2.7 6.3L21 11l-6.3 2.7L12 20l-2.7-6.3L3 11l6.3-2.7L12 2Z"/></svg>;
}

function Stat({ icon, label, value, growth }) {
  return <article className="rep-stat"><span><ReportIcon type={icon}/></span><div><p>{label}</p><h2>{value}</h2><small>{growth}</small></div></article>;
}

function formatMoney(value) {
  const amount = Number(value || 0);
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
  return `₹${amount.toLocaleString('en-IN')}`;
}
function pct(value) { return `${Number(value || 0).toFixed(1)}%`; }
function statusKey(status = '') {
  const key = String(status).toLowerCase();
  if (key.includes('won') || key.includes('converted')) return 'Won';
  if (key.includes('lost')) return 'Lost';
  if (key.includes('contact')) return 'Contacted';
  if (key.includes('progress') || key.includes('proposal') || key.includes('negotiation') || key.includes('demo')) return 'In Progress';
  return 'New';
}
function countBy(rows, getter) {
  return rows.reduce((acc, row) => {
    const key = getter(row) || 'Other';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
}
function sumBy(rows, getter, amountGetter) {
  return rows.reduce((acc, row) => {
    const key = getter(row) || 'Unassigned';
    acc[key] = acc[key] || { count: 0, won: 0, revenue: 0 };
    acc[key].count += 1;
    if (statusKey(row.status) === 'Won') {
      acc[key].won += 1;
      acc[key].revenue += Number(amountGetter(row) || 0);
    }
    return acc;
  }, {});
}
function topRows(summary) {
  const grouped = sumBy(summary.leads || [], (lead) => lead.owner?.full_name || lead.owner || 'Unassigned', (lead) => lead.value || 0);
  const rows = Object.entries(grouped).map(([name, data]) => [name, String(data.count), String(data.won), pct(data.count ? (data.won / data.count) * 100 : 0), formatMoney(data.revenue)]);
  return rows.length ? rows.slice(0, 4) : [['No employee', '0', '0', '0.0%', '₹0']];
}
function leadSummaryRows(summary) {
  const grouped = countBy(summary.leads || [], (lead) => statusKey(lead.status));
  const total = summary.totalLeads || 0;
  return ['New', 'Contacted', 'In Progress', 'Won', 'Lost'].map((label) => [label, `${grouped[label] || 0} (${total ? pct(((grouped[label] || 0) / total) * 100) : '0.0%'})`]);
}
function sourceRows(summary) {
  const grouped = countBy(summary.leads || [], (lead) => lead.source || 'Other');
  const total = summary.totalLeads || 0;
  const rows = Object.entries(grouped).map(([label, value]) => [label, total ? pct((value / total) * 100) : '0.0%']);
  return rows.length ? rows.slice(0, 5) : [['No Source', '0.0%']];
}

const colors = ['#0b72ff', '#35c987', '#21b8cf', '#f59e0b', '#ef4444', '#8b5cf6'];
function Donut({ summary }) {
  const rows = leadSummaryRows(summary);
  return <div className="rep-donut"><svg viewBox="0 0 180 180"><circle cx="90" cy="90" r="58" fill="none" stroke="#0b72ff" strokeWidth="26" strokeDasharray="132 365" transform="rotate(-90 90 90)"/><circle cx="90" cy="90" r="58" fill="none" stroke="#35c987" strokeWidth="26" strokeDasharray="94 365" strokeDashoffset="-132" transform="rotate(-90 90 90)"/><circle cx="90" cy="90" r="58" fill="none" stroke="#21b8cf" strokeWidth="26" strokeDasharray="88 365" strokeDashoffset="-226" transform="rotate(-90 90 90)"/><circle cx="90" cy="90" r="58" fill="none" stroke="#f59e0b" strokeWidth="26" strokeDasharray="51 365" strokeDashoffset="-314" transform="rotate(-90 90 90)"/><circle cx="90" cy="90" r="58" fill="none" stroke="#ef4444" strokeWidth="26" strokeDasharray="35 365" strokeDashoffset="-365" transform="rotate(-90 90 90)"/><text x="90" y="86" textAnchor="middle" fontSize="19" fontWeight="800" fill="#0f172a">{summary.totalLeads}</text><text x="90" y="105" textAnchor="middle" fontSize="11" fill="#64748b">Total Leads</text></svg><div className="rep-legend">{rows.map(([l,v], i)=><div key={l}><i style={{background:colors[i]}}/><span>{l}</span><b>{v}</b></div>)}</div></div>;
}
function Pie({ summary }) {
  const rows = sourceRows(summary);
  return <div className="rep-donut"><svg viewBox="0 0 180 180"><circle cx="90" cy="90" r="60" fill="none" stroke="#0b72ff" strokeWidth="60" strokeDasharray="172 377" transform="rotate(-90 90 90)"/><circle cx="90" cy="90" r="60" fill="none" stroke="#73c769" strokeWidth="60" strokeDasharray="76 377" strokeDashoffset="-172" transform="rotate(-90 90 90)"/><circle cx="90" cy="90" r="60" fill="none" stroke="#f59e0b" strokeWidth="60" strokeDasharray="60 377" strokeDashoffset="-248" transform="rotate(-90 90 90)"/><circle cx="90" cy="90" r="60" fill="none" stroke="#8b5cf6" strokeWidth="60" strokeDasharray="40 377" strokeDashoffset="-308" transform="rotate(-90 90 90)"/><circle cx="90" cy="90" r="60" fill="none" stroke="#ef4444" strokeWidth="60" strokeDasharray="29 377" strokeDashoffset="-348" transform="rotate(-90 90 90)"/></svg><div className="rep-legend">{rows.map(([l,v], i)=><div key={l}><i style={{background:colors[i]}}/><span>{l}</span><b>{v}</b></div>)}</div></div>;
}
function Funnel({ summary }) {
  const rows = leadSummaryRows(summary);
  const max = Math.max(...rows.map(([,v]) => Number(String(v).match(/^\d+/)?.[0] || 0)), 1);
  return <div className="rep-funnel">{rows.map(([l,v], i)=>{ const count = Number(String(v).match(/^\d+/)?.[0] || 0); return <div key={l} style={{background:colors[i],width:`${Math.max(30, (count / max) * 92)}%`}}>{l} - {count}</div>; })}</div>;
}
function Line({ green=false }) {
  const color = green ? '#24b47e' : '#0b72ff';
  const fill = green ? '#e9f9f1' : '#eaf2ff';
  return <svg className="rep-line" viewBox="0 0 520 180"><path d="M34 146H500M34 110H500M34 74H500M34 38H500" stroke="#e7eef8"/><path d="M34 146V24" stroke="#dbe6f5"/><path d="M34 146C80 98 110 110 148 78C192 42 226 102 270 76C310 52 358 72 394 50C440 30 470 48 500 22L500 146L34 146Z" fill={fill}/><path d="M34 146C80 98 110 110 148 78C192 42 226 102 270 76C310 52 358 72 394 50C440 30 470 48 500 22" fill="none" stroke={color} strokeWidth="4" strokeLinecap="round"/><g fill={color} stroke="#fff" strokeWidth="3"><circle cx="34" cy="146" r="5"/><circle cx="148" cy="78" r="5"/><circle cx="270" cy="76" r="5"/><circle cx="394" cy="50" r="5"/><circle cx="500" cy="22" r="5"/></g></svg>;
}
function TasksDonut({ summary }) {
  const completed = summary.completedTasks || 0;
  const overdue = summary.overdueTasks || 0;
  const pending = Math.max((summary.totalTasks || 0) - completed - overdue, 0);
  return <div className="rep-donut"><svg viewBox="0 0 180 180"><circle cx="90" cy="90" r="58" fill="none" stroke="#35c987" strokeWidth="26" strokeDasharray="183 365" transform="rotate(-90 90 90)"/><circle cx="90" cy="90" r="58" fill="none" stroke="#0b72ff" strokeWidth="26" strokeDasharray="107 365" strokeDashoffset="-183" transform="rotate(-90 90 90)"/><circle cx="90" cy="90" r="58" fill="none" stroke="#ef4444" strokeWidth="26" strokeDasharray="75 365" strokeDashoffset="-290" transform="rotate(-90 90 90)"/><text x="90" y="86" textAnchor="middle" fontSize="19" fontWeight="800" fill="#0f172a">{summary.totalTasks}</text><text x="90" y="105" textAnchor="middle" fontSize="11" fill="#64748b">Total Tasks</text></svg><div className="rep-legend"><div><i style={{background:'#35c987'}}/><span>Completed</span><b>{completed}</b></div><div><i style={{background:'#0b72ff'}}/><span>Pending</span><b>{pending}</b></div><div><i style={{background:'#ef4444'}}/><span>Overdue</span><b>{overdue}</b></div></div></div>;
}
function activityRows(summary) {
  const tasks = summary.tasks || [];
  const calls = tasks.filter((task) => String(task.type || '').toLowerCase().includes('call')).length;
  const emails = tasks.filter((task) => String(task.type || '').toLowerCase().includes('email')).length;
  const whats = tasks.filter((task) => String(task.type || '').toLowerCase().includes('whatsapp')).length;
  const demos = tasks.filter((task) => String(task.type || '').toLowerCase().includes('demo') || String(task.type || '').toLowerCase().includes('meeting')).length;
  const notes = summary.leads?.filter((lead) => lead.notes).length || 0;
  return [['phone','Calls',calls,'Live'],['mail','Emails',emails,'Live'],['message','WhatsApp',whats,'Live'],['presentation','Meetings / Demos',demos,'Live'],['note','Notes Added',notes,'Live']];
}

export default function EmployeeReportsPage() {
  const [summary, setSummary] = useState(demoSummary);
  const [isLive, setIsLive] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(Boolean(isBackendConfigured));

  useEffect(() => {
    let alive = true;
    async function load() {
      if (!isBackendConfigured) {
        setLoading(false);
        setMessage('Demo mode: Supabase env missing. Showing sample reports.');
        return;
      }
      try {
        setLoading(true);
        const data = await getReportsSummary();
        if (!alive) return;
        setSummary(data);
        setIsLive(true);
        setMessage('Live Supabase reports connected.');
      } catch (error) {
        if (!alive) return;
        setSummary(demoSummary);
        setIsLive(false);
        setMessage(`Demo mode: ${error.message}. Showing sample reports.`);
      } finally {
        if (alive) setLoading(false);
      }
    }
    load();
    return () => { alive = false; };
  }, []);

  const topEmployees = useMemo(() => topRows(summary), [summary]);
  const followUpcoming = Math.max((summary.totalTasks || 0) - (summary.completedTasks || 0) - (summary.overdueTasks || 0), 0);

  return <div className="emp-page"><DashboardSidebar role="employee"/><main className="emp-main rep-main"><header className="emp-head"><div><h1>Reports</h1><p>Track performance and analyze your sales data</p></div><div className="emp-actions"><button type="button" className="emp-btn">{isLive ? 'Live Data' : 'Demo Data'}</button><button type="button" className="emp-btn primary">Export</button></div></header>{loading ? <CrmLoadingPanel label="Loading reports..." compact /> : null}{message && !loading ? <div className={`emp-data-banner ${isLive ? 'live' : 'demo'}`}>{message}</div> : null}<section className="rep-kpis"><Stat icon="users" label="Total Leads" value={loading ? '...' : summary.totalLeads.toLocaleString('en-IN')} growth="from real leads"/><Stat icon="badge-check" label="Won Leads" value={loading ? '...' : summary.wonLeads.toLocaleString('en-IN')} growth="converted/won leads"/><Stat icon="trending-up" label="Conversion Rate" value={loading ? '...' : pct(summary.conversionRate)} growth="won ÷ total leads"/><Stat icon="rupee" label="Revenue Won" value={loading ? '...' : formatMoney(summary.revenueWon)} growth="from won lead value"/><Stat icon="clipboard-check" label="Tasks Completed" value={loading ? '...' : summary.completedTasks.toLocaleString('en-IN')} growth="completed tasks"/></section><section className="rep-row three"><article className="rep-card"><h2>1. Lead Summary</h2><Donut summary={summary}/></article><article className="rep-card"><h2>2. Pipeline Stage Report</h2><Funnel summary={summary}/></article><article className="rep-card"><h2>3. Leads by Source</h2><Pie summary={summary}/></article></section><section className="rep-row three"><article className="rep-card"><h2>4. Won Leads Trend</h2><Line/></article><article className="rep-card"><h2>5. Revenue Trend (Won)</h2><Line green/></article><article className="rep-card"><h2>6. Tasks Overview</h2><TasksDonut summary={summary}/></article></section><section className="rep-row bottom"><article className="rep-card"><h2>7. Top Performing Employees</h2><table className="emp-table"><thead><tr><th>Employee</th><th>Total Leads</th><th>Won</th><th>Conv.</th><th>Revenue</th></tr></thead><tbody>{topEmployees.map(r=><tr key={r[0]}>{r.map(c=><td key={c}>{c}</td>)}</tr>)}</tbody></table></article><article className="rep-card"><h2>8. Follow-up Report</h2><div className="rep-bars">{[['Upcoming',followUpcoming,'#0b72ff'],['Completed',summary.completedTasks,'#35c987'],['Missed',summary.overdueTasks,'#ef4444']].map(([l,v,c])=><div className="rep-bar" key={l}><span>{l}</span><div><b style={{width:`${Math.min(100, Number(v || 0))}%`,background:c}}/></div><strong>{v}</strong></div>)}</div></article><article className="rep-card"><h2>9. Activity Overview</h2><div className="rep-activity">{activityRows(summary).map(([i,l,v,g])=><div key={l}><span><ReportIcon type={i}/></span><strong>{l}</strong><b>{v}</b><em>{g}</em></div>)}</div></article></section><p className="rep-note">All reports are based on live Supabase leads and tasks when backend is connected.</p></main></div>;
}
