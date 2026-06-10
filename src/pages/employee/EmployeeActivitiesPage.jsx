import { useEffect, useMemo, useState } from "react";
import { Activity, Phone, MessageCircle, Calendar, FileText, Trophy, Filter, Plus, MoreVertical, PhoneOff, XCircle, Eye, ExternalLink, CalendarPlus, CheckCircle2, X, Search, Loader2, Save } from "lucide-react";
import EmployeeShell from "../../components/employee/EmployeeShell.jsx";
import { createActivity, isBackendConfigured, listActivities, listLeads } from "../../services/crmApi.js";

const typeOptions = ["All", "Call", "Demo", "Note", "Post Demo Follow Up"];
const dispositionOptions = ["All", "Connected", "Follow Up", "Demo Booked", "Not Connected"];
const statusOptions = ["All", "Completed", "Pending", "Done", "Sent", "Won", "Lost", "Note", "Missed"];
const activitySaveTypes = ["call", "note", "follow_up", "demo_scheduled", "demo_done", "not_connected", "lost", "won"];
const lower = (v = "") => String(v).toLowerCase();

function iconFor(type) {
  const key = lower(type);
  if (key.includes("call")) return Phone;
  if (key.includes("whatsapp")) return MessageCircle;
  if (key.includes("task") || key.includes("follow") || key.includes("demo")) return Calendar;
  if (key.includes("won")) return Trophy;
  if (key.includes("not_connected") || key.includes("not-connected")) return PhoneOff;
  if (key.includes("lost")) return XCircle;
  return FileText;
}

function activityTypeFor(item) {
  const key = lower(item.type);
  const title = lower(item.title);
  const status = lower(item.status);
  if (["call", "whatsapp", "not_connected", "not-connected", "lost"].includes(key)) return "Call";
  if (["email", "note", "lead_created", "lead_updated"].includes(key)) return "Note";
  if (key.includes("won") || status.includes("won")) return "Post Demo Follow Up";
  if (key.includes("demo") || title.includes("demo")) return "Demo";
  if (key.includes("follow")) return "Post Demo Follow Up";
  return item.type || "Activity";
}

function dispositionFor(item) {
  const key = lower(item.type);
  const status = lower(item.status);
  const title = lower(item.title);
  const desc = lower(item.description || item.note);
  if (key.includes("not_connected") || title.includes("not connected") || status.includes("missed")) return "Not Connected";
  if (key.includes("lost") || status.includes("lost")) return "Not Connected";
  if (key.includes("call")) return "Connected";
  if (key.includes("demo") || title.includes("demo") || desc.includes("demo")) return "Demo Booked";
  if (["whatsapp", "email", "note", "task", "follow_up"].includes(key) || key.includes("follow")) return "Follow Up";
  if (key.includes("won")) return "Demo Booked";
  return item.status || "-";
}

function statusFor(item) {
  const key = lower(item.type);
  const title = lower(item.title);
  if (key.includes("lost") || title.includes("lost")) return "Lost";
  if (key.includes("won") || title.includes("won")) return "Won";
  if (key.includes("not_connected") || title.includes("not connected")) return "Missed";
  if (key.includes("note")) return "Note";
  if (key.includes("follow") || key.includes("demo")) return "Pending";
  return "Completed";
}

function pill(kind, value = "") {
  const key = lower(value);
  if (kind === "type") {
    if (key.includes("call")) return "bg-green-50 text-green-700 border-green-100";
    if (key.includes("post demo follow up")) return "bg-emerald-50 text-emerald-700 border-emerald-100";
    if (key.includes("demo")) return "bg-purple-50 text-purple-700 border-purple-100";
    if (key.includes("note")) return "bg-blue-50 text-blue-700 border-blue-100";
  }
  if (kind === "disposition") {
    if (key.includes("connected") && !key.includes("not")) return "bg-green-50 text-green-700 border-green-100";
    if (key.includes("follow")) return "bg-yellow-50 text-yellow-800 border-yellow-200";
    if (key.includes("demo booked")) return "bg-purple-50 text-purple-700 border-purple-100";
    if (key.includes("not connected")) return "bg-red-50 text-red-700 border-red-100";
  }
  if (key.includes("pending")) return "bg-yellow-50 text-yellow-800 border-yellow-200";
  if (key.includes("lost") || key.includes("missed") || key.includes("not connected")) return "bg-red-50 text-red-700 border-red-100";
  if (key.includes("won")) return "bg-purple-50 text-purple-700 border-purple-100";
  if (key.includes("completed") || key.includes("done")) return "bg-green-50 text-green-700 border-green-100";
  if (key.includes("sent") || key.includes("note")) return "bg-blue-50 text-blue-700 border-blue-100";
  return "bg-slate-100 text-slate-600 border-slate-200";
}

