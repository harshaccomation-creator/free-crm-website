import DashboardSidebar from '../../components/dashboard/DashboardSidebar.jsx';
import { getLead } from './leadsData.js';
import './LeadDetailStable.css';
import './LeadDetailProfessionalFix.css';

function getCurrentRole() {
  const saved = window.localStorage.getItem('salesflowRole');
  if (saved === 'admin' || saved === 'superAdmin' || saved === 'employee') return saved;
  return 'employee';
}

const tabs = [
  { label: 'Overview', icon: 'grid' },
  { label: 'Activity', icon: 'activity' },
  { label: 'Tasks', icon: 'checklist' },
  { label: 'Notes', icon: 'note' },
  { label: 'Documents', icon: 'file' },
  { label: 'Email History', icon: 'mail' },
  { label: 'WhatsApp History', icon: 'whatsapp' },
];

const activityItems = [
  { icon: 'phone', title: 'Called Rohan Mehta', text: 'Discussed requirements and solution overview.', time: 'Today, 10:30 AM', user: 'Amit Kumar', tone: 'green' },
  { icon: 'mail', title: 'Sent Proposal', text: 'Proposal for CRM Software Implementation sent.', time: 'Yesterday, 04:15 PM', user: 'Amit Kumar', tone: 'blue' },
  { icon: 'calendar', title: 'Follow-up Scheduled', text: 'Next follow-up scheduled on 24 May 2025.', time: 'Yesterday, 04:10 PM', user: 'Amit Kumar', tone: 'orange' },
  { icon: 'userPlus', title: 'Lead Created', text: 'Lead captured from website contact form.', time: '20 May 2025, 10:30 AM', user: 'System', tone: 'purple' },
];

function SvgIcon({ type }) {
  const icons = {
    share: <path d="M7.5 11.5 16.5 6m-9 6 9 5.5M17 6a2 2 0 1 0-4 0 2 2 0 0 0 4 0ZM7 12a2 2 0 1 0-4 0 2 2 0 0 0 4 0Zm10 6a2 2 0 1 0-4 0 2 2 0 0 0 4 0Z" />,
    edit: <path d="M4 20h4l10.5-10.5a2.1 2.1 0 0 0-3-3L5 17v3Z" />,
    phone: <path d="M22 16.9v3a2 2 0 0 1-2.2 2A19.8 19.8 0 0 1 3.1 5.2 2 2 0 0 1 5.1 3h3a2 2 0 0 1 2 1.7c.1.9.3 1.7.6 2.5a2 2 0 0 1-.5 2.1L9 10.5a16 16 0 0 0 4.5 4.5l1.2-1.2a2 2 0 0 1 2.1-.5c.8.3 1.6.5 2.5.6a2 2 0 0 1 1.7 2Z" />,
    dots: <path d="M12 7h.01M12 12h.01M12 17h.01" />,
    mail: <path d="M4 6h16v12H4zM4 7l8 6 8-6" />,
    map: <path d="M12 21s7-5.3 7-11a7 7 0 1 0-14 0c0 5.7 7 11 7 11Zm0-8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />,
    target: <path d="M12 21a9 9 0 1 0-9-9 9 9 0 0 0 9 9Zm0-4a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0-4a1 1 0 1 0-1-1 1 1 0 0 0 1 1Z" />,
    funnel: <path d="M4 5h16l-6 7v5l-4 2v-7L4 5Z" />,
    calendar: <path d="M7 3v4m10-4v4M4 9h16M5 5h14a1 1 0 0 1 1 1v14H4V6a1 1 0 0 1 1-1Z" />,
    rupee: <path d="M6 4h12M6 8h12M7 4c6 0 7 8 0 8h-1l8 8" />,
    grid: <path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z" />,
    activity: <path d="M3 12h4l3-7 4 14 3-7h4" />,
    checklist: <path d="M9 7h12M9 12h12M9 17h12M3 7l1 1 2-2M3 12l1 1 2-2M3 17l1 1 2-2" />,
    note: <path d="M14 2H6a2 2 0 0 0-2 2v16h16V8l-6-6Zm0 0v6h6" />,
    file: <path d="M14 2H6a2 2 0 0 0-2 2v16h16V8l-6-6Zm0 0v6h6" />,
    whatsapp: <path d="M20 11.5a8 8 0 0 1-11.8 7L4 20l1.5-4.1A8 8 0 1 1 20 11.5Z" />,
    userPlus: <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm10-1v6m3-3h-6" />,
    download: <path d="M12 3v12m0 0 4-4m-4 4-4-4M5 21h14" />,
  };
  return <svg className="ld-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{icons[type] || icons.grid}</svg>;
}

function goToLeads() {
  window.history.pushState({}, '', '/leads');
  window.dispatchEvent(new Event('salesflow:navigate'));
}

