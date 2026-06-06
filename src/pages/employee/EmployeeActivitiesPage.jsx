import {
  Activity,
  Phone,
  MessageCircle,
  Calendar,
  FileText,
  Trophy,
  Filter,
  Plus,
  MoreVertical
} from "lucide-react";
import EmployeeShell from "../../components/employee/EmployeeShell.jsx";
import { employeeActivities } from "../../data/employeeData.js";

const stats = [
  { label: "Total Activities", value: "128", icon: Activity, color: "#2563eb" },
  { label: "Contacted", value: "42", icon: Phone, color: "#16a34a" },
  { label: "Proposal / Demo", value: "18", icon: Calendar, color: "#f97316" },
  { label: "Won", value: "9", icon: Trophy, color: "#7c3aed" }
];

function iconFor(type) {
  if (type === "call") return Phone;
  if (type === "whatsapp") return MessageCircle;
  if (type === "demo") return Calendar;
  if (type === "won") return Trophy;
  return FileText;
}

function colorFor(type) {
  if (type === "call") return "#16a34a";
  if (type === "whatsapp") return "#22c55e";
  if (type === "demo") return "#f97316";
  if (type === "won") return "#7c3aed";
  return "#2563eb";
}

export default function EmployeeActivitiesPage() {
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
              Track lead movement, calls, notes, demos and won updates.
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

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
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

        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Activity Timeline
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Latest CRM activity from your assigned leads.
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

          <div className="divide-y divide-slate-100">
            {employeeActivities.map((item) => {
              const Icon = iconFor(item.type);
              const color = colorFor(item.type);

              return (
                <div
                  key={item.id}
                  className="px-5 py-4 flex items-start gap-4 hover:bg-slate-50 transition-colors"
                >
                  <div
                    className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0"
                    style={{ background: `${color}18`, color }}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-slate-900">
                        {item.title}
                      </h3>
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[11px] font-bold">
                        {item.status}
                      </span>
                    </div>

                    <p className="text-sm text-slate-600 mt-1">
                      {item.description}
                    </p>

                    <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                      <span className="font-semibold text-slate-700">
                        {item.lead}
                      </span>
                      <span>•</span>
                      <span>{item.time}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="w-9 h-9 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 grid place-items-center"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </EmployeeShell>
  );
}
