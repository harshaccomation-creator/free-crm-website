import { useState } from 'react';
import { LayoutDashboard, Users, PhoneCall, CheckSquare, CreditCard, UserCheck, BarChart2, Bell, Settings, User, LogOut, Menu, Zap, Plus, Search, Eye, Edit2, Trash2, MessageCircle, CheckCircle, RefreshCw, Download, Shield, Building, Image, Save } from 'lucide-react';
import './companyAdminNew.css';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'leads', label: 'Leads', icon: Users, badge: 12 },
  { id: 'followups', label: 'Follow-ups', icon: PhoneCall, badge: 5 },
  { id: 'tasks', label: 'Tasks', icon: CheckSquare },
  { id: 'payments', label: 'Payments', icon: CreditCard },
  { id: 'team', label: 'Team Members', icon: UserCheck },
  { id: 'reports', label: 'Reports', icon: BarChart2 },
  { id: 'notifications', label: 'Notifications', icon: Bell, badge: 8 },
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'profile', label: 'Profile', icon: User },
];

const statCards = [
  ['Total Leads', '1,284', Users, 'blue', '+12% vs last month'],
  ['Today Follow-ups', '34', PhoneCall, 'cyan', '5 completed'],
  ['Overdue Leads', '18', Bell, 'red', 'Need attention'],
  ['Won Leads', '263', BarChart2, 'green', '+8% this month'],
  ['Lost Leads', '87', Users, 'amber', '-2% this month'],
  ['Total Payments', '₹24.8L', CreditCard, 'green', '+18% collected'],
  ['Team Members', '28', UserCheck, 'cyan', '24 active'],
  ['Pending Tasks', '56', CheckSquare, 'amber', '12 overdue'],
];

const leads = [
  { id: 1, name: 'Rajesh Kumar', company: 'TechSoft Pvt Ltd', phone: '9876543210', email: 'rajesh@techsoft.in', status: 'New', assigned: 'Amit Singh', followup: '05 Jun 2025', createdBy: 'Rahul Arora', color: 'blue' },
  { id: 2, name: 'Priya Sharma', company: 'Sunrise Enterprises', phone: '9812345678', email: 'priya@sunrise.in', status: 'Won', assigned: 'Sneha Patel', followup: '04 Jun 2025', createdBy: 'Rahul Arora', color: 'green' },
  { id: 3, name: 'Vikram Mehta', company: 'Digital Wave Co', phone: '9988776655', email: 'vikram@digitalwave.in', status: 'Demo Done', assigned: 'Ravi Kumar', followup: '06 Jun 2025', createdBy: 'Amit Singh', color: 'cyan' },
  { id: 4, name: 'Anita Desai', company: 'Global Solutions', phone: '9765432109', email: 'anita@global.in', status: 'Overdue', assigned: 'Amit Singh', followup: '02 Jun 2025', createdBy: 'Ravi Kumar', color: 'red' },
  { id: 5, name: 'Suresh Nair', company: 'Metro Builders', phone: '9654321098', email: 'suresh@metro.in', status: 'Lost', assigned: 'Neha Joshi', followup: '07 Jun 2025', createdBy: 'Rahul Arora', color: 'amber' },
];

const tasks = [
  ['Send Product Proposal to Rajesh Kumar', 'Amit Singh', 'Rajesh Kumar', 'High', '05 Jun 2025', 'Pending'],
  ['Schedule Demo Call for Vikram Mehta', 'Ravi Kumar', 'Vikram Mehta', 'High', '06 Jun 2025', 'Pending'],
  ['Follow up after demo with Suresh Nair', 'Neha Joshi', 'Suresh Nair', 'Medium', '07 Jun 2025', 'In Progress'],
  ['Prepare onboarding documents', 'Sneha Patel', 'Priya Sharma', 'Low', '08 Jun 2025', 'Completed'],
  ['Review Q2 lead reports', 'Rahul Arora', '—', 'Medium', '03 Jun 2025', 'Overdue'],
];

const payments = [
  ['Priya Sharma', '₹1,20,000', 'Paid', '04 Jun 2025', 'Sneha Patel'],
  ['Deepak Verma', '₹85,000', 'Pending', '03 Jun 2025', 'Amit Singh'],
  ['Kiran Shah', '₹2,50,000', 'Paid', '02 Jun 2025', 'Ravi Kumar'],
  ['Rajesh Kumar', '₹45,000', 'Pending', '05 Jun 2025', 'Amit Singh'],
];

