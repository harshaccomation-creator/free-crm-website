import { useMemo, useState } from "react";
import {
  Activity,
  Phone,
  MessageCircle,
  Calendar,
  FileText,
  Trophy,
  Filter,
  Plus,
  MoreVertical,
  PhoneOff,
  XCircle,
  Eye,
  ExternalLink,
  CalendarPlus,
  CheckCircle2,
  X
} from "lucide-react";
import EmployeeShell from "../../components/employee/EmployeeShell.jsx";
import { employeeActivities } from "../../data/employeeData.js";

const crmActivityFallback = [
  {
    id: "not-connected-1",
    type: "not-connected",
    title: "Not Connected — Motilal client",
    description: "Call not picked. Auto follow-up task should be created for 2 hours later.",
    status: "Pending",
    lead: "Motilal",
    time: "Jun 12, 04:10 PM"
  },
  {
    id: "lost-1",
    type: "lost",
    title: "Lost — Budget not approved",
    description: "Lead marked as lost after final discussion. Reason: budget not approved.",
    status: "Lost",
    lead: "Priya Sharma",
    time: "Jun 12, 05:20 PM"
  }
];

const leadIdByName = {
  "Rajesh Kumar": "1",
  "Priya Sharma": "2",
  "Aditya Mehta": "3",
  "Sunita Patel": "4",
  "Vikram Nair": "5",
  "Neha Gupta": "6",
  "Motilal": "7"
};

function normalizeType(type = "") {
  return String(type).toLowerCase();
}

function iconFor(type) {
  const key = normalizeType(type);
  if (key === "call") return Phone;
  if (key === "whatsapp") return MessageCircle;
  if (key === "email" || key === "note") return FileText;
  if (key === "task") return Calendar;
  if (key === "won") return Trophy;
  if (key === "not-connected") return PhoneOff;
  if (key === "lost") return XCircle;
  return FileText;
}

function activityTypeFor(item) {
  const key = normalizeType(item.type);
  const title = String(item.title || "").toLowerCase();
  const status = String(item.status || "").toLowerCase();

  if (key === "call" || key === "whatsapp" || key === "not-connected" || key === "lost") return "Call";
  if (key === "email" || key === "note") return "Note";
  if (key === "task" && title.includes("demo")) return "Demo";
  if (key === "task") return "Demo";
  if (key === "won" || status.includes("won")) return "Demo Done";
  return item.type || "Activity";
}

function activityTypeClass(value = "") {
  const key = value.toLowerCase();
  if (key.includes("call")) return "bg-green-50 text-green-700 border-green-100";
  if (key.includes("demo done")) return "bg-emerald-50 text-emerald-700 border-emerald-100";
  if (key.includes("demo")) return "bg-purple-50 text-purple-700 border-purple-100";
  if (key.includes("note")) return "bg-blue-50 text-blue-700 border-blue-100";
  return "bg-slate-100 text-slate-700 border-slate-200";
}

function dispositionFor(item) {
  const key = normalizeType(item.type);
  const status = String(item.status || "").toLowerCase();
  const title = String(item.title || "").toLowerCase();
  const description = String(item.description || "").toLowerCase();

  if (key === "not-connected" || status.includes("not connected") || title.includes("not connected")) return "Not Connected";
  if (key === "lost" || status.includes("lost") || title.includes("lost")) return "Not Connected";
  if (key === "call") return status.includes("missed") ? "Not Connected" : "Connected";
  if (key === "whatsapp") return "Follow Up";
  if (key === "email" || key === "note") return "Follow Up";
  if (key === "task" && (title.includes("demo") || description.includes("demo"))) return "Demo Booked";
  if (key === "task") return "Follow Up";
  if (key === "won") return "Demo Booked";
  return item.status || "-";
}

function dispositionClass(value = "") {
  const key = value.toLowerCase();
  if (key.includes("connected") && !key.includes("not")) return "bg-green-50 text-green-700 border-green-100";
  if (key.includes("follow")) return "bg-yellow-50 text-yellow-800 border-yellow-200";
  if (key.includes("demo booked")) return "bg-purple-50 text-purple-700 border-purple-100";
  if (key.includes("not connected")) return "bg-red-50 text-red-700 border-red-100";
  return "bg-slate-100 text-slate-700 border-slate-200";
}

