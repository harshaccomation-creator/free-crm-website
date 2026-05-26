import DashboardSidebar from '../../components/dashboard/DashboardSidebar.jsx';
import { getLead } from './leadsData.js';
import './LeadDetailStable.css';

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
    edit: <path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4L16.5 3.5Z" />,
    phone: <path d="M22 16.9v3a2 2 0 0 1-2.2 2A19.8 19.8 0 0 1 3.1 5.2 2 2 0 0 1 5.1 3h3a2 2 0 0 1 2 1.7c.1.9.3 1.7.6 2.5a2 2 0 0 1-.5 2.1L9 10.5a16 16 0 0 0 4.5 4.5l1.2-1.2a2 2 0 0 1 2.1-.5c.8.3 1.6.5 2.5.6a2 2 0 0 1 1.7 2Z" />,
    mail: <path d="M4 6h16v12H4zM4 7l8 6 8-6" />,
    map: <path d="M12 21s7-5.2 7-12a7 7 0 0 0-14 0c0 6.8 7 12 7 12Z" />,
    dots: <path d="M12 8h.01M12 12h.01M12 16h.01" />,
    target: <path d="M12 21a9 9 0 1 0-9-9 9 9 0 0 0 9 9Zm0-4a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0-4a1 1 0 1 0-1-1 1 1 0 0 0 1 1Zm5-6 3-3m-3 3h3V4" />,
    filter: <path d="M4 5h16l-6 7v5l-4 2v-7L4 5Z" />,
    calendar: <path d="M7 3v4m10-4v4M4 9h16M5 5h14a1 1 0 0 1 1 1v14H4V6a1 1 0 0 1 1-1Z" />,
    rupee: <path d="M6 4h12M6 8h12M7 4c6 0 7 8 0 8h-1l8 8" />,
    grid: <path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z" />,
    activity: <path d="M3 12h4l3-7 4 14 3-7h4" />,
    checklist: <path d="M9 6h11M9 12h11M9 18h11M4 6l1 1 2-2M4 12l1 1 2-2M4 18l1 1 2-2" />,
    note: <path d="M6 3h9l3 3v15H6zM14 3v4h4M9 12h6M9 16h6" />,
    file: <path d="M6 3h9l3 3v15H6zM14 3v4h4M9 13h6" />,
    whatsapp: <path d="M12 21a9 9 0 0 0 7.6-13.8A9 9 0 0 0 4.4 17.5L3 21l3.7-1.2A9 9 0 0 0 12 21Zm-3-12c.7 3 3 5.2 6 6l1.2-1.2-2.2-1.1-.9.9a5.8 5.8 0 0 1-2.7-2.7l.9-.9-1.1-2.2L9 9Z" />,
    userPlus: <path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2M9.5 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM19 8v6m3-3h-6" />,
    download: <path d="M12 3v12m0 0 4-4m-4 4-4-4M5 21h14" />,
  };
  return <svg className="ld-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{icons[type]}</svg>;
}

