import { empActivities, empContacts, empLeads, empTasks, wonLeads } from "../data/employeeData.js";
import { applyActivityWorkflow, getCalendarItems, markTaskDone } from "./leadWorkflowService.js";
import { exportLeadsCsv } from "./exportService.js";
import { getDueReminderTasks, markReminderSent, prepareReminderEmail } from "./reminderService.js";
import { safeValue, validateActivityForm, validateLeadForm } from "../utils/leadValidators.js";

function normalizeStatus(value = "") {
  return String(value).trim().toLowerCase();
}

function findLead(leads, leadIdOrName) {
  return leads.find((lead) => lead.id === leadIdOrName || lead.name === leadIdOrName) || null;
}

function normalizeLead(lead = {}) {
  return {
    ...lead,
    company: safeValue(lead.company),
    email: safeValue(lead.email),
    phone: safeValue(lead.phone),
    source: safeValue(lead.source),
    ownerName: safeValue(lead.ownerName || lead.owner),
    status: safeValue(lead.status, "New"),
  };
}

function normalizeTask(task = {}) {
  return {
    ...task,
    status: normalizeStatus(task.status) === "done" ? "done" : "pending",
    leadName: task.leadName || task.lead || "Not assign",
    dueAt: task.dueAt || task.due || "Not assign",
    title: task.title || "Not assign",
  };
}

function normalizeActivity(activity = {}) {
  return {
    ...activity,
    leadName: activity.leadName || activity.lead || "Not assign",
    description: activity.description || activity.desc || "Not assign",
    createdAt: activity.createdAt || activity.date || new Date().toISOString(),
  };
}

export function createEmployeeWorkflowState(seed = {}) {
  return {
    leads: (seed.leads || empLeads).map(normalizeLead),
    activities: (seed.activities || empActivities).map(normalizeActivity),
    tasks: (seed.tasks || empTasks).map(normalizeTask),
    contacts: seed.contacts || empContacts,
    wonLeads: seed.wonLeads || wonLeads,
  };
}

export function addLeadToWorkflow(state, lead, employee) {
  const errors = validateLeadForm(lead);
  if (Object.keys(errors).length) return { state, errors };

  const nextLead = normalizeLead({
    ...lead,
    id: lead.id || `lead-${Date.now()}`,
    ownerName: employee?.name || lead.ownerName || "Not assign",
    ownerEmail: employee?.email || lead.ownerEmail,
    ownerId: employee?.id || lead.ownerId,
    createdBy: employee?.name || "Not assign",
    createdAt: new Date().toISOString(),
  });

  return {
    state: {
      ...state,
      leads: [nextLead, ...state.leads],
      contacts: [
        {
          id: `contact-${Date.now()}`,
          name: nextLead.name,
          company: nextLead.company,
          email: nextLead.email,
          phone: nextLead.phone,
          role: safeValue(nextLead.role),
          status: nextLead.status === "Won" ? "Won" : "Active",
          lastContact: nextLead.createdAt,
        },
        ...state.contacts,
      ],
    },
    errors: {},
  };
}

export function addActivityToWorkflow(state, leadIdOrName, activity, employee) {
  const errors = validateActivityForm(activity);
  if (Object.keys(errors).length) return { state, errors };

  const lead = findLead(state.leads, leadIdOrName);
  if (!lead) return { state, errors: { lead: "Lead not found" } };

  const result = applyActivityWorkflow({
    lead,
    activities: state.activities.filter((item) => (item.leadId || item.leadName || item.lead) === (lead.id || lead.name)),
    tasks: state.tasks,
    activity: {
      ...activity,
      id: activity.id || `activity-${Date.now()}`,
      leadId: lead.id,
      leadName: lead.name,
    },
    employee,
  });

  const nextLeads = state.leads.map((item) => (item.id === lead.id ? normalizeLead(result.lead) : item));
  const otherActivities = state.activities.filter((item) => (item.leadId || item.leadName || item.lead) !== (lead.id || lead.name));
  const nextActivities = [...result.activities.map(normalizeActivity), ...otherActivities];

  return {
    state: {
      ...state,
      leads: nextLeads,
      activities: nextActivities,
      tasks: result.tasks.map(normalizeTask),
      wonLeads: nextLeads.filter((item) => item.status === "Won"),
    },
    errors: {},
  };
}

export function completeWorkflowTask(state, taskId) {
  return {
    ...state,
    tasks: markTaskDone(state.tasks, taskId).map(normalizeTask),
  };
}

export function getWorkflowCalendarItems(state) {
  return getCalendarItems(state.tasks);
}

export function getWorkflowReminderEmails(state, employee, now = new Date()) {
  const dueTasks = getDueReminderTasks(state.tasks, now);
  return dueTasks
    .map((task) => {
      const lead = findLead(state.leads, task.leadId || task.leadName);
      return prepareReminderEmail({ task, lead, employee });
    })
    .filter(Boolean);
}

export function markWorkflowReminderSent(state, taskId) {
  return {
    ...state,
    tasks: markReminderSent(state.tasks, taskId).map(normalizeTask),
  };
}

export function getWorkflowDashboardData(state) {
  const nowMonth = new Date().toISOString().slice(0, 7);
  const assignedLeads = state.leads;
  const today = new Date().toISOString().slice(0, 10);

  return {
    assignedLeads,
    totalAssigned: assignedLeads.length,
    todayFollowUps: state.tasks.filter((task) => String(task.dueAt).slice(0, 10) === today && task.status !== "done").slice(0, 5),
    overdueTasks: state.tasks.filter((task) => task.status !== "done" && task.dueAt && new Date(task.dueAt).getTime() < Date.now()),
    wonThisMonth: state.leads.filter((lead) => lead.status === "Won" && String(lead.updatedAt || lead.createdAt || "").startsWith(nowMonth)),
    recentLeads: assignedLeads.slice(0, 5),
    recentTasks: state.tasks.slice(0, 5),
    recentActivities: state.activities.slice(0, 5),
  };
}

export function getWorkflowContacts(state) {
  return state.contacts.map((contact) => ({
    ...contact,
    name: safeValue(contact.name),
    company: safeValue(contact.company),
    email: safeValue(contact.email),
    phone: safeValue(contact.phone),
    status: safeValue(contact.status),
  }));
}

export function exportWorkflowLeads(state) {
  return exportLeadsCsv(state.leads.map(normalizeLead));
}

export function exportWorkflowWonLeads(state) {
  return exportLeadsCsv(state.leads.filter((lead) => lead.status === "Won").map(normalizeLead));
}
