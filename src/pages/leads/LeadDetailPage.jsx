import {
  Phone,
  MessageCircle,
  Mail,
  CheckSquare,
  FileText,
  CalendarClock,
  IndianRupee,
  Zap
} from "lucide-react";
import EmployeeShell from "../../components/employee/EmployeeShell.jsx";

export default function LeadDetailPage({ leadId }) {
  return (
    <EmployeeShell>
      <div className="space-y-5">
        <div>
          <p className="text-xs font-bold text-orange-600 uppercase tracking-wider">
            Leads › Lead Details
          </p>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight mt-1">
            Lead Details
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Lead ID: {leadId || "N/A"} · Complete customer profile.
          </p>
        </div>

        <section className="rounded-2xl bg-white border border-slate-200 shadow-sm p-5">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-blue-500 to-blue-700 text-white grid place-items-center text-2xl font-black">
              P
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-2xl font-bold text-slate-900">Priya Sharma</h2>
                <span className="px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-bold">
                  Contacted
                </span>
              </div>
              <p className="text-sm text-slate-500 mt-1">
                Sharma Textiles · priya@example.com · +91 98765 43210
              </p>
              <p className="text-sm text-slate-500 mt-1">
                Source: Website · Owner: Jayraj
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-5">
            {[
              ["Call", Phone],
              ["WhatsApp", MessageCircle],
              ["Email", Mail],
              ["Add Task", CheckSquare],
              ["Add Note", FileText]
            ].map(([label, Icon]) => (
              <button key={label} className="h-11 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 font-bold flex items-center justify-center gap-2 hover:bg-white">
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            ["Lead Score", "72%", Zap, "#2563eb"],
            ["Pipeline Stage", "Demo", CalendarClock, "#f97316"],
            ["Next Follow-up", "Pending", CheckSquare, "#16a34a"],
            ["Deal Value", "₹24,000", IndianRupee, "#7c3aed"]
          ].map(([label, value, Icon, color]) => (
            <section key={label} className="rounded-2xl bg-white border border-slate-200 shadow-sm p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase">{label}</p>
                  <h3 className="text-2xl font-bold text-slate-900 mt-2">{value}</h3>
                </div>
                <div className="w-11 h-11 rounded-2xl grid place-items-center" style={{ background: `${color}18`, color }}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
            </section>
          ))}
        </div>

        <section className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex gap-2 overflow-x-auto">
            {["Overview", "Activity", "Tasks", "Notes", "Documents", "Email History", "WhatsApp History"].map((tab, i) => (
              <button
                key={tab}
                className={`h-9 px-3 rounded-xl text-sm font-bold ${
                  i === 0 ? "bg-orange-500 text-white" : "bg-slate-50 text-slate-600"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 p-5">
            <div className="rounded-2xl bg-slate-50 border border-slate-100 p-5">
              <h3 className="font-bold text-slate-900">Lead Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-sm">
                {[
                  ["Company", "Sharma Textiles"],
                  ["Email", "priya@example.com"],
                  ["Phone", "+91 98765 43210"],
                  ["Source", "Website"],
                  ["Owner", "Jayraj"],
                  ["Status", "Contacted"]
                ].map(([k, v]) => (
                  <div key={k}>
                    <p className="text-slate-500 font-bold text-xs uppercase">{k}</p>
                    <p className="text-slate-900 font-semibold mt-1">{v}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-slate-50 border border-slate-100 p-5">
              <h3 className="font-bold text-slate-900">Upcoming Tasks</h3>
              <div className="space-y-3 mt-4">
                {["Call for demo confirmation", "Send pricing proposal", "WhatsApp reminder"].map((task) => (
                  <div key={task} className="rounded-xl bg-white border border-slate-100 p-3">
                    <h4 className="font-bold text-slate-900 text-sm">{task}</h4>
                    <p className="text-xs text-slate-500 mt-1">Pending</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </EmployeeShell>
  );
}
