// ============================================================
// SalesFlow Hub — Super Admin Mock Data
// ============================================================

export const COMPANIES = [
  { id: 'CO-001', name: 'TechNova Global', email: 'admin@technova.io', plan: 'Enterprise', status: 'Active', users: 48, leads: 312, mrr: 24999, joinedAt: '2024-01-15', country: 'USA', owner: 'Sarah Jenkins' },
  { id: 'CO-002', name: 'Infosys BPO', email: 'crm@infosys.com', plan: 'Professional', status: 'Active', users: 22, leads: 187, mrr: 9999, joinedAt: '2024-02-20', country: 'India', owner: 'Aarav Patel' },
  { id: 'CO-003', name: 'HDFC Growth', email: 'sales@hdfc.com', plan: 'Enterprise', status: 'Active', users: 65, leads: 521, mrr: 24999, joinedAt: '2023-11-10', country: 'India', owner: 'Rahul Sharma' },
  { id: 'CO-004', name: 'Reliance Retail', email: 'tech@ril.com', plan: 'Starter', status: 'Trial', users: 5, leads: 34, mrr: 0, joinedAt: '2024-10-01', country: 'India', owner: 'Priya Desai' },
  { id: 'CO-005', name: 'Acme Corp', email: 'it@acme.co', plan: 'Professional', status: 'Active', users: 18, leads: 142, mrr: 9999, joinedAt: '2024-03-05', country: 'USA', owner: 'Michael Chang' },
  { id: 'CO-006', name: 'Vanguard Systems', email: 'ops@vanguardsys.com', plan: 'Enterprise', status: 'Active', users: 55, leads: 489, mrr: 24999, joinedAt: '2024-01-28', country: 'USA', owner: 'Elena Rodriguez' },
  { id: 'CO-007', name: 'Wipro Digital', email: 'crm@wipro.com', plan: 'Professional', status: 'Suspended', users: 12, leads: 78, mrr: 9999, joinedAt: '2024-04-12', country: 'India', owner: 'Vikram Singh' },
  { id: 'CO-008', name: 'Mahindra Tech', email: 'sales@mahindra.com', plan: 'Professional', status: 'Active', users: 30, leads: 256, mrr: 9999, joinedAt: '2024-02-14', country: 'India', owner: 'Amit Kumar' },
  { id: 'CO-009', name: 'Global Logistics', email: 'admin@globallogistics.co.uk', plan: 'Enterprise', status: 'Active', users: 72, leads: 634, mrr: 24999, joinedAt: '2023-09-22', country: 'UK', owner: 'David Smith' },
  { id: 'CO-010', name: 'Flipkart B2B', email: 'crm@flipkart.com', plan: 'Starter', status: 'Trial', users: 3, leads: 19, mrr: 0, joinedAt: '2024-10-15', country: 'India', owner: 'Anjali Mehta' },
  { id: 'CO-011', name: 'Zomato Enterprise', email: 'tech@zomato.com', plan: 'Professional', status: 'Active', users: 25, leads: 198, mrr: 9999, joinedAt: '2024-05-08', country: 'India', owner: 'Ravi Verma' },
  { id: 'CO-012', name: 'Razorpay CRM', email: 'admin@razorpay.com', plan: 'Enterprise', status: 'Active', users: 40, leads: 367, mrr: 24999, joinedAt: '2024-03-18', country: 'India', owner: 'Pooja Nair' },
];

