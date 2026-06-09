import { RotateCcw } from "lucide-react";

export default function ReportsDateFilter() {
  return (
    <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-3 flex flex-col md:flex-row md:items-end gap-3">
      <label className="block">
        <span className="text-[11px] font-black text-slate-500 uppercase">From Date</span>
        <input type="date" defaultValue="2026-06-01" className="mt-1 h-10 rounded-xl border border-slate-200 px-3 text-sm font-bold outline-none focus:ring-2 focus:ring-orange-500/20" />
      </label>

      <label className="block">
        <span className="text-[11px] font-black text-slate-500 uppercase">To Date</span>
        <input type="date" defaultValue="2026-06-10" className="mt-1 h-10 rounded-xl border border-slate-200 px-3 text-sm font-bold outline-none focus:ring-2 focus:ring-orange-500/20" />
      </label>

      <button type="button" className="h-10 px-4 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 hover:bg-slate-50 inline-flex items-center gap-2">
        <RotateCcw className="w-4 h-4" />
        Reset
      </button>
    </div>
  );
}
