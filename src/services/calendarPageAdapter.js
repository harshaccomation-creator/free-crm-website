import { createActivityPageState, saveActivityPageState } from "./activityPageAdapter.js";

function parseDate(value) {
  const date = new Date(value || "");
  return Number.isNaN(date.getTime()) ? null : date;
}

function isCalendarTask(task = {}) {
  const text = `${task.type || ""} ${task.title || ""}`.toLowerCase();
  if (text.includes("not_connected") || text.includes("not connected")) return false;
  return text.includes("demo") || text.includes("follow");
}

export function getCalendarPageState() {
  return createActivityPageState();
}

export function workflowTasksToCalendarEvents(state) {
  return (state.tasks || [])
    .filter((task) => task.status !== "done")
    .filter(isCalendarTask)
    .map((task) => {
      const due = parseDate(task.dueAt || task.due);
      if (!due) return null;
      const typeText = `${task.type || ""} ${task.title || ""}`.toLowerCase().includes("demo") ? "Demo" : "Follow-up";
      return {
        ...task,
        id: task.id,
        date: due.toISOString().slice(0, 10),
        day: due.getDate(),
        title: task.title || `${typeText} with ${task.leadName || task.lead || "Not assigned"}`,
        leadId: task.leadId || task.leadName || task.lead || "Not assigned",
        leadName: task.leadName || task.lead || "Not assigned",
        type: typeText,
        time: due.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true }),
        source: "Lead Activity",
        note: task.note || task.description || "Created from lead activity."
      };
    })
    .filter(Boolean);
}

export function addCalendarEventToWorkflow(state, event) {
  const dueAt = new Date(`${event.date}T${event.time || "09:00"}`).toISOString();
  const type = event.type === "Demo" ? "Demo Booked" : "Follow-up";
  const nextTask = {
    id: `calendar-${Date.now()}`,
    title: `${event.type} with ${event.leadName}`,
    leadId: event.leadId,
    leadName: event.leadName,
    type,
    status: "pending",
    dueAt,
    note: event.note || `${event.type} scheduled from calendar.`,
    description: event.note || `${event.type} scheduled from calendar.`,
    reminderMinutesBefore: 15,
    showInCalendar: true,
    createdAt: new Date().toISOString(),
    ownerId: event.ownerId,
    ownerName: event.ownerName,
    ownerEmail: event.ownerEmail,
    companyId: event.companyId,
    createdById: event.createdById,
    createdBy: event.createdBy
  };
  const next = { ...state, tasks: [nextTask, ...(state.tasks || [])] };
  saveActivityPageState(next);
  return next;
}
