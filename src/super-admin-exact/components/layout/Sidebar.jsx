import { NavLink } from 'react-router-dom';
import {
  Grid2X2, Building2, Users, CreditCard, TrendingUp, Target,
  Bell, Mail, ShieldCheck, Settings, BarChart2, Circle, LogOut
} from 'lucide-react';

const NAV = [
  { to: '/dashboard', icon: Grid2X2, label: 'Overview' },
  { to: '/companies', icon: Building2, label: 'Companies' },
  { to: '/users', icon: Users, label: 'Users & Roles' },
  { to: '/subscriptions', icon: CreditCard, label: 'Subscriptions' },
  { to: '/revenue', icon: TrendingUp, label: 'Revenue & Plans' },
  { to: '/leads-monitor', icon: Target, label: 'Leads Monitor' },
  { to: '/notifications', icon: Bell, label: 'Notifications', badge: 12 },
  { to: '/email-logs', icon: Mail, label: 'Email Logs' },
  { to: '/security', icon: ShieldCheck, label: 'Security' },
  { to: '/platform-settings', icon: Settings, label: 'Platform Settings' },
  { to: '/reports', icon: BarChart2, label: 'Reports' },
];

export default function Sidebar() {
  return (
    <aside className="fixed top-0 left-0 h-full w-[330px] bg-[#070d19] border-r border-[#1d2d4a] flex flex-col z-30">
      <div className="h-[96px] flex items-center gap-4 px-6 border-b border-[#1d2d4a]">
        <div className="w-12 h-12 rounded-xl bg-blue-500 text-[#06101f] flex items-center justify-center font-black text-lg">SH</div>
        <div>
          <p className="text-white font-black text-xl leading-tight">SalesFlow Hub</p>
          <p className="text-[#8fb4e8] text-sm font-bold tracking-[0.22em] uppercase">Super Admin</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-5 space-y-2">
        {NAV.map(({ to, icon: Icon, label, badge }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center justify-between gap-3 px-5 py-4 rounded-xl text-[20px] font-semibold transition-all ${
                isActive
                  ? 'bg-[#11203b] text-[#3b82f6]'
                  : 'text-[#8ea2c0] hover:bg-[#0e192c] hover:text-white'
              }`
            }
          >
            <span className="flex items-center gap-5 min-w-0">
              <Icon className="w-6 h-6 flex-shrink-0" />
              <span className="truncate">{label}</span>
            </span>
            {badge ? <span className="w-9 h-9 rounded-full bg-blue-500 text-[#07101d] text-sm font-black flex items-center justify-center">{badge}</span> : null}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-[#1d2d4a] px-6 py-6 space-y-6">
        <div className="flex items-center gap-3 text-[#8ea2c0] text-base">
          <Circle className="w-3 h-3 fill-emerald-500 text-emerald-500" />
          View Platform Status
        </div>
        <div className="text-[#50627e] text-sm leading-7">
          <p>© 2025 SalesFlow Hub</p>
          <p>All rights reserved.</p>
        </div>
        <button className="flex items-center gap-3 text-[#8ea2c0] hover:text-red-400 text-base font-semibold transition-colors">
          <LogOut className="w-5 h-5" /> Logout
        </button>
      </div>
    </aside>
  );
}
