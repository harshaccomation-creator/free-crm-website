import { useEffect, useMemo, useState } from "react";
import { X, Save } from "lucide-react";

const emptyLeadForm = {
  name: "",
  company: "",
  email: "",
  phone: "",
  status: "New",
  score: "Warm",
  value: "",
  source: "Website",
  industry: "",
  location: "",
  website: "",
  owner: "",
  note: "",
};

const statusOptions = ["New", "Contacted", "Qualified", "Proposal Sent", "Won", "Lost"];
const scoreOptions = ["Hot", "Warm", "Cold"];
const sourceOptions = ["Website", "Referral", "WhatsApp", "Facebook", "Instagram", "Google Ads", "Manual"];

function Field({ label, children, error, full = false }) {
  return (
    <label className={`${full ? "md:col-span-2" : ""} block`}>
      <span className="text-xs font-black text-slate-600 uppercase tracking-wide">{label}</span>
      <div className="mt-2">{children}</div>
      {error ? <p className="text-xs font-bold text-red-600 mt-1">{error}</p> : null}
    </label>
  );
}

const inputClass = "w-full h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold text-slate-900 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-300";

export default function AddLeadModal({ open, onClose, onSave }) {
  const [form, setForm] = useState(emptyLeadForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
      setForm(emptyLeadForm);
      setErrors({});
    }
  }, [open]);

  const isValid = useMemo(() => form.name.trim() && form.company.trim(), [form.name, form.company]);

  if (!open) return null;

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (!form.name.trim()) nextErrors.name = "Lead name required";
    if (!form.company.trim()) nextErrors.company = "Company required";
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    onSave?.({
      id: `lead-${Date.now()}`,
      name: form.name.trim(),
      company: form.company.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      status: form.status,
      score: form.score,
      value: form.value ? Number(form.value) : 0,
      source: form.source,
      industry: form.industry.trim(),
      location: form.location.trim(),
      website: form.website.trim(),
      owner: form.owner.trim(),
      note: form.note.trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    onClose?.();
  };

  return (
    <div className="fixed inset-0 z-[99999] bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-6">
      <div className="w-full max-w-4xl max-h-[calc(100vh-48px)] rounded-3xl bg-white border border-slate-200 shadow-2xl overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-200 flex items-start justify-between gap-4 bg-gradient-to-b from-white to-slate-50">
          <div>
            <p className="text-xs font-black text-orange-600 uppercase tracking-[0.18em]">CRM Lead</p>
            <h2 className="text-2xl font-black text-slate-900 mt-1">Add New Lead</h2>
            <p className="text-sm text-slate-500 mt-1">Fill important lead details for About card.</p>
          </div>
          <button type="button" onClick={onClose} className="w-10 h-10 rounded-xl border border-slate-200 bg-white text-slate-500 grid place-items-center hover:text-red-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="max-h-[calc(100vh-190px)] overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Lead Name *" error={errors.name}>
              <input className={inputClass} value={form.name} onChange={(e) => updateField("name", e.target.value)} placeholder="Enter lead name" />
            </Field>
            <Field label="Company *" error={errors.company}>
              <input className={inputClass} value={form.company} onChange={(e) => updateField("company", e.target.value)} placeholder="Enter company name" />
            </Field>
            <Field label="Email">
              <input className={inputClass} type="email" value={form.email} onChange={(e) => updateField("email", e.target.value)} placeholder="client@email.com" />
            </Field>
            <Field label="Phone">
              <input className={inputClass} value={form.phone} onChange={(e) => updateField("phone", e.target.value)} placeholder="+91 98765 43210" />
            </Field>
            <Field label="Status">
              <select className={inputClass} value={form.status} onChange={(e) => updateField("status", e.target.value)}>{statusOptions.map((item) => <option key={item}>{item}</option>)}</select>
            </Field>
            <Field label="Lead Score">
              <select className={inputClass} value={form.score} onChange={(e) => updateField("score", e.target.value)}>{scoreOptions.map((item) => <option key={item}>{item}</option>)}</select>
            </Field>
            <Field label="Deal Value">
              <input className={inputClass} type="number" min="0" value={form.value} onChange={(e) => updateField("value", e.target.value)} placeholder="50000" />
            </Field>
            <Field label="Source">
              <select className={inputClass} value={form.source} onChange={(e) => updateField("source", e.target.value)}>{sourceOptions.map((item) => <option key={item}>{item}</option>)}</select>
            </Field>
            <Field label="Industry">
              <input className={inputClass} value={form.industry} onChange={(e) => updateField("industry", e.target.value)} placeholder="Accounting, SaaS, Retail..." />
            </Field>
            <Field label="Location">
              <input className={inputClass} value={form.location} onChange={(e) => updateField("location", e.target.value)} placeholder="Ahmedabad, Gujarat" />
            </Field>
            <Field label="Website">
              <input className={inputClass} value={form.website} onChange={(e) => updateField("website", e.target.value)} placeholder="https://company.com" />
            </Field>
            <Field label="Owner">
              <input className={inputClass} value={form.owner} onChange={(e) => updateField("owner", e.target.value)} placeholder="Lead owner" />
            </Field>
            <Field label="Note" full>
              <textarea className="w-full min-h-[96px] rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-bold text-slate-900 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-300" value={form.note} onChange={(e) => updateField("note", e.target.value)} placeholder="Add lead note..." />
            </Field>
          </div>

          <div className="sticky bottom-0 -mx-6 -mb-6 mt-6 px-6 py-4 border-t border-slate-200 bg-slate-50/95 backdrop-blur flex justify-end gap-3">
            <button type="button" onClick={onClose} className="h-11 px-5 rounded-xl border border-slate-200 bg-white text-slate-700 font-black">Cancel</button>
            <button type="submit" disabled={!isValid} className="h-11 px-5 rounded-xl bg-orange-600 text-white font-black inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
              <Save className="w-4 h-4" /> Save Lead
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
