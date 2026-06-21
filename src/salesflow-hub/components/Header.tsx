import { useState, useRef, useEffect } from 'react';
import { Search, Bell, HelpCircle, Calendar, User, SearchSlash, ArrowUpRight, ChevronDown } from 'lucide-react';
import { Company, User as CRMUser, Lead } from '../types';

interface HeaderProps {
  companies: Company[];
  users: CRMUser[];
  leads: Lead[];
  onNavigateToTab: (tabId: string) => void;
  onEditEntity: (entityType: 'company' | 'user' | 'lead', entityId: string) => void;
  notificationCount: number;
  onBellClick: () => void;
  currentDateText?: string;
}

export default function Header({
  companies,
  users,
  leads,
  onNavigateToTab,
  onEditEntity,
  notificationCount,
  onBellClick,
  currentDateText = 'May 12 – Jun 12, 2025'
}: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Close results popover on clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter entities based on search
  const filteredCompanies = searchQuery
    ? companies.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.domain.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 3)
    : [];

  const filteredUsers = searchQuery
    ? users.filter(u =>
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 3)
    : [];

  const filteredLeads = searchQuery
    ? leads.filter(l =>
        l.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.contactName.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 3)
    : [];

  const totalResultsCount = filteredCompanies.length + filteredUsers.length + filteredLeads.length;

  return (
    <header className="h-16 border-b border-slate-850 bg-[#090D16]/80 backdrop-blur-md px-6 flex items-center justify-between text-slate-100 shrink-0 select-none relative z-10 shadow-sm">
      {/* Search Section */}
      <div ref={searchContainerRef} className="relative w-96">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search companies, users, invoices, tickets..."
            className="w-full bg-[#111827]/80 border border-slate-800 rounded-md pl-9 pr-12 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#3b82f6] focus:bg-[#0d1321] focus:ring-1 focus:ring-[#3b82f6] transition-all font-medium"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowResults(true);
            }}
            onFocus={() => setShowResults(true)}
          />
          <div className="absolute right-3 top-2 border border-slate-200 bg-slate-100 rounded px-1 text-[9px] text-slate-500 font-mono flex items-center gap-0.5">
            <span>⌘</span><span>K</span>
          </div>
        </div>

        {/* Global Live CRM Search Results Popover */}
        {showResults && searchQuery && (
          <div className="absolute top-11 left-0 w-full bg-[#0d1321] border border-slate-800 rounded-lg shadow-xl z-50 p-2 max-h-96 overflow-y-auto backdrop-blur-lg">
            <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-slate-400 tracking-wider flex justify-between border-b border-slate-800">
              <span>Quick CRM Matches</span>
              <span>{totalResultsCount} found</span>
            </div>

            {totalResultsCount === 0 ? (
              <div className="p-6 text-center flex flex-col items-center justify-center text-slate-450">
                <SearchSlash className="h-5 w-5 text-slate-500 mb-1" />
                <p className="text-xs font-medium">No records found matching "{searchQuery}"</p>
              </div>
            ) : (
              <div className="mt-2 space-y-3">
                {/* Companies Section */}
                {filteredCompanies.length > 0 && (
                  <div>
                    <div className="px-3 text-[9px] uppercase font-bold text-blue-400 tracking-wider">
                      Companies
                    </div>
                    <div className="mt-1 space-y-0.5">
                      {filteredCompanies.map(c => (
                        <button
                          key={c.id}
                          onClick={() => {
                            setShowResults(false);
                            onNavigateToTab('companies');
                            onEditEntity('company', c.id);
                          }}
                          className="w-full text-left px-3 py-1.5 rounded hover:bg-slate-850 flex items-center justify-between text-xs group transition-colors"
                        >
                          <div>
                            <div className="font-semibold text-slate-200 group-hover:text-blue-400 transition-colors">{c.name}</div>
                            <div className="text-[10px] text-slate-500">{c.domain}</div>
                          </div>
                          <span className="text-[9px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded font-bold uppercase group-hover:bg-blue-600/20 group-hover:text-blue-400">
                            {c.plan}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Users Section */}
                {filteredUsers.length > 0 && (
                  <div>
                    <div className="px-3 text-[9px] uppercase font-bold text-amber-400 tracking-wider">
                      Users
                    </div>
                    <div className="mt-1 space-y-0.5">
                      {filteredUsers.map(u => (
                        <button
                          key={u.id}
                          onClick={() => {
                            setShowResults(false);
                            onNavigateToTab('users');
                            onEditEntity('user', u.id);
                          }}
                          className="w-full text-left px-3 py-1.5 rounded hover:bg-slate-850 flex items-center justify-between text-xs group transition-colors"
                        >
                          <div>
                            <div className="font-semibold text-slate-200 group-hover:text-amber-400 transition-colors">{u.name}</div>
                            <div className="text-[10px] text-slate-500">{u.email}</div>
                          </div>
                          <span className="text-[9px] text-slate-400 font-medium bg-slate-800/50 px-1.5 py-0.5 rounded">
                            {u.role}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Leads Section */}
                {filteredLeads.length > 0 && (
                  <div>
                    <div className="px-3 text-[9px] uppercase font-bold text-emerald-400 tracking-wider">
                      Sales Leads
                    </div>
                    <div className="mt-1 space-y-0.5">
                      {filteredLeads.map(l => (
                        <button
                          key={l.id}
                          onClick={() => {
                            setShowResults(false);
                            onNavigateToTab('leads');
                            onEditEntity('lead', l.id);
                          }}
                          className="w-full text-left px-3 py-1.5 rounded hover:bg-slate-850 flex items-center justify-between text-xs group transition-colors"
                        >
                          <div>
                            <div className="font-semibold text-slate-200 group-hover:text-emerald-400 transition-colors">{l.companyName}</div>
                            <div className="text-[10px] text-slate-500">Contact: {l.contactName}</div>
                          </div>
                          <span className="text-[10px] font-mono text-emerald-400 font-bold group-hover:scale-105 transition-transform">
                            ${l.value.toLocaleString()}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Control Actions & Time Section */}
      <div className="flex items-center gap-4">
        {/* Mock Calendar Widget */}
        <div className="flex items-center gap-2 bg-[#111827]/80 border border-slate-800 px-3 py-1.5 rounded-md text-slate-200 text-xs cursor-pointer hover:bg-[#1a2336] transition-all font-medium">
          <Calendar className="h-3.5 w-3.5 text-blue-500" />
          <span>{currentDateText}</span>
        </div>

        {/* Notifications Icon with active animation */}
        <div className="relative">
          <button
            onClick={onBellClick}
            className="p-2 hover:bg-[#111827]/80 rounded-md text-slate-450 hover:text-slate-100 transition-all cursor-pointer relative border border-transparent hover:border-slate-800"
          >
            <Bell className="h-4 w-4 text-slate-300" />
            {notificationCount > 0 && (
              <span className="absolute top-1.5 right-1.5 bg-red-500 text-white font-bold text-[9px] h-3.5 min-w-3.5 px-0.5 rounded-full flex items-center justify-center animate-pulse">
                {notificationCount}
              </span>
            )}
          </button>
        </div>

        {/* Help Portal Trigger */}
        <button className="p-2 hover:bg-[#111827]/80 rounded-md text-slate-450 hover:text-slate-100 transition-all cursor-pointer border border-transparent hover:border-slate-800" title="FAQ & Developer Docs">
          <HelpCircle className="h-4 w-4 text-slate-300" />
        </button>

        {/* Vertical Divider */}
        <div className="h-5 w-px bg-slate-800" />

        {/* Professional Super Admin details */}
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="h-8 w-8 bg-blue-600/20 border border-blue-500/30 rounded-full flex items-center justify-center shadow-sm select-none text-blue-400 font-extrabold text-xs font-sans">
            SA
          </div>
          <div className="hidden md:flex flex-col text-left">
            <span className="text-xs font-bold text-slate-100 leading-tight group-hover:text-white transition-colors">Super Admin</span>
            <span className="text-[10px] font-medium text-slate-450">superadmin@salesflow.com</span>
          </div>
          <ChevronDown className="h-3.5 w-3.5 text-slate-500 group-hover:text-slate-300 transition-colors" />
        </div>
      </div>
    </header>
  );
}
