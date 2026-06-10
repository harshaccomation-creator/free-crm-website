import { useMemo, useState } from "react";
import { CalendarDays, Plus, X, Phone, Video, CheckCircle2, Search } from "lucide-react";
import EmployeeShell from "../../components/employee/EmployeeShell.jsx";
import { addCalendarEventToWorkflow, getCalendarPageState, workflowTasksToCalendarEvents } from "../../services/calendarPageAdapter.js";
import { filterRecordsForUser, getAccessUser } from "../../services/crmAccessControl.js";

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function monthKey(date = new Date()) {
  return date.toISOString().slice(0, 7);
}

function timeNow() {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
}

function getMonthDays(month = monthKey()) {
  const [year, monthNumber] = month.split("-").map(Number);
  const firstDate = new Date(year, monthNumber - 1, 1);
  const totalDays = new Date(year, monthNumber, 0).getDate();
  const blanks = Array.from({ length: firstDate.getDay() }, (_, index) => ({ key: `blank-${index}`, blank: true }));
  const days = Array.from({ length: totalDays }, (_, index) => {
    const day = index + 1;
    return {
      key: `${month}-${String(day).padStart(2, "0")}`,
      day,
      date: `${month}-${String(day).padStart(2, "0")}`,
      blank: false,
    };
  });
  return [...blanks, ...days];
}

function formatMonthLabel(month = monthKey()) {
  const [year, monthNumber] = month.split("-").map(Number);
  return new Date(year, monthNumber - 1, 1).toLocaleDateString("en-IN", { month: "long", year: "numeric" });
}

function eventIcon(type) {
  if (type === "Demo") return Video;
  if (type === "Call") return Phone;
  return CheckCircle2;
}

function goLead(leadId) {
  if (!leadId || leadId === "Not assigned") return;
  window.history.pushState({}, "", `/leads/${leadId}`);
  window.dispatchEvent(new Event("salesflow:navigate"));
}

