import { useEffect, useRef, useState } from 'react';
import DashboardSidebar from '../../components/dashboard/DashboardSidebar.jsx';

function applyLayout(mainRef) {
  const main = mainRef.current;
  if (!main) return;
  if (window.innerWidth > 1200) {
    main.style.setProperty('margin-left', '310px', 'important');
    main.style.setProperty('width', 'calc(100vw - 310px)', 'important');
    main.style.setProperty('max-width', 'calc(100vw - 310px)', 'important');
    main.style.setProperty('padding', '16px 24px 32px', 'important');
  } else {
    main.style.setProperty('margin-left', '0', 'important');
    main.style.setProperty('width', '100%', 'important');
    main.style.setProperty('max-width', '100%', 'important');
    main.style.setProperty('padding', '14px', 'important');
  }
}

const demoTasks = [
  { id: 1, title: 'Follow up with lead', lead: 'Website Lead', type: 'Call', status: 'Today', time: '05:00 PM' },
  { id: 2, title: 'Demo reminder', lead: 'CRM Prospect', type: 'Demo', status: 'Overdue', time: '11:30 AM' },
];

export default function TasksPageFixed() {
  const mainRef = useRef(null);
  const [tasks] = useState(demoTasks);
  const today = tasks.filter((task) => task.status === 'Today');
  const overdue = tasks.filter((task) => task.status === 'Overdue');

  useEffect(() => {
    applyLayout(mainRef);
    const onResize = () => applyLayout(mainRef);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const renderTask = (task) => (
    <div className="sf-task-row" key={task.id}>
      <span className={task.status === 'Overdue' ? 'danger' : ''} />
      <div><strong>{task.title}</strong><small>{task.lead} • {task.type}</small></div>
      <em>{task.time}</em>
      <button type="button">Done</button>
    </div>
  );

  return (
    <div className="sf-fixed-shell">
      <style>{`
        @media(min-width:1201px){.sf-fixed-shell>.sfx-sidebar{position:fixed!important;left:0!important;top:0!important;bottom:0!important;width:310px!important;min-width:310px!important;max-width:310px!important;z-index:1000!important}}
        @media(max-width:1200px){.sf-fixed-shell>.sfx-sidebar{position:relative!important;width:100%!important;min-width:0!important;max-width:none!important;height:auto!important}}
        .sf-fixed-shell{min-height:100vh;background:#f6f9ff;color:#071633;overflow-x:hidden;font-family:Inter,system-ui,sans-serif}.sf-fixed-main{box-sizing:border-box;min-height:100vh;overflow-x:hidden}.sf-fixed-container{max-width:1080px;width:100%;margin:0}.sf-fixed-head{display:flex;align-items:center;justify-content:space-between;gap:14px;margin-bottom:12px}.sf-fixed-kicker{display:inline-flex;padding:5px 9px;border-radius:999px;background:#eaf2ff;color:#2563eb;font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.06em}.sf-fixed-head h1{margin:6px 0 3px;font-size:24px;line-height:1.08;letter-spacing:-.04em}.sf-fixed-head p{margin:0;color:#64748b;font-size:13px}.sf-fixed-btn{border:0;border-radius:13px;background:linear-gradient(135deg,#2563eb,#7c3aed);color:#fff;font-weight:850;padding:10px 16px;box-shadow:0 12px 26px rgba(37,99,235,.16);font-size:13px}.sf-fixed-stats{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;margin-bottom:14px}.sf-fixed-card{background:#fff;border:1px solid #dce8f8;border-radius:18px;box-shadow:0 12px 28px rgba(15,23,42,.055);padding:14px;min-width:0}.sf-fixed-stat{display:flex;gap:12px;align-items:center;min-height:68px}.sf-fixed-dot{width:42px;height:42px;border-radius:14px;display:grid;place-items:center;background:#eef5ff;color:#2563eb;font-weight:900}.sf-fixed-stat p{margin:0 0 4px;color:#64748b;font-size:12px;font-weight:800}.sf-fixed-stat strong{font-size:22px;line-height:1}.sf-task-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}.sf-task-grid h2{font-size:21px;margin:0 0 14px}.sf-task-row{display:grid;grid-template-columns:22px minmax(0,1fr) auto auto;gap:10px;align-items:center;padding:10px 0;border-bottom:1px solid #edf3fb}.sf-task-row>span{width:16px;height:16px;border-radius:6px;background:#dbeafe}.sf-task-row>span.danger{background:#fee2e2}.sf-task-row strong{display:block;font-size:13px}.sf-task-row small{display:block;color:#64748b;font-size:11.5px;margin-top:2px}.sf-task-row em{font-style:normal;background:#eef5ff;color:#2563eb;border-radius:999px;padding:6px 9px;font-size:11.5px;font-weight:850;white-space:nowrap}.sf-task-row button{border:1px solid #dce8f8;border-radius:11px;background:#fff;padding:7px 11px;font-weight:850;font-size:12px}@media(max-width:900px){.sf-fixed-stats,.sf-task-grid{grid-template-columns:1fr 1fr}}@media(max-width:640px){.sf-fixed-head{align-items:flex-start;flex-direction:column}.sf-fixed-stats,.sf-task-grid{grid-template-columns:1fr}.sf-fixed-btn{width:100%}.sf-task-row{grid-template-columns:24px minmax(0,1fr)}}
      `}</style>
      <DashboardSidebar role="employee" />
      <main ref={mainRef} className="sf-fixed-main">
        <div className="sf-fixed-container">
          <header className="sf-fixed-head">
            <div>
              <span className="sf-fixed-kicker">Employee Workspace</span>
              <h1>Tasks</h1>
              <p>Today tasks and overdue follow-ups in one clean view.</p>
            </div>
            <button className="sf-fixed-btn" type="button">+ Add Task</button>
          </header>
          <section className="sf-fixed-stats">
            <article className="sf-fixed-card sf-fixed-stat"><span className="sf-fixed-dot">✓</span><div><p>Today Tasks</p><strong>{today.length}</strong></div></article>
            <article className="sf-fixed-card sf-fixed-stat"><span className="sf-fixed-dot">!</span><div><p>Overdue</p><strong>{overdue.length}</strong></div></article>
            <article className="sf-fixed-card sf-fixed-stat"><span className="sf-fixed-dot">☎</span><div><p>Calls</p><strong>{tasks.filter((t)=>t.type==='Call').length}</strong></div></article>
            <article className="sf-fixed-card sf-fixed-stat"><span className="sf-fixed-dot">#</span><div><p>Total Tasks</p><strong>{tasks.length}</strong></div></article>
          </section>
          <section className="sf-task-grid">
            <article className="sf-fixed-card"><h2>Today</h2>{today.length ? today.map(renderTask) : <p>No tasks for today.</p>}</article>
            <article className="sf-fixed-card"><h2>Overdue</h2>{overdue.length ? overdue.map(renderTask) : <p>No overdue tasks.</p>}</article>
          </section>
        </div>
      </main>
    </div>
  );
}
