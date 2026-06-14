import { TrendingUp, CreditCard, Package, IndianRupee } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import PageHeader from '../components/shared/PageHeader';
import StatCard from '../components/shared/StatCard';
import Badge from '../components/shared/Badge';

const data = [
  { month: 'Jan', mrr: 180000 },
  { month: 'Feb', mrr: 220000 },
  { month: 'Mar', mrr: 280000 },
  { month: 'Apr', mrr: 330000 },
  { month: 'May', mrr: 390000 },
  { month: 'Jun', mrr: 485000 },
];
const plans = [
  { plan: 'Starter', companies: 42, mrr: '₹1.2L', status: 'Active' },
  { plan: 'Growth', companies: 28, mrr: '₹2.1L', status: 'Popular' },
  { plan: 'Enterprise', companies: 9, mrr: '₹1.5L', status: 'Active' },
];

export default function Revenue() {
  return (
    <div className="p-6 space-y-6">
      <PageHeader title="Revenue & Plans" subtitle="MRR, plan performance and subscription revenue" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total MRR" value="₹4.8L" icon={IndianRupee} iconBg="bg-orange-100" iconColor="text-orange-600" trend="+12.4%" trendUp />
        <StatCard title="Paid Companies" value="79" icon={CreditCard} iconBg="bg-emerald-100" iconColor="text-emerald-600" />
        <StatCard title="Active Plans" value="3" icon={Package} iconBg="bg-blue-100" iconColor="text-blue-600" />
        <StatCard title="Growth" value="18%" icon={TrendingUp} iconBg="bg-violet-100" iconColor="text-violet-600" />
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card p-6 h-96"><h2 className="font-bold text-gray-900 mb-6">MRR Trend</h2><ResponsiveContainer width="100%" height="85%"><AreaChart data={data}><defs><linearGradient id="mrr" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#f97316" stopOpacity={0.28}/><stop offset="95%" stopColor="#f97316" stopOpacity={0}/></linearGradient></defs><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" /><XAxis dataKey="month" axisLine={false} tickLine={false} /><YAxis axisLine={false} tickLine={false} tickFormatter={v=>`₹${v/1000}K`} /><Tooltip formatter={v=>`₹${Number(v).toLocaleString('en-IN')}`} /><Area type="monotone" dataKey="mrr" stroke="#f97316" strokeWidth={3} fill="url(#mrr)" /></AreaChart></ResponsiveContainer></div>
        <div className="card overflow-hidden"><div className="px-5 py-4 border-b border-gray-100"><h2 className="font-bold text-gray-900">Plan Revenue</h2></div><table className="w-full text-sm"><thead className="bg-gray-50"><tr>{['Plan','Companies','MRR','Status'].map(h=><th key={h} className="table-th">{h}</th>)}</tr></thead><tbody>{plans.map(p=><tr key={p.plan} className="table-tr"><td className="table-td font-semibold text-gray-900">{p.plan}</td><td className="table-td">{p.companies}</td><td className="table-td font-semibold">{p.mrr}</td><td className="table-td"><Badge label={p.status} /></td></tr>)}</tbody></table></div>
      </div>
    </div>
  );
}
