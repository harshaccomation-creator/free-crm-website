import { useMemo, useState } from "react";
import { BarChart2, Phone, PhoneCall, Users, CalendarCheck, CheckCircle2, Trophy, XCircle, RotateCcw } from "lucide-react";
import EmployeeShell from "../../components/employee/EmployeeShell.jsx";

const reportRows = [
  { date: "2026-06-01", label: "Jun 1", calls: 8, connected: 5, newLeads: 3, demos: 1, postDemoFollowUp: 1, won: 0, lost: 0 },
  { date: "2026-06-02", label: "Jun 2", calls: 11, connected: 7, newLeads: 4, demos: 2, postDemoFollowUp: 1, won: 1, lost: 0 },
  { date: "2026-06-03", label: "Jun 3", calls: 9, connected: 6, newLeads: 2, demos: 1, postDemoFollowUp: 2, won: 0, lost: 1 },
  { date: "2026-06-04", label: "Jun 4", calls: 14, connected: 9, newLeads: 5, demos: 3, postDemoFollowUp: 2, won: 1, lost: 0 },
  { date: "2026-06-05", label: "Jun 5", calls: 10, connected: 6, newLeads: 4, demos: 2, postDemoFollowUp: 1, won: 0, lost: 1 },
  { date: "2026-06-06", label: "Jun 6", calls: 15, connected: 10, newLeads: 6, demos: 4, postDemoFollowUp: 3, won: 2, lost: 0 },
  { date: "2026-06-07", label: "Jun 7", calls: 12, connected: 8, newLeads: 3, demos: 2, postDemoFollowUp: 2, won: 1, lost: 0 },
  { date: "2026-06-08", label: "Jun 8", calls: 16, connected: 11, newLeads: 5, demos: 3, postDemoFollowUp: 2, won: 1, lost: 1 },
  { date: "2026-06-09", label: "Jun 9", calls: 18, connected: 12, newLeads: 7, demos: 4, postDemoFollowUp: 3, won: 2, lost: 0 },
  { date: "2026-06-10", label: "Jun 10", calls: 13, connected: 9, newLeads: 4, demos: 2, postDemoFollowUp: 2, won: 1, lost: 1 }
];

const colors = {
  connected: "#16a34a",
  calls: "#2563eb",
  demos: "#7c3aed",
  won: "#eab308"
};

function filterRows(rows, fromDate, toDate) {
  return rows.filter((row) => {
    if (fromDate && row.date < fromDate) return false;
    if (toDate && row.date > toDate) return false;
    return true;
  });
}

function sum(rows, key) {
  return rows.reduce((total, row) => total + Number(row[key] || 0), 0);
}

function makePoints(rows, key, width, height, maxValue) {
  if (!rows.length) return "";
  const step = rows.length === 1 ? 0 : width / (rows.length - 1);
  return rows.map((row, index) => {
    const x = rows.length === 1 ? width / 2 : index * step;
    const y = height - (Number(row[key] || 0) / maxValue) * height;
    return `${x},${y}`;
  }).join(" ");
}

