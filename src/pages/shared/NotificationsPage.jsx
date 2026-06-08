import { useState } from "react";
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Mail,
  Trophy,
  CheckSquare
} from "lucide-react";
import EmployeeShell from "../../components/employee/EmployeeShell.jsx";
import { empNotifications } from "../../data/employeeData.js";

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

export default function NotificationsPage() {
  const [page, setPage] = useState(1);
  const size = 10;

  const totalPages = Math.max(1, Math.ceil(empNotifications.length / size));
  const start = (page - 1) * size;
  const rows = empNotifications.slice(start, start + size);

  const unreadCount = empNotifications.filter((n) => !n.read).length;

  return (
    <EmployeeShell>
      <div className="space-y-5">
        <div>
          <p className="text-xs font-bold text-orange-600 uppercase tracking-wider">
            Employee Workspace
          </p>

          <h1 className="text-3xl font-bold text-slate-900 tracking-tight mt-1">
            Notifications
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            Showing 10 notifications per page.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <section className="rounded-2xl bg-white border border-slate-200 shadow-sm p-5">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">
              Total Notifications
            </p>
            <h2 className="text-3xl font-bold text-slate-900 mt-2">
              {empNotifications.length}
            </h2>
          </section>

          <section className="rounded-2xl bg-white border border-slate-200 shadow-sm p-5">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">
              Unread
            </p>
            <h2 className="text-3xl font-bold text-orange-600 mt-2">
              {unreadCount}
            </h2>
          </section>

          <section className="rounded-2xl bg-white border border-slate-200 shadow-sm p-5">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">
              Read
            </p>
            <h2 className="text-3xl font-bold text-green-700 mt-2">
              {empNotifications.length - unreadCount}
            </h2>
          </section>
        </div>

        <section className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Recent Notifications
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Showing {empNotifications.length === 0 ? 0 : start + 1}-
                {Math.min(start + size, empNotifications.length)} of{" "}
                {empNotifications.length}
              </p>
            </div>

            <button className="h-9 px-3 rounded-xl bg-orange-500 text-white text-sm font-bold">
              Mark all read
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {rows.map((item) => {
              const Icon = iconFor(item.type);
              const color = colorFor(item.type);

              return (
                <div
                  key={item.id}
                  className="px-5 py-4 flex items-start gap-4 hover:bg-slate-50"
                >
                  <div
                    className="w-11 h-11 rounded-2xl grid place-items-center shrink-0"
                    style={{ background: `${color}18`, color }}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-slate-900">
                        {item.title}
                      </h3>

                      <span
                        className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                          item.read
                            ? "bg-slate-100 text-slate-600"
                            : "bg-orange-50 text-orange-700"
                        }`}
                      >
                        {item.read ? "Read" : "Unread"}
                      </span>
                    </div>

                    <p className="text-sm text-slate-600 mt-1">
                      {item.desc}
                    </p>

                    <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                      <Clock className="w-3 h-3" />
                      <span>{item.time}</span>
                    </div>
                  </div>

                  {!item.read && (
                    <CheckCircle2 className="w-5 h-5 text-orange-500 shrink-0 mt-2" />
                  )}
                </div>
              );
            })}

            {rows.length === 0 && (
              <div className="px-5 py-10 text-center text-slate-500">
                No notifications found.
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
