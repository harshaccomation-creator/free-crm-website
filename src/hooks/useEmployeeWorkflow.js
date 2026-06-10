import { useMemo, useState } from "react";

const emptyWorkflowState = {
  leads: [],
  tasks: [],
  activities: [],
  contacts: [],
  wonLeads: [],
};

function disabledResult(message) {
  return {
    state: emptyWorkflowState,
    errors: { supabase: message },
  };
}

export function useEmployeeWorkflow() {
  const [workflowState, setWorkflowState] = useState(emptyWorkflowState);

  const dashboardData = useMemo(() => ({
    totalLeads: 0,
    todayFollowUps: 0,
    wonLeads: 0,
    overdue: 0,
  }), []);

  const addLead = () => disabledResult("Legacy local workflow disabled. Use Supabase lead APIs.");
  const addActivity = () => disabledResult("Legacy local workflow disabled. Use Supabase activity APIs.");
  const completeTask = () => disabledResult("Legacy local workflow disabled. Use Supabase task APIs.");
  const getReminderEmails = () => [];
  const markReminderSent = () => disabledResult("Legacy local workflow disabled. Use Supabase reminder APIs.");

  return {
    workflowState,
    setWorkflowState,
    leads: [],
    tasks: [],
    activities: [],
    contacts: [],
    wonLeads: [],
    dashboardData,
    calendarItems: [],
    leadCsv: "",
    wonCsv: "",
    addLead,
    addActivity,
    completeTask,
    getReminderEmails,
    markReminderSent,
  };
}

export default useEmployeeWorkflow;
