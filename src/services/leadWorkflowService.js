import { calculateLeadScore } from "../utils/leadScore.js";

const TASK_TYPES = {
  NOT_CONNECTED: "not_connected",
  DEMO_BOOKED: "demo_booked",
  FOLLOW_UP: "follow_up",
  POST_DEMO_FOLLOW_UP: "post_demo_follow_up",
};

const normalize = (value = "") => String(value).trim().toLowerCase();

export function createTaskFromActivity({ lead, activity, employee }) {
  const type = normalize(activity.type || activity.status || activity.title);
  const baseTask = {
    id: `task-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    leadId: lead?.id,
    leadName: lead?.name,
    employeeId: employee?.id || lead?.ownerId,
    employeeEmail: employee?.email || lead?.ownerEmail,
    employeeName: employee?.name || lead?.ownerName || "Not assign",
    status: "pending",
    createdAt: new Date().toISOString(),
    reminderMinutesBefore: 15,
  };

  if (type.includes("not connected") || type.includes("not_connected")) {
    return {
      ...baseTask,
      type: TASK_TYPES.NOT_CONNECTED,
      title: "Reconnect lead",
      dueAt: activity.nextFollowUpAt || activity.dueAt || activity.createdAt || new Date().toISOString(),
      showInCalendar: false,
    };
  }

  if (type.includes("demo book") || type.includes("demo_book") || type.includes("demo scheduled")) {
    return {
      ...baseTask,
      type: TASK_TYPES.DEMO_BOOKED,
      title: "Demo booked",
      dueAt: activity.demoAt || activity.dueAt,
      showInCalendar: true,
    };
  }

  if (type.includes("post demo") || type.includes("post_demo")) {
    return {
      ...baseTask,
      type: TASK_TYPES.POST_DEMO_FOLLOW_UP,
      title: "Post demo follow-up",
      dueAt: activity.followUpAt || activity.dueAt,
      showInCalendar: true,
    };
  }

  if (type.includes("follow")) {
    return {
      ...baseTask,
      type: TASK_TYPES.FOLLOW_UP,
      title: "Follow-up",
      dueAt: activity.followUpAt || activity.dueAt,
      showInCalendar: true,
    };
  }

  return null;
}

export function applyActivityWorkflow({ lead, activities = [], tasks = [], activity, employee }) {
  const nextActivities = [{ ...activity, createdAt: activity.createdAt || new Date().toISOString() }, ...activities];
  let nextTasks = [...tasks];
  const type = normalize(activity.type || activity.status || activity.title);

  const task = createTaskFromActivity({ lead, activity, employee });
  if (task) nextTasks = [task, ...nextTasks];

  if (type.includes("post demo") || type.includes("post_demo")) {
    nextTasks = nextTasks.map((item) => {
      if (item.leadId === lead?.id && item.type === TASK_TYPES.DEMO_BOOKED && item.status !== "done") {
        return { ...item, status: "done", completedAt: new Date().toISOString(), autoCompleted: true };
      }
      return item;
    });
  }

  const nextLead = {
    ...lead,
    status: activity.nextLeadStatus || lead?.status,
    score: calculateLeadScore(nextActivities),
    updatedAt: new Date().toISOString(),
  };

  return { lead: nextLead, activities: nextActivities, tasks: nextTasks };
}

export function markTaskDone(tasks = [], taskId) {
  return tasks.map((task) => {
    if (task.id !== taskId) return task;
    return { ...task, status: "done", completedAt: new Date().toISOString(), manualCompleted: true };
  });
}

export function getCalendarItems(tasks = []) {
  return tasks.filter((task) => task.showInCalendar && task.status !== "done");
}

export { TASK_TYPES };
