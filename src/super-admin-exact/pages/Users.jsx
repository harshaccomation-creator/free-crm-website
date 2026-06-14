import { useState } from 'react';
import { Search, Users, UserCheck, ShieldAlert, Clock } from 'lucide-react';
import Badge from '../components/shared/Badge';
import StatCard from '../components/shared/StatCard';
import PageHeader from '../components/shared/PageHeader';
import { USERS, timeAgo } from '../data/mockData';

const AVATAR_COLORS = ['bg-blue-500','bg-violet-500','bg-emerald-500','bg-orange-500','bg-pink-500','bg-indigo-500'];
const getColor = (name) => AVATAR_COLORS[name.split('').reduce((a,c)=>a+c.charCodeAt(0),0)%AVATAR_COLORS.length];
const getInitials = (name) => name.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase();
const TABS = ['All','Active','Trial','Suspended'];
const tabCount = (t) => t==='All'?USERS.length:USERS.filter(u=>u.status===t).length;

export default function Users() {
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('All');
  const filtered = USERS.filter(u => {
    const ms = u.name.toLowerCase().includes(search.toLowerCase())||u.email.toLowerCase().includes(search.toLowerCase())||u.company.toLowerCase().includes(search.toLowerCase());
    const mt = tab==='All'||u.status===tab;
    return ms&&mt;
  });

  return (
    <div className="p-6 space-y-6">
      <PageHeader title="Users" subtitle="All registered users across all companies" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Users" value={USERS.length} icon={Users} iconBg="bg-blue-100" iconColor="text-blue-600" subtitle="all companies" />
        <StatCard title="Active" value={USERS.filter(u=>u.status==='Active').length} icon={UserCheck} iconBg="bg-emerald-100" iconColor="text-emerald-600" subtitle="paying users" />
        <StatCard title="On Trial" value={USERS.filter(u=>u.status==='Trial').length} icon={Clock} iconBg="bg-yellow-100" iconColor="text-yellow-600" subtitle="14-day trial" />
        <StatCard title="Suspended" value={USERS.filter(u=>u.status==='Suspended').length} icon={ShieldAlert} iconBg="bg-red-100" iconColor="text-red-600" subtitle="blocked access" />
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
        <div className="p-4 border-b border-gray-100 bg-gray-50">
          <div className="relative w-80">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input type="search" placeholder="Search users, company..." value={search} onChange={e=>setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 w-full text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>{['User','Company','Role','Plan','Status','Last Login','Joined'].map(h=><th key={h} className="table-th">{h}</th>)}</tr>
            </thead>
            <tbody>
              {filtered.map(u=>(
                <tr key={u.id} className="table-tr">
                  <td className="table-td">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-full ${getColor(u.name)} flex items-center justify-center text-white font-bold text-xs flex-shrink-0`}>{getInitials(u.name)}</div>
                      <div><p className="font-semibold text-gray-900">{u.name}</p><p className="text-xs text-gray-400">{u.email}</p></div>
                    </div>
                  </td>
                  <td className="table-td text-gray-600">{u.company}</td>
                  <td className="table-td"><span className="bg-gray-100 text-gray-600 badge">{u.role}</span></td>
                  <td className="table-td"><Badge label={u.plan} /></td>
                  <td className="table-td"><Badge label={u.status} /></td>
                  <td className="table-td text-gray-400 whitespace-nowrap">{timeAgo(u.lastLogin)}</td>
                  <td className="table-td text-gray-400 whitespace-nowrap">{new Date(u.joinedAt).toLocaleDateString('en-IN',{day:'numeric',month:'short'})}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-gray-100 text-xs text-gray-500">Showing {filtered.length} of {USERS.length} users</div>
      </div>
    </div>
  );
}
