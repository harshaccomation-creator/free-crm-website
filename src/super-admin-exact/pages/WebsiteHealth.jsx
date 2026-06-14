import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { HeartPulse, Zap, Activity, Server } from 'lucide-react';
import StatCard from '../components/shared/StatCard';
import PageHeader from '../components/shared/PageHeader';
import { WEBSITE_HEALTH } from '../data/mockData';

const STATUS_COLOR = {
  Operational: { dot: 'bg-emerald-500', text: 'text-emerald-700', bg: 'bg-emerald-50', badge: 'bg-emerald-100 text-emerald-700' },
  Degraded: { dot: 'bg-yellow-500', text: 'text-yellow-700', bg: 'bg-yellow-50', badge: 'bg-yellow-100 text-yellow-700' },
  Down: { dot: 'bg-red-500', text: 'text-red-700', bg: 'bg-red-50', badge: 'bg-red-100 text-red-700' },
};

export default function WebsiteHealth() {
  const { uptime, responseTime, errorRate, activeUsers, cpuUsage, memoryUsage, services, uptimeHistory } = WEBSITE_HEALTH;

  return (
    <div className="p-6 space-y-6">
      <PageHeader title="Website Health" subtitle="Real-time platform monitoring and system status" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Uptime" value={`${uptime}%`} icon={HeartPulse} iconBg="bg-emerald-100" iconColor="text-emerald-600" trend="Last 30 days" trendUp />
        <StatCard title="Avg Response" value={`${responseTime}ms`} icon={Zap} iconBg="bg-blue-100" iconColor="text-blue-600" subtitle="API latency" />
        <StatCard title="Active Users" value={activeUsers.toLocaleString()} icon={Activity} iconBg="bg-purple-100" iconColor="text-purple-600" subtitle="right now" />
        <StatCard title="Error Rate" value={`${errorRate}%`} icon={Server} iconBg="bg-orange-100" iconColor="text-orange-600" subtitle="last 24h" />
      </div>

      {/* Resource Usage */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {[
          { label: 'CPU Usage', value: cpuUsage, color: cpuUsage>80?'bg-red-500':cpuUsage>60?'bg-yellow-500':'bg-emerald-500' },
          { label: 'Memory Usage', value: memoryUsage, color: memoryUsage>85?'bg-red-500':memoryUsage>65?'bg-yellow-500':'bg-blue-500' },
          { label: 'Disk Usage', value: WEBSITE_HEALTH.diskUsage, color: 'bg-purple-500' },
        ].map(r=>(
          <div key={r.label} className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-700">{r.label}</span>
              <span className="text-lg font-bold text-gray-900">{r.value}%</span>
            </div>
            <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
              <div className={`h-full ${r.color} rounded-full transition-all`} style={{width:`${r.value}%`}} />
            </div>
          </div>
        ))}
      </div>

      {/* Uptime Chart */}
      <div className="card p-5">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">7-Day Uptime History</h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={uptimeHistory} margin={{top:5,right:10,left:0,bottom:0}}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize:12,fill:'#9ca3af'}} />
              <YAxis domain={[99,100]} axisLine={false} tickLine={false} tick={{fontSize:12,fill:'#9ca3af'}} tickFormatter={v=>`${v}%`} />
              <Tooltip formatter={v=>[`${v}%`,'Uptime']} contentStyle={{borderRadius:8,border:'1px solid #e5e7eb',fontSize:12}} />
              <Line type="monotone" dataKey="uptime" stroke="#10b981" strokeWidth={2} dot={{r:4,fill:'#10b981'}} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Services */}
      <div className="card overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900">Service Status</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {services.map(svc=>{
            const s = STATUS_COLOR[svc.status] || STATUS_COLOR.Operational;
            return (
              <div key={svc.name} className="flex items-center justify-between px-5 py-4 hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className={`w-2.5 h-2.5 rounded-full ${s.dot} animate-pulse`} />
                  <span className="text-sm font-medium text-gray-900">{svc.name}</span>
                </div>
                <div className="flex items-center gap-6">
                  <span className="text-xs text-gray-400">{svc.latency}ms</span>
                  <span className="text-xs text-gray-400">{svc.uptime}% uptime</span>
                  <span className={`badge ${s.badge}`}>{svc.status}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