export const USERS = [
  { id: 'U-001', name: 'Sarah Jenkins', email: 'sarah@technova.io', company: 'TechNova Global', role: 'Admin', plan: 'Enterprise', status: 'Active', lastLogin: '2024-10-26T10:30:00Z', joinedAt: '2024-01-15' },
  { id: 'U-002', name: 'Aarav Patel', email: 'aarav@infosys.com', company: 'Infosys BPO', role: 'Sales Rep', plan: 'Professional', status: 'Active', lastLogin: '2024-10-26T09:15:00Z', joinedAt: '2024-02-20' },
  { id: 'U-003', name: 'Rahul Sharma', email: 'rahul@hdfc.com', company: 'HDFC Growth', role: 'Manager', plan: 'Enterprise', status: 'Active', lastLogin: '2024-10-25T18:45:00Z', joinedAt: '2023-11-10' },
  { id: 'U-004', name: 'Priya Desai', email: 'priya@ril.com', company: 'Reliance Retail', role: 'Admin', plan: 'Starter', status: 'Trial', lastLogin: '2024-10-26T08:00:00Z', joinedAt: '2024-10-01' },
  { id: 'U-005', name: 'Michael Chang', email: 'michael@acme.co', company: 'Acme Corp', role: 'Sales Rep', plan: 'Professional', status: 'Active', lastLogin: '2024-10-24T14:20:00Z', joinedAt: '2024-03-05' },
  { id: 'U-006', name: 'Elena Rodriguez', email: 'elena@vanguardsys.com', company: 'Vanguard Systems', role: 'Admin', plan: 'Enterprise', status: 'Active', lastLogin: '2024-10-26T11:00:00Z', joinedAt: '2024-01-28' },
  { id: 'U-007', name: 'Vikram Singh', email: 'vikram@wipro.com', company: 'Wipro Digital', role: 'Sales Rep', plan: 'Professional', status: 'Suspended', lastLogin: '2024-09-30T12:00:00Z', joinedAt: '2024-04-12' },
  { id: 'U-008', name: 'Amit Kumar', email: 'amit@mahindra.com', company: 'Mahindra Tech', role: 'Manager', plan: 'Professional', status: 'Active', lastLogin: '2024-10-25T16:30:00Z', joinedAt: '2024-02-14' },
  { id: 'U-009', name: 'David Smith', email: 'david@globallogistics.co.uk', company: 'Global Logistics', role: 'Admin', plan: 'Enterprise', status: 'Active', lastLogin: '2024-10-26T07:45:00Z', joinedAt: '2023-09-22' },
  { id: 'U-010', name: 'Anjali Mehta', email: 'anjali@flipkart.com', company: 'Flipkart B2B', role: 'Admin', plan: 'Starter', status: 'Trial', lastLogin: '2024-10-26T09:30:00Z', joinedAt: '2024-10-15' },
  { id: 'U-011', name: 'Ravi Verma', email: 'ravi@zomato.com', company: 'Zomato Enterprise', role: 'Sales Rep', plan: 'Professional', status: 'Active', lastLogin: '2024-10-25T13:00:00Z', joinedAt: '2024-05-08' },
  { id: 'U-012', name: 'Pooja Nair', email: 'pooja@razorpay.com', company: 'Razorpay CRM', role: 'Manager', plan: 'Enterprise', status: 'Active', lastLogin: '2024-10-26T10:00:00Z', joinedAt: '2024-03-18' },
];

export const PLANS = [
  { id: 'PL-001', name: 'Starter', price: 1999, billingCycle: 'Monthly', maxUsers: 5, maxLeads: 500, features: ['Basic CRM', 'Email tracking', '5 users', 'Community support'], activeSubscriptions: 18, revenue: 35982, color: 'blue' },
  { id: 'PL-002', name: 'Professional', price: 9999, billingCycle: 'Monthly', maxUsers: 25, maxLeads: 5000, features: ['Full CRM', 'Advanced analytics', '25 users', 'Priority support', 'Custom reports', 'API access'], activeSubscriptions: 34, revenue: 339966, color: 'orange' },
  { id: 'PL-003', name: 'Enterprise', price: 24999, billingCycle: 'Monthly', maxUsers: -1, maxLeads: -1, features: ['Unlimited CRM', 'Custom integrations', 'Unlimited users', 'Dedicated support', 'SLA guarantee', 'White-label', 'Custom domain'], activeSubscriptions: 12, revenue: 299988, color: 'purple' },
];

