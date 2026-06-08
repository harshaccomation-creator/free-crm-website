import { useState } from "react";
import EmployeeShell from "../../components/employee/EmployeeShell.jsx";
import { empLeads } from "../../data/employeeData.js";

export default function LeadListPage() {
  const [page, setPage] = useState(1);
  const size = 10;
  const totalPages = Math.max(1, Math.ceil(empLeads.length / size));
  const start = (page - 1) * size;
  const leads = empLeads.slice(start, start + size);

  const openLead = (id) => {
    window.history.pushState({}, "", `/leads/${id}`);
    window.dispatchEvent(new Event("salesflow:navigate"));
  };

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
              Showing 10 leads per page.
            </p>
          </div>
        </div>

        <section className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-900">
              Assigned Leads
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Showing {empLeads.length === 0 ? 0 : start + 1}-
              {Math.min(start + size, empLeads.length)} of {empLeads.length}
            </p>
          </div>

          <div className="divide-y divide-slate-100">
            {leads.map((lead) => (
              <div
                key={lead.id}
                className="px-5 py-4 flex items-center justify-between gap-4 hover:bg-slate-50"
              >
                <div>
                  <button
                    type="button"
                    onClick={() => openLead(lead.id)}
                    className="font-bold text-slate-900 hover:text-orange-600"
                  >
                    {lead.name}
                  </button>
                  <p className="text-sm text-slate-500">
                    {lead.company} · {lead.phone}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold">
                    {lead.status}
                  </span>
                  <strong className="text-sm text-slate-900">
                    ₹{Number(lead.value || 0).toLocaleString("en-IN")}
                  </strong>
                </div>
              </div>
            ))}
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
