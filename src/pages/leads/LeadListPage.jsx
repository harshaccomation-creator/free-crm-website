import { useEffect, useMemo, useState } from 'react';
import DashboardSidebar from '../../components/dashboard/DashboardSidebar.jsx';
import { leads as initialLeads } from './leadsData.js';
import { createLead, isBackendConfigured, listLeads } from '../../services/crmApi.js';
import '../../styles/leadActivityStable.css';
import '../../styles/leadListFontFix.css';
import '../../styles/leadListSoftProfessional.css';
import '../../styles/leadFilterFix.css';
import '../../styles/leadListFinalTableFix.css';

const sourceClass = { Website: 'blue', Referral: 'green', LinkedIn: 'purple', 'Cold Call': 'orange', 'Email Campaign': 'purple', WhatsApp: 'green', Other: 'blue' };
const statusClass = { New: 'blue', Contacted: 'orange', 'In Progress': 'blue', Converted: 'green', Won: 'green', Lost: 'red' };
const sourceOptions = ['All Sources', 'Website', 'Referral', 'LinkedIn', 'Cold Call', 'Email Campaign', 'WhatsApp', 'Other'];
const statusOptions = ['All Statuses', 'New', 'Contacted', 'In Progress', 'Converted', 'Won', 'Lost'];
const dateOptions = [
  { label: 'All Dates', value: 'all' },
  { label: '01 May 2025 - 31 May 2025', value: 'may-2025' },
  { label: 'Last 7 Days', value: 'last-7' },
  { label: 'Today', value: 'today' },
];
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
    eye: <><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" /></>,
  };
  return <svg className="la-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{icons[type]}</svg>;
}

function getCurrentRole() {
  const saved = window.localStorage.getItem('salesflowRole') || window.localStorage.getItem('salesflow_user_role');
  if (saved === 'admin' || saved === 'company_admin' || saved === 'superAdmin' || saved === 'super_admin' || saved === 'employee') return saved;
  return 'employee';
}
function formatDateTime(value = new Date()) {
  if (!value || value === '-') return '-';
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }).replace(',', '');
}
function makeInitials(name = '') {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return ((parts[0]?.[0] || 'L') + (parts[1]?.[0] || '')).toUpperCase();
}
function csvEscape(value) {
  return `"${String(value ?? '').replaceAll('"', '""')}"`;
}
function getPageNumbers(currentPage, totalPages) {
  if (totalPages <= 5) return Array.from({ length: totalPages }, (_, index) => index + 1);
  const pages = new Set([1, totalPages, currentPage, currentPage - 1, currentPage + 1]);
  return [...pages].filter((page) => page >= 1 && page <= totalPages).sort((a, b) => a - b);
}
function parseLeadDate(text = '') {
  const cleaned = String(text).replace(',', '').trim();
  const match = cleaned.match(/(\d{1,2})\s+([A-Za-z]{3})\s+(\d{4})/);
  if (!match) return null;
  const [, day, mon, year] = match;
  const months = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };
  return new Date(Number(year), months[mon] ?? 0, Number(day));
}
function matchesDateRange(lead, range) {
  if (range === 'all') return true;
  const date = parseLeadDate(lead.lastActivity) || parseLeadDate(lead.nextFollowUp);
  if (!date) return range === 'may-2025';
  if (range === 'may-2025') return date.getFullYear() === 2025 && date.getMonth() === 4;
  if (range === 'today') return date.toDateString() === new Date().toDateString();
  if (range === 'last-7') {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return date >= weekAgo;
  }
  return true;
}
function normalizeLead(record) {
  return {
    id: record.id,
    initials: record.initials || makeInitials(record.name),
    name: record.name || 'Unnamed Lead',
    phone: record.phone || '-',
    email: record.email || '-',
    company: record.company || record.company_name || '-',
    source: record.source || 'Website',
    status: record.status === 'Won' ? 'Converted' : (record.status || 'New'),
    owner: record.owner?.full_name || record.owner || 'Unassigned',
    lastActivity: formatDateTime(record.last_activity_at || record.updated_at || record.created_at),
    nextFollowUp: record.next_follow_up ? formatDateTime(record.next_follow_up) : (record.nextFollowUp || '-'),
    priority: record.priority || 'Warm',
    jobTitle: record.job_title || record.jobTitle || 'Customer',
    expectedClose: record.next_follow_up ? formatDateTime(record.next_follow_up).split(' ').slice(0, 3).join(' ') : (record.expectedClose || '-'),
    score: record.score || 60,
    notes: record.notes || '',
    raw: record,
  };
}
function buildMetrics(rows) {
  const total = rows.length;
  const newCount = rows.filter((lead) => lead.status === 'New').length;
  const contacted = rows.filter((lead) => lead.status === 'Contacted').length;
  const progress = rows.filter((lead) => lead.status === 'In Progress').length;
  const converted = rows.filter((lead) => lead.status === 'Converted' || lead.status === 'Won').length;
  const lost = rows.filter((lead) => lead.status === 'Lost').length;
  return [
    ['Total Leads', total.toLocaleString('en-IN'), 'Live data', 'user', 'blue'],
    ['New Leads', newCount.toLocaleString('en-IN'), 'Live data', 'plus', 'blue'],
    ['Contacted', contacted.toLocaleString('en-IN'), 'Live data', 'phone', 'green'],
    ['In Progress', progress.toLocaleString('en-IN'), 'Live data', 'clock', 'orange'],
    ['Converted', converted.toLocaleString('en-IN'), 'Live data', 'crown', 'green'],
    ['Lost', lost.toLocaleString('en-IN'), 'Live data', 'ban', 'red'],
  ];
}
function getFollowUpIso(form) {
  if (!form.nextFollowUpDate) return null;
  return new Date(`${form.nextFollowUpDate}T${form.nextFollowUpTime || '10:00'}`).toISOString();
}

