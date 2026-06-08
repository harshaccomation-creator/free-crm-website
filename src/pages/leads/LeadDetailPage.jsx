import { useMemo, useState } from "react";
import {
  Mail,
  Phone,
  Edit3,
  Building2,
  MapPin,
  Globe,
  Clock,
  FileText,
  CheckSquare,
  CalendarClock,
  MessageCircle,
  Plus
} from "lucide-react";
import EmployeeShell from "../../components/employee/EmployeeShell.jsx";
import { empLeads } from "../../data/employeeData.js";

function getLeadIdFromUrl() {
  const parts = window.location.pathname.split("/");
  return parts[parts.length - 1];
}

function initials(name = "") {
  return name
    .split(" ")
    .map((x) => x[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatValue(value) {
  const num = Number(value || 0);
  return `₹${num.toLocaleString("en-IN")}`;
}

function statusClass(status) {
  if (status === "Won") return "bg-green-50 text-green-700 border-green-100";
  if (status === "Contacted") return "bg-green-50 text-green-700 border-green-100";
  if (status === "Qualified") return "bg-orange-50 text-orange-700 border-orange-100";
  if (status === "Demo Done") return "bg-orange-50 text-orange-700 border-orange-100";
  if (status === "Overdue") return "bg-red-50 text-red-700 border-red-100";
  if (status === "New") return "bg-blue-50 text-blue-700 border-blue-100";
  return "bg-slate-100 text-slate-600 border-slate-200";
}

function nowLabel() {
  return new Date().toLocaleString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

export default function LeadDetailPage({ leadId }) {
  const [activeTab, setActiveTab] = useState("Activity Timeline");
  const [noteText, setNoteText] = useState("");
  const [activities, setActivities] = useState([