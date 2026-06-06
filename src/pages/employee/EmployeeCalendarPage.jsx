import { CalendarDays, Plus, Clock } from "lucide-react";
import EmployeeShell from "../../components/employee/EmployeeShell.jsx";

const days = Array.from({ length: 30 }, (_, i) => i + 1);

export default function EmployeeCalendarPage() {
  return (
    <EmployeeShell>
      <div className="space-y-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold text-orange-600 uppercase tracking-wider">
              Employee Workspace
            </p>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight mt-1">
              Calendar
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Manage meetings, demos and follow-ups.
            </p>
          </div>

          <button className="inline-flex items-center gap-2 px-4 h-10 rounded-xl bg-orange-500 text-white text-sm font-bold shadow-lg shadow-orange-500/20">
            <Plus className="w-4 h-4" />
            Schedule
          </button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-5">
          <section className="rounded-2xl bg-white border border-slate-200 shadow-sm p-5">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-slate-900">May 2025</h2>
              <CalendarDays className="w-5 h-5 text-orange-500" />
            </div>

            <div className="grid grid-cols-7 gap-2 text-center">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                <div key={d} className="text-xs font-bold text-slate-400 py-2">
                  {d}
                </div>
              ))}

              {days.map((d) => (
                <div
                  key={d}
                  className={`min-h-[76px] rounded-xl border p-2 text-left ${
                    [7, 13, 20].includes(d)
                      ? "bg-orange-50 border-orange-200"
                      : "bg-slate-50 border-slate-100"
                  }`}
                >
                  <span className="text-sm font-bold text-slate-700">{d}</span>
                  {[7, 13, 20].includes(d) ? (
                    <p className="text-[11px] text-orange-700 font-bold mt-2">
                      Follow-up
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
          </section>

          <aside className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">Upcoming</h2>
              <p className="text-sm text-slate-500 mt-1">Next scheduled events.</p>
            </div>

            <div className="divide-y divide-slate-100">
              {[
                ["Demo with Amit", "Today, 03:00 PM"],
                ["Call Priya", "Tomorrow, 11:30 AM"],
                ["Payment follow-up", "Friday, 10:15 AM"]
              ].map((item) => (
                <div key={item[0]} className="px-5 py-4 flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 grid place-items-center">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{item[0]}</h3>
                    <p className="text-sm text-slate-500 mt-1">{item[1]}</p>
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </EmployeeShell>
  );
}
