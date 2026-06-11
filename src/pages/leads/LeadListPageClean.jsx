import { useEffect, useMemo, useState } from "react";
import { Filter, Loader2, Plus, Save, Search, X } from "lucide-react";
import EmployeeShell from "../../components/employee/EmployeeShell.jsx";
import { createLead, isBackendConfigured, listLeads } from "../../services/crmApi.js";
import { getAccessUser } from "../../services/crmAccessControl.js";
import { validateLeadForm } from "../../utils/leadValidators.js";

const PAGE_SIZE = 10;
const TABS = ["All", "New", "Contacted", "Qualified", "Proposal Sent", "Won", "Lost"];
const STATUSES = ["New", "Contacted", "Qualified", "Proposal Sent", "Won", "Lost", "Overdue", "Junk"];
const SOURCES = ["Website", "LinkedIn", "Referral", "Cold Email", "Event", "Cold Call", "WhatsApp", "Facebook", "Instagram", "Google Ads", "Manual"];
const SCORES = ["Hot", "Warm", "Cold"];
const emptyFilters = { status: "All", source: "All" };
const emptyForm = { name: "", company: "", email: "", phone: "", status: "New", score: "Warm", source: "Website", location: "", website: "", note: "" };
const inputClass = "w-full h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold text-slate-900 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-300";

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

function ownerLabel(accessUser) {
  return accessUser?.name && accessUser.name !== "Employee" ? accessUser.name : accessUser?.email || "Current user";
}

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
    score: scoreNumber(row.score || row.priority || "Warm"),
  };
}

function Field({ label, error, children, full = false }) {
  return (
    <label className={`${full ? "md:col-span-2" : ""} block`}>
      <span className="text-xs font-black text-slate-600 uppercase tracking-wide">{label}</span>
      <div className="mt-2">{children}</div>
      {error ? <p className="mt-1 text-xs font-bold text-red-600">{error}</p> : null}
    </label>
  );
}