const team = [
  ['Amit Singh', 'amit@salesflow.in', 'Manager', 'Active', 42, 18, '04 Jun 2025, 9:12 AM'],
  ['Sneha Patel', 'sneha@salesflow.in', 'Employee', 'Active', 35, 12, '04 Jun 2025, 8:45 AM'],
  ['Ravi Kumar', 'ravi@salesflow.in', 'Employee', 'Active', 28, 9, '03 Jun 2025, 6:30 PM'],
  ['Neha Joshi', 'neha@salesflow.in', 'Employee', 'Active', 31, 11, '04 Jun 2025, 10:00 AM'],
  ['Kavya Reddy', 'kavya@salesflow.in', 'Employee', 'Inactive', 12, 3, '28 May 2025, 11:00 AM'],
];

function cls(status) {
  const t = String(status || '').toLowerCase();
  if (t.includes('paid') || t.includes('won') || t.includes('active') || t.includes('completed')) return 'ca-new-green';
  if (t.includes('overdue') || t.includes('inactive')) return 'ca-new-red';
  if (t.includes('pending') || t.includes('medium') || t.includes('lost')) return 'ca-new-amber';
  if (t.includes('demo') || t.includes('progress') || t.includes('employee')) return 'ca-new-cyan';
  return 'ca-new-blue';
}

function Stat({ label, value, icon: Icon, color, hint }) {
  return <article className="ca-new-card ca-new-stat"><span className="ca-new-stat-icon"><Icon size={20} /></span><div><small>{label}</small><strong>{value}</strong><em>{hint}</em></div></article>;
}

function Dashboard({ setPage }) {
  return <div className="ca-new-page"><section className="ca-new-grid-4">{statCards.map(([label, value, Icon, color, hint]) => <Stat key={label} label={label} value={value} icon={Icon} color={color} hint={hint} />)}</section><section className="ca-new-grid-2"><article className="ca-new-card"><div className="ca-new-head"><div><h2>Revenue / Payment Chart</h2><p>Monthly payment performance</p></div><button className="ca-new-btn secondary"><Download size={14} /> Export</button></div><div className="ca-new-bars">{[45,62,48,75,60,92,72,100,82,88,94,78].map((h,i)=><span key={i}><b style={{'--h':`${h}%`}} /></span>)}</div></article><article className="ca-new-card"><div className="ca-new-head"><div><h2>Lead Status Chart</h2><p>Current company pipeline</p></div></div><div className="ca-new-donut-wrap"><div className="ca-new-donut" /><div className="ca-new-legend">{[['New',340,'#3b82f6'],['In Progress',420,'#06b6d4'],['Won',263,'#10b981'],['Lost',87,'#ef4444'],['Follow-up',174,'#f59e0b']].map(([l,v,c])=><div className="ca-new-legend-row" key={l}><span><i style={{background:c}} />{l}</span><strong>{v}</strong></div>)}</div></div></article></section><section className="ca-new-grid-2"><TableCard title="Today Follow-ups" subtitle="Priority calls and reminders" rows={leads.slice(0,4).map(l=>[l.name,l.assigned,l.followup,l.phone,l.status])} cols={['Lead','Assigned To','Date','Phone','Status']} action={() => setPage('followups')} /><ActivityCard setPage={setPage} /></section></div>;
}

function TableCard({ title, subtitle, rows, cols, action }) {
  return <article className="ca-new-card"><div className="ca-new-head"><div><h2>{title}</h2><p>{subtitle}</p></div>{action && <button className="ca-new-btn secondary" onClick={action}>View All</button>}</div><div className="ca-new-table-wrap"><table className="ca-new-table"><thead><tr>{cols.map(c=><th key={c}>{c}</th>)}<th>Action</th></tr></thead><tbody>{rows.map((r,i)=><tr key={i}>{r.map((x,j)=><td key={j}>{j===r.length-1?<span className={`ca-new-badge-pill ${cls(x)}`}>{x}</span>:x}</td>)}<td><button className="ca-new-icon-btn"><Eye size={14}/></button></td></tr>)}</tbody></table></div></article>;
}

