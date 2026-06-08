import { useState } from "react";
import {
  Plus,
  PhoneCall,
  PhoneOff,
  CalendarClock,
  CheckCircle2,
  RefreshCw,
  Trophy,
  XCircle,
  Edit3,
  Save,
  X
} from "lucide-react";

const DISPOSITIONS = {
  "Call Connected": [
    "Interested",
    "Need Follow Up",
    "Price Discussion",
    "Asked For Demo",
    "Not Interested"
  ],
  "Not Connected": [
    "Call Not Picked",
    "Busy",
    "Switched Off",
    "Out Of Coverage",
    "Wrong Number",
    "Number Invalid"
  ],
  "Demo Booked": [
    "Demo Today",
    "Demo Tomorrow",
    "Demo This Week",
    "Demo Scheduled"
  ],
  "Demo Done": [
    "Qualified",
    "Need Proposal",
    "Need Follow Up",
    "Decision Pending"
  ],
  "Follow Up": [
    "Follow Up Today",
    "Follow Up Tomorrow",
    "Follow Up This Week",
    "Follow Up Next Week"
  ],
  Won: [
    "Payment Done",
    "Agreement Done",
    "Converted",
    "Closed Successfully"
  ],
  Lost: [
    "Price High",
    "No Budget",
    "Competitor Selected",
    "Not Interested",
    "Requirement Dropped"
  ]
};

const ICONS = {
  "Call Connected": PhoneCall,
  "Not Connected": PhoneOff,
  "Demo Booked": CalendarClock,
  "Demo Done": CheckCircle2,
  "Follow Up": RefreshCw,
  Won: Trophy,
  Lost: XCircle
};

const COLORS = {
  "Call Connected": "#16a34a",
  "Not Connected": "#dc2626",
  "Demo Booked": "#2563eb",
  "Demo Done": "#7c3aed",
  "Follow Up": "#f97316",
  Won: "#059669",
  Lost: "#64748b"
};

function getNow() {
  return new Date().toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function emptyForm() {
  return {
    disposition: "Call Connected",
    subDisposition: DISPOSITIONS["Call Connected"][0],
    note: "",
    owner: "Jayraj",
    dateTime: getNow()
  };
}

export default function LeadActivityManager({ leadName = "Lead" }) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm());

  const [activities, setActivities] = useState([
    {
      id: 1,
      disposition: "Call Connected",
      subDisposition: "Need Follow Up",
      note: "Customer asked to share demo details and pricing.",
      owner: "Jayraj",
      dateTime: getNow()
    }
  ]);

  const changeDisposition = (value) => {
    setForm((old) => ({
      ...old,
      disposition: value,
      subDisposition: DISPOSITIONS[value][0],
      dateTime: getNow()
    }));
  };

  const saveActivity = () => {
    const payload = {
      ...form,
      note: form.note.trim() || "No note added",
      dateTime: form.dateTime || getNow()
    };

    if (editingId) {
      setActivities((rows) =>
        rows.map((row) =>
          row.id === editingId ? { ...row, ...payload } : row
        )
      );
    } else {
      setActivities((rows) => [
        { id: Date.now(), ...payload },
        ...rows
      ]);
    }

    setForm(emptyForm());
    setEditingId(null);
    setShowForm(false);
  };

  const editActivity = (activity) => {
    setEditingId(activity.id);
    setForm({
      disposition: activity.disposition,
      subDisposition: activity.subDisposition,
      note: activity.note,
      owner: activity.owner,
      dateTime: activity.dateTime
    });
    setShowForm(true);
  };

  const cancelForm = () => {
    setForm(emptyForm());
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div>
          <h2 className="text-xl font-black text-slate-900">
            Activity Timeline
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Track all lead activities with disposition.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="h-10 px-4 rounded-lg bg-orange-600 text-white font-bold inline-flex items-center gap-2 shadow-lg shadow-orange-500/20"
        >
          <Plus className="w-4 h-4" />
          Lead Activity
        </button>
      </div>

      {showForm && (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 mb-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-sm font-bold text-slate-600">
                Disposition
              </span>
              <select
                value={form.disposition}
                onChange={(e) => changeDisposition(e.target.value)}
                className="mt-2 w-full h-11 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold outline-none"
              >
                {Object.keys(DISPOSITIONS).map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-bold text-slate-600">
                Sub Disposition
              </span>
              <select
                value={form.subDisposition}
                onChange={(e) =>
                  setForm((old) => ({
                    ...old,
                    subDisposition: e.target.value,
                    dateTime: getNow()
                  }))
                }
                className="mt-2 w-full h-11 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold outline-none"
              >
                {DISPOSITIONS[form.disposition].map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-bold text-slate-600">
                Owner
              </span>
              <input
                value={form.owner}
                onChange={(e) =>
                  setForm((old) => ({ ...old, owner: e.target.value }))
                }
                className="mt-2 w-full h-11 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold outline-none"
              />
            </label>

            <label className="block">
              <span className="text-sm font-bold text-slate-600">
                Activity Date / Time
              </span>
              <input
                value={form.dateTime}
                readOnly
                className="mt-2 w-full h-11 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold outline-none text-slate-500"
              />
            </label>

            <label className="block md:col-span-2">
              <span className="text-sm font-bold text-slate-600">
                Note
              </span>
              <textarea
                value={form.note}
                onChange={(e) =>
                  setForm((old) => ({ ...old, note: e.target.value }))
                }
                placeholder={`Write activity note for ${leadName}...`}
                className="mt-2 w-full min-h-24 rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm outline-none resize-none"
              />
            </label>
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={cancelForm}
              className="h-10 px-4 rounded-lg border border-slate-200 bg-white text-slate-700 font-bold inline-flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>

            <button
              type="button"
              onClick={saveActivity}
              className="h-10 px-4 rounded-lg bg-orange-600 text-white font-bold inline-flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {editingId ? "Update Activity" : "Save Activity"}
            </button>
          </div>
        </div>
      )}

      <div className="relative pl-14 space-y-4">
        <div className="absolute left-5 top-6 bottom-0 w-0.5 bg-slate-200" />

        {activities.map((activity) => {
          const Icon = ICONS[activity.disposition] || PhoneCall;
          const color = COLORS[activity.disposition] || "#64748b";

          return (
            <div key={activity.id} className="relative">
              <div
                className="absolute -left-14 top-1 w-10 h-10 rounded-full grid place-items-center"
                style={{ background: `${color}18`, color }}
              >
                <Icon className="w-5 h-5" />
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-black text-slate-900">
                        {activity.disposition}
                      </h3>

                      <span
                        className="px-2 py-0.5 rounded-full text-xs font-bold"
                        style={{
                          background: `${color}18`,
                          color
                        }}
                      >
                        {activity.subDisposition}
                      </span>
                    </div>

                    <p className="text-sm text-slate-600 mt-2">
                      {activity.note}
                    </p>

                    <p className="text-xs text-slate-500 mt-3">
                      Owner:{" "}
                      <span className="font-bold text-slate-700">
                        {activity.owner}
                      </span>{" "}
                      · {activity.dateTime}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => editActivity(activity)}
                    className="w-9 h-9 rounded-lg border border-slate-200 text-slate-500 hover:text-orange-600 hover:bg-orange-50 grid place-items-center"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
