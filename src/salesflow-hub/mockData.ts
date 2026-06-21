import { Company, User, SaaSPlan, Lead, SystemLog, SystemSettings, PlanType, CompanyStatus, UserRole, UserStatus, LeadStatus } from './types';

export const initialCompanies: Company[] = [
  {
    id: 'comp-101',
    name: 'Apex Systems Inc.',
    domain: 'apexsystems.com',
    plan: PlanType.Enterprise,
    status: CompanyStatus.Paid,
    userCount: 48,
    monthlySpend: 1499,
    createdAt: '2024-11-12',
    adminEmail: 'it@apexsystems.com'
  },
  {
    id: 'comp-102',
    name: 'Acme Global Corp',
    domain: 'acme.org',
    plan: PlanType.Professional,
    status: CompanyStatus.Active,
    userCount: 22,
    monthlySpend: 499,
    createdAt: '2025-01-20',
    adminEmail: 'admin@acme.org'
  },
  {
    id: 'comp-103',
    name: 'Zeta Tech Solutions',
    domain: 'zetatech.io',
    plan: PlanType.Professional,
    status: CompanyStatus.Paid,
    userCount: 15,
    monthlySpend: 499,
    createdAt: '2025-02-05',
    adminEmail: 'billing@zetatech.io'
  },
  {
    id: 'comp-104',
    name: 'Nordic Craft Design',
    domain: 'nordiccraft.dk',
    plan: PlanType.Starter,
    status: CompanyStatus.Active,
    userCount: 8,
    monthlySpend: 149,
    createdAt: '2025-04-10',
    adminEmail: 'lars@nordiccraft.dk'
  },
  {
    id: 'comp-105',
    name: 'Global Freight Logistics',
    domain: 'globallogistics.com',
    plan: PlanType.Enterprise,
    status: CompanyStatus.Paid,
    userCount: 124,
    monthlySpend: 2499,
    createdAt: '2024-05-15',
    adminEmail: 'sysadmin@globallogistics.com'
  },
  {
    id: 'comp-106',
    name: 'Blue Horizon Travel',
    domain: 'bluehorizon.net',
    plan: PlanType.Trial,
    status: CompanyStatus.Trial,
    userCount: 4,
    monthlySpend: 0,
    createdAt: '2026-06-05',
    adminEmail: 'clara@bluehorizon.net'
  },
  {
    id: 'comp-107',
    name: 'ProHealth MedTech',
    domain: 'prohealth.med',
    plan: PlanType.Professional,
    status: CompanyStatus.Active,
    userCount: 18,
    monthlySpend: 499,
    createdAt: '2025-09-01',
    adminEmail: 'dr_smyth@prohealth.med'
  },
  {
    id: 'comp-108',
    name: 'Pinnacle Analytics',
    domain: 'pinnacleanalytica.com',
    plan: PlanType.Starter,
    status: CompanyStatus.Expired,
    userCount: 3,
    monthlySpend: 0,
    createdAt: '2026-03-12',
    adminEmail: 'steve@pinnacleanalytica.com'
  },
  {
    id: 'comp-109',
    name: 'Stellar Innovations',
    domain: 'stellar.co',
    plan: PlanType.Trial,
    status: CompanyStatus.Trial,
    userCount: 5,
    monthlySpend: 0,
    createdAt: '2026-06-11',
    adminEmail: 'hannah@stellar.co'
  },
  {
    id: 'comp-110',
    name: 'CyberSec Shield Corp',
    domain: 'cybersecshield.io',
    plan: PlanType.Enterprise,
    status: CompanyStatus.Active,
    userCount: 75,
    monthlySpend: 1999,
    createdAt: '2025-10-30',
    adminEmail: 'noc@cybersecshield.io'
  }
];

