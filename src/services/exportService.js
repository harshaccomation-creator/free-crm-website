function csvEscape(value) {
  const text = value === null || value === undefined || value === "" ? "Not assign" : String(value);
  return `"${text.replace(/"/g, '""')}"`;
}

export function rowsToCsv(rows = [], columns = []) {
  const header = columns.map((column) => csvEscape(column.label)).join(",");
  const body = rows.map((row) => columns.map((column) => csvEscape(row[column.key])).join(",")).join("\n");
  return [header, body].filter(Boolean).join("\n");
}

export const leadExportColumns = [
  { key: "name", label: "Lead Name" },
  { key: "company", label: "Company" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Mobile" },
  { key: "source", label: "Source" },
  { key: "status", label: "Stage" },
  { key: "score", label: "Score" },
  { key: "ownerName", label: "Owner" },
  { key: "createdAt", label: "Created At" },
];

export function exportLeadsCsv(leads = []) {
  return rowsToCsv(leads, leadExportColumns);
}

export function downloadCsv(filename, csv) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
