import { Bell, CheckCircle2, AlertTriangle, Clock, Mail } from "lucide-react";
import EmployeeShell from "../../components/employee/EmployeeShell.jsx";

const notifications = [
  ["Follow-up due", "Priya Sharma follow-up is due today.", "Today, 10:30 AM", AlertTriangle, "#f97316", "Unread"],
  ["Task completed", "Proposal task marked done.", "Yesterday, 04:10 PM", CheckCircle2, "#16a34a", "Read"],
  ["New lead assigned", "Rohan Mehta assigned to you.", "Yesterday, 11:20 AM", Bell, "#2563eb", "Unread"],
  ["Email sent", "Demo email sent successfully.", "18 May, 09:45 AM", Mail, "#7c3aed", "Read"],
];

export default function NotificationsPage() {
  return (
    <EmployeeShell>
      <div className="space-y-5">
        <div>
          <p className="text-xs font-bold text-orange-600 uppercase tracking-wider">
            Employee Workspace
          </p>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight mt-1">
            Notifications
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            View reminders, lead alerts and activity notifications.
          </p>
        </div>

        <section className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Recent Notifications</h2>
              <p className="text-sm text-slate-500 mt-1">Unread and read alerts.</p>
            </div>

            <button className="h-9 px-3 rounded-xl bg-orange-500 text-white text-sm font-bold">
              Mark all read
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {notifications.map(([title, desc, time, Icon, color, status]) => (
              <div key={title} className="px-5 py-4 flex items-start gap-4 hover:bg-slate-50">
                <div
                  className="w-11 h-11 rounded-2xl grid place-items-center shrink-0"
                  style={{ background: `${color}18`, color }}
                >
                  <Icon className="w-5 h-5" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-slate-900">{title}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                      status === "Unread"
                        ? "bg-orange-50 text-orange-700"
                        : "bg-slate-100 text-slate-600"
                    }`}>
                      {status}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mt-1">{desc}</p>
                  <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                    <Clock className="w-3 h-3" />
                    <span>{time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </EmployeeShell>
  );
}
