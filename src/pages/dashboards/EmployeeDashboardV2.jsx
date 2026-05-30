import { useMemo, useState } from 'react';
import DashboardSidebar from '../../components/dashboard/DashboardSidebar.jsx';
import '../../styles/dashboardBase.css';
import '../../styles/sidebarGlobalFinalLock.css';
import '../../styles/zzzSidebarBlackFix.css';
import '../../styles/employeeDashboardV2.css';

export default function EmployeeDashboardV2() {
  const [search, setSearch] = useState('');
  return <div className="sf-dashboard employee-v2-page emp-mock-dashboard"><DashboardSidebar role="employee" /><main className="employee-v2-main"><header className="employee-topbar"><label className="employee-search"><input value={search} onChange={(e)=>setSearch(e.target.value)} placeholder="Search leads..." /></label></header><section className="employee-kpis"><button className="kpi-card blue"><strong>128</strong><span>Assigned Leads</span></button></section></main></div>;
}