export const SUBSCRIPTIONS = [
  { id: 'SUB-001', company: 'TechNova Global', plan: 'Enterprise', status: 'Active', mrr: 24999, startDate: '2024-01-15', nextBilling: '2024-11-15', paymentMethod: 'Card ****4242' },
  { id: 'SUB-002', company: 'Infosys BPO', plan: 'Professional', status: 'Active', mrr: 9999, startDate: '2024-02-20', nextBilling: '2024-11-20', paymentMethod: 'Card ****1234' },
  { id: 'SUB-003', company: 'HDFC Growth', plan: 'Enterprise', status: 'Active', mrr: 24999, startDate: '2023-11-10', nextBilling: '2024-11-10', paymentMethod: 'Bank Transfer' },
  { id: 'SUB-004', company: 'Reliance Retail', plan: 'Starter', status: 'Trial', mrr: 0, startDate: '2024-10-01', nextBilling: '2024-11-01', paymentMethod: '-' },
  { id: 'SUB-005', company: 'Acme Corp', plan: 'Professional', status: 'Active', mrr: 9999, startDate: '2024-03-05', nextBilling: '2024-11-05', paymentMethod: 'Card ****5678' },
  { id: 'SUB-006', company: 'Vanguard Systems', plan: 'Enterprise', status: 'Active', mrr: 24999, startDate: '2024-01-28', nextBilling: '2024-11-28', paymentMethod: 'Card ****9012' },
  { id: 'SUB-007', company: 'Wipro Digital', plan: 'Professional', status: 'Suspended', mrr: 9999, startDate: '2024-04-12', nextBilling: '-', paymentMethod: 'Card ****3456' },
  { id: 'SUB-008', company: 'Mahindra Tech', plan: 'Professional', status: 'Active', mrr: 9999, startDate: '2024-02-14', nextBilling: '2024-11-14', paymentMethod: 'Bank Transfer' },
  { id: 'SUB-009', company: 'Global Logistics', plan: 'Enterprise', status: 'Active', mrr: 24999, startDate: '2023-09-22', nextBilling: '2024-11-22', paymentMethod: 'Card ****7890' },
  { id: 'SUB-010', company: 'Flipkart B2B', plan: 'Starter', status: 'Trial', mrr: 0, startDate: '2024-10-15', nextBilling: '2024-11-15', paymentMethod: '-' },
  { id: 'SUB-011', company: 'Zomato Enterprise', plan: 'Professional', status: 'Active', mrr: 9999, startDate: '2024-05-08', nextBilling: '2024-11-08', paymentMethod: 'Card ****2345' },
  { id: 'SUB-012', company: 'Razorpay CRM', plan: 'Enterprise', status: 'Active', mrr: 24999, startDate: '2024-03-18', nextBilling: '2024-11-18', paymentMethod: 'Card ****6789' },
];

export const DEMO_REQUESTS = [
  { id: 'DR-001', name: 'Arjun Reddy', company: 'Ola Electric', email: 'arjun@olaelectric.com', phone: '+91 98765 11111', plan: 'Enterprise', status: 'Scheduled', requestedAt: '2024-10-25T09:00:00Z', scheduledAt: '2024-10-28T14:00:00Z', notes: 'Interested in team management and pipeline features' },
  { id: 'DR-002', name: 'Simran Kaur', company: 'Byju\'s Sales', email: 'simran@byjus.com', phone: '+91 87654 22222', plan: 'Professional', status: 'Pending', requestedAt: '2024-10-26T10:30:00Z', scheduledAt: null, notes: 'Needs integration with HubSpot' },
  { id: 'DR-003', name: 'Tom Wilson', company: 'CloudBase Inc', email: 'tom@cloudbase.com', phone: '+1 555 333 4444', plan: 'Enterprise', status: 'Completed', requestedAt: '2024-10-20T11:00:00Z', scheduledAt: '2024-10-22T15:00:00Z', notes: 'Demo went well — proposal sent' },
  { id: 'DR-004', name: 'Kavya Iyer', company: 'PayU India', email: 'kavya@payu.in', phone: '+91 76543 33333', plan: 'Professional', status: 'Pending', requestedAt: '2024-10-26T08:15:00Z', scheduledAt: null, notes: '' },
  { id: 'DR-005', name: 'Lisa Park', company: 'Stripe APAC', email: 'lisa@stripe.com', phone: '+65 9123 4567', plan: 'Enterprise', status: 'Scheduled', requestedAt: '2024-10-24T14:00:00Z', scheduledAt: '2024-10-29T10:00:00Z', notes: 'Want full API walkthrough' },
  { id: 'DR-006', name: 'Deepak Joshi', company: 'Nykaa B2B', email: 'deepak@nykaa.com', phone: '+91 65432 44444', plan: 'Starter', status: 'No-Show', requestedAt: '2024-10-18T09:00:00Z', scheduledAt: '2024-10-21T11:00:00Z', notes: 'Rescheduling needed' },
];