function ActivityCard({ setPage }) {
  return <article className="ca-new-card"><div className="ca-new-head"><div><h2>Team Activity</h2><p>Recent CRM movements</p></div><button className="ca-new-btn secondary" onClick={()=>setPage('team')}>Team</button></div><div className="ca-new-list">{team.slice(0,5).map(([name,email,role,status],i)=><div className="ca-new-list-row" key={email}><span className="ca-new-avatar">{name.split(' ').map(x=>x[0]).join('').slice(0,2)}</span><div><strong>{name}</strong><small>{role} · {email}</small></div><span className={`ca-new-badge-pill ${cls(status)}`}>{status}</span></div>)}</div></article>;
}

function LeadsPage({ openLead }) {
  return <div className="ca-new-page"><PageTitle title="Leads" subtitle="Manage all company leads, assignments and follow-ups"><button className="ca-new-btn"><Plus size={15}/> Add Lead</button><button className="ca-new-btn secondary"><Download size={15}/> Export</button></PageTitle><div className="ca-new-filter-row"><input className="ca-new-search" placeholder="Search leads..." />{['All','Assigned','Won','Lost','Demo Done','Overdue'].map((c,i)=><span key={c} className={`ca-new-chip ${i===0?'active':''}`}>{c}</span>)}</div><article className="ca-new-card"><div className="ca-new-table-wrap" style={{paddingTop:18}}><table className="ca-new-table"><thead><tr><th>Lead Name</th><th>Phone</th><th>Email</th><th>Status</th><th>Assigned To</th><th>Follow-up</th><th>Created By</th><th>Action</th></tr></thead><tbody>{leads.map(l=><tr key={l.id}><td><strong>{l.name}</strong><small>{l.company}</small></td><td>{l.phone}</td><td>{l.email}</td><td><span className={`ca-new-badge-pill ${cls(l.status)}`}>{l.status}</span></td><td>{l.assigned}</td><td>{l.followup}</td><td>{l.createdBy}</td><td><button className="ca-new-btn secondary" onClick={()=>openLead(l.id)}><Eye size={14}/>Open</button></td></tr>)}</tbody></table></div></article></div>;
}

