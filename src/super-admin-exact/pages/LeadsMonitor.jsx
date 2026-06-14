import { Search, Target, TrendingUp, Clock, AlertTriangle } from 'lucide-react';
import PageHeader from '../components/shared/PageHeader';
import StatCard from '../components/shared/StatCard';
import Badge from '../components/shared/Badge';

const LEADS = [
  { id: 1, name: 'Aarav Enterprises', owner: 'Neha Shah', company: 'Acme Corp', stage: 'New', value: '₹85,000', followup: 'Today 4:00 PM' },
  { id: 2, name: 'Kiran Traders', owner: 'Rahul Mehta', company: 'Bright Tech', stage: 'Demo Done', value: '₹1,20,000', followup: 'Tomorrow' },
  { id: 3, name: 'Sharma Textiles', owner: 'Priya Jain', company: 'Cloud Retail', stage: 'Overdue', value: '₹62,000', followup: 'Yesterday' },
  { id: 4, name: 'Metro Services', owner: 'Amit Patel', company: 'FinEdge', stage: 'Won', value: '₹2,10,000', followup: 'Completed' },
];

export default function LeadsMonitor() {
  return (
    <div className="p-6 space-y-6">
      <PageHeader title="Leads Monitor" subtitle="Track company-wise leads, owners, stages and follow-ups" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Leads" value="1,248" icon={Target} iconBg="bg-orange-100" iconColor="text-orange-600" subtitle="all tenants" />
        <StatCard title="Won Leads" value="312" icon={TrendingUp} iconBg="bg-emerald-100" iconColor="text-emerald-600" trend="+18 this month" trendUp />
        <StatCard title="Today Follow-ups" value="42" icon={Clock} iconBg="bg-blue-100" iconColor="text-blue-600" subtitle="scheduled" />
        <StatCard title="Overdue" value="9" icon={AlertTriangle} iconBg="bg-red-100" iconColor="text-red-600" subtitle="needs action" />
      </div>
      <div className="card overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between gap-4">
          <div className="relative w-80">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input className="pl-9 pr-4 py-2 w-full text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="Search leads..." />
          </div>
          <button className="btn-primary">Export</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50"><tr>{['Lead','Company','Owner','Stage','Value','Follow-up'].map(h=><th key={h} className="table-th">{h}</th>)}</tr></thead>
            <tbody>{LEADS.map(l=><tr key={l.id} className="table-tr"><td className="table-td font-semibold text-gray-900">{l.name}</td><td className="table-td">{l.company}</td><td className="table-td">{l.owner}</td><td className="table-td"><Badge label={l.stage} /></td><td className="table-td font-semibold">{l.value}</td><td className="table-td text-gray-500">{l.followup}</td></tr>)}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
