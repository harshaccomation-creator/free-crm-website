import { z } from "zod";

export const leadStatusSchema = z.enum(["New", "Assigned", "Demo Done", "Won", "Lost", "Junk", "Overdue"]);
export type LeadStatus = z.infer<typeof leadStatusSchema>;

export const prioritySchema = z.enum(["High", "Medium", "Low"]);
export type Priority = z.infer<typeof prioritySchema>;

export const taskStatusSchema = z.enum(["Pending", "Completed", "Overdue"]);
export type TaskStatus = z.infer<typeof taskStatusSchema>;

export const paymentStatusSchema = z.enum(["Pending", "Completed"]);
export type PaymentStatus = z.infer<typeof paymentStatusSchema>;

export const employeeRoleSchema = z.enum(["Manager", "Employee", "Company Admin"]);
export type EmployeeRole = z.infer<typeof employeeRoleSchema>;

export const employeeStatusSchema = z.enum(["Active", "Inactive"]);
export type EmployeeStatus = z.infer<typeof employeeStatusSchema>;

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  company: string;
  status: LeadStatus;
  assignedTo: string;
  followUpDate: string;
  createdBy: string;
  createdDate: string;
  amount: number;
}

export interface FollowUp {
  id: string;
  leadName: string;
  assignedTo: string;
  followUpDate: string;
  followUpTime: string;
  status: LeadStatus;
  phone: string;
}

export interface Task {
  id: string;
  title: string;
  assignedTo: string;
  relatedLead: string;
  priority: Priority;
  dueDate: string;
  status: TaskStatus;
}

export interface Payment {
  id: string;
  leadName: string;
  amount: number;
  status: PaymentStatus;
  paymentDate: string;
  collectedBy: string;
  createdDate: string;
}

export interface TeamMember {
  id: string;
  name: string;
  initials: string;
  email: string;
  role: EmployeeRole;
  status: EmployeeStatus;
  totalLeads: number;
  wonLeads: number;
  lastLogin: string;
}

export interface Notification {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: "reminder" | "alert" | "payment" | "assignment" | "task" | "activity";
}

export const leads: Lead[] = [
  { id: "L-1001", name: "Rohan Patel", phone: "+91 9876543210", email: "rohan@techcorp.in", company: "TechCorp Solutions", status: "New", assignedTo: "Arjun Sharma", followUpDate: "2023-11-20", createdBy: "System", createdDate: "2023-11-18", amount: 150000 },
  { id: "L-1002", name: "Priya Desai", phone: "+91 8765432109", email: "priya.d@retailhub.com", company: "RetailHub Ltd", status: "Assigned", assignedTo: "Sneha Rao", followUpDate: "2023-11-21", createdBy: "Arjun Sharma", createdDate: "2023-11-18", amount: 200000 },
  { id: "L-1003", name: "Amit Singh", phone: "+91 7654321098", email: "amit.singh@buildwell.in", company: "BuildWell Construction", status: "Demo Done", assignedTo: "Rahul Verma", followUpDate: "2023-11-22", createdBy: "Web Form", createdDate: "2023-11-17", amount: 500000 },
  { id: "L-1004", name: "Neha Gupta", phone: "+91 6543210987", email: "neha@innovate.co.in", company: "Innovate AI", status: "Won", assignedTo: "Sneha Rao", followUpDate: "2023-11-15", createdBy: "Arjun Sharma", createdDate: "2023-11-10", amount: 350000 },
  { id: "L-1005", name: "Vikram Reddy", phone: "+91 5432109876", email: "vikram.r@logistics.in", company: "FastTrack Logistics", status: "Lost", assignedTo: "Rahul Verma", followUpDate: "2023-11-10", createdBy: "System", createdDate: "2023-11-05", amount: 100000 },
  { id: "L-1006", name: "Sunil Kumar", phone: "+91 9988776655", email: "sunil@skenterprises.in", company: "SK Enterprises", status: "Overdue", assignedTo: "Arjun Sharma", followUpDate: "2023-11-18", createdBy: "System", createdDate: "2023-11-15", amount: 80000 },
  { id: "L-1007", name: "Meera Iyer", phone: "+91 8877665544", email: "meera.iyer@finserve.com", company: "FinServe Advisory", status: "Assigned", assignedTo: "Pooja Joshi", followUpDate: "2023-11-20", createdBy: "Arjun Sharma", createdDate: "2023-11-19", amount: 250000 },
  { id: "L-1008", name: "Karan Mehta", phone: "+91 7766554433", email: "karan@mehtabrothers.in", company: "Mehta Brothers", status: "Demo Done", assignedTo: "Rahul Verma", followUpDate: "2023-11-23", createdBy: "Web Form", createdDate: "2023-11-18", amount: 450000 },
  { id: "L-1009", name: "Anjali Das", phone: "+91 6655443322", email: "anjali@creativemedia.in", company: "Creative Media", status: "New", assignedTo: "Unassigned", followUpDate: "2023-11-25", createdBy: "System", createdDate: "2023-11-20", amount: 120000 },
  { id: "L-1010", name: "Suresh Pillai", phone: "+91 5544332211", email: "suresh@pillaigroup.com", company: "Pillai Group", status: "Junk", assignedTo: "Unassigned", followUpDate: "2023-11-01", createdBy: "System", createdDate: "2023-10-25", amount: 0 },
  { id: "L-1011", name: "Rajesh Chawla", phone: "+91 9123456780", email: "rajesh@chawlaindustries.in", company: "Chawla Industries", status: "Won", assignedTo: "Arjun Sharma", followUpDate: "2023-11-12", createdBy: "Sneha Rao", createdDate: "2023-11-01", amount: 600000 },
  { id: "L-1012", name: "Simran Kaur", phone: "+91 8123456789", email: "simran@kaurdesigns.com", company: "Kaur Designs", status: "Assigned", assignedTo: "Pooja Joshi", followUpDate: "2023-11-21", createdBy: "Web Form", createdDate: "2023-11-19", amount: 180000 },
  { id: "L-1013", name: "Deepak Menon", phone: "+91 7123456789", email: "deepak@menonhotels.in", company: "Menon Hotels", status: "Overdue", assignedTo: "Rahul Verma", followUpDate: "2023-11-17", createdBy: "System", createdDate: "2023-11-10", amount: 750000 },
  { id: "L-1014", name: "Kavita Nair", phone: "+91 6123456789", email: "kavita@nairconsulting.in", company: "Nair Consulting", status: "New", assignedTo: "Unassigned", followUpDate: "2023-11-24", createdBy: "Arjun Sharma", createdDate: "2023-11-20", amount: 90000 },
  { id: "L-1015", name: "Manish Agarwal", phone: "+91 5123456789", email: "manish@agarwaltraders.com", company: "Agarwal Traders", status: "Demo Done", assignedTo: "Sneha Rao", followUpDate: "2023-11-22", createdBy: "Web Form", createdDate: "2023-11-18", amount: 220000 },
];