function LeadDetail({ back }) {
  const lead = leads[0];
  return <div className="ca-new-page"><PageTitle title="Lead Detail" subtitle="Full lead profile, actions and activity timeline"><button className="ca-new-btn secondary" onClick={back}>Back</button></PageTitle><section className="ca-new-grid-2"><article className="ca-new-card"><div className="ca-new-head"><div><h2>{lead.name}</h2><p>{lead.company}</p></div><span className={`ca-new-badge-pill ${cls(lead.status)}`}>{lead.status}</span></div><div className="ca-new-form-grid"><Field label="Phone" value={lead.phone}/><Field label="Email" value={lead.email}/><Field label="Source" value="Website"/><Field label="Assigned To" value={lead.assigned}/><Field label="Follow-up Date" value={lead.followup}/><Field label="Created By" value={lead.createdBy}/></div><div className="ca-new-action-row" style={{padding:'0 18px 18px'}}><button className="ca-new-btn"><PhoneCall size={15}/>Call</button><button className="ca-new-btn secondary"><MessageCircle size={15}/>WhatsApp</button><button className="ca-new-btn secondary"><Plus size={15}/>Add Task</button><button className="ca-new-btn secondary"><CreditCard size={15}/>Add Payment</button></div></article><article className="ca-new-card"><div className="ca-new-head"><div><h2>Activity Timeline</h2><p>Lead movements</p></div></div><div className="ca-new-list">{['Call added','Note added','Status changed','Payment added','Follow-up completed'].map((x,i)=><div className="ca-new-list-row" key={x}><span className="ca-new-avatar">{i+1}</span><div><strong>{x}</strong><small>04 Jun 2025 · Rahul Arora</small></div><span className="ca-new-badge-pill ca-new-blue">Done</span></div>)}</div></article></section></div>;
}
function Field({label,value}){return <div className="ca-new-field"><label>{label}</label><input value={value} readOnly /></div>}
function PageTitle({ title, subtitle, children }) { return <div className="ca-new-page-title"><div><h1>{title}</h1><p>{subtitle}</p></div><div className="ca-new-action-row">{children}</div></div> }
function FollowupsPage(){return <GenericTable title="Follow-ups" subtitle="Today, upcoming, overdue and completed follow-ups" rows={leads.map(l=>[l.name,l.assigned,l.followup,'10:00 AM',l.status,l.phone])} cols={['Lead','Assigned To','Date','Time','Status','Phone']} actions={['Call','WhatsApp','Complete','Reschedule']} />}
function TasksPage(){return <GenericTable title="Tasks" subtitle="Company tasks with priority and due dates" rows={tasks} cols={['Task Title','Assigned To','Related Lead','Priority','Due Date','Status']} actions={['Create Task','Complete','Edit','Delete']} />}
function PaymentsPage(){return <GenericTable title="Payments" subtitle="Lead-wise payment tracking" rows={payments} cols={['Lead Name','Amount','Payment Status','Payment Date','Collected By']} actions={['Add Payment','Mark Paid','Export']} />}
function TeamPage(){return <GenericTable title="Team Members" subtitle="Company users, roles and performance" rows={team} cols={['Name','Email','Role','Status','Total Leads','Won Leads','Last Login']} actions={['Add User','Change Role','Assign Leads']} />}
function ReportsPage(){return <div className="ca-new-page"><PageTitle title="Reports" subtitle="Company analytics and export reports"><button className="ca-new-btn"><Download size={15}/>Export PDF</button><button className="ca-new-btn secondary"><Download size={15}/>Excel</button></PageTitle><section className="ca-new-grid-4">{['Lead Report','Employee Performance','Payment Report','Follow-up Report','Won/Lost Report','Overdue Report'].map((r,i)=><article className="ca-new-card ca-new-stat" key={r}><span className="ca-new-stat-icon"><BarChart2 size={20}/></span><div><small>Report</small><strong style={{fontSize:20}}>{r}</strong><em>Ready to export</em></div></article>)}</section></div>}
function NotificationsPage(){return <div className="ca-new-page"><PageTitle title="Notifications" subtitle="Company alerts and CRM reminders" /> <article className="ca-new-card"><div className="ca-new-list">{['Today follow-up reminder','Overdue lead alert','Payment marked paid','New lead assigned','Task overdue','Employee activity alert'].map((n,i)=><div className="ca-new-list-row" key={n}><span className="ca-new-avatar"><Bell size={15}/></span><div><strong>{n}</strong><small>{i+1} hour ago · SalesFlow Hub</small></div><span className={`ca-new-badge-pill ${i<2?'ca-new-red':'ca-new-blue'}`}>{i<2?'Critical':'Info'}</span></div>)}</div></article></div>}
function SettingsPage(){return <div className="ca-new-page"><PageTitle title="Settings" subtitle="Company profile and CRM configuration"><button className="ca-new-btn"><Save size={15}/>Save Changes</button></PageTitle><section className="ca-new-grid-2"><article className="ca-new-card"><div className="ca-new-head"><div><h2>Company Profile</h2><p>Core business information</p></div><Building size={18}/></div><div className="ca-new-form-grid"><Field label="Company Name" value="SalesFlow Technologies Pvt Ltd"/><Field label="GST Number" value="27AAICS1234C1Z1"/><Field label="Phone" value="+91 98765 43210"/><Field label="Email" value="admin@salesflow.in"/></div></article><article className="ca-new-card"><div className="ca-new-head"><div><h2>CRM Settings</h2><p>Permissions and reminders</p></div><Settings size={18}/></div><div className="ca-new-form-grid"><Field label="Lead Statuses" value="New, Demo Done, Won, Lost"/><Field label="Follow-up Reminder" value="Enabled"/><Field label="WhatsApp Reminder" value="Enabled"/><Field label="Email Reports" value="Enabled"/></div></article></section></div>}
function ProfilePage(){return <div className="ca-new-page"><PageTitle title="Profile" subtitle="Company Admin profile and account settings"><button className="ca-new-btn"><Save size={15}/>Update Profile</button></PageTitle><article className="ca-new-card"><div className="ca-new-profile-card"><div className="ca-new-profile-avatar">RA</div><div className="ca-new-form-grid"><Field label="Full Name" value="Rahul Arora"/><Field label="Email" value="rahul@salesflow.in"/><Field label="Role" value="Company Admin"/><Field label="Company" value="SalesFlow Technologies Pvt Ltd"/></div></div></article></div>}
function GenericTable({title,subtitle,rows,cols,actions}){return <div className="ca-new-page"><PageTitle title={title} subtitle={subtitle}>{actions.slice(0,2).map(a=><button className={a.includes('Add')||a.includes('Create')?'ca-new-btn':'ca-new-btn secondary'} key={a}>{a}</button>)}</PageTitle><div className="ca-new-filter-row"><input className="ca-new-search" placeholder={`Search ${title.toLowerCase()}...`} /><span className="ca-new-chip active">All</span><span className="ca-new-chip">Active</span><span className="ca-new-chip">Overdue</span></div><article className="ca-new-card"><div className="ca-new-table-wrap" style={{paddingTop:18}}><table className="ca-new-table"><thead><tr>{cols.map(c=><th key={c}>{c}</th>)}<th>Action</th></tr></thead><tbody>{rows.map((r,i)=><tr key={i}>{r.map((x,j)=><td key={j}>{j===r.length-1||String(x).match(/Active|Inactive|Pending|Paid|Overdue|Completed|High|Medium|Low|Won|Lost/)?<span className={`ca-new-badge-pill ${cls(x)}`}>{x}</span>:x}</td>)}<td><button className="ca-new-icon-btn"><Eye size={14}/></button></td></tr>)}</tbody></table></div></article></div>}

