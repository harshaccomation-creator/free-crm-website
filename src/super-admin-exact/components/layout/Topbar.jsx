import { Bell, CalendarDays, ChevronDown, HelpCircle, Menu, Search } from 'lucide-react';

export default function Topbar() {
  return (
    <header className="h-[64px] bg-[#101827] border-b border-[#1d2d4a] flex items-center px-6 gap-5 sticky top-0 z-20">
      <button className="w-9 h-9 flex items-center justify-center rounded-lg text-[#89a1c4] hover:bg-[#15233a] transition-colors">
        <Menu className="w-6 h-6" />
      </button>

      <div className="relative w-[460px] max-w-[42vw]">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#7188ad]" />
        <input
          type="search"
          placeholder="Search companies, users, invoices, tickets..."
          className="sf-input w-full h-[42px] pl-12 pr-14 text-base"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-0.5 rounded-md bg-[#111f35] border border-[#253657] text-[#8ba3c8] text-sm">⌘K</span>
      </div>

      <div className="hidden xl:flex items-center gap-3 h-[42px] px-4 rounded-lg bg-[#101b31] border border-[#1d2d4a] text-[#8ba3c8] text-base whitespace-nowrap">
        <CalendarDays className="w-5 h-5" />
        May 12 – Jun 12, 2025
      </div>

      <div className="flex-1" />

      <button className="relative w-10 h-10 flex items-center justify-center rounded-lg text-[#8ba3c8] hover:bg-[#15233a] transition-colors">
        <Bell className="w-5 h-5" />
        <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center border-2 border-[#101827]">8</span>
      </button>

      <button className="w-10 h-10 flex items-center justify-center rounded-lg text-[#8ba3c8] hover:bg-[#15233a] transition-colors">
        <HelpCircle className="w-5 h-5" />
      </button>

      <div className="h-9 w-px bg-[#243554]" />

      <div className="flex items-center gap-3 justify-end">
        <div className="w-10 h-10 rounded-full bg-[#133875] text-[#66a1ff] flex items-center justify-center font-bold text-sm">SA</div>
        <div className="hidden lg:block">
          <p className="text-white font-bold leading-tight">Super Admin</p>
          <p className="text-[#8ba3c8] text-sm">superadmin@salesflow.com</p>
        </div>
        <ChevronDown className="w-5 h-5 text-[#8ba3c8]" />
      </div>
    </header>
  );
}
