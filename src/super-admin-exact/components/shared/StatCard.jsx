export default function StatCard({ title, value, subtitle, icon: Icon, iconBg = 'bg-orange-100', iconColor = 'text-orange-600', trend, trendUp }) {
  return (
    <div className="card p-5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-full ${iconBg} flex items-center justify-center flex-shrink-0`}>
        <Icon className={`w-6 h-6 ${iconColor}`} />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-gray-500 font-medium">{title}</p>
        <p className="text-2xl font-bold text-gray-900 leading-tight">{value}</p>
        {trend && (
          <p className={`text-xs font-semibold ${trendUp ? 'text-emerald-600' : 'text-red-500'}`}>{trend}</p>
        )}
        {subtitle && !trend && <p className="text-xs text-gray-400">{subtitle}</p>}
      </div>
    </div>
  );
}
