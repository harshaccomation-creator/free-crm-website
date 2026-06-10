function readStorageValue(key) {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(key) || window.sessionStorage.getItem(key) || "";
}

function readJsonUser() {
  if (typeof window === "undefined") return {};
  const keys = ["salesflow_user", "salesflow_profile", "currentUser", "profile", "user"];
  for (const key of keys) {
    try {
      const raw = readStorageValue(key);
      if (raw) return JSON.parse(raw);
    } catch {
      // ignore bad stored profile
    }
  }
  return {};
}

function cleanText(value) {
  return String(value || "").trim();
}

function nameFromEmail(email = "") {
  const local = String(email || "").split("@")[0] || "";
  const cleaned = local.replace(/[._-]+/g, " ").trim();
  if (!cleaned) return "Employee";
  return cleaned.replace(/\b\w/g, (char) => char.toUpperCase());
}

export function resolveCurrentUser(inputUser = {}) {
  const storedUser = readJsonUser();
  const scalarUser = {
    id: readStorageValue("salesflow_user_id") || readStorageValue("user_id"),
    email: readStorageValue("salesflow_user_email") || readStorageValue("user_email") || readStorageValue("email"),
    name: readStorageValue("salesflow_user_name") || readStorageValue("salesflow_full_name") || readStorageValue("full_name") || readStorageValue("user_name"),
    role: readStorageValue("salesflow_user_role") || readStorageValue("salesflowRole") || readStorageValue("role"),
    companyId: readStorageValue("salesflow_company_id") || readStorageValue("company_id") || readStorageValue("companyId"),
  };

  const user = { ...scalarUser, ...storedUser, ...inputUser };
  const email = cleanText(user.email || user.user_email || user.email_address || scalarUser.email);
  const rawName = cleanText(user.full_name || user.fullName || user.name || user.displayName || user.employee_name || scalarUser.name);
  const name = rawName && rawName.toLowerCase() !== "employee" ? rawName : nameFromEmail(email);

  return {
    id: cleanText(user.id || user.user_id || user.employee_id || user.auth_id || scalarUser.id || email || "current-user"),
    name,
    email,
    role: cleanText(user.role || scalarUser.role || "employee").toLowerCase().replace(/[\s-]+/g, "_"),
    companyId: cleanText(user.company_id || user.companyId || user.company || scalarUser.companyId),
  };
}

export function isEmployeeRole(user = {}) {
  return String(user.role || "").toLowerCase() === "employee";
}
