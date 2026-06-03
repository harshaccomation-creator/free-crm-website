import { useEffect, useMemo, useState } from 'react';
import DashboardSidebar from '../../components/dashboard/DashboardSidebar.jsx';
import { isBackendConfigured, listLeads, listTasks } from '../../services/crmApi.js';
import './EmployeePages.css';
import './EmployeePagesLayoutFix.css';
import './EmployeeReportsPremiumFix.css';
import './EmployeeCalendarClickFix.css';
import { CrmEmptyState, CrmLoadingPanel } from '../../components/crm/CrmUiStates.jsx';

function Shell({ title, subtitle, children, actions }) {
  return <div className="emp-page"><DashboardSidebar role="employee" /><main className="emp-main"><div className="emp-container"><header className="emp-head"><div><span className="emp-kicker">Employee Workspace</span><h1>{title}</h1><p>{subtitle}</p></div><div className="emp-actions">{actions}</div></header>{children}</div></main></div>;
}

function formatDate(value) {
  const date = value ? new Date(value) : null;
  if (!date || Number.isNaN(date.getTime())) return '-';
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatTime(value) {
  const date = value ? new Date(value) : null;
  if (!date || Number.isNaN(date.getTime())) return '-';
  return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
}

function isSameMonth(value, now = new Date()) {
  const date = value ? new Date(value) : null;
  if (!date || Number.isNaN(date.getTime())) return false;
  return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth();
}

function normalizeTaskEvent(task) {
  const due = task.due_at || task.dueAt;
  return {
    id: `task-${task.id}`,
    title: task.title || 'Task',
    lead: task.lead?.name || task.lead || 'Task',
    leadId: task.lead_id || task.lead?.id || null,
    dateTime: due,
    date: formatDate(due),
    time: formatTime(due),
    tone: task.status === 'Overdue' ? 'orange' : task.status === 'Completed' ? 'green' : '',
    source: 'Task',
  };
}

function normalizeLeadEvents(lead) {
  const events = [];
  const leadName = lead.name || 'Lead';
  const followUpAt = lead.next_follow_up || lead.follow_up_at || lead.nextFollowUp;
  const demoAt = lead.demo_at || lead.demoAt;
  if (followUpAt) {
    events.push({
      id: `lead-follow-${lead.id}`,
      title: `Follow-up: ${leadName}`,
      lead: leadName,
      leadId: lead.id,
      dateTime: followUpAt,
      date: formatDate(followUpAt),
      time: formatTime(followUpAt),
      tone: 'green',
      source: 'Lead Follow-up',
    });
  }
  if (demoAt) {
    events.push({
      id: `lead-demo-${lead.id}`,
      title: `Demo: ${leadName}`,
      lead: leadName,
      leadId: lead.id,
      dateTime: demoAt,
      date: formatDate(demoAt),
      time: formatTime(demoAt),
      tone: 'green',
      source: 'Lead Demo',
    });
  }
  return events;
}

function goToLead(event) {
  if (!event?.leadId) return;
  window.history.pushState({}, '', `/leads/${event.leadId}`);
  window.dispatchEvent(new Event('salesflow:navigate'));
}

function useCalendarEvents() {
  const [events, setEvents] = useState([]);
  const [isLive, setIsLive] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(Boolean(isBackendConfigured));

  useEffect(() => {
    let alive = true;
    async function load() {
      if (!isBackendConfigured) {
        setLoading(false);
        setMessage('Demo mode: Supabase env missing.');
        return;
      }
      try {
        setLoading(true);
        const [tasks, leads] = await Promise.all([listTasks({ limit: 300 }), listLeads({ limit: 500 })]);
        if (!alive) return;
        const taskEvents = (tasks || []).map(normalizeTaskEvent).filter((event) => event.dateTime);
        const leadEvents = (leads || []).flatMap(normalizeLeadEvents).filter((event) => event.dateTime);
        const allEvents = [...taskEvents, ...leadEvents].sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));
        setEvents(allEvents);
        setIsLive(true);
        setMessage(allEvents.length ? 'Live Supabase connected.' : 'Live Supabase connected. No schedules found yet.');
      } catch (error) {
        if (!alive) return;
        setIsLive(false);
        setMessage(`Demo mode: ${error.message}`);
      } finally {
        if (alive) setLoading(false);
      }
    }
    load();
    return () => { alive = false; };
  }, []);

  return { events, isLive, message, loading };
}

