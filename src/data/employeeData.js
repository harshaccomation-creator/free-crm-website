export const empLeads = [
  { id: "L001", name: "Rajesh Kumar", company: "TechNova Pvt Ltd", email: "rajesh@technova.in", phone: "+91 98765 43210", status: "New", source: "Website", value: 85000, score: 82, stage: "Prospecting", nextFollowUp: "Today, 3:00 PM", owner: "John Doe", created: "Jun 10, 2025" },
  { id: "L002", name: "Priya Sharma", company: "Zephyr Solutions", email: "priya@zephyr.com", phone: "+91 87654 32109", status: "Contacted", source: "LinkedIn", value: 120000, score: 71, stage: "Qualification", nextFollowUp: "Tomorrow, 11:00 AM", owner: "John Doe", created: "Jun 08, 2025" },
  { id: "L003", name: "Aditya Mehta", company: "Orion Enterprises", email: "aditya@orion.co", phone: "+91 76543 21098", status: "Demo Done", source: "Referral", value: 220000, score: 91, stage: "Proposal", nextFollowUp: "Jun 14, 2:00 PM", owner: "John Doe", created: "Jun 05, 2025" },
  { id: "L004", name: "Sunita Patel", company: "Bluewave Tech", email: "sunita@bluewave.io", phone: "+91 65432 10987", status: "Overdue", source: "Cold Email", value: 65000, score: 45, stage: "Qualification", nextFollowUp: "Overdue (Jun 09)", owner: "John Doe", created: "Jun 01, 2025" },
  { id: "L005", name: "Vikram Nair", company: "Pinnacle Corp", email: "vikram@pinnacle.com", phone: "+91 54321 09876", status: "Won", source: "Event", value: 310000, score: 98, stage: "Closed Won", nextFollowUp: "—", owner: "John Doe", created: "May 28, 2025" },
  { id: "L006", name: "Neha Gupta", company: "Starlight Systems", email: "neha@starlight.net", phone: "+91 43210 98765", status: "New", source: "Website", value: 95000, score: 68, stage: "Prospecting", nextFollowUp: "Jun 15, 10:00 AM", owner: "John Doe", created: "Jun 11, 2025" },
  { id: "L007", name: "Arjun Singh", company: "Delta Dynamics", email: "arjun@delta.in", phone: "+91 32109 87654", status: "Junk", source: "Cold Call", value: 0, score: 12, stage: "Junk", nextFollowUp: "—", owner: "John Doe", created: "Jun 03, 2025" },
  { id: "L008", name: "Kavya Reddy", company: "NexGen Solutions", email: "kavya@nexgen.co", phone: "+91 21098 76543", status: "Contacted", source: "LinkedIn", value: 175000, score: 79, stage: "Qualification", nextFollowUp: "Jun 13, 4:00 PM", owner: "John Doe", created: "Jun 07, 2025" },
];

export const empTasks = [
  { id: "T001", title: "Follow up with Rajesh Kumar", type: "Call", priority: "High", status: "Pending", due: "Today, 3:00 PM", lead: "Rajesh Kumar" },
  { id: "T002", title: "Send proposal to Aditya Mehta", type: "Email", priority: "High", status: "Pending", due: "Today, 5:00 PM", lead: "Aditya Mehta" },
  { id: "T003", title: "Demo call with Priya Sharma", type: "Meeting", priority: "Medium", status: "Pending", due: "Tomorrow, 11:00 AM", lead: "Priya Sharma" },
  { id: "T004", title: "Update lead notes for Sunita Patel", type: "Note", priority: "Low", status: "Overdue", due: "Jun 9, 2:00 PM", lead: "Sunita Patel" },
  { id: "T005", title: "Send invoice to Vikram Nair", type: "Email", priority: "Medium", status: "Done", due: "Jun 10, 3:00 PM", lead: "Vikram Nair" },
  { id: "T006", title: "WhatsApp follow-up — Kavya Reddy", type: "WhatsApp", priority: "Medium", status: "Pending", due: "Jun 13, 4:00 PM", lead: "Kavya Reddy" },
  { id: "T007", title: "Prepare demo deck for Neha Gupta", type: "Task", priority: "Low", status: "Pending", due: "Jun 15, 9:00 AM", lead: "Neha Gupta" },
];

