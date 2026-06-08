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
  X,
  ArrowRight,
  User,
  Clock
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

const STAGES = [
  "New",
  "Contacted",
  "Qualified",
  "Demo Booked",
  "Demo Done",
  "Follow Up",
  "Proposal Sent",
  "Won",
  "Lost",
  "Junk"
];

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

function getDefaultToStage(disposition) {
  if (disposition === "Call Connected") return "Contacted";
  if (disposition === "Not Connected") return "Follow Up";
  if (disposition === "Demo Booked") return "Demo Booked";
  if (disposition === "Demo Done") return "Demo Done";
  if (disposition === "Follow Up") return "Follow Up";
  if (disposition === "Won") return "Won";
  if (disposition === "Lost") return "Lost";
  return "Contacted";
}

function emptyForm(currentStage = "New") {
  const disposition = "Call Connected";

  return {
    disposition,
    subDisposition: DISPOSITIONS[disposition][0],
    note: "",
    owner: "Jayraj",
    createdOn: getNow(),
    fromStage: currentStage,
    toStage: getDefaultToStage(disposition)
  };
}

export default function LeadActivityManager({
  leadName = "Lead",
  currentStage = "New"
}) {
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [latestStage, setLatestStage] = useState(currentStage || "New");
  const [form, setForm] = useState(emptyForm(currentStage || "New"));

  const [activities, setActivities] = useState([
    {
      id: 1,
      disposition: "Call Connected",
      subDisposition: "Need Follow Up",
      note: "Customer asked to share demo details and pricing.",
      owner: "Jayraj",
      createdOn: getNow(),
      fromStage: "New",
      toStage: "Contacted"
    }
  ]);

  const openAddModal = () => {
    setEditingId(null);
    setForm(emptyForm(latestStage));
    setShowModal(true);
  };

  const changeDisposition = (value) => {
    setForm((old) => ({
      ...old,
      disposition: value,
      subDisposition: DISPOSITIONS[value][0],
      toStage: getDefaultToStage(value),
      createdOn: getNow()
    }));
  };

  const saveActivity = () => {
    const payload = {
      ...form,
      note: form.note.trim() || "No note added",
      createdOn: form.createdOn || getNow()
    };

    if (editingId) {
      setActivities((rows) =>
        rows.map((row) =>
          row.id === editingId ? { ...row, ...payload } : row
        )
      );
    } else {
      setActivities((rows) => [{ id: Date.now(), ...payload }, ...rows]);
    }

    setLatestStage(payload.toStage);
    setEditingId(null);
    setShowModal(false);
    setForm(emptyForm(payload.toStage));
  };

  const editActivity = (activity) => {
    setEditingId(activity.id);
    setForm({
      disposition: activity.disposition,
      subDisposition: activity.subDisposition,
      note: activity.note,
      owner: activity.owner,
      createdOn: activity.createdOn,
      fromStage: activity.fromStage,
      toStage: activity.toStage
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setEditingId(null);
    setForm(emptyForm(latestStage));
    setShowModal(false);
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div>
          <h2 className="text-xl font-black text-slate-900">
            Activity Timeline
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Track disposition, stage change, owner and notes.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="h-10 px-4 rounded-lg bg-orange-600 text-white font-bold inline-flex items-center gap-2 shadow-lg shadow-orange-500/20"
        >
          <Plus className="w-4 h-4" />
          Lead Activity
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-3xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black text-slate-900">
                  {editingId ? "Edit Lead Activity" : "Add Lead Activity"}
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  {leadName} activity disposition and stage update.
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="w-9 h-9 rounded-lg border border-slate-200 grid place-items-center text-slate-500 hover:text-red-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5">
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
                        createdOn: getNow()
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
                    Lead Stage From
                  </span>
                  <select
                    value={form.fromStage}
                    onChange={(e) =>
                      setForm((old) => ({
                        ...old,
                        fromStage: e.target.value
                      }))
                    }
                    className="mt-2 w-full h-11 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold outline-none"
                  >
                    {STAGES.map((stage) => (
                      <option key={stage}>{stage}</option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="text-sm font-bold text-slate-600">
                    Lead Stage To
                  </span>
                  <select
                    value={form.toStage}
                    onChange={(e) =>
                      setForm((old) => ({
                        ...old,
                        toStage: e.target.value
                      }))
                    }
                    className="mt-2 w-full h-11 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold outline-none"
                  >
                    {STAGES.map((stage) => (
                      <option key={stage}>{stage}</option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="text-sm font-bold text-slate-600">
                    Changed By / Owner
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
                    Created On
                  </span>
                  <input
                    value={form.createdOn}
                    readOnly
                    className="mt-2 w-full h-11 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm font-semibold outline-none text-slate-500"
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
                    className="mt-2 w-full min-h-28 rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm outline-none resize-none"
                  />
                </label>
              </div>
            </div>

            <div className="px-5 py-4 border-t border-slate-200 flex justify-end gap-3 bg-slate-50">
              <button
                type="button"
                onClick={closeModal}
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
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-black text-slate-900">
                        {activity.disposition}
                      </h3>

                      <span
                        className="px-2 py-0.5 rounded-full text-xs font-bold"
                        style={{ background: `${color}18`, color }}
                      >
                        {activity.subDisposition}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mt-2 text-sm text-slate-600 flex-wrap">
                      <span className="font-bold text-slate-700">
                        Lead changed:
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-bold">
                        {activity.fromStage}
                      </span>
                      <ArrowRight className="w-4 h-4 text-slate-400" />
                      <span className="px-2 py-0.5 rounded-md bg-orange-50 text-orange-700 font-bold">
                        {activity.toStage}
                      </span>
                    </div>

                    <p className="text-sm text-slate-600 mt-3">
                      {activity.note}
                    </p>

                    <div className="flex items-center gap-4 text-xs text-slate-500 mt-3 flex-wrap">
                      <span className="inline-flex items-center gap-1">
                        <User className="w-3 h-3" />
                        Changed by{" "}
                        <b className="text-slate-700">{activity.owner}</b>
                      </span>

                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Created on {activity.createdOn}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => editActivity(activity)}
                    className="w-9 h-9 rounded-lg border border-slate-200 text-slate-500 hover:text-orange-600 hover:bg-orange-50 grid place-items-center shrink-0"
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
