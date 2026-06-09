import { useMemo, useState } from "react";
import { Activity, Phone, MessageCircle, Calendar, FileText, Trophy, Filter, Plus, MoreVertical, PhoneOff, XCircle, Eye, ExternalLink, CalendarPlus, CheckCircle2, X, Search } from "lucide-react";
import EmployeeShell from "../../components/employee/EmployeeShell.jsx";
import { employeeActivities } from "../../data/employeeData.js";

const extraActivities = [
  { id: "not-connected-1", type: "not-connected", title: "Not Connected — Motilal client", description: "Call not picked. Auto follow-up task should be created for 2 hours later.", status: "Pending", lead: "Motilal", time: "Jun 12, 04:10 PM" },
  { id: "lost-1", type: "lost", title: "Lost — Budget not approved", description: "Lead marked as lost after final discussion. Reason: budget not approved.", status: "Lost", lead: "Priya Sharma", time: "Jun 12, 05:20 PM" }
];

const leadIds = { "Rajesh Kumar": "1", "Priya Sharma": "2", "Aditya Mehta": "3", "Sunita Patel": "4", "Vikram Nair": "5", "Neha Gupta": "6", Motilal: "7" };
const typeOptions = ["All", "Call", "Demo", "Note", "Demo Done"];
const dispositionOptions = ["All", "Connected", "Follow Up", "Demo Booked", "Not Connected"];
const statusOptions = ["All", "Completed", "Pending", "Done", "Sent", "Won", "Lost", "Note", "Missed"];

const lower = (v = "") => String(v).toLowerCase();

function iconFor(type) {
  const key = lower(type);
  if (key === "call") return Phone;
  if (key === "whatsapp") return MessageCircle;
  if (key === "task") return Calendar;
  if (key === "won") return Trophy;
  if (key === "not-connected") return PhoneOff;
  if (key === "lost") return XCircle;
  return FileText;
}

function activityTypeFor(item) {
  const key = lower(item.type);
  const title = lower(item.title);
  const status = lower(item.status);
  if (["call", "whatsapp", "not-connected", "lost"].includes(key)) return "Call";
  if (["email", "note"].includes(key)) return "Note";
  if (key === "won" || status.includes("won")) return "Demo Done";
  if (key === "task" || title.includes("demo")) return "Demo";
  return item.type || "Activity";
}

function dispositionFor(item) {
  const key = lower(item.type);
  const status = lower(item.status);
  const title = lower(item.title);
  const desc = lower(item.description);
  if (key === "not-connected" || title.includes("not connected") || status.includes("missed")) return "Not Connected";
  if (key === "lost" || status.includes("lost")) return "Not Connected";
  if (key === "call") return "Connected";
  if (key === "task" && (title.includes("demo") || desc.includes("demo"))) return "Demo Booked";
  if (["whatsapp", "email", "note", "task"].includes(key)) return "Follow Up";
  if (key === "won") return "Demo Booked";
  return item.status || "-";
}

