import { useEffect, useMemo, useState } from 'react';
import DashboardSidebar from '../../components/dashboard/DashboardSidebar.jsx';
import { getLead as getMockLead } from './leadsData.js';
import { getLead as getRealLead, isBackendConfigured, listActivities, listTasks } from '../../services/crmApi.js';
import { Phone, Mail, MapPin, Calendar, MessageCircle, CheckSquare, Activity, Plus, Briefcase, User, Share2, Edit3, ArrowLeft } from 'lucide-react';

function getCurrentRole(){