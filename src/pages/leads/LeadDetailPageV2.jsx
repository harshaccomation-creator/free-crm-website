import DashboardSidebar from '../../components/dashboard/DashboardSidebar.jsx';
import { getLead as getMockLead } from './leadsData.js';

const S = 300;
function nav(path){ window.history.pushState({},'',path); window.dispatchEvent(new Event('salesflow:navigate')); }
function initials(name='Lead'){ return String(name).split(' ').map(x=>x[0]).join('').slice(0,2).toUpperCase() || 'LD