export const WEBSITE_HEALTH = {
  uptime: 99.97,
  responseTime: 124,
  errorRate: 0.03,
  activeUsers: 847,
  cpuUsage: 34,
  memoryUsage: 62,
  diskUsage: 48,
  dbConnections: 23,
  lastChecked: new Date().toISOString(),
  services: [
    { name: 'API Server', status: 'Operational', latency: 89, uptime: 99.99 },
    { name: 'Database (PostgreSQL)', status: 'Operational', latency: 12, uptime: 99.99 },
    { name: 'Redis Cache', status: 'Operational', latency: 3, uptime: 100 },
    { name: 'Email Service', status: 'Operational', latency: 245, uptime: 99.95 },
    { name: 'File Storage (S3)', status: 'Operational', latency: 156, uptime: 99.98 },
    { name: 'Auth Service', status: 'Degraded', latency: 892, uptime: 99.12 },
    { name: 'Search (Elasticsearch)', status: 'Operational', latency: 34, uptime: 99.97 },
    { name: 'Webhook Processor', status: 'Operational', latency: 67, uptime: 99.94 },
  ],
  uptimeHistory: [
    { date: 'Oct 20', uptime: 99.99 }, { date: 'Oct 21', uptime: 99.98 },
    { date: 'Oct 22', uptime: 100 }, { date: 'Oct 23', uptime: 99.95 },
    { date: 'Oct 24', uptime: 99.99 }, { date: 'Oct 25', uptime: 99.97 },
    { date: 'Oct 26', uptime: 99.97 },
  ],
};

export const ACTIVITY_LOGS = [
  { id: 'AL-001', type: 'Login', user: 'Sarah Jenkins', company: 'TechNova Global', action: 'Logged in from Chrome/Windows', ip: '104.21.45.231', timestamp: '2024-10-26T10:30:00Z', severity: 'Info' },
  { id: 'AL-002', type: 'Plan Change', user: 'Pooja Nair', company: 'Razorpay CRM', action: 'Upgraded from Professional to Enterprise', ip: '182.72.43.12', timestamp: '2024-10-26T10:15:00Z', severity: 'Info' },
  { id: 'AL-003', type: 'Payment', user: 'David Smith', company: 'Global Logistics', action: 'Payment of ₹24,999 processed successfully', ip: '86.14.52.100', timestamp: '2024-10-26T09:45:00Z', severity: 'Success' },
  { id: 'AL-004', type: 'Security', user: 'Vikram Singh', company: 'Wipro Digital', action: 'Failed login attempt (3rd time) — account locked', ip: '122.33.44.55', timestamp: '2024-10-26T09:20:00Z', severity: 'Warning' },
  { id: 'AL-005', type: 'API', user: 'System', company: 'TechNova Global', action: 'Webhook delivery failed — endpoint returned 500', ip: '-', timestamp: '2024-10-26T08:55:00Z', severity: 'Error' },
  { id: 'AL-006', type: 'User Created', user: 'Aarav Patel', company: 'Infosys BPO', action: 'New user invited: neha.s@infosys.com', ip: '49.36.217.45', timestamp: '2024-10-26T08:30:00Z', severity: 'Info' },
  { id: 'AL-007', type: 'Data Export', user: 'Rahul Sharma', company: 'HDFC Growth', action: 'Exported 521 leads to CSV', ip: '117.197.8.23', timestamp: '2024-10-25T18:45:00Z', severity: 'Info' },
  { id: 'AL-008', type: 'Payment Failed', user: 'System', company: 'Wipro Digital', action: 'Subscription payment failed — card declined', ip: '-', timestamp: '2024-10-25T17:00:00Z', severity: 'Error' },
  { id: 'AL-009', type: 'Trial Started', user: 'Anjali Mehta', company: 'Flipkart B2B', action: '14-day trial started for Starter plan', ip: '103.85.44.22', timestamp: '2024-10-25T15:30:00Z', severity: 'Info' },
  { id: 'AL-010', type: 'Login', user: 'Elena Rodriguez', company: 'Vanguard Systems', action: 'Logged in from Safari/Mac', ip: '76.123.45.67', timestamp: '2024-10-25T14:00:00Z', severity: 'Info' },
];

