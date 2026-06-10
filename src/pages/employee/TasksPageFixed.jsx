import { useMemo, useState } from "react";
import { CheckSquare, Clock, AlertTriangle, Phone, CheckCircle2, CalendarClock, Eye, X, Filter, CalendarDays } from "lucide-react";
import EmployeeShell from "../../components/employee/EmployeeShell.jsx";
import { getTasksPageState, markWorkflowTaskDone, workflowTasksToPageTasks } from "../../services/tasksPageAdapter.js";
import { attachOwnerToRecord, filterRecordsForUser, getAccessUser } from "../../services/crmAccessControl.js";

const initialTasks = [
  { id: "task-1", title: "Follow up with Rajesh Kumar", lead: "Rajesh Kumar", type: "Follow Up", due: "Today, 3:00 PM", dateKey: "today", dueDate: "2026-06-09", status: "today", reason: "Follow-up reminder after lead discussion", note: "Call and confirm next step for proposal." },
  { id: "task-2", title: "Send proposal to Aditya Mehta", lead: "Aditya Mehta", type: "Proposal", due: "Today, 5:00 PM", dateKey: "today", dueDate: "2026-06-09", status: "today", reason: "Proposal pending after qualification", note: "Share updated CRM pricing proposal." },
  { id: "task-3", title: "Demo call with Priya Sharma", lead: "Priya Sharma", type: "Demo Schedule", due: "Tomorrow, 11:00 AM", dateKey: "tomorrow", dueDate: "2026-06-10", status: "incoming", reason: "Demo scheduled for tomorrow", note: "Prepare product demo and checklist." },
  { id: "task-4", title: "Update lead notes for Sunita Patel", lead: "Sunita Patel", type: "Note Update", due: "Jun 9, 2:00 PM", dateKey: "today", dueDate: "2026-06-09", status: "incoming", reason: "Incoming task assigned by manager", note: "Add latest discussion summary." },
  { id: "task-5", title: "Call Motilal client", lead: "Motilal", type: "Call", due: "Yesterday, 4:00 PM", dateKey: "yesterday", dueDate: "2026-06-08", status: "overdue", reason: "Call follow-up overdue from yesterday", note: "Client had e-way bill issue after login." },
  { id: "task-6", title: "Send CRM demo link", lead: "CRM Demo Lead", type: "Demo Link", due: "Yesterday, 6:00 PM", dateKey: "yesterday", dueDate: "2026-06-08", status: "overdue", reason: "Demo schedule link was not sent on time", note: "Send meeting/demo link and confirm availability." },
  { id: "task-7", title: "Update lead status", lead: "Open Lead", type: "Lead Status", due: "Yesterday, 7:00 PM", dateKey: "yesterday", dueDate: "2026-06-08", status: "overdue", reason: "Lead status update overdue after activity", note: "Update disposition and current stage." },
];

const typeFilters = [
  { label: "All", value: "all" }, { label: "Overdue", value: "overdue" }, { label: "Today", value: "today" }, { label: "Incoming", value: "incoming" }, { label: "Call", value: "call" }, { label: "Follow Up", value: "follow-up" }, { label: "Demo", value: "demo" },
];
const dateFilters = [
  { label: "All Dates", value: "all" }, { label: "Yesterday", value: "yesterday" }, { label: "Today", value: "today" }, { label: "Tomorrow", value: "tomorrow" }, { label: "Custom Range", value: "custom" },
];

