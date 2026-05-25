import DashboardSidebar from '../../components/dashboard/DashboardSidebar.jsx';
import { getLead } from './leadsData.js';
import '../../styles/leadsReferenceExact.css';

function getCurrentRole() {
  const saved = window.localStorage.getItem('salesflowRole');
  if (saved === 'admin' || saved === 'superAdmin' || saved === 'employee') return saved;
  return 'employee';
}

const timelineItems = [
  { icon: '✓', title: 'Lead created', text: 'by Rahul Sharma', time: '20 May 2025 10:30 AM', tone: 'purple' },
  { icon: '✉', title: 'Email opened', text: 'Product Brochure', time: '20 May 2025 11:15 AM', tone: 'blue' },
  { icon: '☎', title: 'Phone call', text: 'Connected', time: '20 May 2025 12:30 PM', tone: 'green' },
  { icon: '✉', title: 'Email sent', text: 'Pricing Details', time: '20 May 2025 01:45 PM', tone: 'blue' },
  { icon: '✎', title: 'Note added', text: 'Interested in enterprise plan.', time: '20 May 2025 02:10 PM', tone: 'orange' },
];

export default function LeadDetailPage({ leadId = 'rohan-mehta' }) {
  const lead = getLead(leadId);
  const role = getCurrentRole();

  return (
    <div className="sf-dashboard lead-reference lead-detail-reference premium-lead-detail">
      <DashboardSidebar role={role} />
      <main className="lead-detail-ref-main">
        <section className="lead-detail-ref-hero saas-lead-hero">
          <div className="lead-detail-ref-title">
            <p className="lead-detail-ref-breadcrumb">Leads › <strong>Lead Details</strong></p>
            <div className="lead-title-row">
              <h1>{lead.name}</h1>
              <span className="status-badge">{lead.status}</span>
            </div>
            <small>Lead ID : LEAD-2025-000123 <b>|</b> Added on : {lead.lastActivity}</small>
            <div className="lead-detail-ref-tags">
              <span className="lead-ref-pill blue">{lead.source}</span>
              <span className="lead-ref-pill red">{lead.priority}</span>
              <span className="lead-ref-pill blue">{lead.owner}</span>
            </div>
          </div>
          <div className="lead-detail-ref-actions">
            <button type="button">✎ Edit</button>
            <button type="button">↔ Convert</button>
            <button type="button" className="primary">⚱ Follow Up</button>
            <button type="button" className="icon-only">⋮</button>
          </div>
        </section>

        <section className="lead-saas-kpis">
          <article><span>◎</span><div><small>Lead Score</small><strong>{lead.score}/100</strong></div></article>
          <article><span>◆</span><div><small>Pipeline Stage</small><strong>{lead.status}</strong></div></article>
          <article><span>◷</span><div><small>Next Follow-up</small><strong>{lead.nextFollowUp}</strong></div></article>
          <article><span>₹</span><div><small>Potential Deal</small><strong>₹2,45,000</strong></div></article>
        </section>

        <nav className="lead-detail-ref-tabs">
          {['Overview', 'Activity', 'Tasks', 'Notes', 'Documents', 'Email History', 'WhatsApp History'].map((tab, index) => (
            <button className={index === 0 ? 'active' : ''} key={tab} type="button">{tab}</button>
          ))}
        </nav>

        <section className="lead-detail-ref-grid">
          <div className="lead-detail-ref-left">
            <div className="lead-detail-ref-top">
              <article className="lead-detail-ref-card lead-info-card">
                <h2>Lead Information</h2>
                <div className="lead-info-grid">
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
              <article className="lead-detail-ref-card lead-score-card">
                <h2>Lead Score</h2>
                <div className="lead-score-ring"><span>{lead.score}<small>High</small></span></div>
                <p>Lead is very likely to convert.</p>
                <button type="button">View Score Details</button>
              </article>
            </div>

            <div className="lead-detail-ref-mid">
              <article className="lead-detail-ref-card summary-card">
                <h2>Lead Summary</h2>
                <p>{lead.name.split(' ')[0]} is looking for a CRM solution for his team of 20 users.</p>
                <p>Interested in automation, reports and lead management.</p>
                <p>Requested pricing details and a demo.</p>
              </article>
              <article className="lead-detail-ref-card follow-card">
                <h2>Next Follow Up</h2>
                <p>▣ {lead.nextFollowUp}</p>
                <p>☎ Follow up call</p>
                <footer><span>Assigned to</span><span className="lead-ref-avatar">R</span><strong>{lead.owner}</strong><button type="button">Mark as Done</button></footer>
              </article>
            </div>
          </div>

          <aside className="lead-detail-ref-right">
            <article className="lead-detail-ref-card tag-card">
              <h2>Tags</h2>
              <div>
                <span className="lead-ref-pill green">Interested</span>
                <span className="lead-ref-pill blue">Budget Available</span>
                <span className="lead-ref-pill purple">Quick Decision Maker</span>
                <button type="button">+ Add Tag</button>
              </div>
            </article>

            <article className="lead-detail-ref-card timeline-card">
              <header><h2>Activity Timeline</h2><select><option>All Activities</option></select></header>
              {timelineItems.map((item) => (
                <div className={`timeline-item ${item.tone}`} key={item.title}>
                  <span>{item.icon}</span>
                  <div><strong>{item.title}</strong><small>{item.text}<br />{item.time}</small></div>
                </div>
              ))}
              <button type="button">View All Activities</button>
            </article>
          </aside>
        </section>
      </main>
    </div>
  );
}

function Info({ icon, label, value }) {
  return <div className="lead-info-item"><span>{icon}</span><div><small>{label}</small><strong>{value}</strong></div></div>;
}
