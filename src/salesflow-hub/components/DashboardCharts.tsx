import { useState } from 'react';
import { Company, SaaSPlan, PlanType } from '../types';
import { TrendingUp, Users, Award, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ChartsProps {
  companies: Company[];
  plans: SaaSPlan[];
}

export default function DashboardCharts({ companies, plans }: ChartsProps) {
  const [revenueFilter, setRevenueFilter] = useState<'7d' | '30d' | '12m'>('12m');
  const [hoveredDataPoint, setHoveredDataPoint] = useState<{ label: string; value: number } | null>(null);

  // Revenue Data based on filter
  const revenueDataPoints = {
    '7d': [
      { label: 'Mon', value: 242000 },
      { label: 'Tue', value: 248000 },
      { label: 'Wed', value: 251000 },
      { label: 'Thu', value: 257000 },
      { label: 'Fri', value: 261000 },
      { label: 'Sat', value: 263000 },
      { label: 'Sun', value: 265780 }
    ],
    '30d': [
      { label: 'Week 1', value: 180000 },
      { label: 'Week 2', value: 210000 },
      { label: 'Week 3', value: 245000 },
      { label: 'Week 4', value: 265780 }
    ],
    '12m': [
      { label: 'Jul 25', value: 140000 },
      { label: 'Aug 25', value: 155000 },
      { label: 'Sep 25', value: 172000 },
      { label: 'Oct 25', value: 195000 },
      { label: 'Nov 25', value: 210000 },
      { label: 'Dec 25', value: 228000 },
      { label: 'Jan 26', value: 236000 },
      { label: 'Feb 26', value: 242000 },
      { label: 'Mar 26', value: 249000 },
      { label: 'Apr 26', value: 254000 },
      { label: 'May 26', value: 260000 },
      { label: 'Jun 26', value: 265780 }
    ]
  };

  const activePoints = revenueDataPoints[revenueFilter];

  // Calculations for company subscription split
  const starterCount = companies.filter(c => c.plan === PlanType.Starter).length;
  const proCount = companies.filter(c => c.plan === PlanType.Professional).length;
  const enterpriseCount = companies.filter(c => c.plan === PlanType.Enterprise).length;
  const trialCount = companies.filter(c => c.plan === PlanType.Trial).length;
  const totalCount = companies.length || 1;

  const planBreakdown = [
    { name: 'Enterprise SaaS', qty: enterpriseCount, color: 'bg-indigo-500', barBg: 'indigo', text: 'text-indigo-400', percentage: Math.round((enterpriseCount / totalCount) * 100) },
    { name: 'Professional Tier', qty: proCount, color: 'bg-blue-500', barBg: 'blue', text: 'text-blue-400', percentage: Math.round((proCount / totalCount) * 100) },
    { name: 'Starter Standard', qty: starterCount, color: 'bg-[#a855f7]', barBg: 'purple', text: 'text-purple-400', percentage: Math.round((starterCount / totalCount) * 100) },
    { name: 'Active Free Trials', qty: trialCount, color: 'bg-emerald-500', barBg: 'emerald', text: 'text-emerald-400', percentage: Math.round((trialCount / totalCount) * 100) }
  ];

  // SVG Chart Dimensions & Helpers
  const chartHeight = 140;
  const chartWidth = 500;
  const padding = 20;

  // Find Min & Max
  const values = activePoints.map(p => p.value);
  const minVal = Math.min(...values) * 0.9;
  const maxVal = Math.max(...values) * 1.05;

  const getX = (index: number) => {
    return padding + (index / (activePoints.length - 1)) * (chartWidth - padding * 2);
  };

  const getY = (value: number) => {
    return chartHeight - padding - ((value - minVal) / (maxVal - minVal)) * (chartHeight - padding * 2);
  };

  // Generate SVG path string with linear smoothing
  let areaPath = '';
  let linePath = '';

  if (activePoints.length > 0) {
    areaPath = `M ${getX(0)} ${chartHeight - padding}`;
    activePoints.forEach((p, idx) => {
      const x = getX(idx);
      const y = getY(p.value);
      areaPath += ` L ${x} ${y}`;
      if (idx === 0) {
        linePath = `M ${x} ${y}`;
      } else {
        linePath += ` L ${x} ${y}`;
      }
    });
    areaPath += ` L ${getX(activePoints.length - 1)} ${chartHeight - padding} Z`;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
      {/* Revenue History Chart card - Premium bespoke SVG with interactive hover nodes */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 lg:col-span-8 flex flex-col justify-between shadow-[0_1px_3px_rgba(0,0,0,0.05)] hover:border-slate-300 transition-all duration-200">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4.5 w-4.5 text-blue-600" />
              <h3 className="font-bold text-slate-900 text-sm">Revenue Overview</h3>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Monthly recurring performance and billing updates.
            </p>
          </div>

          {/* Time switch options */}
          <div className="flex bg-slate-100 p-1 border border-slate-200/60 rounded text-[10px] uppercase font-bold text-slate-500 select-none">
            {(['7d', '30d', '12m'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setRevenueFilter(filter)}
                className={`px-3 py-1 rounded transition-all duration-150 cursor-pointer ${
                  revenueFilter === filter ? 'bg-white text-slate-800 shadow-sm border border-slate-200/50' : 'hover:text-slate-800'
                }`}
              >
                {filter === '7d' ? '7 days' : filter === '30d' ? '30 days' : '12 months'}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic metrics state */}
        <div className="flex items-end gap-1 px-1 py-1 mt-4">
          <div>
            <div className="text-2xl font-extrabold font-sans text-slate-900 tracking-tight">
              ${hoveredDataPoint ? hoveredDataPoint.value.toLocaleString() : '265,780'}
            </div>
            <div className="text-[10px] font-medium text-slate-400">
              {hoveredDataPoint ? `Revenue at: ${hoveredDataPoint.label}` : 'Current Month Recurring Revenue'}
            </div>
          </div>
          <span className="text-xs bg-emerald-50 text-emerald-750 font-bold px-1.5 py-0.5 rounded ml-3 mb-1 flex items-center gap-0.5 border border-emerald-200/70">
            +16.8% vs last year
          </span>
        </div>

        {/* Bespoke Interactive Line Area Chart SVG */}
        <div className="mt-5 relative h-40">
          <svg
            className="w-full h-full"
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#ff7a00" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ff7a00" stopOpacity="0.25" />
                <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* horizontal helper gridlines */}
            <line x1={padding} y1={getY(minVal)} x2={chartWidth - padding} y2={getY(minVal)} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
            <line x1={padding} y1={getY((minVal + maxVal) / 2)} x2={chartWidth - padding} y2={getY((minVal + maxVal) / 2)} stroke="rgba(255,255,255,0.04)" strokeWidth="1" strokeDasharray="3" />
            <line x1={padding} y1={getY(maxVal)} x2={chartWidth - padding} y2={getY(maxVal)} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />

            {/* Gradient Shading */}
            <path d={areaPath} fill="url(#chartGradient)" />

            {/* Main Sparkline representation */}
            <path
              d={linePath}
              fill="none"
              stroke="url(#lineGradient)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Interactive Circles / Hover Nodes */}
            {activePoints.map((point, index) => {
              const x = getX(index);
              const y = getY(point.value);
              const isHovered = hoveredDataPoint?.label === point.label;

              return (
                <g key={index}>
                  <circle
                    cx={x}
                    cy={y}
                    r={isHovered ? '6.5' : '3.5'}
                    className="stroke-[#090D16]"
                    fill={isHovered ? '#ff7a00' : '#3b82f6'}
                    strokeWidth={isHovered ? '2.5' : '1.5'}
                    style={{ filter: isHovered ? 'drop-shadow(0 0 6px #ff7a00)' : 'none' }}
                  />
                  <rect
                    x={x - 20}
                    y={0}
                    width={40}
                    height={chartHeight}
                    fill="transparent"
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredDataPoint(point)}
                    onMouseLeave={() => setHoveredDataPoint(null)}
                  />
                </g>
              );
            })}
          </svg>
        </div>

        {/* Labels along X-Axis */}
        <div className="flex justify-between px-3 text-[10px] font-bold text-slate-450 mt-1 font-mono">
          {activePoints.map((p, i) => (
            <span key={i}>{p.label}</span>
          ))}
        </div>
      </div>

      {/* Subscription Type Split chart */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 lg:col-span-4 flex flex-col justify-between shadow-[0_1px_3px_rgba(0,0,0,0.05)] hover:border-slate-300 transition-all duration-200">
        <div>
          <div className="flex items-center gap-2">
            <Users className="h-4.5 w-4.5 text-[#3b82f6]" />
            <h3 className="font-bold text-slate-900 text-sm">Company Growth</h3>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Tenant ratio and core license allocation.
          </p>
        </div>

        {/* Proportional Segment Bar stack visualization representing true CRM status */}
        <div className="my-4">
          <div className="flex rounded h-2 bg-slate-100">
            {planBreakdown.map((item, idx) => {
              if (item.qty === 0) return null;
              return (
                <div
                  key={idx}
                  className={`${item.color} h-full first:rounded-l last:rounded-r`}
                  style={{ width: `${item.percentage}%` }}
                  title={`${item.name}: ${item.qty} companies (${item.percentage}%)`}
                />
              );
            })}
          </div>
        </div>

        {/* Plan Breakdown List Grid */}
        <div className="space-y-2">
          {planBreakdown.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between text-xs bg-slate-50 rounded px-3 py-2 border border-slate-100 hover:bg-slate-100/50 transition-colors">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${item.color} shrink-0`} />
                <span className="font-semibold text-slate-700">{item.name}</span>
              </div>
              <div className="flex items-center gap-2 text-right">
                <span className="font-mono text-slate-800 font-bold">{item.qty} accounts</span>
                <span className="text-[10px] text-slate-500 font-bold bg-slate-200 px-1.5 py-0.5 rounded">
                  {item.percentage}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
