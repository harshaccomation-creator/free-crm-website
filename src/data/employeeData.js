export const employeeStats = [
  { label: "Assigned Leads", value: "128", change: "+12%", tone: "blue" },
  { label: "Today Follow-ups", value: "24", change: "+8", tone: "orange" },
  { label: "Won Leads", value: "18", change: "+5", tone: "green" },
  { label: "Overdue Leads", value: "7", change: "-3", tone: "red" }
];

export const employeeActivities = [
  {
    id: 1,
    type: "call",
    title: "Call completed",
    lead: "Priya Sharma",
    description: "Discussed product demo and pricing plan.",
    time: "Today, 10:30 AM",
    status: "Completed"
  },
  {
    id: 2,
    type: "whatsapp",
    title: "WhatsApp follow-up",
    lead: "Rohan Mehta",
    description: "Shared SalesFlow Hub brochure and next step details.",
    time: "Today, 09:15 AM",
    status: "Sent"
  },
  {
    id: 3,
    type: "demo",
    title: "Demo scheduled",
    lead: "Amit Verma",
    description: "Demo booked for tomorrow with company admin.",
    time: "Yesterday, 04:20 PM",
    status: "Scheduled"
  },
  {
    id: 4,
    type: "note",
    title: "Internal note added",
    lead: "Neha Singh",
    description: "Client is interested in yearly CRM subscription.",
    time: "Yesterday, 02:05 PM",
    status: "Note"
  },
  {
    id: 5,
    type: "won",
    title: "Lead converted",
    lead: "Deepak Kumar",
    description: "Lead marked as won after payment confirmation.",
    time: "16 May, 12:10 PM",
    status: "Won"
  }
];

export const employeeLeads = [
  {
    id: "lead-1",
    name: "Priya Sharma",
    company: "Sharma Textiles",
    phone: "+91 98765 43210",
    email: "priya@example.com",
    status: "Contacted",
    value: "₹24,000",
    owner: "Jayraj",
    source: "Website"
  },
  {
    id: "lead-2",
    name: "Rohan Mehta",
    company: "Mehta Associates",
    phone: "+91 99887 77665",
    email: "rohan@example.com",
    status: "New",
    value: "₹18,000",
    owner: "Jayraj",
    source: "Referral"
  },
  {
    id: "lead-3",
    name: "Amit Verma",
    company: "AV Enterprises",
    phone: "+91 91234 56789",
    email: "amit@example.com",
    status: "Demo",
    value: "₹36,000",
    owner: "Jayraj",
    source: "Instagram"
  }
];

export const employeeTasks = [
  {
    id: 1,
    title: "Call Priya Sharma",
    due: "Today, 11:30 AM",
    priority: "High",
    status: "Pending"
  },
  {
    id: 2,
    title: "Send proposal to Amit Verma",
    due: "Today, 03:00 PM",
    priority: "Medium",
    status: "Pending"
  },
  {
    id: 3,
    title: "Follow-up with Rohan Mehta",
    due: "Tomorrow, 10:00 AM",
    priority: "Low",
    status: "Scheduled"
  }
];
