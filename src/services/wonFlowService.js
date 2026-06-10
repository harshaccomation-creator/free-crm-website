import { createActivityPageState, saveActivityPageState } from "./activityPageAdapter.js";
import { exportLeadsCsv } from "./exportService.js";

const cleanAmount = (amount) => Number(String(amount || "").replace(/,/g, ""));

export function validateWonAmount(amount) {
  return cleanAmount(amount) > 0 ? {} : { amount: "Amount required" };
}

export function getWonPageState() {
  return createActivityPageState();
}

export function getWonLeads(state, fallback = []) {
  const rows = (state.leads || []).filter((lead) => lead.status === "Won");
  return rows.length ? rows : fallback;
}

export function markWon(state, leadIdOrName, amount) {
  const errors = validateWonAmount(amount);
  if (Object.keys(errors).length) return { state, errors };

  const now = new Date();
  const value = cleanAmount(amount);
  const leads = (state.leads || []).map((lead) => {
    if (lead.id !== leadIdOrName && lead.name !== leadIdOrName) return lead;
    return {
      ...lead,
      status: "Won",
      value,
      amount: value,
      closeDateISO: now.toISOString().slice(0, 10),
      closeDate: now.toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: true }),
      wonAt: now.toISOString(),
      updatedAt: now.toISOString(),
    };
  });

  const next = { ...state, leads, wonLeads: leads.filter((lead) => lead.status === "Won") };
  saveActivityPageState(next);
  return { state: next, errors: {} };
}

export function exportWonCsv(state, fallback = []) {
  return exportLeadsCsv(getWonLeads(state, fallback));
}
