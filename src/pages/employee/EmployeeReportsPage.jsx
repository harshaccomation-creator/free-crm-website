import { useMemo, useState } from "react";
import { BarChart2, TrendingUp, Users, Trophy, Activity, RotateCcw } from "lucide-react";
import EmployeeShell from "../../components/employee/EmployeeShell.jsx";

const stats = [
  { label: "Lead Growth", value: "+18%", icon: TrendingUp, color: "#16a34a" },
  { label: "Total Leads", value: "128", icon: Users, color: "#2563eb" },
  { label: "Won Deals", value: "18", icon: Trophy, color: "#f97316" },
  { label: "Activities", value: "240", icon: Activity, color: "#7c3aed" }
];

const trendRows = [
  { date: "2026-06-01", label: "Jun 1", connected: 5, calls: 8, demos: 1, won: 0 },
  { date: "2026-06-02", label: "Jun 2", connected: 7, calls: 11, demos: 2, won: 1 },
  { date: "2026-06-03", label: "Jun 3", connected: 6, calls: 9, demos: 1, won: 0 },
  { date: "2026-06-04", label: "Jun 4", connected: 9, calls: 14, demos: 3, won: 1 },
  { date: "2026-06-05", label: "Jun 5", connected: 6, calls: 10, demos: 2, won: 0 },
  { date: "2026-06-06", label: "Jun 6", connected: 10, calls: 15, demos: 4, won: 2 },
  { date: "2026-06-07", label: "Jun 7", connected: 8, calls: 12, demos: 2, won: 1 },
  { date: "2026-06-08", label: "Jun 8", connected: 11, calls: 16, demos: 3, won: 1 },
  { date: "2026-06-09", label: "Jun 9", connected: 12, calls: 18, demos: 4, won: 2 },
  { date: "2026-06-10", label: "Jun 10", connected: 9, calls: 13, demos: 2, won: 1 }
];

const lineMeta = {
  connected: { label: "Connected", color: "#16a34a" },
  calls: { label: "Calls", color: "#2563eb" },
  demos: { label: "Demos", color: "#7c3aed" },
  won: { label: "Won", color: "#eab308" }
};

function makePoints(rows, key, width, height, maxValue) {
  if (!rows.length) return "";
  const step = rows.length === 1 ? 0 : width / (rows.length - 1);
  return rows.map((row, index) => {
    const x = rows.length === 1 ? width / 2 : index * step;
    const y = height - (Number(row[key] || 0) / maxValue) * height;
    return `${x},${y}`;
  }).join(" ");
}

function pointList(rows, key, width, height, maxValue) {
  if (!rows.length) return [];
  const step = rows.length === 1 ? 0 : width / (rows.length - 1);
  return rows.map((row, index) => ({
    row,
    x: rows.length === 1 ? width / 2 : index * step,
    y: height - (Number(row[key] || 0) / maxValue) * height,
    value: Number(row[key] || 0)
  }));
}

