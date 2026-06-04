import { Bell, Search, Plus } from "lucide-react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const getPageTitle = (path: string) => {
  if (path === "/") return "Dashboard";
  if (path.startsWith("/leads")) return "Leads Management";
  if (path.startsWith("/followups")) return "Follow-ups";
  if (path.startsWith("/tasks")) return "Tasks";
  if (path.startsWith("/payments")) return "Payments";
  if (path.startsWith("/team")) return "Team Members";
  if (path.startsWith("/reports")) return "Reports";
  if (path.startsWith("/notifications")) return "Notifications";
  if (path.startsWith("/settings")) return "Settings";
  if (path.startsWith("/profile")) return "Profile";
  return "Dashboard";
};

export function Topbar() {
  const [location] = useLocation();
  const title = getPageTitle(location);

  return (
    <header className="h-16 bg-white border-b border-border shadow-sm flex items-center justify-between px-6 sticky top-0 z-10">
      <h1 className="text-xl font-semibold text-foreground tracking-tight">{title}</h1>
      
      <div className="flex items-center gap-4">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search leads, tasks..." 
            className="w-64 pl-9 bg-gray-50 border-gray-200 focus-visible:ring-1"
            data-testid="input-global-search"
          />
        </div>

        <Link href="/notifications" className="relative p-2 text-muted-foreground hover:bg-gray-100 rounded-full transition-colors cursor-pointer">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 h-4 w-4 bg-secondary text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
            5
          </span>
        </Link>

        <div className="h-6 w-px bg-border mx-2 hidden md:block" />

        <Link href="/profile" className="flex items-center gap-2 hover:bg-gray-50 p-1 pr-2 rounded-full transition-colors cursor-pointer hidden md:flex">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">AS</AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium text-foreground">Arjun</span>
        </Link>

        <Button className="gap-2 ml-2" size="sm" data-testid="button-new-lead-topbar">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">New Lead</span>
        </Button>
      </div>
    </header>
  );
}
