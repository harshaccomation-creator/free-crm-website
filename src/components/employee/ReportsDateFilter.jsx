import { RotateCcw } from "lucide-react";

export default function ReportsDateFilter() {
  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      <label className="inline-flex items-center gap-2 rounded-xl bg-white/80 border border-slate-200 px-3 h-9 shadow-sm">
        <span className="text-[10px] font-black text-slate-500 uppercase whitespace-nowrap">From</span>
        <input type="date" defaultValue="2026-06-01" className="h-7 bg-transparent text-xs font-bold text-slate-900 outline-none w-[118px]" />
      </label>

      <label className="inline-flex items-center gap-2 rounded-xl bg-white/80 border border-slate-200 px-3 h-9 shadow-sm">
        <span className="text-[10px] font-black text-slate-500 uppercase whitespace-nowrap">To</span>
        <input type="date" defaultValue="2026-06-10" className="h-7 bg-transparent text-xs font-bold text-slate-900 outline-none w-[118px]" />
      </label>

      <button type="button" className="h-9 px-3 rounded-xl border border-slate-200 bg-white/80 text-xs font-bold text-slate-700 hover:bg-white inline-flex items-center gap-1.5 shadow-sm">
        <RotateCcw className="w-3.5 h-3.5" />
        Reset
      </button>
    </div>
  );
}
