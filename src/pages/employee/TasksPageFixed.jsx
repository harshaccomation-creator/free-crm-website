import { useState } from 'react';
import DashboardSidebar from '../../components/dashboard/DashboardSidebar.jsx';
import { CrmEmptyState } from '../../components/crm/CrmUiStates.jsx';
import '../../styles/crmFixedPageShell.css';

const demoTasks = [
  { id: 1, title: 'Follow up with lead', lead: 'Website Lead', type: 'Call', status: 'Today', time: '05:00 PM' },
  { id: 2, title: 'Demo reminder', lead: 'CRM Prospect', type: 'Demo', status: 'Overdue', time: '11:30 AM' },
];

export default function TasksPageFixed() {
  const [tasks] = useState(demoTasks);
  const [loading] = useState(false);
  const today = tasks.filter((task) => task.status === 'Today');
  const overdue = tasks.filter((task) => task.status === 'Overdue');

  const renderTask = (task) => (
    <div className="sf-task-row" key={task.id}>
      <span className={task.status === 'Overdue' ? 'danger' : ''} />
      <div><strong>{task.title}</strong><small>{task.lead} • {task.type}</small></div>
      <em>{task.time}</em>
      <button type="button">Done</button>
    </div>
  );

  return (
    <div className="sf-tasks-page">
      <DashboardSidebar role="employee" />
      <main className="sf-tasks-main">
        <div className="sf-tasks-container">
          <header className="sf-tasks-head">
            <div>
              <span className="sf-tasks-kicker">Employee Workspace</span>
              <h1>Tasks</h1>
              <p>Today&apos;s tasks and overdue follow-ups in one clean view.</p>
            </div>
            <button className="sf-fixed-btn" type="button">+ Add Task</button>
          </header>

          <section className="sf-tasks-stats">
            <article className="sf-tasks-card sf-tasks-stat"><span className="sf-tasks-dot">✓</span><div><p>Today Tasks</p><strong>{loading ? '…' : today.length}</strong></div></article>
            <article className="sf-tasks-card sf-tasks-stat"><span className="sf-tasks-dot">!</span><div><p>Overdue</p><strong>{loading ? '…' : overdue.length}</strong></div></article>
            <article className="sf-tasks-card sf-tasks-stat"><span className="sf-tasks-dot">☎</span><div><p>Calls</p><strong>{loading ? '…' : tasks.filter((t) => t.type === 'Call').length}</strong></div></article>
            <article className="sf-tasks-card sf-tasks-stat"><span className="sf-tasks-dot">#</span><div><p>Total Tasks</p><strong>{loading ? '…' : tasks.length}</strong></div></article>
          </section>

          <section className="sf-tasks-grid">
            <article className="sf-tasks-card">
              <h2>Today</h2>
              {today.length ? today.map(renderTask) : (
                <CrmEmptyState title="No tasks for today" text="You're clear for today. Schedule a follow-up when ready." icon="✓" />
              )}
            </article>
            <article className="sf-tasks-card">
              <h2>Overdue</h2>
              {overdue.length ? overdue.map(renderTask) : (
                <CrmEmptyState title="No overdue tasks" text="Great work — nothing overdue right now." icon="🎉" />
              )}
            </article>
          </section>
        </div>
      </main>
    </div>
  );
}