export default function EmployeeCalendarPage() {
  const accessUser = useMemo(() => getAccessUser(), []);
  const currentDate = todayISO();
  const currentMonth = monthKey();
  const [workflowState, setWorkflowState] = useState(() => getCalendarPageState());
  const [visibleMonth, setVisibleMonth] = useState(currentMonth);
  const [selectedDate, setSelectedDate] = useState(currentDate);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [form, setForm] = useState({ leadId: "", type: "Follow-up", date: currentDate, time: timeNow(), note: "" });
  const [leadSearch, setLeadSearch] = useState("");
  const [leadPickerOpen, setLeadPickerOpen] = useState(false);

  const leadOptions = useMemo(() => {
    return filterRecordsForUser(workflowState.leads || [], accessUser);
  }, [workflowState, accessUser]);

  const events = useMemo(() => {
    return filterRecordsForUser(workflowTasksToCalendarEvents(workflowState), accessUser);
  }, [workflowState, accessUser]);

  const monthDays = useMemo(() => getMonthDays(visibleMonth), [visibleMonth]);

  const eventsByDate = useMemo(() => {
    return events.reduce((acc, event) => {
      acc[event.date] = acc[event.date] || [];
      acc[event.date].push(event);
      return acc;
    }, {});
  }, [events]);

  const filteredLeads = useMemo(() => {
    const query = leadSearch.trim().toLowerCase();
    const rows = query
      ? leadOptions.filter((lead) => `${lead.name || ""} ${lead.company || ""} ${lead.email || ""}`.toLowerCase().includes(query))
      : leadOptions;
    return rows.slice(0, 20);
  }, [leadOptions, leadSearch]);

  const selectedEvents = eventsByDate[selectedDate] || [];
  const upcomingEvents = [...events]
    .filter((item) => item.date >= currentDate)
    .sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`))
    .slice(0, 6);

  const selectLead = (lead) => {
    setForm((prev) => ({ ...prev, leadId: lead.id }));
    setLeadSearch(`${lead.name || "Not assigned"} · ${lead.company || "No company"}`);
    setLeadPickerOpen(false);
  };

  const openSchedule = () => {
    const selectedLead = leadOptions.find((lead) => lead.id === form.leadId) || leadOptions[0];
    setForm((prev) => ({ ...prev, leadId: selectedLead?.id || "", date: prev.date || currentDate, time: prev.time || timeNow() }));
    setLeadSearch(selectedLead ? `${selectedLead.name || "Not assigned"} · ${selectedLead.company || "No company"}` : "");
    setLeadPickerOpen(false);
    setIsScheduleOpen(true);
  };

  const handleSchedule = (event) => {
    event.preventDefault();
    const lead = leadOptions.find((item) => item.id === form.leadId);
    if (!lead) return;

    const dateObj = new Date(`${form.date}T${form.time || "09:00"}`);
    const timeText = dateObj.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });

    const nextEvent = {
      id: `cal-${Date.now()}`,
      date: form.date,
      title: `${form.type} with ${lead.name}`,
      leadId: lead.id,
      leadName: lead.name,
      type: form.type,
      time: form.time || "09:00",
      timeText,
      source: "Calendar Schedule",
      note: form.note || `${form.type} scheduled from calendar.`,
      ownerId: accessUser.id,
      ownerName: accessUser.name,
      ownerEmail: accessUser.email,
      companyId: accessUser.companyId,
      createdById: accessUser.id,
      createdBy: accessUser.name,
    };

    const nextState = addCalendarEventToWorkflow(workflowState, nextEvent);
    setWorkflowState(nextState);
    setVisibleMonth(monthKey(dateObj));
    setSelectedDate(form.date);
    setIsScheduleOpen(false);
    setForm({ leadId: leadOptions[0]?.id || "", type: "Follow-up", date: currentDate, time: timeNow(), note: "" });
    setLeadSearch(leadOptions[0] ? `${leadOptions[0].name || "Not assigned"} · ${leadOptions[0].company || "No company"}` : "");
  };

  return (
    <EmployeeShell>
      <div className="space-y-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold text-orange-600 uppercase tracking-wider">Employee Workspace</p>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight mt-1">Calendar</h1>
            <p className="text-sm text-slate-500 mt-1">Manage meetings, demos and follow-ups from accessible workflow tasks only.</p>
          </div>
          <button onClick={openSchedule} className="inline-flex items-center gap-2 px-4 h-10 rounded-xl bg-orange-500 text-white text-sm font-bold shadow-lg shadow-orange-500/20">
            <Plus className="w-4 h-4" />Schedule
          </button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-5">
          <section className="rounded-2xl bg-white border border-slate-200 shadow-sm p-5">
            <div className="flex items-center justify-between gap-4 mb-5">
              <div>
                <h2 className="text-lg font-bold text-slate-900">{formatMonthLabel(visibleMonth)}</h2>
                <p className="text-xs text-slate-500 mt-1">Click a date to view tasks. Only accessible demo/follow-up tasks are shown.</p>
              </div>
              <input
                type="month"
                value={visibleMonth}
                onChange={(event) => {
                  const nextMonth = event.target.value || currentMonth;
                  setVisibleMonth(nextMonth);
                  setSelectedDate(`${nextMonth}-01`);
                }}
                className="h-10 rounded-xl border border-slate-200 px-3 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-orange-500/20"
              />
            </div>

            <div className="grid grid-cols-7 gap-2 text-center">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                <div key={d} className="text-xs font-bold text-slate-400 py-2">{d}</div>
              ))}

              {monthDays.map((item) => {
                if (item.blank) return <div key={item.key} className="min-h-[92px]" />;
                const dayEvents = eventsByDate[item.date] || [];
                const active = selectedDate === item.date;
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setSelectedDate(item.date)}
                    className={`min-h-[92px] rounded-xl border p-2 text-left transition-all ${active ? "bg-orange-50 border-orange-300 ring-2 ring-orange-200" : dayEvents.length ? "bg-orange-50/60 border-orange-200 hover:bg-orange-50" : "bg-slate-50 border-slate-100 hover:bg-slate-100"}`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-bold text-slate-700">{item.day}</span>
                      {dayEvents.length > 1 ? <span className="text-[10px] font-black text-orange-700 bg-white px-2 py-0.5 rounded-full">{dayEvents.length}</span> : null}
                    </div>
                    <div className="mt-2 space-y-1">
                      {dayEvents.slice(0, 2).map((eventItem) => (
                        <div
                          key={eventItem.id}
                          role="button"
                          tabIndex={0}
                          onClick={(clickEvent) => {
                            clickEvent.stopPropagation();
                            goLead(eventItem.leadId);
                          }}
                          className="truncate rounded-lg bg-white/80 px-2 py-1 text-[11px] font-bold text-orange-700 border border-orange-100 hover:bg-white"
                        >
                          {eventItem.type}: {eventItem.leadName}
                        </div>
                      ))}
                      {dayEvents.length > 2 ? <p className="text-[11px] font-bold text-slate-500">+{dayEvents.length - 2} more</p> : null}
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          <aside className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">{selectedEvents.length ? `${selectedDate} Tasks` : "Upcoming"}</h2>
              <p className="text-sm text-slate-500 mt-1">{selectedEvents.length ? `${selectedEvents.length} task/event on this date.` : "Next scheduled accessible events."}</p>
            </div>
            <div className="divide-y divide-slate-100">
              {(selectedEvents.length ? selectedEvents : upcomingEvents).map((item) => {
                const Icon = eventIcon(item.type);
                return (
                  <button key={item.id} type="button" onClick={() => goLead(item.leadId)} className="w-full px-5 py-4 flex items-start gap-3 text-left hover:bg-orange-50/70 transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 grid place-items-center shrink-0"><Icon className="w-4 h-4" /></div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-slate-900 truncate">{item.title}</h3>
                      <p className="text-sm text-slate-500 mt-1">{item.timeText || item.time} · {item.type}</p>
                      <p className="text-xs text-slate-400 mt-1">Lead: {item.leadName}</p>
                      <p className="text-xs text-orange-600 font-bold mt-1">Source: {item.source}</p>
                    </div>
                  </button>
                );
              })}
              {!selectedEvents.length && !upcomingEvents.length ? (
                <div className="px-5 py-8 text-center">
                  <CalendarDays className="w-8 h-8 text-slate-300 mx-auto" />
                  <p className="text-sm font-bold text-slate-600 mt-3">No accessible calendar events</p>
                  <p className="text-xs text-slate-400 mt-1">Demo and follow-up tasks will appear here.</p>
                </div>
              ) : null}
            </div>
          </aside>
        </div>

        {isScheduleOpen && (
          <div className="fixed inset-0 z-[9999] bg-slate-950/45 backdrop-blur-[3px] flex items-center justify-center p-4">
            <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-visible">
              <div className="px-5 py-4 border-b border-slate-200 flex items-start justify-between gap-4 bg-slate-50/80 rounded-t-2xl">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.18em] text-orange-600">Calendar Schedule</p>
                  <h2 className="text-xl font-black text-slate-900 mt-1">Schedule Activity</h2>
                  <p className="text-sm text-slate-500 mt-1">Create demo or follow-up for an accessible lead.</p>
                </div>
                <button type="button" onClick={() => setIsScheduleOpen(false)} className="w-9 h-9 rounded-xl bg-white border border-slate-200 text-slate-500 grid place-items-center hover:bg-slate-100"><X className="w-4 h-4" /></button>
              </div>

              <form onSubmit={handleSchedule} className="p-5 space-y-4">
                <label className="block relative">
                  <span className="text-sm font-black text-slate-700">Lead</span>
                  <div className="relative mt-2">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      value={leadSearch}
                      onFocus={() => setLeadPickerOpen(true)}
                      onChange={(event) => { setLeadSearch(event.target.value); setLeadPickerOpen(true); }}
                      placeholder="Search lead by name or company..."
                      className="w-full h-11 rounded-xl border border-slate-200 pl-10 pr-3 text-sm font-bold outline-none focus:ring-2 focus:ring-orange-500/20"
                    />
                  </div>
                  {leadPickerOpen && (
                    <div className="absolute z-[10000] left-0 right-0 mt-2 max-h-56 overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-2xl">
                      {filteredLeads.map((lead) => (
                        <button key={lead.id} type="button" onClick={() => selectLead(lead)} className={`w-full px-4 py-3 text-left hover:bg-orange-50 ${form.leadId === lead.id ? "bg-orange-50" : "bg-white"}`}>
                          <p className="text-sm font-black text-slate-900">{lead.name || "Not assigned"}</p>
                          <p className="text-xs font-semibold text-slate-500 mt-0.5">{lead.company || "No company"}</p>
                        </button>
                      ))}
                      {filteredLeads.length === 0 && <div className="px-4 py-4 text-sm font-bold text-slate-500">No accessible lead found.</div>}
                    </div>
                  )}
                </label>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <label className="block md:col-span-1">
                    <span className="text-sm font-black text-slate-700">Type</span>
                    <select value={form.type} onChange={(event) => setForm((prev) => ({ ...prev, type: event.target.value }))} className="mt-2 w-full h-11 rounded-xl border border-slate-200 px-3 text-sm font-bold outline-none focus:ring-2 focus:ring-orange-500/20">
                      <option>Follow-up</option>
                      <option>Demo</option>
                    </select>
                  </label>
                  <label className="block md:col-span-1">
                    <span className="text-sm font-black text-slate-700">Date</span>
                    <input type="date" value={form.date} onChange={(event) => setForm((prev) => ({ ...prev, date: event.target.value }))} className="mt-2 w-full h-11 rounded-xl border border-slate-200 px-3 text-sm font-bold outline-none focus:ring-2 focus:ring-orange-500/20" />
                  </label>
                  <label className="block md:col-span-1">
                    <span className="text-sm font-black text-slate-700">Time</span>
                    <input type="time" value={form.time} onChange={(event) => setForm((prev) => ({ ...prev, time: event.target.value }))} className="mt-2 w-full h-11 rounded-xl border border-slate-200 px-3 text-sm font-bold outline-none focus:ring-2 focus:ring-orange-500/20" />
                  </label>
                </div>

                <label className="block">
                  <span className="text-sm font-black text-slate-700">Note</span>
                  <textarea value={form.note} onChange={(event) => setForm((prev) => ({ ...prev, note: event.target.value }))} rows={2} className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-orange-500/20 resize-none" placeholder="Add short note..." />
                </label>

                <div className="flex justify-end gap-3 pt-1">
                  <button type="button" onClick={() => setIsScheduleOpen(false)} className="h-10 px-4 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50">Cancel</button>
                  <button type="submit" disabled={!form.leadId} className="h-10 px-5 rounded-xl bg-orange-600 text-white font-bold shadow-lg shadow-orange-500/20 hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed">Save Schedule</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </EmployeeShell>
  );
}
