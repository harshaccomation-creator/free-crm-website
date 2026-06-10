import { resolveCurrentUser } from "./currentUserResolver.js";

const norm = (value) => String(value || "").trim().toLowerCase();

export function getAccessUser(inputUser) {
  return resolveCurrentUser(inputUser);
}

export function isSuperAdmin(user) {
  return ["super_admin", "superadmin", "platform_admin"].includes(norm(user?.role));
}

export function isCompanyAdmin(user) {
  return ["admin", "company_admin", "companyadmin"].includes(norm(user?.role));
}

export function isManager(user) {
  return norm(user?.role) === "manager";
}

export function isEmployee(user) {
  return norm(user?.role) === "employee";
}

function sameCompany(record, user) {
  const recordCompany = record.companyId || record.company_id || record.company || record.tenantId || record.tenant_id;
  const userCompany = user.companyId || user.company_id || user.company || user.tenantId || user.tenant_id;
  if (!recordCompany || !userCompany) return true;
  return norm(recordCompany) === norm(userCompany);
}

function ownedByUser(record, user) {
  const userIds = [user.id, user.user_id, user.employee_id, user.auth_id, user.email, user.name].map(norm).filter(Boolean);
  const recordOwners = [
    record.ownerId,
    record.owner_id,
    record.assignedToId,
    record.assigned_to_id,
    record.employeeId,
    record.employee_id,
    record.createdById,
    record.created_by_id,
    record.ownerEmail,
    record.owner_email,
    record.assignedToEmail,
    record.assigned_to_email,
    record.owner,
    record.ownerName,
    record.owner_name,
    record.createdBy,
    record.created_by,
  ].map(norm).filter(Boolean);

  return recordOwners.some((owner) => userIds.includes(owner));
}

export function canAccessRecord(record, inputUser) {
  const user = getAccessUser(inputUser);
  if (isSuperAdmin(user)) return true;
  if (!sameCompany(record, user)) return false;
  if (isCompanyAdmin(user) || isManager(user)) return true;
  if (isEmployee(user)) return ownedByUser(record, user);
  return ownedByUser(record, user);
}

export function filterRecordsForUser(records = [], inputUser) {
  return records.filter((record) => canAccessRecord(record, inputUser));
}

export function attachOwnerToRecord(record = {}, inputUser) {
  const user = getAccessUser(inputUser);
  return {
    ...record,
    owner: user.name,
    ownerName: user.name,
    ownerId: user.id,
    ownerEmail: user.email,
    companyId: user.companyId,
    createdBy: record.createdBy || user.name,
    createdById: record.createdById || user.id,
  };
}