export default function LeadDetailPage({ leadId = 'rohan-mehta' }) {
  const lead = getLead(leadId);
  const role = getCurrentRole();

  return (
    <div className="sf-dashboard ld-shell">
      <DashboardSidebar role={role} />
      <main className="ld-main">
        <div className="ld-topbar">
          <div className="ld-breadcrumb">Leads <span>›</span> <strong>Lead Details</strong></div>
          <div className="ld-actions">
            <button type="button"><SvgIcon type="share" />Share</button>
            <button type="button"><SvgIcon type="edit" />Edit Lead</button>
            <button type="button" className="primary"><SvgIcon type="phone" />Follow Up</button>
            <button type="button" className="dots" aria-label="More actions"><SvgIcon type="dots" /></button>
          </div>
        </div>
        <section className="ld-profile-card">
          <div className="ld-profile-left"><div className="ld-avatar-large">RM<span /></div><div className="ld-profile-main"><div className="ld-profile-title"><h1>{lead.name}</h1><b>Hot Lead</b></div><p>Marketing Manager at TechNova Solutions</p><div className="ld-contact-list"><span><SvgIcon type="mail" />rohan.mehta@technova.com</span><span><SvgIcon type="phone" />{lead.phone}</span><span><SvgIcon type="map" />Mumbai, Maharashtra, India</span></div></div></div>
          <div className="ld-profile-facts"><div className="ld-fact owner"><small>Lead Owner</small><div><span className="ld-owner-avatar">AK</span><strong>Amit Kumar<em>Sales Executive</em></strong></div></div><div className="ld-fact"><small>Source</small><strong>{lead.source}</strong></div><div className="ld-fact"><small>Created On</small><strong>20 May 2025, 10:30 AM</strong></div></div>
        </section>
        <section className="ld-summary-metrics"><MetricCard iconType="target" label="Lead Score" value="85" badge="High" helper="Great potential" tone="purple" /><MetricCard iconType="filter" label="Pipeline Stage" value="Proposal" helper="75%" progress tone="blue" /><MetricCard iconType="calendar" label="Next Follow-up" value="24 May 2025" helper="In 3 days" tone="orange" /><MetricCard iconType="rupee" label="Potential Deal Value" value="₹ 2,45,000" helper="High Value" tone="green" /></section>
        <section className="ld-tag-strip"><h2>Tags</h2><div><span className="green">Interested</span><span className="blue">Budget Available</span><span className="purple">Quick Decision Maker</span><span className="orange">SaaS</span><button type="button">+ Add Tag</button></div></section>
        <nav className="ld-tabs">{tabs.map((tab, index) => <button className={index === 0 ? 'active' : ''} key={tab.label} type="button"><SvgIcon type={tab.icon} />{tab.label}</button>)}</nav>
        <section className="ld-activity-layout"><article className="ld-card ld-activity-panel"><header><h2>Activity Timeline</h2><select><option>All Activities</option></select></header><div className="ld-activity-list">{activityItems.map((item) => <ActivityRow item={item} key={item.title} />)}</div></article><aside className="ld-activity-side"><article className="ld-card ld-about-card"><h2>About Lead</h2><InfoRow label="Industry" value="IT Services" /><InfoRow label="Company Size" value="51-200 Employees" /><InfoRow label="Annual Revenue" value="₹ 10Cr - ₹ 50Cr" /><InfoRow label="Interested In" value="CRM Software" /><button type="button">View Full Details <span>›</span></button></article><article className="ld-card ld-files-card"><h2>Files & Documents</h2><div className="ld-file-row"><span>PDF</span><div><strong>Proposal_Rohan_Mehta.pdf</strong><small>PDF · 1.2 MB</small></div><button type="button"><SvgIcon type="download" /></button></div><button type="button" className="ld-file-link">View All Files <span>›</span></button></article></aside></section>
      </main>
    </div>
  );
}

function MetricCard({ iconType, label, value, badge, helper, progress, tone }) {
  return <article className={`ld-metric-card ${tone}`}><span className="ld-metric-icon"><SvgIcon type={iconType} /></span><div className="ld-metric-body"><small>{label}</small><div className="ld-metric-value"><strong>{value}</strong>{badge && <b>{badge}</b>}</div>{progress ? <div className="ld-progress"><i /><em>{helper}</em></div> : <p>{helper}</p>}</div></article>;
}
function ActivityRow({ item }) {
  return <div className={`ld-activity-row ${item.tone}`}><span className="ld-activity-icon"><SvgIcon type={item.icon} /></span><div className="ld-activity-text"><strong>{item.title}</strong><p>{item.text}</p></div><div className="ld-activity-meta"><span>{item.time}</span><small>{item.user}</small></div></div>;
}
function InfoRow({ label, value }) {
  return <div className="ld-about-row"><span>{label}</span><strong>{value}</strong></div>;
}
