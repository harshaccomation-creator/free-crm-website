import DashboardSidebar from '../../components/dashboard/DashboardSidebar.jsx';
import { getLead } from './leadsData.js';
import '../../styles/leadsReferenceExact.css';

function getCurrentRole() {
  const saved = window.localStorage.getItem('salesflowRole');
  if (saved === 'admin' || saved === 'superAdmin' || saved === 'employee') return saved;
  return 'employee';
}

export default function LeadDetailPage({ leadId = 'rohan-mehta' }) {
  const lead = getLead(leadId);
  const role = getCurrentRole();

  return (
    <div className="sf-dashboard lead-reference lead-detail-reference">
      <DashboardSidebar role={role} />
      <main className="lead-detail-ref-main">
        <section className="lead-detail-ref-hero">
          <div className="lead-detail-ref-title">
            <p className="lead-detail-ref-breadcrumb">Leads › <strong>Lead Details</strong></p>
            <h1>{lead.name} <span>{lead.status}</span></h1>
            <small>Lead ID : LEAD-2025-000123 &nbsp;&nbsp; | &nbsp;&nbsp; Added on : {lead.lastActivity}</small>
            <div className="lead-detail-ref-tags"><span className="lead-ref-pill blue">{lead.source}</span><span className="lead-ref-pill red">{lead.priority}</span><span className="lead-ref-pill blue">{lead.owner}</span></div>
          </div>
          <div className="lead-detail-ref-actions"><button>✎ Edit</button><button>↔ Convert</button><button className="primary">⚱ Follow Up</button><button>⋮</button></div>
        </section>
        <nav className="lead-detail-ref-tabs">{['Overview','Activity','Tasks','Notes','Documents','Email History','WhatsApp History'].map((tab, index) => <button className={index === 0 ? 'active' : ''} key={tab}>{tab}</button>)}</nav>
        <section className="lead-detail-ref-grid">
          <div className="lead-detail-ref-left">
            <div className="lead-detail-ref-top">
              <article className="lead-detail-ref-card"><h2>Lead Information</h2><div className="lead-info-grid"><Info label="Full Name" value={lead.name} icon="♙" /><Info label="Lead Source" value={lead.source} icon="◇" /><Info label="Company" value={lead.company} icon="▥" /><Info label="Lead Owner" value={lead.owner} icon="♙" /><Info label="Email" value={lead.email} icon="✉" /><Info label="Status" value={lead.status} icon="☑" /><Info label="Phone" value={lead.phone} icon="☎" /><Info label="Priority" value={lead.priority} icon="⚑" /><Info label="Job Title" value={lead.jobTitle} icon="♧" /><Info label="Expected Close Date" value={lead.expectedClose} icon="▣" /></div></article>
              <article className="lead-detail-ref-card lead-score-card"><h2>Lead Score</h2><div className="lead-score-ring"><span>{lead.score}<small>High</small></span></div><p>Lead is very likely to convert.</p><button>View Score Details</button></article>
            </div>
            <div className="lead-detail-ref-mid"><article className="lead-detail-ref-card summary-card"><h2>Lead Summary</h2><p>{lead.name.split(' ')[0]} is looking for a CRM solution for his team of 20 users.</p><p>He is interested in automation, reports and lead management.</p><p>He requested pricing details and a demo.</p></article><article className="lead-detail-ref-card follow-card"><h2>Next Follow Up</h2><p>▣ {lead.nextFollowUp}</p><p>☎ Follow up call</p><footer>Assigned to <span className="lead-ref-avatar">R</span> {lead.owner}<button>Mark as Done</button></footer></article></div>
          </div>
          <aside className="lead-detail-ref-right"><article className="lead-detail-ref-card timeline-card"><header><h2>Lead Timeline</h2><select><option>All Activities</option></select></header>{['Lead created','Email opened','Phone call','Email sent','Note added','Task created'].map((item, index) => <div className="timeline-item" key={item}><span>{['♙','✉','☎','✉','☑','▣'][index]}</span><div><strong>{item}</strong><small>{index === 0 ? 'by ' + lead.owner : ['Product Brochure','Connected','Pricing Details','Interested in enterprise plan.','Follow up call'][index - 1]}<br />20 May 2025 {10 + index}:30 AM</small></div></div>)}<button>View All Activities</button></article><article className="lead-detail-ref-card tag-card"><h2>Tags</h2><div><span className="lead-ref-pill green">Interested</span><span className="lead-ref-pill blue">Budget Available</span><span className="lead-ref-pill purple">Quick Decision Maker</span><button>+ Add Tag</button></div></article></aside>
        </section>
      </main>
    </div>
  );
}

function Info({ icon, label, value }) {
  return <div className="lead-info-item"><span>{icon}</span><div><small>{label}</small><strong>{value}</strong></div></div>;
}