export default function LeadListPageClean() {
  const accessUser = useMemo(() => getAccessUser(), []);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState(emptyFilters);
  const [draftFilters, setDraftFilters] = useState(emptyFilters);
  const [page, setPage] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [actionMenuLeadId, setActionMenuLeadId] = useState(null);

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

  const counts = useMemo(() => TABS.reduce((acc, tab) => {
    acc[tab] = tab === "All" ? leads.length : leads.filter((lead) => lead.status === tab).length;
    return acc;
  }, {}), [leads]);

  const filteredLeads = useMemo(() => {
    const query = search.trim().toLowerCase();
    return leads.filter((lead) => {
      const tabOk = activeTab === "All" || lead.status === activeTab;
      const statusOk = filters.status === "All" || lead.status === filters.status;
      const sourceOk = filters.source === "All" || lead.source === filters.source;
      const searchOk = !query || [lead.name, lead.company, lead.email, lead.phone, lead.source].join(" ").toLowerCase().includes(query);
      return tabOk && statusOk && sourceOk && searchOk;
    });
  }, [activeTab, filters, search, leads]);

  const totalPages = Math.max(1, Math.ceil(filteredLeads.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * PAGE_SIZE;
  const rows = filteredLeads.slice(start, start + PAGE_SIZE);

  function updateForm(field, value) {
    setForm((old) => ({ ...old, [field]: value }));
    setErrors((old) => ({ ...old, [field]: "" }));
  }

  function openAddLead() {
    setForm(emptyForm);
    setErrors({});
    setAddOpen(true);
  }

  async function saveLead(event) {
    event.preventDefault();
    if (saving) return;
    const nextErrors = validateLeadForm({ ...form, owner: ownerLabel(accessUser) });
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }
    setSaving(true);
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
      setLeads((old) => [normalizeLead(saved), ...old]);
      setMessage("Lead saved successfully.");
      setAddOpen(false);
      setPage(1);
      await loadLeads();
    } catch (error) {
      setErrors({ form: error.message || "Lead save failed." });
    } finally {
      setSaving(false);
    }
  }

  return (
    <EmployeeShell>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-orange-600">Employee Workspace</p>
            <h1 className="text-4xl font-black tracking-tight text-slate-900">My Leads</h1>
            <p className="mt-2 text-lg text-slate-500">Manage and track your Supabase leads.</p>
          </div>
          <button type="button" onClick={openAddLead} className="inline-flex h-12 items-center gap-3 rounded-xl bg-orange-600 px-6 font-black text-white shadow-lg shadow-orange-500/20">
            <Plus className="h-5 w-5" /> Add Lead
          </button>
        </div>

        {loadError ? <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">{loadError}</div> : null}
        {message ? <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-bold text-green-700">{message}</div> : null}

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"><p className="text-lg font-medium text-slate-500">Total Leads</p><h2 className="text-4xl font-black text-slate-900">{loading ? "..." : leads.length}</h2></section>
          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"><p className="text-lg font-medium text-slate-500">Active Leads</p><h2 className="text-4xl font-black text-slate-900">{loading ? "..." : leads.filter((lead) => !["Won", "Lost"].includes(lead.status)).length}</h2></section>
          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"><p className="text-lg font-medium text-slate-500">Lost Leads</p><h2 className="text-4xl font-black text-slate-900">{loading ? "..." : leads.filter((lead) => lead.status === "Lost").length}</h2></section>
          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"><p className="text-lg font-medium text-slate-500">Won Leads</p><h2 className="text-4xl font-black text-slate-900">{loading ? "..." : leads.filter((lead) => lead.status === "Won").length}</h2></section>
        </div>

        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 pt-6">
            <div className="flex flex-wrap items-center gap-x-9 gap-y-3">
              {TABS.map((tab) => (
                <button key={tab} type="button" onClick={() => { setActiveTab(tab); setPage(1); }} className={`relative flex items-center gap-2 whitespace-nowrap pb-5 text-lg font-semibold ${activeTab === tab ? "text-orange-600" : "text-slate-500 hover:text-slate-800"}`}>
                  {tab}<span className="rounded-full bg-slate-100 px-2 py-0.5 text-sm text-slate-500">{counts[tab] || 0}</span>
                  {activeTab === tab ? <span className="absolute -bottom-px left-0 h-[3px] w-full rounded-full bg-orange-600" /> : null}
                </button>
              ))}
            </div>
          </div>

          <div className="border-b border-slate-200 px-6 py-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <label className="relative w-full lg:max-w-[540px]">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-orange-600" />
                <input value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Search leads, company, source..." className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-4 text-sm font-bold text-slate-800 shadow-sm outline-none focus:border-orange-300 focus:ring-4 focus:ring-orange-500/10" />
              </label>
              <button type="button" onClick={() => { setDraftFilters(filters); setFilterOpen(true); }} className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 font-black text-slate-700 hover:border-orange-200 hover:text-orange-600">
                <Filter className="h-5 w-5" /> Filter
              </button>
            </div>
          </div>

          <div className="w-full overflow-x-auto overflow-y-visible">
            <table className="w-[980px] min-w-[980px] table-fixed text-left">
              <thead className="bg-slate-50 text-sm uppercase text-slate-500">
                <tr>
                  <th className="w-[300px] px-6 py-4 font-black">Lead</th>
                  <th className="w-[180px] px-6 py-4 font-black">Company</th>
                  <th className="w-[140px] px-6 py-4 font-black">Source</th>
                  <th className="w-[150px] px-6 py-4 font-black">Status</th>
                  <th className="w-[100px] px-6 py-4 text-center font-black">Score</th>
                  <th className="w-[80px] px-4 py-4 text-center font-black">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {rows.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50/80">
                    <td className="px-6 py-4">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-purple-600 font-black text-white">{initials(lead.name)}</div>
                        <div className="min-w-0 flex-1">
                          <button type="button" onClick={() => go(`/leads/${lead.id}`)} className="block max-w-[220px] truncate text-left text-[15px] font-black leading-tight text-slate-900 hover:text-orange-600">{lead.name}</button>
                          <p className="mt-1 max-w-[220px] truncate text-[13px] leading-tight text-slate-500">{lead.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="break-words px-6 py-4 text-[15px] font-semibold text-slate-800">{lead.company}</td>
                    <td className="px-6 py-4 text-[15px] font-semibold text-slate-500">{lead.source}</td>
                    <td className="px-6 py-4"><span className="whitespace-nowrap rounded-lg border border-orange-100 bg-orange-50 px-3 py-1 text-xs font-black text-orange-700">{lead.status}</span></td>
                    <td className="px-6 py-4 text-center"><span className="mx-auto grid h-10 w-10 place-items-center rounded-full border border-emerald-200 bg-emerald-50 font-black text-emerald-700">{lead.score}</span></td>
                    <td className="relative px-4 py-4 text-center">
                      <button type="button" onClick={(event) => { event.stopPropagation(); setActionMenuLeadId((old) => old === lead.id ? null : lead.id); }} className="mx-auto grid h-9 w-9 place-items-center rounded-xl border border-slate-200 bg-white text-xl font-black text-slate-600 hover:bg-orange-50 hover:text-orange-600" title="Lead actions">⋯</button>
                      {actionMenuLeadId === lead.id ? (
                        <div className="absolute right-4 top-12 z-[60] w-36 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
                          <button type="button" onClick={() => { setActionMenuLeadId(null); go(`/leads/${lead.id}`); }} className="w-full px-4 py-3 text-left text-sm font-bold text-slate-700 hover:bg-slate-50">View Lead</button>
                          <button type="button" onClick={() => { setActionMenuLeadId(null); go(`/leads/${lead.id}`); }} className="w-full px-4 py-3 text-left text-sm font-bold text-orange-600 hover:bg-orange-50">Edit Lead</button>
                        </div>
                      ) : null}
                    </td>
                  </tr>
                ))}
                {loading ? <tr><td colSpan="6" className="px-6 py-12 text-center text-slate-500"><Loader2 className="mr-2 inline h-5 w-5 animate-spin" />Loading Supabase leads...</td></tr> : null}
                {!loading && rows.length === 0 ? <tr><td colSpan="6" className="px-6 py-12 text-center text-slate-500">No leads found.</td></tr> : null}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-3 border-t border-slate-200 px-6 py-4 md:flex-row md:items-center md:justify-between">
            <p className="text-sm font-semibold text-slate-500">Showing {filteredLeads.length === 0 ? 0 : start + 1}-{Math.min(start + PAGE_SIZE, filteredLeads.length)} of {filteredLeads.length}</p>
            <div className="flex items-center gap-3">
              <button disabled={safePage === 1} onClick={() => setPage((old) => Math.max(1, old - 1))} className="h-10 rounded-lg border border-slate-200 px-4 font-bold text-slate-700 disabled:opacity-40">Previous</button>
              <span className="text-sm font-black text-slate-700">Page {safePage} of {totalPages}</span>
              <button disabled={safePage === totalPages} onClick={() => setPage((old) => Math.min(totalPages, old + 1))} className="h-10 rounded-lg border border-slate-200 px-4 font-bold text-slate-700 disabled:opacity-40">Next</button>
            </div>
          </div>
        </section>

        {filterOpen ? (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-slate-950/50 p-5 backdrop-blur-sm">
            <div className="w-full max-w-xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
              <div className="flex items-start justify-between gap-4 border-b border-slate-200 bg-slate-50 px-6 py-5">
                <div><p className="text-xs font-black uppercase tracking-[0.18em] text-orange-600">Lead Filters</p><h2 className="mt-1 text-2xl font-black text-slate-900">Filter Leads</h2></div>
                <button type="button" onClick={() => setFilterOpen(false)} className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:text-red-600"><X className="h-5 w-5" /></button>
              </div>
              <div className="grid grid-cols-1 gap-4 p-6 md:grid-cols-2">
                <Field label="Status"><select className={inputClass} value={draftFilters.status} onChange={(event) => setDraftFilters((old) => ({ ...old, status: event.target.value }))}><option>All</option>{STATUSES.map((item) => <option key={item}>{item}</option>)}</select></Field>
                <Field label="Source"><select className={inputClass} value={draftFilters.source} onChange={(event) => setDraftFilters((old) => ({ ...old, source: event.target.value }))}><option>All</option>{SOURCES.map((item) => <option key={item}>{item}</option>)}</select></Field>
              </div>
              <div className="flex justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4">
                <button type="button" onClick={() => { setFilters(emptyFilters); setDraftFilters(emptyFilters); setFilterOpen(false); setPage(1); }} className="h-11 rounded-xl border border-slate-200 bg-white px-5 font-black text-slate-700">Reset</button>
                <button type="button" onClick={() => { setFilters(draftFilters); setFilterOpen(false); setPage(1); }} className="h-11 rounded-xl bg-orange-600 px-6 font-black text-white">Save Filters</button>
              </div>
            </div>
          </div>
        ) : null}

        {addOpen ? (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-slate-950/60 p-6 backdrop-blur-sm">
            <div className="max-h-[calc(100vh-48px)] w-full max-w-4xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
              <div className="flex items-start justify-between gap-4 border-b border-slate-200 bg-slate-50 px-6 py-5">
                <div><p className="text-xs font-black uppercase tracking-[0.18em] text-orange-600">CRM Lead</p><h2 className="mt-1 text-2xl font-black text-slate-900">Add New Lead</h2><p className="mt-1 text-sm text-slate-500">Owner auto: {ownerLabel(accessUser)}</p></div>
                <button type="button" onClick={() => setAddOpen(false)} className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:text-red-600"><X className="h-5 w-5" /></button>
              </div>
              <form onSubmit={saveLead} className="max-h-[calc(100vh-190px)] overflow-y-auto p-6">
                {errors.form ? <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">{errors.form}</div> : null}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Field label="Lead Name *" error={errors.name}><input className={inputClass} value={form.name} onChange={(event) => updateForm("name", event.target.value)} placeholder="Enter lead name" /></Field>
                  <Field label="Company"><input className={inputClass} value={form.company} onChange={(event) => updateForm("company", event.target.value)} placeholder="Company name" /></Field>
                  <Field label="Email *" error={errors.email}><input className={inputClass} type="email" value={form.email} onChange={(event) => updateForm("email", event.target.value)} placeholder="client@email.com" /></Field>
                  <Field label="Phone *" error={errors.phone}><input className={inputClass} value={form.phone} onChange={(event) => updateForm("phone", event.target.value)} placeholder="+91 98765 43210" /></Field>
                  <Field label="Status"><select className={inputClass} value={form.status} onChange={(event) => updateForm("status", event.target.value)}>{STATUSES.map((item) => <option key={item}>{item}</option>)}</select></Field>
                  <Field label="Lead Score"><select className={inputClass} value={form.score} onChange={(event) => updateForm("score", event.target.value)}>{SCORES.map((item) => <option key={item}>{item}</option>)}</select></Field>
                  <Field label="Source *" error={errors.source}><select className={inputClass} value={form.source} onChange={(event) => updateForm("source", event.target.value)}>{SOURCES.map((item) => <option key={item}>{item}</option>)}</select></Field>
                  <Field label="Location"><input className={inputClass} value={form.location} onChange={(event) => updateForm("location", event.target.value)} placeholder="Ahmedabad" /></Field>
                  <Field label="Website"><input className={inputClass} value={form.website} onChange={(event) => updateForm("website", event.target.value)} placeholder="https://company.com" /></Field>
                  <Field label="Note" full><textarea className="min-h-[96px] w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-bold text-slate-900 outline-none focus:border-orange-300 focus:ring-2 focus:ring-orange-500/20" value={form.note} onChange={(event) => updateForm("note", event.target.value)} placeholder="Add lead note..." /></Field>
                </div>
                <div className="-mx-6 -mb-6 mt-6 flex justify-end gap-3 border-t border-slate-200 bg-slate-50/95 px-6 py-4">
                  <button type="button" onClick={() => setAddOpen(false)} className="h-11 rounded-xl border border-slate-200 bg-white px-5 font-black text-slate-700">Cancel</button>
                  <button type="submit" disabled={saving} className="inline-flex h-11 items-center gap-2 rounded-xl bg-orange-600 px-5 font-black text-white disabled:opacity-50">{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} {saving ? "Saving..." : "Save Lead"}</button>
                </div>
              </form>
            </div>
          </div>
        ) : null}
      </div>
    </EmployeeShell>
  );
}
