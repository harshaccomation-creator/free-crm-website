import { ShieldCheck, Lock, AlertTriangle, UserCheck } from 'lucide-react';
import PageHeader from '../components/shared/PageHeader';
import StatCard from '../components/shared/StatCard';
import Badge from '../components/shared/Badge';

const LOGS = [
  { event: 'Admin login verified', user: 'admin@salesflowhub.com', ip: '103.45.22.11', status: 'Verified' },
  { event: 'Failed login attempt', user: 'unknown@demo.com', ip: '49.36.18.77', status: 'Blocked' },
  { event: 'Role changed', user: 'owner@acme.com', ip: '103.45.22.11', status: 'Approved' },
  { event: 'Password reset requested', user: 'manager@bright.com', ip: '122.170.16.9', status: 'Pending' },
];

export default function Security() {
  return (
    <div className="p-6 space-y-6">
      <PageHeader title="Security" subtitle="Access control, login checks and audit protection" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Security Score" value="96%" icon={ShieldCheck} iconBg="bg-emerald-100" iconColor="text-emerald-600" />
        <StatCard title="Blocked Attempts" value="18" icon={Lock} iconBg="bg-red-100" iconColor="text-red-600" />
        <StatCard title="Warnings" value="4" icon={AlertTriangle} iconBg="bg-yellow-100" iconColor="text-yellow-600" />
        <StatCard title="Verified Admins" value="7" icon={UserCheck} iconBg="bg-blue-100" iconColor="text-blue-600" />
      </div>
      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100"><h2 className="font-bold text-gray-900">Security Events</h2></div>
        <table className="w-full text-sm"><thead className="bg-gray-50"><tr>{['Event','User','IP Address','Status'].map(h=><th key={h} className="table-th">{h}</th>)}</tr></thead><tbody>{LOGS.map((l,i)=><tr key={i} className="table-tr"><td className="table-td font-semibold text-gray-900">{l.event}</td><td className="table-td">{l.user}</td><td className="table-td text-gray-500">{l.ip}</td><td className="table-td"><Badge label={l.status} /></td></tr>)}</tbody></table>
      </div>
    </div>
  );
}
