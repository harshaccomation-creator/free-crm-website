import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, Clock3, Headphones, LockKeyhole, Paperclip, Send, TicketCheck } from "lucide-react";
import EmployeeShell from "../../components/employee/EmployeeShell.jsx";
import { supabase } from "../../lib/supabaseClient.js";
import { sendSupportTicketToZoho, zohoNoticeText } from "../../lib/zohoSupportClient.js";

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

function statusClass(status) {
  const value = String(status || "Open").toLowerCase();
  if (value.includes("closed") || value.includes("resolved")) return "done";
  if (value.includes("progress")) return "progress";
  return "open";
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
        .select("id,subject,category,priority,status,agent_name,created_at,zoho_ticket_id")
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
        .select("id,subject,category,priority,status,agent_name,created_at,zoho_ticket_id")
        .single();

      if (!error && data) {
        setTickets((prev) => [data, ...prev]);

        const zohoResult = await sendSupportTicketToZoho({ ...ticket, support_ticket_id: data.id });
        if (zohoResult?.ok && zohoResult?.zoho_ticket_id) {
          await supabase
            .from("support_tickets")
            .update({ zoho_ticket_id: String(zohoResult.zoho_ticket_id), agent_name: "Zoho Desk" })
            .eq("id", data.id);

          setTickets((prev) => prev.map((item) => item.id === data.id ? { ...item, zoho_ticket_id: String(zohoResult.zoho_ticket_id), agent_name: "Zoho Desk" } : item));
        }

        setNotice({ type: zohoResult?.ok ? "success" : "warning", text: zohoNoticeText(zohoResult) });
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
      <div className="sf-support-page">
        <style>{`
          .sf-support-page{max-width:1220px;margin:0 auto;padding:2px 0 32px;color:#0f172a;font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;background:transparent!important;}
          .sf-support-hero{position:relative;overflow:hidden;border-radius:28px;padding:30px 34px;background:linear-gradient(135deg,#07111f 0%,#0f172a 58%,#1f2937 100%);box-shadow:0 18px 45px rgba(15,23,42,.18);color:#fff;}
          .sf-support-hero:before{content:"";position:absolute;right:-80px;top:-90px;width:260px;height:260px;border-radius:999px;background:rgba(249,115,22,.28);filter:blur(24px);}
          .sf-support-hero:after{content:"";position:absolute;right:230px;bottom:-90px;width:210px;height:210px;border-radius:999px;background:rgba(59,130,246,.18);filter:blur(28px);}
          .sf-support-hero-content{position:relative;z-index:1;display:flex;gap:20px;align-items:flex-start;justify-content:space-between;}
          .sf-support-eyebrow{margin:0 0 8px;font-size:12px;font-weight:900;letter-spacing:.24em;text-transform:uppercase;color:#fdba74;}
          .sf-support-title{margin:0;font-size:36px;line-height:1.08;font-weight:950;letter-spacing:-.04em;color:#fff;}
          .sf-support-subtitle{max-width:760px;margin:12px 0 0;font-size:15px;line-height:1.7;font-weight:700;color:#cbd5e1;}
          .sf-support-badges{display:flex;gap:10px;flex-wrap:wrap;justify-content:flex-end;min-width:270px;}
          .sf-support-badge{display:flex;align-items:center;gap:8px;border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.08);color:#f8fafc;border-radius:999px;padding:10px 13px;font-size:12px;font-weight:900;white-space:nowrap;}
          .sf-support-notice{margin-top:16px;border-radius:18px;padding:13px 16px;font-size:13px;font-weight:800;border:1px solid #fed7aa;background:#fff7ed;color:#c2410c;}
          .sf-support-notice.success{border-color:#bbf7d0;background:#f0fdf4;color:#047857;}.sf-support-notice.error{border-color:#fecaca;background:#fef2f2;color:#b91c1c;}
          .sf-support-layout{display:grid;grid-template-columns:minmax(0,1fr) 340px;gap:22px;margin-top:22px;align-items:start;background:transparent!important;}
          .sf-support-card,.sf-support-side-card,.sf-support-table-card{background:#fff!important;border:1px solid #dbe4ef;border-radius:26px;box-shadow:0 12px 35px rgba(15,23,42,.07);}
          .sf-support-card{padding:24px;}
          .sf-support-card-head{display:flex;align-items:flex-start;justify-content:space-between;gap:18px;border-bottom:1px solid #e5edf6;padding-bottom:18px;margin-bottom:20px;}
          .sf-support-card-title-wrap{display:flex;gap:14px;align-items:flex-start;}
          .sf-support-icon{width:48px;height:48px;border-radius:18px;background:#fff7ed;color:#f97316;display:grid;place-items:center;flex:0 0 48px;}
          .sf-support-card h2{margin:0;font-size:22px;line-height:1.2;font-weight:950;color:#0f172a;letter-spacing:-.02em;}
          .sf-support-card p{margin:7px 0 0;font-size:14px;line-height:1.55;font-weight:700;color:#64748b;}
          .sf-support-lock{display:inline-flex;align-items:center;gap:8px;border:1px solid #dbe4ef;background:#f8fafc;color:#475569;border-radius:999px;padding:10px 13px;font-size:12px;font-weight:900;white-space:nowrap;}
          .sf-support-form{display:grid;gap:18px;}
          .sf-support-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px;}
          .sf-support-field{display:grid;gap:8px;}
          .sf-support-label{font-size:12px;font-weight:950;letter-spacing:.08em;text-transform:uppercase;color:#52637a;}
          .sf-support-input,.sf-support-select,.sf-support-textarea{width:100%;box-sizing:border-box;border:1px solid #d5dfeb;background:#fff;color:#0f172a;border-radius:18px;padding:14px 16px;font-size:14px;font-weight:800;outline:none;box-shadow:0 6px 16px rgba(15,23,42,.035);transition:border-color .15s ease,box-shadow .15s ease;}
          .sf-support-input::placeholder,.sf-support-textarea::placeholder{color:#8b98a9;}
          .sf-support-input:focus,.sf-support-select:focus,.sf-support-textarea:focus{border-color:#f97316;box-shadow:0 0 0 4px rgba(249,115,22,.14);}
          .sf-support-textarea{min-height:142px;resize:vertical;line-height:1.6;}
          .sf-support-attach{display:flex;align-items:center;justify-content:space-between;gap:12px;border:1px dashed #cbd5e1;background:#f8fafc;border-radius:18px;padding:14px 16px;color:#52637a;font-size:13px;font-weight:800;cursor:pointer;}
          .sf-support-attach:hover{border-color:#f97316;background:#fff7ed;}.sf-support-attach input{display:none;}
          .sf-support-choose{border-radius:999px;background:#fff;color:#f97316;padding:6px 11px;font-size:12px;font-weight:950;box-shadow:0 4px 12px rgba(15,23,42,.08);}
          .sf-support-form-footer{display:flex;gap:16px;align-items:center;justify-content:space-between;flex-wrap:wrap;}
          .sf-support-note{max-width:560px;margin:0;font-size:12px;line-height:1.55;font-weight:750;color:#64748b;}
          .sf-support-submit{display:inline-flex;align-items:center;justify-content:center;gap:9px;border:0;border-radius:17px;background:#f97316;color:#fff;padding:14px 18px;font-size:14px;font-weight:950;box-shadow:0 12px 22px rgba(249,115,22,.26);cursor:pointer;transition:transform .15s ease,background .15s ease;}
          .sf-support-submit:hover{background:#ea580c;transform:translateY(-1px);}.sf-support-submit:disabled{opacity:.65;cursor:not-allowed;transform:none;}
          .sf-support-side{display:grid!important;gap:14px!important;background:#f1f5f9!important;border:1px solid #dbe4ef!important;border-radius:26px!important;padding:14px!important;box-shadow:0 12px 35px rgba(15,23,42,.06)!important;align-self:start!important;}
          .sf-support-side-card{padding:20px!important;border-radius:20px!important;box-shadow:none!important;background:#fff!important;min-height:0!important;}
          .sf-support-side-card h3{margin:12px 0 0;font-size:17px;font-weight:950;color:#0f172a;}.sf-support-side-card p{margin:8px 0 0;font-size:13px;line-height:1.65;font-weight:750;color:#64748b;}
          .sf-support-side-icon{width:38px;height:38px;border-radius:14px;display:grid;place-items:center;background:#f8fafc;}.sf-support-side-icon.orange{color:#f97316;background:#fff7ed;}.sf-support-side-icon.green{color:#10b981;background:#ecfdf5;}.sf-support-side-icon.blue{color:#2563eb;background:#eff6ff;}
          .sf-support-table-card{margin-top:22px;overflow:hidden;}
          .sf-support-table-head{display:flex;justify-content:space-between;align-items:center;gap:16px;padding:19px 22px;border-bottom:1px solid #e5edf6;}.sf-support-table-head h2{margin:0;font-size:18px;font-weight:950;color:#0f172a;}.sf-support-table-head p{margin:4px 0 0;font-size:13px;font-weight:750;color:#64748b;}
          .sf-support-table-scroll{overflow-x:auto;}.sf-support-table{width:100%;border-collapse:collapse;font-size:13px;}.sf-support-table th{background:#f8fafc;text-align:left;padding:13px 18px;color:#52637a;font-size:11px;font-weight:950;letter-spacing:.08em;text-transform:uppercase;}.sf-support-table td{padding:15px 18px;border-top:1px solid #eef2f7;font-weight:750;color:#475569;}.sf-support-table td:first-child{font-weight:950;color:#0f172a;}.sf-support-empty{text-align:center!important;color:#94a3b8!important;padding:28px!important;}
          .sf-support-status{display:inline-flex;border-radius:999px;padding:6px 10px;font-size:11px;font-weight:950;border:1px solid #fed7aa;background:#fff7ed;color:#c2410c;}.sf-support-status.done{border-color:#bbf7d0;background:#f0fdf4;color:#047857;}.sf-support-status.progress{border-color:#bfdbfe;background:#eff6ff;color:#1d4ed8;}
          @media(max-width:1100px){.sf-support-layout{grid-template-columns:1fr}.sf-support-side{grid-template-columns:repeat(3,minmax(0,1fr));}.sf-support-badges{justify-content:flex-start;}.sf-support-hero-content{flex-direction:column;}}
          @media(max-width:760px){.sf-support-page{padding:0 0 24px}.sf-support-hero{padding:24px 20px;border-radius:22px}.sf-support-title{font-size:30px}.sf-support-layout{gap:16px}.sf-support-card{padding:18px;border-radius:22px}.sf-support-grid{grid-template-columns:1fr}.sf-support-side{grid-template-columns:1fr!important;padding:10px!important;border-radius:22px!important;}.sf-support-side-card{border-radius:18px!important;padding:18px!important}.sf-support-card-head{flex-direction:column}.sf-support-lock{white-space:normal}.sf-support-submit{width:100%;}.sf-support-table-head{align-items:flex-start;}.sf-support-badges{min-width:0;}}
        `}</style>

        <section className="sf-support-hero">
          <div className="sf-support-hero-content">
            <div>
              <p className="sf-support-eyebrow">SalesFlow Hub In-App Support</p>
              <h1 className="sf-support-title">CRM Help & Support</h1>
              <p className="sf-support-subtitle">Submit CRM-related issues including leads, follow-ups, tasks, reports, payments, dashboards, and technical bugs.</p>
            </div>
            <div className="sf-support-badges">
              <span className="sf-support-badge"><LockKeyhole size={15} /> Private team review</span>
              <span className="sf-support-badge"><TicketCheck size={15} /> Sent to Zoho Desk</span>
            </div>
          </div>
        </section>

        {notice.text && <div className={`sf-support-notice ${notice.type}`}>{notice.text}</div>}

        <div className="sf-support-layout">
          <section className="sf-support-card">
            <div className="sf-support-card-head">
              <div className="sf-support-card-title-wrap">
                <div className="sf-support-icon"><Headphones size={22} /></div>
                <div>
                  <h2>Create CRM Support Ticket</h2>
                  <p>For login or OTP issues, please use the Public Support page from the login screen.</p>
                </div>
              </div>
              <span className="sf-support-lock"><LockKeyhole size={15} /> Secure internal request</span>
            </div>

            <form className="sf-support-form" onSubmit={submitTicket}>
              <div className="sf-support-grid">
                <label className="sf-support-field">
                  <span className="sf-support-label">Issue Type</span>
                  <select value={form.category} onChange={(e) => update("category", e.target.value)} className="sf-support-select">
                    {issueTypes.map((item) => <option key={item}>{item}</option>)}
                  </select>
                </label>
                <label className="sf-support-field">
                  <span className="sf-support-label">Priority</span>
                  <select value={form.priority} onChange={(e) => update("priority", e.target.value)} className="sf-support-select">
                    {priorities.map((item) => <option key={item}>{item}</option>)}
                  </select>
                </label>
              </div>

              <label className="sf-support-field">
                <span className="sf-support-label">Subject</span>
                <input value={form.subject} onChange={(e) => update("subject", e.target.value)} placeholder="Example: Follow-up reminder not showing" className="sf-support-input" />
              </label>

              <label className="sf-support-field">
                <span className="sf-support-label">Message</span>
                <textarea value={form.message} onChange={(e) => update("message", e.target.value)} placeholder="Describe the issue, where it occurred, what error was shown, and when it started." className="sf-support-textarea" />
              </label>

              <label className="sf-support-attach">
                <span><Paperclip size={16} style={{ verticalAlign: "middle", marginRight: 8 }} />{form.attachmentName || "Attach screenshot or PDF (optional)"}</span>
                <input type="file" accept="image/*,.pdf" onChange={(e) => update("attachmentName", e.target.files?.[0]?.name || "")} />
                <span className="sf-support-choose">Choose</span>
              </label>

              <div className="sf-support-form-footer">
                <p className="sf-support-note">Do not include passwords, OTPs, or confidential customer credentials in the message.</p>
                <button type="submit" disabled={loading} className="sf-support-submit"><Send size={16} />{loading ? "Creating Ticket..." : "Submit Ticket"}</button>
              </div>
            </form>
          </section>

          <aside className="sf-support-side">
            <div className="sf-support-side-card">
              <div className="sf-support-side-icon orange"><Clock3 size={20} /></div>
              <h3>Typical response time</h3>
              <p>Most support requests are reviewed inside Zoho Desk during business hours.</p>
            </div>
            <div className="sf-support-side-card">
              <div className="sf-support-side-icon green"><CheckCircle2 size={20} /></div>
              <h3>Before submitting</h3>
              <p>Include the affected page, user role, error message, and steps to reproduce the issue.</p>
            </div>
            <div className="sf-support-side-card">
              <div className="sf-support-side-icon blue"><AlertTriangle size={20} /></div>
              <h3>Security reminder</h3>
              <p>Never share passwords or OTPs. SalesFlow Support will never ask for OTP details.</p>
            </div>
          </aside>
        </div>

        <section className="sf-support-table-card">
          <div className="sf-support-table-head">
            <div>
              <h2>My CRM Tickets</h2>
              <p>Latest in-app support requests and status updates.</p>
            </div>
            <TicketCheck size={22} color="#f97316" />
          </div>
          <div className="sf-support-table-scroll">
            <table className="sf-support-table">
              <thead>
                <tr><th>Ticket</th><th>Category</th><th>Priority</th><th>Status</th><th>Agent</th><th>Created</th></tr>
              </thead>
              <tbody>
                {tickets.length === 0 ? (
                  <tr><td colSpan="6" className="sf-support-empty">No support tickets yet.</td></tr>
                ) : tickets.map((ticket) => (
                  <tr key={ticket.id}>
                    <td>{ticket.subject}</td>
                    <td>{ticket.category}</td>
                    <td>{ticket.priority}</td>
                    <td><span className={`sf-support-status ${statusClass(ticket.status)}`}>{ticket.status || "Open"}</span></td>
                    <td>{ticket.agent_name || "SalesFlow Support Team"}</td>
                    <td>{ticket.created_at ? new Date(ticket.created_at).toLocaleString() : "-"}</td>
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
