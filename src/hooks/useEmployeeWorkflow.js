import { useMemo, useState } from "react";
import {
  addActivityToWorkflow,
  addLeadToWorkflow,
  completeWorkflowTask,
  createEmployeeWorkflowState,
  exportWorkflowLeads,
  exportWorkflowWonLeads,
  getWorkflowCalendarItems,
  getWorkflowContacts,
  getWorkflowDashboardData,
  getWorkflowReminderEmails,
  markWorkflowReminderSent,
} from "../services/employeeWorkflowStore.js";

export function useEmployeeWorkflow(employee = {}) {
  const [workflowState, setWorkflowState] = useState(() => createEmployeeWorkflowState());

  const dashboardData = useMemo(() => getWorkflowDashboardData(workflowState), [workflowState]);
  const calendarItems = useMemo(() => getWorkflowCalendarItems(workflowState), [workflowState]);
  const contacts = useMemo(() => getWorkflowContacts(workflowState), [workflowState]);
  const leadCsv = useMemo(() => exportWorkflowLeads(workflowState), [workflowState]);
  const wonCsv = useMemo(() => exportWorkflowWonLeads(workflowState), [workflowState]);

  const addLead = (lead) => {
    const result = addLeadToWorkflow(workflowState, lead, employee);
    if (!Object.keys(result.errors || {}).length) setWorkflowState(result.state);
    return result;
  };

  const addActivity = (leadIdOrName, activity) => {
    const result = addActivityToWorkflow(workflowState, leadIdOrName, activity, employee);
    if (!Object.keys(result.errors || {}).length) setWorkflowState(result.state);
    return result;
  };

  const completeTask = (taskId) => {
    setWorkflowState((current) => completeWorkflowTask(current, taskId));
  };

  const getReminderEmails = (now = new Date()) => getWorkflowReminderEmails(workflowState, employee, now);

  const markReminderSent = (taskId) => {
    setWorkflowState((current) => markWorkflowReminderSent(current, taskId));
  };

  return {
    workflowState,
    setWorkflowState,
    leads: workflowState.leads,
    tasks: workflowState.tasks,
    activities: workflowState.activities,
    contacts,
    wonLeads: workflowState.wonLeads,
    dashboardData,
    calendarItems,
    leadCsv,
    wonCsv,
    addLead,
    addActivity,
    completeTask,
    getReminderEmails,
    markReminderSent,
  };
}

export default useEmployeeWorkflow;