export default function LeadListPage() {
  const role = getCurrentRole();
  const [leadRows, setLeadRows] = useState(initialLeads.map(normalizeLead));
  const [isLiveData, setIsLiveData] = useState(false);
  const [isLoading, setIsLoading] = useState(Boolean(isBackendConfigured));
  const [dataMessage, setDataMessage] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [createdAt, setCreatedAt] = useState(formatDateTime());
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [dateRange, setDateRange] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('All Sources');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    let alive = true;
    async function loadRealLeads() {
      if (!isBackendConfigured) {
        setIsLoading(false);
        setDataMessage('Demo mode: Supabase environment variables missing. Showing sample leads.');
        return;
      }
      try {
        setIsLoading(true);
        const rows = await listLeads({ limit: 1000 });
        if (!alive) return;
        setLeadRows(rows.map(normalizeLead));
        setIsLiveData(true);
        setDataMessage(rows.length ? 'Live Supabase data connected.' : 'Live Supabase connected. No leads found yet.');
      } catch (error) {
        if (!alive) return;
        setIsLiveData(false);
        setDataMessage(`Demo mode: ${error.message}. Showing sample leads.`);
      } finally {
        if (alive) setIsLoading(false);
      }
    }
    loadRealLeads();
    return () => { alive = false; };
  }, []);

  const filteredLeads = useMemo(() => leadRows.filter((lead) => {
    const q = searchTerm.trim().toLowerCase();
    const searchMatch = !q || [lead.name, lead.phone, lead.email, lead.company, lead.source, lead.status, lead.owner].some((value) => String(value || '').toLowerCase().includes(q));
    const sourceMatch = sourceFilter === 'All Sources' || lead.source === sourceFilter;
    const statusMatch = statusFilter === 'All Statuses' || lead.status === statusFilter;
    const dateMatch = matchesDateRange(lead, dateRange);
    return searchMatch && sourceMatch && statusMatch && dateMatch;
  }), [leadRows, searchTerm, sourceFilter, statusFilter, dateRange]);

  const metrics = useMemo(() => buildMetrics(leadRows), [leadRows]);
  const totalPages = Math.max(1, Math.ceil(filteredLeads.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const pageStart = (safePage - 1) * pageSize;
  const pageEnd = Math.min(pageStart + pageSize, filteredLeads.length);
  const visibleLeads = filteredLeads.slice(pageStart, pageEnd);
  const pageNumbers = getPageNumbers(safePage, totalPages);
  const activeDateLabel = dateOptions.find((item) => item.value === dateRange)?.label || 'All Dates';

  const resetToFirstPage = () => setCurrentPage(1);
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
  const saveLead = async (event) => {
    event.preventDefault();
    if (isSaving) return;
    setIsSaving(true);
    const followUpIso = getFollowUpIso(form);
    try {
      if (isBackendConfigured) {
        const saved = await createLead({
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          company: form.company.trim(),
          source: form.source,
          status: form.status,
          priority: form.priority,
          job_title: form.jobTitle || 'Customer',
          notes: form.notes,
          next_follow_up: followUpIso,
        });
        setLeadRows((rows) => [normalizeLead(saved), ...rows]);
        setIsLiveData(true);
        setDataMessage('Lead saved to Supabase.');
      } else {
        const nextFollowUp = followUpIso ? formatDateTime(followUpIso) : '-';
        const newLead = normalizeLead({
          id: `demo-${Date.now()}`,
          name: form.name.trim(),
          phone: form.phone.trim(),
          email: form.email.trim(),
          company: form.company.trim(),
          source: form.source,
          status: form.status,
          owner: role === 'admin' ? 'Priya Mehta' : 'Rahul Sharma',
          created_at: new Date().toISOString(),
          nextFollowUp,
          priority: form.priority,
          jobTitle: form.jobTitle || 'Customer',
          notes: form.notes,
        });
        setLeadRows((rows) => [newLead, ...rows]);
      }
      setCurrentPage(1);
      setIsAddOpen(false);
    } catch (error) {
      setDataMessage(`Save failed: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };
  const exportLeads = () => {
    const headers = ['Lead Name', 'Email', 'Mobile Number', 'Company', 'Lead Source', 'Status', 'Lead Owner', 'Created Date Time', 'Next Follow Up', 'Priority', 'Job Title'];
    const rows = filteredLeads.map((lead) => [lead.name, lead.email, lead.phone, lead.company, lead.source, lead.status, lead.owner, lead.lastActivity, lead.nextFollowUp, lead.priority, lead.jobTitle]);
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
  const totalText = useMemo(() => {
    if (!filteredLeads.length) return 'Showing 0 leads';
    return `Showing ${pageStart + 1} to ${pageEnd} of ${filteredLeads.length} leads`;
  }, [filteredLeads.length, pageStart, pageEnd]);

  return (
    <div className="sf-dashboard la-page">
      <DashboardSidebar role={role} />
      <main className="la-main">
        <header className="la-header">
          <div><h1>My Leads</h1><p>Home › Leads</p></div>
          <div className="la-actions"><button type="button" onClick={exportLeads}><LeadSvg type="download" />Export</button><button type="button" className="primary" onClick={openAddLead}>+ Add Lead</button></div>
        </header>
        {dataMessage ? <div className={`la-live-banner ${isLiveData ? 'live' : 'demo'}`}>{isLoading ? 'Loading leads...' : dataMessage}</div> : null}
        <section className="la-metrics">
          {metrics.map(([title, value, change, icon, tone]) => <article className={`la-metric ${tone}`} key={title}><span className="la-metric-icon"><LeadSvg type={icon} /></span><div><p>{title}</p><h2>{isLoading ? '...' : value}</h2><small>{change}</small></div></article>)}
        </section>
        <section className="la-filters">
          <label className="la-field la-filter-control"><span>Date Range</span><strong>{activeDateLabel}</strong><select value={dateRange} onChange={(event) => { setDateRange(event.target.value); resetToFirstPage(); }}>{dateOptions.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select><i>⌄</i></label>
          <label className="la-field la-filter-control"><span>Lead Source</span><strong>{sourceFilter}</strong><select value={sourceFilter} onChange={(event) => { setSourceFilter(event.target.value); resetToFirstPage(); }}>{sourceOptions.map((item) => <option key={item}>{item}</option>)}</select><i>⌄</i></label>
          <label className="la-field la-filter-control"><span>Status</span><strong>{statusFilter}</strong><select value={statusFilter} onChange={(event) => { setStatusFilter(event.target.value); resetToFirstPage(); }}>{statusOptions.map((item) => <option key={item}>{item}</option>)}</select><i>⌄</i></label>
          <label className="la-search"><LeadSvg type="search" /><input value={searchTerm} onChange={(event) => { setSearchTerm(event.target.value); resetToFirstPage(); }} placeholder="Search leads..." /></label>
          <button className="la-filter-btn" type="button" onClick={() => { setDateRange('all'); setSourceFilter('All Sources'); setStatusFilter('All Statuses'); setSearchTerm(''); setCurrentPage(1); }}><LeadSvg type="filter" />Reset</button>
        </section>
        <section className="la-table-card">
          <table className="la-table"><thead><tr><th><input className="la-check" type="checkbox" /></th><th>Lead Name</th><th>Company</th><th>Lead Source</th><th>Status</th><th>Last Activity</th><th>Next Follow Up</th><th>Lead Owner</th><th>Actions</th></tr></thead><tbody>{visibleLeads.map((lead) => <tr key={lead.id} onClick={() => openLead(lead.id)}><td><input className="la-check" type="checkbox" onClick={(event) => event.stopPropagation()} /></td><td><div className="la-person"><span className="la-avatar">{lead.initials}</span><div><strong>{lead.name}</strong><small>{lead.phone}</small></div></div></td><td>{lead.company}</td><td><span className={`la-pill ${sourceClass[lead.source] || 'blue'}`}>{lead.source}</span></td><td><span className={`la-pill ${statusClass[lead.status] || 'blue'}`}>{lead.status}</span></td><td><span className="la-icon-text"><LeadSvg type="phone" />{lead.lastActivity}</span></td><td><span className="la-icon-text"><LeadSvg type="calendar" />{lead.nextFollowUp}</span></td><td><span className="la-owner"><span className="la-avatar">{String(lead.owner || 'U')[0]}</span>{lead.owner}</span></td><td><button type="button" className="la-row-action" onClick={(event) => { event.stopPropagation(); openLead(lead.id); }} aria-label={`Open ${lead.name}`}><LeadSvg type="eye" /></button></td></tr>)}</tbody></table>
          <footer className="la-footer"><span>{totalText}</span><div className="la-pagination"><button type="button" disabled={safePage === 1} onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}>‹</button>{pageNumbers.map((page, index) => <span className="la-page-wrap" key={page}>{index > 0 && page - pageNumbers[index - 1] > 1 ? <em>...</em> : null}<button type="button" className={safePage === page ? 'active' : ''} onClick={() => setCurrentPage(page)}>{page}</button></span>)}<button type="button" disabled={safePage === totalPages} onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}>›</button><select value={pageSize} onChange={(event) => { setPageSize(Number(event.target.value)); setCurrentPage(1); }}><option value="5">5 / page</option><option value="10">10 / page</option><option value="20">20 / page</option><option value="50">50 / page</option></select></div></footer>
        </section>
      </main>
      {isAddOpen && <div className="la-modal-backdrop" role="presentation" onClick={() => setIsAddOpen(false)}><section className="la-modal" role="dialog" aria-modal="true" aria-labelledby="addLeadTitle" onClick={(event) => event.stopPropagation()}><header><div><h2 id="addLeadTitle">Add New Lead</h2><p>Created automatically on {createdAt}</p></div><button type="button" onClick={() => setIsAddOpen(false)}>×</button></header><form onSubmit={saveLead} className="la-form"><label>Customer Name<input required value={form.name} onChange={(event) => updateForm('name', event.target.value)} placeholder="Enter customer name" /></label><label>Email ID<input required type="email" value={form.email} onChange={(event) => updateForm('email', event.target.value)} placeholder="customer@example.com" /></label><label>Mobile Number<input required value={form.phone} onChange={(event) => updateForm('phone', event.target.value)} placeholder="+91 98765 43210" /></label><label>Company<input required value={form.company} onChange={(event) => updateForm('company', event.target.value)} placeholder="Company name" /></label><label>Lead Source<select value={form.source} onChange={(event) => updateForm('source', event.target.value)}><option>Website</option><option>Referral</option><option>LinkedIn</option><option>Cold Call</option><option>Email Campaign</option><option>WhatsApp</option><option>Other</option></select></label><label>Status<select value={form.status} onChange={(event) => updateForm('status', event.target.value)}><option>New</option><option>Contacted</option><option>In Progress</option><option>Converted</option><option>Lost</option></select></label><label>Next Follow-up Date<input type="date" value={form.nextFollowUpDate} onChange={(event) => updateForm('nextFollowUpDate', event.target.value)} /></label><label>Next Follow-up Time<input type="time" value={form.nextFollowUpTime} onChange={(event) => updateForm('nextFollowUpTime', event.target.value)} /></label><label>Priority<select value={form.priority} onChange={(event) => updateForm('priority', event.target.value)}><option>Hot</option><option>Warm</option><option>High</option><option>Medium</option><option>Low</option></select></label><label>Job Title<input value={form.jobTitle} onChange={(event) => updateForm('jobTitle', event.target.value)} placeholder="Founder / Manager / Customer" /></label><label className="full">Notes<textarea value={form.notes} onChange={(event) => updateForm('notes', event.target.value)} placeholder="Requirement, budget, interest, discussion notes..." /></label><footer><button type="button" onClick={() => setIsAddOpen(false)}>Cancel</button><button className="primary" type="submit" disabled={isSaving}>{isSaving ? 'Saving...' : 'Save Lead'}</button></footer></form></section></div>}
    </div>
  );
}
