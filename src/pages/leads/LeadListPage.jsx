import { useMemo, useState } from 'react';
import DashboardSidebar from '../../components/dashboard/DashboardSidebar.jsx';
import { leads as initialLeads } from './leadsData.js';
import '../../styles/leadsReferenceExact.css';

const metrics = [
  ['Total Leads','1,245','↑ 12.5%','♟','blue'],
  ['New Leads','320','↑ 8.4%','＋','blue'],
  ['Contacted','452','↑ 15.3%','☎','green'],
  ['In Progress','268','↓ 4.6%','◷','orange down'],
  ['Converted','205','↑ 10.2%','♕','green'],
  ['Lost','78','↓ 8.1%','⊘','red down'],
];

const sourceClass = { Website: 'blue', Referral: 'green', LinkedIn: 'purple', 'Cold Call': 'orange', 'Email Campaign': 'purple', WhatsApp: 'green', Other: 'blue' };
const statusClass = { New: 'blue', Contacted: 'orange', 'In Progress': 'blue', Converted: 'green', Lost: 'red' };
const defaultForm = { name: '', email: '', phone: '', company: '', source: 'Website', status: 'New', nextFollowUpDate: '', nextFollowUpTime: '', priority: 'Warm', jobTitle: '', notes: '' };

function getCurrentRole() {
  const saved = window.localStorage.getItem('salesflowRole');
  if (saved === 'admin' || saved === 'superAdmin' || saved === 'employee') return saved;
  return 'employee';
}
function formatDateTime(value = new Date()) {
  const date = value instanceof Date ? value : new Date(value);
  return date.toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }).replace(',', '');
}
function makeInitials(name = '') {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return ((parts[0]?.[0] || 'L') + (parts[1]?.[0] || '')).toUpperCase();
}
function slugify(name = '') {
  return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || `lead-${Date.now()}`;
}
function csvEscape(value) {
  return `"${String(value ?? '').replaceAll('"', '""')}"`;
}

