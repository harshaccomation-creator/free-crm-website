import { useEffect, useState } from 'react';
import { SaasLayout, SaasStats, goTo } from '../../components/saas/SaasLayout.jsx';
import { getDealsPipeline } from '../../services/crmModulesApi.js';

const tone = { New: '', Contacted: 'orange', 'In Progress': 'purple', 'Demo Scheduled': 'orange', 'Demo Done': 'green', Won: 'green', Lost: 'red' };
function money(value) { return `₹${Number(value || 0).toLocaleString('en-IN')}`; }

export default function DealsPage({ role = 'employee' }) {
  const [data, setData] = useState({ stages: [], deals: [], totalValue: 0, wonValue: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function load() {
    setLoading(true); setError('');
    try { setData(await getDealsPipeline()); }
    catch (err) { setError(err.message || 'Unable to load deals.'); }
    finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);

  return (
    <SaasLayout role={role} title="Deals Pipeline" subtitle="Real pipeline built from lead stages, deal value, and follow-up status." actions={<button className="saas-btn primary" onClick={() => goTo('/leads')}>+ Create Deal Lead</button>}>
      {error ? <div className="saas-banner error">{error}</div> : null}
      <SaasStats items={[{ label: 'Open Deals', value: loading ? '...' : data.deals.filter(d => !['Won', 'Lost', 'Demo Done'].includes(d.stage)).length, icon: '◇' }, { label: 'Pipeline Value', value: money(data.totalValue), icon: '₹' }, { label: 'Won Value', value: money(data.wonValue), icon: '✓' }, { label: 'Stages', value: data.stages.length, icon: '▦' }]} />
      <section className="saas-card saas-panel"><div className="saas-panel-head"><h2>Pipeline Board</h2></div><div className="saas-pipeline">{data.stages.map((stage) => <div className="saas-stage" key={stage.stage}><h3>{stage.stage} <span className={`saas-badge ${tone[stage.stage] || ''}`}>{stage.deals.length}</span></h3>{stage.deals.map((deal) => <article className="saas-deal" key={deal.id} onClick={() => goTo(`/leads/${deal.id}`)}><strong>{deal.title}</strong><small>{deal.company}</small><p>{money(deal.value)}</p><span className="saas-badge">{deal.owner}</span></article>)}{!stage.deals.length ? <p className="saas-empty" style={{padding: 12}}>No deals</p> : null}</div>)}</div></section>
    </SaasLayout>
  );
}
