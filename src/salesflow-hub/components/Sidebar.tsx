import {
  LayoutDashboard,
  Building2,
  Users2,
  CreditCard,
  Target,
  Bell,
  Mail,
  ShieldCheck,
  Settings,
  BarChart3,
  Flame,
  Activity,
  ClipboardList,
  Headphones,
  Globe
} from 'lucide-react';
import { motion } from 'motion/react';
import BrandLogo from './BrandLogo';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  notificationCount: number;
  healthBadgeCount: number;
}

export default function Sidebar({ activeTab, setActiveTab, notificationCount, healthBadgeCount }: SidebarProps) {
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'companies', label: 'Companies', icon: Building2 },
    { id: 'users', label: 'Users & Roles', icon: Users2 },
    { id: 'invoices', label: 'Invoice & Sales Flows', icon: CreditCard },
    { id: 'plans', label: 'Revenue & Plans', icon: BarChart3 },
    { id: 'leads', label: 'Leads Monitor', icon: Target },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: notificationCount },
    { id: 'email-logs', label: 'Email Logs', icon: Mail },
    { id: 'security', label: 'Security', icon: ShieldCheck },
    { id: 'settings', label: 'Platform Settings', icon: Settings },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'activity-logs', label: 'Activity Logs', icon: ClipboardList },
    { id: 'support-tickets', label: 'Support Tickets', icon: Headphones },
    { id: 'website-health', label: 'Website Health', icon: Globe, badge: healthBadgeCount },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-screen text-slate-800 select-none shrink-0 overflow-y-auto shadow-xs relative z-20">
      {/* Platform Title Section */}
      <div className="p-6 border-b border-slate-200 flex flex-col gap-1.5 items-center justify-center text-center relative overflow-hidden bg-slate-50/50">
        <div className="absolute inset-0 bg-gradient-to-b from-[#ff7a00]/5 via-transparent to-transparent opacity-60 pointer-events-none" />
        <div className="flex items-center gap-2 relative z-10">
          <span className="text-xl font-extrabold tracking-tight text-slate-900">
            <span className="text-[#ff7a00]">Sales</span>Flow
          </span>
          <span className="bg-orange-50 text-[#ff7a00] border border-orange-200/40 font-black text-[9px] uppercase px-1.5 py-0.5 rounded tracking-wider">
            Hub
          </span>
        </div>
        <div className="flex items-center gap-1.5 mt-1 relative z-10">
          <span className="w-1.5 h-1.5 rounded-full bg-[#ff7a00] animate-pulse" />
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-[0.2em] block leading-none">
            Super Admin
          </span>
        </div>
      </div>

      {/* Navigation items */}
      <nav className="flex-1 px-3 py-6 space-y-1.5">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              id={`sidebar-tab-${item.id}`}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[13px] font-semibold transition-all duration-200 relative cursor-pointer group overflow-hidden ${
                isActive
                  ? 'bg-gradient-to-r from-orange-50 to-orange-100/30 text-[#ff7a00] shadow-xs border border-orange-200/50 active-sidebar-tab'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50/80 border border-transparent'
              }`}
            >
              {/* Highlight Left Bar when Active */}
              {isActive && (
                <span className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-gradient-to-b from-[#ff7a00] to-orange-400 rounded-r" />
              )}
              
              <IconComponent
                className={`h-4.5 w-4.5 shrink-0 transition-all duration-200 group-hover:scale-110 ${
                  isActive ? 'text-[#ff7a00] drop-shadow-[0_0_3px_rgba(255,122,0,0.25)]' : 'text-slate-400 group-hover:text-slate-600'
                }`}
              />
              <span className={`relative z-10 tracking-wide transition-all ${isActive ? 'font-bold' : ''}`}>
                {item.label}
              </span>

              {item.badge !== undefined && item.badge > 0 && (
                <span className={`ml-auto relative z-10 font-bold text-[10px] h-4.5 px-1.5 rounded flex items-center justify-center min-w-4.5 shadow-xs ${
                  isActive 
                    ? 'bg-[#ff7a00] text-white' 
                    : 'bg-slate-150 text-slate-600 border border-slate-200'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Status Indicators & Footer */}
      <div className="p-5 border-t border-slate-150 bg-slate-50/50">
        <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-100/50 transition-all duration-200 cursor-pointer shadow-xs">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[11px] font-bold text-slate-700 tracking-wider">
            NOC PLATFORM STATUS
          </span>
          <Activity className="h-3.5 w-3.5 text-emerald-500 ml-auto animate-pulse" />
        </div>
        <div className="mt-4 text-center">
          <p className="text-[9.5px] text-slate-400 font-mono tracking-wider">
            v4.8.2-enterprise &bull; <span className="text-emerald-500 font-bold text-[8.5px] uppercase">STABLE</span>
          </p>
        </div>
      </div>
    </aside>
  );
}
