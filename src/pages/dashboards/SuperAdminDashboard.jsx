import { useEffect, useMemo, useState } from 'react';
import DashboardSidebar from '../../components/dashboard/DashboardSidebar.jsx';
import '../../styles/dashboardBase.css';
import '../../styles/referenceDashboardExact.css';
import '../../styles/sidebarGlobalFinalLock.css';
import '../../styles/superAdminPremium.css';

const emptyData = { stats: {}, recentUsers: [], companies: [], pendingSignups: [], growth: [], generatedAt: '' };

const DASHBOARD_STYLE = `
html body #root .sf-dashboard.super-admin-premium-page{min-height:100vh!important;background:radial-gradient(circle at 8% 2%,rgba(37,99,235,.30),transparent 29%),radial-gradient(circle at 90% 0%,rgba(124,58,237,.26),transparent 32%),linear-gradient(135deg,#020817 0%,#071426 54%,#020817 100%)!important;color:#f8fafc!important;}
html body #root .super-admin-premium-page .sfx-sidebar{position:fixed!important;left:0!important;top:0!important;bottom:0!important;width:310px!important;background:linear-gradient(180deg,#020817,#07162c 58%,#030712)!important;border-right:1px solid rgba(148,163,184,.14)!important;box-shadow:22px 0 60px rgba(0,0,0,.34)!important;z-index:50!important;}
html body #root .super-admin-premium-page .sfx-nav{padding-right:10px!important;}
html body #root .super-admin-premium-page .sfx-nav button{height:44px!important;border-radius:14px!important;color:#dbeafe!important;margin-bottom:4px!important;}
html body #root .super-admin-premium-page .sfx-nav button.active{background:linear-gradient(135deg,#2563eb,#7c3aed)!important;color:#fff!important;box-shadow:0 16px 30px rgba(37,99,235,.28)!important;}
html body #root .super-admin-premium-page .sfx-upgrade,html body #root .super-admin-premium-page .sfx-help{background:rgba(15,23,42,.72)!important;border-color:rgba(148,163,184,.16)!important;color:#e2e8f0!important;}
html body #root .super-admin-premium-page .super-admin-main{margin-left:310px!important;width:calc(100vw - 310px)!important;max-width:calc(100vw - 310px)!important;min-height:100vh!important;padding:20px 26px 46px!important;background:transparent!important;color:#f8fafc!important;box-sizing:border-box!important;overflow-x:hidden!important;}
html body #root .sa-dashboard-inner{width:100%!important;max-width:1480px!important;margin:0 auto!important;}
html body #root .sa-topbar{display:grid!important;grid-template-columns:minmax(0,1fr) minmax(360px,520px) auto!important;gap:16px!important;align-items:center!important;margin:0 0 16px!important;padding:16px 18px!important;border:1px solid rgba(148,163,184,.14)!important;border-radius:26px!important;background:linear-gradient(180deg,rgba(15,23,42,.78),rgba(8,18,34,.70))!important;box-shadow:0 22px 60px rgba(0,0,0,.24)!important;}
html body #root .sa-title h1{margin:8px 0 5px!important;font-size:32px!important;line-height:1!important;letter-spacing:-.055em!important;color:#fff!important;}
html body #root .sa-title p{margin:0!important;color:#a8b4c7!important;font-size:14px!important;}
html body #root .super-kicker{display:inline-flex!important;padding:7px 11px!important;border-radius:999px!important;background:rgba(37,99,235,.16)!important;border:1px solid rgba(96,165,250,.34)!important;color:#bfdbfe!important;font-size:12px!important;font-weight:950!important;}
html body #root .sa-search{height:48px!important;padding:0 14px!important;border-radius:17px!important;border:1px solid rgba(148,163,184,.18)!important;background:rgba(2,8,23,.50)!important;display:flex!important;align-items:center!important;gap:10px!important;color:#93c5fd!important;}
html body #root .sa-search input{width:100%!important;border:0!important;outline:0!important;background:transparent!important;color:#fff!important;font:inherit!important;}
html body #root .sa-search input::placeholder{color:#748399!important;}
html body #root .sa-top-actions{display:flex!important;align-items:center!important;gap:10px!important;justify-content:flex-end!important;}
html body #root .sa-icon-btn,html body #root .sa-refresh{height:44px!important;border-radius:15px!important;border:1px solid rgba(148,163,184,.18)!important;background:rgba(15,23,42,.72)!important;color:#e2e8f0!important;font-weight:900!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;cursor:pointer!important;}
html body #root .sa-icon-btn{width:44px!important;position:relative!important;}
html body #root .sa-icon-btn b{position:absolute!important;right:7px!important;top:6px!important;width:8px!important;height:8px!important;background:#ef4444!important;border-radius:999px!important;}
html body #root .sa-refresh{padding:0 15px!important;background:linear-gradient(135deg,#2563eb,#7c3aed)!important;color:#fff!important;box-shadow:0 14px 30px rgba(37,99,235,.25)!important;}
html body #root .sa-stats-grid{display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr))!important;gap:14px!important;margin:0 0 16px!important;}
html body #root .sa-stat-card{min-height:126px!important;padding:18px!important;border-radius:23px!important;border:1px solid rgba(148,163,184,.16)!important;background:linear-gradient(180deg,rgba(15,23,42,.92),rgba(7,18,34,.96))!important;box-shadow:0 22px 55px rgba(0,0,0,.28)!important;display:grid!important;grid-template-columns:54px minmax(0,1fr)!important;gap:13px!important;position:relative!important;overflow:hidden!important;color:#fff!important;}
html body #root .sa-stat-card:before{content:""!important;position:absolute!important;inset:-1px!important;background:radial-gradient(circle at 16% 10%,rgba(59,130,246,.22),transparent 34%)!important;pointer-events:none!important;}
html body #root .sa-stat-icon{width:52px!important;height:52px!important;border-radius:18px!important;background:rgba(59,130,246,.18)!important;display:grid!important;place-items:center!important;font-size:24px!important;position:relative!important;}
html body #root .sa-stat-card small{display:block!important;color:#cbd5e1!important;font-weight:850!important;position:relative!important;}
html body #root .sa-stat-card strong{display:block!important;color:#fff!important;font-size:30px!important;line-height:1!important;margin:7px 0!important;letter-spacing:-.045em!important;position:relative!important;}
html body #root .sa-stat-card em{display:block!important;color:#34d399!important;font-style:normal!important;font-size:12px!important;font-weight:900!important;position:relative!important;}
html body #root .sa-stat-card i{position:absolute!important;right:14px!important;top:13px!important;width:20px!important;height:20px!important;border-radius:999px!important;border:1px solid rgba(203,213,225,.32)!important;color:#93a4ba!important;font-style:normal!important;font-size:11px!important;display:grid!important;place-items:center!important;}
html body #root .sa-main-grid{display:grid!important;grid-template-columns:minmax(0,1.5fr) minmax(360px,.82fr)!important;gap:16px!important;margin-bottom:16px!important;}
html body #root .sa-secondary-grid{display:grid!important;grid-template-columns:minmax(0,1.18fr) minmax(320px,.82fr)!important;gap:16px!important;}
html body #root .sa-panel{border-radius:24px!important;border:1px solid rgba(148,163,184,.16)!important;background:linear-gradient(180deg,rgba(15,23,42,.92),rgba(7,18,34,.96))!important;box-shadow:0 22px 55px rgba(0,0,0,.28)!important;overflow:hidden!important;color:#f8fafc!important;}
html body #root .sa-panel-head{display:flex!important;align-items:flex-start!important;justify-content:space-between!important;gap:12px!important;padding:18px 20px 12px!important;}
html body #root .sa-panel-head h2{margin:0!important;color:#fff!important;font-size:18px!important;letter-spacing:-.035em!important;}
html body #root .sa-panel-head p{margin:5px 0 0!important;color:#97a6bb!important;font-size:13px!important;}
html body #root .sa-panel-head span,html body #root .sa-panel-head button{display:inline-flex!important;align-items:center!important;justify-content:center!important;min-height:34px!important;padding:0 12px!important;border-radius:999px!important;border:1px solid rgba(96,165,250,.22)!important;background:rgba(37,99,235,.14)!important;color:#bfdbfe!important;font-weight:950!important;cursor:pointer!important;}
html body #root .sa-chart{height:306px!important;padding:4px 16px 14px!important;}
html body #root .sa-chart svg{width:100%!important;height:100%!important;}
html body #root .sa-chart-grid{stroke:rgba(148,163,184,.15)!important;}
html body #root .sa-chart-fill{fill:#4f46e5!important;opacity:.20!important;}
html body #root .sa-chart-line{fill:none!important;stroke:#8b5cf6!important;stroke-width:5!important;stroke-linecap:round!important;stroke-linejoin:round!important;filter:drop-shadow(0 0 10px rgba(139,92,246,.45))!important;}
html body #root .sa-chart-dot{fill:#93c5fd!important;stroke:#071426!important;stroke-width:4!important;}
html body #root .sa-chart-label{fill:#8ea2bd!important;font-size:12px!important;font-weight:800!important;}
html body #root .sa-bar-chart{height:306px!important;padding:28px 22px 22px!important;display:grid!important;grid-template-columns:repeat(12,1fr)!important;gap:10px!important;align-items:end!important;}
html body #root .sa-bar-chart span{height:100%!important;border-radius:999px!important;background:rgba(148,163,184,.08)!important;display:flex!important;align-items:end!important;overflow:hidden!important;}
html body #root .sa-bar-chart b{display:block!important;width:100%!important;height:var(--h)!important;border-radius:999px!important;background:linear-gradient(180deg,#38bdf8,#2563eb 55%,#7c3aed)!important;box-shadow:0 0 18px rgba(59,130,246,.36)!important;}
html body #root .sa-activity-list{padding:0 16px 16px!important;display:grid!important;}
html body #root .sa-activity-row{display:grid!important;grid-template-columns:42px minmax(0,1fr) auto!important;gap:12px!important;align-items:center!important;padding:13px 2px!important;border-top:1px solid rgba(148,163,184,.12)!important;color:#f8fafc!important;}
html body #root .sa-activity-row:first-child{border-top:0!important;}
html body #root .sa-activity-row>span{width:40px!important;height:40px!important;border-radius:15px!important;background:linear-gradient(135deg,#2563eb,#7c3aed)!important;display:grid!important;place-items:center!important;font-weight:950!important;color:#fff!important;}
html body #root .sa-activity-row strong,html body #root .sa-activity-row small{display:block!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important;}
html body #root .sa-activity-row small{color:#97a6bb!important;margin-top:3px!important;}
html body #root .sa-activity-row em{font-style:normal!important;color:#9fb1c8!important;font-size:12px!important;font-weight:900!important;}
html body #root .sa-table-wrap{overflow:auto!important;padding:0 16px 16px!important;}
html body #root .sa-table-wrap table{width:100%!important;min-width:760px!important;border-collapse:collapse!important;}
html body #root .sa-table-wrap th{text-align:left!important;color:#91a4bd!important;background:rgba(15,23,42,.44)!important;font-size:12px!important;padding:13px 12px!important;border-bottom:1px solid rgba(148,163,184,.14)!important;}
html body #root .sa-table-wrap td{padding:14px 12px!important;border-bottom:1px solid rgba(148,163,184,.10)!important;color:#e5edf8!important;font-weight:800!important;}
html body #root .sa-table-wrap td small{display:block!important;color:#7f90a7!important;margin-top:4px!important;}
html body #root .super-pill{display:inline-flex!important;align-items:center!important;border-radius:999px!important;padding:6px 10px!important;font-size:12px!important;font-weight:950!important;border:1px solid transparent!important;}
html body #root .super-pill.blue{background:rgba(37,99,235,.18)!important;color:#93c5fd!important;border-color:rgba(59,130,246,.22)!important;}
html body #root .super-pill.green{background:rgba(34,197,94,.15)!important;color:#86efac!important;border-color:rgba(34,197,94,.24)!important;}
html body #root .super-pill.orange{background:rgba(245,158,11,.15)!important;color:#fbbf24!important;border-color:rgba(245,158,11,.24)!important;}
html body #root .super-pill.red{background:rgba(239,68,68,.15)!important;color:#fca5a5!important;border-color:rgba(239,68,68,.24)!important;}
html body #root .sa-user-list{padding-bottom:10px!important;}
html body #root .sa-user-row{display:grid!important;grid-template-columns:42px minmax(0,1fr) auto!important;gap:12px!important;align-items:center!important;padding:14px 18px!important;border-top:1px solid rgba(148,163,184,.12)!important;}
html body #root .sa-user-row>span{width:40px!important;height:40px!important;border-radius:15px!important;background:rgba(59,130,246,.18)!important;color:#bfdbfe!important;display:grid!important;place-items:center!important;font-weight:950!important;}
html body #root .sa-user-row button{border:0!important;border-radius:12px!important;padding:9px 11px!important;color:#fff!important;font-weight:900!important;cursor:pointer!important;}
html body #root .sa-user-row button.danger{background:#ef4444!important;}html body #root .sa-user-row button.success{background:#16a34a!important;}
@media(max-width:1280px){html body #root .sa-topbar{grid-template-columns:1fr!important;}html body #root .sa-main-grid,html body #root .sa-secondary-grid{grid-template-columns:1fr!important;}html body #root .sa-stats-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important;}}
@media(max-width:900px){html body #root .super-admin-premium-page .sfx-sidebar{position:relative!important;width:100%!important;}html body #root .super-admin-premium-page .super-admin-main{margin-left:0!important;width:100%!important;max-width:100%!important;padding:16px 12px 40px!important;}html body #root .sa-stats-grid{grid-template-columns:1fr!important;}}
`;

