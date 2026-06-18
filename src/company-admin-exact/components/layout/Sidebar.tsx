import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  Users, 
  PhoneCall, 
  CheckSquare, 
  CreditCard, 
  UserCheck, 
  BarChart2, 
  Bell, 
  Settings, 
  User,
  TicketCheck,
  Zap
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/" },
  { name: "Leads", icon: Users, href: "/leads" },
  { name: "Follow-ups", icon: PhoneCall, href: "/followups" },
  { name: "Tasks", icon: CheckSquare, href: "/tasks" },
  { name: "Payments", icon: CreditCard, href: "/payments" },
  { name: "Team Members", icon: UserCheck, href: "/team" },
  { name: "Reports", icon: BarChart2, href: "/reports" },
  { name: "Support Tickets", icon: TicketCheck, href: "/support-tickets" },
  { name: "Notifications", icon: Bell, href: "/notifications", badge: 5 },
  { name: "Settings", icon: Settings, href: "/settings" },
  { name: "Profile", icon: User, href: "/profile" },
];

export function Sidebar() {
  const [location] = useLocation();

  return (
    <div className="w-[260px] bg-sidebar border-r border-sidebar-border h-full flex flex-col text-sidebar-foreground">
      <div className="h-16 flex items-center px-6 border-b border-sidebar-border mb-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl cursor-pointer" data-testid="link-logo">
          <Zap className="h-6 w-6 text-primary" />
          <span className="text-white">SalesFlow</span>
          <span className="text-secondary">Hub</span>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 space-y-1">
        {menuItems.map((item) => {
          const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
          return (
            <Link 
              key={item.name} 
              href={item.href}
              className={`flex items-center justify-between px-3 py-2.5 rounded-md transition-colors cursor-pointer ${
                isActive 
                  ? "bg-sidebar-accent border-l-2 border-primary text-white" 
                  : "hover:bg-sidebar-accent/50 text-sidebar-foreground/80 hover:text-white"
              }`}
              data-testid={`link-sidebar-${item.name.toLowerCase().replace(" ", "-")}`}
            >
              <div className="flex items-center gap-3">
                <item.icon className="h-5 w-5" />
                <span className="text-sm font-medium">{item.name}</span>
              </div>
              {item.badge && (
                <span className="bg-secondary text-white text-xs px-2 py-0.5 rounded-full font-bold">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 mt-auto border-t border-sidebar-border">
        <Link href="/profile" className="flex items-center gap-3 hover:bg-sidebar-accent/50 p-2 rounded-md transition-colors cursor-pointer">
          <Avatar className="h-10 w-10 border border-sidebar-border">
            <AvatarFallback className="bg-sidebar-primary text-white">AS</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-white">Arjun Sharma</span>
            <span className="text-xs text-sidebar-foreground/70">Company Admin</span>
          </div>
        </Link>
      </div>
    </div>
  );
}
