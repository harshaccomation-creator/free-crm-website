import { useEffect, useMemo, useState } from "react";
import { BarChart2, TrendingUp, Users, Trophy, Activity, Download, Loader2 } from "lucide-react";
import EmployeeShell from "../../components/employee/EmployeeShell.jsx";
import ReportsDateFilter from "../../components/employee/ReportsDateFilter.jsx";
import { listLeads, listMyActivities, listMyTasks } from "../../services/crmApi.js";
import { downloadCsv, rowsToCsv } from "../../services/exportService.js";

function norm(value = "") { return String(value || "").trim().toLowerCase(); }
function toPercent(count, total) { if (!total) return "0%"; return `${Math.round((count / total) * 100)}%`; }
function isWon(lead = {}) { return norm(lead.status) === "won"; }
function isDemo(lead = {}) { return [lead.status, lead.stage, lead.type].some((value) => norm(value).includes("demo")); }
function isContacted(lead = {}) { return [lead.status, lead.stage].some((value) => ["contacted", "demo", "demo done", "won"].includes(norm(value)) || norm(value).includes("follow")); }
function isNew(lead = {}) { const status = norm(lead.status || "new"); return status === "new" || status === "assigned" || status === "open"; }
function activityType(activity = {}) { const text = `${activity.type || ""} ${activity.title || ""} ${activity.description || ""} ${activity.note || ""}`.toLowerCase(); if (text.includes("whatsapp") || text.includes("whats app")) return "WhatsApp"; if (text.includes("email") || text.includes("mail")) return "Emails"; if (text.includes("note")) return "Notes"; if (text.includes("call") || text.includes("connected") || text.includes("not connected")) return "Calls"; return "Other"; }
function reportRows(leads = [], activities = [], tasks = []) { return [...leads.map((lead) => ({ type: "Lead", name: lead.name, company: lead.company, status: lead.status, owner: lead.owner?.full_name || lead.ownerName || lead.owner_id || lead.created_by, date: lead.created_at || lead.updated_at })), ...activities.map((activity) => ({ type: "Activity", name: activity.lead?.name || activity.leadName || activity.lead_id, company: activity.lead?.company || activity.company, status: activity.type || activity.title, owner: activity.user?.full_name || activity.user_id, date: activity.activity_at || activity.created_at })), ...tasks.map((task) => ({ type: "Task", name: task.lead?.name || task.leadName || task.lead_id, company: task.lead?.company || task.company, status: task.status || task.type, owner: task.owner?.full_name || task.owner_id, date: task.due_at || task.created_at }))]; }

