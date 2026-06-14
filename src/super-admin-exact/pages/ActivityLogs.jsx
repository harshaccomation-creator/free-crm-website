import { useState } from 'react';
import { Activity, Shield, CreditCard, AlertTriangle, Info } from 'lucide-react';
import PageHeader from '../components/shared/PageHeader';
import { ACTIVITY_LOGS, timeAgo } from '../data/mockData';

const SEVERITY_STYLE = {
  Error: { bg: 'bg-red-100', text: 'text-red-600', icon: <AlertTriangle className="w-4 h-4 text-red-500" /> },
  Warning: { bg: 'bg-yellow-100', text: 'text-yellow-600', icon: <AlertTriangle className="w-4 h-4 text-yellow-500" /> },
  Success: { bg: 'bg-emerald-100', text: 'text-emerald-600', icon: <Activity className="w-4 h-4 text-emerald-500" /> },
  Info: { bg: 'bg-gray-100', text: 'text-gray-500', icon: <Info className="w-4 h-4 text-gray-400" /> },
};

const TYPE_TABS = ['All', 'Login', 'Payment', 'Security', 'Plan Change', 'API'];
const tabCount = (t) => t==='All'?ACTIVITY_LOGS.length:ACTIVITY_LOGS.filter(l=>l.type===t).length;

export default function ActivityLogs() {
  const [tab, setTab] = useState('All');
  const filtered = tab==='All'?ACTIVITY_LOGS:ACTIVITY_LOGS.filter(l=>l.type===tab);

  return (
    <div className="p-6 space-y-6">
      <PageHeader title="Activity Logs" subtitle="All user and system events across the platform" />

      <div className="card overflow-hidden">
        <div className="border-b border-gray-200 px-4 overflow-x-auto">
          <div className="flex min-w-max">{TYPE_TABS.map(t=>(
            <button key={t} onClick={()=>setTab(t)}
              className={`flex items-center gap-1.5 px-4 py-3.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${tab===t?'border-orange-500 text-orange-600':'border-transparent text-gray-500 hover:text-gray-900'}`}>
              {t} <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${tab===t?'bg-orange-100 text-orange-600':'bg-gray-100 text-gray-500'}`}>{tabCount(t)}</span>
            </button>
          ))}</div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>{['Severity','Type','Action','User','Company','IP','Time'].map(h=><th key={h} className="table-th">{h}</th>)}</tr>
            </thead>
            <tbody>
              {filtered.map(log=>{
                const s = SEVERITY_STYLE[log.severity] || SEVERITY_STYLE.Info;
                return (
                  <tr key={log.id} className="table-tr">
                    <td className="table-td">
                      <div className={`w-8 h-8 rounded-full ${s.bg} flex items-center justify-center`}>{s.icon}</div>
                    </td>
                    <td className="table-td"><span className="bg-gray-100 text-gray-600 badge">{log.type}</span></td>
                    <td className="table-td text-gray-800 max-w-xs truncate">{log.action}</td>
                    <td className="table-td font-medium text-gray-900">{log.user}</td>
                    <td className="table-td text-gray-500">{log.company}</td>
                    <td className="table-td text-gray-400 font-mono text-xs">{log.ip}</td>
                    <td className="table-td text-gray-400 whitespace-nowrap">{timeAgo(log.timestamp)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
