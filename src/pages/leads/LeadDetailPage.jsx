import DashboardSidebar from '../../components/dashboard/DashboardSidebar.jsx';

function goBack(){window.history.pushState({},'','/leads');window.dispatchEvent(new Event('salesflow:navigate'));}

export default function LeadDetailPage(){
  return <div style={{display:'grid',gridTemplateColumns:'300px 1fr',minHeight:'100vh',background:'#f5f8fc'}}><DashboardSidebar role="employee"/><main style={{gridColumn:2,padding:'24