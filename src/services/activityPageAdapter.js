import { createEmployeeWorkflowState, addActivityToWorkflow } from "./employeeWorkflowStore.js";

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

export function createActivityPageState(seed) {
  return createEmployeeWorkflowState(seed);
}

export function applyQuickActivity(state, label, employee) {
  const template = quickActivityTemplates[label];
  if (!template) return { state, errors: { activity: "Invalid activity" } };

  return addActivityToWorkflow(
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
}

export function getLeadTimelineItems(state, lead = defaultActivityLead) {
  return state.activities.filter((activity) => {
    const key = activity.leadId || activity.leadName || activity.lead;
    return key === lead.id || key === lead.name;
  });
}
