import { Phone, Mail, Building2, Plus } from 'lucide-react';
import EmployeeShell from '../../components/employee/EmployeeShell.jsx';

const contacts = [
  ['Priya Sharma', 'Sharma Textiles', '+91 98765 43210', 'priya@example.com', 'Active'],
  ['Rohan Mehta', 'Mehta Associates', '+91 99887 77665', 'rohan@example.com', 'New'],
  ['Amit Verma', 'AV Enterprises', '+91 91234 56789', 'amit@example.com', 'Demo']
];

export default function EmployeeContactsPage() {
  return (
    <EmployeeShell>
      <div className="space