import { useEffect, useMemo, useState } from 'react';
import { SaasEmpty, SaasLayout, SaasStats, goTo } from '../../components/saas/SaasLayout.jsx';
import { getAdminReportsData, getCompanyAdminSummary } from '../../services/crmModulesApi.js';

function titleFor(view) {
  const map = { users: 'Users', roles: 'Roles & Permissions', teams: 'Teams', reports: 'Company Reports', settings: 'Company Settings', companies: 'Company', tasks: 'Company Tasks', activities: 'Company Activities', calendar: 'Company Calendar' };
  return map[view] || 'Company Admin';
}
function fmt(value) { return value ? new Date(value).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'; }
function roleBadge(role) { if (role === 'company_admin') return 'purple'; if (role === 'manager') return 'orange'; return 'green'; }

export default function AdminModulePage({ view = 'users' }) {
  const [summary, setSummary] = useState(null);
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function load() {
    setLoading(true); setError('');
    try {
      const [adminSummary, reportData] = await Promise.all([getCompanyAdminSummary(), getAdminReportsData()]);
      setSummary(adminSummary);
      setReports(reportData);
    } catch (err) {
      setError(err.message || 'Unable to load admin module.');
    } finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);

  const users = summary?.users || [];
  const leads = summary?.leads || [];
  const tasks = summary?.tasks || [];
  const activities = summary?.activities || [];
  const teams = useMemo(() => {
    const grouped = new Map();
    users.forEach((user) => { const key = user.role || 'employee'; grouped.set(key, [...(grouped.get(key) || []), user]); });
    return [...grouped.entries()].map(([role, members]) => ({ role, members }));
  }, [users]);

  let body = null;
  if (view === 'users' || view === 'roles' || view === 'companies') body = <UsersTable users={users} />;
  if (view === 'teams') body = <TeamsTable teams={teams} />;
  if (view === 'tasks' || view === 'calendar') body = <TasksTable tasks={tasks} />;
  if (view === 'activities') body = <ActivitiesTable activities={activities} />;
  if (view === 'reports') body = <ReportsPanel reports={reports} />;
  if (view === 'settings') body = <SettingsPanel summary={summary} />;

  return (
    <SaasLayout role="admin" kicker="Company Admin" title={titleFor(view)} subtitle="Company-wide module with Supabase-scoped data and admin-only visibility." actions={<><button className="saas-btn" onClick={load}>Refresh</button><button className="saas-btn primary" onClick={() => goTo('/leads')}>Open Leads</button></>}>
      {error ? <div className="saas-banner error">{error}</div> : null}
      <SaasStats items={[{ label: 'Company Leads', value: loading ? '...' : summary?.totalLeads || 0, icon: '▣' }, { label: 'Employees', value: summary?.employees || 0, icon: '👥' }, { label: 'Open Tasks', value: summary?.openTasks || 0, icon: '✓' }, { label: 'Overdue', value: summary?.overdue || 0, icon: '!' }]} />
      {body || <SaasEmpty title="Module ready" text="This admin module uses company-scoped Supabase access." />}
    </SaasLayout>
  );
}

function UsersTable({ users }) {
  return <section className="saas-card saas-table-card"><div className="saas-table-wrap"><table className="saas-table"><thead><tr><th>User</th><th>Email</th><th>Role</th><th>Status</th><th>Created</th></tr></thead><tbody>{users.map((user) => <tr key={user.id}><td className="saas-title-cell"><strong>{user.full_name || user.email}</strong><small>{user.phone || '-'}</small></td><td>{user.email}</td><td><span className={`saas-badge ${roleBadge(user.role)}`}>{user.role}</span></td><td><span className={`saas-badge ${user.is_active ? 'green' : 'red'}`}>{user.is_active ? 'Active' : 'Inactive'}</span></td><td>{fmt(user.created_at)}</td></tr>)}</tbody></table></div>{!users.length ? <SaasEmpty title="No users found" text="Create employees from your company user management flow." /> : <footer className="saas-footer">Showing {users.length} users</footer>}</section>;
}
function TeamsTable({ teams }) {
  return <section className="saas-card saas-table-card"><div className="saas-table-wrap"><table className="saas-table"><thead><tr><th>Team / Role</th><th>Members</th><th>Access</th></tr></thead><tbody>{teams.map((team) => <tr key={team.role}><td><span className="saas-badge purple">{team.role}</span></td><td>{team.members.length}</td><td>{team.role === 'employee' ? 'Assigned records only' : 'Company scoped'}</td></tr>)}</tbody></table></div></section>;
}
function TasksTable({ tasks }) {
  return <section className="saas-card saas-table-card"><div className="saas-table-wrap"><table className="saas-table"><thead><tr><th>Task</th><th>Lead</th><th>Owner</th><th>Status</th><th>Due</th></tr></thead><tbody>{tasks.map((task) => <tr key={task.id}><td className="saas-title-cell"><strong>{task.title}</strong><small>{task.type || 'Task'}</small></td><td>{task.lead?.name || '-'}</td><td>{task.owner?.full_name || '-'}</td><td><span className="saas-badge orange">{task.status}</span></td><td>{fmt(task.due_at)}</td></tr>)}</tbody></table></div>{!tasks.length ? <SaasEmpty title="No tasks" text="Company tasks will appear here after assignment." /> : <footer className="saas-footer">Showing {tasks.length} tasks</footer>}</section>;
}
function ActivitiesTable({ activities }) {
  return <section className="saas-card saas-table-card"><div className="saas-table-wrap"><table className="saas-table"><thead><tr><th>Activity</th><th>Lead</th><th>User</th><th>When</th></tr></thead><tbody>{activities.map((activity) => <tr key={activity.id}><td className="saas-title-cell"><strong>{activity.title || activity.type}</strong><small>{activity.note || '-'}</small></td><td>{activity.lead?.name || '-'}</td><td>{activity.user?.full_name || '-'}</td><td>{fmt(activity.activity_at || activity.created_at)}</td></tr>)}</tbody></table></div></section>;
}
function ReportsPanel({ reports }) {
  return <section className="saas-panel-grid"><article className="saas-card saas-panel"><h2>Company Performance</h2><SaasStats items={[{ label: 'Total Leads', value: reports?.totalLeads || 0 }, { label: 'Won Leads', value: reports?.wonLeads || 0 }, { label: 'Conversion', value: `${reports?.conversionRate || 0}%` }, { label: 'New Today', value: reports?.newToday || 0 }]} /></article><article className="saas-card saas-panel"><h2>Revenue</h2><strong style={{fontSize: 36}}>₹{Number(reports?.revenue || 0).toLocaleString('en-IN')}</strong><p>Calculated from won lead values.</p></article></section>;
}
function SettingsPanel({ summary }) {
  const profile = summary?.profile || {};
  return <section className="saas-card saas-panel"><h2>Company Admin Settings</h2><div className="saas-form"><label>Admin Name<input readOnly value={profile.full_name || ''} /></label><label>Email<input readOnly value={profile.email || ''} /></label><label>Role<input readOnly value={profile.role || ''} /></label><label>Company ID<input readOnly value={profile.company_id || ''} /></label></div></section>;
}
