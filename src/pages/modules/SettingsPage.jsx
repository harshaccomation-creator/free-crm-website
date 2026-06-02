import { useEffect, useState } from 'react';
import { SaasLayout, SaasStats } from '../../components/saas/SaasLayout.jsx';
import { getSettingsData } from '../../services/crmModulesApi.js';

export default function SettingsPage({ role = 'employee' }) {
  const [data, setData] = useState({ profile: null, company: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function load() {
    setLoading(true); setError('');
    try { setData(await getSettingsData()); }
    catch (err) { setError(err.message || 'Unable to load settings.'); }
    finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);

  const profile = data.profile || {};
  const company = data.company || {};
  return (
    <SaasLayout role={role} title="Settings" subtitle="Company, account and subscription settings for this workspace." actions={<button className="saas-btn" onClick={load}>Refresh</button>}>
      {error ? <div className="saas-banner error">{error}</div> : null}
      <SaasStats items={[{ label: 'Role', value: loading ? '...' : profile.role || '-' }, { label: 'Company', value: company.name || '-' }, { label: 'Plan', value: company.plan || 'trial' }, { label: 'Status', value: company.plan_status || '-' }]} />
      <section className="saas-panel-grid">
        <article className="saas-card saas-panel"><h2>Profile Settings</h2><div className="saas-form"><label>Full Name<input value={profile.full_name || ''} readOnly /></label><label>Email<input value={profile.email || ''} readOnly /></label><label>Phone<input value={profile.phone || ''} readOnly /></label><label>Role<input value={profile.role || ''} readOnly /></label></div></article>
        <article className="saas-card saas-panel"><h2>Company Settings</h2><div className="saas-form"><label>Company Name<input value={company.name || ''} readOnly /></label><label>Company Email<input value={company.email || ''} readOnly /></label><label>Plan<input value={company.plan || ''} readOnly /></label><label>Plan Status<input value={company.plan_status || ''} readOnly /></label></div></article>
      </section>
      <div className="saas-banner">Settings are read-only for safety. Company Admin/Super Admin controlled update forms should be added with approval workflow.</div>
    </SaasLayout>
  );
}