function SuperAdminRuntimeStyle() { return <style id="super-admin-dashboard-image-layout-lock">{DASHBOARD_STYLE}</style>; }
function formatDate(value) { if (!value) return '-'; const date = new Date(value); if (Number.isNaN(date.getTime())) return '-'; return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }); }
function statusClass(status) { const text = String(status || '').toLowerCase(); if (text.includes('active') || text.includes('paid')) return 'green'; if (text.includes('trial') || text.includes('pending')) return 'orange'; if (text.includes('expired') || text.includes('inactive') || text.includes('suspend')) return 'red'; return 'blue'; }
function initials(value) { return String(value || 'S').trim().slice(0, 1).toUpperCase(); }
function navigateTo(path) { window.history.pushState({}, '', path); window.dispatchEvent(new Event('salesflow:navigate')); }

function StatCard({ icon, label, value, trend, tone = 'blue' }) {
  return <article className={`sa-stat-card tone-${tone}`}><span className="sa-stat-icon">{icon}</span><div><small>{label}</small><strong>{value}</strong><em>{trend}</em></div><i>i</i></article>;
}

function RevenueChart({ growth = [] }) {
  const points = useMemo(() => {
    const source = growth.length ? growth : [{ month: 'May 12', users: 30 }, { month: 'May 19', users: 48 }, { month: 'May 26', users: 42 }, { month: 'Jun 02', users: 70 }, { month: 'Jun 09', users: 61 }, { month: 'Jun 12', users: 92 }];
    const max = Math.max(...source.map((item) => Number(item.users) || 0), 1);
    return source.slice(-8).map((item, index, arr) => ({ ...item, x: arr.length === 1 ? 80 : 50 + (index * 610) / Math.max(arr.length - 1, 1), y: 210 - ((Number(item.users) || 0) / max) * 150 }));
  }, [growth]);
  const line = points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ');
  const fill = `${line} L ${points[points.length - 1]?.x || 50} 226 L ${points[0]?.x || 50} 226 Z`;
  return <div className="sa-chart"><svg viewBox="0 0 720 260" aria-label="Platform growth chart">{[60,100,140,180,220].map((y) => <line key={y} x1="44" y1={y} x2="680" y2={y} className="sa-chart-grid" />)}<path d={fill} className="sa-chart-fill" /><path d={line} className="sa-chart-line" />{points.map((point) => <circle key={`${point.month}-${point.x}`} cx={point.x} cy={point.y} r="5" className="sa-chart-dot" />)}{points.map((point, index) => <text key={`${point.month}-${index}`} x={point.x - 18} y="248" className="sa-chart-label">{point.month}</text>)}</svg></div>;
}

