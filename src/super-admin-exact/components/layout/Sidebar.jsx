import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Building2, Users, CreditCard, Package,
  CalendarCheck, Activity, Mail, Ticket, HeartPulse, LogOut, Shield
} from 'lucide-react';

const NAV = [
  { label: 'MAIN', items: [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/companies', icon: Building2, label: 'Companies' },
    { to: '/users', icon: Users, label: 'Users' },
  ]},
  { label: 'BILLING', items: [
    { to: '/subscriptions', icon: CreditCard, label: 'Subscriptions' },
    { to: '/plans', icon: Package, label: 'Plans' },
  ]},
  { label: 'OPERATIONS', items: [
    { to: '/demo-requests', icon: CalendarCheck, label: 'Demo Requests' },
    { to: '/support-tickets', icon: Ticket, label: 'Support Tickets' },
  ]},
  { label: 'SYSTEM', items: [
    { to: '/website-health', icon: HeartPulse, label: 'Website Health' },
    { to: '/activity-logs', icon: Activity, label: 'Activity Logs' },
    { to: '/email-logs', icon: Mail, label: 'Email Logs' },
  ]},
];

export default function Sidebar() {
  return (
    <aside className="fixed top-0 left-0 h-full w-64 bg-gray-900 flex flex-col z-30">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-gray-800">
        <div className="w-9 h-9 rounded-lg bg-orange-500 flex items-center justify-center flex-shrink-0">
          <Shield className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-white font-bold text-sm leading-tight">SalesFlow Hub</p>
          <p className="text-orange-400 text-xs font-semibold">Super Admin</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {NAV.map(group => (
          <div key={group.label}>
            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest px-3 mb-2">{group.label}</p>
            <div className="space-y-0.5">
              {group.items.map(({ to, icon: Icon, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-orange-500 text-white'
                        : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  {label}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-gray-800">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-gray-800 mb-2">
          <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">SA</div>
          <div className="min-w-0">
            <p className="text-white text-sm font-medium truncate">Super Admin</p>
            <p className="text-gray-400 text-xs truncate">admin@salesflowhub.com</p>
          </div>
        </div>
        <button className="flex items-center gap-2 w-full px-3 py-2 text-gray-400 hover:text-red-400 text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors">
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}
