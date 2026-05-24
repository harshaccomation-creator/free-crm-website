import DashboardSidebar from '../../components/dashboard/DashboardSidebar.jsx';
import { leads } from './leadsData.js';
import '../../styles/leadsPages.css';

export default function LeadListPage() {
  const openLead = (id) => {
    window.history.pushState({}, '', `/leads/${id}`);
    window.dispatchEvent(new Event('salesflow:navigate'));
  };

  return (
    <div className="sf-dashboard leads-shell">
      <DashboardSidebar role="employee" />
      <main className="leads-main">
        <header className="leads-header">
          <div><h1>Lead Activity</h1><p>Home › Leads › Lead Activity</p></div>
          <div><button className="ghost-btn">⇩ Export</button><button className="primary-btn">＋ Add Lead</button></div>
        </header>

        <section className="lead-metrics">
          {[
            ['Total Leads','1,245','↑ 12.5%','⏳'],['New Leads','320','↑ 8.4%','👥'],['Contacted','452','↑ 15.3%','☎'],['In Progress','268','↓ 4.6%','⌛'],['Converted','205','↑ 10.2%','✓'],['Lost','78','↓ 8.1%','✕']
          ].map((card) => <article key={card[0]}><span>{card[3]}</span><div><p>{card[0]}</p><h2>{card[1]}</h2><small>{card[2]}</small></div></article>)}
        </section>

        <section className="lead-filters">
          <label>Date Range<strong>01 May 2025 - 31 May 2025</strong></label>
          <label>Lead Source<strong>All Sources</strong></label>
          <label>Lead Owner<strong>All Users</strong></label>
          <label>Status<strong>All Statuses</strong></label>
          <input placeholder="Search leads..." />
          <button>▽ Filter</button>
        </section>

        <section className="lead-table-card">
          <table>
            <thead><tr><th><input type="checkbox" /></th><th>Lead Name</th><th>Company</th><th>Lead Source</th><th>Status</th><th>Last Activity</th><th>Next Follow Up</th><th>Lead Owner</th><th>Actions</th></tr></thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id} onClick={() => openLead(lead.id)}>
                  <td><input type="checkbox" onClick={(e) => e.stopPropagation()} /></td>
                  <td><div className="lead-name-cell"><span>{lead.initials}</span><div><strong>{lead.name}</strong><small>{lead.phone}</small></div></div></td>
                  <td>{lead.company}</td><td><mark>{lead.source}</mark></td><td><b className="lead-status">{lead.status}</b></td><td>☎ {lead.lastActivity}</td><td>▣ {lead.nextFollowUp}</td><td><span className="owner-dot">R</span> {lead.owner}</td><td>⋮</td>
                </tr>
              ))}
            </tbody>
          </table>
          <footer><span>Showing 1 to 6 of 45 leads</span><div><button>‹</button><button className="active">1</button><button>2</button><button>3</button><button>›</button></div></footer>
        </section>
      </main>
    </div>
  );
}
