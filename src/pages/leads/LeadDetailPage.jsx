import LeadActivityManager from "../../components/employee/LeadActivityManager.jsx";
import { useMemo, useState } from "react";
import {
  Mail,
  Phone,
  Edit3,
  Building2,
  MapPin,
  Globe,
  Clock,
  MessageCircle,
  FileText
} from "lucide-react";
import EmployeeShell from "../../components/employee/EmployeeShell.jsx";
import { empLeads } from "../../data/employeeData.js";

function getLeadIdFromUrl() {
  const parts = window.location.pathname.split("/");
  return parts[parts.length - 1];
}

function initials(name = "") {
  return name
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

export default function LeadDetailPage({ leadId }) {
  const [activeTab, setActiveTab] = useState("Activity Timeline");
  const [noteText, setNoteText] = useState("");

  const currentLead = useMemo(() => {
    const id = leadId || getLeadIdFromUrl();
    return empLeads.find((lead) => lead.id === id) || empLeads[0];
  }, [leadId]);

  const [activities, setActivities] = useState([
    {
      id: 1,
      type: "Note",
      text: "Needs security clearance before final sign off",
      time: "10/25/2023, 2:50:00 PM"
    }
  ]);

  const status =
    currentLead.status === "Demo Done" ? "Qualified" : currentLead.status;

  const addActivity = (type, text) => {
    const next = {
      id: Date.now(),
      type,
      text,
      time: new Date().toLocaleString("en-IN")
    };

    setActivities((items) => [next, ...items]);
    setActiveTab("Activity Timeline");
  };

  const addNote = () => {
    const clean = noteText.trim();

    if (!clean) return;

    addActivity("Note", clean);
    setNoteText("");
  };

  const tabs = ["Activity Timeline", "Notes", "Tasks"];

  return (
    <EmployeeShell>
      <div className="space-y-5">
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-full bg-orange-600 text-white grid place-items-center text-2xl font-black">
              {initials(currentLead.name)}
            </div>

            <div>
              <h1 className="text-3xl font-black text-slate-900">
                {currentLead.name}
              </h1>
              <p className="text-lg text-slate-500 mt-1">
                {currentLead.company}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => addActivity("Email", `Email sent to ${currentLead.name}`)}
              className="h-10 px-5 rounded-lg border border-blue-200 bg-blue-50 text-blue-700 font-bold inline-flex items-center gap-2"
            >
              <Mail className="w-4 h-4" />
              Email
            </button>

            <button
              type="button"
              onClick={() => addActivity("Call", `Call logged with ${currentLead.name}`)}
              className="h-10 px-5 rounded-lg border border-green-200 bg-green-50 text-green-700 font-bold inline-flex items-center gap-2"
            >
              <Phone className="w-4 h-4" />
              Call
            </button>

            <button
              type="button"
              className="h-10 px-5 rounded-lg bg-orange-600 text-white font-bold inline-flex items-center gap-2 shadow-lg shadow-orange-500/20"
            >
              <Edit3 className="w-4 h-4" />
              Edit Lead
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[420px_1fr] gap-5">
          <section className="rounded-xl bg-white border border-slate-200 shadow-sm p-6">
            <h2 className="text-xl font-black text-slate-900">About</h2>

            <div className="grid grid-cols-2 gap-5 mt-6">
              <div>
                <p className="text-sm text-slate-500 font-semibold">Status</p>
                <span
                  className={`inline-flex mt-2 px-3 py-1 rounded-md border text-sm font-black ${statusClass(status)}`}
                >
                  {status}
                </span>
              </div>

              <div>
                <p className="text-sm text-slate-500 font-semibold">
                  Lead Score
                </p>
                <span className="inline-grid mt-2 w-11 h-11 rounded-full bg-blue-50 text-slate-900 place-items-center font-black">
                  {currentLead.score || 85}
                </span>
              </div>

              <div>
                <p className="text-sm text-slate-500 font-semibold">
                  Deal Value
                </p>
                <h3 className="text-lg font-black text-slate-900 mt-2">
                  {formatValue(currentLead.value)}
                </h3>
              </div>

              <div>
                <p className="text-sm text-slate-500 font-semibold">Source</p>
                <h3 className="text-lg font-black text-slate-900 mt-2">
                  {currentLead.source || "Website"}
                </h3>
              </div>
            </div>

            <div className="h-px bg-slate-200 my-6" />

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-slate-500 mt-0.5" />
                <div>
                  <h3 className="font-bold text-slate-900">
                    {currentLead.email}
                  </h3>
                  <p className="text-sm text-slate-500">Work</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-slate-500 mt-0.5" />
                <div>
                  <h3 className="font-bold text-slate-900">
                    {currentLead.phone}
                  </h3>
                  <p className="text-sm text-slate-500">Mobile</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Building2 className="w-5 h-5 text-slate-500 mt-0.5" />
                <div>
                  <h3 className="font-bold text-slate-900">
                    {currentLead.company}
                  </h3>
                  <p className="text-sm text-slate-500">
                    Industry: Technology
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-slate-500 mt-0.5" />
                <h3 className="font-bold text-slate-900">Mumbai, India</h3>
              </div>

              <div className="flex items-start gap-3">
                <Globe className="w-5 h-5 text-slate-500 mt-0.5" />
                <h3 className="font-bold text-blue-600">
                  www.{String(currentLead.company || "company")
                    .toLowerCase()
                    .replaceAll(" ", "")}
                  .com
                </h3>
              </div>
            </div>
          </section>

          <section className="rounded-xl bg-white border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 pt-5 border-b border-slate-200">
              <div className="flex items-center gap-8">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`pb-4 text-lg font-semibold border-b-2 ${
                      activeTab === tab
                        ? "text-slate-900 border-orange-600"
                        : "text-slate-500 border-transparent"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6">
{activeTab === "Activity Timeline" && (
  <LeadActivityManager leadName={currentLead.name} />
)}

              {activeTab === "Notes" && (
                <div className="space-y-4">
                  <div className="rounded-lg border border-slate-200 p-4">
                    <textarea
                      value={noteText}
                      onChange={(event) => setNoteText(event.target.value)}
                      placeholder="Write a note..."
                      className="w-full min-h-28 outline-none resize-none text-sm"
                    />
                    <div className="flex justify-end mt-3">
                      <button
                        type="button"
                        onClick={addNote}
                        className="h-9 px-4 rounded-lg bg-orange-600 text-white text-sm font-bold"
                      >
                        Add Note
                      </button>
                    </div>
                  </div>

                  <div className="rounded-lg border border-slate-200 p-5">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-orange-600" />
                      <h3 className="font-black text-slate-900">Lead Notes</h3>
                    </div>
                    <p className="text-slate-600 mt-3">
                      Customer is interested in premium CRM plan. Follow-up required.
                    </p>
                  </div>
                </div>
              )}

              {activeTab === "Tasks" && (
                <div className="space-y-3">
                  {["Send proposal", "Schedule demo", "Final follow-up"].map((task) => (
                    <div
                      key={task}
                      className="rounded-lg border border-slate-200 p-4 flex items-center justify-between"
                    >
                      <h3 className="font-bold text-slate-900">{task}</h3>
                      <span className="px-3 py-1 rounded-full bg-orange-50 text-orange-700 text-xs font-black">
                        Pending
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </EmployeeShell>
  );
}
