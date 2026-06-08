import { useState } from "react";
import { Trophy, IndianRupee, Percent, Users, Download } from "lucide-react";
import EmployeeShell from "../../components/employee/EmployeeShell.jsx";
import { wonLeads, empLeads } from "../../data/employeeData.js";

const stats = [
  { label: "Won Leads", value: wonLeads.length, icon: Trophy, color: "#16a34a" },
  {
    label: "Won Value",
    value: `₹${wonLeads.reduce((sum, lead) => sum + Number(lead.value || 0), 0).toLocaleString("en-IN")}`,
    icon: IndianRupee,
    color: "#f97316"
  },
  {
    label: "Conversion",
    value: `${empLeads.length ? Math.round((wonLeads.length / empLeads.length) * 100) : 0}%`,
    icon: Percent,
    color: "#2563eb"
  },
  { label: "Total Leads", value: empLeads.length, icon: Users, color: "#7c3aed" }
];

export default function WonPageFixed() {
  const [page, setPage] = useState(1);
  const size = 10;

  const totalPages = Math.max(1, Math.ceil(wonLeads.length / size));
  const start = (page - 1) * size;
  const rows = wonLeads.slice(start, start + size);

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
              Showing 10 won leads per page.
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
              <div
                key={item.label}
                className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                      {item.label}
                    </p>

                    <h2 className="text-3xl font-bold text-slate-900 mt-2">
                      {item.value}
                    </h2>
                  </div>

                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center"
                    style={{ background: `${item.color}18`, color: item.color }}
                  >
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

            <p className="text-sm text-slate-500 mt-1">
              Showing {wonLeads.length === 0 ? 0 : start + 1}-
              {Math.min(start + size, wonLeads.length)} of {wonLeads.length}
            </p>
          </div>

          <div className="divide-y divide-slate-100">
            {rows.map((lead) => (
              <div
                key={lead.id}
                className="px-5 py-4 flex items-center justify-between gap-4 hover:bg-slate-50"
              >
                <div>
                  <h3 className="font-bold text-slate-900">{lead.name}</h3>
                  <p className="text-sm text-slate-500">
                    {lead.company} · {lead.phone}
                  </p>
                </div>

                <div className="hidden md:block text-sm text-slate-600">
                  {lead.created}
                </div>

                <strong className="text-sm text-green-700">
                  ₹{Number(lead.value || 0).toLocaleString("en-IN")}
                </strong>
              </div>
            ))}

            {rows.length === 0 && (
              <div className="px-5 py-10 text-center text-slate-500">
                No won leads found.
              </div>
            )}
          </div>

          <div className="px-5 py-4 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="h-9 px-4 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 disabled:opacity-40"
            >
              Previous
            </button>

            <span className="text-sm font-bold text-slate-600">
              Page {page} of {totalPages}
            </span>

            <button
              type="button"
              disabled={page === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="h-9 px-4 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </section>
      </div>
    </EmployeeShell>
  );
}