export const followups: FollowUp[] = [
  { id: "F-101", leadName: "Rohan Patel", assignedTo: "Arjun Sharma", followUpDate: "Today", followUpTime: "10:30 AM", status: "New", phone: "+91 9876543210" },
  { id: "F-102", leadName: "Priya Desai", assignedTo: "Sneha Rao", followUpDate: "Today", followUpTime: "12:00 PM", status: "Assigned", phone: "+91 8765432109" },
  { id: "F-103", leadName: "Meera Iyer", assignedTo: "Pooja Joshi", followUpDate: "Today", followUpTime: "02:15 PM", status: "Assigned", phone: "+91 8877665544" },
  { id: "F-104", leadName: "Amit Singh", assignedTo: "Rahul Verma", followUpDate: "Tomorrow", followUpTime: "11:00 AM", status: "Demo Done", phone: "+91 7654321098" },
  { id: "F-105", leadName: "Simran Kaur", assignedTo: "Pooja Joshi", followUpDate: "Tomorrow", followUpTime: "03:30 PM", status: "Assigned", phone: "+91 8123456789" },
  { id: "F-106", leadName: "Manish Agarwal", assignedTo: "Sneha Rao", followUpDate: "Tomorrow", followUpTime: "04:45 PM", status: "Demo Done", phone: "+91 5123456789" },
  { id: "F-107", leadName: "Karan Mehta", assignedTo: "Rahul Verma", followUpDate: "2023-11-23", followUpTime: "10:00 AM", status: "Demo Done", phone: "+91 7766554433" },
  { id: "F-108", leadName: "Kavita Nair", assignedTo: "Arjun Sharma", followUpDate: "2023-11-24", followUpTime: "11:30 AM", status: "New", phone: "+91 6123456789" },
  { id: "F-109", leadName: "Anjali Das", assignedTo: "Arjun Sharma", followUpDate: "2023-11-25", followUpTime: "02:00 PM", status: "New", phone: "+91 6655443322" },
  { id: "F-110", leadName: "Sunil Kumar", assignedTo: "Arjun Sharma", followUpDate: "Overdue", followUpTime: "10:00 AM (2 days ago)", status: "Overdue", phone: "+91 9988776655" },
  { id: "F-111", leadName: "Deepak Menon", assignedTo: "Rahul Verma", followUpDate: "Overdue", followUpTime: "01:00 PM (3 days ago)", status: "Overdue", phone: "+91 7123456789" },
  { id: "F-112", leadName: "Neha Gupta", assignedTo: "Sneha Rao", followUpDate: "2023-11-15", followUpTime: "11:00 AM", status: "Won", phone: "+91 6543210987" },
];

