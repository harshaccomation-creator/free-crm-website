import { useState } from 'react';
import { Ticket, AlertCircle, Clock, CheckCircle2, XCircle } from 'lucide-react';
import Badge from '../components/shared/Badge';
import StatCard from '../components/shared/StatCard';
import PageHeader from '../components/shared/PageHeader';
import { SUPPORT_TICKETS, timeAgo } from '../data/mockData';

const AVATAR_COLORS=['bg-blue-500','bg-violet-500','bg-emerald-500','bg-orange-500','bg-pink-500'];
const getColor=(n)=>AVATAR_COLORS[n.split('').reduce((a,c)=>a+c.charCodeAt(0),0)%AVATAR_COLORS.length];
const getInitials=(n)=>n.split(' ').map(x=>x[0]).join('').slice(0,2).toUpperCase();
const TABS=['All','Open','In Progress','Resolved','Closed'];
const tabCount=(t)=>t==='All'?SUPPORT_TICKETS.length:SUPPORT_TICKETS.filter(s=>s.status===t).length;

export default function SupportTickets() {
  const [tab, setTab] = useState('All');
  const filtered = tab==='All'?SUPPORT_TICKETS:SUPPORT_TICKETS.filter(s=>s.status===tab);

  return (
    <div className="p-6 space-y-6">
      <PageHeader title="Support Tickets" subtitle="Customer issues and help requests" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Tickets" value={SUPPORT_TICKETS.length} icon={Ticket} iconBg="bg-blue-100" iconColor="text-blue-600" subtitle="all time" />
        <StatCard title="Open" value={SUPPORT_TICKETS.filter(t=>t.status==='Open').length} icon={AlertCircle} iconBg="bg-red-100" iconColor="text-red-600" subtitle="needs action" />
        <StatCard title="In Progress" value={SUPPORT_TICKETS.filter(t=>t.status==='In Progress').length} icon={Clock} iconBg="bg-yellow-100" iconColor="text-yellow-600" subtitle="being handled" />
        <StatCard title="Resolved" value={SUPPORT_TICKETS.filter(t=>['Resolved','Closed'].includes(t.status)).length} icon={CheckCircle2} iconBg="bg-emerald-100" iconColor="text-emerald-600" subtitle="completed" />
      </div>

      <div className="card overflow-hidden">
        <div className="border-b border-gray-200 px-4">
          <div className="flex overflow-x-auto">{TABS.map(t=>(
            <button key={t} onClick={()=>setTab(t)}
              className={`flex items-center gap-1.5 px-4 py-3.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${tab===t?'border-orange-500 text-orange-600':'border-transparent text-gray-500 hover:text-gray-900'}`}>
              {t} <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${tab===t?'bg-orange-100 text-orange-600':'bg-gray-100 text-gray-500'}`}>{tabCount(t)}</span>
            </button>
          ))}</div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>{['ID','Subject','User','Company','Category','Priority','Status','Assigned To','Updated'].map(h=><th key={h} className="table-th">{h}</th>)}</tr>
            </thead>
            <tbody>
              {filtered.map(t=>(
                <tr key={t.id} className="table-tr">
                  <td className="table-td text-gray-400 font-mono text-xs">{t.id}</td>
                  <td className="table-td font-semibold text-gray-900 max-w-[200px] truncate">{t.subject}</td>
                  <td className="table-td">
                    <div className="flex items-center gap-2">
                      <div className={`w-7 h-7 rounded-full ${getColor(t.user)} flex items-center justify-center text-white font-bold text-[10px] flex-shrink-0`}>{getInitials(t.user)}</div>
                      <span className="text-gray-700">{t.user}</span>
                    </div>
                  </td>
                  <td className="table-td text-gray-500 whitespace-nowrap">{t.company}</td>
                  <td className="table-td"><span className="bg-gray-100 text-gray-600 badge">{t.category}</span></td>
                  <td className="table-td"><Badge label={t.priority} /></td>
                  <td className="table-td"><Badge label={t.status} /></td>
                  <td className="table-td text-gray-400 whitespace-nowrap">{t.assignedTo}</td>
                  <td className="table-td text-gray-400 whitespace-nowrap">{timeAgo(t.updatedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
