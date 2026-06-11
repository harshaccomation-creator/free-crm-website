import { useEffect, useMemo, useState } from "react";
import { Mail, Phone, Edit3, Building2, MapPin, Globe, FileText, Loader2, Plus } from "lucide-react";
import EmployeeShell from "../../components/employee/EmployeeShell.jsx";
import { createActivity, getLead, listActivities, updateLead } from "../../services/crmApi.js";

const DISPOSITION_OPTIONS = ["Call Connected", "Not Connected", "Follow Up", "Demo Book", "Post Demo Follow Up", "Won", "Lost", "Junk"];

const SUB_DISPOSITIONS = {
  "Call Connected": ["Interested", "Need Follow Up", "Demo Book", "Pricing Shared", "Decision Pending"],
  "Not Connected": ["Not Picked", "Busy", "Switch Off", "Wrong Number", "Ringing"],
  "Follow Up": ["Today Follow Up", "Tomorrow Follow Up", "Warm Follow Up", "Cold Follow Up", "Payment Follow Up"],
  "Demo Book": ["Demo Scheduled", "Demo Confirmed", "Demo Rescheduled", "Demo Cancelled"],
  "Post Demo Follow Up": ["Requirement Pending", "Payment Discussion", "Decision Pending", "Second Demo Required"],
  Won: ["Deal Closed", "Payment Received", "Advance Received", "Subscription Started"],
  Lost: ["Not Interested", "Budget Issue", "Competitor", "No Requirement", "Decision Dropped"],
  Junk: ["Invalid Number", "Duplicate Lead", "Spam", "Test Lead", "Wrong Data"],
};

function getLeadIdFromUrl() {
  const parts = window.location.pathname.split("/");
  return parts[parts.length - 1];
}

function initials(name = "") {
  return String(name || "")
    .split(" ")
    .map((x) => x[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatValue(value) {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
}

function statusClass(status) {
  if (status === "Won") return "bg-green-50 text-green-700 border-green-100";
  if (status === "Contacted") return "bg-green-50 text-green-700 border-green-100";
  if (status === "Demo Done" || status === "Qualified") return "bg-orange-50 text-orange-700 border-orange-100";
  if (status === "Overdue") return "bg-red-50 text-red-700 border-red-100";
  if (status === "New") return "bg-blue-50 text-blue-700 border-blue-100";
  return "bg-slate-100 text-slate-600 border-slate-200";
}

function formatTime(value) {
  if (!value) return "Not assigned";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: true });
}

function activityLabel(type = "") {
  const key = String(type).replaceAll("_", " ");
  return key ? key.charAt(0).toUpperCase() + key.slice(1) : "Activity";
}

function activityActor(item = {}) {
  return item.user?.full_name || item.user?.email || item.employeeName || item.ownerName || item.createdBy || "Not assigned";
}

function activityTypeKey(value = "") {
  return String(value || "activity").toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "") || "activity";
}

