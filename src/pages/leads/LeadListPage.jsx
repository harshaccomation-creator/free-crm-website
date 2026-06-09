import { useMemo, useState } from "react";
import { Plus, Search, Eye, X, Save, Filter, RotateCcw, CalendarDays } from "lucide-react";
import EmployeeShell from "../../components/employee/EmployeeShell.jsx";
import { empLeads } from "../../data/employeeData.js";

const PAGE_SIZE = 10;
const tabs = ["All", "New", "Contacted", "Qualified", "Proposal Sent", "Won", "Lost"];
const statusOptions = ["New", "Contacted", "Qualified", "Proposal Sent", "Won", "Lost", "Overdue", "Junk"];
const sourceOptions = ["Website", "LinkedIn", "Referral", "Cold Email", "Event", "Cold Call", "WhatsApp", "Facebook", "Instagram", "Google Ads", "Manual"];
const scoreOptions = ["Hot", "Warm", "Cold"];
const dateOptions = ["All Dates", "Today", "Yesterday", "This Month", "Custom Range"];
const todayDate = "2026-06-09";
const yesterdayDate = "2026-06-08";
const monthStartDate = "2026-06-01";
const monthEndDate = "2026-06-30";

const emptyFilters = {
  status: "All",
  source: "All",
  dateType: "All Dates",
  from: "",
  to: "",
};

const emptyForm = {
  name: "",
  company: "",
  email: "",
  phone: "",
  status: "New",
  score: "Warm",
  value: "",
  source: "Website",
  industry: "",
  location: "",
  website: "",
  owner: "Jayraj",
  note: "",
};

function go(path) {
  window.history.pushState({}, "", path);
  window.dispatchEvent(new Event("salesflow:navigate"));
}

function initials(name = "") {
  return String(name).split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();
}

function scoreNumber(score) {
  if (typeof score === "number") return score;
  if (score === "Hot") return 90;
  if (score === "Warm") return 72;
  if (score === "Cold") return 45;
  return Number(score || 0);
}

function getLeadDate(lead) {
  if (lead.createdAt) return String(lead.createdAt).slice(0, 10);
  if (lead.createdDate) return String(lead.createdDate).slice(0, 10);
  if (lead.date) return String(lead.date).slice(0, 10);
  return todayDate;
}

function dateMatches(leadDate, filters) {
  if (filters.dateType === "All Dates") return true;
  if (filters.dateType === "Today") return leadDate === todayDate;
  if (filters.dateType === "Yesterday") return leadDate === yesterdayDate;
  if (filters.dateType === "This Month") return leadDate >= monthStartDate && leadDate <= monthEndDate;
  if (filters.dateType === "Custom Range") {
    if (filters.from && leadDate < filters.from) return false;
    if (filters.to && leadDate > filters.to) return false;
    return true;
  }
  return true;
}

function Field({ label, children, error, full = false }) {
  return (
    <label className={`${full ? "md:col-span-2" : ""} block`}>
      <span className="text-xs font-black text-slate-600 uppercase tracking-wide">{label}</span>
      <div className="mt-2">{children}</div>
      {error ? <p className="text-xs font-bold text-red-600 mt-1">{error}</p> : null}
    </label>
  );
}

const inputClass = "w-full h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold text-slate-900 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-300";

