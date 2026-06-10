import { useMemo, useState } from "react";
import { Trophy, IndianRupee, Download, Search, CalendarDays, Filter, Eye } from "lucide-react";
import EmployeeShell from "../../components/employee/EmployeeShell.jsx";
import { wonLeads } from "../../data/employeeData.js";
import { downloadCsv } from "../../services/exportService.js";
import { exportWonCsv, getWonLeads, getWonPageState } from "../../services/wonFlowService.js";

const leadSourceOptions = ["Website", "LinkedIn", "Referral", "Facebook", "Instagram", "Google Ads", "Event", "Cold Call", "WhatsApp", "Other"];

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function yesterdayISO() {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  return date.toISOString().slice(0, 10);
}

function isThisMonth(dateISO = "") {
  return String(dateISO).startsWith(new Date().toISOString().slice(0, 7));
}

function openLead(leadId) {
  window.history.pushState({}, "", `/leads/${leadId}`);
  window.dispatchEvent(new Event("salesflow:navigate"));
}

function formatDate(value) {
  if (!value) return "Not assign";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: true });
}

function enrichWonRows(rows = []) {
  return rows.map((lead, index) => ({
    ...lead,
    closeDateISO: lead.closeDateISO || String(lead.wonAt || lead.updatedAt || lead.createdAt || "").slice(0, 10),
    closeDate: lead.closeDate || formatDate(lead.wonAt || lead.updatedAt || lead.createdAt || lead.created),
    owner: lead.owner || lead.ownerName || "Jayraj",
    source: lead.source || leadSourceOptions[index % leadSourceOptions.length],
    value: Number(lead.value || lead.amount || 0),
    company: lead.company || "Not assign",
    phone: lead.phone || "Not assign",
  }));
}

