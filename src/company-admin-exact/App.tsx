import { Switch, Route, Router as WouterRouter } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/layout/Layout";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import Leads from "@/pages/Leads";
import LeadDetail from "@/pages/LeadDetail";
import Followups from "@/pages/Followups";
import Tasks from "@/pages/Tasks";
import Payments from "@/pages/Payments";
import Team from "@/pages/Team";
import Reports from "@/pages/Reports";
import Notifications from "@/pages/Notifications";
import SupportTickets from "@/pages/SupportTickets";
import Settings from "@/pages/Settings";
import Profile from "@/pages/Profile";

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/leads" component={Leads} />
        <Route path="/leads/:id" component={LeadDetail} />
        <Route path="/followups" component={Followups} />
        <Route path="/tasks" component={Tasks} />
        <Route path="/payments" component={Payments} />
        <Route path="/team" component={Team} />
        <Route path="/reports" component={Reports} />
        <Route path="/notifications" component={Notifications} />
        <Route path="/support-tickets" component={SupportTickets} />
        <Route path="/settings" component={Settings} />
        <Route path="/profile" component={Profile} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <TooltipProvider>
      <WouterRouter base="/admin/dashboard">
        <Router />
      </WouterRouter>
      <Toaster />
    </TooltipProvider>
  );
}

export default App;