function taskBadgeClass(status) { if (status === "overdue") return "bg-red-50 text-red-700 border-red-100"; if (status === "incoming") return "bg-yellow-50 text-yellow-800 border-yellow-200"; return "bg-blue-50 text-blue-700 border-blue-100"; }
function statusLabel(status) { if (status === "overdue") return "OVERDUE"; if (status === "today") return "TODAY"; if (status === "done") return "DONE"; return "UPCOMING"; }
function statusBadgeClass(status) { if (status === "overdue") return "bg-red-50 text-red-700 border-red-200"; if (status === "today") return "bg-blue-50 text-blue-700 border-blue-200"; if (status === "done") return "bg-green-50 text-green-700 border-green-200"; return "bg-yellow-50 text-yellow-800 border-yellow-200"; }
function rowClass(status) { if (status === "overdue") return "border-l-red-500 bg-gradient-to-r from-red-50/80 to-white"; if (status === "incoming") return "border-l-yellow-400 bg-gradient-to-r from-yellow-50/70 to-white"; return "border-l-transparent bg-white"; }
function filterByType(tasks, value) { if (value === "all") return tasks; if (["overdue", "today", "incoming"].includes(value)) return tasks.filter((task) => task.status === value); if (value === "call") return tasks.filter((task) => task.type.toLowerCase().includes("call")); if (value === "follow-up") return tasks.filter((task) => task.type.toLowerCase().includes("follow")); if (value === "demo") return tasks.filter((task) => task.type.toLowerCase().includes("demo")); return tasks; }
function filterTasks(tasks, typeFilter, dateFilter, customFromDate, customToDate) { let rows = filterByType(tasks, typeFilter); if (dateFilter === "all") return rows; if (dateFilter === "custom") { if (!customFromDate && !customToDate) return rows; return rows.filter((task) => { if (customFromDate && task.dueDate < customFromDate) return false; if (customToDate && task.dueDate > customToDate) return false; return true; }); } return rows.filter((task) => task.dateKey === dateFilter); }
function ensureTaskOwner(task, accessUser) {
  if (task.ownerId || task.assignedToId || task.createdById || task.ownerEmail) return task;
  return attachOwnerToRecord(task, accessUser);
}
function buildVisibleTasks(state, accessUser) {
  const rows = workflowTasksToPageTasks(state, initialTasks).map((task) => ensureTaskOwner(task, accessUser));
  return filterRecordsForUser(rows, accessUser);
}

