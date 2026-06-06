import { Settings, User, Bell, Shield, CreditCard, ToggleLeft } from "lucide-react";
import EmployeeShell from "../../components/employee/EmployeeShell.jsx";

const cards = [
  ["Profile Settings", "Update name, email and avatar.", User, "#2563eb"],
  ["Notification Settings", "Manage email and app reminders.", Bell, "#f97316"],
  ["Security", "Password, sessions and account security.", Shield, "#16a34a"],
  ["Subscription", "Trial and payment access status.", CreditCard, "#7c3aed"],
];

export default function SettingsPage() {
  return (
    <EmployeeShell>
      <div className="space-y-5">
        <div>
          <p className="text-xs font-bold text-orange-600 uppercase tracking-wider">
            Employee Workspace
          </p>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight mt-1">
            Settings
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage workspace preferences and account configuration.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {cards.map(([title, desc, Icon, color]) => (
            <section key={title} className="rounded-2xl bg-white border border-slate-200 shadow-sm p-5">
              <div
                className="w-12 h-12 rounded-2xl grid place-items-center"
                style={{ background: `${color}18`, color }}
              >
                <Icon className="w-5 h-5" />
              </div>

              <h2 className="text-lg font-bold text-slate-900 mt-4">{title}</h2>
              <p className="text-sm text-slate-500 mt-1">{desc}</p>
            </section>
          ))}
        </div>

        <section className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-900">Workspace Preferences</h2>
            <p className="text-sm text-slate-500 mt-1">Control employee CRM experience.</p>
          </div>

          <div className="divide-y divide-slate-100">
            {[
              ["Daily follow-up reminders", "Receive reminder for today's follow-ups."],
              ["Overdue alerts", "Notify when a lead follow-up becomes overdue."],
              ["Weekly report email", "Receive weekly activity report."]
            ].map((item) => (
              <div key={item[0]} className="px-5 py-4 flex items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-slate-900">{item[0]}</h3>
                  <p className="text-sm text-slate-500 mt-1">{item[1]}</p>
                </div>

                <button className="text-orange-500">
                  <ToggleLeft className="w-8 h-8" />
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </EmployeeShell>
  );
}
