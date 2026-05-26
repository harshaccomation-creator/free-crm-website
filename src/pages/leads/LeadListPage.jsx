import { useMemo, useState } from 'react';
import DashboardSidebar from '../../components/dashboard/DashboardSidebar.jsx';
import { leads as initialLeads } from './leadsData.js';
import '../../styles/leadActivityStable.css';
import '../../styles/leadListFontFix.css';
import '../../styles/leadListSoftProfessional.css';

const metrics = [
  ['Total Leads', '1,245', '↑ 12.5%', 'user', 'blue'],
  ['New Leads', '320', '↑ 8.4%', 'plus', 'blue'],
  ['Contacted', '452', '↑ 15.3%', 'phone', 'green'],
  ['In Progress', '268', '↓ 4.6%', 'clock', 'orange down'],
  ['Converted', '205', '↑ 10.2%', 'crown', 'green'],
  ['Lost', '78', '↓ 8.1%', 'ban', 'red down'],
];

const sourceClass = { Website: 'blue', Referral: 'green', LinkedIn: 'purple', 'Cold Call': 'orange', 'Email Campaign': 'purple', WhatsApp: 'green', Other: 'blue' };
const statusClass = { New: 'blue', Contacted: 'orange', 'In Progress': 'blue', Converted: 'green', Lost: 'red' };
const defaultForm = { name: '', email: '', phone: '', company: '', source: 'Website', status: 'New', nextFollowUpDate: '', nextFollowUpTime: '', priority: 'Warm', jobTitle: '', notes: '' };

