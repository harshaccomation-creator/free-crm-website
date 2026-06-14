const VARIANTS = {
  Active: 'bg-emerald-100 text-emerald-700',
  Operational: 'bg-emerald-100 text-emerald-700',
  Delivered: 'bg-emerald-100 text-emerald-700',
  Completed: 'bg-emerald-100 text-emerald-700',
  Resolved: 'bg-emerald-100 text-emerald-700',
  Closed: 'bg-gray-100 text-gray-600',
  Trial: 'bg-blue-100 text-blue-700',
  Scheduled: 'bg-blue-100 text-blue-700',
  Pending: 'bg-yellow-100 text-yellow-700',
  'In Progress': 'bg-yellow-100 text-yellow-700',
  Degraded: 'bg-yellow-100 text-yellow-700',
  Suspended: 'bg-red-100 text-red-700',
  Failed: 'bg-red-100 text-red-700',
  'No-Show': 'bg-red-100 text-red-700',
  Open: 'bg-orange-100 text-orange-700',
  Critical: 'bg-red-100 text-red-700',
  High: 'bg-red-100 text-red-700',
  Medium: 'bg-orange-100 text-orange-700',
  Low: 'bg-blue-100 text-blue-700',
  Enterprise: 'bg-purple-100 text-purple-700',
  Professional: 'bg-orange-100 text-orange-700',
  Starter: 'bg-blue-100 text-blue-700',
  Error: 'bg-red-100 text-red-700',
  Warning: 'bg-yellow-100 text-yellow-700',
  Success: 'bg-emerald-100 text-emerald-700',
  Info: 'bg-gray-100 text-gray-600',
};

export default function Badge({ label }) {
  const cls = VARIANTS[label] || 'bg-gray-100 text-gray-600';
  return <span className={`badge ${cls}`}>{label}</span>;
}