export default function EmployeeReportsPage() {
  const [fromDate, setFromDate] = useState("2026-06-01");
  const [toDate, setToDate] = useState("2026-06-10");

  const filteredRows = useMemo(() => filterRows(reportRows, fromDate, toDate), [fromDate, toDate]);

  const totals = useMemo(() => ({
    calls: sum(filteredRows, "calls"),
    connected: sum(filteredRows, "connected"),
    newLeads: sum(filteredRows, "newLeads"),
    demos: sum(filteredRows, "demos"),
    postDemoFollowUp: sum(filteredRows, "postDemoFollowUp"),
    won: sum(filteredRows, "won"),
    lost: sum(filteredRows, "lost")
  }), [filteredRows]);

  const cards = [
    { label: "Total Calls", value: totals.calls, icon: Phone, color: "#2563eb" },
    { label: "Connected", value: totals.connected, icon: PhoneCall, color: "#16a34a" },
    { label: "New Leads", value: totals.newLeads, icon: Users, color: "#0ea5e9" },
    { label: "Demo", value: totals.demos, icon: CalendarCheck, color: "#7c3aed" },
    { label: "Post Demo Follow Up", value: totals.postDemoFollowUp, icon: CheckCircle2, color: "#059669" },
    { label: "Won", value: totals.won, icon: Trophy, color: "#eab308" },
    { label: "Lost", value: totals.lost, icon: XCircle, color: "#dc2626" }
  ];

  const chartRows = filteredRows.slice(-10);
  const maxValue = Math.max(1, ...chartRows.flatMap((row) => [row.connected, row.calls, row.demos, row.won]));
  const chartWidth = 920;
  const chartHeight = 260;
  const yTicks = [maxValue, Math.round(maxValue * 0.75), Math.round(maxValue * 0.5), Math.round(maxValue * 0.25), 0];

  const resetRange = () => {
    setFromDate("2026-06-01");
    setToDate("2026-06-10");
  };

  return (
    <EmployeeShell>
      <div className="space-y-5">
        <div className="flex flex-col xl:flex-row xl:items-end xl:justify-between gap-4">
          <div>
            <p className="text-xs font-bold text-orange-600 uppercase tracking-wider">Employee Workspace</p>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight mt-1">Reports</h1>
            <p className="text-sm text-slate-500 mt-1">Date-wise sales activity, lead movement and employee performance.</p>
          </div>

          <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-3 flex flex-col md:flex-row md:items-end gap-3">
            <label className="block">
              <span className="text-xs font-black text-slate-500 uppercase">From Date</span>
              <input type="date" value={fromDate} onChange={(event) => setFromDate(event.target.value)} className="mt-1 h-10 rounded-xl border border-slate-200 px-3 text-sm font-bold outline-none focus:ring-2 focus:ring-orange-500/20" />
            </label>

            <label className="block">
              <span className="text-xs font-black text-slate-500 uppercase">To Date</span>
              <input type="date" value={toDate} onChange={(event) => setToDate(event.target.value)} className="mt-1 h-10 rounded-xl border border-slate-200 px-3 text-sm font-bold outline-none focus:ring-2 focus:ring-orange-500/20" />
            </label>

            <button type="button" onClick={resetRange} className="h-10 px-4 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 hover:bg-slate-50 inline-flex items-center gap-2">
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-7 gap-4">
          {cards.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="rounded-2xl bg-white border border-slate-200 p-4 shadow-sm min-h-[112px]">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[11px] font-black text-slate-500 uppercase tracking-wide leading-tight">{item.label}</p>
                    <h2 className="text-3xl font-black text-slate-900 mt-3">{item.value}</h2>
                  </div>
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0" style={{ background: `${item.color}18`, color: item.color }}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <section className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900">10 Days Performance Trend</h2>
              <p className="text-sm text-slate-500 mt-1">Same date range filter applies to this chart.</p>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-slate-600">
              <span className="inline-flex items-center gap-2"><span className="w-3 h-3 rounded-full" style={{ background: colors.connected }} />Connected</span>
              <span className="inline-flex items-center gap-2"><span className="w-3 h-3 rounded-full" style={{ background: colors.calls }} />Calls</span>
              <span className="inline-flex items-center gap-2"><span className="w-3 h-3 rounded-full" style={{ background: colors.demos }} />Demos</span>
              <span className="inline-flex items-center gap-2"><span className="w-3 h-3 rounded-full" style={{ background: colors.won }} />Won</span>
            </div>
          </div>

          <div className="p-5 overflow-x-auto">
            <div className="min-w-[980px]">
              <div className="grid grid-cols-[48px_1fr] gap-3">
                <div className="relative h-[300px] text-xs font-bold text-slate-400">
                  {yTicks.map((tick, index) => (
                    <span key={`${tick}-${index}`} className="absolute right-0" style={{ top: `${(index / 4) * 260}px` }}>{tick}</span>
                  ))}
                </div>

                <div>
                  <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-[300px] overflow-visible">
                    {[0, 0.25, 0.5, 0.75, 1].map((line) => (
                      <line key={line} x1="0" x2={chartWidth} y1={chartHeight * line} y2={chartHeight * line} stroke="#e2e8f0" strokeWidth="1" />
                    ))}
                    <polyline points={makePoints(chartRows, "connected", chartWidth, chartHeight, maxValue)} fill="none" stroke={colors.connected} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                    <polyline points={makePoints(chartRows, "calls", chartWidth, chartHeight, maxValue)} fill="none" stroke={colors.calls} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                    <polyline points={makePoints(chartRows, "demos", chartWidth, chartHeight, maxValue)} fill="none" stroke={colors.demos} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                    <polyline points={makePoints(chartRows, "won", chartWidth, chartHeight, maxValue)} fill="none" stroke={colors.won} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>

                  <div className="grid mt-2 text-xs font-bold text-slate-500" style={{ gridTemplateColumns: `repeat(${Math.max(chartRows.length, 1)}, minmax(0, 1fr))` }}>
                    {chartRows.map((row) => <span key={row.date} className="text-center">{row.label}</span>)}
                  </div>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                <span>Y-axis: count/number</span>
                <span>X-axis: date, max 10 days visible</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </EmployeeShell>
  );
}
