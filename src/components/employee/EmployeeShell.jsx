import { useEffect, useState } from "react";
import {
  LayoutDashboard, Users, Phone, Trophy, CheckSquare, Calendar,
  Activity, BarChart2, Bell, User, Settings, Menu, X,
  LogOut, Search, LifeBuoy
} from "lucide-react";
import { clearStoredSession } from "../../hooks/useAuthProfile.js";
import { supabase } from "../../lib/supabaseClient.js";

const SIDEBAR_WIDTH = 200;

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/employee/dashboard" },
  { label: "My Leads", icon: Users, href: "/leads" },
  { label: "Contacts", icon: Phone, href: "/contacts" },
  { label: "Won", icon: Trophy, href: "/employee/won" },
  { label: "Tasks", icon: CheckSquare, href: "/employee/tasks" },
  { label: "Calendar", icon: Calendar, href: "/employee/calendar" },
  { label: "Activities", icon: Activity, href: "/employee/activities" },
  { label: "Reports", icon: BarChart2, href: "/employee/reports" },
  { label: "Help & Support", icon: LifeBuoy, href: "/employee/support" },
  { label: "Notifications", icon: Bell, href: "/notifications" },
  { label: "Profile", icon: User, href: "/employee/profile" },
  { label: "Settings", icon: Settings, href: "/settings" },
];

export default function EmployeeShell({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [location, setLocation] = useState(window.location.pathname);
  const [isNarrow, setIsNarrow] = useState(() => window.innerWidth < 1024);
  const [topbarSearch, setTopbarSearch] = useState("");

  useEffect(() => {
    const sync = () => setLocation(window.location.pathname);
    window.addEventListener("popstate", sync);
    window.addEventListener("salesflow:navigate", sync);
    return () => {
      window.removeEventListener("popstate", sync);
      window.removeEventListener("salesflow:navigate", sync);
    };
  }, []);

  useEffect(() => {
    const syncWidth = () => setIsNarrow(window.innerWidth < 1024);
    syncWidth();
    window.addEventListener("resize", syncWidth);
    return () => window.removeEventListener("resize", syncWidth);
  }, []);

  const navigate = (href) => {
    window.history.pushState({}, "", href);
    window.dispatchEvent(new Event("salesflow:navigate"));
  };

  const applyLeadSearchToPage = (query, attempt = 0) => {
    const input = document.querySelector('input[placeholder="Search leads, company, source..."]');
    if (input) {
      const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")?.set;
      if (setter) setter.call(input, query);
      else input.value = query;
      input.dispatchEvent(new Event("input", { bubbles: true }));
      input.dispatchEvent(new Event("change", { bubbles: true }));
      return;
    }

    if (attempt < 12) {
      window.setTimeout(() => applyLeadSearchToPage(query, attempt + 1), 120);
    }
  };

  const handleTopbarSearchChange = (event) => {
    const query = event.target.value;
    setTopbarSearch(query);
    window.sessionStorage.setItem("salesflow_leads_search", query);

    if (window.location.pathname !== "/leads") {
      navigate("/leads");
    }

    window.setTimeout(() => applyLeadSearchToPage(query), 60);
  };

  const handleLogout = async () => {
    try {
      await supabase?.auth?.signOut?.();
    } catch (error) {
      console.error("[SalesFlow logout]", error);
    } finally {
      clearStoredSession();
      window.history.replaceState({}, "", "/login");
      window.dispatchEvent(new Event("salesflow:navigate"));
    }
  };

  const isActive = (href) => {
    if (href === "/employee/dashboard") return location === "/employee/dashboard";
    if (href === "/leads") return location.startsWith("/leads");
    return location.startsWith(href);
  };

  return (
    <div className="sf-employee min-h-screen" style={{ overflowX: "hidden", width: "100vw", maxWidth: "100vw" }}>
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full z-40 flex flex-col transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
        style={{
          width: isNarrow ? "260px" : `${SIDEBAR_WIDTH}px`,
          maxWidth: isNarrow ? "260px" : `${SIDEBAR_WIDTH}px`,
          background: "#0d1626",
          borderRight: "1px solid rgba(255,255,255,0.07)",
          boxSizing: "border-box",
        }}
      >
        <div
          className="flex items-center px-4 py-4"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
        >
          <img
            src="/assets/salesflow-hub-logo-transparent.png"
            alt="SalesFlow Hub"
            className="h-10 w-auto object-contain"
          />

          <button
            className="ml-auto lg:hidden text-gray-400 hover:text-white"
            onClick={() => setMobileOpen(false)}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <button
                key={item.href}
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  navigate(item.href);
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all group ${
                  active
                    ? "text-white shadow-md"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
                style={
                  active
                    ? {
                        background:
                          "linear-gradient(135deg, #f97316 0%, #fb923c 100%)",
                        boxShadow: "0 4px 12px rgba(249,115,22,0.35)",
                      }
                    : {}
                }
              >
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    active ? "text-white" : "text-gray-500 group-hover:text-gray-300"
                  }`}
                />
                <span className="flex-1">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      <main
        className="sf-emp-main min-h-screen flex flex-col"
        style={{
          marginLeft: isNarrow ? "0px" : `${SIDEBAR_WIDTH}px`,
          width: isNarrow ? "100vw" : "auto",
          maxWidth: "none",
          minWidth: 0,
          position: "relative",
          background: "#f5f7fb",
          overflowX: "hidden",
          boxSizing: "border-box",
        }}
      >
        <header
          className="flex items-center gap-3 sticky top-0 z-20"
          style={{
            background: "#0d1626",
            borderBottom: "1px solid rgba(255,255,255,0.07)",
            width: "100%",
            height: "64px",
            padding: isNarrow ? "0 12px" : "0 24px",
            boxSizing: "border-box"
          }}
        >
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden text-gray-400 hover:text-white mr-1"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex-1 relative" style={{ maxWidth: "560px" }}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />

            <input
              type="search"
              value={topbarSearch}
              onChange={handleTopbarSearchChange}
              placeholder="Search leads, clients, follow-ups..."
              className="w-full pl-9 pr-4 py-2 rounded-xl text-sm font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/30"
              style={{
                background: "#ffffff",
                border: "1px solid rgba(249,115,22,0.45)",
                boxShadow: "0 0 0 1px rgba(249,115,22,0.12)",
              }}
            />
          </div>

          <div className="flex items-center gap-3 ml-auto">
            <button type="button" onClick={() => navigate("/notifications")} className="relative p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors" title="Notifications">
              <Bell className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/employee/profile")}>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-sm font-bold shrink-0">
                J
              </div>

              <div className="hidden md:block">
                <p className="text-xs font-semibold text-white leading-tight">
                  Jayraj
                </p>
                <p className="text-[10px] text-gray-400">Sales Executive</p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-colors"
              style={{ background: "#f97316" }}
            >
              <LogOut className="w-3.5 h-3.5" />
              Logout
            </button>
          </div>
        </header>

        <div className="flex-1" style={{ padding: isNarrow ? "14px 12px" : "18px 24px", minWidth: 0, maxWidth: "100%", overflowX: "hidden", boxSizing: "border-box" }}>
          {children}
        </div>
      </main>
    </div>
  );
}
