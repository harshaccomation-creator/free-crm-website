import { useEffect, useState } from 'react';
import DashboardSidebar from '../../components/dashboard/DashboardSidebar.jsx';
import { getLead as getMockLead } from './leadsData.js';
import { getLead as getRealLead, isBackendConfigured, listActivities, listTasks } from '../../services/crmApi.js';

const S=300;
const c={card:{background:'#fff',border:'1px solid #e5eaf2',borderRadius:22,boxShadow:'0 14px 34px rgba(15,23,42,.07)'},btn:{height:38,border:'1px solid #e5eaf2',borderRadius:12,background:'#fff',padding:'0 14px',fontWeight:800,c