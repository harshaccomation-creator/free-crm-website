import DashboardSidebar from '../../components/dashboard/DashboardSidebar.jsx';
import { leads } from './leadsData.js';
import '../../styles/leadsReferenceExact.css';

const metrics = [
  ['Total Leads','1,245','↑ 12.5%','👥','blue'],
  ['New Leads','320','↑ 8.4%','👥','blue'],
  ['Contacted','452','↑ 15.3%','☎','green'],
  ['In Progress','268','↓ 4.6%','⌛','orange down'],
  ['Converted','205','↑ 10.2%','✓','green'],
  ['Lost','78','↓ 8.1%','✕','red down'],
];

const sourceClass = {
  Website: 'blue',
  Referral: 'green',
  LinkedIn: 'purple',
  'Cold Call': 'orange',
  'Email Campaign': 'purple',
};

const statusClass = {
  New: 'blue',
  Contacted: 'orange',
  'In Progress': 'blue',
  Converted: 'green',
  Lost: 'red',
};

export default function LeadListPage() {
  const openLead = (id) => {
    window.history.pushState({}, '', `/leads/${id}`);
    window.dispatchEvent(new Event('salesflow:navigate'));
  };

  return (
    <div className="sf-dashboard lead-reference lead-list-reference">
      <DashboardSidebar role="employee" />
      <main className="lead-ref-main">
        <header className="lead-ref-header">
          <div>
            <h1>Lead Activity</h1>
            <p>Home › Leads › Lead Activity</p>
          </div>
          <div className="lead-ref-actions">
            <button>⇩ Export</button>
            <button className="primary">＋ Add Lead</button>
          </div>
        </header>

        <section className="lead-ref-metrics">
          {metrics.map(([title, value, change, icon, tone]) => (
            <article className={`lead-ref-metric ${tone}`} key={title}>
              <span className="icon">{icon}</span>
              <div><p>{title}</p><h2>{value}</h2><small>{change}</small></div>
            </article>
          ))}
        </section>

        <section className="lead-ref-filters">
          <div className="lead-ref-field"><span>Date Range</span><strong>01 May 2025 - 31 May 2025</strong><i>⌄</i></div>
          <div className="lead-ref-field"><span>Lead Source</span><strong>All Sources</strong><i>⌄</i></div>
          <div className="lead-ref-field"><span>Lead Owner</span><strong>All Users</strong><i>⌄</i></div>
          <div className="lead-ref-field"><span>Status</span><strong>All Statuses</strong><i>⌄</i></div>
          <label className="lead-ref-search"><span>⌕</span><input placeholder="Search leads..." /></label>
          <button className="lead-ref-filter-btn">▽ Filter</button>
        </section>

        <section className="lead-ref-table-card">
          <table className="lead-ref-table">
            <thead>
              <tr>
                <th><input className="lead-ref-check" type="checkbox" /></th>
                <th>Lead Name</th><th>Company</th><th>Lead Source</th><th>Status</th><th>Last Activity</th><th>Next Follow Up</th><th>Lead Owner</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id} onClick={() => openLead(lead.id)}>
                  <td><input className="lead-ref-check" type="checkbox" onClick={(event) => event.stopPropagation()} /></td>
                  <td><div className="lead-ref-person"><span className="lead-ref-avatar">{lead.initials}</span><div><strong>{lead.name}</strong><small>{lead.phone}</small></div></div></td>
                  <td>{lead.company}</td>
                  <td><span className={`lead-ref-pill ${sourceClass[lead.source] || 'blue'}`}>{lead.source}</span></td>
                  <td><span className={`lead-ref-pill ${statusClass[lead.status] || 'blue'}`}>{lead.status}</span></td>
                  <td>☎ {lead.lastActivity}</td>
                  <td>▣ {lead.nextFollowUp}</td>
                  <td><span className="lead-ref-owner"><span className="lead-ref-avatar">R</span>{lead.owner}</span></td>
                  <td>⋮</td>
                </tr>
              ))}
            </tbody>
          </table>
          <footer className="lead-ref-table-footer">
            <span>Showing 1 to 6 of 45 leads</span>
            <div className="lead-ref-pagination"><button>‹</button><button className="active">1</button><button>2</button><button>3</button><span>...</span><button>8</button><button>›</button><select><option>10 / page</option></select></div>
          </footer>
        </section>
      </main>
    </div>
  );
}
