import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import {
  Activity, AlertTriangle, Building2, CreditCard, DollarSign, Info,
  ShieldAlert, Target, TrendingUp, UserPlus, Users, Zap, Clock
} from 'lucide-react';

const KPI = [
  { title: 'Total Companies', value: '1,248', trend: '↑ 12.4%', note: 'vs last 30 days', icon: Building2, color: 'bg-blue-500', positive: true },
  { title: 'Active Companies', value: '856', trend: '↑ 8.7%', note: 'vs last 30 days', icon: Activity, color: 'bg-emerald-500', positive: true },
  { title: 'Trial Companies', value: '212', trend: '↑ 5.3%', note: 'vs last 30 days', icon: Clock, color: 'bg-violet-500', positive: true },
  { title: 'Paid Companies', value: '644', trend: '↑ 14.1%', note: 'vs last 30 days', icon: CreditCard, color: 'bg-teal-500', positive: true },
  { title: 'Expired Trials', value: '78', trend: '↓ 4.6%', note: 'vs last 30 days', icon: AlertTriangle, color: 'bg-orange-500', positive: false },
  { title: 'Total Users', value: '3,982', trend: '↑ 10.2%', note: 'vs last 30 days', icon: Users, color: 'bg-blue-600', positive: true },
  { title: 'Monthly Revenue', value: '$265,780', trend: '↑ 16.8%', note: 'vs last 30 days', icon: DollarSign, color: 'bg-emerald-500', positive: true },
  { title: 'Pending Payments', value: '$48,230', trend: '↓ 7.3%', note: 'vs last 30 days', icon: CreditCard, color: 'bg-red-500', positive: false },
];

const revenue = [
  { date: 'May 12', value: 154000 },
  { date: 'May 19', value: 178000 },
  { date: 'May 26', value: 196000 },
  { date: 'Jun 02', value: 222000 },
  { date: 'Jun 09', value: 247000 },
  { date: 'Jun 12', value: 265780 },
];
const growth = [
  { date: 'May 12', newCompanies: 84, churned: 12 },
  { date: 'May 19', newCompanies: 92, churned: 18 },
  { date: 'May 26', newCompanies: 105, churned: 10 },
  { date: 'Jun 02', newCompanies: 128, churned: 22 },
  { date: 'Jun 09', newCompanies: 145, churned: 17 },
  { date: 'Jun 12', newCompanies: 212, churned: 9 },
];

const companies = [
  { name: 'Acme Corporation', letter: 'A', color: 'bg-blue-500', plan: 'Enterprise', users: 23, status: 'Active' },
  { name: 'Globex Corporation', letter: 'G', color: 'bg-emerald-500', plan: 'Professional', users: 12, status: 'Active' },
  { name: 'Soylent Corp', letter: 'S', color: 'bg-orange-500', plan: 'Professional', users: 18, status: 'Active' },
  { name: 'Initech', letter: 'I', color: 'bg-purple-500', plan: 'Enterprise', users: 45, status: 'Active' },
  { name: 'BetaWorks Inc', letter: 'B', color: 'bg-red-500', plan: 'Starter', users: 3, status: 'Trial' },
];

const alerts = [
  { icon: ShieldAlert, title: 'High number of failed login attempts', text: '12 IPs blocked in the last 24 hours', time: '2m ago', color: 'bg-red-500/20 text-red-400', titleColor: 'text-red-400' },
  { icon: AlertTriangle, title: 'Payment gateway latency high', text: 'Average response time is 2.8s', time: '18m ago', color: 'bg-yellow-500/20 text-yellow-400', titleColor: 'text-yellow-400' },
  { icon: AlertTriangle, title: 'Trial expirations approaching', text: '38 trials will expire in next 3 days', time: '1h ago', color: 'bg-yellow-500/20 text-yellow-400', titleColor: 'text-yellow-400' },
  { icon: Zap, title: 'Scheduled maintenance', text: 'June 15, 2025 02:00 AM – 04:00 AM UTC', time: '5h ago', color: 'bg-blue-500/20 text-blue-400', titleColor: 'text-blue-400' },
];

