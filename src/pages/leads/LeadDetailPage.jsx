import {useEffect,useState} from 'react';
import DashboardSidebar from '../../components/dashboard/DashboardSidebar.jsx';
import {getLead as getMockLead} from './leadsData.js';
import {getLead as getRealLead,isBackendConfigured} from '../../services/crmApi.js';

function role(){const r=localStorage.getItem('salesflowRole')||localStorage.getItem('salesflow_user_role');return r||'employee'}
function initials