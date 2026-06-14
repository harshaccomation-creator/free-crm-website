import { useEffect, useMemo, useState } from 'react';
import '../../styles/superAdminPortalSmall.css';

const navItems = [
  ['Overview', 'dashboard', '▦'],
  ['Companies', 'companies', '⌂'],
  ['Users & Roles', 'users-roles', '♙'],
  ['Subscriptions', 'subscriptions', '₹'],
  ['Revenue & Plans', 'revenue-plans', '▥'],
  ['Leads Monitor', 'leads-monitor', '◎'],
  ['Demo Requests', 'demo-requests', '✉'],
  ['Website Health', 'website-health', '◎'],
  ['Notifications', 'notifications', '♢'],
  ['Email Logs', 'email-logs', '✉'],
  ['Security', 'security', '◇'],
  ['Platform Settings', 'platform-settings', '⚙'],
  ['Reports', 'reports', '▤'],
  ['Activity Logs', 'activity-logs', '☷'],
  ['Support Tickets', 'support-tickets', '?'],
];

const titles = {
  dashboard: ['Overview Dashboard', 'Platform command center for companies, users, demos, revenue and website health.'],
  companies: ['Companies', 'Manage companies, owners, plans, trial status and activation.'],
  'users-roles': ['Users & Roles', 'Monitor platform users, roles and access status.'],
  subscriptions: ['Subscriptions', 'Manage trials, paid plans, billing and expiry risk.'],
  'revenue-plans': ['Revenue & Plans', 'Revenue summary, plan mix and growth performance.'],
  'leads-monitor': ['Leads Monitor', 'Track CRM leads across all companies.'],
  'demo-requests': ['Demo Requests', 'Landing page Book Demo submissions from customers.'],
  'website-health': ['Website Health', 'Monitor website, app, SSL, uptime and response time.'],
  notifications: ['Notifications', 'System notifications and alerts.'],
  'email-logs': ['Email Logs', 'OTP, demo alert and report email logs.'],
  security: ['Security', 'Access, security and platform protection overview.'],
  'platform-settings': ['Platform Settings', 'Global platform configuration.'],
  reports: ['Reports', 'Export companies, users, demos and revenue reports.'],
  'activity-logs': ['Activity Logs', 'Audit trail of user, demo and platform activity.'],
  'support-tickets': ['Support Tickets', 'Client issues, tickets and follow-up queue.'],
};