export const initialUsers: User[] = [
  {
    id: 'user-001',
    name: 'Sania Banik',
    email: 'superadmin@salesflow.com',
    companyId: 'salesflow-core',
    companyName: 'SalesFlow Inc. (Core)',
    role: UserRole.SuperAdmin,
    status: UserStatus.Active,
    lastLogin: '2026-06-18 10:45:12'
  },
  {
    id: 'user-002',
    name: 'Raj Patil',
    email: 'raj@apexsystems.com',
    companyId: 'comp-101',
    companyName: 'Apex Systems Inc.',
    role: UserRole.TenantOwner,
    status: UserStatus.Active,
    lastLogin: '2026-06-18 09:12:00'
  },
  {
    id: 'user-003',
    name: 'Sarah Jenkins',
    email: 'developer@apexsystems.com',
    companyId: 'comp-101',
    companyName: 'Apex Systems Inc.',
    role: UserRole.TenantAdmin,
    status: UserStatus.Active,
    lastLogin: '2026-06-17 17:34:00'
  },
  {
    id: 'user-004',
    name: 'Amrit Singh',
    email: 'billing@zetatech.io',
    companyId: 'comp-103',
    companyName: 'Zeta Tech Solutions',
    role: UserRole.TenantOwner,
    status: UserStatus.Active,
    lastLogin: '2026-06-18 08:05:44'
  },
  {
    id: 'user-005',
    name: 'Clara Oswald',
    email: 'clara@bluehorizon.net',
    companyId: 'comp-106',
    companyName: 'Blue Horizon Travel',
    role: UserRole.TenantOwner,
    status: UserStatus.Active,
    lastLogin: '2026-06-15 14:22:11'
  },
  {
    id: 'user-006',
    name: 'Lars Thomsen',
    email: 'lars@nordiccraft.dk',
    companyId: 'comp-104',
    companyName: 'Nordic Craft Design',
    role: UserRole.TenantOwner,
    status: UserStatus.Active,
    lastLogin: '2026-06-12 11:23:45'
  },
  {
    id: 'user-007',
    name: 'Steve Jobson',
    email: 'steve@pinnacleanalytica.com',
    companyId: 'comp-108',
    companyName: 'Pinnacle Analytics',
    role: UserRole.TenantOwner,
    status: UserStatus.Suspended,
    lastLogin: '2026-05-12 10:00:22'
  },
  {
    id: 'user-008',
    name: 'Priyanka Sen',
    email: 'p.sen@globallogistics.com',
    companyId: 'comp-105',
    companyName: 'Global Freight Logistics',
    role: UserRole.TenantAdmin,
    status: UserStatus.Active,
    lastLogin: '2026-06-18 10:20:00'
  }
];

export const initialPlans: SaaSPlan[] = [
  {
    id: 'plan-starter',
    name: PlanType.Starter,
    price: 149,
    billingCycle: 'monthly',
    activeCompanies: 2,
    features: [
      'Up to 10 Users',
      'Basic Leads Management',
      'Email Integration',
      'Standard Reports',
      '5GB Cloud Storage'
    ],
    maxUsers: 10
  },
  {
    id: 'plan-professional',
    name: PlanType.Professional,
    price: 499,
    billingCycle: 'monthly',
    activeCompanies: 3,
    features: [
      'Up to 50 Users',
      'Advanced Custom Pipelines',
      'AI Lead Scoring Assistant',
      'Full API Access',
      '24/7 Priority Support',
      '50GB Cloud Storage'
    ],
    maxUsers: 50
  },
  {
    id: 'plan-enterprise',
    name: PlanType.Enterprise,
    price: 1499,
    billingCycle: 'monthly',
    activeCompanies: 3,
    features: [
      'Unlimited Users',
      'Custom White-Labeling',
      'Dedicated Account Management',
      'Single Sign-On (SSO)',
      'Service Level Agreement (99.9% SLA)',
      'Unlimited Storage',
      'Custom Database Clusters'
    ],
    maxUsers: 99999
  }
];