export const tasks: Task[] = [
  { id: "T-201", title: "Prepare Demo Presentation", assignedTo: "Rahul Verma", relatedLead: "Amit Singh", priority: "High", dueDate: "Today", status: "Pending" },
  { id: "T-202", title: "Send Quotation", assignedTo: "Sneha Rao", relatedLead: "Priya Desai", priority: "High", dueDate: "Today", status: "Pending" },
  { id: "T-203", title: "Follow up on Payment", assignedTo: "Arjun Sharma", relatedLead: "Neha Gupta", priority: "High", dueDate: "Tomorrow", status: "Pending" },
  { id: "T-204", title: "Schedule Next Meeting", assignedTo: "Pooja Joshi", relatedLead: "Meera Iyer", priority: "Medium", dueDate: "Tomorrow", status: "Pending" },
  { id: "T-205", title: "Update CRM Details", assignedTo: "Sneha Rao", relatedLead: "Manish Agarwal", priority: "Low", dueDate: "2023-11-23", status: "Pending" },
  { id: "T-206", title: "Call for Feedback", assignedTo: "Rahul Verma", relatedLead: "Karan Mehta", priority: "Medium", dueDate: "2023-11-24", status: "Pending" },
  { id: "T-207", title: "Send Product Brochure", assignedTo: "Arjun Sharma", relatedLead: "Rohan Patel", priority: "Low", dueDate: "2023-11-25", status: "Pending" },
  { id: "T-208", title: "Verify GST Details", assignedTo: "Arjun Sharma", relatedLead: "Rajesh Chawla", priority: "High", dueDate: "Overdue (1 day)", status: "Overdue" },
  { id: "T-209", title: "Check Contract Draft", assignedTo: "Rahul Verma", relatedLead: "Deepak Menon", priority: "High", dueDate: "Overdue (2 days)", status: "Overdue" },
  { id: "T-210", title: "Initial Introductory Call", assignedTo: "Arjun Sharma", relatedLead: "Sunil Kumar", priority: "Medium", dueDate: "Overdue (3 days)", status: "Overdue" },
];

export const payments: Payment[] = [
  { id: "P-301", leadName: "Rajesh Chawla", amount: 300000, status: "Completed", paymentDate: "2023-11-18", collectedBy: "Arjun Sharma", createdDate: "2023-11-15" },
  { id: "P-302", leadName: "Neha Gupta", amount: 150000, status: "Completed", paymentDate: "2023-11-17", collectedBy: "Sneha Rao", createdDate: "2023-11-15" },
  { id: "P-303", leadName: "Amit Singh", amount: 50000, status: "Pending", paymentDate: "2023-11-22", collectedBy: "Rahul Verma", createdDate: "2023-11-19" },
  { id: "P-304", leadName: "Karan Mehta", amount: 100000, status: "Pending", paymentDate: "2023-11-25", collectedBy: "Rahul Verma", createdDate: "2023-11-18" },
  { id: "P-305", leadName: "Rajesh Chawla", amount: 300000, status: "Pending", paymentDate: "2023-11-30", collectedBy: "Arjun Sharma", createdDate: "2023-11-18" },
  { id: "P-306", leadName: "Neha Gupta", amount: 200000, status: "Pending", paymentDate: "2023-11-28", collectedBy: "Sneha Rao", createdDate: "2023-11-17" },
  { id: "P-307", leadName: "Vikram Reddy", amount: 50000, status: "Completed", paymentDate: "2023-10-15", collectedBy: "Rahul Verma", createdDate: "2023-10-10" },
  { id: "P-308", leadName: "Suresh Pillai", amount: 10000, status: "Completed", paymentDate: "2023-09-20", collectedBy: "Arjun Sharma", createdDate: "2023-09-15" },
  { id: "P-309", leadName: "Manish Agarwal", amount: 25000, status: "Pending", paymentDate: "2023-11-26", collectedBy: "Sneha Rao", createdDate: "2023-11-20" },
  { id: "P-310", leadName: "Priya Desai", amount: 50000, status: "Pending", paymentDate: "2023-11-27", collectedBy: "Sneha Rao", createdDate: "2023-11-20" },
];

