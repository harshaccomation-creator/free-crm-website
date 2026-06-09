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
  XCircle
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

function normalizeType(type = "") {
  return String(type).toLowerCase();
}

function iconFor(type) {
  const key = normalizeType(type);
  if (key === "call") return Phone;
  if (key === "whatsapp") return MessageCircle;
  if (key === "email") return FileText;
  if (key === "task") return Calendar;
  if (key === "won") return Trophy;
  if (key === "not-connected") return PhoneOff;
  if (key === "lost") return XCircle;
  return FileText;
}

function colorFor(type) {
  const key = normalizeType(type);
  if (key === "call" || key === "whatsapp") return "#16a34a";
  if (key === "email") return "#2563eb";
  if (key === "task") return "#7c3aed";
  if (key === "won") return "#16a34a";
  if (key === "not-connected") return "#dc2626";
  if (key === "lost") return "#dc2626";
  return "#64748b";
}

function activityTypeFor(item) {
  const key = normalizeType(item.type);
  const title = String(item.title || "").toLowerCase();
  const status = String(item.status || "").toLowerCase();

  if (key === "call") return "Call";
  if (key === "whatsapp") return "Call";
  if (key === "email") return "Note";
  if (key === "task" && title.includes("demo")) return "Demo";
  if (key === "task") return "Demo";
  if (key === "won" || status.includes("won")) return "Demo Done";
  if (key === "not-connected") return "Call";
  if (key === "lost") return "Call";
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
  if (key === "email") return "Follow Up";
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

export default function EmployeeActivitiesPage() {
  const [page, setPage] = useState(1);
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

  return (
    <EmployeeShell>
      <div className="space-y-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold text-orange-600 uppercase tracking-wider">
              Employee Workspace
            </p>

            <h1 className="text-3xl font-bold text-slate-900 tracking-tight mt-1">
              Activities
            </h1>

            <p className="text-sm text-slate-500 mt-1">
              Showing 10 activities per page.
            </p>
          </div>

          <button
            type="button"
            className="inline-flex items-center gap-2 px-4 h-10 rounded-xl bg-orange-500 text-white text-sm font-bold shadow-lg shadow-orange-500/20"
          >
            <Plus className="w-4 h-4" />
            Add Activity
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-4">
          {stats.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                      {item.label}
                    </p>

                    <h2 className="text-3xl font-bold text-slate-900 mt-2">
                      {item.value}
                    </h2>
                  </div>

                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center"
                    style={{ background: `${item.color}18`, color: item.color }}
                  >
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
              <h2 className="text-lg font-bold text-slate-900">
                Activity Timeline
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Showing {allActivities.length === 0 ? 0 : start + 1}-
                {Math.min(start + size, allActivities.length)} of {allActivities.length}
              </p>
            </div>

            <button
              type="button"
              className="inline-flex items-center gap-2 h-9 px-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              <Filter className="w-4 h-4" />
              Filter
            </button>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-[1080px]">
              <div className="hidden lg:grid grid-cols-[1.05fr_1.15fr_2.1fr_1.05fr_1.2fr_0.95fr_56px] gap-4 px-5 py-3 bg-slate-50 border-b border-slate-200 text-[12px] font-bold uppercase tracking-wide text-slate-500">
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
                  const Icon = iconFor(item.type);
                  const color = colorFor(item.type);
                  const activityType = activityTypeFor(item);
                  const disposition = dispositionFor(item);

                  return (
                    <div
                      key={item.id}
                      className="grid grid-cols-1 lg:grid-cols-[1.05fr_1.15fr_2.1fr_1.05fr_1.2fr_0.95fr_56px] gap-4 px-5 py-4 items-start hover:bg-slate-50 transition-colors"
                    >
                      <div className="text-sm text-slate-600">
                        <span className="lg:hidden block text-[11px] uppercase text-slate-400 mb-1">
                          Activity Time
                        </span>
                        {item.time}
                      </div>

                      <div className="text-sm font-semibold text-slate-700">
                        <span className="lg:hidden block text-[11px] uppercase text-slate-400 mb-1">
                          Lead Name
                        </span>
                        {item.lead}
                      </div>

                      <div className="flex items-start gap-4 min-w-0">
                        <div
                          className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0"
                          style={{ background: `${color}18`, color }}
                        >
                          <Icon className="w-5 h-5" />
                        </div>

                        <div className="min-w-0">
                          <h3 className="font-bold text-slate-900">
                            {item.title}
                          </h3>

                          <p className="text-sm text-slate-600 mt-1">
                            {item.description}
                          </p>
                        </div>
                      </div>

                      <div>
                        <span className="lg:hidden block text-[11px] uppercase text-slate-400 mb-1">
                          Activity Type
                        </span>
                        <span className={`inline-flex px-2.5 py-1 rounded-full border text-[11px] font-bold ${activityTypeClass(activityType)}`}>
                          {activityType}
                        </span>
                      </div>

                      <div>
                        <span className="lg:hidden block text-[11px] uppercase text-slate-400 mb-1">
                          Disposition
                        </span>
                        <span className={`inline-flex px-2.5 py-1 rounded-full border text-[11px] font-bold ${dispositionClass(disposition)}`}>
                          {disposition}
                        </span>
                      </div>

                      <div>
                        <span className="lg:hidden block text-[11px] uppercase text-slate-400 mb-1">
                          Status
                        </span>
                        <span className={`inline-flex px-2.5 py-1 rounded-full border text-[11px] font-bold ${statusClass(item.status)}`}>
                          {item.status}
                        </span>
                      </div>

                      <div className="flex lg:justify-center">
                        <button
                          type="button"
                          className="w-9 h-9 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 grid place-items-center"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}

                {rows.length === 0 && (
                  <div className="px-5 py-10 text-center text-slate-500">
                    No activities found.
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="px-5 py-4 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="h-9 px-4 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 disabled:opacity-40"
            >
              Previous
            </button>

            <span className="text-sm font-bold text-slate-600">
              Page {page} of {totalPages}
            </span>

            <button
              type="button"
              disabled={page === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="h-9 px-4 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </section>
      </div>
    </EmployeeShell>
  );
}