function statusClass(status = "") {
  const key = status.toLowerCase();
  if (key.includes("pending")) return "bg-yellow-50 text-yellow-800 border-yellow-200";
  if (key.includes("booked")) return "bg-purple-50 text-purple-700 border-purple-100";
  if (key.includes("not connected")) return "bg-red-50 text-red-700 border-red-100";
  if (key.includes("lost")) return "bg-red-50 text-red-700 border-red-100";
  if (key.includes("won")) return "bg-purple-50 text-purple-700 border-purple-100";
  if (key.includes("completed")) return "bg-green-50 text-green-700 border-green-100";
  if (key.includes("sent")) return "bg-blue-50 text-blue-700 border-blue-100";
  if (key.includes("missed")) return "bg-red-50 text-red-700 border-red-100";
  if (key.includes("done")) return "bg-emerald-50 text-emerald-700 border-emerald-100";
  if (key.includes("note")) return "bg-blue-50 text-blue-700 border-blue-100";
  return "bg-slate-100 text-slate-600 border-slate-200";
}

function openLead(leadName) {
  const id = leadIdByName[leadName] || encodeURIComponent(String(leadName || "lead").toLowerCase().replaceAll(" ", "-"));
  window.history.pushState({}, "", `/leads/${id}`);
  window.dispatchEvent(new Event("salesflow:navigate"));
}

