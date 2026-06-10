import { useEffect, useMemo, useState } from "react";
import { Plus, Search, Download, Loader2 } from "lucide-react";
import EmployeeShell from "../../components/employee/EmployeeShell.jsx";
import { isBackendConfigured, listLeads } from "../../services/crmApi.js";
import { downloadCsv, rowsToCsv } from "../../services/exportService.js";

const PAGE_SIZE = 10;

function go(path) {
  window.history.pushState({}, "", path);
  window.dispatchEvent(new Event("salesflow:navigate"));
}

function normalizeContact(lead = {}) {
  return {
    id: lead.id,
    name: lead.name || "Not assigned",
    company: lead.company || "Not assigned",
    role: lead.job_title || lead.role || "Lead Contact",
    phone: lead.phone || "Not assigned",
    email: lead.email || "Not assigned",
    status: lead.status || "New",
  };
}

export default function EmployeeContactsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadContacts() {
    setLoading(true);
    setError("");
    try {
      if (!isBackendConfigured) throw new Error("Supabase env missing. Backend configure karo.");
      const rows = await listLeads({ limit: 500 });
      setContacts((rows || []).map(normalizeContact));
    } catch (err) {
      setContacts([]);
      setError(err.message || "Unable to load Supabase contacts.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadContacts(); }, []);

  const filteredContacts = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return contacts;
    return contacts.filter((contact) =>
      [contact.name, contact.company, contact.role, contact.phone, contact.email, contact.status]
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
  }, [search, contacts]);

  const totalPages = Math.max(1, Math.ceil(filteredContacts.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * PAGE_SIZE;
  const rows = filteredContacts.slice(start, start + PAGE_SIZE);

  const handleExport = () => {
    const csv = rowsToCsv(filteredContacts, [
      { key: "name", label: "Name" },
      { key: "company", label: "Company" },
      { key: "role", label: "Role" },
      { key: "phone", label: "Phone" },
      { key: "email", label: "Email" },
      { key: "status", label: "Status" },
    ]);
    downloadCsv("contacts.csv", csv);
  };

  return (
    <EmployeeShell>
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Contacts</h1>
            <p className="text-lg text-slate-500 mt-2">
              Manage your Supabase customer contacts, phone numbers and email details.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleExport}
              disabled={!filteredContacts.length}
              className="h-12 px-6 rounded-lg border border-slate-900 bg-white text-slate-900 font-semibold inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4" />
              Export
            </button>

            <button
              type="button"
              onClick={() => go("/leads")}
              className="h-12 px-6 rounded-lg bg-orange-600 text-white font-bold inline-flex items-center gap-3 shadow-lg shadow-orange-500/20"
            >
              <Plus className="w-5 h-5" />
              Add Contact
            </button>
          </div>
        </div>

        {error ? <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">{error}</div> : null}

        <section className="rounded-xl bg-white border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-200 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-slate-900">All Contacts</h2>
              <p className="text-sm text-slate-500 mt-1">
                Showing {filteredContacts.length === 0 ? 0 : start + 1}-
                {Math.min(start + PAGE_SIZE, filteredContacts.length)} of {filteredContacts.length}
              </p>
            </div>

            <div className="relative w-full xl:max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
                placeholder="Search contacts, company..."
                className="w-full h-12 rounded-lg border border-slate-200 bg-white pl-12 pr-4 text-lg outline-none focus:ring-2 focus:ring-orange-500/20 shadow-sm"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-500 uppercase text-sm">
                <tr>
                  <th className="px-6 py-4 font-black">Contact</th>
                  <th className="px-6 py-4 font-black">Phone</th>
                  <th className="px-6 py-4 font-black">Email</th>
                  <th className="px-6 py-4 font-black">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200">
                {rows.map((contact) => (
                  <tr key={contact.id} className="hover:bg-slate-50">
                    <td className="px-6 py-5">
                      <h3 className="font-black text-slate-900">{contact.name}</h3>
                      <p className="text-sm text-slate-500 mt-1">
                        {contact.company} · {contact.role}
                      </p>
                    </td>
                    <td className="px-6 py-5 text-sm text-slate-600 whitespace-nowrap">{contact.phone}</td>
                    <td className="px-6 py-5 text-sm text-slate-600 whitespace-nowrap">{contact.email}</td>
                    <td className="px-6 py-5">
                      <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold">
                        {contact.status}
                      </span>
                    </td>
                  </tr>
                ))}

                {loading && (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center text-slate-500">
                      <Loader2 className="w-5 h-5 animate-spin inline mr-2" /> Loading Supabase contacts...
                    </td>
                  </tr>
                )}

                {!loading && rows.length === 0 && (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center text-slate-500">
                      No contacts found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
            <button
              type="button"
              disabled={safePage === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="h-10 px-4 rounded-lg border border-slate-200 font-bold text-slate-700 disabled:opacity-40"
            >
              Previous
            </button>

            <span className="text-sm font-black text-slate-700">
              Page {safePage} of {totalPages}
            </span>

            <button
              type="button"
              disabled={safePage === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="h-10 px-4 rounded-lg border border-slate-200 font-bold text-slate-700 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </section>
      </div>
    </EmployeeShell>
  );
}
