import { useEffect, useMemo, useState } from 'react';
import DashboardSidebar from '../../components/dashboard/DashboardSidebar.jsx';
import { isBackendConfigured, listActivities } from '../../services/crmApi.js';
import './EmployeePages.css';
import './EmployeePagesLayoutFix.css';
import { CrmEmptyState, CrmLoadingPanel } from '../../components/crm/CrmUiStates.jsx';

const demoActivities = [
  { stage