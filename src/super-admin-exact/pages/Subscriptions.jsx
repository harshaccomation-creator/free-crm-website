import { useState } from 'react';
import { CreditCard, TrendingUp, AlertTriangle, CheckCircle2 } from 'lucide-react';
import Badge from '../components/shared/Badge';
import StatCard from '../components/shared/StatCard';
import PageHeader from '../components/shared/PageHeader';
import { SUBSCRIPTIONS, formatINR } from '../data/mockData';

const TABS = ['All','Active','Trial','Suspended'];
const tabCount = (t) => t==='All'?SUBSCRIPTIONS.length:SUBSCRIPTIONS.filter(s=>s.status===t).length;

export default function Subscriptions() {
  const [tab, setTab] = useState('All');
  const totalMRR = SUBSCRIPTIONS.filter(s=>s.status==='Active').reduce((a,s)=>a+s.mrr,0);
  const filtered = tab==='All'?SUBSCRIPTIONS:SUBSCRIPTIONS.filter(s=>s.status===tab);

  return (
    <div className="p-6 space-y-6">
      <PageHeader title="Subscriptions" subtitle="Billing and subscription management" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total MRR" value={formatINR(totalMRR)} icon={CreditCard} iconBg="bg-orange-100" iconColor="text-orange-600" trend="+12.4% vs last month" trendUp />
        <StatCard title="Active Subs" value={SUBSCRIPTIONS.filter(s=>s.status==='Active').length} icon={CheckCircle2} iconBg="bg-emerald-100" iconColor="text-emerald-600" subtitle="paying customers" />
        <StatCard title="Trials" value={SUBSCRIPTIONS.filter(s=>s.status==='Trial').length} icon={TrendingUp} iconBg="bg-blue-100" iconColor="text-blue-600" subtitle="14-day trial" />
        <StatCard title="Suspended" value={SUBSCRIPTIONS.filter(s=>s.status==='Suspended').length} icon={AlertTriangle} iconBg="bg-red-100" iconColor="text-red-600" subtitle="payment failed" />
      </div>

      <div className="card overflow-hidden">
        <div className="border-b border-gray-200 px-4">
          <div className="flex">{TABS.map(t=>(
            <button key={t} onClick={()=>setTab(t)}
              className={`flex items-center gap-1.5 px-4 py-3.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${tab===t?'border-orange-500 text-orange-600':'border-transparent text-gray-500 hover:text-gray-900'}`}>
              {t} <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${tab===t?'bg-orange-100 text-orange-600':'bg-gray-100 text-gray-500'}`}>{tabCount(t)}</span>
            </button>
          ))}</div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>{['ID','Company','Plan','Status','MRR','Start Date','Next Billing','Payment'].map(h=><th key={h} className="table-th">{h}</th>)}</tr>
            </thead>
            <tbody>
              {filtered.map(s=>(
                <tr key={s.id} className="table-tr">
                  <td className="table-td text-gray-400 font-mono text-xs">{s.id}</td>
                  <td className="table-td font-semibold text-gray-900">{s.company}</td>
                  <td className="table-td"><Badge label={s.plan} /></td>
                  <td className="table-td"><Badge label={s.status} /></td>
                  <td className="table-td font-semibold text-gray-900">{s.mrr>0?formatINR(s.mrr):'—'}</td>
                  <td className="table-td text-gray-500 whitespace-nowrap">{new Date(s.startDate).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}</td>
                  <td className="table-td text-gray-500 whitespace-nowrap">{s.nextBilling!=='-'?new Date(s.nextBilling).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'}):'-'}</td>
                  <td className="table-td text-gray-400 text-xs">{s.paymentMethod}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
