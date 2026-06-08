import { useState } from "react";
import EmployeeShell from "../../components/employee/EmployeeShell.jsx";
import { empLeads } from "../../data/employeeData.js";

const PAGE_SIZE = 10;

function go(path) {
  window.history.pushState({}, "", path);
  window.dispatchEvent(new Event("salesflow:navigate"));
}

export default function LeadListPage() {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil