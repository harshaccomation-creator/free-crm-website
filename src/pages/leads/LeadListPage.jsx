import { useMemo, useState } from "react";
import { Plus, Search, Eye, X, Save, Filter, RotateCcw, CalendarDays } from "lucide-react";
import EmployeeShell from "../../components/employee/EmployeeShell.jsx";
import { empLeads } from "../../data/employeeData.js";

const PAGE_SIZE = 10;
const tabs = ["All", "New", "Contacted", "Qualified", "Proposal Sent", "Won", "Lost"];
const statusOptions = ["New", "Contacted", "Qualified", "Proposal Sent", "Won", "Lost"];
const sourceOptions = ["Website", "Referral", "WhatsApp", "Facebook", "Instagram", "Google Ads", "Manual"];
const scoreOptions = ["Hot", "Warm", "Cold"];
const dateOptions = ["All Dates", "Today", "Yesterday", "This Month", "Custom Range"];
const todayDate = "2026-06-09";
const yesterdayDate = "2026-06-08";
const monthStartDate = "2026-06-01";
const monthEndDate = "2026-06-30";

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

function money(value) {
  return Number(value || 0).toLocaleString("en-IN");
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

function dateMatches(leadDate, dateFilter, fromDate, toDate) {
  if (dateFilter === "All Dates") return true;
  if (dateFilter === "Today") return leadDate === todayDate;
  if (dateFilter === "Yesterday") return leadDate === yesterdayDate;
  if (dateFilter === "This Month") return leadDate >= monthStartDate && leadDate <= monthEndDate;
  if (dateFilter === "Custom Range") {
    if (fromDate && leadDate < fromDate) return false;
    if (toDate && leadDate > toDate) return false;
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
  const [statusFilter, setStatusFilter] = useState("All");
  const [sourceFilter, setSourceFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("All Dates");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [page, setPage] = useState(1);
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
      const statusOk = statusFilter === "All" || lead.status === statusFilter;
      const sourceOk = sourceFilter === "All" || lead.source === sourceFilter;
      const dateOk = dateMatches(lead.createdDate, dateFilter, fromDate, toDate);
      const searchOk = !query || [lead.name, lead.company, lead.email, lead.phone, lead.source]
        .join(" ")
        .toLowerCase()
        .includes(query);
      return tabOk && statusOk && sourceOk && dateOk && searchOk;
    });
  }, [activeTab, statusFilter, sourceFilter, dateFilter, fromDate, toDate, search, leads]);

  const totalPages = Math.max(1, Math.ceil(filteredLeads.length / PAGE_SIZE));
  const start = (page - 1) * PAGE_SIZE;
  const pageRows = filteredLeads.slice(start, start + PAGE_SIZE);

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
    setActiveTab("All");
    setStatusFilter("All");
    setSourceFilter("All");
    setDateFilter("All Dates");
    setFromDate("");
    setToDate("");
    setSearch("");
    setPage(1);
    closeAddLead();
  };

  const resetFilters = () => {
    setActiveTab("All");
    setStatusFilter("All");
    setSourceFilter("All");
    setDateFilter("All Dates");
    setFromDate("");
    setToDate("");
    setSearch("");
    setPage(1);
  };

  return (
    <EmployeeShell>
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

        <section className="rounded-xl bg-white border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 pt-5 border-b border-slate-200">
            <div className="flex items-center gap-8 overflow-x-auto">
              {tabs.map((tab) => (
                <button key={tab} type="button" onClick={() => { setActiveTab(tab); setPage(1); }} className={`pb-5 text-lg font-semibold flex items-center gap-2 border-b-2 whitespace-nowrap ${activeTab === tab ? "text-orange-600 border-orange-600" : "text-slate-500 border-transparent"}`}>
                  {tab}
                  <span className="px-2 py-0.5 rounded-full text-sm bg-slate-100 text-slate-500">{counts[tab]}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="px-6 py-5 border-b border-slate-200">
            <div className={`grid grid-cols-1 ${dateFilter === "Custom Range" ? "xl:grid-cols-[1fr_170px_170px_170px_150px_150px_auto]" : "xl:grid-cols-[1fr_190px_190px_190px_auto]"} gap-4 items-end`}>
              <label>
                <span className="inline-flex items-center gap-2 text-sm font-black text-slate-600 mb-2"><Search className="w-4 h-4 text-orange-600" />Search</span>
                <input value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Search leads, company, source..." className="w-full h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold outline-none focus:ring-2 focus:ring-orange-500/20 shadow-sm" />
              </label>

              <label>
                <span className="inline-flex items-center gap-2 text-sm font-black text-slate-600 mb-2"><Filter className="w-4 h-4 text-orange-600" />Status</span>
                <select value={statusFilter} onChange={(event) => { setStatusFilter(event.target.value); setPage(1); }} className="w-full h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold outline-none focus:ring-2 focus:ring-orange-500/20">
                  <option>All</option>
                  {statusOptions.map((item) => <option key={item}>{item}</option>)}
                </select>
              </label>

              <label>
                <span className="inline-flex items-center gap-2 text-sm font-black text-slate-600 mb-2"><Filter className="w-4 h-4 text-orange-600" />Source</span>
                <select value={sourceFilter} onChange={(event) => { setSourceFilter(event.target.value); setPage(1); }} className="w-full h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold outline-none focus:ring-2 focus:ring-orange-500/20">
                  <option>All</option>
                  {sourceOptions.map((item) => <option key={item}>{item}</option>)}
                </select>
              </label>

              <label>
                <span className="inline-flex items-center gap-2 text-sm font-black text-slate-600 mb-2"><CalendarDays className="w-4 h-4 text-orange-600" />Date</span>
                <select
                  value={dateFilter}
                  onChange={(event) => {
                    const value = event.target.value;
                    setDateFilter(value);
                    if (value !== "Custom Range") {
                      setFromDate("");
                      setToDate("");
                    }
                    setPage(1);
                  }}
                  className="w-full h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold outline-none focus:ring-2 focus:ring-orange-500/20"
                >
                  {dateOptions.map((item) => <option key={item}>{item}</option>)}
                </select>
              </label>

              {dateFilter === "Custom Range" && (
                <>
                  <label>
                    <span className="inline-flex items-center gap-2 text-sm font-black text-slate-600 mb-2"><CalendarDays className="w-4 h-4 text-orange-600" />From</span>
                    <input type="date" value={fromDate} onChange={(event) => { setFromDate(event.target.value); setPage(1); }} className="w-full h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold outline-none focus:ring-2 focus:ring-orange-500/20" />
                  </label>
                  <label>
                    <span className="inline-flex items-center gap-2 text-sm font-black text-slate-600 mb-2"><CalendarDays className="w-4 h-4 text-orange-600" />To</span>
                    <input type="date" value={toDate} onChange={(event) => { setToDate(event.target.value); setPage(1); }} className="w-full h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold outline-none focus:ring-2 focus:ring-orange-500/20" />
                  </label>
                </>
              )}

              <button type="button" onClick={resetFilters} className="h-12 px-5 rounded-xl border border-slate-200 bg-white text-slate-700 font-black inline-flex items-center gap-2 hover:bg-slate-50">
                <RotateCcw className="w-4 h-4" /> Reset
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-500 uppercase text-sm">
                <tr>
                  <th className="px-6 py-4 font-black">Lead</th>
                  <th className="px-6 py-4 font-black">Company</th>
                  <th className="px-6 py-4 font-black">Source</th>
                  <th className="px-6 py-4 font-black">Status</th>
                  <th className="px-6 py-4 font-black">Value</th>
                  <th className="px-6 py-4 font-black">Score</th>
                  <th className="px-6 py-4 font-black">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {pageRows.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50">
                    <td className="px-6 py-5"><div className="flex items-center gap-4"><div className="w-12 h-12 rounded-full bg-purple-600 text-white grid place-items-center font-black">{initials(lead.name)}</div><div><button type="button" onClick={() => go(`/leads/${lead.id}`)} className="text-lg font-black text-slate-900 hover:text-orange-600">{lead.name}</button><p className="text-slate-500">{lead.email}</p></div></div></td>
                    <td className="px-6 py-5 text-lg text-slate-900">{lead.company}</td>
                    <td className="px-6 py-5 text-lg text-slate-500">{lead.source}</td>
                    <td className="px-6 py-5"><span className="px-3 py-1 rounded-md border text-sm font-black bg-orange-50 text-orange-700 border-orange-100">{lead.status}</span></td>
                    <td className="px-6 py-5 text-lg font-black text-slate-900">₹{money(lead.value)}</td>
                    <td className="px-6 py-5"><span className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 grid place-items-center font-black">{lead.score}</span></td>
                    <td className="px-6 py-5"><button type="button" onClick={() => go(`/leads/${lead.id}`)} className="w-10 h-10 rounded-xl border border-slate-200 text-slate-600 hover:text-blue-600 hover:bg-slate-50 inline-flex items-center justify-center"><Eye className="w-5 h-5" /></button></td>
                  </tr>
                ))}
                {pageRows.length === 0 && <tr><td colSpan="7" className="px-6 py-12 text-center text-slate-500">No leads found.</td></tr>}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-500">Showing {filteredLeads.length === 0 ? 0 : start + 1}-{Math.min(start + PAGE_SIZE, filteredLeads.length)} of {filteredLeads.length}</p>
            <div className="flex items-center gap-3">
              <button disabled={page === 1} onClick={() => setPage((prev) => Math.max(1, prev - 1))} className="h-10 px-4 rounded-lg border border-slate-200 font-bold text-slate-700 disabled:opacity-40">Previous</button>
              <span className="text-sm font-black text-slate-700">Page {page} of {totalPages}</span>
              <button disabled={page === totalPages} onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))} className="h-10 px-4 rounded-lg border border-slate-200 font-bold text-slate-700 disabled:opacity-40">Next</button>
            </div>
          </div>
        </section>

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