const aliases = { users: 'users-roles', roles: 'users-roles', billing: 'subscriptions', settings: 'platform-settings' };
const normalizeView = (value) => aliases[value] || value || 'dashboard';
const go = (view) => { window.history.pushState({}, '', `/super-admin/${view === 'dashboard' ? 'dashboard' : view}`); window.dispatchEvent(new Event('salesflow:navigate')); };
const fmtDate = (value) => { const d = value ? new Date(value) : null; return d && !Number.isNaN(d.getTime()) ? d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'; };
const searchRows = (rows, query) => { const q = String(query || '').toLowerCase(); return !q ? (rows || []) : (rows || []).filter((row) => Object.values(row).join(' ').toLowerCase().includes(q)); };
const badgeTone = (value) => { const text = String(value || '').toLowerCase(); if (/active|paid|sent|delivered|up|valid|converted|scheduled|won/.test(text)) return 'green'; if (/trial|pending|new|contacted|progress|degraded/.test(text)) return 'orange'; if (/expired|inactive|failed|down|open|rejected|lost|suspend/.test(text)) return 'red'; return 'blue'; };

function Badge({ value }) { return <span className={`sfsa-badge ${badgeTone(value)}`}>{value || '-'}</span>; }
function Empty() { return <div className="sfsa-empty">No records found.</div>; }
function StatCard({ icon, label, value, hint }) { return <article className="sfsa-stat"><span>{icon}</span><div><small>{label}</small><strong>{value}</strong><em>{hint || 'Live CRM'}</em></div></article>; }
function Panel({ title, subtitle, action, children }) { return <section className="sfsa-panel"><header><div><h2>{title}</h2>{subtitle && <p>{subtitle}</p>}</div>{action}</header>{children}</section>; }
function Table({ rows, columns }) { return <div className="sfsa-table"><table><thead><tr>{columns.map((c) => <th key={c.key}>{c.label}</th>)}</tr></thead><tbody>{rows.map((row, index) => <tr key={row.id || index}>{columns.map((c) => <td key={c.key}>{c.badge ? <Badge value={row[c.key]} /> : c.date ? fmtDate(row[c.key]) : c.main ? <><strong>{row[c.key] || '-'}</strong><small>{row[c.sub] || ''}</small></> : row[c.key] ?? '-'}</td>)}</tr>)}</tbody></table>{!rows.length && <Empty />}</div>; }
function Bars({ data = [] }) { const values = data.length ? data.map((x) => Math.max(26, Math.min(94, Number(x.users || x.value || 5) * 8))) : [40, 58, 46, 74, 66, 88, 72, 94]; return <div className="sfsa-bars">{values.map((v, i) => <i key={i} style={{ '--h': `${v}%` }} />)}</div>; }
function HealthDots({ checks = [] }) { const list = checks.length ? checks : Array.from({ length: 20 }, () => 1); return <div className="sfsa-dots">{list.map((ok, i) => <i key={i} className={ok ? 'ok' : 'bad'} />)}</div>; }

function Stats({ data }) {
  const s = data.stats || {};
  return <section className="sfsa-stats"><StatCard icon="🏢" label="Total Companies" value={s.totalCompanies || 0} hint="Workspaces" /><StatCard icon="✅" label="Active Companies" value={s.activeCompanies || 0} hint="Healthy accounts" /><StatCard icon="⏱" label="Trial Companies" value={s.trialCompanies || 0} hint="Trial pipeline" /><StatCard icon="👥" label="Total Users" value={s.totalUsers || 0} hint={`${s.activeUsers || 0} active`} /><StatCard icon="📥" label="Demo Requests" value={s.demoRequests || 0} hint="Landing leads" /><StatCard icon="🎯" label="Total Leads" value={s.totalLeads || 0} hint="CRM leads" /><StatCard icon="₹" label="Monthly Revenue" value={`₹${Number(s.monthlyRevenue || 0).toLocaleString('en-IN')}`} hint="Estimate" /><StatCard icon="⚡" label="Uptime" value={s.uptime || '99.98%'} hint="Website health" /></section>;
}

function Overview({ data, query }) {
  const companies = searchRows(data.companies, query).slice(0, 8);
  const demos = searchRows(data.demoRequests, query).slice(0, 6);
  return <><Stats data={data} /><section className="sfsa-grid two"><Panel title="Growth Overview" subtitle="Platform growth trend."><Bars data={data.growth || []} /></Panel><Panel title="Website Health" subtitle="Public website and app monitor." action={<button onClick={() => go('website-health')}>Open</button>}><div className="sfsa-list">{(data.websiteHealth || []).slice(0, 4).map((site) => <div key={site.id}><b>{site.status === 'Up' ? '🟢' : '🟠'} {site.company}</b><small>{site.url}</small><em>{site.responseTime}ms</em></div>)}</div></Panel></section><section className="sfsa-grid wide"><Panel title="Recent Companies" subtitle="Company plan and status." action={<button onClick={() => go('companies')}>View All</button>}><Table rows={companies} columns={[{ key: 'name', label: 'Company', main: true, sub: 'adminEmail' }, { key: 'plan', label: 'Plan', badge: true }, { key: 'status', label: 'Status', badge: true }, { key: 'users', label: 'Users' }, { key: 'createdAt', label: 'Created', date: true }]} /></Panel><Panel title="Demo Requests" subtitle="Latest Book Demo submissions." action={<button onClick={() => go('demo-requests')}>Open</button>}><div className="sfsa-list">{demos.map((demo) => <div key={demo.id}><b>{demo.fullName}</b><small>{demo.companyName} · {demo.email}</small><Badge value={demo.status} /></div>)}{!demos.length && <Empty />}</div></Panel></section></>;
}

function Companies({ data, query }) { return <><Stats data={data} /><Panel title="Company Management" subtitle="Connected to CRM companies table."><Table rows={searchRows(data.companies, query)} columns={[{ key: 'name', label: 'Company', main: true, sub: 'adminEmail' }, { key: 'plan', label: 'Plan', badge: true }, { key: 'status', label: 'Status', badge: true }, { key: 'users', label: 'Users' }, { key: 'trialDaysLeft', label: 'Trial Days' }, { key: 'createdAt', label: 'Created', date: true }]} /></Panel></>; }
function Users({ data, query }) { return <><Stats data={data} /><Panel title="Users & Roles" subtitle="Connected platform profiles."><Table rows={searchRows(data.recentUsers, query)} columns={[{ key: 'name', label: 'User', main: true, sub: 'email' }, { key: 'companyName', label: 'Company' }, { key: 'role', label: 'Role', badge: true }, { key: 'isActive', label: 'Active' }, { key: 'createdAt', label: 'Created', date: true }]} /></Panel></>; }
function DemoRequests({ data, query }) { return <><Stats data={data} /><Panel title="Book Demo Requests" subtitle="Connected to Supabase demo_requests table."><Table rows={searchRows(data.demoRequests, query)} columns={[{ key: 'fullName', label: 'Name', main: true, sub: 'email' }, { key: 'mobile', label: 'Mobile' }, { key: 'companyName', label: 'Company' }, { key: 'teamSize', label: 'Team' }, { key: 'requirement', label: 'Need' }, { key: 'preferredTime', label: 'Time' }, { key: 'status', label: 'Status', badge: true }, { key: 'createdAt', label: 'Created', date: true }]} /></Panel></>; }
function WebsiteHealth({ data, query }) { const sites = searchRows(data.websiteHealth, query); return <><Stats data={data} /><Panel title="Website Health Monitor" subtitle="Uploaded health layout with CRM connected data."><div className="sfsa-sites">{sites.map((site) => <article key={site.id}><header><b>{site.status === 'Up' ? '🟢' : '🟠'} {site.company}</b><Badge value={site.status} /></header><p>{site.url}</p><div><span><b>{site.uptime}</b><small>Uptime</small></span><span><b>{site.responseTime}ms</b><small>Response</small></span><span><b>{site.ssl}</b><small>SSL</small></span></div><HealthDots checks={site.checks} /></article>)}</div></Panel></>; }
function GenericPage({ view, data, query }) { const map = { 'leads-monitor': [data.leads || [], [{ key: 'leadName', label: 'Lead', main: true, sub: 'company' }, { key: 'assignedTo', label: 'Assigned' }, { key: 'status', label: 'Status', badge: true }, { key: 'followUp', label: 'Follow-up' }]], notifications: [data.notifications || [], [{ key: 'title', label: 'Title', main: true, sub: 'company' }, { key: 'priority', label: 'Priority', badge: true }, { key: 'status', label: 'Status', badge: true }, { key: 'time', label: 'Time' }]], 'email-logs': [data.emailLogs || [], [{ key: 'type', label: 'Type', main: true, sub: 'subject' }, { key: 'to', label: 'To' }, { key: 'status', label: 'Status', badge: true }, { key: 'time', label: 'Time' }]], 'activity-logs': [data.activityLogs || [], [{ key: 'time', label: 'Time' }, { key: 'name', label: 'User', main: true, sub: 'email' }, { key: 'company', label: 'Company' }, { key: 'action', label: 'Action', badge: true }]], 'support-tickets': [data.supportTickets || [], [{ key: 'subject', label: 'Subject', main: true, sub: 'owner' }, { key: 'company', label: 'Company' }, { key: 'priority', label: 'Priority', badge: true }, { key: 'status', label: 'Status', badge: true }]] };
  const [rows = [], cols = []] = map[view] || [[], []]; if (!cols.length) return <><Stats data={data} /><Panel title={(titles[view] || titles.reports)[0]} subtitle="Platform configuration ready."><div className="sfsa-sites">{['Trial 7 days', 'OTP enabled', 'Demo alerts enabled', 'Role based access', 'Company isolation', 'Export reports'].map((x) => <article key={x}><header><b>{x}</b></header><p>Super Admin control ready.</p></article>)}</div></Panel></>; return <><Stats data={data} /><Panel title={(titles[view] || titles.reports)[0]} subtitle="Connected CRM records."><Table rows={searchRows(rows, query)} columns={cols} /></Panel></>;
}

function SuperAdminLayout({ view, query, setQuery, loading, load, children }) {
  const title = titles[view] || titles.dashboard;
  return <div className="sfsa-root"><aside className="sfsa-sidebar"><div className="sfsa-brand"><div className="sfsa-logo">SH</div><div><strong>SalesFlow Hub</strong><small>Super Admin</small></div></div><nav>{navItems.map(([label, route, icon]) => <button key={route} className={view === route ? 'active' : ''} onClick={() => go(route)}><span>{icon}</span><em>{label}</em>{label === 'Notifications' && <b>12</b>}{label === 'Website Health' && <b>4</b>}</button>)}</nav><footer><span /> <p>View Platform Status</p><small>© 2026 SalesFlow Hub<br />All rights reserved.</small></footer></aside><main className="sfsa-main"><header className="sfsa-topbar"><div className="sfsa-search"><span>⌕</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search companies, users, invoices, tickets..." /><kbd>⌘K</kbd></div><div className="sfsa-date">May 12 – Jun 12, 2026</div><button className="sfsa-bell">🔔<b>8</b></button><button className="sfsa-help">?</button><div className="sfsa-profile"><span>SA</span><div><strong>Super Admin</strong><small>superadmin@salesflowhub.cloud</small></div></div></header><section className="sfsa-content"><div className="sfsa-title"><div><h1>{title[0]}</h1><p>{title[1]}</p></div><button onClick={load}>{loading ? 'Loading...' : 'Refresh'}</button></div>{children}</section></main></div>;
}

export default function SuperAdminPortal({ view: rawView = 'dashboard' }) {
  const view = normalizeView(rawView);
  const [data, setData] = useState({ stats: {}, companies: [], recentUsers: [], demoRequests: [], websiteHealth: [] });
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const load = async () => { try { setLoading(true); setMessage(''); const response = await fetch('/api/super-admin-overview'); const result = await response.json(); if (!response.ok || result.ok === false) throw new Error(result.message || 'Unable to load data'); setData(result); } catch (error) { setMessage(error.message || 'Unable to load data'); } finally { setLoading(false); } };
  useEffect(() => { load(); }, []);
  const page = useMemo(() => { if (view === 'dashboard') return <Overview data={data} query={query} />; if (view === 'companies') return <Companies data={data} query={query} />; if (view === 'users-roles') return <Users data={data} query={query} />; if (view === 'demo-requests') return <DemoRequests data={data} query={query} />; if (view === 'website-health') return <WebsiteHealth data={data} query={query} />; return <GenericPage view={view} data={data} query={query} />; }, [view, data, query]);
  return <SuperAdminLayout view={view} query={query} setQuery={setQuery} loading={loading} load={load}>{message && <div className="sfsa-message">{message}</div>}{page}</SuperAdminLayout>;
}
