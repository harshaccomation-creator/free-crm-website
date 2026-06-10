export function getReminderAt(dueAt, minutesBefore = 15) {
  if (!dueAt) return null;
  const dueTime = new Date(dueAt).getTime();
  if (Number.isNaN(dueTime)) return null;
  return new Date(dueTime - minutesBefore * 60 * 1000).toISOString();
}

export function prepareReminderEmail({ task, lead, employee }) {
  const to = task?.employeeEmail || employee?.email || lead?.ownerEmail;
  if (!to) return null;

  return {
    to,
    subject: `Reminder: ${task.title || "Lead task"} in 15 minutes`,
    body: [
      `Hello ${task.employeeName || employee?.name || "Team"},`,
      "",
      `This is a reminder for: ${task.title || "Lead task"}`,
      `Lead: ${task.leadName || lead?.name || "Not assign"}`,
      `Due time: ${task.dueAt || "Not assign"}`,
      "",
      "Please complete or update the task in SalesFlow CRM.",
    ].join("\n"),
  };
}

export function getDueReminderTasks(tasks = [], now = new Date()) {
  const currentTime = new Date(now).getTime();

  return tasks.filter((task) => {
    if (task.status === "done" || task.reminderSentAt) return false;
    const reminderAt = getReminderAt(task.dueAt, task.reminderMinutesBefore || 15);
    if (!reminderAt) return false;
    return new Date(reminderAt).getTime() <= currentTime;
  });
}

export function markReminderSent(tasks = [], taskId) {
  return tasks.map((task) => {
    if (task.id !== taskId) return task;
    return { ...task, reminderSentAt: new Date().toISOString() };
  });
}