function LeadSvg({ type }) {
  const icons = {
    user: <path d="M20 21a8 8 0 0 0-16 0M12 13a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z" />,
    plus: <path d="M12 5v14M5 12h14" />,
    phone: <path d="M22 16.9v3a2 2 0 0 1-2.2 2A19.8 19.8 0 0 1 3.1 5.2 2 2 0 0 1 5.1 3h3a2 2 0 0 1 2 1.7c.1.9.3 1.7.6 2.5a2 2 0 0 1-.5 2.1L9 10.5a16 16 0 0 0 4.5 4.5l1.2-1.2a2 2 0 0 1 2.1-.5c.8.3 1.6.5 2.5.6a2 2 0 0 1 1.7 2Z" />,
    clock: <path d="M12 21a9 9 0 1 0-9-9 9 9 0 0 0 9 9Zm0-14v5l4 2" />,
    crown: <path d="m3 8 4 3 5-7 5 7 4-3-2 10H5L3 8Zm2 13h14" />,
    ban: <path d="M12 21a9 9 0 1 0-9-9 9 9 0 0 0 9 9ZM5.7 5.7l12.6 12.6" />,
    download: <path d="M12 3v12m0 0 4-4m-4 4-4-4M5 21h14" />,
    filter: <path d="M4 5h16l-6 7v5l-4 2v-7L4 5Z" />,
    search: <path d="m21 21-4.3-4.3M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z" />,
    calendar: <path d="M7 3v4m10-4v4M4 9h16M5 5h14a1 1 0 0 1 1 1v14H4V6a1 1 0 0 1 1-1Z" />,
    dots: <path d="M12 8h.01M12 12h.01M12 16h.01" />,
  };
  return <svg className="la-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{icons[type]}</svg>;
}

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
    <div className="sf-dashboard la-page">
      <DashboardSidebar role={role} />
      <main className="la-main">
        <header className="la-header">
          <div><h1>My Leads</h1><p>Home › Leads</p></div>
          <div className="la-actions"><button type="button" onClick={exportLeads}><LeadSvg type="download" />Export</button><button type="button" className="primary" onClick={openAddLead}>+ Add Lead</button></div>
        </header>
        <section className="la-metrics">
          {metrics.map(([title, value, change, icon, tone]) => <article className={`la-metric ${tone}`} key={title}><span className="la-metric-icon"><LeadSvg type={icon} /></span><div><p>{title}</p><h2>{value}</h2><small>{change}</small></div></article>)}
        </section>
        <section className="la-filters">
          <div className="la-field"><span>Date Range</span><strong>01 May 2025 - 31 May 2025</strong><i>⌄</i></div>
          <div className="la-field"><span>Lead Source</span><strong>All Sources</strong><i>⌄</i></div>
          <div className="la-field"><span>Lead Owner</span><strong>All Users</strong><i>⌄</i></div>
          <div className="la-field"><span>Status</span><strong>All Statuses</strong><i>⌄</i></div>
          <label className="la-search"><LeadSvg type="search" /><input placeholder="Search leads..." /></label>
          <button className="la-filter-btn"><LeadSvg type="filter" />Filter</button>
        </section>
        <section className="la-table-card">
          <table className="la-table"><thead><tr><th><input className="la-check" type="checkbox" /></th><th>Lead Name</th><th>Company</th><th>Lead Source</th><th>Status</th><th>Last Activity</th><th>Next Follow Up</th><th>Lead Owner</th><th>Actions</th></tr></thead><tbody>{leadRows.map((lead) => <tr key={lead.id} onClick={() => openLead(lead.id)}><td><input className="la-check" type="checkbox" onClick={(event) => event.stopPropagation()} /></td><td><div className="la-person"><span className="la-avatar">{lead.initials}</span><div><strong>{lead.name}</strong><small>{lead.phone}</small></div></div></td><td>{lead.company}</td><td><span className={`la-pill ${sourceClass[lead.source] || 'blue'}`}>{lead.source}</span></td><td><span className={`la-pill ${statusClass[lead.status] || 'blue'}`}>{lead.status}</span></td><td><span className="la-icon-text"><LeadSvg type="phone" />{lead.lastActivity}</span></td><td><span className="la-icon-text"><LeadSvg type="calendar" />{lead.nextFollowUp}</span></td><td><span className="la-owner"><span className="la-avatar">R</span>{lead.owner}</span></td><td><LeadSvg type="dots" /></td></tr>)}</tbody></table>
          <footer className="la-footer"><span>{totalText}</span><div className="la-pagination"><button>‹</button><button className="active">1</button><button>2</button><button>3</button><span>...</span><button>8</button><button>›</button><select><option>10 / page</option></select></div></footer>
        </section>
      </main>
      {isAddOpen && <div className="la-modal-backdrop" role="presentation" onClick={() => setIsAddOpen(false)}><section className="la-modal" role="dialog" aria-modal="true" aria-labelledby="addLeadTitle" onClick={(event) => event.stopPropagation()}><header><div><h2 id="addLeadTitle">Add New Lead</h2><p>Created automatically on {createdAt}</p></div><button type="button" onClick={() => setIsAddOpen(false)}>×</button></header><form onSubmit={saveLead} className="la-form"><label>Customer Name<input required value={form.name} onChange={(event) => updateForm('name', event.target.value)} placeholder="Enter customer name" /></label><label>Email ID<input required type="email" value={form.email} onChange={(event) => updateForm('email', event.target.value)} placeholder="customer@example.com" /></label><label>Mobile Number<input required value={form.phone} onChange={(event) => updateForm('phone', event.target.value)} placeholder="+91 98765 43210" /></label><label>Company<input required value={form.company} onChange={(event) => updateForm('company', event.target.value)} placeholder="Company name" /></label><label>Lead Source<select value={form.source} onChange={(event) => updateForm('source', event.target.value)}><option>Website</option><option>Referral</option><option>LinkedIn</option><option>Cold Call</option><option>Email Campaign</option><option>WhatsApp</option><option>Other</option></select></label><label>Status<select value={form.status} onChange={(event) => updateForm('status', event.target.value)}><option>New</option><option>Contacted</option><option>In Progress</option><option>Converted</option><option>Lost</option></select></label><label>Next Follow-up Date<input type="date" value={form.nextFollowUpDate} onChange={(event) => updateForm('nextFollowUpDate', event.target.value)} /></label><label>Next Follow-up Time<input type="time" value={form.nextFollowUpTime} onChange={(event) => updateForm('nextFollowUpTime', event.target.value)} /></label><label>Priority<select value={form.priority} onChange={(event) => updateForm('priority', event.target.value)}><option>Hot</option><option>Warm</option><option>High</option><option>Medium</option><option>Low</option></select></label><label>Job Title<input value={form.jobTitle} onChange={(event) => updateForm('jobTitle', event.target.value)} placeholder="Founder / Manager / Customer" /></label><label className="full">Notes<textarea value={form.notes} onChange={(event) => updateForm('notes', event.target.value)} placeholder="Requirement, budget, interest, discussion notes..." /></label><footer><button type="button" onClick={() => setIsAddOpen(false)}>Cancel</button><button className="primary" type="submit">Save Lead</button></footer></form></section></div>}
    </div>
  );
}