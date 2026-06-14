import { useState } from 'react';
import { CalendarCheck, Clock, CheckCircle2, XCircle, Plus } from 'lucide-react';
import Badge from '../components/shared/Badge';
import StatCard from '../components/shared/StatCard';
import PageHeader from '../components/shared/PageHeader';
import { DEMO_REQUESTS, timeAgo } from '../data/mockData';

const AVATAR_COLORS=['bg-blue-500','bg-violet-500','bg-emerald-500','bg-orange-500','bg-pink-500'];
const getColor=(n)=>AVATAR_COLORS[n.split('').reduce((a,c)=>a+c.charCodeAt(0),0)%AVATAR_COLORS.length];
const getInitials=(n)=>n.split(' ').map(x=>x[0]).join('').slice(0,2).toUpperCase();
const TABS=['All','Pending','Scheduled','Completed','No-Show'];
const tabCount=(t)=>t==='All'?DEMO_REQUESTS.length:DEMO_REQUESTS.filter(d=>d.status===t).length;

export default function DemoRequests() {
  const [tab, setTab] = useState('All');
  const filtered = tab==='All'?DEMO_REQUESTS:DEMO_REQUESTS.filter(d=>d.status===tab);

  return (
    <div className="p-6 space-y-6">
      <PageHeader title="Demo Requests" subtitle="Incoming product demo requests"
        actions={<button className="btn-primary flex items-center gap-2"><Plus className="w-4 h-4" />Schedule Demo</button>} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Requests" value={DEMO_REQUESTS.length} icon={CalendarCheck} iconBg="bg-blue-100" iconColor="text-blue-600" subtitle="all time" />
        <StatCard title="Pending" value={DEMO_REQUESTS.filter(d=>d.status==='Pending').length} icon={Clock} iconBg="bg-yellow-100" iconColor="text-yellow-600" subtitle="need scheduling" />
        <StatCard title="Scheduled" value={DEMO_REQUESTS.filter(d=>d.status==='Scheduled').length} icon={CheckCircle2} iconBg="bg-emerald-100" iconColor="text-emerald-600" subtitle="confirmed" />
        <StatCard title="No-Show" value={DEMO_REQUESTS.filter(d=>d.status==='No-Show').length} icon={XCircle} iconBg="bg-red-100" iconColor="text-red-600" subtitle="missed" />
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
        <div className="divide-y divide-gray-100">
          {filtered.map(dr=>(
            <div key={dr.id} className="p-5 flex items-start gap-4 hover:bg-gray-50 transition-colors">
              <div className={`w-10 h-10 rounded-full ${getColor(dr.name)} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>{getInitials(dr.name)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-gray-900">{dr.name}</span>
                  <span className="text-gray-400 text-sm">·</span>
                  <span className="text-gray-600 text-sm">{dr.company}</span>
                  <Badge label={dr.plan} />
                  <Badge label={dr.status} />
                </div>
                <p className="text-sm text-gray-500 mt-0.5">{dr.email} · {dr.phone}</p>
                {dr.notes && <p className="text-sm text-gray-600 mt-1.5 bg-gray-50 rounded-lg px-3 py-2">{dr.notes}</p>}
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-xs text-gray-400">Requested {timeAgo(dr.requestedAt)}</p>
                {dr.scheduledAt && <p className="text-xs text-emerald-600 font-medium mt-1">Demo: {new Date(dr.scheduledAt).toLocaleString('en-IN',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'})}</p>}
                {dr.status==='Pending'&&<button className="mt-2 btn-primary text-xs px-3 py-1.5">Schedule</button>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
