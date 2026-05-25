import DashboardSidebar from '../../components/dashboard/DashboardSidebar.jsx';
import { getLead } from './leadsData.js';
import './LeadDetailImageExact.css';
import './LeadDetailProfileExactFix.css';

function getCurrentRole() {
  const saved = window.localStorage.getItem('salesflowRole');
  if (saved === 'admin' || saved === 'superAdmin' || saved === 'employee') return saved;
  return 'employee';
}

const tabs = ['Overview', 'Activity', 'Tasks', 'Notes', 'Documents', 'Email History', 'WhatsApp History'];
const timelineItems = [
  { icon: '✓', title: 'Lead Created', text: 'Lead captured from website form', time: '20 May 2025 • 10:30 AM', tone: 'purple' },
  { icon: '✉', title: 'Email Opened', text: 'Product brochure was opened', time: '20 May 2025 • 11:15 AM', tone: 'blue' },
  { icon: '☎', title: 'Phone Call', text: 'Connected with customer', time: '20 May 2025 • 12:30 PM', tone: 'green' },
  { icon: '✉', title: 'Email Sent', text: 'Pricing details shared', time: '20 May 2025 • 01:45 PM', tone: 'blue' },
  { icon: '✎', title: 'Note Added', text: 'Interested in enterprise plan', time: '20 May 2025 • 02:10 PM', tone: 'orange' },
];

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
            <button type="button">↗ Share</button>
            <button type="button">✎ Edit Lead</button>
            <button type="button" className="primary">☎ Follow Up</button>
            <button type="button" className="dots">⋯</button>
          </div>
        </div>

        <section className="ld-profile-card">
          <div className="ld-profile-left">
            <div className="ld-avatar-large">
              RM
              <span />
            </div>
            <div className="ld-profile-main">
              <div className="ld-profile-title">
                <h1>{lead.name}</h1>
                <b>Hot Lead</b>
              </div>
              <p>Marketing Manager at TechNova Solutions</p>
              <div className="ld-contact-list">
                <span>✉ rohan.mehta@technova.com</span>
                <span>☎ {lead.phone}</span>
                <span>⌖ Mumbai, Maharashtra, India</span>
              </div>
            </div>
          </div>

          <div className="ld-profile-divider" />

          <div className="ld-profile-facts">
            <div className="ld-fact owner">
              <small>Lead Owner</small>
              <div><span>👨🏻</span><strong>Amit Kumar<em>Sales Executive</em></strong></div>
            </div>
            <div className="ld-fact">
              <small>Source</small>
              <strong>{lead.source}</strong>
            </div>
            <div className="ld-fact">
              <small>Created On</small>
              <strong>20 May 2025, 10:30 AM</strong>
            </div>
          </div>
        </section>

        <div className="ld-pills below-profile">
          <span className="ld-pill source">{lead.source}</span>
          <span className="ld-pill hot">{lead.priority}</span>
          <span className="ld-pill owner">{lead.owner}</span>
        </div>

        <nav className="ld-tabs">
          {tabs.map((tab, index) => <button className={index === 0 ? 'active' : ''} key={tab} type="button">{tab}</button>)}
        </nav>

        <section className="ld-content-grid">
          <div className="ld-left-col">
            <section className="ld-main-row">
              <article className="ld-card ld-info-card">
                <header><h2>Lead Information</h2><p>Customer profile and qualification details</p></header>
                <div className="ld-info-grid">
                  <Info label="Full Name" value={lead.name} icon="♙" />
                  <Info label="Lead Source" value={lead.source} icon="◇" />
                  <Info label="Company" value={lead.company} icon="▥" />
                  <Info label="Lead Owner" value={lead.owner} icon="♙" />
                  <Info label="Email" value={lead.email} icon="✉" />
                  <Info label="Status" value={lead.status} icon="☑" />
                  <Info label="Phone" value={lead.phone} icon="☎" />
                  <Info label="Priority" value={lead.priority} icon="⚑" />
                  <Info label="Job Title" value={lead.jobTitle} icon="♧" />
                  <Info label="Expected Close Date" value={lead.expectedClose} icon="▣" />
                </div>
              </article>

              <article className="ld-card ld-score-card">
                <header><h2>Lead Score</h2><p>Conversion probability</p></header>
                <div className="ld-score-ring"><span>{lead.score}<small>High</small></span></div>
                <p className="ld-score-note">Lead is very likely to convert.</p>
                <button type="button">View Score Details</button>
              </article>
            </section>

            <section className="ld-bottom-row">
              <article className="ld-card ld-summary-card">
                <h2>Lead Summary</h2>
                <p>{lead.name.split(' ')[0]} is looking for a CRM solution for a team of 20 users.</p>
                <p>Interested in automation, reports and lead management.</p>
                <p>Requested pricing details and a demo.</p>
              </article>
              <article className="ld-card ld-follow-card">
                <h2>Next Follow Up</h2>
                <div className="ld-follow-main"><span>◷</span><strong>{lead.nextFollowUp}</strong></div>
                <p>☎ Follow up call</p>
                <footer><span>Assigned to</span><b className="ld-avatar">R</b><strong>{lead.owner}</strong><button type="button">Mark as Done</button></footer>
              </article>
            </section>
          </div>

          <aside className="ld-side-col">
            <article className="ld-card ld-tags-card">
              <h2>Smart Tags</h2>
              <div className="ld-tags">
                <span className="green">Interested</span>
                <span className="blue">Budget Available</span>
                <span className="purple">Decision Maker</span>
                <button type="button">+ Add Tag</button>
              </div>
            </article>

            <article className="ld-card ld-timeline-card">
              <header><h2>Activity Timeline</h2><select><option>All Activities</option></select></header>
              <div className="ld-timeline-list">
                {timelineItems.map((item) => <TimelineItem item={item} key={item.title} />)}
              </div>
              <button type="button" className="ld-view-all">View All Activities</button>
            </article>
          </aside>
        </section>
      </main>
    </div>
  );
}

function Info({ icon, label, value }) {
  return <div className="ld-info-item"><span>{icon}</span><div><small>{label}</small><strong>{value}</strong></div></div>;
}

function TimelineItem({ item }) {
  return <div className={`ld-timeline-item ${item.tone}`}><span>{item.icon}</span><div><strong>{item.title}</strong><p>{item.text}</p><small>{item.time}</small></div></div>;
}