export default function EmployeeReportsPage() {
  const [fromDate, setFromDate] = useState("2026-06-01");
  const [toDate, setToDate] = useState("2026-06-10");
  const [hoverPoint, setHoverPoint] = useState(null);

  const chartRows = useMemo(() => {
    return trendRows
      .filter((row) => (!fromDate || row.date >= fromDate) && (!toDate || row.date <= toDate))
      .slice(-10);
  }, [fromDate, toDate]);

  const chartWidth = 720;
  const chartHeight = 150;
  const maxValue = Math.max(1, ...chartRows.flatMap((row) => [row.connected, row.calls, row.demos, row.won]));

  const resetChart = () => {
    setFromDate("2026-06-01");
    setToDate("2026-06-10");
    setHoverPoint(null);
  };

  return (
    <EmployeeShell>
      <div className="space-y-5">
        <div>
          <p className="text-xs font-bold text-orange-600 uppercase tracking-wider">
            Employee Workspace
          </p>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight mt-1">
            Reports
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Your sales performance and activity reports.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {stats.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">{item.label}</p>
                    <h2 className="text-3xl font-bold text-slate-900 mt-2">{item.value}</h2>
                  </div>
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: `${item.color}18`, color: item.color }}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <section className="rounded-2xl bg-white border border-slate-200 shadow-sm p-5">
          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Performance Trend</h2>
              <p className="text-sm text-slate-500 mt-1">Hover on chart point to see number.</p>
            </div>

            <div className="flex flex-col md:flex-row md:items-end gap-3">
              <label>
                <span className="text-[11px] font-black text-slate-500 uppercase">From</span>
                <input type="date" value={fromDate} onChange={(event) => setFromDate(event.target.value)} className="mt-1 h-10 rounded-xl border border-slate-200 px-3 text-sm font-bold outline-none focus:ring-2 focus:ring-orange-500/20" />
              </label>
              <label>
                <span className="text-[11px] font-black text-slate-500 uppercase">To</span>
                <input type="date" value={toDate} onChange={(event) => setToDate(event.target.value)} className="mt-1 h-10 rounded-xl border border-slate-200 px-3 text-sm font-bold outline-none focus:ring-2 focus:ring-orange-500/20" />
              </label>
              <button type="button" onClick={resetChart} className="h-10 px-4 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 hover:bg-slate-50 inline-flex items-center gap-2">
                <RotateCcw className="w-4 h-4" />
                Reset
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 mt-4 text-xs font-bold text-slate-600">
            {Object.entries(lineMeta).map(([key, meta]) => (
              <span key={key} className="inline-flex items-center gap-2"><span className="w-3 h-3 rounded-full" style={{ background: meta.color }} />{meta.label}</span>
            ))}
          </div>

          <div className="mt-4 overflow-x-auto">
            <div className="min-w-[760px] relative">
              {hoverPoint && (
                <div
                  className="absolute z-20 -translate-x-1/2 -translate-y-full rounded-xl bg-slate-900 text-white px-3 py-2 text-xs font-bold shadow-xl pointer-events-none"
                  style={{ left: `${hoverPoint.x + 36}px`, top: `${hoverPoint.y + 8}px` }}
                >
                  <div>{hoverPoint.label}</div>
                  <div>{hoverPoint.date}: {hoverPoint.value}</div>
                </div>
              )}

              <div className="grid grid-cols-[36px_1fr] gap-2">
                <div className="h-[180px] relative text-[11px] font-bold text-slate-400">
                  {[maxValue, Math.round(maxValue / 2), 0].map((tick, index) => (
                    <span key={`${tick}-${index}`} className="absolute right-1" style={{ top: `${index * 75}px` }}>{tick}</span>
                  ))}
                </div>

                <div>
                  <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-[180px] overflow-visible">
                    {[0, 0.5, 1].map((line) => (
                      <line key={line} x1="0" x2={chartWidth} y1={chartHeight * line} y2={chartHeight * line} stroke="#e2e8f0" strokeWidth="1" />
                    ))}
                    {Object.entries(lineMeta).map(([key, meta]) => (
                      <polyline key={key} points={makePoints(chartRows, key, chartWidth, chartHeight, maxValue)} fill="none" stroke={meta.color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    ))}
                    {Object.entries(lineMeta).flatMap(([key, meta]) => pointList(chartRows, key, chartWidth, chartHeight, maxValue).map((point) => (
                      <circle
                        key={`${key}-${point.row.date}`}
                        cx={point.x}
                        cy={point.y}
                        r="5"
                        fill="white"
                        stroke={meta.color}
                        strokeWidth="3"
                        onMouseEnter={() => setHoverPoint({ x: point.x, y: point.y, value: point.value, date: point.row.label, label: meta.label })}
                        onMouseLeave={() => setHoverPoint(null)}
                      />
                    )))}
                  </svg>
                  <div className="grid text-[11px] font-bold text-slate-500" style={{ gridTemplateColumns: `repeat(${Math.max(chartRows.length, 1)}, minmax(0, 1fr))` }}>
                    {chartRows.map((row) => <span key={row.date} className="text-center">{row.label}</span>)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          <section className="rounded-2xl bg-white border border-slate-200 shadow-sm p-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Lead Performance</h2>
                <p className="text-sm text-slate-500 mt-1">Weekly lead movement.</p>
              </div>
              <BarChart2 className="w-5 h-5 text-orange-500" />
            </div>

            <div className="mt-6 space-y-4">
              {[
                ["New", "72%"],
                ["Contacted", "58%"],
                ["Demo", "36%"],
                ["Won", "24%"]
              ].map((item) => (
                <div key={item[0]}>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="font-bold text-slate-700">{item[0]}</span>
                    <span className="text-slate-500">{item[1]}</span>
                  </div>
                  <div className="h-3 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full rounded-full bg-orange-500" style={{ width: item[1] }} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl bg-white border border-slate-200 shadow-sm p-5">
            <h2 className="text-lg font-bold text-slate-900">Activity Summary</h2>
            <p className="text-sm text-slate-500 mt-1">Calls, WhatsApp and follow-ups.</p>

            <div className="grid grid-cols-2 gap-4 mt-6">
              {[
                ["Calls", "84"],
                ["WhatsApp", "96"],
                ["Emails", "28"],
                ["Notes", "32"]
              ].map((item) => (
                <div key={item[0]} className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
                  <p className="text-xs font-bold text-slate-500 uppercase">{item[0]}</p>
                  <h3 className="text-2xl font-bold text-slate-900 mt-2">{item[1]}</h3>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </EmployeeShell>
  );
}
