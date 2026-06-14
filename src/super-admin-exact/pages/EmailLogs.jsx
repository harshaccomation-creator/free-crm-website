import { Mail, CheckCircle2, XCircle, Eye, MousePointer } from 'lucide-react';
import StatCard from '../components/shared/StatCard';
import Badge from '../components/shared/Badge';
import PageHeader from '../components/shared/PageHeader';
import { EMAIL_LOGS, timeAgo } from '../data/mockData';

export default function EmailLogs() {
  const delivered = EMAIL_LOGS.filter(e=>e.status==='Delivered').length;
  const failed = EMAIL_LOGS.filter(e=>e.status==='Failed').length;
  const opened = EMAIL_LOGS.filter(e=>e.openedAt).length;

  return (
    <div className="p-6 space-y-6">
      <PageHeader title="Email Logs" subtitle="All transactional emails sent from the platform" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Sent" value={EMAIL_LOGS.length} icon={Mail} iconBg="bg-blue-100" iconColor="text-blue-600" subtitle="all time" />
        <StatCard title="Delivered" value={delivered} icon={CheckCircle2} iconBg="bg-emerald-100" iconColor="text-emerald-600" subtitle={`${Math.round(delivered/EMAIL_LOGS.length*100)}% rate`} />
        <StatCard title="Opened" value={opened} icon={Eye} iconBg="bg-purple-100" iconColor="text-purple-600" subtitle="read receipts" />
        <StatCard title="Failed" value={failed} icon={XCircle} iconBg="bg-red-100" iconColor="text-red-600" subtitle="delivery failed" />
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>{['To','Subject','Type','Status','Sent','Opened'].map(h=><th key={h} className="table-th">{h}</th>)}</tr>
            </thead>
            <tbody>
              {EMAIL_LOGS.map(e=>(
                <tr key={e.id} className="table-tr">
                  <td className="table-td text-gray-700">{e.to}</td>
                  <td className="table-td text-gray-800 font-medium max-w-xs truncate">{e.subject}</td>
                  <td className="table-td"><span className="bg-gray-100 text-gray-600 badge">{e.type}</span></td>
                  <td className="table-td"><Badge label={e.status} /></td>
                  <td className="table-td text-gray-400 whitespace-nowrap">{timeAgo(e.sentAt)}</td>
                  <td className="table-td">{e.openedAt ? <span className="text-xs text-emerald-600 font-medium flex items-center gap-1"><Eye className="w-3 h-3" />{timeAgo(e.openedAt)}</span> : <span className="text-xs text-gray-300">—</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