const activity = [
  { icon: Building2, title: 'Acme Corporation', text: 'New company registered', time: '2m ago', color: 'bg-blue-500/20 text-blue-400' },
  { icon: UserPlus, title: 'John Smith', text: 'New user added to Globex ...', time: '15m ago', color: 'bg-emerald-500/20 text-emerald-400' },
  { icon: TrendingUp, title: 'Initech', text: 'Upgraded to Enterprise Plan', time: '32m ago', color: 'bg-purple-500/20 text-purple-400' },
  { icon: DollarSign, title: 'Payment received', text: '$8,750 from Soylent Corp', time: '1h ago', color: 'bg-emerald-500/20 text-emerald-400' },
  { icon: Clock, title: 'Trial expired', text: 'BetaWorks Inc trial has expir...', time: '2h ago', color: 'bg-orange-500/20 text-orange-400' },
  { icon: Users, title: 'Admin User', text: 'Role updated for Maria Garcia', time: '3h ago', color: 'bg-blue-500/20 text-blue-400' },
  { icon: Building2, title: 'Umbrella Corp', text: 'New subscription started', time: '4h ago', color: 'bg-blue-500/20 text-blue-400' },
  { icon: DollarSign, title: 'Payment failed', text: '$2,120 from Hooli Inc', time: '5h ago', color: 'bg-red-500/20 text-red-400' },
];

