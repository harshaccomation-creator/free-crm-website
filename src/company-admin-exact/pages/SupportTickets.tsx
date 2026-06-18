import { useEffect, useMemo, useState } from "react";
import { AlertCircle, CheckCircle2, Clock3, Inbox, Mail, RefreshCw, Search, TicketCheck } from "lucide-react";
import { supabase } from "../../lib/supabaseClient.js";

type SupportTicket = {
  id: string;
  email?: string | null;
  requester_name?: string | null;
  subject: string;
  category: string;
  priority: string;
  message: string;
  status: string;
  agent_name?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  zoho_ticket_id?: string | null;
};

const statusOptions = ["Open", "In Progress", "Resolved", "Closed"];

function statusBadge(status?: string) {
  const value = String(status || "Open").toLowerCase();
  if (value.includes("closed") || value.includes("resolved")) return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (value.includes("progress")) return "bg-blue-50 text-blue-700 border-blue-200";
  return "bg-orange-50 text-orange-700 border-orange-200";
}

function priorityBadge(priority?: string) {
  const value = String(priority || "Medium").toLowerCase();
  if (value.includes("critical") || value.includes("urgent") || value.includes("high")) return "bg-red-50 text-red-700 border-red-200";
  if (value.includes("low")) return "bg-slate-50 text-slate-600 border-slate-200";
  return "bg-amber-50 text-amber-700 border-amber-200";
}

