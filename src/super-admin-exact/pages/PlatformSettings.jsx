import { Settings, Globe, Mail, Database } from 'lucide-react';
import PageHeader from '../components/shared/PageHeader';
import StatCard from '../components/shared/StatCard';

const settings = [
  { title: 'Trial Duration', value: '7 Days', note: 'New company default trial period' },
  { title: 'SMTP Provider', value: 'Brevo', note: 'Transactional email service' },
  { title: 'Default Currency', value: 'INR', note: 'Used across billing and reports' },
  { title: 'Maintenance Mode', value: 'Off', note: 'Client portals remain live' },
];

export default function PlatformSettings() {
  return (
    <div className="p-6 space-y-6">
      <PageHeader title="Platform Settings" subtitle="Global configuration for SalesFlow Hub" actions={<button className="btn-primary">Save Changes</button>} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Environment" value="Live" icon={Globe} iconBg="bg-emerald-100" iconColor="text-emerald-600" />
        <StatCard title="Email System" value="Active" icon={Mail} iconBg="bg-blue-100" iconColor="text-blue-600" />
        <StatCard title="Database" value="Healthy" icon={Database} iconBg="bg-violet-100" iconColor="text-violet-600" />
        <StatCard title="Settings" value="24" icon={Settings} iconBg="bg-orange-100" iconColor="text-orange-600" />
      </div>
      <div className="grid lg:grid-cols-2 gap-4">{settings.map(s=><div key={s.title} className="card p-5"><p className="text-sm font-semibold text-gray-500">{s.title}</p><p className="text-2xl font-bold text-gray-900 mt-1">{s.value}</p><p className="text-sm text-gray-400 mt-2">{s.note}</p></div>)}</div>
    </div>
  );
}