export const EMAIL_LOGS = [
  { id: 'EL-001', to: 'sarah@technova.io', subject: 'Invoice #INV-2024-1015 — ₹24,999', type: 'Invoice', status: 'Delivered', sentAt: '2024-10-15T09:00:00Z', openedAt: '2024-10-15T09:34:00Z' },
  { id: 'EL-002', to: 'vikram@wipro.com', subject: 'Action Required: Payment Overdue', type: 'Payment Reminder', status: 'Delivered', sentAt: '2024-10-20T10:00:00Z', openedAt: null },
  { id: 'EL-003', to: 'anjali@flipkart.com', subject: 'Welcome to SalesFlow Hub — Trial Started', type: 'Welcome', status: 'Delivered', sentAt: '2024-10-15T12:00:00Z', openedAt: '2024-10-15T12:45:00Z' },
  { id: 'EL-004', to: 'arjun@olaelectric.com', subject: 'Demo Confirmation — Oct 28, 2:00 PM', type: 'Demo Confirmation', status: 'Delivered', sentAt: '2024-10-25T09:30:00Z', openedAt: '2024-10-25T10:12:00Z' },
  { id: 'EL-005', to: 'simran@byjus.com', subject: 'Thanks for requesting a demo!', type: 'Demo Request Received', status: 'Delivered', sentAt: '2024-10-26T10:35:00Z', openedAt: null },
  { id: 'EL-006', to: 'david@globallogistics.co.uk', subject: 'Payment Confirmation — ₹24,999', type: 'Payment Receipt', status: 'Delivered', sentAt: '2024-10-26T09:50:00Z', openedAt: '2024-10-26T10:15:00Z' },
  { id: 'EL-007', to: 'admin@flipkart.com', subject: 'Your trial expires in 7 days', type: 'Trial Expiry Warning', status: 'Failed', sentAt: '2024-10-22T08:00:00Z', openedAt: null },
  { id: 'EL-008', to: 'pooja@razorpay.com', subject: 'Upgrade Confirmation — Enterprise Plan', type: 'Plan Upgrade', status: 'Delivered', sentAt: '2024-10-26T10:20:00Z', openedAt: '2024-10-26T10:28:00Z' },
];

export const SUPPORT_TICKETS = [
  { id: 'TK-001', subject: 'Can\'t export leads to CSV', company: 'Infosys BPO', user: 'Aarav Patel', priority: 'High', status: 'Open', category: 'Bug', createdAt: '2024-10-26T08:00:00Z', updatedAt: '2024-10-26T09:30:00Z', assignedTo: 'Support Team' },
  { id: 'TK-002', subject: 'How to set up email integration?', company: 'Flipkart B2B', user: 'Anjali Mehta', priority: 'Medium', status: 'In Progress', category: 'How-to', createdAt: '2024-10-25T14:00:00Z', updatedAt: '2024-10-26T08:45:00Z', assignedTo: 'Raj Kumar' },
  { id: 'TK-003', subject: 'Billing discrepancy on October invoice', company: 'Wipro Digital', user: 'Vikram Singh', priority: 'High', status: 'Open', category: 'Billing', createdAt: '2024-10-25T11:30:00Z', updatedAt: '2024-10-25T16:00:00Z', assignedTo: 'Finance Team' },
  { id: 'TK-004', subject: 'Dashboard not loading for some users', company: 'HDFC Growth', user: 'Rahul Sharma', priority: 'Critical', status: 'Resolved', category: 'Bug', createdAt: '2024-10-24T09:00:00Z', updatedAt: '2024-10-24T15:00:00Z', assignedTo: 'Dev Team' },
  { id: 'TK-005', subject: 'Request to increase user limit temporarily', company: 'TechNova Global', user: 'Sarah Jenkins', priority: 'Low', status: 'Closed', category: 'Account', createdAt: '2024-10-20T10:00:00Z', updatedAt: '2024-10-21T12:00:00Z', assignedTo: 'Account Team' },
  { id: 'TK-006', subject: 'API rate limit too low for our use case', company: 'Razorpay CRM', user: 'Pooja Nair', priority: 'Medium', status: 'In Progress', category: 'Feature Request', createdAt: '2024-10-23T13:00:00Z', updatedAt: '2024-10-25T10:00:00Z', assignedTo: 'Product Team' },
];

export const REVENUE_TREND = [
  { month: 'May', mrr: 312000, newMrr: 45000, churn: 12000 },
  { month: 'Jun', mrr: 345000, newMrr: 52000, churn: 19000 },
  { month: 'Jul', mrr: 378000, newMrr: 48000, churn: 15000 },
  { month: 'Aug', mrr: 412000, newMrr: 61000, churn: 27000 },
  { month: 'Sep', mrr: 445000, newMrr: 55000, churn: 22000 },
  { month: 'Oct', mrr: 489000, newMrr: 68000, churn: 24000 },
];

export const USER_GROWTH = [
  { month: 'May', total: 215, new: 32 }, { month: 'Jun', total: 248, new: 38 },
  { month: 'Jul', total: 284, new: 41 }, { month: 'Aug', total: 321, new: 45 },
  { month: 'Sep', total: 356, new: 39 }, { month: 'Oct', total: 395, new: 48 },
];

export const formatINR = (amount) => {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(0)}K`;
  return `₹${amount}`;
};

export const timeAgo = (dateStr) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
};
