import { useEffect, useMemo, useState } from "react";
import { Plus, Search, Eye, X, Save, Filter, RotateCcw, Loader2 } from "lucide-react";
import EmployeeShell from "../../components/employee/EmployeeShell.jsx";
import { createLead, isBackendConfigured, listLeads } from "../../services/crmApi.js";
import { getAccessUser } from "../../services/crmAccessControl.js";
import { validateLeadForm } from "../../utils/leadValidators.js";

const PAGE_SIZE = 10;
const tabs = ["All", "New", "Contacted", "Qualified", "Proposal Sent", "Won", "Lost"];
const statusOptions = ["New", "Contacted", "Qualified", "Proposal Sent", "Won", "Lost", "Overdue", "Junk"];
const sourceOptions = ["Website", "LinkedIn", "Referral", "Cold Email", "Event", "Cold Call", "WhatsApp", "Facebook", "Instagram", "Google Ads", "Manual"];
const scoreOptions = ["Hot", "Warm", "Cold"];
const dateOptions = ["All Dates", "Today", "Yesterday", "This Month", "Custom Range"];
const emptyFilters = { status: "All", source: "All", dateType: "All Dates", from: "", to: "" };
const emptyForm = { name: "", company: "", email: "", phone: "", status: "New", score: "Warm", source: "Website", industry: "", location: "", website: "", owner: "", note: "" };
const inputClass = "w-full h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold text-slate-900 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-300";

function go(path) { window.history.pushState({}, "", path); window.dispatchEvent(new Event("salesflow:navigate")); }
function initials(name = "") { return String(name).split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase(); }
function scoreNumber(score) { if (typeof score === "number") return score; if (score === "Hot") return 90; if (score === "Warm") return 72; if (score === "Cold") return 45; return Number(score || 0); }
function todayISO() { return new Date().toISOString().slice(0, 10); }
function yesterdayISO() { const d = new Date(); d.setDate(d.getDate() - 1); return d.toISOString().slice(0, 10); }
function monthPrefix() { return new Date().toISOString().slice(0, 7); }
function getLeadDate(lead) { return String(lead.createdAt || lead.created_at || lead.createdDate || lead.date || todayISO()).slice(0, 10); }
function dateMatches(leadDate, filters) { if (filters.dateType === "All Dates") return true; if (filters.dateType === "Today") return leadDate === todayISO(); if (filters.dateType === "Yesterday") return leadDate === yesterdayISO(); if (filters.dateType === "This Month") return String(leadDate).startsWith(monthPrefix()); if (filters.dateType === "Custom Range") { if (filters.from && leadDate < filters.from) return false; if (filters.to && leadDate > filters.to) return false; return true; } return true; }
function Field({ label, children, error, full = false }) { return <label className={`${full ? "md:col-span-2" : ""} block`}><span className="text-xs font-black text-slate-600 uppercase tracking-wide">{label}</span><div className="mt-2">{children}</div>{error ? <p className="text-xs font-bold text-red-600 mt-1">{error}</p> : null}</label>; }
function ownerLabel(accessUser) { return accessUser?.name && accessUser.name !== "Employee" ? accessUser.name : accessUser?.email || "Current user"; }
function normalizeLead(row = {}) {
  return {
    ...row,
    id: row.id,
    name: row.name || "Not assigned",
    company: row.company || "Not assigned",
    email: row.email || "",
    phone: row.phone || "",
    source: row.source || "Manual",
    status: row.status || "New",
    value: Number(row.value || row.amount || 0),
    score: scoreNumber(row.score || row.priority || "Warm"),
    ownerName: row.owner?.full_name || row.ownerName || row.owner || "Not assigned",
    createdDate: getLeadDate(row),
  };
}

