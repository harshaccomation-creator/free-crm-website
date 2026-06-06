import {
  Search,
  Filter,
  Plus,
  Phone,
  MessageCircle,
  Mail,
  Eye,
  SlidersHorizontal,
  UserPlus
} from "lucide-react";
import EmployeeShell from "../../components/employee/EmployeeShell.jsx";
import { empLeads } from "../../data/employeeData.js";

function go(path) {
  window.history.pushState({}, "", path);
  window.dispatchEvent(new Event("salesflow:navigate"));
}

const statusClass = {
  New: "bg-blue-50 text-blue-700",
  Contacted: "bg-green-50 text-green-700",
  "Demo Done": "bg-orange-50 text-orange-700",
  Overdue: "bg-red-50 text-red-700",
  Won: "bg-purple-50 text-purple-700",
  Junk: "bg-slate-100 text-slate-600"
};

export default function LeadListPage() {
  const total = empLeads.length;
  const newLeads = empLeads.filter((l) => l.status === "New").length;
  const contacted = empLeads.filter((l) => l.status === "Contacted").length;
  const won = empLeads.filter((l) => l.status === "Won").length;

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
              Manage assigned leads, follow-ups and deal pipeline.
            </p>
          </div>

          <button
            type="button"
            className="inline-flex items-center gap-2 px-4 h-10 rounded-xl bg-orange-500 text-white text-sm font-bold shadow-lg shadow-orange-500/20"
          >
            <Plus className="w-4 h-4" />
            Add Lead
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            ["Total Leads", total, UserPlus, "#2563eb"],
            ["New Leads", newLeads, Plus, "#f97316"],
            ["Contacted", contacted, Phone, "#16a34a"],
            ["Won", won, Eye, "#7c3aed"]
          ].map(([label, value, Icon, color]) => (
            <section
              key={label}
              className="rounded-2xl bg-white border border-slate-200 shadow-sm p-5"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                    {label}
                  </p>
                  <h3 className="text-3xl font-bold text-slate-900 mt-2">
                    {value}
                  </h3>
                </div>

                <div
                  className="w-12 h-12 rounded-2xl grid place-items-center"
                  style={{ background: `${color}18`, color }}
                >
                  <Icon className="w-5 h-5" />
                </div>
              </div>
            </section>
          ))}
        </div>

        <section className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <div className="grid grid-cols-1 xl:grid-cols-[1fr_170px_170px_120px] gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="search"
                  placeholder="Search by lead, company, phone or email..."
                  className="w-full h-11 rounded-xl border border-slate-200 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-orange-500/20"
                />
              </div>

              <button className="inline-flex items-center justify-between h-11 px-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 bg-slate-50">
                All Sources
                <SlidersHorizontal className="w-4 h-4" />
              </button>

              <button className="inline-flex items-center justify-between h-11 px-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 bg-slate-50">
                All Statuses
                <Filter className="w-4 h-4" />
              </button>

              <button className="h-11 rounded-xl bg-slate-900 text-white text-sm font-bold">
                Apply
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="text-left px-5 py-3 font-bold">Lead</th>
                  <th className="text-left px-5 py-3 font-bold">Company</th>
                  <th className="text-left px-5 py-3 font-bold">Source</th>
                  <th className="text-left px-5 py-3 font-bold">Status</th>
                  <th className="text-left px-5 py-3 font-bold">Score</th>
                  <th className="text-left px-5 py-3 font-bold">Value</th>
                  <th className="text-left px-5 py-3 font-bold">Next Follow-up</th>
                  <th className="text-left px-5 py-3 font-bold">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {empLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50">
                    <td className="px-5 py-4">
                      <button
                        type="button"
                        onClick={() => go(`/leads/${lead.id}`)}
                        className="font-bold text-slate-900 hover:text-orange-600"
                      >
                        {lead.name}
                      </button>
                      <p className="text-xs text-slate-500 mt-1">
                        {lead.email}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {lead.company}
                    </td>

                    <td className="px-5 py-4">
                      <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold">
                        {lead.source}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          statusClass[lead.status] || "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {lead.status}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-orange-500"
                            style={{ width: `${lead.score}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold text-slate-600">
                          {lead.score}
                        </span>
                      </div>
                    </td>

                    <td className="px-5 py-4 font-bold text-slate-900">
                      ₹{lead.value.toLocaleString("en-IN")}
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {lead.nextFollowUp}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button className="w-9 h-9 rounded-xl bg-green-50 text-green-700 grid place-items-center">
                          <Phone className="w-4 h-4" />
                        </button>
                        <button className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 grid place-items-center">
                          <MessageCircle className="w-4 h-4" />
                        </button>
                        <button className="w-9 h-9 rounded-xl bg-orange-50 text-orange-700 grid place-items-center">
                          <Mail className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => go(`/leads/${lead.id}`)}
                          className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 grid place-items-center"
                        >
                          <Eye className="w-4 h-4" />
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
