import { useEffect, useMemo, useState } from "react";
import { leads as dummyLeads } from "@/data/dummy";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Plus, Download, Upload, Users, MoreVertical, Phone, Mail, FileEdit, Trash2, CheckCircle2, XCircle, Search, Filter, X, ChevronDown, ChevronUp, CalendarDays, SlidersHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { getCurrentProfile, getCompanyUsers, listLeads, updateLead, softDeleteLead } from "../../services/crmApi.js";

const STATUS_TABS = ["All", "New", "Assigned", "Demo Done", "Won", "Lost", "Junk", "Overdue", "Assigned To Me"];
const STATUS_OPTIONS = ["New", "Assigned", "Demo Done", "Won", "Lost", "Junk", "Overdue"];
const DATE_PRESETS = [
  { label: "Today", value: "today" },
  { label: "Yesterday", value: "yesterday" },
  { label: "Last 7 Days", value: "last7" },
  { label: "Last 30 Days", value: "last30" },
  { label: "This Month", value: "thisMonth" },
  { label: "Last Month", value: "lastMonth" },
  { label: "Custom Range", value: "custom" },
];

function getDateRange(preset: string): { from: string; to: string } | null {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  const fmt = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  if (preset === "today") { const t = fmt(now); return { from: t, to: t }; }
  if (preset === "yesterday") { const d = new Date(now); d.setDate(d.getDate() - 1); const t = fmt(d); return { from: t, to: t }; }
  if (preset === "last7") { const d = new Date(now); d.setDate(d.getDate() - 7); return { from: fmt(d), to: fmt(now) }; }
  if (preset === "last30") { const d = new Date(now); d.setDate(d.getDate() - 30); return { from: fmt(d), to: fmt(now) }; }
  if (preset === "thisMonth") return { from: fmt(new Date(now.getFullYear(), now.getMonth(), 1)), to: fmt(now) };
  if (preset === "lastMonth") return { from: fmt(new Date(now.getFullYear(), now.getMonth() - 1, 1)), to: fmt(new Date(now.getFullYear(), now.getMonth(), 0)) };
  return null;
}

function formatDate(value: any) {
  if (!value) return "—";
  try { return new Date(value).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }); } catch { return "—"; }
}
function formatFollowUp(value: any) {
  if (!value) return "—";
  try { return new Date(value).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }); } catch { return "—"; }
}
function amountText(value: any) {
  const n = Number(value || 0) || 0;
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
  if (n >= 1000) return `₹${(n / 1000).toFixed(0)}K`;
  return n > 0 ? `₹${n.toLocaleString("en-IN")}` : "—";
}
function ownerName(lead: any) {
  return lead?.assignedTo || lead?.owner?.full_name || lead?.owner_name || "Unassigned";
}
function normalizeLead(lead: any) {
  return {
    id: lead.id,
    name: lead.name || "Unnamed Lead",
    email: lead.email || "-",
    phone: lead.phone || "-",
    company: lead.company || "-",
    status: lead.status || "New",
    assignedTo: ownerName(lead),
    followUpDate: lead.followUpDate || formatFollowUp(lead.next_follow_up || lead.follow_up_at),
    createdDate: lead.createdDate || formatDate(lead.created_at),
    amount: Number(lead.amount ?? lead.value ?? 0) || 0,
    rawCreatedAt: lead.created_at || lead.createdDate,
    raw: lead,
  };
}

