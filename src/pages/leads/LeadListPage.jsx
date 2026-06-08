import AddLeadModal from "../../components/employee/AddLeadModal";
import { useMemo, useState } from "react";
import {
  Search,
  Filter,
  Plus,
  Users,
  TrendingUp,
  AlertCircle,
  Trophy,
  Eye,
  Edit3,
  Trash2,
  Download
} from "lucide-react";
import EmployeeShell from "../../components/employee/EmployeeShell.jsx";
import { empLeads } from "../../data/employeeData.js";

const PER_PAGE = 10;

const demoLeads = [
  ...empLeads,
  {
    id: "L009",
    name: "Aarav Patel",
    company: "Infosys",
    email: "aarav.p@infosys.com",
    phone: "+91 98765 11111",
    status: "Qualified",
    source: "LinkedIn",
    value: 1500000,
    score: 85
  },
  {
    id: "L010",
    name: "Sarah Jenkins",
    company: "TechNova Global",
    email: "sjenkins@technova.io",
    phone: "+91 98765 22222",
    status: "Proposal Sent",
    source: "Website",
    value: 2500000,
    score: 92
  },
  {
    id: "L011",
    name: "Rohan Shah",
    company: "BrightBiz",
    email: "rohan@brightbiz.in",
    phone: "+91 98765 33333",
    status: "New",
    source: "Referral",
    value: 850000,
    score: 71
  },
  {
    id: "L012",
    name: "Meera Joshi",
    company: "CloudKart",
    email: "meera@cloudkart.com",
    phone: "+91 98765 44444",
    status: "Lost",
    source: "Website",
    value: 620000,
    score: 48
  }
];