export default function SupportTickets() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState("");

  const loadTickets = async () => {
    setLoading(true);
    setNotice("");
    const { data, error } = await supabase
      .from("support_tickets")
      .select("id,email,requester_name,subject,category,priority,message,status,agent_name,created_at,updated_at,zoho_ticket_id")
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) {
      setNotice("Unable to load support tickets. Please check Supabase permissions.");
      setLoading(false);
      return;
    }

    const rows = Array.isArray(data) ? data : [];
    setTickets(rows as SupportTicket[]);
    if (!selectedId && rows[0]?.id) setSelectedId(rows[0].id);
    setLoading(false);
  };

  useEffect(() => {
    loadTickets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredTickets = useMemo(() => {
    const search = query.trim().toLowerCase();
    return tickets.filter((ticket) => {
      const matchesStatus = statusFilter === "All" || ticket.status === statusFilter;
      const haystack = `${ticket.subject || ""} ${ticket.email || ""} ${ticket.category || ""} ${ticket.message || ""}`.toLowerCase();
      return matchesStatus && (!search || haystack.includes(search));
    });
  }, [tickets, query, statusFilter]);

  const selectedTicket = filteredTickets.find((ticket) => ticket.id === selectedId) || filteredTickets[0];

  const updateStatus = async (ticketId: string, status: string) => {
    setNotice("");
    const { error } = await supabase
      .from("support_tickets")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", ticketId);

    if (error) {
      setNotice("Status update failed. Please check update policy in Supabase.");
      return;
    }

    setTickets((prev) => prev.map((ticket) => ticket.id === ticketId ? { ...ticket, status, updated_at: new Date().toISOString() } : ticket));
    setNotice("Ticket status updated successfully.");
  };

  const totalOpen = tickets.filter((ticket) => ticket.status === "Open").length;
  const totalProgress = tickets.filter((ticket) => ticket.status === "In Progress").length;
  const totalClosed = tickets.filter((ticket) => ["Resolved", "Closed"].includes(ticket.status)).length;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-slate-950 p-6 text-white shadow-xl">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.28em] text-orange-300">SalesFlow Support Desk</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight">Support Tickets</h1>
            <p className="mt-2 max-w-2xl text-sm font-semibold text-slate-300">Review CRM support requests, inspect customer messages, and update ticket status.</p>
          </div>
          <button onClick={loadTickets} className="inline-flex w-fit items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-black text-slate-950 shadow-sm hover:bg-slate-100">
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Refresh
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><Inbox className="h-5 w-5 text-orange-500" /><p className="mt-3 text-xs font-black uppercase text-slate-500">Total Tickets</p><h3 className="text-2xl font-black text-slate-950">{tickets.length}</h3></div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><AlertCircle className="h-5 w-5 text-orange-500" /><p className="mt-3 text-xs font-black uppercase text-slate-500">Open</p><h3 className="text-2xl font-black text-slate-950">{totalOpen}</h3></div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><Clock3 className="h-5 w-5 text-blue-500" /><p className="mt-3 text-xs font-black uppercase text-slate-500">In Progress</p><h3 className="text-2xl font-black text-slate-950">{totalProgress}</h3></div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><CheckCircle2 className="h-5 w-5 text-emerald-500" /><p className="mt-3 text-xs font-black uppercase text-slate-500">Resolved / Closed</p><h3 className="text-2xl font-black text-slate-950">{totalClosed}</h3></div>
      </div>

      {notice && <div className="rounded-xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm font-bold text-orange-700">{notice}</div>}

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-slate-100 p-4 md:flex-row md:items-center md:justify-between">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by subject, email, category, or message..." className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm font-bold text-slate-800 outline-none focus:border-orange-300 focus:ring-4 focus:ring-orange-100" />
            </div>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-bold text-slate-800 outline-none focus:border-orange-300 focus:ring-4 focus:ring-orange-100">
              <option>All</option>
              {statusOptions.map((status) => <option key={status}>{status}</option>)}
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100 text-sm">
              <thead className="bg-slate-50 text-left text-xs font-black uppercase tracking-wider text-slate-500">
                <tr><th className="px-4 py-3">Ticket</th><th className="px-4 py-3">User</th><th className="px-4 py-3">Priority</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Created</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTickets.length === 0 ? (
                  <tr><td colSpan={5} className="px-4 py-8 text-center font-bold text-slate-400">No support tickets found.</td></tr>
                ) : filteredTickets.map((ticket) => (
                  <tr key={ticket.id} onClick={() => setSelectedId(ticket.id)} className={`cursor-pointer hover:bg-orange-50/40 ${selectedTicket?.id === ticket.id ? "bg-orange-50/60" : ""}`}>
                    <td className="px-4 py-4"><p className="font-black text-slate-950">{ticket.subject}</p><p className="mt-1 text-xs font-semibold text-slate-500">{ticket.category}</p></td>
                    <td className="px-4 py-4 font-semibold text-slate-600">{ticket.email || "-"}</td>
                    <td className="px-4 py-4"><span className={`rounded-full border px-3 py-1 text-xs font-black ${priorityBadge(ticket.priority)}`}>{ticket.priority}</span></td>
                    <td className="px-4 py-4"><span className={`rounded-full border px-3 py-1 text-xs font-black ${statusBadge(ticket.status)}`}>{ticket.status || "Open"}</span></td>
                    <td className="px-4 py-4 font-semibold text-slate-500">{ticket.created_at ? new Date(ticket.created_at).toLocaleString() : "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          {selectedTicket ? (
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase tracking-wider text-slate-500">Selected Ticket</p>
                  <h2 className="mt-1 text-xl font-black text-slate-950">{selectedTicket.subject}</h2>
                </div>
                <TicketCheck className="h-5 w-5 text-orange-500" />
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs font-black uppercase text-slate-500">Requester</p>
                <p className="mt-1 font-black text-slate-950">{selectedTicket.requester_name || "SalesFlow User"}</p>
                <p className="mt-1 flex items-center gap-2 text-sm font-semibold text-slate-600"><Mail className="h-4 w-4" />{selectedTicket.email || "No email"}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-slate-200 p-3"><p className="text-xs font-black uppercase text-slate-500">Category</p><p className="mt-1 text-sm font-black text-slate-900">{selectedTicket.category}</p></div>
                <div className="rounded-xl border border-slate-200 p-3"><p className="text-xs font-black uppercase text-slate-500">Priority</p><p className="mt-1 text-sm font-black text-slate-900">{selectedTicket.priority}</p></div>
              </div>

              <label className="block space-y-2">
                <span className="text-xs font-black uppercase tracking-wider text-slate-500">Update Status</span>
                <select value={selectedTicket.status || "Open"} onChange={(e) => updateStatus(selectedTicket.id, e.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-bold text-slate-800 outline-none focus:border-orange-300 focus:ring-4 focus:ring-orange-100">
                  {statusOptions.map((status) => <option key={status}>{status}</option>)}
                </select>
              </label>

              <div className="rounded-xl border border-slate-200 p-4">
                <p className="text-xs font-black uppercase text-slate-500">Message</p>
                <p className="mt-2 whitespace-pre-wrap text-sm font-semibold leading-6 text-slate-700">{selectedTicket.message || "No message provided."}</p>
              </div>
            </div>
          ) : (
            <div className="py-16 text-center"><Inbox className="mx-auto h-10 w-10 text-slate-300" /><p className="mt-3 font-bold text-slate-500">Select a support ticket to view details.</p></div>
          )}
        </aside>
      </div>
    </div>
  );
}
