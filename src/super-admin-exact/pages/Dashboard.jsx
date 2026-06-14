import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Building2, Users, CreditCard, TrendingUp, ArrowUpRight, ArrowDownRight, Activity, CalendarCheck } from 'lucide-react';
import StatCard from '../components/shared/StatCard';
import PageHeader from '../components/shared/PageHeader';
import Badge from '../components/shared/Badge';
import { COMPANIES, SUBSCRIPTIONS, DEMO_REQUESTS, ACTIVITY_LOGS, REVENUE_TREND, USER_GROWTH, formatINR, timeAgo } from '../data/mockData';

const totalMRR = SUBSCRIPTIONS.filter(s => s.status === 'Active').reduce((a, s) => a + s.mrr, 0);
const COLORS = ['#f97316', '#3b82f6', '#8b5cf6', '#10b981', '#f59e0b'];

export default function Dashboard() {
  const activeCompanies = COMPANIES.filter(c => c.status === 'Active').length;
  const totalUsers = COMPANIES.reduce((a, c) => a + c.users, 0);
  const pendingDemos = DEMO_REQUESTS.filter(d => d.status === 'Pending').length;
  const planDist = [
    { name: 'Enterprise', value: COMPANIES.filter(c => c.plan === 'Enterprise').length },
    { name: 'Professional', value: COMPANIES.filter(c => c.plan === 'Professional').length },
    { name: 'Starter', value: COMPANIES.filter(c => c.plan === 'Starter').length },
  ];

  return (
    <div className="p-6 space-y-6">
      <PageHeader title="Super Admin Dashboard" subtitle="Platform overview and key metrics" />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total MRR" value={formatINR(totalMRR)} icon={CreditCard} iconBg="bg-orange-100" iconColor="text-orange-600" trend="+12.4% this month" trendUp />
        <StatCard title="Active Companies" value={activeCompanies} icon={Building2} iconBg="bg-blue-100" iconColor="text-blue-600" trend="+3 this week" trendUp />
        <StatCard title="Total Users" value={totalUsers} icon={Users} iconBg="bg-purple-100" iconColor="text-purple-600" trend="+48 this month" trendUp />
        <StatCard title="Pending Demos" value={pendingDemos} icon={CalendarCheck} iconBg="bg-yellow-100" iconColor="text-yellow-600" subtitle="Need scheduling" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Monthly Recurring Revenue</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={REVENUE_TREND} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="mrr" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} tickFormatter={v => `₹${(v/1000).toFixed(0)}K`} />
                <Tooltip formatter={v => [formatINR(v), 'MRR']} contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 12 }} />
                <Area type="monotone" dataKey="mrr" stroke="#f97316" strokeWidth={2} fill="url(#mrr)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">User Growth</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={USER_GROWTH} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 12 }} />
                <Bar dataKey="total" name="Total Users" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={28} />
                <Bar dataKey="new" name="New Users" fill="#f97316" radius={[4, 4, 0, 0]} barSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Plan Distribution */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Plan Distribution</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={planDist} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={5} dataKey="value">
                  {planDist.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-col gap-1.5 mt-2">
            {planDist.map((p, i) => (
              <div key={p.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                  <span className="text-gray-600">{p.name}</span>
                </div>
                <span className="font-semibold text-gray-900">{p.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900">Recent Activity</h3>
            <a href="/activity-logs" className="text-xs text-orange-500 font-semibold hover:underline">View all</a>
          </div>
          <div className="space-y-3">
            {ACTIVITY_LOGS.slice(0, 6).map(log => (
              <div key={log.id} className="flex items-start gap-3 py-2 border-b border-gray-100 last:border-0">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold
                  ${log.severity === 'Error' ? 'bg-red-100 text-red-600' :
                    log.severity === 'Warning' ? 'bg-yellow-100 text-yellow-600' :
                    log.severity === 'Success' ? 'bg-emerald-100 text-emerald-600' :
                    'bg-gray-100 text-gray-600'}`}>
                  <Activity className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-800 font-medium truncate">{log.action}</p>
                  <p className="text-xs text-gray-400">{log.user} · {log.company}</p>
                </div>
                <span className="text-xs text-gray-400 whitespace-nowrap">{timeAgo(log.timestamp)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
