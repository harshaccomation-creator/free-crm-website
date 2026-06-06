import { Trophy, IndianRupee, Percent, Users, Download } from "lucide-react";
import EmployeeShell from "../../components/employee/EmployeeShell.jsx";

const stats = [
  { label: "Won Leads", value: "18", icon: Trophy, color: "#16a34a" },
  { label: "Won Value", value: "₹4.2L", icon: IndianRupee, color: "#f97316" },
  { label: "Conversion", value: "28%", icon: Percent, color: "#2563eb" },
  { label: "Total Leads", value: "128", icon: Users, color: "#7c3aed" }
];

const rows = [
  ["Deepak Kumar", "DK Traders", "₹42,000", "16 May 2025"],
  ["Priya Sharma", "Sharma Textiles", "₹24,000", "14 May 2025"],
  ["Amit Verma", "AV Enterprises", "₹36,000", "11 May 2025"]
];

export default function WonPageFixed() {
  return (
    <EmployeeShell>
      <div className="space-y-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold text-orange-600 uppercase tracking-wider">
              Employee Workspace
            </p>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight mt-1">
              Won Leads
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Track converted leads and won revenue.
            </p>
          </div>

          <button className="inline-flex items-center gap-2 px-4 h-10 rounded-xl bg-orange-500 text-white text-sm font-bold shadow-lg shadow-orange-500/20">
            <Download className="w-4 h-4" />
            Export Won
          </button>
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

        <section className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-900">Won Records</h2>
            <p className="text-sm text-slate-500 mt-1">Closed leads and deal values.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="text-left px-5 py-3 font-bold">Lead</th>
                  <th className="text-left px-5 py-3 font-bold">Company</th>
                  <th className="text-left px-5 py-3 font-bold">Value</th>
                  <th className="text-left px-5 py-3 font-bold">Won Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.map((row) => (
                  <tr key={row[0]} className="hover:bg-slate-50">
                    <td className="px-5 py-4 font-bold text-slate-900">{row[0]}</td>
                    <td className="px-5 py-4 text-slate-600">{row[1]}</td>
                    <td className="px-5 py-4 font-bold text-green-700">{row[2]}</td>
                    <td className="px-5 py-4 text-slate-600">{row[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </EmployeeShell>
  );
}
