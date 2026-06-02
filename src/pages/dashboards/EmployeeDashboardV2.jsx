import { useEffect, useMemo, useState } from 'react';
import DashboardSidebar from '../../components/dashboard/DashboardSidebar.jsx';
import { createActivity, getMyDashboardSummary, markAllNotificationsRead, updateTask } from '../../services/crmApi.js';
import '../../styles/dashboardBase.css';
import '../../styles/sidebarGlobalFinalLock.css';
import '../../styles/zzzSidebarBlackFix.css';
import '../../styles/employeeDashboardV2.css';
import '../../styles/edc.css';
import '../../styles/edc2.css';
import '../../styles/employeeTopbarDarkFix.css';
import '../../styles/employeeHeaderFinal.css';
import '../../styles/employeeDashboardVisualPolish.css';
import '../../styles/employeePerformanceFinal.css';

function go(path) { window.history.pushState({}, '', path); window.dispatchEvent(new Event('salesflow:navigate')); }
const iconPaths = { search:'M21 21l-4.35-4.35M11 18a7 7 0 1 1 0-14 7 7 0 0 1 0 14Z', bell:'M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0', menu:'M4 7h16M4 12h16M4 17h16', users:'M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2M9.5 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM21 21v-2a4 4 0 0 0-3-3.8M16 3.2a4 4 0 0 1 0 7.6', calendar:'M7 3v4m10-4v4M4 9h16M5 5h14a1 1 0 0 1 1 1v14H4V6a1 1 0 0 1 1-1Z', trophy:'M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4ZM17 6h3a2 2 0 0 1-2 4h-1M7 6H4a2 2 0 0 0 2 4h1', clock:'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20ZM12 6v6l4 2', phone:'M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.77.63 2.6a2 2 0 0 1-.45 2.11L8 9.7a16 16 0 0 0 6.3 6.3l1.27-1.27a2 2 0 0 1 2.11-.45c.83.3 1.7.51 2.6.63A2 2 0 0 1 22 16.92Z', whatsapp:'M20.5 11.7a8.5 8.5 0 0 1-12.6 7.45L3 20.5l1.35-4.75A8.5 8.5 0 1 1 20.5 11.7Z', lightning:'M13 2 3 14h8l-1 8 11-13h-8l1-7Z', target:'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20ZM12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12ZM12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z', logout:'M10 17l5-5-5-5M15 12H3M21 3v18h-7' };
function SvgIcon({ name, className='' }) { return <svg className={`emp-svg-icon ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={iconPaths[name] || iconPaths.users}/></svg>; }
function formatTime(value) { const d = value ? new Date(value) : null; return d && !Number.isNaN(d.getTime()) ? d.toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit',hour12:true}) : '-'; }
function formatDate(value) { const d = value ? new Date(value) : null; return d && !Number.isNaN(d.getTime()) ? d.toLocaleString('en-IN',{day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit',hour12:true}).replace(',','') : '-'; }
function initials(name='') { return String(name || 'L').split(/\s+/).map(p=>p[0]).join('').slice(0,2).toUpperCase(); }
function statusClass(status='') { return status.toLowerCase().replace(/\s+/g, '-'); }
function Trend({ direction='up', value, text }) { return <small className={direction==='down'?'trend-down':'trend-up'}><b>{direction==='down'?'↓':'↑'} {value}</b> {text}</small>; }

export default function EmployeeDashboardV2() {
  const [search, setSearch] = useState('');
  const [summary, setSummary] = useState(null);
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const profile = summary?.profile;
  const displayName = profile?.full_name || localStorage.getItem('salesflow_user_name') || 'Employee';
  const q = search.toLowerCase().trim();

  async function load() {
    setLoading(true); setError('');
    try { setSummary(await getMyDashboardSummary()); }
    catch (err) { setError(err.message || 'Unable to load dashboard data.'); }
    finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);
  const toast = (text) => { setNotice(text); setTimeout(()=>setNotice(''),1600); };
  const logout = () => { localStorage.clear(); toast('Logging out...'); setTimeout(()=>go('/login'),250); };

  const tasks = summary?.tasks || [];
  const leads = summary?.recentLeads || [];
  const followups = summary?.followups || [];
  const notifications = summary?.notifications || [];
  const visibleFollowups = useMemo(()=> q ? followups.filter(i => JSON.stringify(i).toLowerCase().includes(q)) : followups, [q, followups]);
  const visibleLeads = useMemo(()=> q ? leads.filter(i => JSON.stringify(i).toLowerCase().includes(q)) : leads, [q, leads]);
  const visibleTasks = useMemo(()=> q ? tasks.filter(i => JSON.stringify(i).toLowerCase().includes(q)) : tasks.slice(0,4), [q, tasks]);

  const completeTask = async (task) => { try { await updateTask(task.id, { status:'Completed' }); await load(); toast('Task updated'); } catch (err) { toast(err.message || 'Task update failed'); } };
  const logAction = async (item, type) => { const leadId = item.lead?.id || item.lead_id; if (!leadId) return toast('Lead link missing'); try { await createActivity({ lead_id: leadId, type, title: type === 'call' ? 'Call logged' : 'WhatsApp reminder', note: item.title }); toast(type === 'call' ? 'Call activity saved' : 'WhatsApp activity saved'); await load(); } catch (err) { toast(err.message || 'Activity save failed'); } };
  const readNotifications = async () => { try { await markAllNotificationsRead(); await load(); toast('Notifications marked read'); } catch { toast('Notifications unavailable'); } };

  return <div className="sf-dashboard employee-v2-page"><DashboardSidebar role="employee"/><main className="employee-v2-main"><header className="employee-topbar"><button type="button" className="employee-menu-btn"><SvgIcon name="menu"/></button><label className="employee-search"><span><SvgIcon name="search"/></span><input value={search} onChange={(e)=>setSearch(e.target.value)} placeholder="Search leads, clients, follow-ups..."/><kbd>⌘ K</kbd></label><div className="employee-top-actions"><button type="button" className="employee-bell" onClick={readNotifications}><SvgIcon name="bell"/><i>{summary?.unreadNotifications || 0}</i></button><div className="employee-profile-wrap"><button type="button" className="employee-profile" onClick={()=>go('/employee/profile')}><b>{displayName[0] || 'E'}</b><span>{displayName}<small>Sales Executive</small></span></button><button type="button" className="employee-logout-btn" onClick={logout}><SvgIcon name="logout"/> Logout</button></div></div></header>{notice&&<div className="employee-v2-toast">{notice}</div>}{error&&<div className="employee-v2-toast">{error}</div>}
  <section className="employee-kpis"><button type="button" className="kpi-card blue" onClick={()=>go('/leads')}><i><SvgIcon name="users"/></i><div><span>Assigned Leads</span><strong>{loading?'...':summary?.assignedLeads||0}</strong><Trend value="live" text="from Supabase"/></div><svg viewBox="0 0 120 62"><path d="M5 52 C30 20 42 50 62 25 S93 8 115 18"/></svg></button><button type="button" className="kpi-card purple" onClick={()=>go('/employee/calendar')}><i><SvgIcon name="calendar"/></i><div><span>Today Follow-ups</span><strong>{loading?'...':summary?.todayFollowups||0}</strong><Trend value="today" text="scheduled"/></div><svg viewBox="0 0 120 62"><path d="M5 50 C28 30 45 44 60 26 S92 12 115 18"/></svg></button><button type="button" className="kpi-card green" onClick={()=>go('/employee/won')}><i><SvgIcon name="trophy"/></i><div><span>Won Leads</span><strong>{loading?'...':summary?.wonLeads||0}</strong><Trend value="live" text="closed"/></div><svg viewBox="0 0 120 62"><path d="M5 55 C28 30 44 42 64 30 S90 4 116 14"/></svg></button><button type="button" className="kpi-card orange" onClick={()=>go('/employee/tasks')}><i><SvgIcon name="clock"/></i><div><span>Overdue Leads</span><strong>{loading?'...':summary?.overdueLeads||0}</strong><Trend direction="down" value="live" text="overdue"/></div><svg viewBox="0 0 120 62"><path d="M5 52 C26 25 43 40 62 22 S92 10 115 14"/></svg></button></section>
  <section className="employee-main-grid"><article className="emp-card followup-card"><div className="emp-card-head"><h2><span><SvgIcon name="calendar"/></span> Today's Follow-ups</h2><button type="button" onClick={()=>go('/employee/calendar')}>View All ›</button></div><div className="followup-list">{visibleFollowups.length?visibleFollowups.map((item)=><div className="followup-row" key={`${item.kind}-${item.title}-${item.time}`}><span className="avatar-badge">{initials(item.title)}</span><div><strong>{item.title}</strong><small>{item.company || '-'}</small></div><time><SvgIcon name="clock"/> {formatTime(item.time)}</time><em className={`status ${statusClass(item.status)}`}>• {item.status}</em><button type="button" onClick={()=>logAction(item,'call')}><SvgIcon name="phone"/> Call</button><button type="button" className="wa" onClick={()=>logAction(item,'whatsapp')}><SvgIcon name="whatsapp"/> WhatsApp</button></div>):<p className="emp-empty-note">No follow-ups today.</p>}</div></article><article className="emp-card tasks-panel"><div className="emp-card-head"><h2>My Tasks</h2><button type="button" onClick={()=>go('/employee/tasks')}>View All ›</button></div>{visibleTasks.length?visibleTasks.map(task=><label className={`task-row ${task.status==='Completed'?'done':''}`} key={task.id}><input type="checkbox" checked={task.status==='Completed'} onChange={()=>completeTask(task)}/><div><strong>{task.title}</strong><small>{task.lead?.name || task.note || 'General'}</small></div><em>{task.type || 'Task'}</em><time>{formatTime(task.due_at)}</time></label>):<p className="emp-empty-note">No tasks assigned.</p>}</article></section>
  <section className="employee-bottom-grid"><article className="emp-card recent-panel"><div className="emp-card-head"><h2>Recent Leads</h2><button type="button" onClick={()=>go('/leads')}>View All ›</button></div><table><thead><tr><th>Name</th><th>Source</th><th>Status</th><th>Follow-up Date</th><th>Owner</th></tr></thead><tbody>{visibleLeads.length?visibleLeads.map(lead=><tr key={lead.id} onClick={()=>go(`/leads/${lead.id}`)}><td>{lead.name}</td><td>{lead.source}</td><td><span className={`status ${statusClass(lead.status)}`}>• {lead.status}</span></td><td>{formatDate(lead.next_follow_up)}</td><td><b className="mini-face">{initials(lead.owner?.full_name || displayName)}</b> {lead.owner?.full_name || displayName}</td></tr>):<tr><td colSpan="5">No assigned leads found.</td></tr>}</tbody></table><footer>Showing {visibleLeads.length} assigned leads <button type="button" onClick={()=>go('/leads')}>View All Leads →</button></footer></article><article className="emp-card performance-panel"><div className="emp-card-head"><h2>Notifications</h2><button type="button" onClick={readNotifications}>Mark Read</button></div><div className="perf-stats">{notifications.length?notifications.slice(0,4).map(n=><div key={n.id}><i><SvgIcon name="bell"/></i><span>{n.title}</span><strong>{n.read_at?'Read':'New'}</strong><small>{n.message}</small></div>):<div><i><SvgIcon name="bell"/></i><span>No notifications</span><strong>0</strong><small>You're all caught up.</small></div>}</div></article><article className="emp-card quick-panel"><div className="emp-card-head"><h2><span><SvgIcon name="lightning"/></span> Quick Actions</h2></div><button type="button" className="orange-action" onClick={()=>go('/employee/tasks')}><i><SvgIcon name="calendar"/></i><span>Add Follow-up<small>Schedule a new follow-up</small></span></button><button type="button" className="blue-action" onClick={()=>go('/leads')}><i><SvgIcon name="users"/></i><span>Open My Leads<small>View all assigned leads</small></span></button><button type="button" className="red-action" onClick={()=>go('/employee/tasks')}><i><SvgIcon name="clock"/></i><span>View Overdue<small>Check overdue leads</small></span></button></article></section></main></div>;
}
