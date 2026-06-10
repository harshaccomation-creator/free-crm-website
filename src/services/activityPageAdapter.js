import { createEmployeeWorkflowState, addActivityToWorkflow } from "./employeeWorkflowStore.js";

const STORAGE_KEY = "salesflow_employee_workflow_state";

export const defaultActivityLead = {
  id: "L002",
  name: "Priya Sharma",
  company: "Sharma Textiles",
  source: "Website Lead",
  ownerName: "Jayraj",
  status: "Contacted",
};

export const quickActivityTemplates = {
  "Add Note": {
    type: "Note",
    title: "Note added",
    description: "Employee added a lead note.",
  },
  "Log Call": {
    type: "Call Connected",
    title: "Call connected",
    description: "Call connected with lead.",
  },
  "Add Task": {
    type: "Not Connected",
    title: "Not connected task created",
    description: "Lead was not connected. Reconnect task created.",
  },
  "Follow-up": {
    type: "Follow-up",
    title: "Follow-up scheduled",
    description: "Follow-up task created for lead.",
  },
};

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function saveActivityPageState(state) {
  if (!canUseStorage()) return state;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.warn("SalesFlow workflow state save failed", error);
  }
  return state;
}

export function createActivityPageState(seed) {
  if (canUseStorage()) {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch (error) {
      console.warn("SalesFlow workflow state load failed", error);
    }
  }
  const state = createEmployeeWorkflowState(seed);
  saveActivityPageState(state);
  return state;
}

export function applyQuickActivity(state, label, employee) {
  const template = quickActivityTemplates[label];
  if (!template) return { state, errors: { activity: "Invalid activity" } };

  const result = addActivityToWorkflow(
    state,
    defaultActivityLead.id,
    {
      ...template,
      leadId: defaultActivityLead.id,
      leadName: defaultActivityLead.name,
      createdAt: new Date().toISOString(),
      dueAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      followUpAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      nextFollowUpAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    },
    employee
  );

  if (!Object.keys(result.errors || {}).length) saveActivityPageState(result.state);
  return result;
}

export function updateActivityPageState(updater) {
  const current = createActivityPageState();
  const next = typeof updater === "function" ? updater(current) : updater;
  return saveActivityPageState(next);
}

export function getLeadTimelineItems(state, lead = defaultActivityLead) {
  return state.activities.filter((activity) => {
    const key = activity.leadId || activity.leadName || activity.lead;
    return key === lead.id || key === lead.name;
  });
}

export { STORAGE_KEY };
