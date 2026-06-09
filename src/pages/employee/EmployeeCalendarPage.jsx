import { useMemo, useState } from "react";
import { CalendarDays, Plus, X, Phone, Video, CheckCircle2, Search } from "lucide-react";
import EmployeeShell from "../../components/employee/EmployeeShell.jsx";

const days = Array.from({ length: 30 }, (_, i) => i + 1);

const leadOptions = [
  { id: "1", name: "Rajesh Kumar", company: "TechNova Pvt Ltd" },
  { id: "2", name: "Priya Sharma", company: "Zephyr Solutions" },
  { id: "3", name: "Aditya Mehta", company: "Orion Enterprises" },
  { id: "4", name: "Sunita Patel", company: "Starlight Systems" },
  { id: "5", name: "Vikram Nair", company: "Pinnacle Corp" },
  { id: "6", name: "Amit Shah", company: "Acme Finance" },
];

const initialEvents = [
  { id: "cal-1", date: "2025-05-07", day: 7, title: "Follow-up with Rajesh", leadId: "1", leadName: "Rajesh Kumar", type: "Follow-up", time: "03:00 PM", source: "Lead Activity", note: "Follow-up created from lead activity." },
  { id: "cal-2", date: "2025-05-13", day: 13, title: "Demo with Priya", leadId: "2", leadName: "Priya Sharma", type: "Demo", time: "11:30 AM", source: "Lead Activity", note: "Demo booked from lead activity." },
  { id: "cal-3", date: "2025-05-20", day: 20, title: "Payment follow-up", leadId: "5", leadName: "Vikram Nair", type: "Follow-up", time: "10:15 AM", source: "Calendar", note: "Payment follow-up pending." },
  { id: "cal-4", date: "2025-05-20", day: 20, title: "Call Aditya", leadId: "3", leadName: "Aditya Mehta", type: "Call", time: "04:30 PM", source: "Lead Activity", note: "Call task created from activity." },
];

function eventIcon(type) {
  if (type === "Demo") return Video;
  if (type === "Call") return Phone;
  return CheckCircle2;
}

function goLead(leadId) {
  window.history.pushState({}, "", `/leads/${leadId}`);
  window.dispatchEvent(new Event("salesflow:navigate"));
}

