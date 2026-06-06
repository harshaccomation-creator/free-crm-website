import {
  Users,
  CalendarClock,
  Trophy,
  AlertTriangle,
  Plus,
  Phone,
  MessageCircle,
  ArrowUpRight
} from "lucide-react";
import EmployeeShell from "../../components/employee/EmployeeShell.jsx";
import { employeeLeads, employeeTasks } from "../../data/employeeData.js";

const stats = [
  { label: "Assigned Leads", value: "128", change: "+12%", icon: Users, color: "#2563eb" },
  { label: "Today Follow-ups", value: "24", change: "+8", icon: CalendarClock, color: "#f97316" },
  { label: "Won Leads", value: "18", change: "+5", icon: Trophy, color: "#16a34a" },
  { label: "Overdue Leads", value: "7", change: "-3", icon: AlertTriangle, color: "#dc2626" }
];

function go(path) {
  window.history.pushState({}, "", path);
  window.dispatchEvent(new Event("salesflow:navigate"));
}

export default function EmployeeDashboardV2() {
  return (
    <EmployeeShell>
      <div className="space-y-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold text-orange-600 uppercase tracking-wider">
              Employee Workspace
            </p>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight mt-1">
              Dashboard
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Manage leads, follow-ups, tasks and daily sales activity.
            </p>
          </div>

          <button
            type="button"
            onClick={() => go("/leads")}
            className="inline-flex items-center gap-2 px-4 h-10 rounded-xl bg-orange-500 text-white text-sm font-bold shadow-lg shadow-orange-500/20"
          >
            <Plus className="w-4 h-4" />
            Add Lead
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {stats.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                      {item.label}
                    </p>
                    <h2 className="text-3xl font-bold text-slate-900 mt-2">
                      {item.value}
                    </h2>
                    <p className="text-xs font-bold text-green-600 mt-1">
                      {item.change} this week
                    </p>
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

        <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_.8fr] gap-5">
          <section className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Recent Leads</h2>
                <p className="text-sm text-slate-500 mt-1">Latest leads assigned to you.</p>
              </div>
              <button onClick={() => go("/leads")} className="text-sm font-bold text-orange-600">
                View all
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {employeeLeads.map((lead) => (
                <button
                  key={lead.id}
                  type="button"
                  onClick={() => go(`/leads/${lead.id}`)}
                  className="w-full px-5 py-4 flex items-center justify-between gap-4 text-left hover:bg-slate-50"
                >
                  <div>
                    <h3 className="font-bold text-slate-900">{lead.name}</h3>
                    <p className="text-sm text-slate-500">{lead.company}</p>
                  </div>

                  <div className="hidden md:block text-sm text-slate-600">
                    {lead.phone}
                  </div>

                  <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold">
                    {lead.status}
                  </span>
                </button>
              ))}
            </div>
          </section>

          <aside className="space-y-5">
            <section className="rounded-2xl bg-white border border-slate-200 shadow-sm p-5">
              <h2 className="text-lg font-bold text-slate-900">Quick Actions</h2>
              <p className="text-sm text-slate-500 mt-1">Fast daily actions.</p>

              <div className="grid gap-3 mt-4">
                {[
                  ["Call Lead", Phone, "#2563eb"],
                  ["WhatsApp Follow-up", MessageCircle, "#16a34a"],
                  ["Open Activities", ArrowUpRight, "#f97316"]
                ].map(([label, Icon, color]) => (
                  <button
                    key={label}
                    type="button"
                    className="h-11 rounded-xl border border-slate-200 bg-slate-50 flex items-center gap-3 px-4 text-sm font-bold text-slate-700 hover:bg-white"
                  >
                    <Icon className="w-4 h-4" style={{ color }} />
                    {label}
                  </button>
                ))}
              </div>
            </section>

            <section className="rounded-2xl bg-white border border-slate-200 shadow-sm p-5">
              <h2 className="text-lg font-bold text-slate-900">My Tasks</h2>
              <div className="space-y-3 mt-4">
                {employeeTasks.map((task) => (
                  <div key={task.id} className="rounded-xl bg-slate-50 border border-slate-100 p-3">
                    <div className="flex items-center justify-between gap-3">
                      <strong className="text-sm text-slate-900">{task.title}</strong>
                      <span className="text-[11px] font-bold text-orange-700 bg-orange-50 rounded-full px-2 py-1">
                        {task.priority}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{task.due}</p>
                  </div>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </div>
    </EmployeeShell>
  );
}
