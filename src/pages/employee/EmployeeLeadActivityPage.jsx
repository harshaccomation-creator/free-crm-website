import { useMemo, useState } from "react";
import { Phone, MessageCircle, Mail, CheckSquare, FileText, Clock, Filter, Plus, MoreVertical, Zap } from "lucide-react";
import EmployeeShell from "../../components/employee/EmployeeShell.jsx";
import { applyQuickActivity, createActivityPageState, defaultActivityLead, getLeadTimelineItems, quickActivityTemplates } from "../../services/activityPageAdapter.js";

const seedItems = [
  { icon: Phone, title: "Call completed", desc: "Discussed CRM plan, demo requirement and pricing.", time: "Today, 10:30 AM", user: "Jayraj", badge: "Call", color: "#16a34a" },
  { icon: MessageCircle, title: "WhatsApp sent", desc: "Shared SalesFlow brochure and next meeting details.", time: "Today, 09:15 AM", user: "Jayraj", badge: "WhatsApp", color: "#22c55e" },
  { icon: CheckSquare, title: "Follow-up task created", desc: "Schedule product demo with company admin tomorrow.", time: "Yesterday, 04:20 PM", user: "Jayraj", badge: "Task", color: "#f97316" },
  { icon: Mail, title: "Email sent", desc: "Proposal email sent with subscription options.", time: "18 May, 11:45 AM", user: "Jayraj", badge: "Email", color: "#2563eb" },
  { icon: FileText, title: "Note added", desc: "Client is interested in yearly CRM subscription.", time: "17 May, 02:05 PM", user: "Jayraj", badge: "Note", color: "#7c3aed" }
];

function pickIcon(type = "") {
  const key = String(type).toLowerCase();
  if (key.includes("call")) return Phone;
  if (key.includes("whatsapp")) return MessageCircle;
  if (key.includes("email")) return Mail;
  if (key.includes("task") || key.includes("follow")) return CheckSquare;
  if (key.includes("demo")) return Zap;
  return FileText;
}

function pickColor(type = "") {
  const key = String(type).toLowerCase();
  if (key.includes("call")) return "#16a34a";
  if (key.includes("whatsapp")) return "#22c55e";
  if (key.includes("email")) return "#2563eb";
  if (key.includes("task") || key.includes("follow")) return "#f97316";
  if (key.includes("demo")) return "#7c3aed";
  return "#7c3aed";
}

function toTimelineItem(activity) {
  const type = activity.type || activity.status || activity.badge || "Note";
  const date = activity.createdAt ? new Date(activity.createdAt) : null;
  return {
    icon: pickIcon(type),
    title: activity.title || type,
    desc: activity.description || activity.desc || activity.note || "Not assign",
    time: date && !Number.isNaN(date.getTime()) ? date.toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit", hour12: true }) : (activity.time || activity.date || "Not assign"),
    user: activity.employeeName || activity.user || "Jayraj",
    badge: activity.badge || type,
    color: activity.color || pickColor(type)
  };
}

export default function EmployeeLeadActivityPage() {
  const [workflowState, setWorkflowState] = useState(() => createActivityPageState());
  const liveItems = useMemo(() => getLeadTimelineItems(workflowState, defaultActivityLead).map(toTimelineItem), [workflowState]);
  const items = liveItems.length ? liveItems : seedItems;

  const addQuickActivity = (label) => {
    const result = applyQuickActivity(workflowState, label, { name: "Jayraj" });
    if (!Object.keys(result.errors || {}).length) setWorkflowState(result.state);
  };

  return (
    <EmployeeShell>
      <div className="space-y-5">
        <div className="flex items-center justify-between gap-4">
          <div><p className="text-xs font-bold text-orange-600 uppercase tracking-wider">Leads › Lead Activity</p><h1 className="text-3xl font-bold text-slate-900 tracking-tight mt-1">Lead Activity</h1><p className="text-sm text-slate-500 mt-1">Complete activity timeline for selected lead.</p></div>
          <button type="button" onClick={() => addQuickActivity("Add Note")} className="inline-flex items-center gap-2 px-4 h-10 rounded-xl bg-orange-500 text-white text-sm font-bold shadow-lg shadow-orange-500/20"><Plus className="w-4 h-4" />Add Activity</button>
        </div>

        <section className="rounded-2xl bg-white border border-slate-200 shadow-sm p-5">
          <div className="flex items-center gap-4"><div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 grid place-items-center font-black text-xl">P</div><div className="min-w-0 flex-1"><h2 className="text-xl font-bold text-slate-900">Priya Sharma</h2><p className="text-sm text-slate-500">Sharma Textiles · Website Lead · Owner: Jayraj</p></div><span className="px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-bold">Contacted</span></div>
        </section>

        <section className="rounded-2xl bg-white border border-slate-200 shadow-sm p-5">
          <div className="flex items-center justify-between gap-4 mb-4"><div><h2 className="text-lg font-bold text-slate-900">Activity Composer</h2><p className="text-sm text-slate-500">Add notes, calls, tasks or follow-ups.</p></div><button type="button" className="inline-flex items-center gap-2 h-9 px-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50"><Filter className="w-4 h-4" />All</button></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {Object.keys(quickActivityTemplates).map((label) => <button key={label} type="button" onClick={() => addQuickActivity(label)} className="h-11 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 font-bold hover:bg-white">{label}</button>)}
          </div>
        </section>

        <section className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100"><h2 className="text-lg font-bold text-slate-900">Timeline</h2><p className="text-sm text-slate-500 mt-1">Lead-wise activity history.</p></div>
          <div className="divide-y divide-slate-100">
            {items.map((item, index) => {
              const Icon = item.icon;
              return <div key={`${item.title}-${index}`} className="px-5 py-4 flex items-start gap-4 hover:bg-slate-50"><div className="w-11 h-11 rounded-2xl grid place-items-center shrink-0" style={{ background: `${item.color}18`, color: item.color }}><Icon className="w-5 h-5" /></div><div className="min-w-0 flex-1"><div className="flex items-center gap-2 flex-wrap"><h3 className="font-bold text-slate-900">{item.title}</h3><span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[11px] font-bold">{item.badge}</span></div><p className="text-sm text-slate-600 mt-1">{item.desc}</p><div className="flex items-center gap-3 mt-2 text-xs text-slate-500"><span className="font-semibold text-slate-700">{item.user}</span><span>•</span><Clock className="w-3 h-3" /><span>{item.time}</span></div></div><button type="button" className="w-9 h-9 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 grid place-items-center"><MoreVertical className="w-4 h-4" /></button></div>;
            })}
          </div>
        </section>
      </div>
    </EmployeeShell>
  );
}