export default function EmployeeCalendarPage() {
  const [events, setEvents] = useState(initialEvents);
  const [selectedDay, setSelectedDay] = useState(20);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [form, setForm] = useState({ leadId: "1", type: "Follow-up", date: "2025-05-09", time: "15:00", note: "" });
  const [leadSearch, setLeadSearch] = useState("Rajesh Kumar · TechNova Pvt Ltd");
  const [leadPickerOpen, setLeadPickerOpen] = useState(false);

  const eventsByDay = useMemo(() => {
    return events.reduce((acc, event) => {
      acc[event.day] = acc[event.day] || [];
      acc[event.day].push(event);
      return acc;
    }, {});
  }, [events]);

  const filteredLeads = useMemo(() => {
    const query = leadSearch.trim().toLowerCase();
    if (!query) return leadOptions.slice(0, 20);
    return leadOptions
      .filter((lead) => `${lead.name} ${lead.company}`.toLowerCase().includes(query))
      .slice(0, 20);
  }, [leadSearch]);

  const selectedEvents = eventsByDay[selectedDay] || [];
  const upcomingEvents = [...events].sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`)).slice(0, 6);

  const selectLead = (lead) => {
    setForm((prev) => ({ ...prev, leadId: lead.id }));
    setLeadSearch(`${lead.name} · ${lead.company}`);
    setLeadPickerOpen(false);
  };

  const openSchedule = () => {
    const selectedLead = leadOptions.find((lead) => lead.id === form.leadId) || leadOptions[0];
    setLeadSearch(`${selectedLead.name} · ${selectedLead.company}`);
    setLeadPickerOpen(false);
    setIsScheduleOpen(true);
  };

  const handleSchedule = (event) => {
    event.preventDefault();
    const lead = leadOptions.find((item) => item.id === form.leadId) || leadOptions[0];
    const dateObj = new Date(`${form.date}T${form.time || "09:00"}`);
    const day = dateObj.getDate();
    const timeText = dateObj.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

    const nextEvent = {
      id: `cal-${Date.now()}`,
      date: form.date,
      day,
      title: `${form.type} with ${lead.name}`,
      leadId: lead.id,
      leadName: lead.name,
      type: form.type,
      time: timeText,
      source: "Calendar Schedule",
      note: form.note || `${form.type} scheduled from calendar.`,
    };

    setEvents((prev) => [...prev, nextEvent]);
    setSelectedDay(day);
    setIsScheduleOpen(false);
    setForm({ leadId: "1", type: "Follow-up", date: "2025-05-09", time: "15:00", note: "" });
    setLeadSearch("Rajesh Kumar · TechNova Pvt Ltd");
  };

  return (
    <EmployeeShell>
      <div className="space-y-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold text-orange-600 uppercase tracking-wider">Employee Workspace</p>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight mt-1">Calendar</h1>
            <p className="text-sm text-slate-500 mt-1">Manage meetings, demos and follow-ups.</p>
          </div>

          <button onClick={openSchedule} className="inline-flex items-center gap-2 px-4 h-10 rounded-xl bg-orange-500 text-white text-sm font-bold shadow-lg shadow-orange-500/20">
            <Plus className="w-4 h-4" />
            Schedule
          </button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-5">
          <section className="rounded-2xl bg-white border border-slate-200 shadow-sm p-5">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-bold text-slate-900">May 2025</h2>
                <p className="text-xs text-slate-500 mt-1">Click a date to view all tasks. Click a task to open its lead.</p>
              </div>
              <CalendarDays className="w-5 h-5 text-orange-500" />
            </div>

            <div className="grid grid-cols-7 gap-2 text-center">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => <div key={d} className="text-xs font-bold text-slate-400 py-2">{d}</div>)}

              {days.map((d) => {
                const dayEvents = eventsByDay[d] || [];
                const active = selectedDay === d;

                return (
                  <button key={d} type="button" onClick={() => setSelectedDay(d)} className={`min-h-[92px] rounded-xl border p-2 text-left transition-all ${active ? "bg-orange-50 border-orange-300 ring-2 ring-orange-200" : dayEvents.length ? "bg-orange-50/60 border-orange-200 hover:bg-orange-50" : "bg-slate-50 border-slate-100 hover:bg-slate-100"}`}>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-bold text-slate-700">{d}</span>
                      {dayEvents.length > 1 ? <span className="text-[10px] font-black text-orange-700 bg-white px-2 py-0.5 rounded-full">{dayEvents.length}</span> : null}
                    </div>

                    <div className="mt-2 space-y-1">
                      {dayEvents.slice(0, 2).map((item) => (
                        <div key={item.id} role="button" tabIndex={0} onClick={(event) => { event.stopPropagation(); goLead(item.leadId); }} className="truncate rounded-lg bg-white/80 px-2 py-1 text-[11px] font-bold text-orange-700 border border-orange-100 hover:bg-white">
                          {item.type}: {item.leadName}
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
              <h2 className="text-lg font-bold text-slate-900">{selectedEvents.length ? `May ${selectedDay} Tasks` : "Upcoming"}</h2>
              <p className="text-sm text-slate-500 mt-1">{selectedEvents.length ? `${selectedEvents.length} task/event on this date.` : "Next scheduled events."}</p>
            </div>

            <div className="divide-y divide-slate-100">
              {(selectedEvents.length ? selectedEvents : upcomingEvents).map((item) => {
                const Icon = eventIcon(item.type);
                return (
                  <button key={item.id} type="button" onClick={() => goLead(item.leadId)} className="w-full px-5 py-4 flex items-start gap-3 text-left hover:bg-orange-50/70 transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 grid place-items-center shrink-0"><Icon className="w-4 h-4" /></div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-slate-900 truncate">{item.title}</h3>
                      <p className="text-sm text-slate-500 mt-1">{item.time} · {item.type}</p>
                      <p className="text-xs text-slate-400 mt-1">Lead: {item.leadName}</p>
                      <p className="text-xs text-orange-600 font-bold mt-1">Source: {item.source}</p>
                    </div>
                  </button>
                );
              })}
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
                  <p className="text-sm text-slate-500 mt-1">Create demo, call or follow-up for a lead.</p>
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
                      onChange={(e) => {
                        setLeadSearch(e.target.value);
                        setLeadPickerOpen(true);
                      }}
                      placeholder="Search lead by name or company..."
                      className="w-full h-11 rounded-xl border border-slate-200 pl-10 pr-3 text-sm font-bold outline-none focus:ring-2 focus:ring-orange-500/20"
                    />
                  </div>

                  {leadPickerOpen && (
                    <div className="absolute z-[10000] left-0 right-0 mt-2 max-h-56 overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-2xl">
                      {filteredLeads.map((lead) => (
                        <button key={lead.id} type="button" onClick={() => selectLead(lead)} className={`w-full px-4 py-3 text-left hover:bg-orange-50 ${form.leadId === lead.id ? "bg-orange-50" : "bg-white"}`}>
                          <p className="text-sm font-black text-slate-900">{lead.name}</p>
                          <p className="text-xs font-semibold text-slate-500 mt-0.5">{lead.company}</p>
                        </button>
                      ))}
                      {filteredLeads.length === 0 && <div className="px-4 py-4 text-sm font-bold text-slate-500">No lead found.</div>}
                    </div>
                  )}
                </label>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <label className="block md:col-span-1">
                    <span className="text-sm font-black text-slate-700">Type</span>
                    <select value={form.type} onChange={(e) => setForm((prev) => ({ ...prev, type: e.target.value }))} className="mt-2 w-full h-11 rounded-xl border border-slate-200 px-3 text-sm font-bold outline-none focus:ring-2 focus:ring-orange-500/20">
                      <option>Follow-up</option><option>Demo</option><option>Call</option>
                    </select>
                  </label>

                  <label className="block md:col-span-1">
                    <span className="text-sm font-black text-slate-700">Date</span>
                    <input type="date" value={form.date} onChange={(e) => setForm((prev) => ({ ...prev, date: e.target.value }))} className="mt-2 w-full h-11 rounded-xl border border-slate-200 px-3 text-sm font-bold outline-none focus:ring-2 focus:ring-orange-500/20" />
                  </label>

                  <label className="block md:col-span-1">
                    <span className="text-sm font-black text-slate-700">Time</span>
                    <input type="time" value={form.time} onChange={(e) => setForm((prev) => ({ ...prev, time: e.target.value }))} className="mt-2 w-full h-11 rounded-xl border border-slate-200 px-3 text-sm font-bold outline-none focus:ring-2 focus:ring-orange-500/20" />
                  </label>
                </div>

                <label className="block">
                  <span className="text-sm font-black text-slate-700">Note</span>
                  <textarea value={form.note} onChange={(e) => setForm((prev) => ({ ...prev, note: e.target.value }))} rows={2} className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-orange-500/20 resize-none" placeholder="Add short note..." />
                </label>

                <div className="flex justify-end gap-3 pt-1">
                  <button type="button" onClick={() => setIsScheduleOpen(false)} className="h-10 px-4 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50">Cancel</button>
                  <button type="submit" className="h-10 px-5 rounded-xl bg-orange-600 text-white font-bold shadow-lg shadow-orange-500/20 hover:bg-orange-700">Save Schedule</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </EmployeeShell>
  );
}
