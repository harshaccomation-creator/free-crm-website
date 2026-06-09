import AddLeadModal from "../../components/employee/AddLeadModal";
import { useMemo, useState } from "react";
import { Plus, Search, Eye } from "lucide-react";
import EmployeeShell from "../../components/employee/EmployeeShell.jsx";
import { empLeads } from "../../data/employeeData.js";

const PAGE_SIZE = 10;
const tabs = ["All", "New", "Contacted", "Qualified", "Proposal Sent", "Won", "Lost"];

function go(path) {
  window.history.pushState({}, "", path);
  window.dispatchEvent(new Event("salesflow:navigate"));
}

function initials(name = "") {
  return String(name).split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();
}

function money(value) {
  return Number(value || 0).toLocaleString("en-IN");
}

export default function LeadListPage() {
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [isAddLeadOpen, setIsAddLeadOpen] = useState(false);
  const [localLeads, setLocalLeads] = useState([]);

  const leads = useMemo(() => {
    return [...localLeads, ...empLeads].map((lead) => ({
      ...lead,
      status: lead.status || "New",
      company: lead.company || "-",
      source: lead.source || "Manual",
      value: lead.value || 0,
      score: lead.score || 0,
    }));
  }, [localLeads]);

  const filteredLeads = useMemo(() => {
    const query = search.trim().toLowerCase();
    return leads.filter((lead) => {
      const tabOk = activeTab === "All" || lead.status === activeTab;
      const searchOk = !query || [lead.name, lead.company, lead.email, lead.phone]
        .join(" ")
        .toLowerCase()
        .includes(query);
      return tabOk && searchOk;
    });
  }, [activeTab, search, leads]);

  const totalPages = Math.max(1, Math.ceil(filteredLeads.length / PAGE_SIZE));
  const start = (page - 1) * PAGE_SIZE;
  const pageRows = filteredLeads.slice(start, start + PAGE_SIZE);

  const counts = tabs.reduce((acc, tab) => {
    acc[tab] = tab === "All" ? leads.length : leads.filter((lead) => lead.status === tab).length;
    return acc;
  }, {});

  const handleSaveLead = (newLead) => {
    setLocalLeads((prev) => [newLead, ...prev]);
    setActiveTab("All");
    setSearch("");
    setPage(1);
  };

  return (
    <EmployeeShell>
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">My Leads</h1>
            <p className="text-lg text-slate-500 mt-2">Manage and track your assigned leads.</p>
          </div>

          <button
            type="button"
            onClick={() => setIsAddLeadOpen(true)}
            className="h-12 px-6 rounded-lg bg-orange-600 text-white font-bold inline-flex items-center gap-3 shadow-lg shadow-orange-500/20"
          >
            <Plus className="w-5 h-5" />
            Add Lead
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          <section className="rounded-xl bg-white border border-slate-200 p-6 shadow-sm"><p className="text-lg text-slate-500 font-medium">Total Leads</p><h2 className="text-4xl font-black text-slate-900">{leads.length}</h2></section>
          <section className="rounded-xl bg-white border border-slate-200 p-6 shadow-sm"><p className="text-lg text-slate-500 font-medium">Active Leads</p><h2 className="text-4xl font-black text-slate-900">{leads.filter((lead) => !["Won", "Lost"].includes(lead.status)).length}</h2></section>
          <section className="rounded-xl bg-white border border-slate-200 p-6 shadow-sm"><p className="text-lg text-slate-500 font-medium">Lost Leads</p><h2 className="text-4xl font-black text-slate-900">{leads.filter((lead) => lead.status === "Lost").length}</h2></section>
          <section className="rounded-xl bg-white border border-slate-200 p-6 shadow-sm"><p className="text-lg text-slate-500 font-medium">Won Leads</p><h2 className="text-4xl font-black text-slate-900">{leads.filter((lead) => lead.status === "Won").length}</h2></section>
        </div>

        <section className="rounded-xl bg-white border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 pt-5 border-b border-slate-200">
            <div className="flex items-center gap-8 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => { setActiveTab(tab); setPage(1); }}
                  className={`pb-5 text-lg font-semibold flex items-center gap-2 border-b-2 ${activeTab === tab ? "text-orange-600 border-orange-600" : "text-slate-500 border-transparent"}`}
                >
                  {tab}
                  <span className="px-2 py-0.5 rounded-full text-sm bg-slate-100 text-slate-500">{counts[tab]}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="px-6 py-5 border-b border-slate-200">
            <div className="relative w-full lg:max-w-xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                value={search}
                onChange={(event) => { setSearch(event.target.value); setPage(1); }}
                placeholder="Search leads, company..."
                className="w-full h-12 rounded-lg border border-slate-200 bg-white pl-12 pr-4 text-lg outline-none focus:ring-2 focus:ring-orange-500/20 shadow-sm"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-500 uppercase text-sm">
                <tr>
                  <th className="px-6 py-4 font-black">Lead</th>
                  <th className="px-6 py-4 font-black">Company</th>
                  <th className="px-6 py-4 font-black">Source</th>
                  <th className="px-6 py-4 font-black">Status</th>
                  <th className="px-6 py-4 font-black">Value</th>
                  <th className="px-6 py-4 font-black">Score</th>
                  <th className="px-6 py-4 font-black">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {pageRows.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50">
                    <td className="px-6 py-5"><div className="flex items-center gap-4"><div className="w-14 h-14 rounded-full bg-purple-600 text-white grid place-items-center font-black">{initials(lead.name)}</div><div><button type="button" onClick={() => go(`/leads/${lead.id}`)} className="text-lg font-black text-slate-900 hover:text-orange-600">{lead.name}</button><p className="text-slate-500">{lead.email}</p></div></div></td>
                    <td className="px-6 py-5 text-lg text-slate-900">{lead.company}</td>
                    <td className="px-6 py-5 text-lg text-slate-500">{lead.source}</td>
                    <td className="px-6 py-5"><span className="px-3 py-1 rounded-md border text-sm font-black bg-orange-50 text-orange-700 border-orange-100">{lead.status}</span></td>
                    <td className="px-6 py-5 text-lg font-black text-slate-900">{money(lead.value)}</td>
                    <td className="px-6 py-5"><span className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 grid place-items-center font-black">{lead.score}</span></td>
                    <td className="px-6 py-5"><button type="button" onClick={() => go(`/leads/${lead.id}`)} className="text-slate-500 hover:text-blue-600"><Eye className="w-5 h-5" /></button></td>
                  </tr>
                ))}
                {pageRows.length === 0 && <tr><td colSpan="7" className="px-6 py-12 text-center text-slate-500">No leads found.</td></tr>}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-500">Showing {filteredLeads.length === 0 ? 0 : start + 1}-{Math.min(start + PAGE_SIZE, filteredLeads.length)} of {filteredLeads.length}</p>
            <div className="flex items-center gap-3">
              <button disabled={page === 1} onClick={() => setPage((prev) => Math.max(1, prev - 1))} className="h-10 px-4 rounded-lg border border-slate-200 font-bold text-slate-700 disabled:opacity-40">Previous</button>
              <span className="text-sm font-black text-slate-700">Page {page} of {totalPages}</span>
              <button disabled={page === totalPages} onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))} className="h-10 px-4 rounded-lg border border-slate-200 font-bold text-slate-700 disabled:opacity-40">Next</button>
            </div>
          </div>
        </section>

        <AddLeadModal open={isAddLeadOpen} onClose={() => setIsAddLeadOpen(false)} onSave={handleSaveLead} />
      </div>
    </EmployeeShell>
  );
}