function BarChart() { const bars = [48,35,70,44,82,52,64,88,46,72,91,55]; return <div className="sa-bar-chart">{bars.map((height, index) => <span key={index} style={{ '--h': `${height}%` }}><b /></span>)}</div>; }

export default function SuperAdminDashboard() {
  const [data, setData] = useState(emptyData);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const loadData = async () => {
    try {
      setLoading(true); setMessage('');
      const response = await fetch('/api/super-admin-overview');
      const result = await response.json();
      if (!response.ok || result.ok === false) throw new Error(result.message || 'Unable to load dashboard data.');
      setData(result);
    } catch (error) { setMessage(error.message || 'Unable to load dashboard data.'); }
    finally { setLoading(false); }
  };
  useEffect(() => { loadData(); }, []);

  const toggleUser = async (user) => {
    try {
      setMessage('');
      const response = await fetch('/api/super-admin-overview', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'toggleUser', userId: user.id, isActive: !user.isActive }) });
      const result = await response.json();
      if (!response.ok || result.ok === false) throw new Error(result.message || 'Unable to update user.');
      setMessage(result.message || 'Updated successfully.');
      loadData();
    } catch (error) { setMessage(error.message || 'Unable to update user.'); }
  };

  const stats = data.stats || {};
  const companies = data.companies || [];
  const recentUsers = data.recentUsers || [];
  const pendingSignups = data.pendingSignups || [];
  const superName = localStorage.getItem('salesflow_user_email')?.split('@')[0] || 'Super Admin';
  const activeCompanies = stats.activeCompanies || companies.filter((company) => String(company.status || '').toLowerCase().includes('active')).length || 0;
  const trialCompanies = stats.trialCompanies || companies.filter((company) => String(company.status || '').toLowerCase().includes('trial')).length || 0;
  const paidCompanies = stats.paidCompanies || companies.filter((company) => String(company.plan || '').toLowerCase() !== 'free').length || 0;
  const expiredTrials = stats.expiredTrials || companies.filter((company) => Number(company.trialDaysLeft) < 0).length || 0;

  return (
    <div className="sf-dashboard super-admin-premium-page sa-dark-shell">
      <SuperAdminRuntimeStyle />
      <DashboardSidebar role="superAdmin" />
      <main className="super-admin-main sa-main">
        <div className="sa-dashboard-inner">
          <header className="sa-topbar">
            <div className="sa-title"><span className="super-kicker">SalesFlow Hub · Super Admin</span><h1>Overview Dashboard</h1><p>Welcome back, {superName}. Real-time platform overview and key metrics at a glance.</p></div>
            <label className="sa-search"><span>⌕</span><input placeholder="Search companies, users, invoices, tickets..." /></label>
            <div className="sa-top-actions"><button className="sa-icon-btn" type="button">🔔<b /></button><button className="sa-icon-btn" type="button">?</button><button className="sa-refresh" type="button" onClick={loadData}>{loading ? 'Loading...' : 'Refresh'}</button></div>
          </header>
          {message && <div className="super-message sa-message">{message}</div>}
          <section className="sa-stats-grid">
            <StatCard icon="🏢" label="Total Companies" value={stats.totalCompanies || companies.length || 0} trend="↑ platform workspaces" tone="blue" />
            <StatCard icon="✅" label="Active Companies" value={activeCompanies} trend="↑ healthy accounts" tone="green" />
            <StatCard icon="⏱" label="Trial Companies" value={trialCompanies} trend="↑ trial pipeline" tone="purple" />
            <StatCard icon="💳" label="Paid Companies" value={paidCompanies} trend="↑ paid customers" tone="blue" />
            <StatCard icon="⌛" label="Expired Trials" value={expiredTrials} trend="needs follow-up" tone="orange" />
            <StatCard icon="👥" label="Total Users" value={stats.totalUsers || recentUsers.length || 0} trend={`${stats.activeUsers || 0} active users`} tone="cyan" />
            <StatCard icon="₹" label="Monthly Revenue" value={stats.monthlyRevenue ? `₹${stats.monthlyRevenue}` : '₹0'} trend="connect billing data" tone="purple" />
            <StatCard icon="📥" label="Pending Signups" value={stats.pendingSignups || pendingSignups.length || 0} trend="waiting verification" tone="red" />
          </section>
          <section className="sa-main-grid">
            <article className="super-card sa-panel"><div className="super-card-head sa-panel-head"><div><h2>Revenue / Growth Overview</h2><p>Connected with Super Admin overview API.</p></div><span>{stats.uptime || '99.98%'} uptime</span></div><RevenueChart growth={data.growth} /></article>
            <article className="super-card sa-panel"><div className="super-card-head sa-panel-head"><div><h2>Company Growth</h2><p>New companies and activation trend.</p></div><span>Monthly</span></div><BarChart /></article>
          </section>
          <section className="sa-secondary-grid">
            <article className="super-card sa-panel"><div className="super-card-head sa-panel-head"><div><h2>Recent Companies</h2><p>Company name, plan, users, status and trial.</p></div><button type="button" onClick={() => navigateTo('/super-admin/companies')}>View All</button></div><div className="super-table-wrap sa-table-wrap"><table><thead><tr><th>Company</th><th>Plan</th><th>Users</th><th>Status</th><th>Trial</th><th>Admin</th></tr></thead><tbody>{companies.slice(0, 7).map((company) => <tr key={company.id || company.name}><td><strong>{company.name}</strong><small>{formatDate(company.createdAt)}</small></td><td><span className="super-pill blue">{company.plan || 'Starter'}</span></td><td>{company.users || 0}</td><td><span className={`super-pill ${statusClass(company.status)}`}>{company.status || 'Active'}</span></td><td>{company.trialDaysLeft === null || company.trialDaysLeft === undefined ? '-' : company.trialDaysLeft >= 0 ? `${company.trialDaysLeft} days left` : 'Expired'}</td><td>{company.adminEmail || '-'}</td></tr>)}</tbody></table>{!loading && !companies.length && <p className="super-empty">No companies found.</p>}</div></article>
            <article className="super-card sa-panel"><div className="super-card-head sa-panel-head"><div><h2>Recent Activity</h2><p>Latest users and signups.</p></div><button type="button" onClick={() => navigateTo('/super-admin/activity-logs')}>View All</button></div><div className="sa-activity-list">{recentUsers.slice(0, 5).map((user) => <div className="sa-activity-row" key={user.id || user.email}><span>{initials(user.name || user.email)}</span><div><strong>{user.name || 'User'}</strong><small>{user.email}</small></div><em>{user.isActive ? 'Active' : 'Inactive'}</em></div>)}{pendingSignups.slice(0, 3).map((item) => <div className="sa-activity-row" key={item.id || item.email}><span>{initials(item.name || item.email)}</span><div><strong>{item.name || 'Signup'}</strong><small>{item.email}</small></div><em>{item.status || 'Pending'}</em></div>)}{!loading && !recentUsers.length && !pendingSignups.length && <p className="super-empty">No recent activity found.</p>}</div><div className="super-user-list sa-user-list">{recentUsers.slice(0, 4).map((user) => <div className="super-user-row sa-user-row" key={`ctrl-${user.id || user.email}`}><span>{initials(user.name || user.email)}</span><div><strong>{user.name || 'User'}</strong><small>{user.email}</small></div><button type="button" className={user.isActive ? 'danger' : 'success'} onClick={() => toggleUser(user)}>{user.isActive ? 'Deactivate' : 'Activate'}</button></div>)}</div></article>
          </section>
        </div>
      </main>
    </div>
  );
}
