import { useEffect, useMemo, useState } from 'react';
import DashboardSidebar from '../../components/dashboard/DashboardSidebar.jsx';
import { getLead as getMockLead } from './leadsData.js';
import { getLead as getRealLead, isBackendConfigured, listActivities, listTasks } from '../../services/crmApi.js';

const SIDEBAR = 300;
const css = {
  page:{display:'grid',gridTemplateColumns:`${SIDEBAR}px minmax(0,