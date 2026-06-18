import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, Clock3, Headphones, LockKeyhole, Paperclip, Send, Sparkles, TicketCheck } from "lucide-react";
import EmployeeShell from "../../components/employee/EmployeeShell.jsx";
import { supabase } from "../../lib/supabaseClient.js";

const issueTypes = ["Lead Management Issue", "Follow-up Issue", "Task Issue", "Payment Issue", "Report Issue", "Dashboard Issue", "Technical Bug", "Feature Request", "Other"];
const priorities = ["Low", "Medium", "High", "Critical"];

function userContext() {
  return {
    user_id: window.localStorage.getItem("salesflow_user_id") || null,
    company_id: window.localStorage.getItem("salesflow_company_id") || window.localStorage.getItem("company_id") || null,
    email: window.localStorage.getItem("salesflow_user_email") || "",
    requester_name: window.localStorage.getItem("salesflow_user_name") || window.localStorage.getItem("salesflow_full_name") || "SalesFlow User",
  };
}

function statusStyle(status) {
  const value = String(status || "Open").toLowerCase();
  if (value.includes("closed") || value.includes("resolved")) return "border-emerald-200 bg-emerald-50 text-emerald-700";
  if (value.includes("progress")) return "border-blue-200 bg-blue-50 text-blue-700";
  return "border-orange-200 bg-orange-50 text-orange-700";
}

