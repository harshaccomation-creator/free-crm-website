export enum PlanType {
  Starter = 'Starter',
  Professional = 'Professional',
  Enterprise = 'Enterprise',
  Trial = 'Trial',
}

export enum CompanyStatus {
  Active = 'Active',
  Trial = 'Trial',
  Paid = 'Paid',
  Expired = 'Expired',
}

export enum UserRole {
  SuperAdmin = 'Super Admin',
  TenantOwner = 'Owner',
  TenantAdmin = 'Admin',
  TenantUser = 'User',
}

export enum UserStatus {
  Active = 'Active',
  Suspended = 'Suspended',
  Pending = 'Pending',
}

export enum LeadStatus {
  New = 'New',
  Contacted = 'Contacted',
  Proposal = 'Proposal',
  Negotiating = 'Negotiating',
  Won = 'Won',
  Lost = 'Lost',
}

export interface Company {
  id: string;
  name: string;
  domain: string;
  plan: PlanType;
  status: CompanyStatus;
  userCount: number;
  monthlySpend: number;
  createdAt: string;
  adminEmail: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  companyId: string;
  companyName: string;
  role: UserRole;
  status: UserStatus;
  lastLogin: string;
}

export interface SaaSPlan {
  id: string;
  name: PlanType;
  price: number;
  billingCycle: 'monthly' | 'yearly';
  activeCompanies: number;
  features: string[];
  maxUsers: number;
}

export interface Lead {
  id: string;
  companyName: string;
  contactName: string;
  contactEmail: string;
  value: number;
  source: string;
  status: LeadStatus;
  createdAt: string;
  notes: string;
}

export interface SystemLog {
  id: string;
  timestamp: string;
  category: 'System' | 'Email' | 'Security' | 'Billing';
  message: string;
  status: 'success' | 'warning' | 'error' | 'info';
  userEmail?: string;
  ipAddress?: string;
}

export interface SystemSettings {
  maintenanceMode: boolean;
  allowNewRegistrations: boolean;
  mfaEnforced: boolean;
  sessionTimeoutMinutes: number;
  sendGridApiKeyStatus: boolean;
  systemName: string;
}

export interface SupportTicket {
  id: string;
  companyName: string;
  userEmail: string;
  subject: string;
  category: 'Billing' | 'Technical' | 'Integration' | 'Account';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'Open' | 'In Progress' | 'Resolved';
  createdAt: string;
  desc: string;
}

export interface HealthIssue {
  id: string;
  service: string;
  status: 'critical' | 'warning' | 'healthy';
  message: string;
  metric: string;
  impactLevel: string;
  timestamp: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  companyId: string;
  companyName: string;
  adminEmail: string;
  issueDate: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  taxRate: number; // percentage
  taxAmount: number;
  discountAmount: number;
  total: number;
  status: 'Draft' | 'Sent' | 'Paid' | 'Overdue';
  createdAt: string;
}

