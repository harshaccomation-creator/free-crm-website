import { Package, Check, Users, CreditCard, TrendingUp } from 'lucide-react';
import StatCard from '../components/shared/StatCard';
import PageHeader from '../components/shared/PageHeader';
import { PLANS, formatINR } from '../data/mockData';

const PLAN_COLORS = { blue: 'border-blue-200 bg-blue-50', orange: 'border-orange-200 bg-orange-50', purple: 'border-purple-200 bg-purple-50' };
const PLAN_BTN = { blue: 'bg-blue-500 hover:bg-blue-600', orange: 'bg-orange-500 hover:bg-orange-600', purple: 'bg-purple-600 hover:bg-purple-700' };
const PLAN_BADGE = { blue: 'bg-blue-500', orange: 'bg-orange-500', purple: 'bg-purple-600' };

export default function Plans() {
  const totalRevenue = PLANS.reduce((a, p) => a + p.revenue, 0);
  const totalSubs = PLANS.reduce((a, p) => a + p.activeSubscriptions, 0);

  return (
    <div className="p-6 space-y-6">
      <PageHeader title="Plans & Pricing" subtitle="Manage subscription plans and pricing tiers"
        actions={<button className="btn-primary flex items-center gap-2"><Package className="w-4 h-4" />Add Plan</button>} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <StatCard title="Total Revenue" value={formatINR(totalRevenue)} icon={CreditCard} iconBg="bg-orange-100" iconColor="text-orange-600" subtitle="combined MRR" />
        <StatCard title="Total Subscribers" value={totalSubs} icon={Users} iconBg="bg-blue-100" iconColor="text-blue-600" subtitle="across all plans" />
        <StatCard title="Avg Revenue/User" value={formatINR(Math.floor(totalRevenue/totalSubs))} icon={TrendingUp} iconBg="bg-emerald-100" iconColor="text-emerald-600" subtitle="per subscriber" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {PLANS.map(plan => (
          <div key={plan.id} className={`card p-6 border-2 ${PLAN_COLORS[plan.color]} relative overflow-hidden`}>
            <div className={`absolute top-4 right-4 w-3 h-3 rounded-full ${PLAN_BADGE[plan.color]}`} />
            <div className="mb-4">
              <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">{plan.billingCycle}</p>
              <h3 className="text-xl font-bold text-gray-900 mt-1">{plan.name}</h3>
              <div className="flex items-end gap-1 mt-2">
                <span className="text-3xl font-bold text-gray-900">{formatINR(plan.price)}</span>
                <span className="text-gray-400 mb-1">/mo</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4 p-3 bg-white rounded-lg">
              <div className="text-center">
                <p className="text-xl font-bold text-gray-900">{plan.activeSubscriptions}</p>
                <p className="text-xs text-gray-400">Subscribers</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-gray-900">{formatINR(plan.revenue)}</p>
                <p className="text-xs text-gray-400">MRR</p>
              </div>
            </div>
            <div className="space-y-2 mb-5">
              {plan.features.map(f => (
                <div key={f} className="flex items-center gap-2 text-sm text-gray-700">
                  <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  {f}
                </div>
              ))}
            </div>
            <button className={`w-full py-2.5 rounded-lg text-white font-semibold text-sm transition-colors ${PLAN_BTN[plan.color]}`}>
              Edit Plan
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
