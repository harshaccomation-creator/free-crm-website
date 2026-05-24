import DashboardSidebar from '../../components/dashboard/DashboardSidebar.jsx';
import { getLead } from './leadsData.js';
import '../../styles/leadsPages.css';

export default function LeadDetailPage({ leadId = 'rohan-mehta' }) {
  const lead = getLead(leadId);
  const goBack = () => {
    window.history.pushState({}, '', '/leads');
    window.dispatchEvent(new Event('salesflow:navigate'));
  };

  return (
    <div className="sf-dashboard lead-detail-shell">
      <DashboardSidebar role="employee" />
      <main className="lead-detail-main">
        <header className="detail-topbar">
          <button onClick={goBack}>☰</button>
          <label><span>⌕</span><input placeholder="Search anything..." /></label>
          <div className="detail-profile"><span>🔔</span><b>Hi, Rahul 👋</b><i>R</i></div>
        </header>

        <section className="detail-hero">
          <p>Leads › <strong>Lead Details</strong></p>
          <div className="detail-title-row">
            <div>
              <h1>{lead.name} <span>{lead.status}</span></h1>
              <small>Lead ID : LEAD-2025-000123 &nbsp;&nbsp; Added on : {lead.lastActivity}</small>
              <div className="detail-tags"><mark>{lead.source}</mark><mark className="hot">{lead.priority}</mark><mark>{lead.owner}</mark></div>
            </div>
            <div className="detail-actions"><button>✎ Edit</button><button>Convert</button><button className="primary-btn">⚱ Follow Up</button><button>⋮</button></div>
          </div>
          <nav className="detail-tabs">{['Overview','Activity','Tasks','Notes','Documents','Deals','Email History','WhatsApp History'].map((tab, index) => <button className={index === 0 ? 'active' : ''} key={tab}>{tab}</button>)}</nav>
        </section>

        <section className="detail-layout">
          <div className="detail-left">
            <article className="detail-card info-card">
              <h2>Lead Information</h2>
              <div className="info-grid">
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

            <div className="detail-two">
              <article className="detail-card"><h2>Lead Summary</h2><p>{lead.name.split(' ')[0]} is looking for a CRM solution for his team and wants automation, reports and lead management.</p><p>He requested pricing details and a demo.</p></article>
              <article className="detail-card follow-card"><h2>Next Follow Up</h2><p>▣ {lead.nextFollowUp}</p><p>☎ Follow up call</p><footer>Assigned to <span>R</span> {lead.owner}<button>Mark as Done</button></footer></article>
            </div>

            <article className="detail-card deals-card"><div><h2>Deals (1)</h2><button>View All Deals</button></div><table><thead><tr><th>Deal Name</th><th>Deal Value</th><th>Stage</th><th>Expected Close Date</th><th>Status</th></tr></thead><tbody><tr><td>CRM Software Deal</td><td>₹ 2,45,000</td><td><mark>Proposal</mark></td><td>{lead.expectedClose}</td><td><b>Open</b></td></tr></tbody></table></article>
          </div>

          <aside className="detail-right">
            <article className="detail-card score-card"><h2>Lead Score</h2><div className="score-ring"><span>{lead.score}<small>High</small></span></div><p>Lead is very likely to convert.</p><button>View Score Details</button></article>
            <article className="detail-card timeline-card"><div><h2>Lead Timeline</h2><select><option>All Activities</option></select></div>{['Lead created','Email opened','Phone call','Email sent','Note added','Task created'].map((item, index) => <div className="timeline-row" key={item}><span>{['♙','✉','☎','✉','☑','▣'][index]}</span><div><strong>{item}</strong><small>by {lead.owner}<br />20 May 2025 {index + 10}:30 AM</small></div></div>)}<button>View All Activities</button></article>
            <article className="detail-card tags-card"><h2>Tags</h2><div><mark>Interested</mark><mark>Budget Available</mark><mark>Quick Decision Maker</mark><button>+ Add Tag</button></div></article>
          </aside>
        </section>
      </main>
    </div>
  );
}

function Info({ icon, label, value }) {
  return <div className="info-item"><span>{icon}</span><div><small>{label}</small><strong>{value}</strong></div></div>;
}
