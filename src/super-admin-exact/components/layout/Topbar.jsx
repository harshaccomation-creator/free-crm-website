import { Bell, CalendarDays, ChevronDown, HelpCircle, Menu, Search } from 'lucide-react';

export default function Topbar() {
  return (
    <header className="h-[96px] bg-[#101827] border-b border-[#1d2d4a] flex items-center px-8 gap-7 sticky top-0 z-20">
      <button className="w-10 h-10 flex items-center justify-center rounded-xl text-[#89a1c4] hover:bg-[#15233a] transition-colors">
        <Menu className="w-7 h-7" />
      </button>

      <div className="relative flex-1 max-w-[680px]">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#7188ad]" />
        <input
          type="search"
          placeholder="Search companies, users, invoices, tickets..."
          className="sf-input w-full h-[54px] pl-14 pr-16 text-lg"
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg bg-[#111f35] border border-[#253657] text-[#8ba3c8] text-sm">⌘K</span>
      </div>

      <div className="hidden xl:flex items-center gap-3 h-[44px] px-5 rounded-xl bg-[#101b31] border border-[#1d2d4a] text-[#8ba3c8] text-base whitespace-nowrap">
        <CalendarDays className="w-5 h-5" />
        May 12 – Jun 12, 2025
      </div>

      <button className="relative w-11 h-11 flex items-center justify-center rounded-xl text-[#8ba3c8] hover:bg-[#15233a] transition-colors">
        <Bell className="w-6 h-6" />
        <span className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center border-2 border-[#101827]">8</span>
      </button>

      <button className="w-11 h-11 flex items-center justify-center rounded-xl text-[#8ba3c8] hover:bg-[#15233a] transition-colors">
        <HelpCircle className="w-6 h-6" />
      </button>

      <div className="h-10 w-px bg-[#243554]" />

      <div className="flex items-center gap-4 min-w-[300px] justify-end">
        <div className="w-11 h-11 rounded-full bg-[#133875] text-[#66a1ff] flex items-center justify-center font-bold">SA</div>
        <div>
          <p className="text-white font-bold leading-tight">Super Admin</p>
          <p className="text-[#8ba3c8] text-sm">superadmin@salesflow.com</p>
        </div>
        <ChevronDown className="w-5 h-5 text-[#8ba3c8]" />
      </div>
    </header>
  );
}