export default function TasksPageFixed() {
  const accessUser = useMemo(() => getAccessUser(), []);
  const [workflowState, setWorkflowState] = useState(() => getTasksPageState());
  const [tasks, setTasks] = useState(() => buildVisibleTasks(getTasksPageState(), accessUser));
  const [selectedTask, setSelectedTask] = useState(null);
  const [typeFilter, setTypeFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [customFromDate, setCustomFromDate] = useState("");
  const [customToDate, setCustomToDate] = useState("");

  const stats = useMemo(() => [
    { label: "Today Tasks", value: tasks.filter((task) => task.status === "today").length, icon: CheckSquare, color: "#2563eb" },
    { label: "Overdue", value: tasks.filter((task) => task.status === "overdue").length, icon: AlertTriangle, color: "#dc2626" },
    { label: "Calls", value: tasks.filter((task) => task.type.toLowerCase().includes("call")).length, icon: Phone, color: "#16a34a" },
    { label: "Total Tasks", value: tasks.length, icon: Clock, color: "#f97316" },
  ], [tasks]);

  const filteredTasks = useMemo(() => {
    const order = { overdue: 1, today: 2, incoming: 3 };
    return filterTasks(tasks, typeFilter, dateFilter, customFromDate, customToDate).sort((a, b) => (order[a.status] || 4) - (order[b.status] || 4));
  }, [tasks, typeFilter, dateFilter, customFromDate, customToDate]);

  const syncTasks = (nextState) => setTasks(buildVisibleTasks(nextState, accessUser));
  const markDone = (taskId) => {
    const nextState = markWorkflowTaskDone(workflowState, taskId);
    setWorkflowState(nextState);
    syncTasks(nextState);
    setSelectedTask((prev) => (prev?.id === taskId ? null : prev));
  };

  const resetFilters = () => { setTypeFilter("all"); setDateFilter("all"); setCustomFromDate(""); setCustomToDate(""); };

  return (
    <EmployeeShell>
      <div className="space-y-6">
        <div><h1 className="text-4xl font-black text-slate-900 tracking-tight">Tasks</h1><p className="text-lg text-slate-500 mt-2">Track follow-ups, calls, demo schedules and pending actions.</p></div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {stats.map((item) => { const Icon = item.icon; return <div key={item.label} className="rounded-xl bg-white border border-slate-200 p-5 shadow-sm"><div className="flex items-center justify-between"><div><p className="text-xs font-black text-slate-500 uppercase tracking-wide">{item.label}</p><h2 className="text-3xl font-black text-slate-900 mt-2">{item.value}</h2></div><div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: `${item.color}18`, color: item.color }}><Icon className="w-5 h-5" /></div></div></div>; })}
        </div>

        <section className="rounded-xl bg-white border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-200 space-y-4">
            <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4"><div><h2 className="text-xl font-black text-slate-900">All Tasks</h2><p className="text-sm text-slate-500 mt-1">Showing {filteredTasks.length} of {tasks.length} pending tasks.</p></div><button type="button" onClick={resetFilters} className="h-10 px-4 rounded-xl border border-slate-200 text-slate-700 font-black text-sm hover:bg-slate-50">Reset Filter</button></div>
            <div className={`grid grid-cols-1 ${dateFilter === "custom" ? "md:grid-cols-4" : "md:grid-cols-2"} gap-4`}>
              <label className="space-y-2"><span className="inline-flex items-center gap-2 text-sm font-black text-slate-600"><Filter className="w-4 h-4 text-orange-600" />Type / Status</span><select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)} className="w-full h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-orange-500/20">{typeFilters.map((filter) => <option key={filter.value} value={filter.value}>{filter.label}</option>)}</select></label>
              <label className="space-y-2"><span className="inline-flex items-center gap-2 text-sm font-black text-slate-600"><CalendarDays className="w-4 h-4 text-orange-600" />Date</span><select value={dateFilter} onChange={(event) => { const value = event.target.value; setDateFilter(value); if (value !== "custom") { setCustomFromDate(""); setCustomToDate(""); } }} className="w-full h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-orange-500/20">{dateFilters.map((filter) => <option key={filter.value} value={filter.value}>{filter.label}</option>)}</select></label>
              {dateFilter === "custom" && <><label className="space-y-2"><span className="inline-flex items-center gap-2 text-sm font-black text-slate-600"><CalendarClock className="w-4 h-4 text-orange-600" />From Date</span><input type="date" value={customFromDate} onChange={(event) => setCustomFromDate(event.target.value)} className="w-full h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-orange-500/20" /></label><label className="space-y-2"><span className="inline-flex items-center gap-2 text-sm font-black text-slate-600"><CalendarClock className="w-4 h-4 text-orange-600" />To Date</span><input type="date" value={customToDate} onChange={(event) => setCustomToDate(event.target.value)} className="w-full h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-orange-500/20" /></label></>}
            </div>
          </div>

          <div className="overflow-x-auto"><div className="min-w-[1180px]"><div className="grid grid-cols-[1.55fr_130px_130px_190px_1.65fr_112px] gap-4 px-6 py-4 bg-slate-50 border-b border-slate-200 text-xs font-black uppercase tracking-wide text-slate-500"><div>Task</div><div>Type</div><div>Status</div><div>Due</div><div>Reason</div><div>Action</div></div>
            <div className="divide-y divide-slate-200">
              {filteredTasks.map((task) => <div key={task.id} onClick={() => setSelectedTask(task)} className={`grid grid-cols-[1.55fr_130px_130px_190px_1.65fr_112px] gap-4 px-6 py-5 items-center border-l-4 cursor-pointer hover:bg-slate-50 transition-colors ${rowClass(task.status)}`}><div className="min-w-0"><h3 className="font-black text-slate-900 text-[15px] leading-snug">{task.title}</h3><p className="text-sm text-slate-500 mt-1">Lead: {task.lead}</p></div><div><span className={`inline-flex items-center justify-center min-w-[92px] max-w-[118px] px-3 py-1.5 rounded-full border text-[11px] font-black text-center leading-tight ${taskBadgeClass(task.status)}`}>{task.type}</span></div><div><span className={`inline-flex items-center justify-center min-w-[94px] px-3 py-1.5 rounded-full border text-[11px] font-black tracking-wide ${statusBadgeClass(task.status)}`}>{statusLabel(task.status)}</span></div><div className={`text-sm font-black whitespace-nowrap ${task.status === "overdue" ? "text-red-700" : "text-slate-700"}`}><span className="inline-flex items-center gap-2"><CalendarClock className={`w-4 h-4 ${task.status === "overdue" ? "text-red-500" : "text-slate-400"}`} />{task.due}</span></div><div className={`text-sm leading-snug max-w-[360px] ${task.status === "overdue" ? "text-red-600 font-bold" : "text-slate-600"}`}>{task.reason}</div><div><div className="flex items-center gap-2" onClick={(event) => event.stopPropagation()}><button type="button" title="Open Task" aria-label="Open Task" onClick={() => setSelectedTask(task)} className="w-9 h-9 rounded-xl border border-slate-200 text-slate-700 inline-flex items-center justify-center hover:bg-slate-50 hover:text-blue-600 transition-colors"><Eye className="w-4 h-4" /></button><button type="button" title="Mark Done" aria-label="Mark Done" onClick={() => markDone(task.id)} className="w-9 h-9 rounded-xl bg-green-50 text-green-700 inline-flex items-center justify-center hover:bg-green-100 transition-colors"><CheckCircle2 className="w-4 h-4" /></button></div></div></div>)}
              {filteredTasks.length === 0 && <div className="px-6 py-12 text-center text-slate-500">No tasks found for selected filters.</div>}
            </div></div></div>
        </section>

        {selectedTask && <div className="fixed inset-0 z-[9999] bg-slate-950/50 backdrop-blur-sm flex items-center justify-center p-6"><div className="w-full max-w-xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden"><div className="px-6 py-5 border-b border-slate-200 flex items-start justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-widest text-orange-600">Task Details</p><h2 className="text-2xl font-black text-slate-900 mt-1">{selectedTask.title}</h2></div><button type="button" onClick={() => setSelectedTask(null)} className="w-10 h-10 rounded-xl bg-slate-100 text-slate-500 grid place-items-center"><X className="w-5 h-5" /></button></div><div className="p-6 space-y-4"><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div className="rounded-xl bg-slate-50 p-4"><p className="text-xs font-black uppercase text-slate-500">Lead</p><p className="font-bold text-slate-900 mt-1">{selectedTask.lead}</p></div><div className="rounded-xl bg-slate-50 p-4"><p className="text-xs font-black uppercase text-slate-500">Type</p><p className="font-bold text-slate-900 mt-1">{selectedTask.type}</p></div><div className="rounded-xl bg-slate-50 p-4"><p className="text-xs font-black uppercase text-slate-500">Due</p><p className="font-bold text-slate-900 mt-1">{selectedTask.due}</p></div><div className="rounded-xl bg-slate-50 p-4"><p className="text-xs font-black uppercase text-slate-500">Status</p><p className={`inline-flex mt-1 px-3 py-1 rounded-full border text-xs font-black ${statusBadgeClass(selectedTask.status)}`}>{statusLabel(selectedTask.status)}</p></div></div><div className="rounded-xl bg-orange-50 border border-orange-100 p-4"><p className="text-xs font-black uppercase text-orange-700">Why this task?</p><p className="font-bold text-slate-900 mt-1">{selectedTask.reason}</p><p className="text-sm text-slate-600 mt-2">{selectedTask.note}</p></div></div><div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-3"><button type="button" onClick={() => setSelectedTask(null)} className="h-10 px-4 rounded-xl border border-slate-200 text-slate-700 font-bold">Close</button><button type="button" onClick={() => markDone(selectedTask.id)} className="h-10 px-4 rounded-xl bg-green-600 text-white font-bold">Mark Done</button></div></div></div>}
      </div>
    </EmployeeShell>
  );
}
