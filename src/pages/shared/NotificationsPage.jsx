import { useEffect, useState } from "react";
import { Bell, CheckCircle2, AlertTriangle, Clock, Mail, Trophy, CheckSquare, Loader2 } from "lucide-react";
import EmployeeShell from "../../components/employee/EmployeeShell.jsx";
import { listMyNotifications } from "../../services/crmApi.js";

function iconFor(type) {
  if (type === "task") return CheckSquare;
  if (type === "lead") return Bell;
  if (type === "won") return Trophy;
  if (type === "overdue") return AlertTriangle;
  if (type === "email") return Mail;
  return Bell;
}

function colorFor(type) {
  if (type === "task") return "#2563eb";
  if (type === "lead") return "#16a34a";
  if (type === "won") return "#7c3aed";
  if (type === "overdue") return "#dc2626";
  if (type === "email") return "#f97316";
  return "#64748b";
}

function formatTime(value) {
  if (!value) return "Not assigned";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: true });
}

function normalizeNotification(row = {}) {
  return {
    id: row.id,
    type: row.type || "info",
    title: row.title || "Notification",
    desc: row.body || row.message || row.desc || "No details",
    time: formatTime(row.created_at || row.time),
    read: Boolean(row.read_at || row.is_read || row.read),
  };
}

export default function NotificationsPage() {
  const [page, setPage] = useState(1);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const size = 10;

  async function loadNotifications() {
    setLoading(true);
    setError("");
    try {
      const rows = await listMyNotifications({ limit: 500 });
      setNotifications((rows || []).map(normalizeNotification));
    } catch (err) {
      setNotifications([]);
      setError(err.message || "Unable to load Supabase notifications.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadNotifications(); }, []);

  const totalPages = Math.max(1, Math.ceil(notifications.length / size));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * size;
  const rows = notifications.slice(start, start + size);
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <EmployeeShell>
      <div className="space-y-5">
        <div>
          <p className="text-xs font-bold text-orange-600 uppercase tracking-wider">Employee Workspace</p>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight mt-1">Notifications</h1>
          <p className="text-sm text-slate-500 mt-1">Showing 10 Supabase notifications per page.</p>
        </div>

        {error ? <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">{error}</div> : null}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <section className="rounded-2xl bg-white border border-slate-200 shadow-sm p-5"><p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Total Notifications</p><h2 className="text-3xl font-bold text-slate-900 mt-2">{loading ? "..." : notifications.length}</h2></section>
          <section className="rounded-2xl bg-white border border-slate-200 shadow-sm p-5"><p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Unread</p><h2 className="text-3xl font-bold text-orange-600 mt-2">{loading ? "..." : unreadCount}</h2></section>
          <section className="rounded-2xl bg-white border border-slate-200 shadow-sm p-5"><p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Read</p><h2 className="text-3xl font-bold text-green-700 mt-2">{loading ? "..." : notifications.length - unreadCount}</h2></section>
        </div>

        <section className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <div><h2 className="text-lg font-bold text-slate-900">Recent Notifications</h2><p className="text-sm text-slate-500 mt-1">Showing {notifications.length === 0 ? 0 : start + 1}-{Math.min(start + size, notifications.length)} of {notifications.length}</p></div>
            <button type="button" onClick={loadNotifications} className="h-9 px-3 rounded-xl bg-orange-500 text-white text-sm font-bold">Refresh</button>
          </div>

          <div className="divide-y divide-slate-100">
            {rows.map((item) => {
              const Icon = iconFor(item.type);
              const color = colorFor(item.type);
              return (
                <div key={item.id} className="px-5 py-4 flex items-start gap-4 hover:bg-slate-50">
                  <div className="w-11 h-11 rounded-2xl grid place-items-center shrink-0" style={{ background: `${color}18`, color }}><Icon className="w-5 h-5" /></div>
                  <div className="min-w-0 flex-1"><div className="flex items-center gap-2 flex-wrap"><h3 className="font-bold text-slate-900">{item.title}</h3><span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${item.read ? "bg-slate-100 text-slate-600" : "bg-orange-50 text-orange-700"}`}>{item.read ? "Read" : "Unread"}</span></div><p className="text-sm text-slate-600 mt-1">{item.desc}</p><div className="flex items-center gap-2 mt-2 text-xs text-slate-500"><Clock className="w-3 h-3" /><span>{item.time}</span></div></div>
                  {!item.read && <CheckCircle2 className="w-5 h-5 text-orange-500 shrink-0 mt-2" />}
                </div>
              );
            })}
            {loading && <div className="px-5 py-10 text-center text-slate-500"><Loader2 className="w-5 h-5 animate-spin inline mr-2" />Loading Supabase notifications...</div>}
            {!loading && rows.length === 0 && <div className="px-5 py-10 text-center text-slate-500">No notifications found.</div>}
          </div>

          <div className="px-5 py-4 border-t border-slate-100 flex items-center justify-between"><button type="button" disabled={safePage === 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="h-9 px-4 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 disabled:opacity-40">Previous</button><span className="text-sm font-bold text-slate-600">Page {safePage} of {totalPages}</span><button type="button" disabled={safePage === totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))} className="h-9 px-4 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 disabled:opacity-40">Next</button></div>
        </section>
      </div>
    </EmployeeShell>
  );
}
