import React, { useState } from 'react';
import { SystemLog } from '../types';
import {
  Mail,
  Search,
  Filter,
  Megaphone,
  BellRing,
  AlertTriangle,
  Info,
  CheckCircle,
  XCircle,
  Terminal,
  Eraser
} from 'lucide-react';

interface LogsManagerProps {
  logs: SystemLog[];
  onClearLogs: () => void;
  announcement: string;
  onSetAnnouncement: (msg: string) => void;
}

export default function LogsManager({
  logs,
  onClearLogs,
  announcement,
  onSetAnnouncement
}: LogsManagerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'All' | 'System' | 'Email' | 'Security' | 'Billing'>('All');
  const [announcementText, setAnnouncementText] = useState(announcement);

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.userEmail && log.userEmail.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (log.ipAddress && log.ipAddress.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = categoryFilter === 'All' ? true : log.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-rose-600 shrink-0" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />;
      default:
        return <Info className="h-4 w-4 text-blue-600 shrink-0" />;
    }
  };

  const getCategoryTheme = (category: string) => {
    switch (category) {
      case 'Security':
        return 'bg-rose-950/40 text-rose-350 border-rose-800/40';
      case 'Billing':
        return 'bg-amber-950/40 text-amber-350 border-amber-800/40';
      case 'Email':
        return 'bg-purple-950/40 text-purple-350 border-purple-800/40';
      default:
        return 'bg-blue-950/40 text-blue-350 border-blue-800/40';
    }
  };

  const handlePublishAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    onSetAnnouncement(announcementText.trim());
    alert(
      announcementText.trim()
        ? 'Broadcast set! A warning banner has been published at the top of the interface for all mock users.'
        : 'Announcement broadcast cleared.'
    );
  };

  return (
    <div className="space-y-6 select-none animate-fadeIn">
      {/* Grid: Global Announcement on left, system log telemetry on right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Announcement Form Card */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 lg:col-span-1 space-y-4 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Megaphone className="h-4.5 w-4.5 text-blue-600 animate-bounce" />
            <h3 className="font-extrabold text-slate-900 text-sm">Announcement Broadcast</h3>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Dispatch urgent banners to all multi-tenant customer login dashboards instantly. Useful for server updates or alerts.
          </p>

          <form onSubmit={handlePublishAnnouncement} className="space-y-3">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-slate-450 tracking-wider">Broadcast Banner Content</label>
              <textarea
                className="w-full bg-slate-50 border border-slate-200 rounded-md p-2.5 text-xs text-slate-800 font-semibold h-24 focus:outline-none focus:bg-white focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] transition-all placeholder-slate-405 leading-normal"
                placeholder="e.g. MAINTENANCE NOTIFICATION: CRM platform databases will restart June 24 at 02:00 UTC."
                value={announcementText}
                onChange={(e) => setAnnouncementText(e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-[#3b82f6] hover:bg-blue-600 text-white font-bold text-xs px-4 py-2.5 rounded cursor-pointer flex-1 text-center transition-colors shadow-sm"
              >
                {announcementText.trim() ? 'Publish Broadcast' : 'Clear Announcement'}
              </button>
              {announcementText && (
                <button
                  type="button"
                  onClick={() => {
                    setAnnouncementText('');
                    onSetAnnouncement('');
                  }}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200 p-2 rounded cursor-pointer transition-colors"
                  title="Clear field"
                >
                  <Eraser className="h-4 w-4" />
                </button>
              )}
            </div>
          </form>

          {/* Real time feedback preview component */}
          {announcement && (
            <div className="bg-amber-950/30 border border-amber-800/30 rounded-md p-3.5 space-y-1.5 mt-2 animate-pulse">
              <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                <BellRing className="h-3.5 w-3.5" /> Live Banner Preview
              </div>
              <p className="text-[11px] text-slate-350 italic font-medium">"{announcement}"</p>
            </div>
          )}
        </div>

        {/* Telemetry log list search */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 lg:col-span-2 flex flex-col justify-between shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Terminal className="h-4.5 w-4.5 text-blue-600 shrink-0" />
                <h3 className="font-extrabold text-slate-900 text-sm">System Log Output</h3>
              </div>
              <button
                onClick={() => {
                  if (confirm('Clear super admin log buffer?')) {
                    onClearLogs();
                  }
                }}
                className="text-[10px] uppercase font-bold text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
              >
                Clear Log List
              </button>
            </div>

            {/* Filter outputs */}
            <div className="flex flex-col sm:flex-row gap-3 items-center">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter by IP, recipient email, or message keyword..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-md pl-8 pr-3 py-1.5 text-xs text-slate-800 font-semibold focus:outline-none focus:bg-white focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] transition-all placeholder-slate-400"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                <span className="text-[11px] text-slate-500 font-bold shrink-0 font-sans">Group:</span>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value as any)}
                  className="bg-slate-50 border border-slate-200 text-xs text-slate-700 rounded-md px-3 py-1.5 focus:outline-none cursor-pointer w-full font-semibold"
                >
                  <option value="All">All Categories</option>
                  <option value="System">System core</option>
                  <option value="Email">Email pings</option>
                  <option value="Security">Security Access</option>
                  <option value="Billing">Billing webhook</option>
                </select>
              </div>
            </div>

            {/* Telemetry list */}
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {filteredLogs.length === 0 ? (
                <div className="h-40 flex items-center justify-center text-center text-xs text-slate-400 font-bold">
                  No active system log telemetry matched your filter keywords.
                </div>
              ) : (
                filteredLogs.map((log) => (
                  <div
                    key={log.id}
                    className="bg-slate-900/65 border border-slate-800/80 rounded p-3 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-start gap-2.5">
                      {getStatusIcon(log.status)}
                      <div>
                        <div className="font-bold text-slate-100">{log.message}</div>
                        <div className="text-[10px] text-slate-500 mt-1 flex flex-wrap gap-x-2.5 gap-y-1 items-center">
                          <span className="font-mono text-[9px] bg-slate-800 border border-slate-700 px-1 py-0.5 rounded text-slate-400 font-semibold">
                            {log.timestamp}
                          </span>
                          {log.userEmail && (
                            <span className="text-purple-300 bg-purple-950/55 border border-purple-800/40 font-mono font-bold px-1.5 py-0.5 rounded text-[9px]">
                              User: {log.userEmail}
                            </span>
                          )}
                          {log.ipAddress && (
                            <span className="text-blue-300 bg-blue-950/55 border border-blue-800/40 font-mono font-bold px-1.5 py-0.5 rounded text-[9px]">
                              IP: {log.ipAddress}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded border font-mono tracking-wider shrink-0 ${getCategoryTheme(log.category)}`}>
                      {log.category}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