function MetricCard({ item }) {
  const Icon = item.icon;
  return (
    <div className="sf-card p-6 min-h-[176px] relative">
      <div className="flex items-start justify-between mb-5">
        <div className={`w-12 h-12 rounded-xl ${item.color} flex items-center justify-center shadow-lg shadow-black/20`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <Info className="w-5 h-5 text-[#526989]" />
      </div>
      <p className="text-[#8ba3c8] text-base font-semibold mb-2">{item.title}</p>
      <p className="text-white text-[30px] leading-none font-black tracking-tight mb-4">{item.value}</p>
      <p className="text-sm font-bold whitespace-nowrap">
        <span className={item.positive ? 'text-emerald-400' : 'text-red-400'}>{item.trend}</span>
        <span className="text-[#8ba3c8] font-medium ml-2">{item.note}</span>
      </p>
    </div>
  );
}

function Panel({ title, action, children, className = '' }) {
  return (
    <div className={`sf-panel overflow-hidden ${className}`}>
      <div className="h-[70px] px-6 flex items-center justify-between border-b border-[#1d2d4a]">
        <h2 className="text-white text-xl font-black">{title}</h2>
        {action ? <span className="text-blue-400 text-base font-semibold">{action}</span> : <button className="px-4 py-2 rounded-lg bg-[#132440] text-[#8ba3c8] text-base">Monthly⌄</button>}
      </div>
      {children}
    </div>
  );
}

export default function Dashboard() {
  return (
    <div className="space-y-7">
      <div>
        <h1 className="text-[34px] leading-tight font-black text-white mb-2">Overview Dashboard</h1>
        <p className="text-[#8ba3c8] text-xl">Real-time platform overview and key metrics at a glance.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {KPI.map(item => <MetricCard key={item.title} item={item} />)}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.35fr_1fr] gap-6">
        <div className="sf-panel p-6 min-h-[425px]">
          <div className="flex items-start justify-between mb-5">
            <div>
              <h2 className="text-white text-xl font-black mb-2">Revenue Overview</h2>
              <p className="text-white text-xl font-black"><span>$265,780</span> <span className="text-emerald-400 text-base">↑ 16.8% vs Apr 12 – May 12, 2025</span></p>
            </div>
            <button className="px-4 py-2 rounded-lg bg-[#132440] text-[#8ba3c8] text-base">Monthly⌄</button>
          </div>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenue} margin={{ left: 20, right: 10, top: 10, bottom: 0 }}>
                <defs><linearGradient id="revDark" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3b82f6" stopOpacity={0.35}/><stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/></linearGradient></defs>
                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#263752" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#6f819d', fontSize: 13 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6f819d', fontSize: 13 }} tickFormatter={v => `$${Math.round(v/1000)}k`} />
                <Tooltip contentStyle={{ background: '#0b1527', border: '1px solid #1d2d4a', borderRadius: 12, color: '#fff', fontSize: 14 }} formatter={v => [`$${Number(v).toLocaleString()}`, 'Revenue']} />
                <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} fill="url(#revDark)" activeDot={{ r: 6, fill: '#3b82f6', stroke: '#fff', strokeWidth: 3 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-5 pt-5 border-t border-[#1d2d4a] grid grid-cols-3 gap-5">
            <div><p className="text-[#8ba3c8] text-sm">This Period</p><p className="text-white text-base font-black">$265,780 <span className="text-emerald-400">↑ 16.8%</span></p></div>
            <div><p className="text-[#8ba3c8] text-sm">Last Period</p><p className="text-white text-base font-black">$227,490</p></div>
            <div><p className="text-[#8ba3c8] text-sm">Growth</p><p className="text-white text-base font-black">$38,290 <span className="text-emerald-400">↑ 16.8%</span></p></div>
          </div>
        </div>

        <div className="sf-panel p-6 min-h-[425px]">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-white text-xl font-black">Company Growth</h2>
            <button className="px-4 py-2 rounded-lg bg-[#132440] text-[#8ba3c8] text-base">Monthly⌄</button>
          </div>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={growth} margin={{ left: 20, right: 10, top: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#263752" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#6f819d', fontSize: 13 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6f819d', fontSize: 13 }} />
                <Tooltip contentStyle={{ background: '#0b1527', border: '1px solid #1d2d4a', borderRadius: 12, color: '#fff' }} />
                <Bar dataKey="newCompanies" fill="#3b82f6" radius={[5,5,0,0]} barSize={7} />
                <Bar dataKey="churned" fill="#ef4444" radius={[5,5,0,0]} barSize={7} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-6 mt-5 text-base">
            <span className="flex items-center gap-2 text-blue-400"><span className="w-4 h-4 bg-blue-500 inline-block" /> New Companies</span>
            <span className="flex items-center gap-2 text-red-400"><span className="w-4 h-4 bg-red-500 inline-block" /> Churned Companies</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.35fr_1fr_1fr] gap-6">
        <Panel title="Recent Companies" action="View All ›" className="min-h-[500px]">
          <table className="w-full text-left">
            <thead><tr className="border-b border-[#1d2d4a]"><th className="table-th">Company</th><th className="table-th">Plan</th><th className="table-th">Users</th><th className="table-th">Status</th></tr></thead>
            <tbody>{companies.map(c => <tr key={c.name} className="table-tr"><td className="table-td"><div className="flex items-center gap-4"><div className={`w-9 h-9 rounded-lg ${c.color} flex items-center justify-center font-black text-white`}>{c.letter}</div><span className="font-bold text-white leading-tight">{c.name}</span></div></td><td className="table-td text-[#8ba3c8]">{c.plan}</td><td className="table-td font-black text-white">{c.users}</td><td className="table-td"><span className={`badge ${c.status === 'Active' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-blue-500/15 text-blue-400 border border-blue-500/30'}`}>{c.status}</span></td></tr>)}</tbody>
          </table>
        </Panel>

        <Panel title="System Alerts" action="View All" className="min-h-[500px]">
          <div className="divide-y divide-[#1d2d4a]">{alerts.map(a => { const Icon = a.icon; return <div key={a.title} className="p-5 flex gap-4"><div className={`w-10 h-10 rounded-lg flex items-center justify-center ${a.color}`}><Icon className="w-5 h-5" /></div><div className="flex-1"><div className="flex justify-between gap-3"><p className={`font-black text-base ${a.titleColor}`}>{a.title}</p><span className="text-[#5f789e] text-xs whitespace-nowrap">{a.time}</span></div><p className="text-[#8ba3c8] text-base leading-7 mt-1">{a.text}</p></div></div> })}</div>
        </Panel>

        <Panel title="Recent Activity" action="View All" className="min-h-[500px]">
          <div className="divide-y divide-[#1d2d4a]">{activity.map(a => { const Icon = a.icon; return <div key={`${a.title}-${a.time}`} className="p-4 flex gap-3"><div className={`w-9 h-9 rounded-lg flex items-center justify-center ${a.color}`}><Icon className="w-4 h-4" /></div><div className="flex-1 min-w-0"><div className="flex justify-between gap-3"><p className="font-black text-white text-sm truncate">{a.title}</p><span className="text-[#5f789e] text-xs whitespace-nowrap">{a.time}</span></div><p className="text-[#8ba3c8] text-sm truncate mt-1">{a.text}</p></div></div> })}</div>
        </Panel>
      </div>
    </div>
  );
}