export default function LeadDetailPage({ leadId }) {
  const id = useMemo(() => leadId || getLeadIdFromUrl(), [leadId]);
  const [activeTab, setActiveTab] = useState("Activity Timeline");
  const [noteText, setNoteText] = useState("");
  const [currentLead, setCurrentLead] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [activityPopupOpen, setActivityPopupOpen] = useState(false);
  const [activityForm, setActivityForm] = useState({ disposition: "Call Connected", subDisposition: "Interested", note: "", amount: "" });

  async function loadLeadDetail() {
    setLoading(true);
    setError("");
    try {
      const [leadRow, activityRows] = await Promise.all([
        getLead(id),
        listActivities({ leadId: id, limit: 100 }),
      ]);
      setCurrentLead(leadRow);
      setActivities(activityRows || []);
    } catch (err) {
      setError(err.message || "Lead detail load failed.");
      setCurrentLead(null);
      setActivities([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadLeadDetail(); }, [id]);

  const status = currentLead?.status === "Demo Done" ? "Qualified" : currentLead?.status || "New";
  const subDispositionOptions = SUB_DISPOSITIONS[activityForm.disposition] || [];

  const addActivity = async (type, text) => {
    if (!currentLead?.id || saving) return;
    setSaving(true);
    setError("");
    try {
      await createActivity({ lead_id: currentLead.id, type, title: text, note: text });
      setActiveTab("Activity Timeline");
      await loadLeadDetail();
    } catch (err) {
      setError(err.message || "Activity save failed.");
    } finally {
      setSaving(false);
    }
  };

  const addNote = async () => {
    const clean = noteText.trim();
    if (!clean || !currentLead?.id || saving) return;
    setSaving(true);
    setError("");
    try {
      await createActivity({ lead_id: currentLead.id, type: "note", title: "Note added", note: clean });
      setNoteText("");
      setActiveTab("Activity Timeline");
      await loadLeadDetail();
    } catch (err) {
      setError(err.message || "Note save failed.");
    } finally {
      setSaving(false);
    }
  };

  const saveLeadActivity = async () => {
    if (!currentLead?.id || saving) return;
    const disposition = activityForm.disposition;
    const subDisposition = activityForm.subDisposition;
    const note = activityForm.note.trim();
    const amount = Number(activityForm.amount || 0);
    if (!disposition || !subDisposition) {
      setError("Disposition and sub disposition required.");
      return;
    }
    if (disposition === "Lost" && !note) {
      setError("Lost activity ke liye note mandatory hai.");
      return;
    }
    if (disposition === "Won" && (!amount || amount <= 0)) {
      setError("Won activity ke liye amount mandatory hai.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const title = `${disposition} - ${subDisposition}`;
      const finalNote = [
        `Disposition: ${disposition}`,
        `Sub Disposition: ${subDisposition}`,
        note ? `Note: ${note}` : "",
        disposition === "Won" ? `Amount: ₹${amount.toLocaleString("en-IN")}` : "",
      ].filter(Boolean).join("\n");
      await createActivity({
        lead_id: currentLead.id,
        type: activityTypeKey(disposition),
        title,
        note: finalNote,
        activity_at: new Date().toISOString(),
      });
      if (disposition === "Won") await updateLead(currentLead.id, { value: amount, status: "Won" });
      if (disposition === "Junk") await updateLead(currentLead.id, { status: "Junk" });
      setActivityPopupOpen(false);
      setActivityForm({ disposition: "Call Connected", subDisposition: "Interested", note: "", amount: "" });
      setActiveTab("Activity Timeline");
      await loadLeadDetail();
    } catch (err) {
      setError(err.message || "Activity save failed.");
    } finally {
      setSaving(false);
    }
  };

  const openLeadActivity = () => {
    setActiveTab("Activity Timeline");
    window.setTimeout(() => {
      document.getElementById("lead-activity-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  const openAddActivity = () => {
    setActivityPopupOpen(true);
    window.setTimeout(() => {
      document.getElementById("lead-activity-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  const tabs = ["Activity Timeline", "Notes", "Tasks"];

  if (loading) {
    return (
      <EmployeeShell>
        <div className="min-h-[360px] grid place-items-center text-slate-500 font-bold"><Loader2 className="w-5 h-5 animate-spin mr-2 inline" /> Loading lead from Supabase...</div>
      </EmployeeShell>
    );
  }

  if (!currentLead) {
    return (
      <EmployeeShell>
        <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-red-700 font-bold">{error || "Lead not found or permission denied."}</div>
      </EmployeeShell>
    );
  }

  return (
    <EmployeeShell>
      <div className="space-y-5">
        {error ? <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-3 text-sm font-bold text-red-700">{error}</div> : null}
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-full bg-orange-600 text-white grid place-items-center text-2xl font-black">{initials(currentLead.name)}</div>
            <div>
              <h1 className="text-3xl font-black text-slate-900">{currentLead.name}</h1>
              <p className="text-lg text-slate-500 mt-1">{currentLead.company || "No company"}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button type="button" onClick={openLeadActivity} className="h-10 px-5 rounded-lg border border-orange-200 bg-orange-50 text-orange-700 font-bold inline-flex items-center gap-2"><FileText className="w-4 h-4" />Lead Activity</button>
            <button type="button" disabled={saving} onClick={() => addActivity("email", `Email sent to ${currentLead.name}`)} className="h-10 px-5 rounded-lg border border-blue-200 bg-blue-50 text-blue-700 font-bold inline-flex items-center gap-2 disabled:opacity-50"><Mail className="w-4 h-4" />Email</button>
            <button type="button" disabled={saving} onClick={() => addActivity("call", `Call logged with ${currentLead.name}`)} className="h-10 px-5 rounded-lg border border-green-200 bg-green-50 text-green-700 font-bold inline-flex items-center gap-2 disabled:opacity-50"><Phone className="w-4 h-4" />Call</button>
            <button type="button" className="h-10 px-5 rounded-lg bg-orange-600 text-white font-bold inline-flex items-center gap-2 shadow-lg shadow-orange-500/20"><Edit3 className="w-4 h-4" />Edit Lead</button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[420px_1fr] gap-5">
          <section className="rounded-xl bg-white border border-slate-200 shadow-sm p-6">
            <h2 className="text-xl font-black text-slate-900">About</h2>
            <div className="grid grid-cols-2 gap-5 mt-6">
              <div><p className="text-sm text-slate-500 font-semibold">Status</p><span className={`inline-flex mt-2 px-3 py-1 rounded-md border text-sm font-black ${statusClass(status)}`}>{status}</span></div>
              <div><p className="text-sm text-slate-500 font-semibold">Lead Score</p><span className="inline-grid mt-2 w-11 h-11 rounded-full bg-blue-50 text-slate-900 place-items-center font-black">{currentLead.score || 60}</span></div>
              <div><p className="text-sm text-slate-500 font-semibold">Deal Value</p><h3 className="text-lg font-black text-slate-900 mt-2">{formatValue(currentLead.value)}</h3></div>
              <div><p className="text-sm text-slate-500 font-semibold">Source</p><h3 className="text-lg font-black text-slate-900 mt-2">{currentLead.source || "Website"}</h3></div>
            </div>
            <div className="h-px bg-slate-200 my-6" />
            <div className="space-y-4">
              <div className="flex items-start gap-3"><Mail className="w-5 h-5 text-slate-500 mt-0.5" /><div><h3 className="font-bold text-slate-900">{currentLead.email || "No email"}</h3><p className="text-sm text-slate-500">Work</p></div></div>
              <div className="flex items-start gap-3"><Phone className="w-5 h-5 text-slate-500 mt-0.5" /><div><h3 className="font-bold text-slate-900">{currentLead.phone || "No phone"}</h3><p className="text-sm text-slate-500">Mobile</p></div></div>
              <div className="flex items-start gap-3"><Building2 className="w-5 h-5 text-slate-500 mt-0.5" /><div><h3 className="font-bold text-slate-900">{currentLead.company || "No company"}</h3><p className="text-sm text-slate-500">Industry: {currentLead.job_title || "Not assigned"}</p></div></div>
              <div className="flex items-start gap-3"><MapPin className="w-5 h-5 text-slate-500 mt-0.5" /><h3 className="font-bold text-slate-900">{currentLead.location || "Not assigned"}</h3></div>
              <div className="flex items-start gap-3"><Globe className="w-5 h-5 text-slate-500 mt-0.5" /><h3 className="font-bold text-blue-600">{currentLead.website || "Not assigned"}</h3></div>
            </div>
          </section>

          <section id="lead-activity-section" className="rounded-xl bg-white border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 pt-5 border-b border-slate-200">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-8">
                  {tabs.map((tab) => <button key={tab} type="button" onClick={() => setActiveTab(tab)} className={`pb-4 text-lg font-semibold border-b-2 ${activeTab === tab ? "text-slate-900 border-orange-600" : "text-slate-500 border-transparent"}`}>{tab}</button>)}
                </div>
                <button type="button" onClick={openAddActivity} className="mb-4 inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-orange-600 px-4 text-sm font-bold text-white shadow-lg shadow-orange-500/20">
                  <Plus className="w-4 h-4" /> Add Activity
                </button>
              </div>
            </div>
            <div className="p-6">
              {activeTab === "Activity Timeline" && <div className="space-y-3">{activities.map((item) => <div key={item.id} className="rounded-xl border border-slate-200 p-4"><div className="flex items-start justify-between gap-3"><div><p className="text-sm font-black text-slate-900">{item.title || activityLabel(item.type)}</p><p className="text-sm text-slate-600 mt-1 whitespace-pre-line">{item.note || "No note added"}</p><p className="text-xs text-slate-400 mt-2">By {activityActor(item)} · {formatTime(item.activity_at || item.created_at)}</p></div><span className="px-2 py-1 rounded-lg bg-slate-100 text-slate-600 text-xs font-bold">{activityLabel(item.type)}</span></div></div>)}{activities.length === 0 && <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center text-slate-500">No Supabase activities found.</div>}</div>}

              {activeTab === "Notes" && <div className="space-y-4"><div className="rounded-lg border border-slate-200 p-4"><textarea value={noteText} onChange={(event) => setNoteText(event.target.value)} placeholder="Write a note..." className="w-full min-h-28 outline-none resize-none text-sm" /><div className="flex justify-end mt-3"><button type="button" disabled={saving || !noteText.trim()} onClick={addNote} className="h-9 px-4 rounded-lg bg-orange-600 text-white text-sm font-bold disabled:opacity-50">{saving ? "Saving..." : "Add Note"}</button></div></div><div className="space-y-3">{activities.filter((a) => String(a.type).includes("note")).map((item) => <div key={item.id} className="rounded-lg border border-slate-200 p-5"><div className="flex items-center gap-3"><FileText className="w-5 h-5 text-orange-600" /><h3 className="font-black text-slate-900">{item.title || "Note"}</h3></div><p className="text-slate-600 mt-3">{item.note}</p></div>)}</div></div>}

              {activeTab === "Tasks" && <div className="space-y-3"><div className="rounded-lg border border-slate-200 p-4 text-slate-500">Tasks are managed from Tasks page.</div></div>}
            </div>
          </section>
        </div>
      </div>

      {activityPopupOpen && (
        <div className="fixed inset-0 z-[9999] grid place-items-center bg-slate-950/60 px-4">
          <div className="w-full max-w-xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-black text-slate-900">Add Lead Activity</h2>
                <p className="text-sm text-slate-500 mt-1">Date, time and login employee name auto save hoga.</p>
              </div>
              <button type="button" onClick={() => setActivityPopupOpen(false)} className="h-9 w-9 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50">×</button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-xs font-black uppercase tracking-wide text-slate-500">Disposition</span>
                  <select value={activityForm.disposition} onChange={(event) => { const next = event.target.value; setActivityForm((prev) => ({ ...prev, disposition: next, subDisposition: SUB_DISPOSITIONS[next]?.[0] || "", amount: next === "Won" ? prev.amount : "" })); }} className="mt-1 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm font-bold outline-none focus:ring-2 focus:ring-orange-500/20">
                    {DISPOSITION_OPTIONS.map((item) => <option key={item} value={item}>{item}</option>)}
                  </select>
                </label>
                <label className="block">
                  <span className="text-xs font-black uppercase tracking-wide text-slate-500">Sub Disposition</span>
                  <select value={activityForm.subDisposition} onChange={(event) => setActivityForm((prev) => ({ ...prev, subDisposition: event.target.value }))} className="mt-1 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm font-bold outline-none focus:ring-2 focus:ring-orange-500/20">
                    {subDispositionOptions.map((item) => <option key={item} value={item}>{item}</option>)}
                  </select>
                </label>
              </div>
              {activityForm.disposition === "Won" && (
                <label className="block">
                  <span className="text-xs font-black uppercase tracking-wide text-slate-500">Won Amount</span>
                  <input type="number" min="0" value={activityForm.amount} onChange={(event) => setActivityForm((prev) => ({ ...prev, amount: event.target.value }))} placeholder="Enter deal amount" className="mt-1 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm font-bold outline-none focus:ring-2 focus:ring-orange-500/20" />
                </label>
              )}
              <label className="block">
                <span className="text-xs font-black uppercase tracking-wide text-slate-500">Note {activityForm.disposition === "Lost" ? "*" : ""}</span>
                <textarea value={activityForm.note} onChange={(event) => setActivityForm((prev) => ({ ...prev, note: event.target.value }))} placeholder={activityForm.disposition === "Lost" ? "Lost reason mandatory..." : "Activity note / description..."} className="mt-1 min-h-28 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm font-semibold outline-none resize-none focus:ring-2 focus:ring-orange-500/20" />
              </label>
            </div>
            <div className="px-5 py-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button type="button" onClick={() => setActivityPopupOpen(false)} className="h-10 px-4 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 hover:bg-slate-50">Cancel</button>
              <button type="button" disabled={saving} onClick={saveLeadActivity} className="h-10 px-5 rounded-xl bg-orange-600 text-white text-sm font-black shadow-lg shadow-orange-500/20 disabled:opacity-50">{saving ? "Saving..." : "Save Activity"}</button>
            </div>
          </div>
        </div>
      )}
    </EmployeeShell>
  );
}
