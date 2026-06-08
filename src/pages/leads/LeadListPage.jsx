import { useState } from "react";
import { ChevronLeft, ChevronRight, Eye, MessageCircle, Phone, Plus, Search } from "lucide-react";
import EmployeeShell from "../../components/employee/EmployeeShell.jsx";
import { empLeads } from "../../data/employeeData.js";

const PAGE_SIZE = 10;

function go(path) {
  window.history.pushState({}, "", path);
  window.dispatchEvent(new Event("salesflow:navigate"));
}

export default function LeadListPage() {
 