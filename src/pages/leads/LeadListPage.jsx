import AddLeadModal from "../../components/employee/AddLeadModal";
import { useMemo, useState } from "react";
import { Search, Filter, Plus, Users, TrendingUp, AlertCircle, Trophy, Eye, Edit3, Trash2, Download } from "lucide-react";
import EmployeeShell from "../../components/employee/EmployeeShell.jsx";
import { empLeads } from "../../data/employeeData.js";

const PER_PAGE = 10;
const tabs = ["All", "New", "Contacted", "Qualified