export const empActivities = [
  { id: "A001", type: "Call", icon: "📞", title: "Called Rajesh Kumar", desc: "Discussed product features and pricing. Follow-up scheduled.", date: "Jun 12, 2:30 PM", status: "Completed", lead: "Rajesh Kumar" },
  { id: "A002", type: "Note", icon: "📝", title: "Note — Priya Sharma", desc: "Priya is interested in Enterprise plan. Waiting for budget approval.", date: "Jun 12, 11:00 AM", status: "Note", lead: "Priya Sharma" },
  { id: "A003", type: "Email", icon: "📧", title: "Proposal sent to Aditya Mehta", desc: "Sent detailed proposal with pricing and onboarding timeline.", date: "Jun 11, 4:45 PM", status: "Sent", lead: "Aditya Mehta" },
  { id: "A004", type: "Status Change", icon: "🔄", title: "Lead status updated", desc: "Vikram Nair moved from Proposal → Closed Won", date: "Jun 10, 3:00 PM", status: "Won", lead: "Vikram Nair" },
  { id: "A005", type: "Task", icon: "✅", title: "Task completed", desc: "Invoice sent successfully to Vikram Nair", date: "Jun 10, 2:15 PM", status: "Done", lead: "Vikram Nair" },
  { id: "A006", type: "WhatsApp", icon: "💬", title: "WhatsApp — Neha Gupta", desc: "Sent product brochure and intro video via WhatsApp.", date: "Jun 11, 10:30 AM", status: "Sent", lead: "Neha Gupta" },
  { id: "A007", type: "Call", icon: "📞", title: "Missed call — Sunita Patel", desc: "Tried to reach Sunita. No answer. Will try again tomorrow.", date: "Jun 09, 3:00 PM", status: "Missed", lead: "Sunita Patel" },
];

export const empContacts = [
  { id: "C001", name: "Rajesh Kumar", company: "TechNova Pvt Ltd", email: "rajesh@technova.in", phone: "+91 98765 43210", role: "CEO", status: "Active", lastContact: "Jun 12, 2025" },
  { id: "C002", name: "Priya Sharma", company: "Zephyr Solutions", email: "priya@zephyr.com", phone: "+91 87654 32109", role: "CTO", status: "Active", lastContact: "Jun 12, 2025" },
  { id: "C003", name: "Aditya Mehta", company: "Orion Enterprises", email: "aditya@orion.co", phone: "+91 76543 21098", role: "VP Sales", status: "Active", lastContact: "Jun 11, 2025" },
  { id: "C004", name: "Vikram Nair", company: "Pinnacle Corp", email: "vikram@pinnacle.com", phone: "+91 54321 09876", role: "MD", status: "Won", lastContact: "Jun 10, 2025" },
  { id: "C005", name: "Neha Gupta", company: "Starlight Systems", email: "neha@starlight.net", phone: "+91 43210 98765", role: "COO", status: "Active", lastContact: "Jun 11, 2025" },
  { id: "C006", name: "Sunita Patel", company: "Bluewave Tech", email: "sunita@bluewave.io", phone: "+91 65432 10987", role: "Director", status: "Inactive", lastContact: "Jun 09, 2025" },
];

export const wonLeads = empLeads.filter((lead) => lead.status === "Won");

export const empNotifications = [
  { id: 1, type: "task", title: "Follow-up due in 30 mins", desc: "Rajesh Kumar — Call at 3:00 PM today", time: "30m ago", read: false },
  { id: 2, type: "lead", title: "New lead assigned to you", desc: "Neha Gupta from Starlight Systems", time: "2h ago", read: false },
  { id: 3, type: "won", title: "Deal Won! 🎉", desc: "Vikram Nair — ₹3,10,000 deal closed!", time: "2 days ago", read: false },
  { id: 4, type: "overdue", title: "Overdue follow-up alert", desc: "Sunita Patel — 3 days overdue", time: "3 days ago", read: false },
  { id: 5, type: "email", title: "Email reply from Aditya Mehta", desc: "Re: Proposal — looking good, will confirm by Friday", time: "1 day ago", read: true },
  { id: 6, type: "task", title: "Task completed", desc: "You marked 'Send invoice to Vikram Nair' as done", time: "2 days ago", read: true },
];

export const employeeLeads = empLeads.map((lead) => ({
  ...lead,
  value: `₹${lead.value.toLocaleString("en-IN")}`,
}));

export const employeeTasks = empTasks;
export const employeeActivities = empActivities.map((activity) => ({
  id: activity.id,
  type: activity.type.toLowerCase(),
  title: activity.title,
  lead: activity.lead,
  description: activity.desc,
  time: activity.date,
  status: activity.status,
}));
