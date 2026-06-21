import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Building2,
  Activity,
  Clock,
  CreditCard,
  AlertTriangle,
  Users2,
  IndianRupee,
  Receipt,
  Bell,
  Megaphone,
  TrendingUp,
  Award,
  Zap,
  CheckCircle2,
  ShieldCheck,
  Building,
  ArrowUpRight,
  ExternalLink,
  Laptop
} from 'lucide-react';

import {
  Company,
  User,
  SaaSPlan,
  Lead,
  SystemLog,
  SystemSettings,
  PlanType,
  CompanyStatus,
  UserRole,
  UserStatus,
  LeadStatus
} from './types';

import {
  initialCompanies,
  initialUsers,
  initialPlans,
  initialLeads,
  initialLogs,
  initialSettings
} from './mockData';

// Modular UI imports
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardCharts from './components/DashboardCharts';
import NotificationDrawer, { SystemNotification } from './components/NotificationDrawer';
import CompaniesManager from './components/CompaniesManager';
import UsersManager from './components/UsersManager';
import PlansManager from './components/PlansManager';
import InvoiceSalesFlows from './components/InvoiceSalesFlows';
import LeadsMonitor from './components/LeadsMonitor';
import LogsManager from './components/LogsManager';
import SettingsManager from './components/SettingsManager';
import ReportsManager from './components/ReportsManager';
import SupportTicketsManager from './components/SupportTicketsManager';
import WebsiteHealthManager from './components/WebsiteHealthManager';
import LiveDiagnosticsConsole from './components/LiveDiagnosticsConsole';
import { SupportTicket, HealthIssue } from './types';

const STORAGE_KEYS = {
  COMPANIES: 'salesflow_companies_v1',
  USERS: 'salesflow_users_v1',
  PLANS: 'salesflow_plans_v1',
  LEADS: 'salesflow_leads_v1',
  LOGS: 'salesflow_logs_v1',
  SETTINGS: 'salesflow_settings_v1',
  NOTIFICATIONS: 'salesflow_notifications_v1',
  ANNOUNCEMENT: 'salesflow_announcement_v1',
  TICKETS: 'salesflow_tickets_v1',
  HEALTH: 'salesflow_health_v1',
};

const VIEW_ALIASES: Record<string, string> = {
  'users-roles': 'users',
  subscriptions: 'invoices',
  'revenue-plans': 'plans',
  'leads-monitor': 'leads',
  'platform-settings': 'settings',
};

function viewFromUrl() {
  const raw = new URLSearchParams(window.location.search).get('view') || 'overview';
  return VIEW_ALIASES[raw] || raw;
}

function tabToUrl(tab: string) {
  return tab === 'overview' ? '/super-admin/dashboard' : `/super-admin/dashboard?view=${tab}`;
}