export default function EmployeeReportsPage() {
  const [leads, setLeads] = useState([]);
  const [activities, setActivities] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadReports() {
    setLoading(true); setError("");
    try {
      const [leadRows, activityRows, taskRows] = await Promise.all([listLeads({ limit: 500 }), listMyActivities({ limit: 500 }), listMyTasks({ limit: 500 })]);
      setLeads(leadRows || []);
      setActivities(activityRows || []);
      setTasks(taskRows || []);
    } catch (err) {
      setLeads([]); setActivities([]); setTasks([]); setError(err.message || "Unable to load Supabase reports.");
    } finally { setLoading(false); }
  }

  useEffect(() => { loadReports(); }, []);

  const wonDeals = leads.filter(isWon).length;
  const totalLeads = leads.length;
  const totalActivities = activities.length;
  const leadGrowth = totalLeads ? `+${Math.min(100, Math.round((tasks.length / Math.max(totalLeads, 1)) * 100))}%` : "0%";
  const stats = [{ label: "Lead Growth", value: leadGrowth, icon: TrendingUp, color: "#16a34a" }, { label: "Total Leads", value: totalLeads, icon: Users, color: "#2563eb" }, { label: "Won Deals", value: wonDeals, icon: Trophy, color: "#f97316" }, { label: "Activities", value: totalActivities, icon: Activity, color: "#7c3aed" }];
  const performance = [["New", toPercent(leads.filter(isNew).length, totalLeads)], ["Contacted", toPercent(leads.filter(isContacted).length, totalLeads)], ["Demo", toPercent(leads.filter(isDemo).length, totalLeads)], ["Won", toPercent(wonDeals, totalLeads)]];
  const activitySummary = ["Calls", "WhatsApp", "Emails", "Notes"].map((label) => [label, activities.filter((activity) => activityType(activity) === label).length]);
  const handleExport = () => { const csv = rowsToCsv(reportRows(leads, activities, tasks), [{ key: "type", label: "Type" }, { key: "name", label: "Lead/Item" }, { key: "company", label: "Company" }, { key: "status", label: "Status" }, { key: "owner", label: "Owner" }, { key: "date", label: "Date" }]); downloadCsv("employee-reports.csv", csv); };

  return <EmployeeShell><div className="space-y-5"><div className="flex flex-col xl:flex-row xl:items-end xl:justify-between gap-4"><div><p className="text-xs font-bold text-orange-600 uppercase tracking-wider">Employee Workspace</p><h1 className="text-3xl font-bold text-slate-900 tracking-tight mt-1">Reports</h1><p className="text-sm text-slate-500 mt-1">Your sales performance and activity reports from Supabase data only.</p></div><div className="flex flex-col sm:flex-row gap-3 sm:items-center"><ReportsDateFilter /><button type="button" onClick={handleExport} disabled={!leads.length && !activities.length && !tasks.length} className="inline-flex items-center justify-center gap-2 h-10 px-4 rounded-xl bg-orange-500 text-white text-sm font-bold shadow-lg shadow-orange-500/20 disabled:opacity-50 disabled:cursor-not-allowed"><Download className="w-4 h-4" /> Export</button></div></div>{error ? <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">{error}</div> : null}{loading ? <div className="rounded-2xl bg-white border border-slate-200 p-8 text-center text-slate-500"><Loader2 className="w-5 h-5 animate-spin inline mr-2" />Loading Supabase reports...</div> : null}<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">{stats.map((item) => { const Icon = item.icon; return <div key={item.label} className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm"><div className="flex items-center justify-between"><div><p className="text-xs font-bold text-slate-500 uppercase tracking-wide">{item.label}</p><h2 className="text-3xl font-bold text-slate-900 mt-2">{loading ? "..." : item.value}</h2></div><div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: `${item.color}18`, color: item.color }}><Icon className="w-5 h-5" /></div></div></div>; })}</div><div className="grid grid-cols-1 xl:grid-cols-2 gap-5"><section className="rounded-2xl bg-white border border-slate-200 shadow-sm p-5"><div className="flex items-center justify-between"><div><h2 className="text-lg font-bold text-slate-900">Lead Performance</h2><p className="text-sm text-slate-500 mt-1">Lead movement based on Supabase records.</p></div><BarChart2 className="w-5 h-5 text-orange-500" /></div><div className="mt-6 space-y-4">{performance.map((item) => <div key={item[0]}><div className="flex items-center justify-between text-sm mb-2"><span className="font-bold text-slate-700">{item[0]}</span><span className="text-slate-500">{item[1]}</span></div><div className="h-3 rounded-full bg-slate-100 overflow-hidden"><div className="h-full rounded-full bg-orange-500" style={{ width: item[1] }} /></div></div>)}</div></section><section className="rounded-2xl bg-white border border-slate-200 shadow-sm p-5"><h2 className="text-lg font-bold text-slate-900">Activity Summary</h2><p className="text-sm text-slate-500 mt-1">Calls, WhatsApp, emails and notes from Supabase activities.</p><div className="grid grid-cols-2 gap-4 mt-6">{activitySummary.map((item) => <div key={item[0]} className="rounded-2xl bg-slate-50 border border-slate-100 p-4"><p className="text-xs font-bold text-slate-500 uppercase">{item[0]}</p><h3 className="text-2xl font-bold text-slate-900 mt-2">{item[1]}</h3></div>)}</div></section></div></div></EmployeeShell>;
}
