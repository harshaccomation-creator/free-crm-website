export function resolveCurrentUser(inputUser = {}) {
  const storedUser = (() => {
    if (typeof window === "undefined") return {};
    const keys = ["salesflow_user", "salesflow_profile", "currentUser", "profile", "user"];
    for (const key of keys) {
      try {
        const raw = window.localStorage.getItem(key) || window.sessionStorage.getItem(key);
        if (raw) return JSON.parse(raw);
      } catch {
        // ignore bad stored profile
      }
    }
    return {};
  })();

  const user = { ...storedUser, ...inputUser };
  const email = user.email || user.user_email || user.email_address || "";
  const name = user.full_name || user.fullName || user.name || user.displayName || user.employee_name || email || "Employee";

  return {
    id: user.id || user.user_id || user.employee_id || user.auth_id || email || "current-user",
    name,
    email,
    role: user.role || "employee",
    companyId: user.company_id || user.companyId || user.company || "",
  };
}

export function isEmployeeRole(user = {}) {
  return String(user.role || "").toLowerCase() === "employee";
}
