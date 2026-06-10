import { useMemo, useState } from "react";
import { Phone, MessageCircle, Mail, CheckSquare, FileText, Clock, Filter, Plus, MoreVertical, Zap } from "lucide-react";
import EmployeeShell from "../../components/employee/EmployeeShell.jsx";
import { applyQuickActivity, createActivityPageState, defaultActivityLead, getLeadTimelineItems, quickActivityTemplates } from "../../services/activityPageAdapter.js";
import { canAccessRecord, getAccessUser } from "../../services/crmAccessControl.js";

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
    desc: activity.description || activity.desc || activity.note || "Not assigned",
    time: date && !Number.isNaN(date.getTime()) ? date.toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit", hour12: true }) : (activity.time || activity.date || "Not assigned"),
    user: activity.employeeName || activity.ownerName || activity.createdBy || activity.user || "Not assigned",
    badge: activity.badge || type,
    color: activity.color || pickColor(type),
  };
}

function getVisibleLead(accessUser) {
  const lead = {
    ...defaultActivityLead,
    ownerId: defaultActivityLead.ownerId || defaultActivityLead.assignedToId || accessUser.id,
    ownerName: defaultActivityLead.ownerName || accessUser.name,
    ownerEmail: defaultActivityLead.ownerEmail || accessUser.email,
    companyId: defaultActivityLead.companyId || accessUser.companyId,
  };
  return canAccessRecord(lead, accessUser) ? lead : null;
}

export default function EmployeeLeadActivityPage() {
  const accessUser = useMemo(() => getAccessUser(), []);
  const visibleLead = useMemo(() => getVisibleLead(accessUser), [accessUser]);
  const [workflowState, setWorkflowState] = useState(() => createActivityPageState());

  const liveItems = useMemo(() => {
    if (!visibleLead) return [];
    return getLeadTimelineItems(workflowState, visibleLead)
      .filter((activity) => canAccessRecord({ ...activity, companyId: activity.companyId || visibleLead.companyId, ownerId: activity.ownerId || activity.createdById || visibleLead.ownerId, ownerName: activity.ownerName || activity.employeeName || visibleLead.ownerName }, accessUser))
      .map(toTimelineItem);
  }, [workflowState, visibleLead, accessUser]);

  const addQuickActivity = (label) => {
    if (!visibleLead) return;
    const result = applyQuickActivity(workflowState, label, {
      id: accessUser.id,
      name: accessUser.name,
      email: accessUser.email,
      companyId: accessUser.companyId,
    });
    if (!Object.keys(result.errors || {}).length) setWorkflowState(result.state);
  };

  return (
    <EmployeeShell>
      <div className="space-y-5">
        <div className="flex items-center justify-between gap-4">
          <div><p className="text-xs font-bold text-orange-600 uppercase tracking-wider">Leads › Lead Activity</p><h1 className="text-3xl font-bold text-slate-900 tracking-tight mt-1">Lead Activity</h1><p className="text-sm text-slate-500 mt-1">Complete activity timeline for selected lead.</p></div>
          <button type="button" disabled={!visibleLead} onClick={() => addQuickActivity("Add Note")} className="inline-flex items-center gap-2 px-4 h-10 rounded-xl bg-orange-500 text-white text-sm font-bold shadow-lg shadow-orange-500/20 disabled:opacity-50 disabled:cursor-not-allowed"><Plus className="w-4 h-4" />Add Activity</button>
        </div>

        {visibleLead ? (
          <section className="rounded-2xl bg-white border border-slate-200 shadow-sm p-5">
            <div className="flex items-center gap-4"><div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 grid place-items-center font-black text-xl">{String(visibleLead.name || "L").slice(0, 1).toUpperCase()}</div><div className="min-w-0 flex-1"><h2 className="text-xl font-bold text-slate-900">{visibleLead.name}</h2><p className="text-sm text-slate-500">{visibleLead.company || "Not assigned"} · {visibleLead.source || "Lead"} · Owner: {visibleLead.ownerName || accessUser.name}</p></div><span className="px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-bold">{visibleLead.status || "Contacted"}</span></div>
          </section>
        ) : (
          <section className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6 text-center text-slate-500 font-bold">No accessible lead selected.</section>
        )}

        <section className="rounded-2xl bg-white border border-slate-200 shadow-sm p-5">
          <div className="flex items-center justify-between gap-4 mb-4"><div><h2 className="text-lg font-bold text-slate-900">Activity Composer</h2><p className="text-sm text-slate-500">Add notes, calls, tasks or follow-ups.</p></div><button type="button" className="inline-flex items-center gap-2 h-9 px-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50"><Filter className="w-4 h-4" />All</button></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {Object.keys(quickActivityTemplates).map((label) => <button key={label} type="button" disabled={!visibleLead} onClick={() => addQuickActivity(label)} className="h-11 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 font-bold hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed">{label}</button>)}
          </div>
        </section>

        <section className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100"><h2 className="text-lg font-bold text-slate-900">Timeline</h2><p className="text-sm text-slate-500 mt-1">Lead-wise activity history.</p></div>
          <div className="divide-y divide-slate-100">
            {liveItems.map((item, index) => {
              const Icon = item.icon;
              return <div key={`${item.title}-${index}`} className="px-5 py-4 flex items-start gap-4 hover:bg-slate-50"><div className="w-11 h-11 rounded-2xl grid place-items-center shrink-0" style={{ background: `${item.color}18`, color: item.color }}><Icon className="w-5 h-5" /></div><div className="min-w-0 flex-1"><div className="flex items-center gap-2 flex-wrap"><h3 className="font-bold text-slate-900">{item.title}</h3><span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[11px] font-bold">{item.badge}</span></div><p className="text-sm text-slate-600 mt-1">{item.desc}</p><div className="flex items-center gap-3 mt-2 text-xs text-slate-500"><span className="font-semibold text-slate-700">{item.user}</span><span>•</span><Clock className="w-3 h-3" /><span>{item.time}</span></div></div><button type="button" className="w-9 h-9 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 grid place-items-center"><MoreVertical className="w-4 h-4" /></button></div>;
            })}
            {liveItems.length === 0 && <div className="px-5 py-12 text-center text-slate-500 font-bold">No accessible activity found.</div>}
          </div>
        </section>
      </div>
    </EmployeeShell>
  );
}