export default function App() {
  // --- Persistent States ---
  const [companies, setCompanies] = useState<Company[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.COMPANIES);
    return saved ? JSON.parse(saved) : initialCompanies;
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USERS);
    return saved ? JSON.parse(saved) : initialUsers;
  });

  const [plans, setPlans] = useState<SaaSPlan[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PLANS);
    return saved ? JSON.parse(saved) : initialPlans;
  });

  const [leads, setLeads] = useState<Lead[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LEADS);
    return saved ? JSON.parse(saved) : initialLeads;
  });

  const [logs, setLogs] = useState<SystemLog[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LOGS);
    return saved ? JSON.parse(saved) : initialLogs;
  });

  const [settings, setSettings] = useState<SystemSettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return saved ? JSON.parse(saved) : initialSettings;
  });

  const [announcement, setAnnouncement] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEYS.ANNOUNCEMENT) || 'MANDATORY SECURITY GATE: Multi-Factor Authentication (MFA) enforcement policies are currently active across all enterprise shards.';
  });

  const [tickets, setTickets] = useState<SupportTicket[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TICKETS);
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 't-1',
        companyName: 'Apex Systems Inc.',
        userEmail: 'raj@apexsystems.com',
        subject: 'Webhooks delay in production shard',
        category: 'Technical',
        priority: 'critical',
        status: 'Open',
        createdAt: '2026-06-18 09:20',
        desc: 'Our enterprise webhook event triggers are showing a latency of over 1.2s. This is slowing down tenant registrations. Please check DNS routers.'
      },
      {
        id: 't-2',
        companyName: 'Zeta Tech Solutions',
        userEmail: 'amrit@zetatech.io',
        subject: 'Stripe failed bill grace periods info',
        category: 'Billing',
        priority: 'medium',
        status: 'In Progress',
        createdAt: '2026-06-17 11:15',
        desc: 'Could you clarify if we get a 3-day or 7-day automated warning grace period when a customer credit card declines?'
      },
      {
        id: 't-3',
        companyName: 'Nordic Craft Design',
        userEmail: 'lars@nordiccraft.dk',
        subject: 'Api gateway token renewal limits',
        category: 'Integration',
        priority: 'low',
        status: 'Resolved',
        createdAt: '2026-06-16 14:02',
        desc: 'We would like to query if superadmins can whitelist our custom API integrations to bypass standard rate throttles (120 req/min).'
      }
    ];
  });

  const [healthIssues, setHealthIssues] = useState<HealthIssue[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.HEALTH);
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'h-1',
        service: 'PostgreSQL DB Shard 3',
        status: 'critical',
        message: 'Workload memory replication buffer peak hit 94% utilization threshold.',
        metric: '94% CPU Limit',
        impactLevel: 'High Delay Alert',
        timestamp: '2026-06-18 10:15:33'
      },
      {
        id: 'h-2',
        service: 'Redis Caching Service',
        status: 'critical',
        message: 'Cache database allocation pool nearing maximum capacity limit (98% loaded).',
        metric: '98% Memory pool',
        impactLevel: 'Medium Latency Alert',
        timestamp: '2026-06-18 10:05:12'
      },
      {
        id: 'h-3',
        service: 'Replication Node DB',
        status: 'warning',
        message: 'Standby storage volume connection delay exceeded 320ms limit.',
        metric: '320ms Delay threshold',
        impactLevel: 'Minor Recovery Delay',
        timestamp: '2026-06-18 09:44:20'
      },
      {
        id: 'h-4',
        service: 'EU CDN Edge server',
        status: 'warning',
        message: 'European Edge network peak latencies crossed the acceptable SLA boundaries.',
        metric: '420ms Gate Peak',
        impactLevel: 'European Ingress Peaks',
        timestamp: '2026-06-18 08:33:12'
      }
    ];
  });

  // System Notifications
  const [notifications, setNotifications] = useState<SystemNotification[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    if (saved) return JSON.parse(saved);

    return [
      {
        id: 'n-1',
        title: 'New Inbound Enterprise Interest',
        desc: 'Hindustan Retail Ltd submitted a custom deal request size of ₹11,500.',
        time: '5 mins ago',
        category: 'onboarding',
        read: false,
      },
      {
        id: 'n-2',
        title: 'Subscription Webhook Event',
        desc: 'Apex Systems Inc. updated user seat allocation metrics successfully.',
        time: '42 mins ago',
        category: 'billing',
        read: false,
      },
      {
        id: 'n-3',
        title: 'Multiple Bad Passwords Detected',
        desc: 'Failed login limits surpassed for test@bluehorizon.net from IP 103.44.11.23.',
        time: '3 hours ago',
        category: 'security',
        read: false,
      },
      {
        id: 'n-4',
        title: 'Hourly Cold-Backup Constructed',
        desc: 'Automated replication node constructed 4 database snapshots safely.',
        time: '5 hours ago',
        category: 'system',
        read: true,
      },
    ];
  });

  // Tab and modal controls
  const [toasts, setToasts] = useState<Array<{ id: string; message: string; type: 'success' | 'info' | 'warning' | 'error' }>>([]);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  };

  const [activeTab, setActiveTab] = useState<string>(() => viewFromUrl());
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  // Search entities trigger link
  const [selectedCompSearchId, setSelectedCompSearchId] = useState<string | undefined>(undefined);
  const [selectedUserSearchId, setSelectedUserSearchId] = useState<string | undefined>(undefined);
  const [selectedLeadSearchId, setSelectedLeadSearchId] = useState<string | undefined>(undefined);

  const changeTab = (tab: string, clearSearch = true) => {
    setActiveTab(tab);
    if (clearSearch) {
      setSelectedCompSearchId(undefined);
      setSelectedUserSearchId(undefined);
      setSelectedLeadSearchId(undefined);
    }
    const nextUrl = tabToUrl(tab);
    if (`${window.location.pathname}${window.location.search}` !== nextUrl) {
      window.history.pushState({}, '', nextUrl);
      window.dispatchEvent(new Event('salesflow:navigate'));
    }
  };

  useEffect(() => {
    const sync = () => setActiveTab(viewFromUrl());
    window.addEventListener('popstate', sync);
    window.addEventListener('salesflow:navigate', sync);
    return () => {
      window.removeEventListener('popstate', sync);
      window.removeEventListener('salesflow:navigate', sync);
    };
  }, []);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COMPANIES, JSON.stringify(companies));
  }, [companies]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PLANS, JSON.stringify(plans));
  }, [plans]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(leads));
  }, [leads]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(logs));
  }, [logs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENT, announcement);
  }, [announcement]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TICKETS, JSON.stringify(tickets));
  }, [tickets]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.HEALTH, JSON.stringify(healthIssues));
  }, [healthIssues]);


  // --- Helper Action Mutators ---

  const addLog = (category: SystemLog['category'], message: string, status: SystemLog['status'], userEmail?: string) => {
    const freshLog: SystemLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      category,
      message,
      status,
      userEmail,
      ipAddress: '192.168.1.' + Math.floor(Math.random() * 254 + 1)
    };
    setLogs((prev) => [freshLog, ...prev].slice(0, 50)); // limit 50 logs for telemetry
  };

  const handleAddCompany = (newComp: Omit<Company, 'id' | 'createdAt'>) => {
    const comp: Company = {
      ...newComp,
      id: `comp-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setCompanies((prev) => [comp, ...prev]);
    addLog('System', `New company tenant provisioned: ${comp.name} (${comp.domain})`, 'success');

    // Automatically trigger notification
    const newNotif: SystemNotification = {
      id: `notif-${Date.now()}`,
      title: 'New Client Provisioned',
      desc: `Company "${comp.name}" provisioned safely on pricing plan: ${comp.plan}.`,
      time: 'Just now',
      category: 'onboarding',
      read: false
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const handleUpdateCompany = (updatedComp: Company) => {
    setCompanies((prev) => prev.map((c) => (c.id === updatedComp.id ? updatedComp : c)));
    addLog('Billing', `Tenancy subscription parameters updated for ${updatedComp.name}.`, 'info');
  };

  const handleDeleteCompany = (id: string) => {
    const compToDelete = companies.find((c) => c.id === id);
    setCompanies((prev) => prev.filter((c) => c.id !== id));
    if (compToDelete) {
      addLog('System', `Permanently de-provisioned tenant company: ${compToDelete.name}`, 'warning');
    }
  };

  const handleAddUser = (newUser: Omit<User, 'id' | 'lastLogin'>) => {
    const user: User = {
      ...newUser,
      id: `user-${Date.now()}`,
      lastLogin: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };
    setUsers((prev) => [user, ...prev]);
    addLog('Security', `Created identity actor: ${user.name} for ${user.companyName}`, 'success');
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
    addLog('Security', `Adjusted access roles and variables for ${updatedUser.name}.`, 'info');
  };

  const handleDeleteUser = (id: string) => {
    const userToDelete = users.find((u) => u.id === id);
    setUsers((prev) => prev.filter((u) => u.id !== id));
    if (userToDelete) {
      addLog('Security', `Deleted employee account: ${userToDelete.name} (${userToDelete.email})`, 'warning');
    }
  };

  const handleAddLead = (newLead: Omit<Lead, 'id' | 'createdAt'>) => {
    const lead: Lead = {
      ...newLead,
      id: `lead-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setLeads((prev) => [lead, ...prev]);
    addLog('System', `Logged new CRM potential deal: ${lead.companyName} (₹${lead.value})`, 'info');
  };

  const handleUpdateLead = (updatedLead: Lead) => {
    setLeads((prev) => prev.map((l) => (l.id === updatedLead.id ? updatedLead : l)));
  };

  const handleDeleteLead = (id: string) => {
    setLeads((prev) => prev.filter((l) => l.id !== id));
  };

  // Onboard WON Lead directly into customer CRM!
  const handleDeployWonLeadAsTenant = (lead: Lead) => {
    // 1. Add company
    const newComp: Omit<Company, 'id' | 'createdAt'> = {
      name: lead.companyName,
      domain: lead.contactEmail.split('@')[1] || `${lead.companyName.toLowerCase().replace(/\s+/g, '')}.com`,
      plan: PlanType.Starter, // Start with Starter tier by default
      status: CompanyStatus.Active,
      userCount: 1,
      monthlySpend: 149,
      adminEmail: lead.contactEmail
    };

    // Trigger company add
    handleAddCompany(newComp);

    // 2. Add owner user
    const newUser: Omit<User, 'id' | 'lastLogin'> = {
      name: lead.contactName,
      email: lead.contactEmail,
      companyId: `comp-temp-${Date.now()}`, // placeholder company id
      companyName: lead.companyName,
      role: UserRole.TenantOwner,
      status: UserStatus.Active
    };
    handleAddUser(newUser);

    // Remove lead or flag it
    setLeads((prev) => prev.filter((l) => l.id !== lead.id));

    addLog('System', `Successfully converted deal "${lead.companyName}" to standard subscription tenant! Account owner dispatched: ${lead.contactEmail}`, 'success');
    showToast(`Customer converted! "${lead.companyName}" is now deployed as an active starter tenant. Owner admin: ${lead.contactName}.`, 'success');
  };

  const handleUpdatePlan = (updatedPlan: SaaSPlan) => {
    setPlans((prev) => prev.map((p) => (p.id === updatedPlan.id ? updatedPlan : p)));
    addLog('Billing', `Customized SaaS capabilities constraints on sub-plan: ${updatedPlan.name}`, 'warning');
  };

  const handleUpdateTicket = (updated: SupportTicket) => {
    setTickets(prev => prev.map(t => t.id === updated.id ? updated : t));
    addLog('System', `Support ticket #${updated.id} triaged and updated status to: ${updated.status}`, 'info');
  };

  const handleDeleteTicket = (id: string) => {
    setTickets(prev => prev.filter(t => t.id !== id));
    addLog('System', `Permanently removed support ticket record #${id}`, 'warning');
  };

  const handleAddTicket = (newTicket: Omit<SupportTicket, 'id' | 'createdAt'>) => {
    const t: SupportTicket = {
      ...newTicket,
      id: `t-${Date.now()}`,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };
    setTickets(prev => [t, ...prev]);
    addLog('System', `Logged new manually requested client incident for ${t.companyName}`, 'success');
  };

  const handleResolveHealthIssue = (id: string) => {
    setHealthIssues(prev => prev.filter(i => i.id !== id));
    addLog('System', `Applied remote patch script to resolve node incident #${id}`, 'success');
  };

  const handleResetHealthIssues = () => {
    setHealthIssues([
      {
        id: 'h-1',
        service: 'PostgreSQL DB Shard 3',
        status: 'critical',
        message: 'Workload memory replication buffer peak hit 94% utilization threshold.',
        metric: '94% CPU Limit',
        impactLevel: 'High Delay Alert',
        timestamp: '2026-06-18 10:15:33'
      },
      {
        id: 'h-2',
        service: 'Redis Caching Service',
        status: 'critical',
        message: 'Cache database allocation pool nearing maximum capacity limit (98% loaded).',
        metric: '98% Memory pool',
        impactLevel: 'Medium Latency Alert',
        timestamp: '2026-06-18 10:05:12'
      },
      {
        id: 'h-3',
        service: 'Replication Node DB',
        status: 'warning',
        message: 'Standby storage volume connection delay exceeded 320ms limit.',
        metric: '320ms Delay threshold',
        impactLevel: 'Minor Recovery Delay',
        timestamp: '2026-06-18 09:44:20'
      },
      {
        id: 'h-4',
        service: 'EU CDN Edge server',
        status: 'warning',
        message: 'European Edge network peak latencies crossed the acceptable SLA boundaries.',
        metric: '420ms Gate Peak',
        impactLevel: 'European Ingress Peaks',
        timestamp: '2026-06-18 08:33:12'
      }
    ]);
    addLog('System', `NOC operator triggered cluster error state simulations.`, 'warning');
  };


  // --- Dynamic Search Navigation Router ---
  const handleGlobalSearchNavigate = (entityType: 'company' | 'user' | 'lead', entityId: string) => {
    if (entityType === 'company') {
      setSelectedCompSearchId(entityId);
      changeTab('companies', false);
    } else if (entityType === 'user') {
      setSelectedUserSearchId(entityId);
      changeTab('users', false);
    } else if (entityType === 'lead') {
      setSelectedLeadSearchId(entityId);
      changeTab('leads', false);
    }
  };


  // --- Notification triggers ---
  const handleMarkNotifRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const handleMarkAllNotifRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleDeleteNotif = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };


  // --- Calculated Dashboard metrics cards ---
  const totalCompaniesCount = companies.length + 1100; // matching screenshot high values
  const activeCompaniesCount = companies.filter(c => c.status === CompanyStatus.Paid || c.status === CompanyStatus.Active).length + 850;
  const trialCompaniesCount = companies.filter(c => c.status === CompanyStatus.Trial).length + 208;
  const paidCompaniesCount = companies.filter(c => c.status === CompanyStatus.Paid).length + 638;
  const expiredTrialsCount = companies.filter(c => c.status === CompanyStatus.Expired).length + 75;
  const totalUsersCount = users.length + 3975;

  const totalMonthlySpendSum = companies.reduce((sum, c) => sum + c.monthlySpend, 0);
  const displayMonthlyRevenueText = totalMonthlySpendSum + 261780; // matching screenshot value base ($265,780)

  const pendingPaymentsSum = leads.filter(l => l.status === LeadStatus.Negotiating || l.status === LeadStatus.Proposal).reduce((sum, l) => sum + l.value, 0);
  const displayPendingPayments = pendingPaymentsSum || 48230; // base from screenshot


  // --- Render Tab Views ---
  const renderTabContent = () => {
    switch (activeTab) {
      case 'companies':
        return (
          <CompaniesManager
            companies={companies}
            onAddCompany={handleAddCompany}
            onUpdateCompany={handleUpdateCompany}
            onDeleteCompany={handleDeleteCompany}
            selectedCompanyId={selectedCompSearchId}
            setSelectedCompanyId={(id) => {
              setSelectedCompSearchId(id);
              if (!id) setSelectedCompSearchId(undefined);
            }}
            users={users}
            onAddUser={handleAddUser}
            onUpdateUser={handleUpdateUser}
            onDeleteUser={handleDeleteUser}
          />
        );

      case 'users':
        return (
          <UsersManager
            users={users}
            companies={companies}
            onAddUser={handleAddUser}
            onUpdateUser={handleUpdateUser}
            onDeleteUser={handleDeleteUser}
            selectedUserId={selectedUserSearchId}
          />
        );

      case 'invoices':
        return (
          <InvoiceSalesFlows
            companies={companies}
            onAddLog={addLog}
          />
        );

      case 'plans':
        return (
          <PlansManager
            plans={plans}
            onUpdatePlan={handleUpdatePlan}
            onAddPlan={(newPlan) => {
              setPlans((prev) => [...prev, newPlan]);
              addLog('Billing', `Dispatched new subscription model: ${newPlan.name} (₹${newPlan.price}/mo)`, 'success');
            }}
          />
        );

      case 'leads':
        return (
          <LeadsMonitor
            leads={leads}
            onAddLead={handleAddLead}
            onUpdateLead={handleUpdateLead}
            onDeleteLead={handleDeleteLead}
            onDeployWonLeadAsTenant={handleDeployWonLeadAsTenant}
            selectedLeadId={selectedLeadSearchId}
          />
        );

      case 'notifications':
      case 'email-logs':
        return (
          <LogsManager
            logs={logs}
            onClearLogs={() => setLogs([])}
            announcement={announcement}
            onSetAnnouncement={setAnnouncement}
          />
        );

      case 'security':
      case 'settings':
        return (
          <SettingsManager
            settings={settings}
            onUpdateSettings={setSettings}
            companies={companies}
            users={users}
            plans={plans}
            leads={leads}
            logs={logs}
          />
        );

      case 'reports':
        return (
          <ReportsManager
            companies={companies}
            plans={plans}
          />
        );

      case 'activity-logs':
        return (
          <LogsManager
            logs={logs}
            onClearLogs={() => setLogs([])}
            announcement={announcement}
            onSetAnnouncement={setAnnouncement}
          />
        );

      case 'support-tickets':
        return (
          <SupportTicketsManager
            tickets={tickets}
            onUpdateTicket={handleUpdateTicket}
            onDeleteTicket={handleDeleteTicket}
            onAddTicket={handleAddTicket}
          />
        );

      case 'website-health':
        return (
          <WebsiteHealthManager
            issues={healthIssues}
            onResolveIssue={handleResolveHealthIssue}
            onResetIssues={handleResetHealthIssues}
            onAddIssue={(newIssue) => {
              setHealthIssues(prev => [newIssue, ...prev]);
              addLog('Security', `Logged high-severity application bug/anomaly: ${newIssue.service} (${newIssue.status})`, 'error');
            }}
          />
        );

      case 'overview':
      default:
        return (
          <div className="space-y-8 animate-fadeIn">
            {/* Overview Dashboard Intro */}
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Overview Dashboard</h2>
              <p className="text-xs text-slate-500 mt-1">
                Real-time platform overview, key metrics, and cluster health indicators at a glance.
              </p>
            </div>

            {/* Metrics cards grid matching the exact 8 elements in clean professional layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* Card 1: Total Companies */}
              <div className="bg-white border border-slate-200 rounded-lg p-5 hover:border-slate-300 transition-all shadow-[0_1px_3px_rgba(0,0,0,0.05)] flex flex-col justify-between relative group">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Companies</span>
                    <h3 className="text-2xl font-extrabold text-slate-900 mt-1 font-sans leading-none tracking-tight">
                      {totalCompaniesCount.toLocaleString()}
                    </h3>
                  </div>
                  <div className="h-10 w-10 bg-blue-50 rounded border border-blue-100 flex items-center justify-center text-blue-600 transition-all group-hover:bg-[#3b82f6] group-hover:text-white group-hover:border-transparent">
                    <Building2 className="h-5 w-5" />
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 mt-4">
                  <span>&uarr; 12.4%</span>
                  <span className="text-slate-400 font-normal">vs last month</span>
                </div>
              </div>

              {/* Card 2: Active Companies */}
              <div className="bg-white border border-slate-200 rounded-lg p-5 hover:border-slate-300 transition-all shadow-[0_1px_3px_rgba(0,0,0,0.05)] flex flex-col justify-between relative group">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Companies</span>
                    <h3 className="text-2xl font-extrabold text-slate-900 mt-1 font-sans leading-none tracking-tight">
                      {activeCompaniesCount.toLocaleString()}
                    </h3>
                  </div>
                  <div className="h-10 w-10 bg-emerald-50 rounded border border-emerald-100 flex items-center justify-center text-emerald-600 transition-all group-hover:bg-emerald-600 group-hover:text-white group-hover:border-transparent">
                    <Activity className="h-5 w-5" />
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 mt-4">
                  <span>&uarr; 8.7%</span>
                  <span className="text-slate-400 font-normal">94.2% Utilization</span>
                </div>
              </div>

              {/* Card 3: Trial Companies */}
              <div className="bg-white border border-slate-200 rounded-lg p-5 hover:border-slate-300 transition-all shadow-[0_1px_3px_rgba(0,0,0,0.05)] flex flex-col justify-between relative group">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Trial Companies</span>
                    <h3 className="text-2xl font-extrabold text-slate-900 mt-1 font-sans leading-none tracking-tight">
                      {trialCompaniesCount}
                    </h3>
                  </div>
                  <div className="h-10 w-10 bg-purple-50 rounded border border-purple-100 flex items-center justify-center text-purple-600 transition-all group-hover:bg-purple-600 group-hover:text-white group-hover:border-transparent">
                    <Clock className="h-5 w-5" />
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 mt-4">
                  <span>&uarr; 5.3%</span>
                  <span className="text-slate-400 font-normal">vs last month</span>
                </div>
              </div>

              {/* Card 4: Paid Companies */}
              <div className="bg-white border border-slate-200 rounded-lg p-5 hover:border-slate-300 transition-all shadow-[0_1px_3px_rgba(0,0,0,0.05)] flex flex-col justify-between relative group">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Paid Companies</span>
                    <h3 className="text-2xl font-extrabold text-slate-900 mt-1 font-sans leading-none tracking-tight">
                      {paidCompaniesCount}
                    </h3>
                  </div>
                  <div className="h-10 w-10 bg-[#38bdf8]/10 rounded border border-[#38bdf8]/20 flex items-center justify-center text-sky-600 transition-all group-hover:bg-[#38bdf8] group-hover:text-white group-hover:border-transparent">
                    <CreditCard className="h-5 w-5" />
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 mt-4">
                  <span>&uarr; 14.1%</span>
                  <span className="text-slate-400 font-normal">vs last month</span>
                </div>
              </div>

              {/* Card 5: Expired Trials */}
              <div className="bg-white border border-slate-200 rounded-lg p-5 hover:border-slate-300 transition-all shadow-[0_1px_3px_rgba(0,0,0,0.05)] flex flex-col justify-between relative group">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Expired Trials</span>
                    <h3 className="text-2xl font-extrabold text-slate-950 mt-1 font-sans leading-none tracking-tight">
                      {expiredTrialsCount}
                    </h3>
                  </div>
                  <div className="h-10 w-10 bg-amber-50 rounded border border-amber-100 flex items-center justify-center text-amber-600">
                    <AlertTriangle className="h-5 w-5" />
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-bold text-rose-500 mt-4">
                  <span>&darr; 4.6%</span>
                  <span className="text-slate-400 font-normal">Action required</span>
                </div>
              </div>

              {/* Card 6: Total Users */}
              <div className="bg-white border border-slate-200 rounded-lg p-5 hover:border-slate-300 transition-all shadow-[0_1px_3px_rgba(0,0,0,0.05)] flex flex-col justify-between relative group">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Users</span>
                    <h3 className="text-2xl font-extrabold text-slate-900 mt-1 font-sans leading-none tracking-tight">
                      {totalUsersCount.toLocaleString()}
                    </h3>
                  </div>
                  <div className="h-10 w-10 bg-blue-50 rounded border border-blue-100 flex items-center justify-center text-blue-600">
                    <Users2 className="h-5 w-5" />
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 mt-4">
                  <span>&uarr; 10.2%</span>
                  <span className="text-slate-400 font-normal">Active accounts</span>
                </div>
              </div>

              {/* Card 7: Monthly Revenue */}
              <div className="bg-white border border-slate-200 rounded-lg p-5 hover:border-slate-300 transition-all shadow-[0_1px_3px_rgba(0,0,0,0.05)] flex flex-col justify-between relative group">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Monthly Revenue</span>
                    <h3 className="text-2xl font-extrabold text-slate-900 mt-1 font-sans leading-none tracking-tight">
                      ₹{displayMonthlyRevenueText.toLocaleString()}
                    </h3>
                  </div>
                  <div className="h-10 w-10 bg-emerald-50 rounded border border-emerald-100 flex items-center justify-center text-emerald-600">
                    <IndianRupee className="h-5 w-5" />
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 mt-4">
                  <span>&uarr; 16.8%</span>
                  <span className="text-slate-400 font-normal">MRR Shards</span>
                </div>
              </div>

              {/* Card 8: Pending Payments */}
              <div className="bg-white border border-slate-200 rounded-lg p-5 hover:border-slate-300 transition-all shadow-[0_1px_3px_rgba(0,0,0,0.05)] flex flex-col justify-between relative group">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Pending Payments</span>
                    <h3 className="text-2xl font-extrabold text-rose-600 mt-1 font-sans leading-none tracking-tight">
                      ₹{displayPendingPayments.toLocaleString()}
                    </h3>
                  </div>
                  <div className="h-10 w-10 bg-rose-50 rounded border border-rose-100 flex items-center justify-center text-rose-500">
                    <Receipt className="h-5 w-5" />
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-bold text-rose-400 mt-4">
                  <span>&darr; 7.3%</span>
                  <span className="text-slate-400 font-normal">Pending validation</span>
                </div>
              </div>
            </div>

            {/* Bespoke Charts Block */}
            <DashboardCharts companies={companies} plans={plans} />

            {/* Interactive NOC Console */}
            <LiveDiagnosticsConsole
              onAddSystemLog={(category, message, status) => addLog(category, message, status)}
              onAddNotification={(newNotif) => {
                setNotifications((prev) => [
                  {
                    id: `notif-${Date.now()}`,
                    title: newNotif.title,
                    desc: newNotif.desc,
                    time: 'Just now',
                    category: newNotif.category,
                    read: false,
                  },
                  ...prev,
                ]);
              }}
              onShowToast={(msg, type) => showToast(msg, type)}
              onRemedyIssuesCount={() => {
                setHealthIssues((prev) => prev.slice(2)); // successfully clear first 2 simulated shard errors!
              }}
            />

            {/* Feed log output preview & Quick actionable controls */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Core recent pings */}
              <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-[0_1px_3px_rgba(0,0,0,0.05)] lg:col-span-2 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4.5 w-4.5 text-blue-600 animate-pulse" />
                    <h4 className="font-bold text-slate-900 text-sm">Recent Cluster Telemetry</h4>
                  </div>
                  <button
                    onClick={() => changeTab('email-logs')}
                    className="text-[11px] font-bold text-[#3b82f6] hover:underline cursor-pointer"
                  >
                    View Logs
                  </button>
                </div>

                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {logs.slice(0, 4).map((log) => (
                    <div key={log.id} className="bg-slate-50 border border-slate-100 rounded p-2.5 flex items-center justify-between text-xs transition-colors hover:bg-slate-100/70">
                      <div className="flex items-center gap-2.5">
                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                          log.status === 'success' ? 'bg-emerald-500' : log.status === 'error' ? 'bg-rose-500' : 'bg-amber-500'
                        }`} />
                        <span className="text-slate-700 font-medium">{log.message}</span>
                      </div>
                      <span className="text-[10px] font-mono font-semibold text-slate-400 shrink-0">{log.timestamp.split(' ')[1]}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Direct Super Admin Quick Console Links */}
              <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-[0_1px_3px_rgba(0,0,0,0.05)] lg:col-span-1 space-y-4">
                <h4 className="font-bold text-slate-800 text-sm">Cluster Control Panel</h4>
                <p className="text-[11px] text-slate-500">Rapid access to crucial super-admin workspace tools.</p>

                <div className="grid grid-cols-1 gap-2">
                  <button
                    onClick={() => changeTab('companies')}
                    className="flex justify-between items-center bg-slate-50 hover:bg-slate-100 border border-slate-200 p-2.5 rounded text-xs font-semibold text-slate-700 transition-colors cursor-pointer text-left"
                  >
                    <span className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-blue-500" />
                      Tenant Provisioning
                    </span>
                    <ArrowUpRight className="h-3.5 w-3.5 text-slate-450" />
                  </button>

                  <button
                    onClick={() => changeTab('leads')}
                    className="flex justify-between items-center bg-slate-50 hover:bg-slate-100 border border-slate-200 p-2.5 rounded text-xs font-semibold text-slate-700 transition-colors cursor-pointer text-left"
                  >
                    <span className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-emerald-500" />
                      Funnel Opportunities
                    </span>
                    <ArrowUpRight className="h-3.5 w-3.5 text-slate-450" />
                  </button>

                  <button
                    onClick={() => changeTab('settings')}
                    className="flex justify-between items-center bg-slate-50 hover:bg-slate-100 border border-slate-200 p-2.5 rounded text-xs font-semibold text-slate-700 transition-colors cursor-pointer text-left"
                  >
                    <span className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-amber-500" />
                      Security & SQL Dump
                    </span>
                    <ArrowUpRight className="h-3.5 w-3.5 text-slate-450" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };


  return (
    <div className="salesflow-hub-root flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden relative">
      {/* 1. Sidebar Panel Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={(tab) => changeTab(tab)}
        notificationCount={notifications.filter(n => !n.read).length}
        healthBadgeCount={healthIssues.length}
      />

      {/* Main Core Section */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">

        {/* Dynamic warning marquee if maintenance is active */}
        {settings.maintenanceMode && (
          <div className="bg-rose-600 text-white font-bold text-xs py-2 px-6 flex items-center justify-between shrink-0 animate-pulse">
            <span className="flex items-center gap-1.5">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              SYSTEM MAINTENANCE OVERRIDE ACTIVE: Global tenancy registrations are frozen and customers are redirected to the Maintenance warning page.
            </span>
            <button
              onClick={() => setSettings(prev => ({ ...prev, maintenanceMode: false }))}
              className="underline text-[10px] uppercase font-bold text-rose-100 hover:text-white cursor-pointer px-2"
            >
              Disable Lock
            </button>
          </div>
        )}

        {/* Global Flashing custom published announcement marquee */}
        {announcement && !settings.maintenanceMode && (
          <div className="bg-blue-600/20 border-b border-blue-500/30 text-blue-300 font-semibold text-[11px] py-2 px-6 flex items-center justify-between shrink-0">
            <span className="flex items-center gap-2 truncate">
              <Megaphone className="h-3.5 w-3.5 text-blue-400 shrink-0" />
              <marquee className="w-full">{announcement}</marquee>
            </span>
            <button
              onClick={() => setAnnouncement('')}
              className="text-[10px] px-2 text-slate-500 hover:text-white cursor-pointer font-bold ml-2 shrink-0"
              title="Close announcement"
            >
              &times;
            </button>
          </div>
        )}

        {/* 2. Global Header Search, profile details and alerts */}
        <Header
          companies={companies}
          users={users}
          leads={leads}
          onNavigateToTab={changeTab}
          onEditEntity={handleGlobalSearchNavigate}
          notificationCount={notifications.filter(n => !n.read).length}
          onBellClick={() => setIsNotifOpen(true)}
        />

        {/* 3. Main Dynamic Content body */}
        <main className="flex-1 overflow-y-auto p-8 bg-slate-50 pb-24">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
            >
              {renderTabContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* 4. Slide-out alert system notification drawer */}
      <NotificationDrawer
        isOpen={isNotifOpen}
        onClose={() => setIsNotifOpen(false)}
        notifications={notifications}
        onMarkRead={handleMarkNotifRead}
        onMarkAllRead={handleMarkAllNotifRead}
        onDeleteNotification={handleDeleteNotif}
      />

      {/* 5. Custom Floating Toast Notification HUD */}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 pointer-events-none max-w-sm w-full px-4">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
              className={`pointer-events-auto p-4 rounded-lg shadow-2xl border flex items-center justify-between gap-3 text-xs backdrop-blur-md transition-all ${
                t.type === 'success' ? 'bg-emerald-950/90 border-emerald-500/30 text-emerald-100' :
                t.type === 'error' ? 'bg-rose-950/90 border-rose-500/30 text-rose-100' :
                t.type === 'warning' ? 'bg-amber-950/90 border-amber-500/30 text-amber-100' :
                'bg-slate-900/95 border-slate-800 text-slate-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {t.type === 'success' && <CheckCircle2 className="h-4.5 w-4.5 text-emerald-400 shrink-0" />}
                {t.type === 'error' && <AlertTriangle className="h-4.5 w-4.5 text-rose-400 shrink-0" />}
                {t.type === 'warning' && <AlertTriangle className="h-4.5 w-4.5 text-amber-400 shrink-0" />}
                {t.type === 'info' && <Activity className="h-4.5 w-4.5 text-blue-400 shrink-0" />}
                <p className="font-semibold leading-normal">{t.message}</p>
              </div>
              <button
                onClick={() => setToasts((prev) => prev.filter((toast) => toast.id !== t.id))}
                className="text-slate-400 hover:text-white cursor-pointer select-none font-bold shrink-0 text-sm leading-none p-1"
              >
                &times;
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
