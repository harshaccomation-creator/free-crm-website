import React, { useEffect, useMemo, useState } from "react";

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

const statusOptions = [
  "New",
  "Contacted",
  "Qualified",
  "Proposal Sent",
  "Won",
  "Lost",
];

const scoreOptions = ["Hot", "Warm", "Cold"];

const sourceOptions = [
  "Website",
  "Referral",
  "WhatsApp",
  "Facebook",
  "Instagram",
  "Google Ads",
  "Manual",
];

export default function AddLeadModal({ open, onClose, onSave }) {
  const [form, setForm] = useState(emptyLeadForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
      setForm(emptyLeadForm);
      setErrors({});
    }
  }, [open]);

  const isValid = useMemo(() => {
    return form.name.trim() && form.company.trim();
  }, [form.name, form.company]);

  if (!open) return null;

  const updateField = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [field]: "",
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const nextErrors = {};

    if (!form.name.trim()) {
      nextErrors.name = "Lead name required";
    }

    if (!form.company.trim()) {
      nextErrors.company = "Company required";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    const newLead = {
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
    };

    onSave?.(newLead);
    onClose?.();
  };

  return (
    <div className="sf-modal-backdrop" role="presentation">
      <div className="sf-add-lead-modal" role="dialog" aria-modal="true">
        <div className="sf-add-lead-header">
          <div>
            <p className="sf-modal-kicker">CRM Lead</p>
            <h2>Add New Lead</h2>
            <span>Fill all important lead details for the About card.</span>
          </div>

          <button
            type="button"
            className="sf-modal-close"
            onClick={onClose}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="sf-add-lead-form">
          <div className="sf-form-grid">
            <label>
              Lead Name *
              <input
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
                placeholder="Enter lead name"
              />
              {errors.name ? <small>{errors.name}</small> : null}
            </label>

            <label>
              Company *
              <input
                value={form.company}
                onChange={(e) => updateField("company", e.target.value)}
                placeholder="Enter company name"
              />
              {errors.company ? <small>{errors.company}</small> : null}
            </label>

            <label>
              Email
              <input
                type="email"
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
                placeholder="client@email.com"
              />
            </label>

            <label>
              Phone
              <input
                value={form.phone}
                onChange={(e) => updateField("phone", e.target.value)}
                placeholder="+91 98765 43210"
              />
            </label>

            <label>
              Status
              <select
                value={form.status}
                onChange={(e) => updateField("status", e.target.value)}
              >
                {statusOptions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Lead Score
              <select
                value={form.score}
                onChange={(e) => updateField("score", e.target.value)}
              >
                {scoreOptions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Deal Value
              <input
                type="number"
                min="0"
                value={form.value}
                onChange={(e) => updateField("value", e.target.value)}
                placeholder="50000"
              />
            </label>

            <label>
              Source
              <select
                value={form.source}
                onChange={(e) => updateField("source", e.target.value)}
              >
                {sourceOptions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Industry
              <input
                value={form.industry}
                onChange={(e) => updateField("industry", e.target.value)}
                placeholder="Accounting, SaaS, Retail..."
              />
            </label>

            <label>
              Location
              <input
                value={form.location}
                onChange={(e) => updateField("location", e.target.value)}
                placeholder="Ahmedabad, Gujarat"
              />
            </label>

            <label>
              Website
              <input
                value={form.website}
                onChange={(e) => updateField("website", e.target.value)}
                placeholder="https://company.com"
              />
            </label>

            <label>
              Owner
              <input
                value={form.owner}
                onChange={(e) => updateField("owner", e.target.value)}
                placeholder="Lead owner"
              />
            </label>
          </div>

          <label className="sf-form-full">
            Note
            <textarea
              value={form.note}
              onChange={(e) => updateField("note", e.target.value)}
              placeholder="Add lead note..."
              rows={4}
            />
          </label>

          <div className="sf-add-lead-actions">
            <button type="button" className="sf-btn-secondary" onClick={onClose}>
              Cancel
            </button>

            <button
              type="submit"
              className="sf-btn-primary"
              disabled={!isValid}
            >
              Save Lead
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