function pill(kind, value = "") {
  const key = lower(value);
  if (kind === "type") {
    if (key.includes("call")) return "bg-green-50 text-green-700 border-green-100";
    if (key.includes("demo done")) return "bg-emerald-50 text-emerald-700 border-emerald-100";
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

function openLead(lead) {
  const id = leadIds[lead] || "1";
  window.history.pushState({}, "", `/leads/${id}`);
  window.dispatchEvent(new Event("salesflow:navigate"));
}

export default function EmployeeActivitiesPage() {
  const [page, setPage] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({ q: "", type: "All", disposition: "All", status: "All" });
  const [menu, setMenu] = useState(null);
  const [selected, setSelected] = useState(null);
  const [toast, setToast] = useState("");
  const size = 10;

  const allActivities = useMemo(() => {
    const hasNC = employeeActivities.some((a) => a.type === "not-connected" || a.status === "Not Connected");
    const hasLost = employeeActivities.some((a) => a.type === "lost" || a.status === "Lost");
    return [...employeeActivities, ...(hasNC ? [] : [extraActivities[0]]), ...(hasLost ? [] : [extraActivities[1]])];
  }, []);

  const filtered = useMemo(() => {
    const query = lower(filters.q.trim());
    return allActivities.filter((item) => {
      const type = activityTypeFor(item);
      const disposition = dispositionFor(item);
      if (filters.type !== "All" && type !== filters.type) return false;
      if (filters.disposition !== "All" && disposition !== filters.disposition) return false;
      if (filters.status !== "All" && item.status !== filters.status) return false;
      if (!query) return true;
      return [item.title, item.description, item.lead, item.time, item.status, type, disposition].join(" ").toLowerCase().includes(query);
    });
  }, [allActivities, filters]);

  const stats = [
    { label: "Total Activities", value: allActivities.length, icon: Activity, color: "#2563eb" },
    { label: "Contacted", value: allActivities.filter((a) => ["Call", "WhatsApp"].includes(a.type)).length, icon: Phone, color: "#16a34a" },
    { label: "Not Connected", value: allActivities.filter((a) => a.status === "Not Connected" || a.type === "not-connected").length, icon: PhoneOff, color: "#f59e0b" },
    { label: "Proposal / Demo", value: allActivities.filter((a) => a.type === "Email" || a.type === "Task").length, icon: Calendar, color: "#f97316" },
    { label: "Won", value: allActivities.filter((a) => a.status === "Won").length, icon: Trophy, color: "#7c3aed" },
    { label: "Lost", value: allActivities.filter((a) => a.status === "Lost" || a.type === "lost").length, icon: XCircle, color: "#dc2626" }
  ];

  const totalPages = Math.max(1, Math.ceil(filtered.length / size));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * size;
  const rows = filtered.slice(start, start + size);
  const hasFilter = filters.q || filters.type !== "All" || filters.disposition !== "All" || filters.status !== "All";

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const resetFilter = () => {
    setFilters({ q: "", type: "All", disposition: "All", status: "All" });
    setPage(1);
  };

  const flash = (msg) => {
    setToast(msg);
    window.setTimeout(() => setToast(""), 1800);
  };

  return (
    <EmployeeShell>
      <div className="space-y-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold text-orange-600 uppercase tracking-wider">Employee Workspace</p>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight mt-1">Activities</h1>
            <p className="text-sm text-slate-500 mt-1">Showing 10 activities per page.</p>
          </div>
          <button type="button" className="inline-flex items-center gap-2 px-4 h-10 rounded-xl bg-orange-500 text-white text-sm font-bold shadow-lg shadow-orange-500/20"><Plus className="w-4 h-4" /> Add Activity</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-4">
          {stats.map((s) => { const Icon = s.icon; return <div key={s.label} className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm"><div className="flex items-center justify-between"><div><p className="text-xs font-bold text-slate-500 uppercase tracking-wide">{s.label}</p><h2 className="text-3xl font-bold text-slate-900 mt-2">{s.value}</h2></div><div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: `${s.color}18`, color: s.color }}><Icon className="w-5 h-5" /></div></div></div>; })}
        </div>

        <section className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between gap-4 relative">
            <div><h2 className="text-lg font-bold text-slate-900">Activity Timeline</h2><p className="text-sm text-slate-500 mt-1">Showing {filtered.length === 0 ? 0 : start + 1}-{Math.min(start + size, filtered.length)} of {filtered.length}{hasFilter ? ` filtered from ${allActivities.length}` : ""}</p></div>
            <button type="button" onClick={() => setFilterOpen((v) => !v)} className={`inline-flex items-center gap-2 h-9 px-3 rounded-xl border text-sm font-semibold ${hasFilter || filterOpen ? "bg-orange-50 text-orange-700 border-orange-200" : "border-slate-200 text-slate-700 hover:bg-slate-50"}`}><Filter className="w-4 h-4" /> Filter {hasFilter && <span className="w-2 h-2 rounded-full bg-orange-600" />}</button>
            {filterOpen && <div className="absolute right-5 top-16 z-50 w-[700px] max-w-[calc(100vw-340px)] rounded-2xl border border-slate-200 bg-white shadow-2xl p-4"><div className="grid grid-cols-1 md:grid-cols-4 gap-3"><label className="md:col-span-4"><span className="text-xs font-black text-slate-500 uppercase">Search</span><div className="relative mt-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" /><input value={filters.q} onChange={(e) => updateFilter("q", e.target.value)} placeholder="Search lead, activity, status..." className="w-full h-10 rounded-xl border border-slate-200 pl-9 pr-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-orange-500/20" /></div></label><label><span className="text-xs font-black text-slate-500 uppercase">Activity Type</span><select value={filters.type} onChange={(e) => updateFilter("type", e.target.value)} className="mt-1 w-full h-10 rounded-xl border border-slate-200 px-3 text-sm font-bold">{typeOptions.map((o) => <option key={o}>{o}</option>)}</select></label><label><span className="text-xs font-black text-slate-500 uppercase">Disposition</span><select value={filters.disposition} onChange={(e) => updateFilter("disposition", e.target.value)} className="mt-1 w-full h-10 rounded-xl border border-slate-200 px-3 text-sm font-bold">{dispositionOptions.map((o) => <option key={o}>{o}</option>)}</select></label><label><span className="text-xs font-black text-slate-500 uppercase">Status</span><select value={filters.status} onChange={(e) => updateFilter("status", e.target.value)} className="mt-1 w-full h-10 rounded-xl border border-slate-200 px-3 text-sm font-bold">{statusOptions.map((o) => <option key={o}>{o}</option>)}</select></label><div className="flex items-end gap-2"><button type="button" onClick={resetFilter} className="h-10 px-4 rounded-xl border border-slate-200 text-sm font-bold text-slate-700">Reset</button><button type="button" onClick={() => setFilterOpen(false)} className="h-10 px-4 rounded-xl bg-orange-600 text-white text-sm font-bold">Apply</button></div></div></div>}
          </div>

          <div className="overflow-x-auto"><div className="min-w-[980px]"><div className="grid grid-cols-[1fr_1.1fr_2.15fr_1fr_1.05fr_0.85fr_76px] gap-4 px-5 py-3 bg-slate-50 border-b border-slate-200 text-[12px] font-bold uppercase tracking-wide text-slate-500"><div>Activity Time</div><div>Lead Name</div><div>Activity</div><div>Activity Type</div><div>Disposition</div><div>Status</div><div className="text-center">Action</div></div><div className="divide-y divide-slate-100">
            {rows.map((item) => { const type = activityTypeFor(item); const disposition = dispositionFor(item); const Icon = iconFor(item.type); return <div key={item.id} className="relative grid grid-cols-[1fr_1.1fr_2.15fr_1fr_1.05fr_0.85fr_76px] gap-4 px-5 py-4 items-start hover:bg-slate-50 transition-colors"><div className="text-sm text-slate-600">{item.time}</div><div className="text-sm font-semibold text-slate-700">{item.lead}</div><div className="min-w-0"><div className="flex items-start gap-2"><span className={`mt-0.5 w-8 h-8 rounded-xl grid place-items-center shrink-0 border ${pill("type", type)}`}><Icon className="w-4 h-4" /></span><div className="min-w-0"><h3 className="font-bold text-slate-900 leading-snug truncate">{item.title}</h3><p className="text-sm text-slate-600 mt-1 leading-snug line-clamp-2">{item.description}</p></div></div></div><div><span className={`inline-flex px-2.5 py-1 rounded-full border text-[11px] font-bold ${pill("type", type)}`}>{type}</span></div><div><span className={`inline-flex px-2.5 py-1 rounded-full border text-[11px] font-bold ${pill("disposition", disposition)}`}>{disposition}</span></div><div><span className={`inline-flex px-2.5 py-1 rounded-full border text-[11px] font-bold ${pill("status", item.status)}`}>{item.status}</span></div><div className="flex justify-center relative"><button type="button" onClick={() => setMenu((m) => m === item.id ? null : item.id)} className="w-9 h-9 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-white hover:shadow-sm grid place-items-center"><MoreVertical className="w-4 h-4" /></button>{menu === item.id && <div className="absolute right-0 top-10 z-50 w-44 rounded-xl border border-slate-200 bg-white shadow-2xl overflow-hidden text-left"><button type="button" onClick={() => { setSelected(item); setMenu(null); }} className="w-full px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2"><Eye className="w-4 h-4" /> View Activity</button><button type="button" onClick={() => openLead(item.lead)} className="w-full px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2"><ExternalLink className="w-4 h-4" /> Open Lead</button><button type="button" onClick={() => { flash(`Follow-up created for ${item.lead}`); setMenu(null); }} className="w-full px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2"><CalendarPlus className="w-4 h-4" /> Add Follow-up</button><button type="button" onClick={() => { flash("Activity marked done"); setMenu(null); }} className="w-full px-3 py-2.5 text-sm font-semibold text-green-700 hover:bg-green-50 flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Mark Done</button></div>}</div></div>; })}
            {rows.length === 0 && <div className="px-5 py-10 text-center text-slate-500">No activities found for selected filter.</div>}
          </div></div></div>
          <div className="px-5 py-4 border-t border-slate-100 flex items-center justify-between"><button type="button" disabled={safePage === 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="h-9 px-4 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 disabled:opacity-40">Previous</button><span className="text-sm font-bold text-slate-600">Page {safePage} of {totalPages}</span><button type="button" disabled={safePage === totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))} className="h-9 px-4 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 disabled:opacity-40">Next</button></div>
        </section>

        {selected && <div className="fixed inset-0 z-[9999] bg-slate-950/50 backdrop-blur-sm flex items-center justify-center p-6"><div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden"><div className="px-6 py-5 border-b border-slate-200 flex items-start justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-widest text-orange-600">Activity Details</p><h2 className="text-xl font-black text-slate-900 mt-1">{selected.title}</h2></div><button type="button" onClick={() => setSelected(null)} className="w-10 h-10 rounded-xl bg-slate-100 text-slate-500 grid place-items-center"><X className="w-5 h-5" /></button></div><div className="p-6 space-y-3 text-sm text-slate-700"><p><b>Lead:</b> {selected.lead}</p><p><b>Time:</b> {selected.time}</p><p><b>Activity Type:</b> {activityTypeFor(selected)}</p><p><b>Disposition:</b> {dispositionFor(selected)}</p><p><b>Status:</b> {selected.status}</p><p><b>Description:</b> {selected.description}</p></div></div></div>}
        {toast && <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] px-4 py-3 rounded-xl bg-slate-900 text-white text-sm font-bold shadow-xl">{toast}</div>}
      </div>
    </EmployeeShell>
  );
}
