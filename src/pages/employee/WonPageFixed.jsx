import { useEffect, useRef } from 'react';
import DashboardSidebar from '../../components/dashboard/DashboardSidebar.jsx';
import { leads } from '../leads/leadsData.js';

function applyLayout(mainRef) {
  const main = mainRef.current;
  if (!main) return;
  if (window.innerWidth > 1200) {
    main.style.setProperty('margin-left', '310px', 'important');
    main.style.setProperty('width', 'calc(100vw - 310px)', 'important');
    main.style.setProperty('max-width', 'calc(100vw - 310px)', 'important');
    main.style.setProperty('padding', '16px 24px 32px', 'important');
  } else {
    main.style.setProperty('margin-left', '0', 'important');
    main.style.setProperty('width', '100%', 'important');
    main.style.setProperty('max-width', '100%', 'important');
    main.style.setProperty('padding', '14px', 'important');
  }
}

export default function WonPageFixed() {
  const mainRef = useRef(null);
  const rows = leads.filter((lead) => lead.status === 'Converted' || lead.status === 'Won');
  const value = rows.length * 245000;

  useEffect(() => {
    applyLayout(mainRef);
    const onResize = () => applyLayout(mainRef);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <div className="sf-fixed-shell">
      <style>{`
        @media(min-width:1201px){.sf-fixed-shell>.sfx-sidebar{position:fixed!important;left:0!important;top:0!important;bottom:0!important;width:310px!important;min-width:310px!important;max-width:310px!important;z-index:1000!important}}
        @media(max-width:1200px){.sf-fixed-shell>.sfx-sidebar{position:relative!important;width:100%!important;min-width:0!important;max-width:none!important;height:auto!important}}
        .sf-fixed-shell{min-height:100vh;background:#f6f9ff;color:#071633;overflow-x:hidden;font-family:Inter,system-ui,sans-serif}.sf-fixed-main{box-sizing:border-box;min-height:100vh;overflow-x:hidden}.sf-fixed-container{max-width:1080px;width:100%;margin:0}.sf-fixed-head{display:flex;align-items:center;justify-content:space-between;gap:14px;margin-bottom:12px}.sf-fixed-kicker{display:inline-flex;padding:5px 9px;border-radius:999px;background:#eaf2ff;color:#2563eb;font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.06em}.sf-fixed-head h1{margin:6px 0 3px;font-size:24px;line-height:1.08;letter-spacing:-.04em}.sf-fixed-head p{margin:0;color:#64748b;font-size:13px}.sf-fixed-btn{border:0;border-radius:13px;background:linear-gradient(135deg,#2563eb,#7c3aed);color:#fff;font-weight:850;padding:10px 16px;box-shadow:0 12px 26px rgba(37,99,235,.16);font-size:13px}.sf-fixed-stats{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;margin-bottom:14px}.sf-fixed-card{background:#fff;border:1px solid #dce8f8;border-radius:18px;box-shadow:0 12px 28px rgba(15,23,42,.055);padding:14px;min-width:0}.sf-fixed-stat{display:flex;gap:12px;align-items:center;min-height:68px}.sf-fixed-dot{width:42px;height:42px;border-radius:14px;display:grid;place-items:center;background:#eef5ff;color:#2563eb;font-weight:900}.sf-fixed-stat p{margin:0 0 4px;color:#64748b;font-size:12px;font-weight:800}.sf-fixed-stat strong{font-size:22px;line-height:1}.sf-fixed-table-wrap{overflow-x:auto}.sf-fixed-table{width:100%;min-width:760px;border-collapse:collapse}.sf-fixed-table th,.sf-fixed-table td{padding:11px 12px;text-align:left;border-bottom:1px solid #edf3fb;font-size:12.5px}.sf-fixed-table th{color:#64748b;font-weight:850}.sf-fixed-pill{display:inline-flex;border-radius:999px;padding:6px 10px;background:#dcfce7;color:#059669;font-size:11px;font-weight:900}@media(max-width:900px){.sf-fixed-stats{grid-template-columns:repeat(2,1fr)}}@media(max-width:640px){.sf-fixed-head{align-items:flex-start;flex-direction:column}.sf-fixed-stats{grid-template-columns:1fr}.sf-fixed-btn{width:100%}}
      `}</style>
      <DashboardSidebar role="employee" />
      <main ref={mainRef} className="sf-fixed-main">
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
            <article className="sf-fixed-card sf-fixed-stat"><span className="sf-fixed-dot">%</span><div><p>Conversion</p><strong>20%</strong></div></article>
            <article className="sf-fixed-card sf-fixed-stat"><span className="sf-fixed-dot">#</span><div><p>Total Leads</p><strong>{rows.length}</strong></div></article>
          </section>
          <section className="sf-fixed-card">
            <div className="sf-fixed-table-wrap">
              <table className="sf-fixed-table">
                <thead><tr><th>Lead</th><th>Company</th><th>Source</th><th>Status</th><th>Owner</th><th>Closed</th></tr></thead>
                <tbody>{rows.map((lead) => <tr key={lead.id}><td><strong>{lead.name}</strong><br /><small>{lead.phone}</small></td><td>{lead.company}</td><td>{lead.source}</td><td><span className="sf-fixed-pill">Won</span></td><td>{lead.owner}</td><td>{lead.lastActivity}</td></tr>)}</tbody>
              </table>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
