import { useState } from "react";
import EmployeeShell from "../../components/employee/EmployeeShell.jsx";
import { empLeads } from "../../data/employeeData.js";

export default function LeadListPage() {
  const [page, setPage] = useState(1);
  const size = 10;
  const pages = Math.max(1, Math.ceil(empLeads.length / size));
  const leads = empLeads.slice((page - 1) * size, page * size);
  const go = (path) => {
    window.history.pushState({}, "", path);
    window.dispatchEvent(new Event("salesflow:navigate"));
  };

  return (
    <EmployeeShell