import { User, Mail, Shield, Building2, Edit3, Crown } from "lucide-react";
import EmployeeShell from "../../components/employee/EmployeeShell.jsx";

export default function ProfilePagePremium() {
  return (
    <EmployeeShell>
      <div className="space-y-5">
        <div>
          <p className="text-xs font-bold text-orange-600 uppercase tracking-wider">
            Employee Workspace
          </p>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight mt-1">
            Profile
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your account profile and workspace identity.
          </p>
        </div>

        <section className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-500 to-blue-700 text-white grid place-items-center text-3xl font-black">
              J
            </div>

            <div className="min-w-0 flex-1">
              <h2 className="text-2xl font-bold text-slate-900">Jayraj</h2>
              <p className="text-sm text-slate-500 mt-1">Sales Executive · SalesFlow Hub</p>

              <div className="flex flex-wrap gap-2 mt-3">
                <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold">
                  Employee
                </span>
                <span className="px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-bold">
                  Active
                </span>
              </div>
            </div>

            <button className="inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-orange-500 text-white font-bold text-sm">
              <Edit3 className="w-4 h-4" />
              Edit Profile
            </button>
          </div>
        </section>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          <section className="xl:col-span-2 rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">Account Information</h2>
              <p className="text-sm text-slate-500 mt-1">Personal and company details.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5">
              {[
                ["Full Name", "Jayraj", User],
                ["Email", "jayraj@example.com", Mail],
                ["Role", "Sales Executive", Shield],
                ["Company", "SalesFlow Hub", Building2],
              ].map(([label, value, Icon]) => (
                <div key={label} className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 grid place-items-center text-orange-600">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase">{label}</p>
                      <h3 className="font-bold text-slate-900 mt-1">{value}</h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl bg-white border border-slate-200 shadow-sm p-5">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 grid place-items-center">
              <Crown className="w-5 h-5" />
            </div>

            <h2 className="text-lg font-bold text-slate-900 mt-4">Trial Plan</h2>
            <p className="text-sm text-slate-500 mt-1">
              Your workspace is currently under active subscription/trial access.
            </p>

            <div className="mt-5 rounded-2xl bg-slate-50 border border-slate-100 p-4">
              <p className="text-xs font-bold text-slate-500 uppercase">Status</p>
              <h3 className="text-xl font-bold text-green-700 mt-1">Active</h3>
            </div>
          </section>
        </div>
      </div>
    </EmployeeShell>
  );
}