export default function LeadDetailPage({ leadId }) {
  const role = getCurrentRole();
  const lead = getLead(leadId);
  const score = lead.score || 85;
  return (
    <div className="ld-shell">
      <DashboardSidebar role={role} />
      <main className="ld-main">
        <header className="ld-topbar">
          <div className="ld-breadcrumb"><button onClick={goToLeads} type="button">Leads</button><span>›</span><strong>Lead Details</strong></div>
          <div className="ld-actions"><button><SvgIcon type="share" />Share</button><button><SvgIcon type="edit" />Edit Lead</button><button className="primary"><SvgIcon type="phone" />Follow Up</button><button className="dots"><SvgIcon type="dots" /></button></div>
        </header>
        <section className="ld-profile-card">
          <div className="ld-profile-left"><div className="ld-avatar-large">{lead.initials}<span /></div><div className="ld-profile-main"><div className="ld-profile-title"><h1>{lead.name}</h1><b>Hot Lead</b></div><p>{lead.jobTitle || 'Marketing Manager'} at {lead.company}</p><div className="ld-contact-list"><span><SvgIcon type="mail" />{lead.email || 'rohan.mehta@technova.com'}</span><span><SvgIcon type="phone" />{lead.phone}</span><span><SvgIcon type="map" />Mumbai, Maharashtra, India</span></div></div></div>
          <div className="ld-profile-facts"><div className="ld-fact owner"><small>Lead Owner</small><div><span className="ld-owner-avatar">AK</span><strong>Amit Kumar<em>Sales Executive</em></strong></div></div><div className="ld-fact"><small>Source</small><strong>{lead.source}</strong></div><div className="ld-fact"><small>Created On</small><strong>20 May 2025, 10:30 AM</strong></div></div>
        </section>
        <section className="ld-summary-metrics"><article className="ld-metric-card purple"><span className="ld-metric-icon"><SvgIcon type="target" /></span><div className="ld-metric-body"><small>Lead Score</small><div className="ld-metric-value"><strong>{score}</strong><b>High</b></div><p>Great potential</p></div></article><article className="ld-metric-card"><span className="ld-metric-icon"><SvgIcon type="funnel" /></span><div className="ld-metric-body"><small>Pipeline Stage</small><div className="ld-metric-value"><strong>Proposal</strong></div><div className="ld-progress"><i /><em>75%</em></div></div></article><article className="ld-metric-card orange"><span className="ld-metric-icon"><SvgIcon type="calendar" /></span><div className="ld-metric-body"><small>Next Follow-up</small><div className="ld-metric-value"><strong>24 May 2025</strong></div><p>In 3 days</p></div></article><article className="ld-metric-card green"><span className="ld-metric-icon"><SvgIcon type="rupee" /></span><div className="ld-metric-body"><small>Potential Deal Value</small><div className="ld-metric-value"><strong>₹ 2,45,000</strong></div><p>High Value</p></div></article></section>
        <section className="ld-tag-strip"><h2>Tags</h2><div><span className="green">Interested</span><span className="blue">Budget Available</span><span className="purple">Quick Decision Maker</span><span className="orange">SaaS</span><button>+ Add Tag</button></div></section>
        <nav className="ld-tabs">{tabs.map((tab, index) => <button key={tab.label} className={index === 0 ? 'active' : ''}><SvgIcon type={tab.icon} />{tab.label}</button>)}</nav>
        <section className="ld-activity-layout"><article className="ld-card ld-activity-panel"><header><h2>Activity Timeline</h2><select><option>All Activities</option></select></header><div className="ld-activity-list">{activityItems.map((item) => <div className={`ld-activity-row ${item.tone}`} key={item.title}><span className="ld-activity-icon"><SvgIcon type={item.icon} /></span><div className="ld-activity-text"><strong>{item.title}</strong><p>{item.text}</p></div><div className="ld-activity-meta">{item.time}<small>{item.user}</small></div></div>)}</div></article><aside className="ld-activity-side"><article className="ld-card ld-about-card"><h2>About Lead</h2>{[['Industry','IT Services'],['Company Size','51-200 Employees'],['Annual Revenue','₹ 10Cr - ₹ 50Cr'],['Interested In','CRM Software']].map(([a,b]) => <div className="ld-about-row" key={a}><span>{a}</span><strong>{b}</strong></div>)}<button>View Full Details <span>›</span></button></article><article className="ld-card ld-files-card"><h2>Files & Documents</h2><div className="ld-file-row"><span>PDF</span><div><strong>Proposal_Rohan_Mehta.pdf</strong><small>PDF • 1.2 MB</small></div><button><SvgIcon type="download" /></button></div><a className="ld-file-link">View All Files <span>›</span></a></article></aside></section>
      </main>
    </div>
  );
}