export default function LeadListPage() {
  const role = getCurrentRole();
  const [leadRows, setLeadRows] = useState(initialLeads);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [createdAt, setCreatedAt] = useState(formatDateTime());

  const openLead = (id) => {
    window.localStorage.setItem('salesflowRole', role);
    window.history.pushState({}, '', `/leads/${id}`);
    window.dispatchEvent(new Event('salesflow:navigate'));
  };
  const openAddLead = () => {
    setCreatedAt(formatDateTime());
    setForm(defaultForm);
    setIsAddOpen(true);
  };
  const updateForm = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const saveLead = (event) => {
    event.preventDefault();
    const nextFollowUp = form.nextFollowUpDate ? formatDateTime(`${form.nextFollowUpDate}T${form.nextFollowUpTime || '10:00'}`) : '-';
    const newLead = {
      id: `${slugify(form.name)}-${Date.now()}`,
      initials: makeInitials(form.name),
      name: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      company: form.company.trim(),
      source: form.source,
      status: form.status,
      owner: role === 'admin' ? 'Priya Mehta' : 'Rahul Sharma',
      lastActivity: createdAt,
      nextFollowUp,
      priority: form.priority,
      jobTitle: form.jobTitle || 'Customer',
      expectedClose: form.nextFollowUpDate ? formatDateTime(`${form.nextFollowUpDate}T${form.nextFollowUpTime || '10:00'}`).split(' ').slice(0, 3).join(' ') : '-',
      score: 60,
      notes: form.notes,
    };
    setLeadRows((rows) => [newLead, ...rows]);
    setIsAddOpen(false);
  };
  const exportLeads = () => {
    const headers = ['Lead Name', 'Email', 'Mobile Number', 'Company', 'Lead Source', 'Status', 'Lead Owner', 'Created Date Time', 'Next Follow Up', 'Priority', 'Job Title'];
    const rows = leadRows.map((lead) => [lead.name, lead.email, lead.phone, lead.company, lead.source, lead.status, lead.owner, lead.lastActivity, lead.nextFollowUp, lead.priority, lead.jobTitle]);
    const csv = [headers, ...rows].map((row) => row.map(csvEscape).join(',')).join('\n');
    const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `salesflow-leads-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };
  const totalText = useMemo(() => `Showing 1 to ${Math.min(leadRows.length, 10)} of ${leadRows.length} leads`, [leadRows.length]);

  return (
    <div className="sf-dashboard lead-reference lead-list-reference">
      <DashboardSidebar role={role} />
      <main className="lead-ref-main">
        <header className="lead-ref-header">
          <div><h1>Lead Activity</h1><p>Home › Leads › Lead Activity</p></div>
          <div className="lead-ref-actions"><button type="button" onClick={exportLeads}>⇩ Export</button><button type="button" className="primary" onClick={openAddLead}>＋ Add Lead</button></div>
        </header>
        <section className="lead-ref-metrics">
          {metrics.map(([title, value, change, icon, tone]) => <article className={`lead-ref-metric ${tone}`} key={title}><span className="icon">{icon}</span><div><p>{title}</p><h2>{value}</h2><small>{change}</small></div></article>)}
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
          <table className="lead-ref-table"><thead><tr><th><input className="lead-ref-check" type="checkbox" /></th><th>Lead Name</th><th>Company</th><th>Lead Source</th><th>Status</th><th>Last Activity</th><th>Next Follow Up</th><th>Lead Owner</th><th>Actions</th></tr></thead><tbody>{leadRows.map((lead) => <tr key={lead.id} onClick={() => openLead(lead.id)}><td><input className="lead-ref-check" type="checkbox" onClick={(event) => event.stopPropagation()} /></td><td><div className="lead-ref-person"><span className="lead-ref-avatar">{lead.initials}</span><div><strong>{lead.name}</strong><small>{lead.phone}</small></div></div></td><td>{lead.company}</td><td><span className={`lead-ref-pill ${sourceClass[lead.source] || 'blue'}`}>{lead.source}</span></td><td><span className={`lead-ref-pill ${statusClass[lead.status] || 'blue'}`}>{lead.status}</span></td><td>☎ {lead.lastActivity}</td><td>▣ {lead.nextFollowUp}</td><td><span className="lead-ref-owner"><span className="lead-ref-avatar">R</span>{lead.owner}</span></td><td>⋮</td></tr>)}</tbody></table>
          <footer className="lead-ref-table-footer"><span>{totalText}</span><div className="lead-ref-pagination"><button>‹</button><button className="active">1</button><button>2</button><button>3</button><span>...</span><button>8</button><button>›</button><select><option>10 / page</option></select></div></footer>
        </section>
      </main>
      {isAddOpen && <div className="lead-modal-backdrop" role="presentation" onClick={() => setIsAddOpen(false)}><section className="lead-add-modal" role="dialog" aria-modal="true" aria-labelledby="addLeadTitle" onClick={(event) => event.stopPropagation()}><header><div><h2 id="addLeadTitle">Add New Lead</h2><p>Created automatically on {createdAt}</p></div><button type="button" onClick={() => setIsAddOpen(false)}>×</button></header><form onSubmit={saveLead} className="lead-add-form"><label>Customer Name<input required value={form.name} onChange={(event) => updateForm('name', event.target.value)} placeholder="Enter customer name" /></label><label>Email ID<input required type="email" value={form.email} onChange={(event) => updateForm('email', event.target.value)} placeholder="customer@example.com" /></label><label>Mobile Number<input required value={form.phone} onChange={(event) => updateForm('phone', event.target.value)} placeholder="+91 98765 43210" /></label><label>Company<input required value={form.company} onChange={(event) => updateForm('company', event.target.value)} placeholder="Company name" /></label><label>Lead Source<select value={form.source} onChange={(event) => updateForm('source', event.target.value)}><option>Website</option><option>Referral</option><option>LinkedIn</option><option>Cold Call</option><option>Email Campaign</option><option>WhatsApp</option><option>Other</option></select></label><label>Status<select value={form.status} onChange={(event) => updateForm('status', event.target.value)}><option>New</option><option>Contacted</option><option>In Progress</option><option>Converted</option><option>Lost</option></select></label><label>Next Follow-up Date<input type="date" value={form.nextFollowUpDate} onChange={(event) => updateForm('nextFollowUpDate', event.target.value)} /></label><label>Next Follow-up Time<input type="time" value={form.nextFollowUpTime} onChange={(event) => updateForm('nextFollowUpTime', event.target.value)} /></label><label>Priority<select value={form.priority} onChange={(event) => updateForm('priority', event.target.value)}><option>Hot</option><option>Warm</option><option>High</option><option>Medium</option><option>Low</option></select></label><label>Job Title<input value={form.jobTitle} onChange={(event) => updateForm('jobTitle', event.target.value)} placeholder="Founder / Manager / Customer" /></label><label className="full">Notes<textarea value={form.notes} onChange={(event) => updateForm('notes', event.target.value)} placeholder="Requirement, budget, interest, discussion notes..." /></label><footer><button type="button" onClick={() => setIsAddOpen(false)}>Cancel</button><button className="primary" type="submit">Save Lead</button></footer></form></section></div>}
    </div>
  );
}
