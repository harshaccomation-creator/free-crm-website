export const leads = [
  {
    id: 'rohan-mehta', initials: 'RA', name: 'Rohan Mehta', phone: '+91 98765 43210', email: 'rohan.mehta@techsolutions.com', company: 'Tech Solutions Pvt. Ltd.', source: 'Website', status: 'New', owner: 'Rahul Sharma', lastActivity: '20 May 2025 10:30 AM', nextFollowUp: '22 May 2025 11:00 AM', priority: 'Hot', jobTitle: 'IT Manager', expectedClose: '30 May 2025', score: 85
  },
  { id: 'priya-sharma', initials: 'PS', name: 'Priya Sharma', phone: '+91 91234 56789', email: 'priya@innovatech.com', company: 'Innovatech Systems', source: 'Referral', status: 'Contacted', owner: 'Rahul Sharma', lastActivity: '19 May 2025 03:15 PM', nextFollowUp: '21 May 2025 02:00 PM', priority: 'Warm', jobTitle: 'Operations Head', expectedClose: '28 May 2025', score: 72 },
  { id: 'amit-verma', initials: 'AM', name: 'Amit Verma', phone: '+91 99887 66554', email: 'amit@vermaenterprises.com', company: 'Verma Enterprises', source: 'LinkedIn', status: 'In Progress', owner: 'Rahul Sharma', lastActivity: '18 May 2025 11:45 AM', nextFollowUp: '20 May 2025 10:00 AM', priority: 'High', jobTitle: 'Founder', expectedClose: '27 May 2025', score: 68 },
  { id: 'neha-singh', initials: 'NS', name: 'Neha Singh', phone: '+91 88990 11223', email: 'neha@brightfuture.com', company: 'Bright Future Ltd.', source: 'Cold Call', status: 'In Progress', owner: 'Rahul Sharma', lastActivity: '17 May 2025 04:20 PM', nextFollowUp: '19 May 2025 03:00 PM', priority: 'Medium', jobTitle: 'Sales Head', expectedClose: '26 May 2025', score: 64 },
  { id: 'deepak-kumar', initials: 'DK', name: 'Deepak Kumar', phone: '+91 77788 99001', email: 'deepak@kumarco.com', company: 'Kumar & Co.', source: 'Email Campaign', status: 'Converted', owner: 'Rahul Sharma', lastActivity: '16 May 2025 12:10 PM', nextFollowUp: '-', priority: 'High', jobTitle: 'Director', expectedClose: 'Closed', score: 91 },
  { id: 'sneha-kapoor', initials: 'SK', name: 'Sneha Kapoor', phone: '+91 66655 44332', email: 'sneha@kapoorconsulting.com', company: 'Kapoor Consulting', source: 'Website', status: 'Lost', owner: 'Rahul Sharma', lastActivity: '15 May 2025 02:30 PM', nextFollowUp: '-', priority: 'Low', jobTitle: 'Consultant', expectedClose: '-', score: 38 }
];

export function getLead(id) {
  return leads.find((lead) => lead.id === id) || leads[0];
}