export default function CompanyAdminPreview() {
  const [page, setPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState(null);
  const title = page === 'lead-detail' ? 'Lead Detail' : navItems.find(n => n.id === page)?.label || 'Dashboard';
  const openLead = (id) => { setSelectedLeadId(id); setPage('lead-detail'); };
  let content = <Dashboard setPage={setPage} />;
  if (page === 'leads') content = <LeadsPage openLead={openLead} />;
  if (page === 'lead-detail') content = <LeadDetail back={() => setPage('leads')} />;
  if (page === 'followups') content = <FollowupsPage />;
  if (page === 'tasks') content = <TasksPage />;
  if (page === 'payments') content = <PaymentsPage />;
  if (page === 'team') content = <TeamPage />;
  if (page === 'reports') content = <ReportsPage />;
  if (page === 'notifications') content = <NotificationsPage />;
  if (page === 'settings') content = <SettingsPage />;
  if (page === 'profile') content = <ProfilePage />;

  return <div className="company-admin-new"><aside className={`ca-new-sidebar ${sidebarOpen ? 'open' : ''}`}><div className="ca-new-logo"><div className="ca-new-logo-icon"><Zap size={19}/></div><div><strong>SalesFlow Hub</strong><small>Company Admin</small></div></div><nav className="ca-new-nav"><div className="ca-new-section">Main Menu</div>{navItems.map(({id,label,icon:Icon,badge})=><button className={`ca-new-nav-btn ${page===id || (page==='lead-detail'&&id==='leads')?'active':''}`} key={id} onClick={()=>{setPage(id);setSidebarOpen(false)}}><Icon size={16}/><span>{label}</span>{badge?<span className="ca-new-badge">{badge}</span>:null}</button>)}<div className="ca-new-section">Quick Access</div><button className="ca-new-nav-btn" style={{color:'var(--ca-amber)'}}><BarChart2 size={16}/>Performance</button></nav><div className="ca-new-sidebar-foot"><div className="ca-new-avatar">RA</div><div><strong>Rahul Arora</strong><small style={{display:'block',color:'var(--ca-muted)'}}>Company Admin</small></div><LogOut size={14} style={{marginLeft:'auto',color:'var(--ca-muted)'}}/></div></aside><main className="ca-new-main"><header className="ca-new-topbar"><div style={{display:'flex',alignItems:'center',gap:12}}><button className="ca-new-icon-btn ca-new-mobile-btn" onClick={()=>setSidebarOpen(true)}><Menu size={18}/></button><div><div className="ca-new-title">{title}</div><div className="ca-new-crumb"><span>SalesFlow Hub</span><span>›</span><span>{title}</span></div></div></div><div className="ca-new-top-actions"><button className="ca-new-icon-btn" onClick={()=>setPage('notifications')}><Bell size={16}/><i className="ca-new-dot"/></button><button className="ca-new-icon-btn" onClick={()=>setPage('settings')}><Settings size={16}/></button><button className="ca-new-avatar" onClick={()=>setPage('profile')}>RA</button></div></header><section className="ca-new-content">{content}</section></main></div>;
}