export const initialLeads: Lead[] = [
  {
    id: 'lead-001',
    companyName: 'Hindustan Retail Ltd',
    contactName: 'Aarav Sharma',
    contactEmail: 'aarav@hindustanretail.in',
    value: 8500,
    source: 'Inbound Webform',
    status: LeadStatus.New,
    createdAt: '2026-06-15',
    notes: 'Very interested in shifting their whole CRM from Salesforce. Needs Enterprise plan estimate.'
  },
  {
    id: 'lead-002',
    companyName: 'Swift Deliveries',
    contactName: 'Chloe Dupont',
    contactEmail: 'chloe@swiftdeliveries.fr',
    value: 5200,
    source: 'LinkedIn Outbound',
    status: LeadStatus.Contacted,
    createdAt: '2026-06-12',
    notes: 'Sent cold message on LinkedIn. Responded with high interest. Shared catalog.'
  },
  {
    id: 'lead-003',
    companyName: 'Pixel Labs Studio',
    contactName: 'Mark Ruelle',
    contactEmail: 'mark@pixellabs.design',
    value: 1200,
    source: 'Google Ads',
    status: LeadStatus.Proposal,
    createdAt: '2026-06-08',
    notes: 'Submitted proposal for Starter annual package with custom user training.'
  },
  {
    id: 'lead-004',
    companyName: 'Pacific AgriTech',
    contactName: 'Naomi Carter',
    contactEmail: 'n.carter@pacificagri.co',
    value: 11500,
    source: 'Partner Referral',
    status: LeadStatus.Negotiating,
    createdAt: '2026-06-01',
    notes: 'Negotiating custom contract. Wants multi-year discount. Scheduled zoom meeting with management.'
  },
  {
    id: 'lead-005',
    companyName: 'Vertex Digital Solutions',
    contactName: 'Kunal Sen',
    contactEmail: 'kunal@vertexdigital.com',
    value: 6500,
    source: 'Organic Search',
    status: LeadStatus.Won,
    createdAt: '2026-05-20',
    notes: 'Closed! Paid 1st-year Professional billing. Moving to tenant onboarding.'
  },
  {
    id: 'lead-006',
    companyName: 'Retro Apparel',
    contactName: 'Lina Vance',
    contactEmail: 'lina@retroapparel.com',
    value: 2300,
    source: 'Co-marketing Event',
    status: LeadStatus.Lost,
    createdAt: '2026-05-10',
    notes: 'Lost due to budget limitations. Chose a free basic spreadsheet CRM instead.'
  }
];

export const initialLogs: SystemLog[] = [
  {
    id: 'log-001',
    timestamp: '2026-06-18 10:45:12',
    category: 'Security',
    message: 'Super Admin login accepted for baniksania231@gmail.com',
    status: 'success',
    userEmail: 'baniksania231@gmail.com',
    ipAddress: '192.168.1.45'
  },
  {
    id: 'log-002',
    timestamp: '2026-06-18 10:20:00',
    category: 'Security',
    message: 'User p.sen@globallogistics.com authenticated successfully',
    status: 'success',
    userEmail: 'p.sen@globallogistics.com',
    ipAddress: '103.44.11.23'
  },
  {
    id: 'log-003',
    timestamp: '2026-06-18 08:33:51',
    category: 'System',
    message: 'Stripe webhook listener response succeeded for invoice.paid (comp-105)',
    status: 'success',
    ipAddress: '54.123.4.92'
  },
  {
    id: 'log-004',
    timestamp: '2026-06-18 04:12:10',
    category: 'Email',
    message: 'Weekly system activity digest sent to 10 company owners',
    status: 'success'
  },
  {
    id: 'log-005',
    timestamp: '2026-06-17 23:45:00',
    category: 'Billing',
    message: 'Failed to process monthly payment for comp-108 (Card Declined)',
    status: 'error',
    ipAddress: '112.56.223.10'
  },
  {
    id: 'log-006',
    timestamp: '2026-06-17 18:00:15',
    category: 'Security',
    message: 'Multiple failed login attempts detected for guest@acme.org',
    status: 'warning',
    ipAddress: '13.250.45.19'
  },
  {
    id: 'log-007',
    timestamp: '2026-06-17 14:30:22',
    category: 'System',
    message: 'Automated database cold recovery backup created safely to bucket salesflow-backups',
    status: 'info'
  },
  {
    id: 'log-008',
    timestamp: '2026-06-17 10:11:42',
    category: 'Email',
    message: 'Welcome invitation email successfully dispatched to clara@bluehorizon.net',
    status: 'success'
  }
];

export const initialSettings: SystemSettings = {
  maintenanceMode: false,
  allowNewRegistrations: true,
  mfaEnforced: true,
  sessionTimeoutMinutes: 60,
  sendGridApiKeyStatus: true,
  systemName: 'SalesFlow CRM Platform'
};