function formatTime(value) {
  if (!value) return "Not assigned";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: true });
}

function normalizeActivity(row = {}) {
  return {
    ...row,
    id: row.id,
    leadId: row.lead_id || row.leadId || row.lead?.id,
    lead: row.lead?.name || row.leadName || row.lead || "Not assigned",
    title: row.title || row.type || "Activity",
    description: row.note || row.description || "No note added",
    type: row.type || "note",
    time: formatTime(row.activity_at || row.created_at || row.createdAt),
    rawTime: row.activity_at || row.created_at || row.createdAt,
    status: row.status || statusFor(row),
  };
}

function openLeadById(leadId) {
  if (!leadId) return;
  window.history.pushState({}, "", `/leads/${leadId}`);
  window.dispatchEvent(new Event("salesflow:navigate"));
}

export default function EmployeeActivitiesPage() {
  const [page, setPage] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({ q: "", type: "All", disposition: "All", status: "All" });
  const [menu, setMenu] = useState(null);
  const [selected, setSelected] = useState(null);
  const [toast, setToast] = useState("");
  const [activities, setActivities] = useState([]);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ lead_id: "", type: "call", title: "", note: "" });
  const size = 10;

  async function loadData() {
    setLoading(true);
    setError("");
    try {
      if (!isBackendConfigured) throw new Error("Supabase env missing. Backend configure karo.");
      const [activityRows, leadRows] = await Promise.all([listActivities({ limit: 500 }), listLeads({ limit: 500 })]);
      setActivities((activityRows || []).map(normalizeActivity));
      setLeads(leadRows || []);
      if (!form.lead_id && leadRows?.[0]?.id) setForm((old) => ({ ...old, lead_id: leadRows[0].id }));
    } catch (err) {
      setActivities([]);
      setLeads([]);
      setError(err.message || "Unable to load Supabase activities.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadData(); }, []);

  const filtered = useMemo(() => {
    const query = lower(filters.q.trim());
    return activities.filter((item) => {
      const type = activityTypeFor(item);
      const disposition = dispositionFor(item);
      if (filters.type !== "All" && type !== filters.type) return false;
      if (filters.disposition !== "All" && disposition !== filters.disposition) return false;
      if (filters.status !== "All" && item.status !== filters.status) return false;
      if (!query) return true;
      return [item.title, item.description, item.lead, item.time, item.status, type, disposition].join(" ").toLowerCase().includes(query);
    });
  }, [activities, filters]);

  const stats = [
    { label: "Total Activities", value: activities.length, icon: Activity, color: "#2563eb" },
    { label: "Contacted", value: activities.filter((a) => ["Call", "WhatsApp"].includes(activityTypeFor(a))).length, icon: Phone, color: "#16a34a" },
    { label: "Not Connected", value: activities.filter((a) => dispositionFor(a) === "Not Connected").length, icon: PhoneOff, color: "#f59e0b" },
    { label: "Proposal / Demo", value: activities.filter((a) => activityTypeFor(a) === "Demo").length, icon: Calendar, color: "#f97316" },
    { label: "Won", value: activities.filter((a) => a.status === "Won").length, icon: Trophy, color: "#7c3aed" },
    { label: "Lost", value: activities.filter((a) => a.status === "Lost").length, icon: XCircle, color: "#dc2626" }
  ];

  const totalPages = Math.max(1, Math.ceil(filtered.length / size));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * size;
  const rows = filtered.slice(start, start + size);
  const hasFilter = filters.q || filters.type !== "All" || filters.disposition !== "All" || filters.status !== "All";

  const updateFilter = (key, value) => { setFilters((prev) => ({ ...prev, [key]: value })); setPage(1); };
  const resetFilter = () => { setFilters({ q: "", type: "All", disposition: "All", status: "All" }); setPage(1); };
  const flash = (msg) => { setToast(msg); window.setTimeout(() => setToast(""), 1800); };
  const openAdd = () => { setForm({ lead_id: leads[0]?.id || "", type: "call", title: "", note: "" }); setError(""); setIsAddOpen(true); };

  async function saveActivity(event) {
    event.preventDefault();
    if (saving) return;
    if (!form.lead_id) { setError("Lead select karo, bina lead activity save nahi hogi."); return; }
    if (!form.title.trim()) { setError("Activity title required hai."); return; }
    setSaving(true);
    setError("");
    try {
      await createActivity({ lead_id: form.lead_id, type: form.type, title: form.title.trim(), note: form.note.trim() || null });
      setIsAddOpen(false);
      flash("Activity saved in Supabase successfully.");
      await loadData();
    } catch (err) {
      setError(err.message || "Activity save failed.");
    } finally {
      setSaving(false);
    }
  }

  async function addFollowUp(item) {
    if (!item.leadId) { flash("Lead id missing, follow-up save nahi hua."); return; }
    try {
      await createActivity({ lead_id: item.leadId, type: "follow_up", title: "Follow-up created", note: `Follow-up created from activity: ${item.title}` });
      flash(`Follow-up saved for ${item.lead}`);
      setMenu(null);
      await loadData();
    } catch (err) {
      setError(err.message || "Follow-up save failed.");
    }
  }

  return (
    <EmployeeShell>
      <div className="space-y-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold text-orange-600 uppercase tracking-wider">Employee Workspace</p>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight mt-1">Activities</h1>
            <p className="text-sm text-slate-500 mt-1">Supabase activity timeline. Showing 10 activities per page.</p>
          </div>
          <button type="button" onClick={openAdd} className="inline-flex items-center gap-2 px-4 h-10 rounded-xl bg-orange-500 text-white text-sm font-bold shadow-lg shadow-orange-500/20"><Plus className="w-4 h-4" /> Add Activity</button>
        </div>

        {error ? <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">{error}</div> : null}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-4">
          {stats.map((s) => { const Icon = s.icon; return <div key={s.label} className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm"><div className="flex items-center justify-between"><div><p className="text-xs font-bold text-slate-500 uppercase tracking-wide">{s.label}</p><h2 className="text-3xl font-bold text-slate-900 mt-2">{loading ? "..." : s.value}</h2></div><div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: `${s.color}18`, color: s.color }}><Icon className="w-5 h-5" /></div></div></div>; })}
        </div>

        <section className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between gap-4 relative">
            <div><h2 className="text-lg font-bold text-slate-900">Activity Timeline</h2><p className="text-sm text-slate-500 mt-1">Showing {filtered.length === 0 ? 0 : start + 1}-{Math.min(start + size, filtered.length)} of {filtered.length}{hasFilter ? ` filtered from ${activities.length}` : ""}</p></div>
            <button type="button" onClick={() => setFilterOpen((v) => !v)} className={`inline-flex items-center gap-2 h-9 px-3 rounded-xl border text-sm font-semibold ${hasFilter || filterOpen ? "bg-orange-50 text-orange-700 border-orange-200" : "border-slate-200 text-slate-700 hover:bg-slate-50"}`}><Filter className="w-4 h-4" /> Filter {hasFilter && <span className="w-2 h-2 rounded-full bg-orange-600" />}</button>
            {filterOpen && <div className="absolute right-5 top-16 z-50 w-[700px] max-w-[calc(100vw-340px)] rounded-2xl border border-slate-200 bg-white shadow-2xl p-4"><div className="grid grid-cols-1 md:grid-cols-4 gap-3"><label className="md:col-span-4"><span className="text-xs font-black text-slate-500 uppercase">Search</span><div className="relative mt-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" /><input value={filters.q} onChange={(e) => updateFilter("q", e.target.value)} placeholder="Search lead, activity, status..." className="w-full h-10 rounded-xl border border-slate-200 pl-9 pr-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-orange-500/20" /></div></label><label><span className="text-xs font-black text-slate-500 uppercase">Activity Type</span><select value={filters.type} onChange={(e) => updateFilter("type", e.target.value)} className="mt-1 w-full h-10 rounded-xl border border-slate-200 px-3 text-sm font-bold">{typeOptions.map((o) => <option key={o}>{o}</option>)}</select></label><label><span className="text-xs font-black text-slate-500 uppercase">Disposition</span><select value={filters.disposition} onChange={(e) => updateFilter("disposition", e.target.value)} className="mt-1 w-full h-10 rounded-xl border border-slate-200 px-3 text-sm font-bold">{dispositionOptions.map((o) => <option key={o}>{o}</option>)}</select></label><label><span className="text-xs font-black text-slate-500 uppercase">Status</span><select value={filters.status} onChange={(e) => updateFilter("status", e.target.value)} className="mt-1 w-full h-10 rounded-xl border border-slate-200 px-3 text-sm font-bold">{statusOptions.map((o) => <option key={o}>{o}</option>)}</select></label><div className="flex items-end gap-2"><button type="button" onClick={resetFilter} className="h-10 px-4 rounded-xl border border-slate-200 text-sm font-bold text-slate-700">Reset</button><button type="button" onClick={() => setFilterOpen(false)} className="h-10 px-4 rounded-xl bg-orange-600 text-white text-sm font-bold">Apply</button></div></div></div>}
          </div>

          <div className="overflow-x-auto"><div className="min-w-[980px]"><div className="grid grid-cols-[1fr_1.1fr_2.15fr_1fr_1.05fr_0.85fr_76px] gap-4 px-5 py-3 bg-slate-50 border-b border-slate-200 text-[12px] font-bold uppercase tracking-wide text-slate-500"><div>Activity Time</div><div>Lead Name</div><div>Activity</div><div>Activity Type</div><div>Disposition</div><div>Status</div><div className="text-center">Action</div></div><div className="divide-y divide-slate-100">
            {rows.map((item) => { const type = activityTypeFor(item); const disposition = dispositionFor(item); const Icon = iconFor(item.type); return <div key={item.id} className="relative grid grid-cols-[1fr_1.1fr_2.15fr_1fr_1.05fr_0.85fr_76px] gap-4 px-5 py-4 items-start hover:bg-slate-50 transition-colors"><div className="text-sm text-slate-600">{item.time}</div><div className="text-sm font-semibold text-slate-700">{item.lead}</div><div className="min-w-0"><div className="flex items-start gap-2"><span className={`mt-0.5 w-8 h-8 rounded-xl grid place-items-center shrink-0 border ${pill("type", type)}`}><Icon className="w-4 h-4" /></span><div className="min-w-0"><h3 className="font-bold text-slate-900 leading-snug truncate">{item.title}</h3><p className="text-sm text-slate-600 mt-1 leading-snug line-clamp-2">{item.description}</p></div></div></div><div><span className={`inline-flex px-2.5 py-1 rounded-full border text-[11px] font-bold ${pill("type", type)}`}>{type}</span></div><div><span className={`inline-flex px-2.5 py-1 rounded-full border text-[11px] font-bold ${pill("disposition", disposition)}`}>{disposition}</span></div><div><span className={`inline-flex px-2.5 py-1 rounded-full border text-[11px] font-bold ${pill("status", item.status)}`}>{item.status}</span></div><div className="flex justify-center relative"><button type="button" onClick={() => setMenu((m) => m === item.id ? null : item.id)} className="w-9 h-9 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-white hover:shadow-sm grid place-items-center"><MoreVertical className="w-4 h-4" /></button>{menu === item.id && <div className="absolute right-0 top-10 z-50 w-44 rounded-xl border border-slate-200 bg-white shadow-2xl overflow-hidden text-left"><button type="button" onClick={() => { setSelected(item); setMenu(null); }} className="w-full px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2"><Eye className="w-4 h-4" /> View Activity</button><button type="button" onClick={() => openLeadById(item.leadId)} className="w-full px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2"><ExternalLink className="w-4 h-4" /> Open Lead</button><button type="button" onClick={() => addFollowUp(item)} className="w-full px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2"><CalendarPlus className="w-4 h-4" /> Add Follow-up</button><button type="button" onClick={() => { flash("Activity marked done"); setMenu(null); }} className="w-full px-3 py-2.5 text-sm font-semibold text-green-700 hover:bg-green-50 flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Mark Done</button></div>}</div></div>; })}
            {loading && <div className="px-5 py-10 text-center text-slate-500"><Loader2 className="w-5 h-5 animate-spin inline mr-2" />Loading Supabase activities...</div>}
            {!loading && rows.length === 0 && <div className="px-5 py-10 text-center text-slate-500">No activities found for selected filter.</div>}
          </div></div></div>
          <div className="px-5 py-4 border-t border-slate-100 flex items-center justify-between"><button type="button" disabled={safePage === 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="h-9 px-4 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 disabled:opacity-40">Previous</button><span className="text-sm font-bold text-slate-600">Page {safePage} of {totalPages}</span><button type="button" disabled={safePage === totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))} className="h-9 px-4 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 disabled:opacity-40">Next</button></div>
        </section>

        {isAddOpen && <div className="fixed inset-0 z-[9999] bg-slate-950/50 backdrop-blur-sm flex items-center justify-center p-6"><div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden"><div className="px-6 py-5 border-b border-slate-200 flex items-start justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-widest text-orange-600">Supabase Activity</p><h2 className="text-xl font-black text-slate-900 mt-1">Add Activity</h2><p className="text-sm text-slate-500 mt-1">Lead select karke activity DB me save karo.</p></div><button type="button" onClick={() => setIsAddOpen(false)} className="w-10 h-10 rounded-xl bg-slate-100 text-slate-500 grid place-items-center"><X className="w-5 h-5" /></button></div><form onSubmit={saveActivity} className="p-6 space-y-4"><label className="block"><span className="text-sm font-black text-slate-700">Lead</span><select value={form.lead_id} onChange={(e) => setForm((old) => ({ ...old, lead_id: e.target.value }))} className="mt-2 w-full h-11 rounded-xl border border-slate-200 px-3 text-sm font-bold"><option value="">Select lead</option>{leads.map((lead) => <option key={lead.id} value={lead.id}>{lead.name} {lead.company ? `· ${lead.company}` : ""}</option>)}</select></label><label className="block"><span className="text-sm font-black text-slate-700">Type</span><select value={form.type} onChange={(e) => setForm((old) => ({ ...old, type: e.target.value }))} className="mt-2 w-full h-11 rounded-xl border border-slate-200 px-3 text-sm font-bold">{activitySaveTypes.map((type) => <option key={type} value={type}>{type.replaceAll("_", " ")}</option>)}</select></label><label className="block"><span className="text-sm font-black text-slate-700">Title</span><input value={form.title} onChange={(e) => setForm((old) => ({ ...old, title: e.target.value }))} placeholder="Call connected / Follow-up scheduled..." className="mt-2 w-full h-11 rounded-xl border border-slate-200 px-3 text-sm font-bold outline-none focus:ring-2 focus:ring-orange-500/20" /></label><label className="block"><span className="text-sm font-black text-slate-700">Note</span><textarea value={form.note} onChange={(e) => setForm((old) => ({ ...old, note: e.target.value }))} rows={3} placeholder="Activity note..." className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-orange-500/20 resize-none" /></label><div className="flex justify-end gap-3"><button type="button" onClick={() => setIsAddOpen(false)} className="h-10 px-4 rounded-xl border border-slate-200 text-slate-700 font-bold">Cancel</button><button type="submit" disabled={saving || !form.lead_id || !form.title.trim()} className="h-10 px-5 rounded-xl bg-orange-600 text-white font-bold inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">{saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} {saving ? "Saving..." : "Save Activity"}</button></div></form></div></div>}

        {selected && <div className="fixed inset-0 z-[9999] bg-slate-950/50 backdrop-blur-sm flex items-center justify-center p-6"><div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden"><div className="px-6 py-5 border-b border-slate-200 flex items-start justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-widest text-orange-600">Activity Details</p><h2 className="text-xl font-black text-slate-900 mt-1">{selected.title}</h2></div><button type="button" onClick={() => setSelected(null)} className="w-10 h-10 rounded-xl bg-slate-100 text-slate-500 grid place-items-center"><X className="w-5 h-5" /></button></div><div className="p-6 space-y-3 text-sm text-slate-700"><p><b>Lead:</b> {selected.lead}</p><p><b>Time:</b> {selected.time}</p><p><b>Activity Type:</b> {activityTypeFor(selected)}</p><p><b>Disposition:</b> {dispositionFor(selected)}</p><p><b>Status:</b> {selected.status}</p><p><b>Description:</b> {selected.description}</p></div></div></div>}
        {toast && <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] px-4 py-3 rounded-xl bg-slate-900 text-white text-sm font-bold shadow-xl">{toast}</div>}
      </div>
    </EmployeeShell>
  );
}