export default function EmployeeCalendarPage() {
  const { events, isLive, message, loading } = useCalendarEvents();
  const now = new Date();
  const [selectedDay, setSelectedDay] = useState(now.getDate());
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, index) => index + 1);
  const currentMonth = now.toLocaleString('en-IN', { month: 'long', year: 'numeric' });

  const eventMap = useMemo(() => {
    const map = {};
    events.filter((event) => isSameMonth(event.dateTime, now)).forEach((event) => {
      const day = new Date(event.dateTime).getDate();
      map[day] = map[day] || [];
      map[day].push(event);
    });
    return map;
  }, [events]);

  const selectedEvents = eventMap[selectedDay] || [];
  const upcoming = useMemo(() => events.filter((event) => new Date(event.dateTime).getTime() >= Date.now()).slice(0, 8), [events]);
  const rightPanelEvents = selectedEvents.length ? selectedEvents : upcoming;
  const rightPanelTitle = selectedEvents.length ? `${selectedDay} ${currentMonth}` : 'Upcoming';

  return (
    <Shell
      title="Calendar"
      subtitle="View and manage your lead follow-ups, demos and scheduled tasks."
      actions={<button className="emp-btn primary" type="button" onClick={() => { window.history.pushState({}, '', '/employee/tasks'); window.dispatchEvent(new Event('salesflow:navigate')); }}>+ Schedule</button>}
    >
      {loading ? <CrmLoadingPanel label="Loading schedule..." compact /> : null}
      <section className="calendar-wrap">
        <article className="emp-card emp-section">
          <div className="emp-section-head"><h2>{currentMonth}</h2><span className="emp-pill blue">{isLive ? 'Live Schedule' : 'Demo Schedule'}</span></div>
          {message ? <div className={`emp-data-banner ${isLive ? 'live' : 'demo'}`}>{message}</div> : null}
          <div className="calendar-grid">
            {days.map((day) => (
              <button type="button" className={`cal-day ${day === now.getDate() ? 'today' : ''} ${day === selectedDay ? 'selected' : ''}`} key={day} onClick={() => setSelectedDay(day)}>
                <b>{day}</b>
                {(eventMap[day] || []).slice(0, 3).map((event) => (
                  <span className={`cal-event ${event.tone}`} key={event.id} onClick={(clickEvent) => { clickEvent.stopPropagation(); goToLead(event); }}>{event.title}</span>
                ))}
              </button>
            ))}
          </div>
        </article>
        <article className="emp-card emp-section">
          <div className="emp-section-head"><h2>{rightPanelTitle}</h2></div>
          {rightPanelEvents.length ? rightPanelEvents.map((event) => (
            <button type="button" className="task-row calendar-click-row" key={event.id} onClick={() => goToLead(event)}>
              <span className="task-check" />
              <div><strong>{event.title}</strong><small>{event.date} • {event.lead} • {event.source}</small></div>
              <span className="task-time">{event.time}</span>
            </button>
          )) : (
            <CrmEmptyState
              title="Nothing scheduled"
              text={selectedEvents.length ? 'No events on this date.' : 'No upcoming follow-ups or demos.'}
              icon="📅"
              action={<button type="button" className="crm-empty-cta" onClick={() => { window.history.pushState({}, '', '/employee/tasks'); window.dispatchEvent(new Event('salesflow:navigate')); }}>Schedule Task</button>}
            />
          )}
        </article>
      </section>
    </Shell>
  );
}
