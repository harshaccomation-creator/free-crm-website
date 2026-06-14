import { Bell, Mail, AlertTriangle, CheckCircle2 } from 'lucide-react';
import PageHeader from '../components/shared/PageHeader';
import StatCard from '../components/shared/StatCard';
import Badge from '../components/shared/Badge';

const ITEMS = [
  { title: 'Overdue follow-ups found', type: 'Alert', channel: 'System', time: '5 min ago', status: 'Open' },
  { title: 'Weekly report sent to admins', type: 'Email', channel: 'SMTP', time: '1 hour ago', status: 'Delivered' },
  { title: 'Trial expiry reminder queued', type: 'Reminder', channel: 'Email', time: 'Today', status: 'Pending' },
  { title: 'New company registration', type: 'Info', channel: 'System', time: 'Yesterday', status: 'Read' },
];

export default function Notifications() {
  return (
    <div className="p-6 space-y-6">
      <PageHeader title="Notifications" subtitle="Platform alerts, reminders and delivery status" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Alerts" value="128" icon={Bell} iconBg="bg-orange-100" iconColor="text-orange-600" />
        <StatCard title="Emails Sent" value="3,482" icon={Mail} iconBg="bg-blue-100" iconColor="text-blue-600" />
        <StatCard title="Open Alerts" value="12" icon={AlertTriangle} iconBg="bg-red-100" iconColor="text-red-600" />
        <StatCard title="Delivered" value="98.6%" icon={CheckCircle2} iconBg="bg-emerald-100" iconColor="text-emerald-600" />
      </div>
      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100"><h2 className="font-bold text-gray-900">Recent Notifications</h2></div>
        <div className="divide-y divide-gray-100">{ITEMS.map((n,i)=><div key={i} className="p-5 flex items-center justify-between gap-4"><div><p className="font-semibold text-gray-900">{n.title}</p><p className="text-sm text-gray-500">{n.channel} • {n.time}</p></div><div className="flex items-center gap-3"><Badge label={n.type} /><Badge label={n.status} /></div></div>)}</div>
      </div>
    </div>
  );
}
