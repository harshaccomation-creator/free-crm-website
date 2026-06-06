import { Search, Filter, Plus, Phone, MessageCircle } from "lucide-react";
import EmployeeShell from "../../components/employee/EmployeeShell.jsx";
import { employeeLeads } from "../../data/employeeData.js";

function go(path) {
  window.history.pushState({}, "", path);
  window.dispatchEvent(new Event("salesflow:navigate"));
}

export default function LeadListPage() {
  return (
    <EmployeeShell>
      <div className="space-y-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold text-orange-600 uppercase tracking-wider">
              Employee Workspace
            </p>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight mt-1">
              My Leads
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Manage assigned leads, follow-ups and deal status.
            </p>
          </div>

          <button className="inline-flex items-center gap-2 px-4 h-10 rounded-xl bg-orange-500 text-white text-sm font-bold shadow-lg shadow-orange-500/20">
            <Plus className="w-4 h-4" />
            Add Lead
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            ["Total Leads", "128"],
            ["Contacted", "42"],
            ["Demo", "18"],
            ["Won", "9"]
          ].map(([label, value]) => (
            <section key={label} className="rounded-2xl bg-white border border-slate-200 shadow-sm p-5">
              <p className="text-xs font-bold text-slate-500 uppercase">{label}</p>
              <h3 className="text-3xl font-bold text-slate-900 mt-2">{value}</h3>
            </section>
          ))}
        </div>

        <section className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center gap-3 justify-between">
            <div className="relative flex-1 max-w-lg">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="search"
                placeholder="Search leads..."
                className="w-full h-10 rounded-xl border border-slate-200 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-orange-500/20"
              />
            </div>

            <button className="inline-flex items-center gap-2 h-10 px-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-700">
              <Filter className="w-4 h-4" />
              Filters
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="text-left px-5 py-3 font-bold">Lead</th>
                  <th className="text-left px-5 py-3 font-bold">Company</th>
                  <th className="text-left px-5 py-3 font-bold">Contact</th>
                  <th className="text-left px-5 py-3 font-bold">Status</th>
                  <th className="text-left px-5 py-3 font-bold">Value</th>
                  <th className="text-left px-5 py-3 font-bold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {employeeLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50">
                    <td className="px-5 py-4">
                      <button onClick={() => go(`/leads/${lead.id}`)} className="font-bold text-slate-900 hover:text-orange-600">
                        {lead.name}
                      </button>
                      <p className="text-xs text-slate-500 mt-1">{lead.source}</p>
                    </td>
                    <td className="px-5 py-4 text-slate-600">{lead.company}</td>
                    <td className="px-5 py-4 text-slate-600">{lead.phone}</td>
                    <td className="px-5 py-4">
                      <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold">
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-bold text-slate-900">{lead.value}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button className="w-9 h-9 rounded-xl bg-green-50 text-green-700 grid place-items-center">
                          <Phone className="w-4 h-4" />
                        </button>
                        <button className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 grid place-items-center">
                          <MessageCircle className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
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
