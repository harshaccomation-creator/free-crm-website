import {
  Users,
  CalendarClock,
  Trophy,
  AlertTriangle,
  Plus,
  Phone,
  MessageCircle,
  ArrowUpRight,
  BarChart3,
  TrendingUp,
  Clock,
  CheckCircle2
} from "lucide-react";
import EmployeeShell from "../../components/employee/EmployeeShell.jsx";
import { empLeads, empTasks, empActivities } from "../../data/employeeData.js";

function go(path) {
  window.history.pushState({}, "", path);
  window.dispatchEvent(new Event("salesflow:navigate"));
}

function MiniSpark({ color = "#2563eb" }) {
  return (
    <svg width="86" height="34" viewBox="0 0 86 34" fill="none">
      <path
        d="M2 27 C12 20, 18 22, 27 15 C36 7, 45 12, 53 17 C62 23, 70 9, 84 5"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M2 27 C12 20, 18 22, 27 15 C36 7, 45 12, 53 17 C62 23, 70 9, 84 5 V34 H2 Z"
        fill={color}
        opacity=".08"
      />
    </svg>
  );
}

const stats = [
  {
    label: "Assigned Leads",
    value: empLeads.length,
    change: "+12%",
    helper: "vs last week",
    icon: Users,
    color: "#2563eb"
  },
  {
    label: "Today Follow-ups",
    value: empTasks.filter((t) => t.status !== "Done").length,
    change: "+8",
    helper: "pending today",
    icon: CalendarClock,
    color: "#f97316"
  },
  {
    label: "Won Leads",
    value: empLeads.filter((l) => l.status === "Won").length,
    change: "+5",
    helper: "closed deals",
    icon: Trophy,
    color: "#16a34a"
  },
  {
    label: "Overdue Leads",
    value: empLeads.filter((l) => l.status === "Overdue").length,
    change: "-3",
    helper: "needs action",
    icon: AlertTriangle,
    color: "#dc2626"
  }
];

const pipeline = [
  ["New", empLeads.filter((l) => l.status === "New").length, "#2563eb"],
  ["Contacted", empLeads.filter((l) => l.status === "Contacted").length, "#16a34a"],
  ["Demo", empLeads.filter((l) => l.status === "Demo Done").length, "#f97316"],
  ["Won", empLeads.filter((l) => l.status === "Won").length, "#7c3aed"],
  ["Overdue", empLeads.filter((l) => l.status === "Overdue").length, "#dc2626"]
];

export default function EmployeeDashboardV2() {
  const recentLeads = empLeads.slice(0, 5);
  const pendingTasks = empTasks.filter((task) => task.status !== "Done").slice(0, 4);
  const recentActivities = empActivities.slice(0, 4);

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
              Track leads, follow-ups, performance and daily sales activity.
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
              <article
                key={item.label}
                className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                      {item.label}
                    </p>
                    <h2 className="text-3xl font-bold text-slate-900 mt-3">
                      {item.value}
                    </h2>
                    <p className="text-xs font-bold text-green-600 mt-2">
                      {item.change} <span className="text-slate-400">{item.helper}</span>
                    </p>
                  </div>

                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                    style={{ background: `${item.color}18`, color: item.color }}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                <div className="mt-4">
                  <MiniSpark color={item.color} />
                </div>
              </article>
            );
          })}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1.3fr_.7fr] gap-5">
          <section className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Recent Leads</h2>
                <p className="text-sm text-slate-500 mt-1">Latest leads assigned to you.</p>
              </div>

              <button
                type="button"
                onClick={() => go("/leads")}
                className="text-sm font-bold text-orange-600"
              >
                View all
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {recentLeads.map((lead) => (
                <button
                  key={lead.id}
                  type="button"
                  onClick={() => go(`/leads/${lead.id}`)}
                  className="w-full px-5 py-4 grid grid-cols-[1fr_150px_110px_90px] items-center gap-4 text-left hover:bg-slate-50"
                >
                  <div>
                    <h3 className="font-bold text-slate-900">{lead.name}</h3>
                    <p className="text-sm text-slate-500">{lead.company}</p>
                  </div>

                  <div className="text-sm text-slate-600 hidden md:block">
                    {lead.phone}
                  </div>

                  <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold text-center">
                    {lead.status}
                  </span>

                  <strong className="text-sm text-slate-900 text-right">
                    ₹{lead.value.toLocaleString("en-IN")}
                  </strong>
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-2xl bg-white border border-slate-200 shadow-sm p-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Pipeline</h2>
                <p className="text-sm text-slate-500 mt-1">Lead status split.</p>
              </div>
              <BarChart3 className="w-5 h-5 text-orange-500" />
            </div>

            <div className="space-y-4 mt-6">
              {pipeline.map(([label, value, color]) => {
                const width = Math.max(10, (value / empLeads.length) * 100);

                return (
                  <div key={label}>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="font-bold text-slate-700">{label}</span>
                      <span className="text-slate-500">{value}</span>
                    </div>
                    <div className="h-3 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${width}%`, background: color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[.95fr_1.05fr] gap-5">
          <section className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">My Tasks</h2>
                <p className="text-sm text-slate-500 mt-1">Priority tasks for your day.</p>
              </div>
              <Clock className="w-5 h-5 text-orange-500" />
            </div>

            <div className="divide-y divide-slate-100">
              {pendingTasks.map((task) => (
                <div key={task.id} className="px-5 py-4 flex items-center justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-slate-900">{task.title}</h3>
                    <p className="text-sm text-slate-500 mt-1">
                      {task.lead} · {task.due}
                    </p>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      task.priority === "High"
                        ? "bg-red-50 text-red-700"
                        : task.priority === "Medium"
                        ? "bg-orange-50 text-orange-700"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {task.priority}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Recent Activity</h2>
                <p className="text-sm text-slate-500 mt-1">Latest CRM movement.</p>
              </div>
              <TrendingUp className="w-5 h-5 text-orange-500" />
            </div>

            <div className="divide-y divide-slate-100">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="px-5 py-4 flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 grid place-items-center text-lg">
                    {activity.icon}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-slate-900">{activity.title}</h3>
                    <p className="text-sm text-slate-500 mt-1">{activity.desc}</p>
                    <p className="text-xs text-slate-400 mt-2">{activity.date}</p>
                  </div>

                  <span className="px-2 py-1 rounded-full bg-slate-100 text-slate-600 text-[11px] font-bold">
                    {activity.status}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>

        <section className="rounded-2xl bg-white border border-slate-200 shadow-sm p-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Quick Actions</h2>
              <p className="text-sm text-slate-500 mt-1">Start your next sales action quickly.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-5">
            {[
              ["Call Lead", Phone, "#2563eb", "/leads"],
              ["WhatsApp Follow-up", MessageCircle, "#16a34a", "/leads"],
              ["Open Activities", ArrowUpRight, "#f97316", "/employee/activities"],
              ["Mark Task Done", CheckCircle2, "#7c3aed", "/employee/tasks"]
            ].map(([label, Icon, color, path]) => (
              <button
                key={label}
                type="button"
                onClick={() => go(path)}
                className="h-12 rounded-xl border border-slate-200 bg-slate-50 flex items-center gap-3 px-4 text-sm font-bold text-slate-700 hover:bg-white"
              >
                <Icon className="w-4 h-4" style={{ color }} />
                {label}
              </button>
            ))}
          </div>
        </section>
      </div>
    </EmployeeShell>
  );
}
