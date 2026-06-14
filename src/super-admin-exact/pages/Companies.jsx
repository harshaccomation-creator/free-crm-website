import { useState } from 'react';
import { Search, Plus, Eye, Building2, Users, TrendingUp, CreditCard } from 'lucide-react';
import Badge from '../components/shared/Badge';
import StatCard from '../components/shared/StatCard';
import PageHeader from '../components/shared/PageHeader';
import { COMPANIES, formatINR } from '../data/mockData';

const AVATAR_COLORS = ['bg-blue-500','bg-violet-500','bg-emerald-500','bg-orange-500','bg-pink-500','bg-indigo-500'];
const getColor = (name) => AVATAR_COLORS[name.split('').reduce((a,c) => a+c.charCodeAt(0), 0) % AVATAR_COLORS.length];
const getInitials = (name) => name.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase();
const TABS = ['All','Active','Trial','Suspended'];

export default function Companies() {
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('All');
  const filtered = COMPANIES.filter(c => {
    const ms = c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase());
    const mt = tab === 'All' || c.status === tab;
    return ms && mt;
  });
  const totalMRR = COMPANIES.filter(c => c.status === 'Active').reduce((a, c) => a + c.mrr, 0);
  const tabCount = (t) => t === 'All' ? COMPANIES.length : COMPANIES.filter(c => c.status === t).length;

  return (
    <div className="p-6 space-y-6">
      <PageHeader title="Companies" subtitle="All tenant organizations on the platform"
        actions={<button className="btn-primary flex items-center gap-2"><Plus className="w-4 h-4" />Add Company</button>} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Companies" value={COMPANIES.length} icon={Building2} iconBg="bg-blue-100" iconColor="text-blue-600" subtitle="registered" />
        <StatCard title="Active" value={COMPANIES.filter(c=>c.status==='Active').length} icon={TrendingUp} iconBg="bg-emerald-100" iconColor="text-emerald-600" subtitle="paying" />
        <StatCard title="On Trial" value={COMPANIES.filter(c=>c.status==='Trial').length} icon={Users} iconBg="bg-yellow-100" iconColor="text-yellow-600" subtitle="14-day trial" />
        <StatCard title="Total MRR" value={formatINR(totalMRR)} icon={CreditCard} iconBg="bg-orange-100" iconColor="text-orange-600" subtitle="monthly" />
      </div>

      <div className="card overflow-hidden">
        {/* Tabs */}
        <div className="border-b border-gray-200 px-4">
          <div className="flex gap-0">
            {TABS.map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`flex items-center gap-1.5 px-4 py-3.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap
                  ${tab===t ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-900'}`}>
                {t}
                <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${tab===t ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-500'}`}>{tabCount(t)}</span>
              </button>
            ))}
          </div>
        </div>
        {/* Search */}
        <div className="p-4 border-b border-gray-100 bg-gray-50">
          <div className="relative w-80">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input type="search" placeholder="Search companies..." value={search} onChange={e=>setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 w-full text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
          </div>
        </div>
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>{['Company','Plan','Status','Users','Leads','MRR','Joined','Actions'].map(h=>(
                <th key={h} className="table-th">{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {filtered.map(co => (
                <tr key={co.id} className="table-tr">
                  <td className="table-td">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-full ${getColor(co.name)} flex items-center justify-center text-white font-bold text-xs flex-shrink-0`}>{getInitials(co.name)}</div>
                      <div><p className="font-semibold text-gray-900">{co.name}</p><p className="text-xs text-gray-400">{co.email}</p></div>
                    </div>
                  </td>
                  <td className="table-td"><Badge label={co.plan} /></td>
                  <td className="table-td"><Badge label={co.status} /></td>
                  <td className="table-td font-medium">{co.users}</td>
                  <td className="table-td font-medium">{co.leads}</td>
                  <td className="table-td font-semibold text-gray-900">{co.mrr > 0 ? formatINR(co.mrr) : '—'}</td>
                  <td className="table-td text-gray-400">{new Date(co.joinedAt).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}</td>
                  <td className="table-td">
                    <button className="p-1.5 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors"><Eye className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-gray-100 text-xs text-gray-500">Showing {filtered.length} of {COMPANIES.length} companies</div>
      </div>
    </div>
  );
}
