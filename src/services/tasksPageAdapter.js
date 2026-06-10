import { completeWorkflowTask } from "./employeeWorkflowStore.js";
import { createActivityPageState, saveActivityPageState } from "./activityPageAdapter.js";

const asDate = (value) => {
  const date = new Date(value || "");
  return Number.isNaN(date.getTime()) ? null : date;
};

const statusFromDue = (task) => {
  if (task.status === "done") return "done";
  const date = asDate(task.dueAt || task.due);
  if (!date) return "incoming";
  const today = new Date().toISOString().slice(0, 10);
  const dueDay = date.toISOString().slice(0, 10);
  if (date.getTime() < Date.now() && dueDay !== today) return "overdue";
  if (dueDay === today) return "today";
  return "incoming";
};

const dateKeyFromDue = (value) => {
  const date = asDate(value);
  if (!date) return "incoming";
  const now = new Date();
  const dueDay = date.toISOString().slice(0, 10);
  const today = now.toISOString().slice(0, 10);
  const tomorrow = new Date(now.getTime() + 86400000).toISOString().slice(0, 10);
  const yesterday = new Date(now.getTime() - 86400000).toISOString().slice(0, 10);
  if (dueDay === today) return "today";
  if (dueDay === tomorrow) return "tomorrow";
  if (dueDay === yesterday) return "yesterday";
  return "incoming";
};

const formatDue = (value) => {
  const date = asDate(value);
  if (!date) return value || "Not assign";
  return date.toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit", hour12: true });
};

export function getTasksPageState() {
  return createActivityPageState();
}

export function workflowTasksToPageTasks(state, fallback = []) {
  const pending = (state.tasks || []).filter((task) => task.status !== "done");
  const rows = pending.length ? pending : fallback;
  return rows.map((task) => {
    const dueAt = task.dueAt || task.due;
    return {
      ...task,
      id: task.id,
      title: task.title || "Not assign",
      lead: task.leadName || task.lead || "Not assign",
      type: task.type || "Task",
      due: formatDue(dueAt),
      dateKey: dateKeyFromDue(dueAt),
      dueDate: asDate(dueAt) ? asDate(dueAt).toISOString().slice(0, 10) : "",
      status: statusFromDue(task),
      reason: task.reason || task.description || task.note || "Created from lead activity",
      note: task.note || task.description || "Not assign",
    };
  });
}

export function markWorkflowTaskDone(state, taskId) {
  const next = completeWorkflowTask(state, taskId);
  saveActivityPageState(next);
  return next;
}
