import { useEffect, useMemo, useState } from 'react';
import DashboardSidebar from '../../components/dashboard/DashboardSidebar.jsx';
import { getLead as getMockLead } from './leadsData.js';
import { getLead as getRealLead, isBackendConfigured, listActivities, listTasks } from '../../services/crmApi.js';
import './LeadDetailPageLayout.css';

function role(){const r=localStorage.getItem('salesflowRole