export default function WonPageFixed() {
  const [page, setPage] = useState(1);
  const [workflowState] = useState(() => getWonPageState());
  const [filters, setFilters] = useState({ date: "all", fromDate: "", toDate: "", source: "all", query: "" });
  const size = 10;

  const enrichedWonLeads = useMemo(() => enrichWonRows(getWonLeads(workflowState, wonLeads)), [workflowState]);

  const filteredWon = useMemo(() => {
    const query = filters.query.trim().toLowerCase();
    return enrichedWonLeads.filter((lead) => {
      if (filters.source !== "all" && lead.source !== filters.source) return false;
      if (filters.date === "today" && lead.closeDateISO !== todayISO()) return false;
      if (filters.date === "yesterday" && lead.closeDateISO !== yesterdayISO()) return false;
      if (filters.date === "this-month" && !isThisMonth(lead.closeDateISO)) return false;
      if (filters.date === "custom") {
        if (filters.fromDate && lead.closeDateISO < filters.fromDate) return false;
        if (filters.toDate && lead.closeDateISO > filters.toDate) return false;
      }
      if (!query) return true;
      return [lead.name, lead.company, lead.phone, lead.owner, lead.source, lead.closeDate].join(" ").toLowerCase().includes(query);
    });
  }, [filters, enrichedWonLeads]);

  const totalRevenue = enrichedWonLeads.reduce((sum, lead) => sum + Number(lead.value || 0), 0);
  const wonThisMonth = enrichedWonLeads.filter((lead) => isThisMonth(lead.closeDateISO)).length;
  const averageDeal = enrichedWonLeads.length ? Math.round(totalRevenue / enrichedWonLeads.length) : 0;
  const stats = [
    { label: "Total Won", value: enrichedWonLeads.length, icon: Trophy, color: "#16a34a" },
    { label: "Won This Month", value: wonThisMonth, icon: CalendarDays, color: "#2563eb" },
    { label: "Revenue", value: `₹${totalRevenue.toLocaleString("en-IN")}`, icon: IndianRupee, color: "#f97316" },
    { label: "Average Deal Amount", value: `₹${averageDeal.toLocaleString("en-IN")}`, icon: IndianRupee, color: "#7c3aed" }
  ];

  const totalPages = Math.max(1, Math.ceil(filteredWon.length / size));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * size;
  const rows = filteredWon.slice(start, start + size);

  const updateFilter = (key, value) => { setFilters((prev) => ({ ...prev, [key]: value })); setPage(1); };
  const resetFilters = () => { setFilters({ date: "all", fromDate: "", toDate: "", source: "all", query: "" }); setPage(1); };
  const handleExport = () => downloadCsv("won-leads.csv", exportWonCsv(workflowState, enrichedWonLeads));

  return (
    <EmployeeShell>
      <div className="space-y-5">
        <div className="flex items-center justify-between gap-4">
          <div><p className="text-xs font-bold text-orange-600 uppercase tracking-wider">Employee Workspace</p><h1 className="text-3xl font-bold text-slate-900 tracking-tight mt-1">Won Leads</h1><p className="text-sm text-slate-500 mt-1">Track closed deals, revenue and won lead sources.</p></div>
          <button type="button" onClick={handleExport} className="inline-flex items-center gap-2 px-4 h-10 rounded-xl bg-orange-500 text-white text-sm font-bold shadow-lg shadow-orange-500/20"><Download className="w-4 h-4" />Export Won</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {stats.map((item) => { const Icon = item.icon; return <div key={item.label} className="rounded-2xl bg-white border border-slate-200 p-4 shadow-sm min-h-[112px]"><div className="flex items-center justify-between gap-3"><div className="min-w-0"><p className="text-xs font-bold text-slate-500 uppercase tracking-wide leading-tight">{item.label}</p><h2 className="text-[30px] leading-tight font-black text-slate-900 mt-2 truncate">{item.value}</h2></div><div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0" style={{ background: `${item.color}18`, color: item.color }}><Icon className="w-5 h-5" /></div></div></div>; })}
        </div>

        <section className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 space-y-4">
            <div className="flex items-center justify-between gap-4"><div><h2 className="text-lg font-bold text-slate-900">Won List</h2><p className="text-sm text-slate-500 mt-1">Showing {filteredWon.length === 0 ? 0 : start + 1}-{Math.min(start + size, filteredWon.length)} of {filteredWon.length}</p></div><button type="button" onClick={resetFilters} className="inline-flex items-center gap-2 h-10 px-4 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 hover:bg-slate-50"><Filter className="w-4 h-4 text-orange-600" />Reset Filters</button></div>
            <div className={`grid grid-cols-1 ${filters.date === "custom" ? "xl:grid-cols-[170px_160px_160px_190px_1fr]" : "xl:grid-cols-[170px_190px_1fr]"} gap-3`}>
              <label className="block"><span className="text-xs font-black text-slate-500 uppercase">Date</span><select value={filters.date} onChange={(event) => updateFilter("date", event.target.value)} className="mt-1 w-full h-11 rounded-xl border border-slate-200 px-3 text-sm font-bold outline-none focus:ring-2 focus:ring-orange-500/20"><option value="all">All Dates</option><option value="today">Today</option><option value="yesterday">Yesterday</option><option value="this-month">This Month</option><option value="custom">Custom Range</option></select></label>
              {filters.date === "custom" && <><label className="block"><span className="text-xs font-black text-slate-500 uppercase">From Date</span><input type="date" value={filters.fromDate} onChange={(event) => updateFilter("fromDate", event.target.value)} className="mt-1 w-full h-11 rounded-xl border border-slate-200 px-3 text-sm font-bold outline-none focus:ring-2 focus:ring-orange-500/20" /></label><label className="block"><span className="text-xs font-black text-slate-500 uppercase">To Date</span><input type="date" value={filters.toDate} onChange={(event) => updateFilter("toDate", event.target.value)} className="mt-1 w-full h-11 rounded-xl border border-slate-200 px-3 text-sm font-bold outline-none focus:ring-2 focus:ring-orange-500/20" /></label></>}
              <label className="block"><span className="text-xs font-black text-slate-500 uppercase">Lead Source</span><select value={filters.source} onChange={(event) => updateFilter("source", event.target.value)} className="mt-1 w-full h-11 rounded-xl border border-slate-200 px-3 text-sm font-bold outline-none focus:ring-2 focus:ring-orange-500/20"><option value="all">All Sources</option>{leadSourceOptions.map((source) => <option key={source} value={source}>{source}</option>)}</select></label>
              <label className="block"><span className="text-xs font-black text-slate-500 uppercase">Search</span><div className="relative mt-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" /><input value={filters.query} onChange={(event) => updateFilter("query", event.target.value)} placeholder="Search lead, company, owner, source..." className="w-full h-11 rounded-xl border border-slate-200 pl-9 pr-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-orange-500/20" /></div></label>
            </div>
          </div>

          <div className="overflow-x-auto"><div className="min-w-[980px]"><div className="grid grid-cols-[1fr_1.3fr_1.4fr_1.1fr_1fr_1fr_64px] gap-4 px-5 py-3 bg-slate-50 border-b border-slate-200 text-[12px] font-bold uppercase tracking-wide text-slate-500"><div>Close Date</div><div>Lead Name</div><div>Company</div><div>Deal Amount</div><div>Owner</div><div>Source</div><div className="text-center">Action</div></div>
            <div className="divide-y divide-slate-100">
              {rows.map((lead) => <div key={lead.id} className="grid grid-cols-[1fr_1.3fr_1.4fr_1.1fr_1fr_1fr_64px] gap-4 px-5 py-4 items-center hover:bg-slate-50"><div className="text-sm text-slate-600">{lead.closeDate}</div><div><h3 className="font-bold text-slate-900">{lead.name}</h3><p className="text-xs text-slate-500">{lead.phone}</p></div><div className="text-sm font-semibold text-slate-700">{lead.company}</div><div className="text-sm font-black text-green-700">₹{Number(lead.value || 0).toLocaleString("en-IN")}</div><div className="text-sm text-slate-600">{lead.owner}</div><div><span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold">{lead.source}</span></div><div className="flex justify-center"><button type="button" onClick={() => openLead(lead.id)} className="w-9 h-9 rounded-xl border border-slate-200 text-slate-600 hover:text-orange-600 hover:bg-orange-50 grid place-items-center" title="Open lead"><Eye className="w-4 h-4" /></button></div></div>)}
              {rows.length === 0 && <div className="px-5 py-10 text-center text-slate-500">No won leads found for selected filter.</div>}
            </div></div></div>

          <div className="px-5 py-4 border-t border-slate-100 flex items-center justify-between"><button type="button" disabled={safePage === 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="h-9 px-4 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 disabled:opacity-40">Previous</button><span className="text-sm font-bold text-slate-600">Page {safePage} of {totalPages}</span><button type="button" disabled={safePage === totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))} className="h-9 px-4 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 disabled:opacity-40">Next</button></div>
        </section>
      </div>
    </EmployeeShell>
  );
}
