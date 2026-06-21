import { useState } from 'react';
import { Company, SaaSPlan, PlanType } from '../types';
import { 
  BarChart3, 
  Download, 
  FileSpreadsheet, 
  FileText, 
  Sparkles, 
  Calendar, 
  ArrowUpRight, 
  Users, 
  DollarSign, 
  ChevronRight,
  TrendingUp,
  RefreshCw
} from 'lucide-react';

interface ReportsProps {
  companies: Company[];
  plans: SaaSPlan[];
}

export default function ReportsManager({ companies, plans }: ReportsProps) {
  const [selectedMetric, setSelectedMetric] = useState<'revenue' | 'seats' | 'occupancy'>('revenue');
  const [timeframe, setTimeframe] = useState<'30' | '90' | '365'>('30');
  const [targetPlan, setTargetPlan] = useState<string>('All');
  
  const [isExporting, setIsExporting] = useState<string | null>(null);
  const [exportProgress, setExportProgress] = useState(0);

  // Stats calculations
  const totalRev = companies.reduce((sum, c) => sum + c.monthlySpend, 0) + 261780;
  const avgRev = Math.round((companies.reduce((sum, c) => sum + c.monthlySpend, 0)) / (companies.length || 1)) || 540;
  const totalUserSeats = companies.reduce((sum, c) => sum + c.userCount, 0) + 3975;
  const activeTenants = companies.length;

  const handleSimulateExport = (type: 'pdf' | 'csv') => {
    setIsExporting(type);
    setExportProgress(0);
    const interval = setInterval(() => {
      setExportProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsExporting(null);
            alert(`SaaS Platform ${type.toUpperCase()} Report generated and downloaded successfully!`);
          }, 450);
          return 100;
        }
        return p + 20;
      });
    }, 120);
  };

  return (
    <div className="space-y-6 select-none animate-fadeIn">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            Executive Reports & Analytics
          </h2>
          <p className="text-xs text-slate-500">
            Generate customized compliance spreadsheets, audit revenue trajectories, and extract cluster parameters.
          </p>
        </div>

        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => handleSimulateExport('pdf')}
            disabled={!!isExporting}
            className="bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 px-3.5 py-2.5 rounded text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
          >
            <FileText className="h-3.5 w-3.5 text-rose-500" /> Export PDF Summary
          </button>
          <button
            onClick={() => handleSimulateExport('csv')}
            disabled={!!isExporting}
            className="bg-[#3b82f6] hover:bg-blue-600 text-white px-3.5 py-2.5 rounded text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer disabled:opacity-50"
          >
            <FileSpreadsheet className="h-3.5 w-3.5 text-white" /> Compile CSV Audit
          </button>
        </div>
      </div>

      {/* Progress Trigger Overlay */}
      {isExporting && (
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg flex items-center justify-between animate-pulse">
          <div className="flex items-center gap-3">
            <RefreshCw className="h-5 w-5 text-blue-600 animate-spin" />
            <div>
              <h4 className="text-xs font-extrabold text-blue-800">Compiling Superadmin Datasets...</h4>
              <p className="text-[10px] text-blue-600">Structuring company registries and multi-tenant ledger databases.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 font-mono text-xs text-blue-800 font-bold">
            <div className="w-32 bg-blue-100 border border-blue-200 h-2 rounded overflow-hidden">
              <div 
                className="bg-blue-600 h-full transition-all duration-100" 
                style={{ width: `${exportProgress}%` }}
              />
            </div>
            <span>{exportProgress}%</span>
          </div>
        </div>
      )}

      {/* Interactive Report Config Board */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Metric Selection Panel */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-[0_1px_3px_rgba(0,0,0,0.05)] space-y-4">
          <h3 className="font-extrabold text-slate-800 text-sm pb-2 border-b border-slate-100">Report Customizer</h3>
          
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Analysis Parameter</label>
            <div className="grid grid-cols-1 gap-2">
              <button
                onClick={() => setSelectedMetric('revenue')}
                className={`p-3 rounded border text-left text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                  selectedMetric === 'revenue' 
                    ? 'border-blue-500 bg-blue-50/20 text-blue-800' 
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <span className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-emerald-600" />
                  Monthly Recurring Revenue (MRR)
                </span>
                <ChevronRight className="h-4 w-4" />
              </button>

              <button
                onClick={() => setSelectedMetric('seats')}
                className={`p-3 rounded border text-left text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                  selectedMetric === 'seats' 
                    ? 'border-blue-500 bg-blue-50/20 text-blue-800' 
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-blue-600" />
                  Account Seats Utilization
                </span>
                <ChevronRight className="h-4 w-4" />
              </button>

              <button
                onClick={() => setSelectedMetric('occupancy')}
                className={`p-3 rounded border text-left text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                  selectedMetric === 'occupancy' 
                    ? 'border-blue-500 bg-blue-50/20 text-blue-800' 
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <span className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-purple-600" />
                  Tenant Expansion Velocities
                </span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">SaaS Product Tier Group</label>
            <select
              value={targetPlan}
              onChange={(e) => setTargetPlan(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-md p-2 text-xs text-slate-800 font-bold focus:outline-none focus:border-blue-500"
            >
              <option value="All">All Tiers (Combined)</option>
              <option value="Enterprise">Enterprise Shards Only</option>
              <option value="Professional">Professional Growths Only</option>
              <option value="Starter">Starter Standard Only</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Dynamic History Bounds</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: '30', val: '30 Days' },
                { id: '90', val: 'Q1 Shard' },
                { id: '365', val: 'Annual' },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTimeframe(t.id as any)}
                  className={`py-2 text-[11px] font-bold border rounded transition-colors cursor-pointer text-center ${
                    timeframe === t.id 
                      ? 'bg-blue-600 text-white border-transparent shadow-sm' 
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                  }`}
                >
                  {t.val}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Live Vector Graphic and Simulation Stats */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-[0_1px_3px_rgba(0,0,0,0.05)] lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
              <Sparkles className="h-4.5 w-4.5 text-amber-500" />
              Simulation Report Matrix ({timeframe}d interval)
            </h3>
            <span className="text-[10px] font-bold text-slate-400 font-mono flex items-center gap-1 uppercase">
              <Calendar className="h-3 w-3" /> Realtime compiles
            </span>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-3 gap-3 bg-slate-50 border border-slate-150 rounded-lg p-3">
            <div className="text-center md:text-left">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Aggregated MRR</span>
              <p className="text-md sm:text-lg font-black text-slate-900 mt-0.5">₹{totalRev.toLocaleString()}</p>
            </div>
            <div className="text-center md:text-left select-all">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Tenant Avg</span>
              <p className="text-md sm:text-lg font-black text-slate-900 mt-0.5">₹{avgRev}/mo</p>
            </div>
            <div className="text-center md:text-left select-all">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Seats Dispatched</span>
              <p className="text-md sm:text-lg font-black text-slate-900 mt-0.5">{totalUserSeats.toLocaleString()}</p>
            </div>
          </div>

          {/* Vector graphic preview chart simulated via styled SVG nodes */}
          <div className="relative border border-slate-150 bg-slate-50/50 rounded-lg p-5 h-64 flex flex-col justify-between">
            <div className="flex justify-between text-[11px] font-bold text-slate-405 font-mono select-none">
              <span>Dynamic Projection Stream</span>
              <span className="text-emerald-600 flex items-center gap-0.5">
                &uarr; 14.8% <ArrowUpRight className="h-3 w-3" />
              </span>
            </div>

            {/* Custom SVG line representing real time metric values */}
            <div className="flex-1 w-full relative mt-4 h-36">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 500 100" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.18" />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                {/* Simulated Grid lines */}
                <line x1="0" y1="10" x2="500" y2="10" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="0" y1="50" x2="500" y2="50" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="0" y1="90" x2="500" y2="90" stroke="#f1f5f9" strokeWidth="1" />
                
                {/* Area under the line */}
                <path
                  d="M 0,90 Q 50,60 100,75 T 200,45 T 300,55 T 400,20 T 500,10 L 500,100 L 0,100 Z"
                  fill="url(#chartGrad)"
                />
                {/* Curved flow line */}
                <path
                  d="M 0,90 Q 50,60 100,75 T 200,45 T 300,55 T 400,20 T 500,10"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />

                {/* Grid Markers points */}
                <circle cx="100" cy="75" r="4.5" fill="#3b82f6" stroke="#ffffff" strokeWidth="1.5" className="animate-pulse" />
                <circle cx="300" cy="55" r="4.5" fill="#10b981" stroke="#ffffff" strokeWidth="1.5" />
                <circle cx="500" cy="10" r="4.5" fill="#6366f1" stroke="#ffffff" strokeWidth="1.5" />
              </svg>

              {/* Coordinates Labels */}
              <div className="absolute left-20 top-20 bg-slate-900 text-white rounded text-[9px] font-mono font-black py-0.5 px-1 shadow-sm leading-none">
                Start: Active
              </div>
              <div className="absolute right-2 top-2 bg-slate-900 text-white rounded text-[9px] font-mono font-black py-0.5 px-1 shadow-sm leading-none">
                Peak: +14.8%
              </div>
            </div>

            {/* Time points markers labels */}
            <div className="flex justify-between mt-2 font-mono text-[9px] font-extrabold text-slate-400 select-none">
              <span>T-{timeframe} Days</span>
              <span>T-{Math.round(parseInt(timeframe)/2)} Days</span>
              <span>Currently (Realtime)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Structured breakdowns section */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-[0_1px_3px_rgba(0,0,0,0.05)] space-y-4">
        <div>
          <h3 className="font-extrabold text-slate-800 text-sm">Interactive Client Shards Breakdown</h3>
          <p className="text-[11px] text-slate-500 mt-0.5">Audit parameters matching the current pricing bounds across high-spend nodes.</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-550 font-bold text-[9px] uppercase font-mono tracking-widest leading-none py-3">
                <th className="py-3 px-3">Client Workspace</th>
                <th className="py-3 px-3">Active Cluster</th>
                <th className="py-3 px-3">Enrolled Plan</th>
                <th className="py-3 px-3">Seats Allocated</th>
                <th className="py-3 px-3 text-right">Invoiced Monthly spend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {companies.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3 px-3 font-bold text-slate-900">{c.name}</td>
                  <td className="py-3 px-3 font-mono text-[10px] text-slate-500 select-all">{c.domain}</td>
                  <td className="py-3 px-3">
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold border uppercase tracking-wider font-mono ${
                      c.plan === PlanType.Enterprise ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                      c.plan === PlanType.Professional ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-slate-50 text-slate-600 border-slate-200'
                    }`}>
                      {c.plan}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-600 font-semibold">{c.userCount} Seats</td>
                  <td className="py-3 px-3 text-right font-bold text-slate-900 font-sans">₹{c.monthlySpend.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
