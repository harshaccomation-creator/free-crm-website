import { useEffect, useState } from 'react';
import DashboardSidebar from '../../components/dashboard/DashboardSidebar.jsx';
import { getLead, listActivities, listTasks } from '../../services/crmApi.js';

const page={display:'grid',gridTemplateColumns:'300px minmax(0,1fr)',minHeight:'100vh',background:'#f5f8fc',color:'#0f172a'};
const main={padding:'22px 28px 36px',minWidth:0,boxSizing:'border-box'};
const card={background