export default function LeadListPage() {
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [appliedFilters, setAppliedFilters] = useState(emptyFilters);
  const [tempFilters, setTempFilters] = useState(emptyFilters);
  const [page, setPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isAddLeadOpen, setIsAddLeadOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [localLeads, setLocalLeads] = useState([]);

  const leads = useMemo(() => {
    return [...localLeads, ...empLeads].map((lead) => ({
      ...lead,
      status: lead.status || "New",
      company: lead.company || "-",
      source: lead.source || "Manual",
      value: lead.value || 0,
      score: scoreNumber(lead.score),
      createdDate: getLeadDate(lead),
    }));
  }, [localLeads]);

  const counts = tabs.reduce((acc, tab) => {
    acc[tab] = tab === "All" ? leads.length : leads.filter((lead) => lead.status === tab).length;
    return acc;
  }, {});

  const filteredLeads = useMemo(() => {
    const query = search.trim().toLowerCase();
    return leads.filter((lead) => {
      const tabOk = activeTab === "All" || lead.status === activeTab;
      const statusOk = appliedFilters.status === "All" || lead.status === appliedFilters.status;
      const sourceOk = appliedFilters.source === "All" || lead.source === appliedFilters.source;
      const dateOk = dateMatches(lead.createdDate, appliedFilters);
      const searchOk = !query || [lead.name, lead.company, lead.email, lead.phone, lead.source]
        .join(" ")
        .toLowerCase()
        .includes(query);
      return tabOk && statusOk && sourceOk && dateOk && searchOk;
    });
  }, [activeTab, appliedFilters, search, leads]);

  const totalPages = Math.max(1, Math.ceil(filteredLeads.length / PAGE_SIZE));
  const start = (page - 1) * PAGE_SIZE;
  const pageRows = filteredLeads.slice(start, start + PAGE_SIZE);

  const hasActiveFilter = appliedFilters.status !== "All" || appliedFilters.source !== "All" || appliedFilters.dateType !== "All Dates";

  const updateForm = (field, value) => {
    setForm((old) => ({ ...old, [field]: value }));
    setErrors((old) => ({ ...old, [field]: "" }));
  };

  const openAddLead = () => {
    setForm(emptyForm);
    setErrors({});
    setIsAddLeadOpen(true);
  };

  const closeAddLead = () => {
    setIsAddLeadOpen(false);
    setErrors({});
  };

  const openFilterPopup = () => {
    setTempFilters(appliedFilters);
    setIsFilterOpen(true);
  };

  const closeFilterPopup = () => setIsFilterOpen(false);

  const saveFilters = () => {
    setAppliedFilters(tempFilters);
    setPage(1);
    setIsFilterOpen(false);
  };

  const resetFilters = () => {
    setAppliedFilters(emptyFilters);
    setTempFilters(emptyFilters);
    setPage(1);
  };

  const saveLead = (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (!form.name.trim()) nextErrors.name = "Lead name required";
    if (!form.company.trim()) nextErrors.company = "Company required";

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    const newLead = {
      id: `lead-${Date.now()}`,
      name: form.name.trim(),
      company: form.company.trim(),
      email: form.email.trim() || "-",
      phone: form.phone.trim() || "-",
      status: form.status,
      score: scoreNumber(form.score),
      value: form.value ? Number(form.value) : 0,
      source: form.source,
      industry: form.industry.trim(),
      location: form.location.trim(),
      website: form.website.trim(),
      owner: form.owner.trim(),
      note: form.note.trim(),
      createdAt: new Date().toISOString(),
    };

    setLocalLeads((prev) => [newLead, ...prev]);
    setAppliedFilters(emptyFilters);
    setTempFilters(emptyFilters);
    setSearch("");
    setActiveTab("All");
    setPage(1);
    closeAddLead();
  };

  return (
    <EmployeeShell>
      <style>{`
        .sf-employee .sf-leads-card .sf-tabs-row { overflow-x: visible !important; scrollbar-width: none !important; }
        .sf-employee .sf-leads-card .sf-tabs-row::-webkit-scrollbar { display: none !important; }
        .sf-employee .sf-leads-table.sf-leads-table { width: 100% !important; min-width: 0 !important; table-layout: fixed !important; border-collapse: collapse !important; }
        .sf-employee .sf-leads-table.sf-leads-table th,
        .sf-employee .sf-leads-table.sf-leads-table td { padding: 13px 18px !important; vertical-align: middle !important; height: 66px !important; }
        .sf-employee .sf-leads-table.sf-leads-table thead th { height: 44px !important; font-size: 12px !important; color: #64748b !important; background: #f8fafc !important; }
        .sf-employee .sf-leads-table.sf-leads-table th:nth-child(1), .sf-employee .sf-leads-table.sf-leads-table td:nth-child(1) { width: 30% !important; }
        .sf-employee .sf-leads-table.sf-leads-table th:nth-child(2), .sf-employee .sf-leads-table.sf-leads-table td:nth-child(2) { width: 22% !important; }
        .sf-employee .sf-leads-table.sf-leads-table th:nth-child(3), .sf-employee .sf-leads-table.sf-leads-table td:nth-child(3) { width: 15% !important; }
        .sf-employee .sf-leads-table.sf-leads-table th:nth-child(4), .sf-employee .sf-leads-table.sf-leads-table td:nth-child(4) { width: 15% !important; }
        .sf-employee .sf-leads-table.sf-leads-table th:nth-child(5), .sf-employee .sf-leads-table.sf-leads-table td:nth-child(5) { width: 9% !important; text-align: center !important; }
        .sf-employee .sf-leads-table.sf-leads-table th:nth-child(6), .sf-employee .sf-leads-table.sf-leads-table td:nth-child(6) { width: 9% !important; text-align: center !important; }
      `}</style>

      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div>
            <p className="text-xs font-bold text-orange-600 uppercase tracking-wider">Employee Workspace</p>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">My Leads</h1>
            <p className="text-lg text-slate-500 mt-2">Manage and track your assigned leads.</p>
          </div>

          <button type="button" onClick={openAddLead} className="h-12 px-6 rounded-xl bg-orange-600 text-white font-black inline-flex items-center gap-3 shadow-lg shadow-orange-500/20">
            <Plus className="w-5 h-5" />
            Add Lead
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          <section className="rounded-xl bg-white border border-slate-200 p-6 shadow-sm"><p className="text-lg text-slate-500 font-medium">Total Leads</p><h2 className="text-4xl font-black text-slate-900">{leads.length}</h2></section>
          <section className="rounded-xl bg-white border border-slate-200 p-6 shadow-sm"><p className="text-lg text-slate-500 font-medium">Active Leads</p><h2 className="text-4xl font-black text-slate-900">{leads.filter((lead) => !["Won", "Lost"].includes(lead.status)).length}</h2></section>
          <section className="rounded-xl bg-white border border-slate-200 p-6 shadow-sm"><p className="text-lg text-slate-500 font-medium">Lost Leads</p><h2 className="text-4xl font-black text-slate-900">{leads.filter((lead) => lead.status === "Lost").length}</h2></section>
          <section className="rounded-xl bg-white border border-slate-200 p-6 shadow-sm"><p className="text-lg text-slate-500 font-medium">Won Leads</p><h2 className="text-4xl font-black text-slate-900">{leads.filter((lead) => lead.status === "Won").length}</h2></section>
        </div>

        <section className="sf-leads-card rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 pt-6 border-b border-slate-200">
            <div className="sf-tabs-row flex flex-wrap items-center gap-x-9 gap-y-3">
              {tabs.map((tab) => (
                <button key={tab} type="button" onClick={() => { setActiveTab(tab); setPage(1); }} className={`relative pb-5 text-lg font-semibold flex items-center gap-2 whitespace-nowrap ${activeTab === tab ? "text-orange-600" : "text-slate-500 hover:text-slate-800"}`}>
                  {tab}
                  <span className="px-2 py-0.5 rounded-full text-sm bg-slate-100 text-slate-500">{counts[tab]}</span>
                  {activeTab === tab && <span className="absolute left-0 -bottom-[1px] h-[3px] w-full rounded-full bg-orange-600" />}
                </button>
              ))}
            </div>
          </div>

          <div className="px-6 py-5 border-b border-slate-200">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <label className="relative w-full lg:max-w-[540px]">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-orange-600" />
                <input value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Search leads, company, source..." className="w-full h-12 rounded-2xl border border-slate-200 bg-white pl-12 pr-4 text-sm font-bold text-slate-800 outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-300 shadow-sm" />
              </label>

              <button type="button" onClick={openFilterPopup} className={`h-12 px-6 rounded-2xl border font-black inline-flex items-center justify-center gap-2 ${hasActiveFilter ? "bg-orange-600 text-white border-orange-600 shadow-lg shadow-orange-500/20" : "bg-white text-slate-700 border-slate-200 hover:text-orange-600 hover:border-orange-200"}`}>
                <Filter className="w-5 h-5" /> Filter
              </button>
            </div>
          </div>

          <div className="w-full overflow-hidden">
            <table className="sf-leads-table w-full text-left">
              <thead className="bg-slate-50 text-slate-500 uppercase text-sm">
                <tr>
                  <th className="font-black">Lead</th>
                  <th className="font-black">Company</th>
                  <th className="font-black">Source</th>
                  <th className="font-black">Status</th>
                  <th className="font-black text-center">Score</th>
                  <th className="font-black text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {pageRows.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50/80 transition-colors">
                    <td>
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-full bg-purple-600 text-white grid place-items-center font-black shrink-0">{initials(lead.name)}</div>
                        <div className="min-w-0">
                          <button type="button" onClick={() => go(`/leads/${lead.id}`)} className="block text-[15px] leading-tight font-black text-slate-900 hover:text-orange-600 truncate max-w-[240px] text-left">{lead.name}</button>
                          <p className="text-[13px] leading-tight text-slate-500 truncate max-w-[240px] mt-1">{lead.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="text-[15px] font-semibold text-slate-800 break-words">{lead.company}</td>
                    <td className="text-[15px] font-semibold text-slate-500">{lead.source}</td>
                    <td><span className="px-3 py-1 rounded-lg border text-xs font-black bg-orange-50 text-orange-700 border-orange-100 whitespace-nowrap">{lead.status}</span></td>
                    <td className="text-center"><span className="mx-auto w-10 h-10 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 grid place-items-center font-black">{lead.score}</span></td>
                    <td className="text-center"><button type="button" onClick={() => go(`/leads/${lead.id}`)} className="mx-auto w-10 h-10 rounded-xl border border-slate-200 text-slate-600 hover:text-blue-600 hover:bg-slate-50 inline-flex items-center justify-center"><Eye className="w-5 h-5" /></button></td>
                  </tr>
                ))}
                {pageRows.length === 0 && <tr><td colSpan="6" className="px-6 py-12 text-center text-slate-500">No leads found.</td></tr>}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4 border-t border-slate-200 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <p className="text-sm font-semibold text-slate-500">Showing {filteredLeads.length === 0 ? 0 : start + 1}-{Math.min(start + PAGE_SIZE, filteredLeads.length)} of {filteredLeads.length}</p>
            <div className="flex items-center gap-3">
              <button disabled={page === 1} onClick={() => setPage((prev) => Math.max(1, prev - 1))} className="h-10 px-4 rounded-lg border border-slate-200 font-bold text-slate-700 disabled:opacity-40">Previous</button>
              <span className="text-sm font-black text-slate-700">Page {page} of {totalPages}</span>
              <button disabled={page === totalPages} onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))} className="h-10 px-4 rounded-lg border border-slate-200 font-bold text-slate-700 disabled:opacity-40">Next</button>
            </div>
          </div>
        </section>

        {isFilterOpen && (
          <div className="fixed inset-0 z-[99999] bg-slate-950/50 backdrop-blur-sm flex items-center justify-center p-5">
            <div className="w-full max-w-2xl rounded-3xl bg-white border border-slate-200 shadow-2xl overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-200 flex items-start justify-between gap-4 bg-gradient-to-b from-white to-slate-50">
                <div>
                  <p className="text-xs font-black text-orange-600 uppercase tracking-[0.18em]">Lead Filters</p>
                  <h2 className="text-2xl font-black text-slate-900 mt-1">Filter Leads</h2>
                  <p className="text-sm text-slate-500 mt-1">Status, source aur date range select karke save karo.</p>
                </div>
                <button type="button" onClick={closeFilterPopup} className="w-10 h-10 rounded-xl border border-slate-200 bg-white text-slate-500 grid place-items-center hover:text-red-600"><X className="w-5 h-5" /></button>
              </div>

              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <label>
                  <span className="text-sm font-black text-slate-600">Status</span>
                  <select value={tempFilters.status} onChange={(event) => setTempFilters((old) => ({ ...old, status: event.target.value }))} className="mt-2 w-full h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold outline-none focus:ring-2 focus:ring-orange-500/20">
                    <option>All</option>
                    {statusOptions.map((item) => <option key={item}>{item}</option>)}
                  </select>
                </label>

                <label>
                  <span className="text-sm font-black text-slate-600">Source</span>
                  <select value={tempFilters.source} onChange={(event) => setTempFilters((old) => ({ ...old, source: event.target.value }))} className="mt-2 w-full h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold outline-none focus:ring-2 focus:ring-orange-500/20">
                    <option>All</option>
                    {sourceOptions.map((item) => <option key={item}>{item}</option>)}
                  </select>
                </label>

                <label className="md:col-span-2">
                  <span className="text-sm font-black text-slate-600">Date</span>
                  <select value={tempFilters.dateType} onChange={(event) => {
                    const value = event.target.value;
                    setTempFilters((old) => ({ ...old, dateType: value, from: value === "Custom Range" ? old.from : "", to: value === "Custom Range" ? old.to : "" }));
                  }} className="mt-2 w-full h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold outline-none focus:ring-2 focus:ring-orange-500/20">
                    {dateOptions.map((item) => <option key={item}>{item}</option>)}
                  </select>
                </label>

                {tempFilters.dateType === "Custom Range" && (
                  <>
                    <label>
                      <span className="text-sm font-black text-slate-600">From Date</span>
                      <input type="date" value={tempFilters.from} onChange={(event) => setTempFilters((old) => ({ ...old, from: event.target.value }))} className="mt-2 w-full h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold outline-none focus:ring-2 focus:ring-orange-500/20" />
                    </label>
                    <label>
                      <span className="text-sm font-black text-slate-600">To Date</span>
                      <input type="date" value={tempFilters.to} onChange={(event) => setTempFilters((old) => ({ ...old, to: event.target.value }))} className="mt-2 w-full h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold outline-none focus:ring-2 focus:ring-orange-500/20" />
                    </label>
                  </>
                )}
              </div>

              <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
                <button type="button" onClick={resetFilters} className="h-11 px-5 rounded-xl border border-slate-200 bg-white text-slate-700 font-black inline-flex items-center gap-2"><RotateCcw className="w-4 h-4" /> Reset</button>
                <button type="button" onClick={saveFilters} className="h-11 px-6 rounded-xl bg-orange-600 text-white font-black shadow-lg shadow-orange-500/20">Save Filters</button>
              </div>
            </div>
          </div>
        )}

        {isAddLeadOpen && (
          <div className="fixed inset-0 z-[99999] bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-6">
            <div className="w-full max-w-4xl max-h-[calc(100vh-48px)] rounded-3xl bg-white border border-slate-200 shadow-2xl overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-200 flex items-start justify-between gap-4 bg-gradient-to-b from-white to-slate-50">
                <div><p className="text-xs font-black text-orange-600 uppercase tracking-[0.18em]">CRM Lead</p><h2 className="text-2xl font-black text-slate-900 mt-1">Add New Lead</h2><p className="text-sm text-slate-500 mt-1">Fill important lead details for About card.</p></div>
                <button type="button" onClick={closeAddLead} className="w-10 h-10 rounded-xl border border-slate-200 bg-white text-slate-500 grid place-items-center hover:text-red-600"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={saveLead} className="max-h-[calc(100vh-190px)] overflow-y-auto p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Lead Name *" error={errors.name}><input className={inputClass} value={form.name} onChange={(e) => updateForm("name", e.target.value)} placeholder="Enter lead name" /></Field>
                  <Field label="Company *" error={errors.company}><input className={inputClass} value={form.company} onChange={(e) => updateForm("company", e.target.value)} placeholder="Enter company name" /></Field>
                  <Field label="Email"><input className={inputClass} type="email" value={form.email} onChange={(e) => updateForm("email", e.target.value)} placeholder="client@email.com" /></Field>
                  <Field label="Phone"><input className={inputClass} value={form.phone} onChange={(e) => updateForm("phone", e.target.value)} placeholder="+91 98765 43210" /></Field>
                  <Field label="Status"><select className={inputClass} value={form.status} onChange={(e) => updateForm("status", e.target.value)}>{statusOptions.map((item) => <option key={item}>{item}</option>)}</select></Field>
                  <Field label="Lead Score"><select className={inputClass} value={form.score} onChange={(e) => updateForm("score", e.target.value)}>{scoreOptions.map((item) => <option key={item}>{item}</option>)}</select></Field>
                  <Field label="Deal Value"><input className={inputClass} type="number" min="0" value={form.value} onChange={(e) => updateForm("value", e.target.value)} placeholder="50000" /></Field>
                  <Field label="Source"><select className={inputClass} value={form.source} onChange={(e) => updateForm("source", e.target.value)}>{sourceOptions.map((item) => <option key={item}>{item}</option>)}</select></Field>
                  <Field label="Industry"><input className={inputClass} value={form.industry} onChange={(e) => updateForm("industry", e.target.value)} placeholder="Accounting, SaaS, Retail..." /></Field>
                  <Field label="Location"><input className={inputClass} value={form.location} onChange={(e) => updateForm("location", e.target.value)} placeholder="Ahmedabad, Gujarat" /></Field>
                  <Field label="Website"><input className={inputClass} value={form.website} onChange={(e) => updateForm("website", e.target.value)} placeholder="https://company.com" /></Field>
                  <Field label="Owner"><input className={inputClass} value={form.owner} onChange={(e) => updateForm("owner", e.target.value)} placeholder="Lead owner" /></Field>
                  <Field label="Note" full><textarea className="w-full min-h-[96px] rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-bold text-slate-900 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-300" value={form.note} onChange={(e) => updateForm("note", e.target.value)} placeholder="Add lead note..." /></Field>
                </div>
                <div className="sticky bottom-0 -mx-6 -mb-6 mt-6 px-6 py-4 border-t border-slate-200 bg-slate-50/95 backdrop-blur flex justify-end gap-3">
                  <button type="button" onClick={closeAddLead} className="h-11 px-5 rounded-xl border border-slate-200 bg-white text-slate-700 font-black">Cancel</button>
                  <button type="submit" disabled={!form.name.trim() || !form.company.trim()} className="h-11 px-5 rounded-xl bg-orange-600 text-white font-black inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"><Save className="w-4 h-4" /> Save Lead</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </EmployeeShell>
  );
}
