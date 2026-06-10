const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MOBILE_PATTERN = /^[6-9]\d{9}$/;

export function validateLeadForm(values = {}) {
  const errors = {};

  if (!String(values.name || "").trim()) errors.name = "Name is required";
  if (!String(values.email || "").trim()) errors.email = "Email is required";
  if (values.email && !EMAIL_PATTERN.test(String(values.email).trim())) errors.email = "Enter a valid email";
  if (!String(values.phone || "").trim()) errors.phone = "Mobile number is required";
  if (values.phone) {
    const mobile = String(values.phone).replace(/\D/g, "").slice(-10);
    if (!MOBILE_PATTERN.test(mobile)) errors.phone = "Enter a valid Indian mobile number";
  }
  if (!String(values.source || "").trim()) errors.source = "Source is required";

  return errors;
}

export function validateActivityForm(activity = {}) {
  const errors = {};
  const type = String(activity.type || activity.status || "").toLowerCase();

  if (type.includes("lost") && !String(activity.note || "").trim()) {
    errors.note = "Note is required when marking lead as lost";
  }

  return errors;
}

export function safeValue(value, fallback = "Not assign") {
  if (value === null || value === undefined || value === "") return fallback;
  return value;
}
