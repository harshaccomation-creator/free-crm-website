import { useEffect, useState } from "react";
import { Headphones, Send, TicketCheck } from "lucide-react";
import EmployeeShell from "../../components/employee/EmployeeShell.jsx";
import { supabase } from "../../lib/supabaseClient.js";

const issueTypes = ["Login Issue", "OTP Verification Issue", "Lead Issue", "Follow-up Issue", "Payment Issue", "Technical Bug", "Feature Request", "Other"];
const priorities = ["Low", "Medium", "High", "Urgent"];

function userContext() {
  return {
    user_id: window.localStorage.getItem("salesflow_user_id") || null,
    company_id: window.localStorage.getItem("salesflow_company_id") || window.localStorage.getItem("company_id") || null,
    email: window.localStorage.getItem("salesflow_user_email") || "",
    requester_name: window.localStorage.getItem("salesflow_user_name") || window.localStorage.getItem("salesflow_full_name") || "SalesFlow User",
  };
}

export default function SupportPage() {
  const [form, setForm] = useState({ category: "Login Issue", priority: "Medium", subject: "", message: "" });
  const [tickets, setTickets] = useState([]);
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadTickets() {
      if (!supabase) return;
      const user = userContext();
      let query = supabase.from("support_tickets").select("id,subject,category,priority,status,agent_name,created_at").order("created_at", { ascending: false }).limit(20);
      if (user.user_id) query = query.eq("user_id", user.user_id);
      else if (user.email) query = query.eq("email", user.email);
      const { data, error } = await query;
      if (!error && Array.isArray(data)) setTickets(data);
    }
    loadTickets();
  }, []);

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const submitTicket = async (event) => {
    event.preventDefault();
    setNotice("");
    if (!form.subject.trim() || !form.message.trim()) {
      setNotice("Subject aur message required hai.");
      return;
    }
    setLoading(true);
    const user = userContext();
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
      const { data, error } = await supabase.from("support_tickets").insert(ticket).select("id,subject,category,priority,status,agent_name,created_at").single();
      if (!error && data) {
        setTickets((prev) => [data, ...prev]);
        setNotice("Ticket create ho gaya. SalesFlow Support Team jaldi reply karegi.");
      } else {
        setTickets((prev) => [{ ...ticket, id: Date.now(), created_at: new Date().toISOString() }, ...prev]);
        setNotice("Ticket page ready hai. Supabase table add hote hi ticket backend me save hoga.");
      }
    } else {
      setTickets((prev) => [{ ...ticket, id: Date.now(), created_at: new Date().toISOString() }, ...prev]);
      setNotice("Ticket page ready hai. Backend env connect hote hi ticket save hoga.");
    }

    setForm({ category: "Login Issue", priority: "Medium", subject: "", message: "" });
    setLoading(false);
  };

  return (
    <EmployeeShell>
      <div className="space-y-5">
        <section className="rounded-3xl bg-slate-950 text-white p-6 shadow-xl">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-orange-300">SalesFlow Hub Support</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight">Help & Support</h1>
          <p className="mt-2 max-w-2xl text-sm font-medium text-slate-300">CRM issues ke liye ticket create karo. Support backend private rahega aur customer ko sirf SalesFlow support dikhega.</p>
        </section>

        {notice && <div className="rounded-2xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm font-bold text-orange-700">{notice}</div>}

        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-orange-50 text-orange-600"><Headphones className="h-5 w-5" /></div>
            <div><h2 className="text-lg font-black text-slate-900">Create Ticket</h2><p className="text-sm text-slate-500">Issue details clear likho.</p></div>
          </div>

          <form className="mt-5 space-y-4" onSubmit={submitTicket}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="space-y-2"><span className="text-xs font-black uppercase tracking-wider text-slate-500">Issue Type</span><select value={form.category} onChange={(e) => update("category", e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-800 outline-none focus:ring-2 focus:ring-orange-200">{issueTypes.map((item) => <option key={item}>{item}</option>)}</select></label>
              <label className="space-y-2"><span className="text-xs font-black uppercase tracking-wider text-slate-500">Priority</span><select value={form.priority} onChange={(e) => update("priority", e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-800 outline-none focus:ring-2 focus:ring-orange-200">{priorities.map((item) => <option key={item}>{item}</option>)}</select></label>
            </div>
            <label className="block space-y-2"><span className="text-xs font-black uppercase tracking-wider text-slate-500">Subject</span><input value={form.subject} onChange={(e) => update("subject", e.target.value)} placeholder="Example: OTP not received" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-800 outline-none focus:ring-2 focus:ring-orange-200" /></label>
            <label className="block space-y-2"><span className="text-xs font-black uppercase tracking-wider text-slate-500">Message</span><textarea value={form.message} onChange={(e) => update("message", e.target.value)} rows={6} placeholder="Issue kab aa raha hai, kaunsa page hai, screenshot/error message kya hai..." className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-orange-200" /></label>
            <button type="submit" disabled={loading} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-orange-500 px-5 py-3 text-sm font-black text-white shadow-lg shadow-orange-500/25 disabled:opacity-60"><Send className="h-4 w-4" />{loading ? "Creating Ticket..." : "Submit Ticket"}</button>
          </form>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-4"><div><h2 className="text-lg font-black text-slate-900">My Tickets</h2><p className="text-sm text-slate-500">Latest support requests.</p></div><TicketCheck className="h-5 w-5 text-orange-500" /></div>
          <div className="overflow-x-auto"><table className="min-w-full divide-y divide-slate-100 text-sm"><thead className="bg-slate-50 text-left text-xs font-black uppercase tracking-wider text-slate-500"><tr><th className="px-5 py-3">Ticket</th><th className="px-5 py-3">Category</th><th className="px-5 py-3">Priority</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Agent</th></tr></thead><tbody className="divide-y divide-slate-100">{tickets.length === 0 ? <tr><td colSpan="5" className="px-5 py-8 text-center font-bold text-slate-400">No support tickets yet.</td></tr> : tickets.map((ticket) => <tr key={ticket.id}><td className="px-5 py-4 font-black text-slate-900">{ticket.subject}</td><td className="px-5 py-4 font-semibold text-slate-600">{ticket.category}</td><td className="px-5 py-4 font-semibold text-slate-600">{ticket.priority}</td><td className="px-5 py-4"><span className="rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-black text-orange-700">{ticket.status || "Open"}</span></td><td className="px-5 py-4 font-semibold text-slate-600">{ticket.agent_name || "SalesFlow Support Team"}</td></tr>)}</tbody></table></div>
        </section>
      </div>
    </EmployeeShell>
  );
}
