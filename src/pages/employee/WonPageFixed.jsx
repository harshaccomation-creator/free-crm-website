import { useMemo } from 'react';
import DashboardSidebar from '../../components/dashboard/DashboardSidebar.jsx';
import { CrmEmptyState } from '../../components/crm/CrmUiStates.jsx';
import { leads } from '../leads/leadsData.js';
import '../../styles/crmFixedPageShell.css';

export default function WonPageFixed() {
  const rows = useMemo(
    () => leads.filter((lead) => lead.status === 'Converted' || lead.status === 'Won'),
    [],
  );
  const value = rows.length * 245000;

  return (
    <div className="sf-fixed-shell won-polish-page">
      <DashboardSidebar role="employee" />
      <main className="sf-fixed-main">
        <div className="sf-fixed-container">
          <header className="sf-fixed-head">
            <div>
              <span className="sf-fixed-kicker">Employee Workspace</span>
              <h1>Won Leads</h1>
              <p>Converted leads, total value and closing details in one clean view.</p>
            </div>
            <button className="sf-fixed-btn" type="button">Export Won</button>
          </header>

          <section className="sf-fixed-stats">
            <article className="sf-fixed-card sf-fixed-stat"><span className="sf-fixed-dot">✓</span><div><p>Won Leads</p><strong>{rows.length}</strong></div></article>
            <article className="sf-fixed-card sf-fixed-stat"><span className="sf-fixed-dot">₹</span><div><p>Won Value</p><strong>₹{value.toLocaleString('en-IN')}</strong></div></article>
            <article className="sf-fixed-card sf-fixed-stat"><span className="sf-fixed-dot">%</span><div><p>Conversion</p><strong>{rows.length ? '20%' : '0%'}</strong></div></article>
            <article className="sf-fixed-card sf-fixed-stat"><span className="sf-fixed-dot">#</span><div><p>Total Leads</p><strong>{leads.length}</strong></div></article>
          </section>

          <section className="sf-fixed-card">
            <div className="sf-fixed-table-wrap">
              {rows.length ? (
                <table className="sf-fixed-table">
                  <thead>
                    <tr>
                      <th>Lead</th>
                      <th>Company</th>
                      <th>Source</th>
                      <th>Status</th>
                      <th>Owner</th>
                      <th>Closed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((lead) => (
                      <tr key={lead.id}>
                        <td><strong>{lead.name}</strong><br /><small>{lead.phone}</small></td>
                        <td>{lead.company}</td>
                        <td>{lead.source}</td>
                        <td><span className="sf-fixed-pill">Won</span></td>
                        <td>{lead.owner}</td>
                        <td>{lead.lastActivity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <CrmEmptyState
                  title="No won deals yet"
                  text="Closed deals will appear here once leads are marked as won or converted."
                  icon="🏆"
                  action={<button type="button" className="crm-empty-cta" onClick={() => { window.history.pushState({}, '', '/leads'); window.dispatchEvent(new Event('salesflow:navigate')); }}>View Leads</button>}
                />
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
