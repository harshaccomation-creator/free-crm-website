import { useEffect, useMemo, useState } from 'react';
import { SaasEmpty, SaasLayout, SaasStats, goTo } from '../../components/saas/SaasLayout.jsx';
import { CrmLoadingPanel } from '../../components/crm/CrmUiStates.jsx';
import { getContactsSummary } from '../../services/crmModulesApi.js';

function fmt(value) { return value ? new Date(value).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'; }

export default function ContactsPage({ role = 'employee' }) {
  const [data, setData] = useState({ contacts: [], total: 0, withEmail: 0, withPhone: 0, active: 0 });
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function load() {
    setLoading(true); setError('');
    try { setData(await getContactsSummary()); }
    catch (err) { setError(err.message || 'Unable to load contacts.'); }
    finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);

  const rows = useMemo(() => data.contacts.filter((contact) => {
    const q = query.trim().toLowerCase();
    const matchesQuery = !q || [contact.name, contact.email, contact.phone, contact.company, contact.owner].some((v) => String(v || '').toLowerCase().includes(q));
    const matchesStatus = status === 'All' || contact.status === status;
    return matchesQuery && matchesStatus;
  }), [data.contacts, query, status]);

  return (
    <SaasLayout role={role} title="Contacts" subtitle="All real customer contacts generated from CRM leads and assigned records." actions={<button className="saas-btn primary" onClick={() => goTo('/leads')}>+ Add from Lead</button>}>
      {error ? <div className="saas-banner error">{error}</div> : null}
      <SaasStats items={[{ label: 'Total Contacts', value: loading ? '...' : data.total, icon: '👥' }, { label: 'With Email', value: data.withEmail, icon: '✉' }, { label: 'With Phone', value: data.withPhone, icon: '☎' }, { label: 'Active Contacts', value: data.active, icon: '✓' }]} />
      <section className="saas-card saas-toolbar">
        <label className="saas-search"><span>⌕</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search contacts..." /></label>
        <select className="saas-select" value={status} onChange={(e) => setStatus(e.target.value)}><option>All</option><option>New</option><option>Contacted</option><option>In Progress</option><option>Won</option><option>Lost</option></select>
      </section>
      <section className={`saas-card saas-table-card${loading ? ' is-loading' : ''}`}>
        <div className="saas-table-wrap">
          {loading ? (
            <CrmLoadingPanel label="Loading contacts..." />
          ) : (
            <table className="saas-table">
              <thead><tr><th>Contact</th><th>Company</th><th>Source</th><th>Status</th><th>Owner</th><th>Last Activity</th></tr></thead>
              <tbody>
                {rows.length ? rows.map((contact) => (
                  <tr key={contact.id} onClick={() => goTo(`/leads/${contact.id}`)}>
                    <td className="saas-title-cell"><strong>{contact.name}</strong><small>{contact.email} • {contact.phone}</small></td>
                    <td>{contact.company}</td>
                    <td><span className="saas-badge">{contact.source}</span></td>
                    <td><span className="saas-badge green">{contact.status}</span></td>
                    <td>{contact.owner}</td>
                    <td>{fmt(contact.lastActivity)}</td>
                  </tr>
                )) : null}
              </tbody>
            </table>
          )}
        </div>
        {!loading && !rows.length ? (
          <SaasEmpty
            title="No contacts found"
            text="Contacts are created from real leads. Add or assign leads to populate this module."
            action={<button type="button" className="saas-btn primary" onClick={() => goTo('/leads')}>Go to Leads</button>}
          />
        ) : null}
        {!loading && rows.length ? (
          <footer className="saas-footer"><span>Showing {rows.length} contacts</span><button type="button" className="saas-btn" onClick={load}>Refresh</button></footer>
        ) : null}
      </section>
    </SaasLayout>
  );
}
