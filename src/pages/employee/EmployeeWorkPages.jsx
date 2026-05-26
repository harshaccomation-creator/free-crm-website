import DashboardSidebar from '../../components/dashboard/DashboardSidebar.jsx';
import { leads } from '../leads/leadsData.js';
import './EmployeePages.css';

const tasks = [
  { title: 'Call with Rohan Sharma', lead: 'Rohan Sharma', time: '10:00 AM', date: '20 May 2025', status: 'Today', type: 'Call' },
  { title: 'Follow-up: Neha Patel', lead: 'Neha Patel', time: '11:30 AM', date: '20 May 2025', status: 'Today', type: 'Follow-up' },
  { title: 'Demo Presentation', lead: 'Amit Kumar', time: '02:00 PM', date: '20 May 2025', status: 'Today', type: 'Demo' },
  { title: 'Internal Team Sync', lead: 'Team', time: '04:00 PM', date: '20 May 2025', status: 'Today', type: 'Meeting' },
  { title: 'Proposal reminder', lead: 'Amit Verma', time: '10:00 AM', date: '19 May 2025', status: 'Overdue', type: 'Task' },
  { title: 'Payment follow-up', lead: 'Neha Singh', time: '03:00 PM', date: '18 May 2025', status: 'Overdue', type: 'Follow-up' },
];

const activities = [
  { stage: 'Lead Created', text: 'Rohan Mehta captured from website form.', time: '20 May 2025, 10:30 AM' },
  { stage: 'Contacted', text: 'Call completed with Priya Sharma.', time: '19 May 2025, 03:15 PM' },
  { stage: 'Proposal', text: 'Proposal sent to Amit Verma.', time: '18 May 2025, 11:45 AM' },
  { stage: 'Negotiation', text: 'Budget discussion with Neha Singh.', time: '17 May 2025, 04:20 PM' },
  { stage: 'Won', text: 'Deepak Kumar converted successfully.', time: '16 May 2025, 12:10 PM' },
];

function Shell({ title, subtitle, children, actions }) {
  return (
    <div className="emp-page">
      <DashboardSidebar role="employee" />
      <main className="emp-main">
        <header className="emp-head">
          <div><h1>{title}</h1><p>{subtitle}</p></div>
          <div className="emp-actions">{actions}</div>
        </header>
        {children}
      </main>
    </div>
  );
}

function Stats({ items }) {
  return <section className="emp-grid cards">{items.map((item) => <article className="emp-card emp-stat" key={item.label}><span className="emp-icon">{item.icon}</span><div><p>{item.label}</p><h2>{item.value}</h2></div></article>)}</section>;
}

export function WonPage() {
  const wonLeads = leads.filter((lead) => lead.status === 'Converted' || lead.status === 'Won');
  const value = wonLeads.length * 245000;
  return <Shell title="Won Leads" subtitle="Leads jinka status won/converted hai." actions={<button className="emp-btn primary">Export Won</button>}><Stats items={[{ icon: '✓', label: 'Won Leads', value: wonLeads.length }, { icon: '₹', label: 'Won Value', value: `₹${value.toLocaleString('en-IN')}` }, { icon: '↗', label: 'Conversion', value: '16.4%' }, { icon: '🏆', label: 'Best Source', value: 'Email' }]} /><section className="emp-card emp-section"><div className="emp-section-head"><h2>Won Lead List</h2><span className="emp-pill green">Converted Status</span></div><table className="emp-table"><thead><tr><th>Lead</th><th>Company</th><th>Source</th><th>Status</th><th>Owner</th><th>Closed</th></tr></thead><tbody>{wonLeads.map((lead) => <tr key={lead.id}><td><div className="emp-person"><span className="emp-avatar">{lead.initials}</span><div><strong>{lead.name}</strong><small>{lead.phone}</small></div></div></td><td>{lead.company}</td><td>{lead.source}</td><td><span className="emp-pill green">Won</span></td><td>{lead.owner}</td><td>{lead.lastActivity}</td></tr>)}</tbody></table></section></Shell>;
}

