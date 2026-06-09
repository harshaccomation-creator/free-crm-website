import { BarChart2, TrendingUp, Users, Trophy, Activity } from "lucide-react";
import EmployeeShell from "../../components/employee/EmployeeShell.jsx";

const stats = [
  { label: "Lead Growth", value: "+18%", icon: TrendingUp, color: "#16a34a" },
  { label: "Total Leads", value: "128", icon: Users, color: "#2563eb" },
  { label: "Won Deals", value: "18", icon: Trophy, color: "#f97316" },
  { label: "Activities", value: "240", icon: Activity, color: "#7c3aed" }
];

export default function EmployeeReportsPage() {
  return (
    <EmployeeShell>
      <div className="space-y-5">
        <div>
          <p className="text-xs font-bold text-orange-600 uppercase tracking-wider">
            Employee Workspace
          </p>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight mt-1">
            Reports
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Your sales performance and activity reports.
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
          <section className="rounded-2xl bg-white border border-slate-200 shadow-sm p-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Lead Performance</h2>
                <p className="text-sm text-slate-500 mt-1">Weekly lead movement.</p>
              </div>
              <BarChart2 className="w-5 h-5 text-orange-500" />
            </div>

            <div className="mt-6 space-y-4">
              {[
                ["New", "72%"],
                ["Contacted", "58%"],
                ["Demo", "36%"],
                ["Won", "24%"]
              ].map((item) => (
                <div key={item[0]}>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="font-bold text-slate-700">{item[0]}</span>
                    <span className="text-slate-500">{item[1]}</span>
                  </div>
                  <div className="h-3 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full rounded-full bg-orange-500" style={{ width: item[1] }} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl bg-white border border-slate-200 shadow-sm p-5">
            <h2 className="text-lg font-bold text-slate-900">Activity Summary</h2>
            <p className="text-sm text-slate-500 mt-1">Calls, WhatsApp and follow-ups.</p>

            <div className="grid grid-cols-2 gap-4 mt-6">
              {[
                ["Calls", "84"],
                ["WhatsApp", "96"],
                ["Emails", "28"],
                ["Notes", "32"]
              ].map((item) => (
                <div key={item[0]} className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
                  <p className="text-xs font-bold text-slate-500 uppercase">{item[0]}</p>
                  <h3 className="text-2xl font-bold text-slate-900 mt-2">{item[1]}</h3>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </EmployeeShell>
  );
}