export default function Leads() {
  const [activeTab, setActiveTab] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [teamFilter, setTeamFilter] = useState("All Team");
  const [datePreset, setDatePreset] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [liveLeads, setLiveLeads] = useState<any[]>([]);
  const [teamMembers, setTeamMembers] = useState<string[]>(["All Team", "Unassigned"]);
  const [currentUserName, setCurrentUserName] = useState("Arjun Sharma");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  async function reloadLeads() {
    setLoading(true);
    try {
      const profile = await getCurrentProfile();
      setCurrentUserName(profile?.full_name || profile?.email || "Company Admin");
      const [leadRows, users] = await Promise.all([
        listLeads({ limit: 1000 }),
        profile?.company_id ? getCompanyUsers(profile.company_id) : Promise.resolve([]),
      ]);
      setLiveLeads((leadRows || []).map(normalizeLead));
      const names = (users || []).map((u: any) => u.full_name || u.email).filter(Boolean);
      setTeamMembers(["All Team", ...Array.from(new Set(names)), "Unassigned"]);
      setLoadError("");
    } catch (error: any) {
      setLiveLeads([]);
      setLoadError(error?.message || "Unable to load live leads");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { reloadLeads(); }, []);

  const sourceLeads = liveLeads.length ? liveLeads : dummyLeads.map(normalizeLead);

  const handlePreset = (preset: string) => {
    setDatePreset(preset);
    if (preset !== "custom") {
      const range = getDateRange(preset);
      if (range) { setDateFrom(range.from); setDateTo(range.to); } else { setDateFrom(""); setDateTo(""); }
    }
  };

  const filteredLeads = useMemo(() => {
    return sourceLeads.filter((lead: any) => {
      if (activeTab === "Assigned To Me" && lead.assignedTo !== currentUserName) return false;
      if (activeTab !== "All" && activeTab !== "Assigned To Me" && lead.status !== activeTab) return false;
      if (statusFilter !== "All" && lead.status !== statusFilter) return false;
      if (teamFilter !== "All Team" && lead.assignedTo !== teamFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        const hit = lead.name.toLowerCase().includes(q) || lead.email.toLowerCase().includes(q) || lead.phone.includes(q) || lead.company.toLowerCase().includes(q) || lead.assignedTo.toLowerCase().includes(q);
        if (!hit) return false;
      }
      if (dateFrom || dateTo) {
        const created = new Date(lead.rawCreatedAt);
        if (isNaN(created.getTime())) return true;
        if (dateFrom && created < new Date(dateFrom)) return false;
        if (dateTo && created > new Date(dateTo + "T23:59:59")) return false;
      }
      return true;
    });
  }, [activeTab, statusFilter, teamFilter, search, dateFrom, dateTo, sourceLeads, currentUserName]);

  const activeFilterCount = [statusFilter !== "All", teamFilter !== "All Team", dateFrom || dateTo, search.trim() !== ""].filter(Boolean).length;
  function clearAllFilters() { setSearch(""); setStatusFilter("All"); setTeamFilter("All Team"); setDatePreset("all"); setDateFrom(""); setDateTo(""); }
  function removeFilter(key: string) { if (key === "status") setStatusFilter("All"); if (key === "team") setTeamFilter("All Team"); if (key === "date") { setDateFrom(""); setDateTo(""); setDatePreset("all"); } if (key === "search") setSearch(""); }

  async function changeStatus(leadId: string, status: string) {
    try { await updateLead(leadId, { status }); await reloadLeads(); } catch (error: any) { alert(error?.message || "Unable to update lead"); }
  }
  async function deleteLead(leadId: string) {
    if (!confirm("Delete this lead?")) return;
    try { await softDeleteLead(leadId); await reloadLeads(); } catch (error: any) { alert(error?.message || "Unable to delete lead"); }
  }

  return (
    <div className="space-y-5">
      {loadError && <div className="rounded-lg border border-orange-200 bg-orange-50 px-4 py-3 text-sm text-orange-700">Live leads load nahi hue, fallback data dikha rahe hain: {loadError}</div>}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input data-testid="input-lead-search" placeholder="Search name, email, phone, company..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 bg-white" />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
          <Button data-testid="button-toggle-filters" variant="outline" size="sm" className="gap-2 bg-white relative" onClick={() => setShowFilters(!showFilters)}>
            <SlidersHorizontal className="h-4 w-4" /> Filters
            {activeFilterCount > 0 && <span className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-primary text-[10px] text-white flex items-center justify-center font-bold">{activeFilterCount}</span>}
            {showFilters ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </Button>
          <Button variant="outline" size="sm" className="gap-2 bg-white" data-testid="button-import"><Upload className="h-4 w-4" /> Import</Button>
          <Button variant="outline" size="sm" className="gap-2 bg-white" data-testid="button-export"><Download className="h-4 w-4" /> Export</Button>
          <Button variant="outline" size="sm" className="gap-2 bg-white" data-testid="button-assign"><Users className="h-4 w-4" /> Assign</Button>
          <Button size="sm" className="gap-2" data-testid="button-add-lead"><Plus className="h-4 w-4" /> Add Lead</Button>
        </div>
      </div>

      <AnimatePresence>{showFilters && <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.18 }}><Card className="border-gray-100 shadow-sm p-4"><div className="flex items-center justify-between mb-4"><div className="flex items-center gap-2"><Filter className="h-4 w-4 text-primary" /><span className="text-sm font-semibold text-slate-700">Advanced Filters</span></div>{activeFilterCount > 0 && <Button variant="ghost" size="sm" className="text-xs text-muted-foreground gap-1 h-7" onClick={clearAllFilters} data-testid="button-clear-filters"><X className="h-3 w-3" /> Clear All</Button>}</div><div className="grid grid-cols-1 sm:grid-cols-3 gap-4"><div className="space-y-1.5"><Label className="text-xs font-semibold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">Stage / Status</Label><Select value={statusFilter} onValueChange={setStatusFilter}><SelectTrigger data-testid="select-status-filter" className="bg-white h-10 text-sm"><SelectValue placeholder="All Stages" /></SelectTrigger><SelectContent><SelectItem value="All">All Stages</SelectItem>{STATUS_OPTIONS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select></div><div className="space-y-1.5"><Label className="text-xs font-semibold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">Team Member</Label><Select value={teamFilter} onValueChange={setTeamFilter}><SelectTrigger data-testid="select-team-filter" className="bg-white h-10 text-sm"><SelectValue placeholder="All Team" /></SelectTrigger><SelectContent>{teamMembers.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent></Select></div><div className="space-y-1.5"><Label className="text-xs font-semibold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">Date Range</Label><Select value={datePreset} onValueChange={handlePreset}><SelectTrigger data-testid="select-date-preset" className="bg-white h-10 text-sm"><SelectValue placeholder="All Time" /></SelectTrigger><SelectContent><SelectItem value="all">All Time</SelectItem>{DATE_PRESETS.map((p) => <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>)}</SelectContent></Select></div></div>{datePreset === "custom" && <div className="pt-4 grid grid-cols-2 gap-4 max-w-sm"><div className="space-y-1.5"><Label className="text-xs font-semibold text-slate-500 uppercase tracking-widest flex items-center gap-1.5"><CalendarDays className="h-3 w-3" /> From</Label><Input type="date" data-testid="input-date-from" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="bg-white h-10 text-sm cursor-pointer" /></div><div className="space-y-1.5"><Label className="text-xs font-semibold text-slate-500 uppercase tracking-widest flex items-center gap-1.5"><CalendarDays className="h-3 w-3" /> To</Label><Input type="date" data-testid="input-date-to" value={dateTo} onChange={(e) => setDateTo(e.target.value)} min={dateFrom} className="bg-white h-10 text-sm cursor-pointer" /></div></div>}</Card></motion.div>}</AnimatePresence>

      {activeFilterCount > 0 && <div className="flex items-center gap-2 flex-wrap"><span className="text-xs text-muted-foreground font-medium">Active:</span>{search.trim() && <Badge variant="secondary" className="gap-1 pr-1 pl-2 text-xs h-6">Search: "{search}"<button onClick={() => removeFilter("search")} className="ml-0.5 hover:text-red-500 transition-colors"><X className="h-3 w-3" /></button></Badge>}{statusFilter !== "All" && <Badge variant="secondary" className="gap-1 pr-1 pl-2 text-xs h-6">Stage: {statusFilter}<button onClick={() => removeFilter("status")} className="ml-0.5 hover:text-red-500 transition-colors"><X className="h-3 w-3" /></button></Badge>}{teamFilter !== "All Team" && <Badge variant="secondary" className="gap-1 pr-1 pl-2 text-xs h-6">Team: {teamFilter}<button onClick={() => removeFilter("team")} className="ml-0.5 hover:text-red-500 transition-colors"><X className="h-3 w-3" /></button></Badge>}{(dateFrom || dateTo) && <Badge variant="secondary" className="gap-1 pr-1 pl-2 text-xs h-6">Date: {dateFrom || "..."} → {dateTo || "..."}<button onClick={() => removeFilter("date")} className="ml-0.5 hover:text-red-500 transition-colors"><X className="h-3 w-3" /></button></Badge>}</div>}

      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {STATUS_TABS.map((tab) => {
          const count = tab === "All" ? sourceLeads.length : tab === "Assigned To Me" ? sourceLeads.filter((l) => l.assignedTo === currentUserName).length : sourceLeads.filter((l) => l.status === tab).length;
          return <button key={tab} data-testid={`tab-${tab.toLowerCase().replace(/\s+/g, "-")}`} onClick={() => setActiveTab(tab)} className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${activeTab === tab ? "bg-primary text-primary-foreground shadow-sm" : "bg-white text-slate-600 border border-gray-200 hover:bg-gray-50"}`}>{tab}<span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${activeTab === tab ? "bg-white/20 text-white" : "bg-gray-100 text-slate-500"}`}>{count}</span></button>;
        })}
      </div>

      <Card className="border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-white"><span className="text-sm font-semibold text-slate-700">{loading ? "Loading" : filteredLeads.length} {filteredLeads.length === 1 ? "lead" : "leads"}{activeFilterCount > 0 && <span className="text-muted-foreground font-normal"> matching filters</span>}</span>{filteredLeads.length > 0 && <span className="text-xs text-muted-foreground">Showing {filteredLeads.length} of {sourceLeads.length} total</span>}</div>
        <div className="overflow-x-auto"><Table><TableHeader className="bg-gray-50"><TableRow><TableHead className="w-10 pl-4"><input type="checkbox" className="rounded border-gray-300" /></TableHead><TableHead>Lead Name</TableHead><TableHead>Contact</TableHead><TableHead>Company</TableHead><TableHead>Status</TableHead><TableHead>Assigned To</TableHead><TableHead>Follow-up</TableHead><TableHead>Created</TableHead><TableHead>Amount</TableHead><TableHead className="text-right pr-4">Action</TableHead></TableRow></TableHeader><TableBody><AnimatePresence mode="popLayout">{filteredLeads.map((lead, i) => <motion.tr key={lead.id} data-testid={`row-lead-${lead.id}`} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.15, delay: i * 0.02 }} className="border-b border-gray-50 hover:bg-blue-50/30 transition-colors group"><TableCell className="pl-4 w-10"><input type="checkbox" className="rounded border-gray-300" /></TableCell><TableCell className="font-medium py-3"><Link href={`/leads/${lead.id}`} className="hover:text-primary transition-colors hover:underline text-slate-800">{lead.name}</Link><div className="text-[11px] text-muted-foreground mt-0.5">{lead.id}</div></TableCell><TableCell><div className="flex flex-col gap-0.5"><span className="text-sm flex items-center gap-1.5 text-slate-700"><Phone className="h-3 w-3 text-muted-foreground" /> {lead.phone}</span><span className="text-xs flex items-center gap-1.5 text-muted-foreground"><Mail className="h-3 w-3" /> {lead.email}</span></div></TableCell><TableCell className="text-sm text-slate-700">{lead.company}</TableCell><TableCell><StatusBadge status={lead.status} /></TableCell><TableCell><div className="flex items-center gap-1.5"><div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">{lead.assignedTo.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}</div><span className="text-sm text-slate-600">{lead.assignedTo}</span></div></TableCell><TableCell className="text-sm font-medium text-slate-700">{lead.followUpDate}</TableCell><TableCell className="text-sm text-muted-foreground">{lead.createdDate}</TableCell><TableCell className="text-sm font-semibold text-slate-700">{amountText(lead.amount)}</TableCell><TableCell className="text-right pr-4"><DropdownMenu><DropdownMenuTrigger asChild><Button data-testid={`button-action-${lead.id}`} variant="ghost" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"><MoreVertical className="h-4 w-4" /></Button></DropdownMenuTrigger><DropdownMenuContent align="end" className="w-48"><DropdownMenuLabel>Actions</DropdownMenuLabel><DropdownMenuSeparator /><DropdownMenuItem asChild><Link href={`/leads/${lead.id}`} className="flex items-center gap-2 cursor-pointer w-full"><FileEdit className="h-4 w-4" /> Open / Edit</Link></DropdownMenuItem><DropdownMenuItem className="gap-2 cursor-pointer"><Users className="h-4 w-4" /> Assign Lead</DropdownMenuItem><DropdownMenuSeparator /><DropdownMenuItem onClick={() => changeStatus(lead.id, "Won")} className="gap-2 text-green-600 cursor-pointer"><CheckCircle2 className="h-4 w-4" /> Mark as Won</DropdownMenuItem><DropdownMenuItem onClick={() => changeStatus(lead.id, "Lost")} className="gap-2 text-red-600 cursor-pointer"><XCircle className="h-4 w-4" /> Mark as Lost</DropdownMenuItem><DropdownMenuSeparator /><DropdownMenuItem onClick={() => deleteLead(lead.id)} className="gap-2 text-red-600 cursor-pointer"><Trash2 className="h-4 w-4" /> Delete Lead</DropdownMenuItem></DropdownMenuContent></DropdownMenu></TableCell></motion.tr>)}</AnimatePresence>{filteredLeads.length === 0 && <TableRow><TableCell colSpan={10} className="text-center py-16"><div className="flex flex-col items-center gap-3 text-muted-foreground"><Search className="h-10 w-10 opacity-20" /><div><p className="font-medium text-slate-600">No leads found</p><p className="text-sm mt-1">Try adjusting your filters or search term</p></div><Button variant="outline" size="sm" onClick={clearAllFilters}>Clear all filters</Button></div></TableCell></TableRow>}</TableBody></Table></div>
      </Card>
    </div>
  );
}