export function TasksPage() {
  const today = tasks.filter((task) => task.status === 'Today');
  const overdue = tasks.filter((task) => task.status === 'Overdue');
  return <Shell title="Tasks" subtitle="Aaj ke tasks aur overdue follow-ups yahan dikhenge." actions={<button className="emp-btn primary">+ Add Task</button>}><Stats items={[{ icon: '✓', label: 'Today Tasks', value: today.length }, { icon: '!', label: 'Overdue', value: overdue.length }, { icon: '☎', label: 'Calls', value: '2' }, { icon: '📌', label: 'Pending', value: tasks.length }]} /><section className="emp-two"><article className="emp-card emp-section"><div className="emp-section-head"><h2>Today</h2><span className="emp-pill green">{today.length} Tasks</span></div>{today.map((task) => <div className="task-row" key={task.title}><span className="task-check" /><div><strong>{task.title}</strong><small>{task.lead} • {task.type}</small></div><span className="task-time">{task.time}</span></div>)}</article><article className="emp-card emp-section"><div className="emp-section-head"><h2>Overdue</h2><span className="emp-pill red">{overdue.length} Late</span></div>{overdue.map((task) => <div className="task-row" key={task.title}><span className="task-check" /><div><strong>{task.title}</strong><small>{task.lead} • {task.date}</small></div><span className="task-time">{task.time}</span></div>)}</article></section></Shell>;
}

export function CalendarPage() {
  const days = Array.from({ length: 31 }, (_, index) => index + 1);
  const eventMap = { 18: [{ title: 'Payment follow-up', tone: 'orange' }], 19: [{ title: 'Proposal reminder', tone: 'orange' }], 20: [{ title: 'Demo Presentation', tone: 'green' }, { title: 'Follow-up Neha', tone: '' }], 22: [{ title: 'Rohan follow-up', tone: '' }], 24: [{ title: 'Next follow-up', tone: 'green' }] };
  return <Shell title="Calendar" subtitle="Jis date ko demo, follow-up ya task hai us date ke aage naam dikhega." actions={<button className="emp-btn primary">+ Schedule</button>}><section className="calendar-wrap"><article className="emp-card emp-section"><div className="emp-section-head"><h2>May 2025</h2><span className="emp-pill blue">Scheduled Pipeline</span></div><div className="calendar-grid">{days.map((day) => <div className={`cal-day ${day === 20 ? 'today' : ''}`} key={day}><b>{day}</b>{(eventMap[day] || []).map((event) => <span className={`cal-event ${event.tone}`} key={event.title}>{event.title}</span>)}</div>)}</div></article><article className="emp-card emp-section"><div className="emp-section-head"><h2>Upcoming</h2></div>{tasks.map((task) => <div className="task-row" key={`${task.title}-${task.date}`}><span className="task-check" /><div><strong>{task.title}</strong><small>{task.date} • {task.lead}</small></div><span className="task-time">{task.time}</span></div>)}</article></section></Shell>;
}

export function ActivitiesPage() {
  return <Shell title="Activities" subtitle="Pipeline wise recent activity timeline." actions={<button className="emp-btn">Filter</button>}><Stats items={[{ icon: '◎', label: 'New', value: '18' }, { icon: '☎', label: 'Contacted', value: '12' }, { icon: '▣', label: 'Proposal', value: '7' }, { icon: '✓', label: 'Won', value: '3' }]} /><section className="emp-card emp-section"><div className="emp-section-head"><h2>Pipeline Activity</h2><span className="emp-pill blue">Latest</span></div><div className="pipeline">{activities.map((item, index) => <div className="pipe-row" key={item.stage}><span className="pipe-dot">{index + 1}</span><div><strong>{item.stage}</strong><p>{item.text}</p></div><span className="pipe-meta">{item.time}</span></div>)}</div></section></Shell>;
}

export function ReportsPage() {
  return <Shell title="Reports" subtitle="Sales performance, lead source aur conversion reports." actions={<button className="emp-btn primary">Download</button>}><section className="reports-grid"><article className="emp-card report-kpi"><h3>Revenue Won</h3><strong>₹12.4L</strong><div className="bar"><b style={{ width: '72%' }} /></div></article><article className="emp-card report-kpi"><h3>Lead Conversion</h3><strong>16.4%</strong><div className="bar"><b style={{ width: '48%' }} /></div></article><article className="emp-card report-kpi"><h3>Tasks Completed</h3><strong>84%</strong><div className="bar"><b style={{ width: '84%' }} /></div></article></section></Shell>;
}

export function ProfilePage() {
  return <Shell title="Profile" subtitle="Employee profile and account details." actions={<button className="emp-btn primary">Edit Profile</button>}><section className="emp-card emp-section profile-box"><div className="profile-photo">A</div><div className="profile-info"><h2>Alex Morgan</h2><p>Sales Executive</p><div className="profile-details"><div><span>Email</span><strong>alex@salesflow.com</strong></div><div><span>Phone</span><strong>+91 98765 43210</strong></div><div><span>Team</span><strong>Sales</strong></div><div><span>Location</span><strong>Mumbai, India</strong></div></div></div></section></Shell>;
}