export const teamMembers: TeamMember[] = [
  { id: "TM-01", name: "Arjun Sharma", initials: "AS", email: "arjun@salesflow.in", role: "Company Admin", status: "Active", totalLeads: 450, wonLeads: 125, lastLogin: "Today, 09:00 AM" },
  { id: "TM-02", name: "Sneha Rao", initials: "SR", email: "sneha@salesflow.in", role: "Manager", status: "Active", totalLeads: 320, wonLeads: 98, lastLogin: "Today, 09:15 AM" },
  { id: "TM-03", name: "Rahul Verma", initials: "RV", email: "rahul@salesflow.in", role: "Employee", status: "Active", totalLeads: 280, wonLeads: 75, lastLogin: "Today, 08:45 AM" },
  { id: "TM-04", name: "Pooja Joshi", initials: "PJ", email: "pooja@salesflow.in", role: "Employee", status: "Active", totalLeads: 210, wonLeads: 42, lastLogin: "Today, 09:30 AM" },
  { id: "TM-05", name: "Vivek Menon", initials: "VM", email: "vivek@salesflow.in", role: "Manager", status: "Active", totalLeads: 310, wonLeads: 85, lastLogin: "Yesterday, 06:00 PM" },
  { id: "TM-06", name: "Kirti Das", initials: "KD", email: "kirti@salesflow.in", role: "Employee", status: "Active", totalLeads: 150, wonLeads: 30, lastLogin: "Yesterday, 05:30 PM" },
  { id: "TM-07", name: "Nitin Gupta", initials: "NG", email: "nitin@salesflow.in", role: "Employee", status: "Active", totalLeads: 180, wonLeads: 35, lastLogin: "Today, 10:00 AM" },
  { id: "TM-08", name: "Divya Singh", initials: "DS", email: "divya@salesflow.in", role: "Employee", status: "Inactive", totalLeads: 90, wonLeads: 15, lastLogin: "2023-10-15, 04:00 PM" },
];

export const notifications: Notification[] = [
  { id: "N-1", title: "Follow-up Reminder", description: "Follow-up with Rohan Patel at 10:30 AM", timestamp: "10 mins ago", type: "reminder" },
  { id: "N-2", title: "New Lead Assigned", description: "Priya Desai has been assigned to you", timestamp: "1 hour ago", type: "assignment" },
  { id: "N-3", title: "Payment Received", description: "Payment of ₹1,50,000 received from Neha Gupta", timestamp: "2 hours ago", type: "payment" },
  { id: "N-4", title: "Task Overdue", description: "Verify GST Details for Rajesh Chawla is overdue", timestamp: "3 hours ago", type: "task" },
  { id: "N-5", title: "Lead Overdue", description: "Sunil Kumar follow-up is overdue by 2 days", timestamp: "5 hours ago", type: "alert" },
  { id: "N-6", title: "Employee Activity", description: "Rahul Verma marked lead Karan Mehta as Demo Done", timestamp: "Yesterday", type: "activity" },
  { id: "N-7", title: "Payment Received", description: "Payment of ₹3,00,000 received from Rajesh Chawla", timestamp: "Yesterday", type: "payment" },
  { id: "N-8", title: "New Lead Assigned", description: "Meera Iyer has been assigned to you", timestamp: "Yesterday", type: "assignment" },
  { id: "N-9", title: "Task Completed", description: "Sneha Rao completed task 'Send Quotation'", timestamp: "2 days ago", type: "activity" },
  { id: "N-10", title: "Follow-up Reminder", description: "Follow-up with Amit Singh at 11:00 AM", timestamp: "2 days ago", type: "reminder" },
];

export const dashboardStats = {
  totalLeads: "2,847",
  activeLeads: "1,234",
  todayFollowUps: "48",
  overdueLeads: "127",
  wonLeads: "891",
  lostLeads: "312",
  totalPayments: "Rs 48.2L",
  pendingTasks: "23",
  teamMembers: "12",
};

export const monthlyRevenue = [
  { month: "Jan", revenue: 400000, collections: 240000 },
  { month: "Feb", revenue: 300000, collections: 139000 },
  { month: "Mar", revenue: 200000, collections: 980000 },
  { month: "Apr", revenue: 278000, collections: 390800 },
  { month: "May", revenue: 189000, collections: 480000 },
  { month: "Jun", revenue: 239000, collections: 380000 },
  { month: "Jul", revenue: 349000, collections: 430000 },
  { month: "Aug", revenue: 200000, collections: 980000 },
  { month: "Sep", revenue: 278000, collections: 390800 },
  { month: "Oct", revenue: 189000, collections: 480000 },
  { month: "Nov", revenue: 239000, collections: 380000 },
  { month: "Dec", revenue: 349000, collections: 430000 },
];
