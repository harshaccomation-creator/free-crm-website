import { useState } from "react";
import { Search, Plus, Phone, MessageCircle, Mail, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import EmployeeShell from "../../components/employee/EmployeeShell.jsx";
import { empLeads } from "../../data/employeeData.js";

const LEADS_PER_PAGE = 10;

function go(path) {
  window.history.pushState({}, "", path);
  window.dispatchEvent(new Event("sales