export default function SupportPage() {
  const user = useMemo(() => userContext(), []);
  const [form, setForm] = useState({ category: "Lead Management Issue", priority: "Medium", subject: "", message: "", attachmentName: "" });
  const [tickets, setTickets] = useState([]);
  const [notice, setNotice] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadTickets() {
      if (!supabase) return;
      let query = supabase
        .from("support_tickets")
        .select("id,subject,category,priority,status,agent_name,created_at")
        .order("created_at", { ascending: false })
        .limit(20);

      if (user.user_id) query = query.eq("user_id", user.user_id);
      else if (user.email) query = query.eq("email", user.email);

      const { data, error } = await query;
      if (!error && Array.isArray(data)) setTickets(data);
    }
    loadTickets();
  }, [user.email, user.user_id]);

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const submitTicket = async (event) => {
    event.preventDefault();
    setNotice({ type: "", text: "" });

    if (!form.subject.trim() || !form.message.trim()) {
      setNotice({ type: "error", text: "Subject and message are required." });
      return;
    }

    setLoading(true);
    const ticket = {
      ...user,
      subject: form.subject.trim(),
      category: form.category,
      priority: form.priority,
      message: form.message.trim(),
      status: "Open",
      agent_name: "SalesFlow Support Team",
      zoho_ticket_id: null,
    };

    if (supabase) {
      const { data, error } = await supabase
        .from("support_tickets")
        .insert(ticket)
        .select("id,subject,category,priority,status,agent_name,created_at")
        .single();

      if (!error && data) {
        setTickets((prev) => [data, ...prev]);
        setNotice({ type: "success", text: "Your support ticket has been created. SalesFlow Support will review it shortly." });
      } else {
        setTickets((prev) => [{ ...ticket, id: Date.now(), created_at: new Date().toISOString() }, ...prev]);
        setNotice({ type: "warning", text: "The support page is ready. Backend ticket storage will work after the Supabase support table is connected." });
      }
    } else {
      setTickets((prev) => [{ ...ticket, id: Date.now(), created_at: new Date().toISOString() }, ...prev]);
      setNotice({ type: "warning", text: "The support page is ready. Backend connection is not configured yet." });
    }

    setForm({ category: "Lead Management Issue", priority: "Medium", subject: "", message: "", attachmentName: "" });
    setLoading(false);
  };

  return (
    <EmployeeShell>
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="relative overflow-hidden rounded-[28px] bg-slate-950 p-6 text-white shadow-xl md:p-8">
          <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-orange-500/25 blur-3xl" />
          <div className="absolute bottom-0 right-44 h-36 w-36 rounded-full bg-blue-500/20 blur-3xl" />
          <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.28em] text-orange-300">SalesFlow Hub In-App Support</p>
              <h1 className="mt-2 text-3xl font-black tracking-tight md:text-4xl">CRM Help & Support</h1>
              <p className="mt-3 max-w-3xl text-sm font-semibold leading-6 text-slate-300 md:text-base">
                Submit CRM-related issues including leads, follow-ups, tasks, reports, payments, dashboards, and technical bugs.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:min-w-[320px]">
              <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                <Sparkles className="h-5 w-5 text-orange-300" />
                <p className="mt-2 text-xs font-bold text-slate-300">Support Mode</p>
                <strong className="text-sm">Private Team Review</strong>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                <TicketCheck className="h-5 w-5 text-blue-300" />
                <p className="mt-2 text-xs font-bold text-slate-300">Ticket Status</p>
                <strong className="text-sm">Track in CRM</strong>
              </div>
            </div>
          </div>
        </section>

        {notice.text && (
          <div className={`rounded-2xl border px-4 py-3 text-sm font-bold ${notice.type === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : notice.type === "error" ? "border-red-200 bg-red-50 text-red-700" : "border-orange-200 bg-orange-50 text-orange-700"}`}>
            {notice.text}
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
            <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 md:flex-row md:items-center md:justify-between">
              <div className="flex items-start gap-4">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-orange-50 text-orange-600">
                  <Headphones className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-950">Create CRM Support Ticket</h2>
                  <p className="mt-1 text-sm font-semibold text-slate-500">
                    For login or OTP issues, please use the Public Support page from the login screen.
                  </p>
                </div>
              </div>
              <span className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-black text-slate-600">
                <LockKeyhole className="h-3.5 w-3.5" /> Secure internal request
              </span>
            </div>

            <form className="mt-6 space-y-5" onSubmit={submitTicket}>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-500">Issue Type</span>
                  <select value={form.category} onChange={(e) => update("category", e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-800 shadow-sm outline-none transition focus:border-orange-300 focus:ring-4 focus:ring-orange-100">
                    {issueTypes.map((item) => <option key={item}>{item}</option>)}
                  </select>
                </label>

                <label className="space-y-2">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-500">Priority</span>
                  <select value={form.priority} onChange={(e) => update("priority", e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-800 shadow-sm outline-none transition focus:border-orange-300 focus:ring-4 focus:ring-orange-100">
                    {priorities.map((item) => <option key={item}>{item}</option>)}
                  </select>
                </label>
              </div>

              <label className="block space-y-2">
                <span className="text-xs font-black uppercase tracking-wider text-slate-500">Subject</span>
                <input value={form.subject} onChange={(e) => update("subject", e.target.value)} placeholder="Example: Follow-up reminder not showing" className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-800 shadow-sm outline-none transition focus:border-orange-300 focus:ring-4 focus:ring-orange-100" />
              </label>

              <label className="block space-y-2">
                <span className="text-xs font-black uppercase tracking-wider text-slate-500">Message</span>
                <textarea value={form.message} onChange={(e) => update("message", e.target.value)} rows={7} placeholder="Describe the issue, where it occurred, what error was shown, and when it started." className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 shadow-sm outline-none transition focus:border-orange-300 focus:ring-4 focus:ring-orange-100" />
              </label>

              <label className="flex cursor-pointer items-center justify-between gap-3 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-4 text-sm font-bold text-slate-600 transition hover:border-orange-300 hover:bg-orange-50/40">
                <span className="flex items-center gap-2"><Paperclip className="h-4 w-4" />{form.attachmentName || "Attach screenshot or PDF (optional)"}</span>
                <input type="file" accept="image/*,.pdf" className="hidden" onChange={(e) => update("attachmentName", e.target.files?.[0]?.name || "")} />
                <span className="rounded-full bg-white px-3 py-1 text-xs text-orange-600 shadow-sm">Choose</span>
              </label>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs font-semibold text-slate-500">
                  Do not include passwords, OTPs, or confidential customer credentials in the message.
                </p>
                <button type="submit" disabled={loading} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-orange-500 px-5 py-3 text-sm font-black text-white shadow-lg shadow-orange-500/25 transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60">
                  <Send className="h-4 w-4" />{loading ? "Creating Ticket..." : "Submit Ticket"}
                </button>
              </div>
            </form>
          </section>

          <aside className="space-y-4">
            <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
              <Clock3 className="h-5 w-5 text-orange-500" />
              <h3 className="mt-3 font-black text-slate-950">Typical response time</h3>
              <p className="mt-1 text-sm font-semibold leading-6 text-slate-500">Most support requests are reviewed during business hours.</p>
            </div>
            <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              <h3 className="mt-3 font-black text-slate-950">Before submitting</h3>
              <p className="mt-1 text-sm font-semibold leading-6 text-slate-500">Include the affected page, user role, error message, and steps to reproduce the issue.</p>
            </div>
            <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
              <AlertTriangle className="h-5 w-5 text-blue-500" />
              <h3 className="mt-3 font-black text-slate-950">Security reminder</h3>
              <p className="mt-1 text-sm font-semibold leading-6 text-slate-500">Never share passwords or OTPs. SalesFlow Support will never ask for OTP details.</p>
            </div>
          </aside>
        </div>

        <section className="rounded-[28px] border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="flex flex-col gap-2 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-black text-slate-950">My CRM Tickets</h2>
              <p className="text-sm font-semibold text-slate-500">Latest in-app support requests and status updates.</p>
            </div>
            <TicketCheck className="h-5 w-5 text-orange-500" />
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100 text-sm">
              <thead className="bg-slate-50 text-left text-xs font-black uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-5 py-3">Ticket</th>
                  <th className="px-5 py-3">Category</th>
                  <th className="px-5 py-3">Priority</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Agent</th>
                  <th className="px-5 py-3">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tickets.length === 0 ? (
                  <tr><td colSpan="6" className="px-5 py-8 text-center font-bold text-slate-400">No support tickets yet.</td></tr>
                ) : tickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-slate-50/80">
                    <td className="px-5 py-4 font-black text-slate-950">{ticket.subject}</td>
                    <td className="px-5 py-4 font-semibold text-slate-600">{ticket.category}</td>
                    <td className="px-5 py-4 font-semibold text-slate-600">{ticket.priority}</td>
                    <td className="px-5 py-4"><span className={`rounded-full border px-3 py-1 text-xs font-black ${statusStyle(ticket.status)}`}>{ticket.status || "Open"}</span></td>
                    <td className="px-5 py-4 font-semibold text-slate-600">{ticket.agent_name || "SalesFlow Support Team"}</td>
                    <td className="px-5 py-4 font-semibold text-slate-500">{ticket.created_at ? new Date(ticket.created_at).toLocaleString() : "-"}</td>
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