export default function LeadListPage() {
  const accessUser = useMemo(() => getAccessUser(), []);
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [appliedFilters, setAppliedFilters] = useState(emptyFilters);
  const [tempFilters, setTempFilters] = useState(emptyFilters);
  const [page, setPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isAddLeadOpen, setIsAddLeadOpen] = useState(false);
  const [form, setForm] = useState({ ...emptyForm, owner: ownerLabel(accessUser) });
  const [errors, setErrors] = useState({});
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [loadError, setLoadError] = useState("");

  async function loadLeads() {
    setLoading(true);
    setLoadError("");
    try {
      if (!isBackendConfigured) throw new Error("Supabase env missing. Backend configure karo.");
      const rows = await listLeads({ limit: 500 });
      setLeads((rows || []).map(normalizeLead));
    } catch (error) {
      setLeads([]);
      setLoadError(error.message || "Unable to load Supabase leads.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadLeads(); }, []);

  const counts = tabs.reduce((acc, tab) => { acc[tab] = tab === "All" ? leads.length : leads.filter((lead) => lead.status === tab).length; return acc; }, {});
  const filteredLeads = useMemo(() => {
    const query = search.trim().toLowerCase();
    return leads.filter((lead) => {
      const tabOk = activeTab === "All" || lead.status === activeTab;
      const statusOk = appliedFilters.status === "All" || lead.status === appliedFilters.status;
      const sourceOk = appliedFilters.source === "All" || lead.source === appliedFilters.source;
      const dateOk = dateMatches(lead.createdDate, appliedFilters);
      const searchOk = !query || [lead.name, lead.company, lead.email, lead.phone, lead.source, lead.ownerName].join(" ").toLowerCase().includes(query);
      return tabOk && statusOk && sourceOk && dateOk && searchOk;
    });
  }, [activeTab, appliedFilters, search, leads]);

  const totalPages = Math.max(1, Math.ceil(filteredLeads.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * PAGE_SIZE;
  const pageRows = filteredLeads.slice(start, start + PAGE_SIZE);
  const hasActiveFilter = appliedFilters.status !== "All" || appliedFilters.source !== "All" || appliedFilters.dateType !== "All Dates";

  const updateForm = (field, value) => { setForm((old) => ({ ...old, [field]: value })); setErrors((old) => ({ ...old, [field]: "" })); setMessage(""); };
  const openAddLead = () => { setForm({ ...emptyForm, owner: ownerLabel(accessUser) }); setErrors({}); setMessage(""); setIsAddLeadOpen(true); };
  const closeAddLead = () => { setIsAddLeadOpen(false); setErrors({}); setSaving(false); };
  const openFilterPopup = () => { setTempFilters(appliedFilters); setIsFilterOpen(true); };
  const resetFilters = () => { setAppliedFilters(emptyFilters); setTempFilters(emptyFilters); setPage(1); };
  const saveFilters = () => { setAppliedFilters(tempFilters); setPage(1); setIsFilterOpen(false); };

  const saveLead = async (event) => {
    event.preventDefault();
    if (saving) return;
    const nextErrors = validateLeadForm({ ...form, owner: ownerLabel(accessUser) });
    if (Object.keys(nextErrors).length) { setErrors(nextErrors); return; }
    setSaving(true);
    setMessage("");
    try {
      const saved = await createLead({
        name: form.name.trim(),
        company: form.company.trim() || null,
        email: form.email.trim(),
        phone: form.phone.trim(),
        status: form.status,
        priority: form.score,
        score: scoreNumber(form.score),
        value: 0,
        source: form.source,
        location: form.location.trim() || null,
        website: form.website.trim() || null,
        notes: form.note.trim() || null,
      });
      const normalized = normalizeLead(saved);
      setLeads((prev) => [normalized, ...prev.filter((lead) => lead.id !== normalized.id)]);
      setAppliedFilters(emptyFilters); setTempFilters(emptyFilters); setSearch(""); setActiveTab("All"); setPage(1);
      setMessage("Lead saved in Supabase successfully.");
      closeAddLead();
      await loadLeads();
    } catch (error) {
      setErrors({ form: error.message || "Lead save failed." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <EmployeeShell>
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div><p className="text-xs font-bold text-orange-600 uppercase tracking-wider">Employee Workspace</p><h1 className="text-4xl font-black text-slate-900 tracking-tight">My Leads</h1><p className="text-lg text-slate-500 mt-2">Manage and track your Supabase leads.</p></div>
          <button type="button" onClick={openAddLead} className="h-12 px-6 rounded-xl bg-orange-600 text-white font-black inline-flex items-center gap-3 shadow-lg shadow-orange-500/20"><Plus className="w-5 h-5" />Add Lead</button>
        </div>

        {loadError ? <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">{loadError}</div> : null}
        {message ? <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-bold text-green-700">{message}</div> : null}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          <section className="rounded-xl bg-white border border-slate-200 p-6 shadow-sm"><p className="text-lg text-slate-500 font-medium">Total Leads</p><h2 className="text-4xl font-black text-slate-900">{loading ? "..." : leads.length}</h2></section>
          <section className="rounded-xl bg-white border border-slate-200 p-6 shadow-sm"><p className="text-lg text-slate-500 font-medium">Active Leads</p><h2 className="text-4xl font-black text-slate-900">{loading ? "..." : leads.filter((lead) => !["Won", "Lost"].includes(lead.status)).length}</h2></section>
          <section className="rounded-xl bg-white border border-slate-200 p-6 shadow-sm"><p className="text-lg text-slate-500 font-medium">Lost Leads</p><h2 className="text-4xl font-black text-slate-900">{loading ? "..." : leads.filter((lead) => lead.status === "Lost").length}</h2></section>
          <section className="rounded-xl bg-white border border-slate-200 p-6 shadow-sm"><p className="text-lg text-slate-500 font-medium">Won Leads</p><h2 className="text-4xl font-black text-slate-900">{loading ? "..." : leads.filter((lead) => lead.status === "Won").length}</h2></section>
        </div>

        <section className="sf-leads-card rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 pt-6 border-b border-slate-200"><div className="sf-tabs-row flex flex-wrap items-center gap-x-9 gap-y-3">{tabs.map((tab) => <button key={tab} type="button" onClick={() => { setActiveTab(tab); setPage(1); }} className={`relative pb-5 text-lg font-semibold flex items-center gap-2 whitespace-nowrap ${activeTab === tab ? "text-orange-600" : "text-slate-500 hover:text-slate-800"}`}>{tab}<span className="px-2 py-0.5 rounded-full text-sm bg-slate-100 text-slate-500">{counts[tab] || 0}</span>{activeTab === tab && <span className="absolute left-0 -bottom-[1px] h-[3px] w-full rounded-full bg-orange-600" />}</button>)}</div></div>
          <div className="px-6 py-5 border-b border-slate-200"><div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"><label className="relative w-full lg:max-w-[540px]"><Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-orange-600" /><input value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Search leads, company, source..." className="w-full h-12 rounded-2xl border border-slate-200 bg-white pl-12 pr-4 text-sm font-bold text-slate-800 outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-300 shadow-sm" /></label><button type="button" onClick={openFilterPopup} className={`h-12 px-6 rounded-2xl border font-black inline-flex items-center justify-center gap-2 ${hasActiveFilter ? "bg-orange-600 text-white border-orange-600 shadow-lg shadow-orange-500/20" : "bg-white text-slate-700 border-slate-200 hover:text-orange-600 hover:border-orange-200"}`}><Filter className="w-5 h-5" /> Filter</button></div></div>
          <div className="w-full overflow-hidden"><table className="sf-leads-table w-full text-left"><thead className="bg-slate-50 text-slate-500 uppercase text-sm"><tr><th className="font-black">Lead</th><th className="font-black">Company</th><th className="font-black">Source</th><th className="font-black">Status</th><th className="font-black text-center">Score</th><th className="font-black text-center">Actions</th></tr></thead><tbody className="divide-y divide-slate-200">{pageRows.map((lead) => <tr key={lead.id} className="hover:bg-slate-50/80 transition-colors"><td><div className="flex items-center gap-3 min-w-0"><div className="w-10 h-10 rounded-full bg-purple-600 text-white grid place-items-center font-black shrink-0">{initials(lead.name)}</div><div className="min-w-0"><button type="button" onClick={() => go(`/leads/${lead.id}`)} className="block text-[15px] leading-tight font-black text-slate-900 hover:text-orange-600 truncate max-w-[240px] text-left">{lead.name}</button><p className="text-[13px] leading-tight text-slate-500 truncate max-w-[240px] mt-1">{lead.email}</p></div></div></td><td className="text-[15px] font-semibold text-slate-800 break-words">{lead.company}</td><td className="text-[15px] font-semibold text-slate-500">{lead.source}</td><td><span className="px-3 py-1 rounded-lg border text-xs font-black bg-orange-50 text-orange-700 border-orange-100 whitespace-nowrap">{lead.status}</span></td><td className="text-center"><span className="mx-auto w-10 h-10 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 grid place-items-center font-black">{lead.score}</span></td><td className="text-center"><button type="button" onClick={() => go(`/leads/${lead.id}`)} className="mx-auto w-10 h-10 rounded-xl border border-slate-200 text-slate-600 hover:text-blue-600 hover:bg-slate-50 inline-flex items-center justify-center"><Eye className="w-5 h-5" /></button></td></tr>)}{loading && <tr><td colSpan="6" className="px-6 py-12 text-center text-slate-500"><Loader2 className="w-5 h-5 animate-spin inline mr-2" />Loading Supabase leads...</td></tr>}{!loading && pageRows.length === 0 && <tr><td colSpan="6" className="px-6 py-12 text-center text-slate-500">No leads found.</td></tr>}</tbody></table></div>
          <div className="px-6 py-4 border-t border-slate-200 flex flex-col md:flex-row md:items-center md:justify-between gap-3"><p className="text-sm font-semibold text-slate-500">Showing {filteredLeads.length === 0 ? 0 : start + 1}-{Math.min(start + PAGE_SIZE, filteredLeads.length)} of {filteredLeads.length}</p><div className="flex items-center gap-3"><button disabled={safePage === 1} onClick={() => setPage((prev) => Math.max(1, prev - 1))} className="h-10 px-4 rounded-lg border border-slate-200 font-bold text-slate-700 disabled:opacity-40">Previous</button><span className="text-sm font-black text-slate-700">Page {safePage} of {totalPages}</span><button disabled={safePage === totalPages} onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))} className="h-10 px-4 rounded-lg border border-slate-200 font-bold text-slate-700 disabled:opacity-40">Next</button></div></div>
        </section>

        {isFilterOpen && <div className="fixed inset-0 z-[99999] bg-slate-950/50 backdrop-blur-sm flex items-center justify-center p-5"><div className="w-full max-w-2xl rounded-3xl bg-white border border-slate-200 shadow-2xl overflow-hidden"><div className="px-6 py-5 border-b border-slate-200 flex items-start justify-between gap-4 bg-gradient-to-b from-white to-slate-50"><div><p className="text-xs font-black text-orange-600 uppercase tracking-[0.18em]">Lead Filters</p><h2 className="text-2xl font-black text-slate-900 mt-1">Filter Leads</h2><p className="text-sm text-slate-500 mt-1">Status, source aur date range select karke save karo.</p></div><button type="button" onClick={() => setIsFilterOpen(false)} className="w-10 h-10 rounded-xl border border-slate-200 bg-white text-slate-500 grid place-items-center hover:text-red-600"><X className="w-5 h-5" /></button></div><div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4"><label><span className="text-sm font-black text-slate-600">Status</span><select value={tempFilters.status} onChange={(event) => setTempFilters((old) => ({ ...old, status: event.target.value }))} className="mt-2 w-full h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold outline-none focus:ring-2 focus:ring-orange-500/20"><option>All</option>{statusOptions.map((item) => <option key={item}>{item}</option>)}</select></label><label><span className="text-sm font-black text-slate-600">Source</span><select value={tempFilters.source} onChange={(event) => setTempFilters((old) => ({ ...old, source: event.target.value }))} className="mt-2 w-full h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold outline-none focus:ring-2 focus:ring-orange-500/20"><option>All</option>{sourceOptions.map((item) => <option key={item}>{item}</option>)}</select></label><label className="md:col-span-2"><span className="text-sm font-black text-slate-600">Date</span><select value={tempFilters.dateType} onChange={(event) => { const value = event.target.value; setTempFilters((old) => ({ ...old, dateType: value, from: value === "Custom Range" ? old.from : "", to: value === "Custom Range" ? old.to : "" })); }} className="mt-2 w-full h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold outline-none focus:ring-2 focus:ring-orange-500/20">{dateOptions.map((item) => <option key={item}>{item}</option>)}</select></label>{tempFilters.dateType === "Custom Range" && <><label><span className="text-sm font-black text-slate-600">From Date</span><input type="date" value={tempFilters.from} onChange={(event) => setTempFilters((old) => ({ ...old, from: event.target.value }))} className="mt-2 w-full h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold outline-none focus:ring-2 focus:ring-orange-500/20" /></label><label><span className="text-sm font-black text-slate-600">To Date</span><input type="date" value={tempFilters.to} onChange={(event) => setTempFilters((old) => ({ ...old, to: event.target.value }))} className="mt-2 w-full h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold outline-none focus:ring-2 focus:ring-orange-500/20" /></label></>}</div><div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3"><button type="button" onClick={resetFilters} className="h-11 px-5 rounded-xl border border-slate-200 bg-white text-slate-700 font-black inline-flex items-center gap-2"><RotateCcw className="w-4 h-4" /> Reset</button><button type="button" onClick={saveFilters} className="h-11 px-6 rounded-xl bg-orange-600 text-white font-black shadow-lg shadow-orange-500/20">Save Filters</button></div></div></div>}

        {isAddLeadOpen && <div className="fixed inset-0 z-[99999] bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-6"><div className="w-full max-w-4xl max-h-[calc(100vh-48px)] rounded-3xl bg-white border border-slate-200 shadow-2xl overflow-hidden"><div className="px-6 py-5 border-b border-slate-200 flex items-start justify-between gap-4 bg-gradient-to-b from-white to-slate-50"><div><p className="text-xs font-black text-orange-600 uppercase tracking-[0.18em]">CRM Lead</p><h2 className="text-2xl font-black text-slate-900 mt-1">Add New Lead</h2><p className="text-sm text-slate-500 mt-1">Owner auto: {ownerLabel(accessUser)}</p></div><button type="button" onClick={closeAddLead} className="w-10 h-10 rounded-xl border border-slate-200 bg-white text-slate-500 grid place-items-center hover:text-red-600"><X className="w-5 h-5" /></button></div><form onSubmit={saveLead} className="max-h-[calc(100vh-190px)] overflow-y-auto p-6">{errors.form ? <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">{errors.form}</div> : null}<div className="grid grid-cols-1 md:grid-cols-2 gap-4"><Field label="Lead Name *" error={errors.name}><input className={inputClass} value={form.name} onChange={(e) => updateForm("name", e.target.value)} placeholder="Enter lead name" /></Field><Field label="Company"><input className={inputClass} value={form.company} onChange={(e) => updateForm("company", e.target.value)} placeholder="Enter company name" /></Field><Field label="Email *" error={errors.email}><input className={inputClass} type="email" value={form.email} onChange={(e) => updateForm("email", e.target.value)} placeholder="client@email.com" /></Field><Field label="Phone *" error={errors.phone}><input className={inputClass} value={form.phone} onChange={(e) => updateForm("phone", e.target.value)} placeholder="+91 98765 43210" /></Field><Field label="Status"><select className={inputClass} value={form.status} onChange={(e) => updateForm("status", e.target.value)}>{statusOptions.map((item) => <option key={item}>{item}</option>)}</select></Field><Field label="Lead Score"><select className={inputClass} value={form.score} onChange={(e) => updateForm("score", e.target.value)}>{scoreOptions.map((item) => <option key={item}>{item}</option>)}</select></Field><Field label="Source *" error={errors.source}><select className={inputClass} value={form.source} onChange={(e) => updateForm("source", e.target.value)}>{sourceOptions.map((item) => <option key={item}>{item}</option>)}</select></Field><Field label="Industry"><input className={inputClass} value={form.industry} onChange={(e) => updateForm("industry", e.target.value)} placeholder="Accounting, SaaS, Retail..." /></Field><Field label="Location"><input className={inputClass} value={form.location} onChange={(e) => updateForm("location", e.target.value)} placeholder="Ahmedabad, Gujarat" /></Field><Field label="Website"><input className={inputClass} value={form.website} onChange={(e) => updateForm("website", e.target.value)} placeholder="https://company.com" /></Field><Field label="Owner"><input className={`${inputClass} bg-slate-50 text-slate-500 cursor-not-allowed`} value={ownerLabel(accessUser)} readOnly placeholder="Lead owner" /></Field><Field label="Note" full><textarea className="w-full min-h-[96px] rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-bold text-slate-900 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-300" value={form.note} onChange={(e) => updateForm("note", e.target.value)} placeholder="Add lead note..." /></Field></div><div className="sticky bottom-0 -mx-6 -mb-6 mt-6 px-6 py-4 border-t border-slate-200 bg-slate-50/95 backdrop-blur flex justify-end gap-3"><button type="button" onClick={closeAddLead} className="h-11 px-5 rounded-xl border border-slate-200 bg-white text-slate-700 font-black">Cancel</button><button type="submit" disabled={saving || !form.name.trim() || !form.email.trim() || !form.phone.trim() || !form.source.trim()} className="h-11 px-5 rounded-xl bg-orange-600 text-white font-black inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">{saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} {saving ? "Saving..." : "Save Lead"}</button></div></form></div></div>}
      </div>
    </EmployeeShell>
  );
}