export default function EmployeeActivitiesPage() {
  const [page, setPage] = useState(1);
  const [openActionId, setOpenActionId] = useState(null);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [toast, setToast] = useState("");
  const size = 10;

  const allActivities = useMemo(() => {
    const hasNotConnected = employeeActivities.some((item) => item.status === "Not Connected" || item.type === "not-connected");
    const hasLost = employeeActivities.some((item) => item.status === "Lost" || item.type === "lost");
    return [
      ...employeeActivities,
      ...(hasNotConnected ? [] : [crmActivityFallback[0]]),
      ...(hasLost ? [] : [crmActivityFallback[1]])
    ];
  }, []);

  const stats = useMemo(() => [
    { label: "Total Activities", value: allActivities.length, icon: Activity, color: "#2563eb" },
    { label: "Contacted", value: allActivities.filter((a) => ["Call", "WhatsApp"].includes(a.type)).length, icon: Phone, color: "#16a34a" },
    { label: "Not Connected", value: allActivities.filter((a) => a.status === "Not Connected" || a.type === "not-connected").length, icon: PhoneOff, color: "#f59e0b" },
    { label: "Proposal / Demo", value: allActivities.filter((a) => a.type === "Email" || a.type === "Task").length, icon: Calendar, color: "#f97316" },
    { label: "Won", value: allActivities.filter((a) => a.status === "Won").length, icon: Trophy, color: "#7c3aed" },
    { label: "Lost", value: allActivities.filter((a) => a.status === "Lost" || a.type === "lost").length, icon: XCircle, color: "#dc2626" }
  ], [allActivities]);

  const totalPages = Math.max(1, Math.ceil(allActivities.length / size));
  const start = (page - 1) * size;
  const rows = allActivities.slice(start, start + size);

  const showToast = (message) => {
    setToast(message);
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

          <button type="button" className="inline-flex items-center gap-2 px-4 h-10 rounded-xl bg-orange-500 text-white text-sm font-bold shadow-lg shadow-orange-500/20">
            <Plus className="w-4 h-4" />
            Add Activity
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-4">
          {stats.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">{item.label}</p>
                    <h2 className="text-3xl font-bold text-slate-900 mt-2">{item.value}</h2>
                  </div>
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: `${item.color}18`, color: item.color }}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <section className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Activity Timeline</h2>
              <p className="text-sm text-slate-500 mt-1">
                Showing {allActivities.length === 0 ? 0 : start + 1}-{Math.min(start + size, allActivities.length)} of {allActivities.length}
              </p>
            </div>

            <button type="button" className="inline-flex items-center gap-2 h-9 px-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              <Filter className="w-4 h-4" />
              Filter
            </button>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-[980px]">
              <div className="grid grid-cols-[1fr_1.1fr_2.15fr_1fr_1.05fr_0.85fr_76px] gap-4 px-5 py-3 bg-slate-50 border-b border-slate-200 text-[12px] font-bold uppercase tracking-wide text-slate-500">
                <div>Activity Time</div>
                <div>Lead Name</div>
                <div>Activity</div>
                <div>Activity Type</div>
                <div>Disposition</div>
                <div>Status</div>
                <div className="text-center">Action</div>
              </div>

              <div className="divide-y divide-slate-100">
                {rows.map((item) => {
                  const activityType = activityTypeFor(item);
                  const disposition = dispositionFor(item);
                  const Icon = iconFor(item.type);

                  return (
                    <div key={item.id} className="relative grid grid-cols-[1fr_1.1fr_2.15fr_1fr_1.05fr_0.85fr_76px] gap-4 px-5 py-4 items-start hover:bg-slate-50 transition-colors">
                      <div className="text-sm text-slate-600">{item.time}</div>
                      <div className="text-sm font-semibold text-slate-700">{item.lead}</div>

                      <div className="min-w-0">
                        <div className="flex items-start gap-2">
                          <span className={`mt-0.5 w-8 h-8 rounded-xl grid place-items-center shrink-0 ${activityTypeClass(activityType)}`}>
                            <Icon className="w-4 h-4" />
                          </span>
                          <div className="min-w-0">
                            <h3 className="font-bold text-slate-900 leading-snug truncate">{item.title}</h3>
                            <p className="text-sm text-slate-600 mt-1 leading-snug line-clamp-2">{item.description}</p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <span className={`inline-flex px-2.5 py-1 rounded-full border text-[11px] font-bold capitalize ${activityTypeClass(activityType)}`}>{activityType}</span>
                      </div>

                      <div>
                        <span className={`inline-flex px-2.5 py-1 rounded-full border text-[11px] font-bold ${dispositionClass(disposition)}`}>{disposition}</span>
                      </div>

                      <div>
                        <span className={`inline-flex px-2.5 py-1 rounded-full border text-[11px] font-bold capitalize ${statusClass(item.status)}`}>{item.status}</span>
                      </div>

                      <div className="flex justify-center relative">
                        <button
                          type="button"
                          aria-label="Open activity actions"
                          onClick={() => setOpenActionId((current) => current === item.id ? null : item.id)}
                          className="w-9 h-9 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-white hover:shadow-sm grid place-items-center"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {openActionId === item.id && (
                          <div className="absolute right-0 top-10 z-50 w-44 rounded-xl border border-slate-200 bg-white shadow-2xl overflow-hidden text-left">
                            <button type="button" onClick={() => { setSelectedActivity(item); setOpenActionId(null); }} className="w-full px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                              <Eye className="w-4 h-4" /> View Activity
                            </button>
                            <button type="button" onClick={() => openLead(item.lead)} className="w-full px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                              <ExternalLink className="w-4 h-4" /> Open Lead
                            </button>
                            <button type="button" onClick={() => { showToast(`Follow-up created for ${item.lead}`); setOpenActionId(null); }} className="w-full px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                              <CalendarPlus className="w-4 h-4" /> Add Follow-up
                            </button>
                            <button type="button" onClick={() => { showToast("Activity marked done"); setOpenActionId(null); }} className="w-full px-3 py-2.5 text-sm font-semibold text-green-700 hover:bg-green-50 flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4" /> Mark Done
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

                {rows.length === 0 && <div className="px-5 py-10 text-center text-slate-500">No activities found.</div>}
              </div>
            </div>
          </div>

          <div className="px-5 py-4 border-t border-slate-100 flex items-center justify-between">
            <button type="button" disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="h-9 px-4 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 disabled:opacity-40">Previous</button>
            <span className="text-sm font-bold text-slate-600">Page {page} of {totalPages}</span>
            <button type="button" disabled={page === totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))} className="h-9 px-4 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 disabled:opacity-40">Next</button>
          </div>
        </section>

        {selectedActivity && (
          <div className="fixed inset-0 z-[9999] bg-slate-950/50 backdrop-blur-sm flex items-center justify-center p-6">
            <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-200 flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-orange-600">Activity Details</p>
                  <h2 className="text-xl font-black text-slate-900 mt-1">{selectedActivity.title}</h2>
                </div>
                <button type="button" onClick={() => setSelectedActivity(null)} className="w-10 h-10 rounded-xl bg-slate-100 text-slate-500 grid place-items-center"><X className="w-5 h-5" /></button>
              </div>
              <div className="p-6 space-y-3 text-sm text-slate-700">
                <p><b>Lead:</b> {selectedActivity.lead}</p>
                <p><b>Time:</b> {selectedActivity.time}</p>
                <p><b>Activity Type:</b> {activityTypeFor(selectedActivity)}</p>
                <p><b>Disposition:</b> {dispositionFor(selectedActivity)}</p>
                <p><b>Status:</b> {selectedActivity.status}</p>
                <p><b>Description:</b> {selectedActivity.description}</p>
              </div>
            </div>
          </div>
        )}

        {toast && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] px-4 py-3 rounded-xl bg-slate-900 text-white text-sm font-bold shadow-xl">
            {toast}
          </div>
        )}
      </div>
    </EmployeeShell>
  );
}
