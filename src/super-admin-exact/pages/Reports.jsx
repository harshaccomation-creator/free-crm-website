import { BarChart2, Download, TrendingUp, Users } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import PageHeader from '../components/shared/PageHeader';
import StatCard from '../components/shared/StatCard';

const data = [
  { month: 'Jan', revenue: 220, users: 180 },
  { month: 'Feb', revenue: 260, users: 210 },
  { month: 'Mar', revenue: 310, users: 255 },
  { month: 'Apr', revenue: 360, users: 295 },
  { month: 'May', revenue: 420, users: 340 },
  { month: 'Jun', revenue: 485, users: 395 },
];

export default function Reports() {
  return (
    <div className="p-6 space-y-6">
      <PageHeader title="Reports" subtitle="Platform analytics, revenue and tenant performance" actions={<button className="btn-primary flex items-center gap-2"><Download className="w-4 h-4" /> Download</button>} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Revenue Report" value="₹4.8L" icon={TrendingUp} iconBg="bg-orange-100" iconColor="text-orange-600" trend="+12.4%" trendUp />
        <StatCard title="User Report" value="395" icon={Users} iconBg="bg-blue-100" iconColor="text-blue-600" trend="+48" trendUp />
        <StatCard title="Reports Ready" value="18" icon={BarChart2} iconBg="bg-violet-100" iconColor="text-violet-600" />
        <StatCard title="Exports" value="52" icon={Download} iconBg="bg-emerald-100" iconColor="text-emerald-600" />
      </div>
      <div className="card p-6 h-96"><h2 className="font-bold text-gray-900 mb-6">Monthly Platform Report</h2><ResponsiveContainer width="100%" height="85%"><BarChart data={data}><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" /><XAxis dataKey="month" axisLine={false} tickLine={false} /><YAxis axisLine={false} tickLine={false} /><Tooltip /><Bar dataKey="revenue" fill="#f97316" radius={[6,6,0,0]} /><Bar dataKey="users" fill="#3b82f6" radius={[6,6,0,0]} /></BarChart></ResponsiveContainer></div>
    </div>
  );
}
