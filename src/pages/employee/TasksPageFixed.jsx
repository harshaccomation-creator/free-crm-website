import { CheckSquare, Clock, AlertTriangle, Phone, CheckCircle2 } from "lucide-react";
import EmployeeShell from "../../components/employee/EmployeeShell.jsx";
import { employeeTasks } from "../../data/employeeData.js";

const stats = [
  { label: "Today Tasks", value: "12", icon: CheckSquare, color: "#2563eb" },
  { label: "Overdue", value: "4", icon: AlertTriangle, color: "#dc2626" },
  { label: "Calls", value: "8", icon: Phone, color: "#16a34a" },
  { label: "Total Tasks", value: "36", icon: Clock, color: "#f97316" }
];

export default function TasksPageFixed() {
  return (
    <EmployeeShell>
      <div className="space-y-5">
        <div>
          <p className="text-xs font-bold text-orange-600 uppercase tracking-wider">
            Employee Workspace
          </p>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight mt-1">
            Tasks
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Track follow-ups, calls and pending actions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
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

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          <section className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">Today</h2>
              <p className="text-sm text-slate-500 mt-1">Tasks scheduled for today.</p>
            </div>

            <div className="divide-y divide-slate-100">
              {employeeTasks.map((task) => (
                <div key={task.id} className="px-5 py-4 flex items-center justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-slate-900">{task.title}</h3>
                    <p className="text-sm text-slate-500 mt-1">{task.due}</p>
                  </div>
                  <button className="inline-flex items-center gap-2 h-9 px-3 rounded-xl bg-green-50 text-green-700 font-bold text-sm">
                    <CheckCircle2 className="w-4 h-4" />
                    Done
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">Overdue</h2>
              <p className="text-sm text-slate-500 mt-1">Needs quick attention.</p>
            </div>

            <div className="divide-y divide-slate-100">
              {["Call Motilal client", "Send CRM demo link", "Update lead status"].map((task) => (
                <div key={task} className="px-5 py-4 flex items-center justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-slate-900">{task}</h3>
                    <p className="text-sm text-red-500 mt-1">Overdue from yesterday</p>
                  </div>
                  <button className="h-9 px-3 rounded-xl bg-orange-500 text-white font-bold text-sm">
                    Follow up
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </EmployeeShell>
  );
}
