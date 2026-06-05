import { useEffect, useMemo, useState } from 'react';
import DashboardSidebar from '../../components/dashboard/DashboardSidebar.jsx';
import { getLead as getMockLead } from './leadsData.js';
import { getLead as getRealLead, isBackendConfigured, listActivities, listTasks } from '../../services/crmApi.js';

const SIDEBAR = 300;
function goBack(){ window.history.pushState({}, '', '/leads'); window.dispatchEvent(new Event('salesflow:navigate')); }
function initials(name='Lead'){ return name.split(' ').