function initials(name = "") {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatValue(value) {
  const num = Number(value || 0);

  if (num >= 100000) {
    return `₹${(num / 100000).toFixed(num % 100000 === 0 ? 0 : 1)}L`;
  }

  return `₹${num.toLocaleString("en-IN")}`;
}

function statusClass(status) {
  if (status === "New") return "bg-blue-50 text-blue-700 border-blue-100";
  if (status === "Contacted") return "bg-green-50 text-green-700 border-green-100";
  if (status === "Qualified") return "bg-purple-50 text-purple-700 border-purple-100";
  if (status === "Proposal Sent") return "bg-orange-50 text-orange-700 border-orange-100";
  if (status === "Won") return "bg-emerald-50 text-emerald-700 border-emerald-100";
  if (status === "Lost") return "bg-slate-100 text-slate-600 border-slate-200";
  if (status === "Overdue") return "bg-red-50 text-red-700 border-red-100";
  if (status === "Demo Done") return "bg-orange-50 text-orange-700 border-orange-100";
  return "bg-slate-100 text-slate-600 border-slate-200";
}

function go(path) {
  window.history.pushState({}, "", path);
  window.dispatchEvent(new Event("salesflow:navigate"));
}

export default function LeadListPage() {
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const tabs = ["All", "New", "Contacted", "Qualified", "Proposal Sent", "Won", "Lost"];

  const normalizedLeads = useMemo(() => {
    return demoLeads.map((lead) => {
      let status = lead.status;

      if (status === "Demo Done") status = "Qualified";
      if (status === "Overdue") status = "Lost";

      return { ...lead, status };
    });
  }, []);

  const filteredLeads = useMemo(() => {
    const q = search.trim().toLowerCase();

    return normalizedLeads.filter((lead) => {
      const tabMatch = activeTab === "All" || lead.status === activeTab;

      const searchMatch =
        !q ||
        lead.name.toLowerCase().includes(q) ||
        lead.company.toLowerCase().includes(q) ||
        lead.email.toLowerCase().includes(q) ||
        String(lead.phone || "").toLowerCase().includes(q);

      return tabMatch && searchMatch;
    });
  }, [activeTab, search, normalizedLeads]);

  const totalPages = Math.max(1, Math.ceil(filteredLeads.length / PER_PAGE));
  const start = (page - 1) * PER_PAGE;
  const pageRows = filteredLeads.slice(start, start + PER_PAGE);

  const counts = {
    All: normalizedLeads.length,
    New: normalizedLeads.filter((l) => l.status === "New").length,
    Contacted: normalizedLeads.filter((l) => l.status === "Contacted").length,
    Qualified: normalizedLeads.filter((l) => l.status === "Qualified").length,
    "Proposal Sent": normalizedLeads.filter((l) => l.status === "Proposal Sent").length,
    Won: normalizedLeads.filter((l) => l.status === "Won").length,
    Lost: normalizedLeads.filter((l) => l.status === "Lost").length
  };

  const activeLeads = normalizedLeads.filter((l) => !["Won", "Lost"].includes(l.status)).length;
  const wonLeads = normalizedLeads.filter((l) => l.status === "Won").length;
  const lostLeads = normalizedLeads.filter((l) => l.status === "Lost").length;
  const wonValue = normalizedLeads
    .filter((l) => l.status === "Won")
    .reduce((sum, l) => sum + Number(l.value || 0), 0);

  const changeTab = (tab) => {
    setActiveTab(tab);
    setPage(1);
  };

  return (
    <EmployeeShell>
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">
              My Leads
            </h1>
            <p className="text-lg text-slate-500 mt-2">
              Manage and track your assigned leads.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button className="h-12 px-6 rounded-lg border border-slate-900 bg-white text-slate-900 font-semibold inline-flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </button>

            <button className="h-12 px-6 rounded-lg bg-orange-600 text-white font-bold inline-flex items-center gap-3 shadow-lg shadow-orange-500/20">
              <Plus className="w-5 h-5" />
              Add Lead
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          <section className="rounded-xl bg-white border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 grid place-items-center">
                <Users className="w-7 h-7" />
              </div>

              <div>
                <p className="text-lg text-slate-500 font-medium">Total Leads</p>
                <h2 className="text-4xl font-black text-slate-900">{normalizedLeads.length}</h2>
                <p className="text-green-600 font-bold mt-1">+3 new this week</p>
              </div>
            </div>
          </section>

          <section className="rounded-xl bg-white border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 grid place-items-center">
                <TrendingUp className="w-7 h-7" />
              </div>

              <div>
                <p className="text-lg text-slate-500 font-medium">Active Leads</p>
                <h2 className="text-4xl font-black text-slate-900">{activeLeads}</h2>
                <p className="text-green-600 font-bold mt-1">healthy pipeline</p>
              </div>
            </div>
          </section>

          <section className="rounded-xl bg-white border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 grid place-items-center">
                <AlertCircle className="w-7 h-7" />
              </div>

              <div>
                <p className="text-lg text-slate-500 font-medium">Overdue</p>
                <h2 className="text-4xl font-black text-slate-900">{lostLeads}</h2>
                <p className="text-red-600 font-bold mt-1">follow up now</p>
              </div>
            </div>
          </section>

          <section className="rounded-xl bg-white border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-full bg-orange-100 text-orange-600 grid place-items-center">
                <Trophy className="w-7 h-7" />
              </div>

              <div>
                <p className="text-lg text-slate-500 font-medium">Won Leads</p>
                <h2 className="text-4xl font-black text-slate-900">{wonLeads}</h2>
                <p className="text-green-600 font-bold mt-1">
                  {formatValue(wonValue)} closed
                </p>
              </div>
            </div>
          </section>
        </div>

        <section className="rounded-xl bg-white border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 pt-5 border-b border-slate-200">
            <div className="flex items-center gap-8 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => changeTab(tab)}
                  className={`pb-5 text-lg font-semibold flex items-center gap-2 border-b-2 ${
                    activeTab === tab
                      ? "text-orange-600 border-orange-600"
                      : "text-slate-500 border-transparent"
                  }`}
                >
                  {tab}
                  <span
                    className={`px-2 py-0.5 rounded-full text-sm ${
                      activeTab === tab
                        ? "bg-orange-50 text-orange-600"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {counts[tab]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="px-6 py-5 border-b border-slate-200 flex flex-col lg:flex-row gap-4">
            <div className="relative w-full lg:max-w-xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search leads, company..."
                className="w-full h-12 rounded-lg border border-slate-200 bg-white pl-12 pr-4 text-lg outline-none focus:ring-2 focus:ring-orange-500/20 shadow-sm"
              />
            </div>

            <button className="h-12 px-6 rounded-lg border border-slate-900 bg-white text-slate-900 font-semibold inline-flex items-center justify-center gap-3">
              <Filter className="w-5 h-5" />
              Filters
            </button>
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
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-full bg-purple-600 text-white grid place-items-center font-black">
                          {initials(lead.name)}
                        </div>

                        <div>
                          <button
                            type="button"
                            onClick={() => go(`/leads/${lead.id}`)}
                            className="text-lg font-black text-slate-900 hover:text-orange-600"
                          >
                            {lead.name}
                          </button>
                          <p className="text-slate-500">{lead.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-5 text-lg text-slate-900">
                      {lead.company}
                    </td>

                    <td className="px-6 py-5 text-lg text-slate-500">
                      {lead.source}
                    </td>

                    <td className="px-6 py-5">
                      <span className={`px-3 py-1 rounded-md border text-sm font-black ${statusClass(lead.status)}`}>
                        {lead.status}
                      </span>
                    </td>

                    <td className="px-6 py-5 text-lg font-black text-slate-900">
                      {formatValue(lead.value)}
                    </td>

                    <td className="px-6 py-5">
                      <span className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 grid place-items-center font-black">
                        {lead.score || 0}
                      </span>
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4 text-slate-500">
                        <button onClick={() => go(`/leads/${lead.id}`)} className="hover:text-blue-600">
                          <Eye className="w-5 h-5" />
                        </button>
                        <button className="hover:text-orange-600">
                          <Edit3 className="w-5 h-5" />
                        </button>
                        <button className="hover:text-red-600">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {pageRows.length === 0 && (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-slate-500">
                      No leads found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-500">
              Showing {filteredLeads.length === 0 ? 0 : start + 1}-
              {Math.min(start + PER_PAGE, filteredLeads.length)} of {filteredLeads.length}
            </p>

            <div className="flex items-center gap-3">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="h-10 px-4 rounded-lg border border-slate-200 font-bold text-slate-700 disabled:opacity-40"
              >
                Previous
              </button>

              <span className="text-sm font-black text-slate-700">
                Page {page} of {totalPages}
              </span>

              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="h-10 px-4 rounded-lg border border-slate-200 font-bold text-slate-700 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </section>
      </div>
    </EmployeeShell>
  );
}
