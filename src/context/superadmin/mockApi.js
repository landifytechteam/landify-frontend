// ---------------------------------------------------------------------------
// FAKE backend for the super admin screens. Same function names and response
// shapes as the real calls in superAdminApi.js, so pages never know which one
// they're talking to. Changes (approve, suspend, invite...) are kept in memory
// until you reload the page, and each one writes an audit event like the real
// backend should.
// ---------------------------------------------------------------------------
import * as db from "./mockData";

const ACTOR = { actor: "You", actorRole: "Super administrator" };
const DAY = 86400000;

const wait = (ms = 350) => new Promise((r) => setTimeout(r, ms));
const copy = (value) => structuredClone(value);

// Throw errors shaped like axios errors, so getErrorMessage() works the same
const fail = (message, status = 400) => {
  const error = new Error(message);
  error.response = { status, data: { message } };
  throw error;
};

const byId = (list, id, label) => list.find((item) => item.id === id) ?? fail(`${label} not found.`, 404);
const companyOf = (companyId) => db.companies.find((c) => c.id === companyId);
const stateOf = (location) => location.split(",").pop().trim();
const matches = (search, ...fields) =>
  !search || fields.some((f) => f?.toLowerCase().includes(search.trim().toLowerCase()));

function paginate(list, { page = 1, pageSize = 10 } = {}) {
  const start = (page - 1) * pageSize;
  return { items: list.slice(start, start + pageSize), total: list.length, page, pageSize };
}

function audit(event) {
  const id = `EVT-${1000 + db.auditEvents.length + 1}`;
  db.auditEvents.unshift({ id, at: new Date().toISOString(), outcome: "success", ...ACTOR, ...event });
}

const isStale = (p) => Date.now() - new Date(p.submittedAt).getTime() > 2 * DAY;
const isHold = (p) => companyOf(p.companyId).status !== "active";

function companyStats(companyId) {
  const props = db.properties.filter((p) => p.companyId === companyId);
  const admins = db.admins.filter((a) => a.companyId === companyId);
  return {
    admins: admins.length,
    activeAdmins: admins.filter((a) => a.access === "active").length,
    invitedAdmins: admins.filter((a) => a.access === "invited").length,
    properties: props.length,
    pending: props.filter((p) => p.moderation === "pending").length,
    published: props.filter((p) => p.publication === "published").length,
    approvedUnpublished: props.filter((p) => p.moderation === "approved" && p.publication === "unpublished").length,
    rejected: props.filter((p) => p.moderation === "rejected").length,
    archived: props.filter((p) => p.moderation === "archived").length,
  };
}

function propertySummary(list = db.properties) {
  return {
    total: list.length,
    published: list.filter((p) => p.publication === "published").length,
    approvedUnpublished: list.filter((p) => p.moderation === "approved" && p.publication === "unpublished").length,
    pending: list.filter((p) => p.moderation === "pending").length,
    rejected: list.filter((p) => p.moderation === "rejected").length,
    archived: list.filter((p) => p.moderation === "archived").length,
  };
}

const withCompany = (p) => ({ ...p, companyName: companyOf(p.companyId).name, companyStatus: companyOf(p.companyId).status });
const companyOptions = () => db.companies.map((c) => ({ value: c.id, label: c.name }));

// ---- Overview ---------------------------------------------------------------

async function getOverview() {
  await wait();
  const pending = db.properties.filter((p) => p.moderation === "pending");
  return copy({
    companies: {
      total: db.companies.length,
      active: db.companies.filter((c) => c.status === "active").length,
      underReview: db.companies.filter((c) => c.status === "under_review").length,
      suspended: db.companies.filter((c) => c.status === "suspended").length,
    },
    admins: {
      total: db.admins.length,
      active: db.admins.filter((a) => a.access === "active").length,
      invited: db.admins.filter((a) => a.access === "invited").length,
      restricted: db.admins.filter((a) => ["suspended", "revoked"].includes(a.access)).length,
    },
    properties: propertySummary(),
    moderation: { pending: pending.length, olderThan48h: pending.filter(isStale).length },
    recentActivity: db.auditEvents.slice(0, 4),
    pendingSubmissions: pending
      .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))
      .slice(0, 3)
      .map(withCompany),
  });
}

async function getBadgeCounts() {
  await wait(150);
  return { moderation: db.properties.filter((p) => p.moderation === "pending").length };
}

// ---- Companies --------------------------------------------------------------

async function getCompanies({ search, status, state, page, pageSize } = {}) {
  await wait();
  const list = db.companies
    .filter((c) => matches(search, c.name, c.id))
    .filter((c) => !status || c.status === status)
    .filter((c) => !state || c.state === state)
    .map((c) => ({ ...c, stats: companyStats(c.id) }));
  const underReview = db.companies.filter((c) => c.status === "under_review");
  const suspended = db.companies.filter((c) => c.status === "suspended");
  return copy({
    ...paginate(list, { page, pageSize }),
    summary: {
      total: db.companies.length,
      totalProperties: db.properties.length,
      active: db.companies.filter((c) => c.status === "active").length,
      underReview: underReview.length,
      underReviewNames: underReview.map((c) => c.name),
      suspended: suspended.length,
      suspendedNames: suspended.map((c) => c.name),
    },
    states: [...new Set(db.companies.map((c) => c.state))].sort(),
    updatedAt: new Date().toISOString(),
  });
}

async function getCompany(id) {
  await wait();
  const company = byId(db.companies, id, "Company");
  return copy({
    company,
    stats: companyStats(id),
    admins: db.admins.filter((a) => a.companyId === id),
    submissions: db.properties
      .filter((p) => p.companyId === id)
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)),
    audit: db.auditEvents.filter((e) => e.scope === company.name),
  });
}

function validateCompany(data) {
  if (!data.name?.trim()) fail("Enter the company name.");
  if (!data.rcNumber?.trim()) fail("Enter the CAC registration number.");
  if (!/^\S+@\S+\.\S+$/.test(data.email ?? "")) fail("Enter a valid company email.");
  if (!data.state?.trim()) fail("Enter the state.");
}

async function createCompany(data) {
  await wait();
  validateCompany(data);
  if (db.companies.some((c) => c.name.toLowerCase() === data.name.trim().toLowerCase())) {
    fail("A company with this name already exists.", 409);
  }
  const company = {
    id: `CMP-${String(db.companies.length + 1).padStart(3, "0")}`,
    legalName: data.name, phone: "", address: "", city: data.city || data.state,
    status: "under_review", verified: false, joinedAt: new Date().toISOString(), lastReviewed: null,
    ...data,
  };
  db.companies.push(company);
  audit({ scope: company.name, action: "Company added", target: company.name, targetSub: company.id, stateChange: "→ Under review" });
  return copy(company);
}

async function updateCompany(id, data) {
  await wait();
  validateCompany(data);
  const company = byId(db.companies, id, "Company");
  Object.assign(company, data);
  audit({ scope: company.name, action: "Company details updated", target: company.name, targetSub: company.id });
  return copy(company);
}

const statusLabel = { active: "Active", under_review: "Under review", suspended: "Suspended" };

async function setCompanyStatus(id, { status, reason }) {
  await wait();
  if (!reason?.trim()) fail("A reason is required for this change.");
  const company = byId(db.companies, id, "Company");
  const from = company.status;
  company.status = status;
  if (status === "active") company.verified = true;
  company.lastReviewed = { by: "You", at: new Date().toISOString() };
  audit({
    scope: company.name,
    action: status === "suspended" ? "Company suspended" : "Company reactivated",
    target: company.name, targetSub: company.id, reason,
    stateChange: `${statusLabel[from]} → ${statusLabel[status]}`,
  });
  // Terminate sessions on access removal: suspended companies lose admin access
  if (status === "suspended" && db.settings.values.terminateOnRemoval) {
    db.admins.filter((a) => a.companyId === id && a.access === "active").forEach((a) => (a.access = "suspended"));
  }
  return copy(company);
}

// ---- Admin access -----------------------------------------------------------

async function getAdmins({ search, companyId, access, group, page, pageSize } = {}) {
  await wait();
  const groups = {
    active: (a) => a.access === "active",
    invited: (a) => a.access === "invited",
    restricted: (a) => ["suspended", "revoked"].includes(a.access),
  };
  const list = db.admins
    .filter((a) => matches(search, a.name, a.email))
    .filter((a) => !companyId || a.companyId === companyId)
    .filter((a) => !access || a.access === access)
    .filter((a) => !group || groups[group](a))
    .map((a) => ({ ...a, companyName: companyOf(a.companyId).name }));
  const invited = db.admins.filter(groups.invited);
  return copy({
    ...paginate(list, { page, pageSize }),
    summary: {
      platform: db.platformAdmins.length,
      active: db.admins.filter(groups.active).length,
      invited: invited.length,
      invitedCompanies: [...new Set(invited.map((a) => companyOf(a.companyId).name))],
      restricted: db.admins.filter(groups.restricted).length,
      suspended: db.admins.filter((a) => a.access === "suspended").length,
      revoked: db.admins.filter((a) => a.access === "revoked").length,
    },
    companies: companyOptions(),
  });
}

async function getPlatformAdmins() {
  await wait();
  return copy(db.platformAdmins);
}

async function inviteAdmin({ email, companyId, name }) {
  await wait();
  if (!/^\S+@\S+\.\S+$/.test(email ?? "")) fail("Enter a valid email address.");
  if (!companyId) fail("Choose the company this administrator will manage.");
  if (db.admins.some((a) => a.email.toLowerCase() === email.toLowerCase())) {
    fail("This email already has an administrator account.", 409);
  }
  const company = byId(db.companies, companyId, "Company");
  if (company.status === "suspended") fail("You can't invite administrators to a suspended company.");
  const admin = {
    id: `ADM-${String(db.admins.length + 1).padStart(2, "0")}`,
    name: name?.trim() || email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
    email, companyId, access: "invited",
    expiresAt: new Date(Date.now() + db.settings.values.invitationValidity * DAY).toISOString(),
  };
  db.admins.push(admin);
  audit({ scope: company.name, action: "Invitation sent", target: admin.name, targetSub: "Company administrator" });
  return copy(admin);
}

async function resendInvite(id) {
  await wait();
  const admin = byId(db.admins, id, "Administrator");
  if (admin.access !== "invited") fail("Only pending invitations can be resent.");
  admin.expiresAt = new Date(Date.now() + db.settings.values.invitationValidity * DAY).toISOString();
  audit({ scope: companyOf(admin.companyId).name, action: "Invitation resent", target: admin.name, targetSub: "Company administrator" });
  return copy(admin);
}

const accessLabel = { active: "Active", invited: "Invited", suspended: "Suspended", revoked: "Revoked" };

async function setAdminAccess(id, { access, reason }) {
  await wait();
  if (!reason?.trim()) fail("Enter a reason for this access change.");
  const admin = byId(db.admins, id, "Administrator");
  if (admin.access === "revoked") fail("Revoked access can't be restored. Send a new invitation instead.");
  if (access === "active" && companyOf(admin.companyId).status === "suspended") {
    fail("Reactivate the company before restoring its administrators.");
  }
  const from = admin.access;
  admin.access = access;
  const verbs = { suspended: "Admin access suspended", revoked: "Admin access revoked", active: "Admin access restored" };
  audit({
    scope: companyOf(admin.companyId).name, action: verbs[access], target: admin.name,
    targetSub: "Company administrator", reason, stateChange: `${accessLabel[from]} → ${accessLabel[access]}`,
  });
  return copy(admin);
}

async function deleteUser(id) {
  await wait();
  const index = db.admins.findIndex((a) => a.id === id);
  if (index === -1) fail("Target user account not found.", 404);
  const [admin] = db.admins.splice(index, 1);
  audit({ scope: companyOf(admin.companyId).name, action: "Account deleted", target: admin.name, targetSub: "Company administrator", stateChange: "Deleted permanently" });
  return { success: true, message: "Account successfully deleted." };
}

// ---- Moderation -------------------------------------------------------------

async function getModerationQueue({ tab = "pending", search, companyId, type, flag, sort = "newest", page, pageSize } = {}) {
  await wait();
  const pending = db.properties.filter((p) => p.moderation === "pending");
  const flags = { stale: isStale, resubmission: (p) => p.submissionType === "resubmission", hold: isHold };
  const list = db.properties
    .filter((p) => p.moderation === tab)
    .filter((p) => matches(search, p.name, p.id))
    .filter((p) => !companyId || p.companyId === companyId)
    .filter((p) => !type || p.submissionType === type)
    .filter((p) => !flag || flags[flag](p))
    .sort((a, b) => (sort === "oldest" ? 1 : -1) * (new Date(a.submittedAt) - new Date(b.submittedAt)))
    .map((p) => ({ ...withCompany(p), hold: isHold(p) }));
  const firstWord = (p) => p.name.split(" ")[0];
  return copy({
    ...paginate(list, { page, pageSize }),
    summary: {
      pending: pending.length,
      pendingCompanies: new Set(pending.map((p) => p.companyId)).size,
      stale: pending.filter(isStale).length,
      staleNames: pending.filter(isStale).map(firstWord),
      resubmissions: pending.filter(flags.resubmission).length,
      hold: pending.filter(isHold).length,
      holdNames: pending.filter(isHold).flatMap((p) => [p.name, companyOf(p.companyId).name]),
    },
    tabCounts: {
      pending: pending.length,
      approved: db.properties.filter((p) => p.moderation === "approved").length,
      rejected: db.properties.filter((p) => p.moderation === "rejected").length,
      archived: db.properties.filter((p) => p.moderation === "archived").length,
    },
    companies: companyOptions(),
  });
}

async function getSubmission(id) {
  await wait();
  const property = byId(db.properties, id, "Submission");
  const company = companyOf(property.companyId);
  const queue = db.properties
    .filter((p) => p.moderation === "pending")
    .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
  const position = queue.findIndex((p) => p.id === id);
  return copy({
    ...property,
    company: { ...company, stats: companyStats(company.id) },
    queue: {
      position: position + 1,
      total: queue.length,
      prevId: position > 0 ? queue[position - 1].id : null,
      nextId: position >= 0 && position < queue.length - 1 ? queue[position + 1].id : null,
    },
    approvalBlocked:
      db.settings.values.activeCompanyForApproval && company.status !== "active"
        ? `Approval is blocked while ${company.name} is ${statusLabel[company.status].toLowerCase()}.`
        : null,
    checklistItems: db.checklistItems,
    rejectionCategories: db.rejectionCategories,
  });
}

async function approveSubmission(id, { checklist }) {
  await wait();
  const property = byId(db.properties, id, "Submission");
  const company = companyOf(property.companyId);
  if (property.moderation !== "pending") fail("This submission has already been decided.");
  if (db.settings.values.activeCompanyForApproval && company.status !== "active") {
    fail(`Approval is blocked while ${company.name} is not in active standing.`);
  }
  if (!db.checklistItems.every((item) => checklist?.[item.key])) fail("Complete every review check before approving.");
  Object.assign(property, {
    moderation: "approved", checklist, updatedAt: new Date().toISOString(),
    checklistBy: { name: "You", at: new Date().toISOString() },
    decision: { type: "approved", by: "You", at: new Date().toISOString() },
  });
  property.documents.forEach((d) => (d.reviewed = true));
  audit({ scope: company.name, action: "Property approved", target: property.name, targetSub: property.id, stateChange: "Pending review → Approved" });
  return copy(property);
}

async function rejectSubmission(id, { category, reason }) {
  await wait();
  const property = byId(db.properties, id, "Submission");
  if (property.moderation !== "pending") fail("This submission has already been decided.");
  if (!category) fail("Choose a rejection reason category.");
  if (!reason || reason.trim().length < 10) fail("Explain the issue in at least 10 characters.");
  Object.assign(property, {
    moderation: "rejected", decisionReason: `${category}: ${reason.trim()}`, updatedAt: new Date().toISOString(),
    decision: { type: "rejected", by: "You", at: new Date().toISOString() },
  });
  audit({
    scope: companyOf(property.companyId).name, action: "Property rejected", target: property.name,
    targetSub: property.id, stateChange: "Pending review → Rejected", reason: property.decisionReason,
  });
  return copy(property);
}

// ---- All properties ---------------------------------------------------------

async function getProperties({ search, companyId, state, moderation, publication, page, pageSize } = {}) {
  await wait();
  const list = db.properties
    .filter((p) => matches(search, p.name, p.id))
    .filter((p) => !companyId || p.companyId === companyId)
    .filter((p) => !state || stateOf(p.location) === state)
    .filter((p) => !moderation || p.moderation === moderation)
    .filter((p) => !publication || p.publication === publication)
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .map(withCompany);
  return copy({
    ...paginate(list, { page, pageSize }),
    summary: { ...propertySummary(), companies: db.companies.length },
    companies: companyOptions(),
    states: [...new Set(db.properties.map((p) => stateOf(p.location)))].sort(),
  });
}

// ---- Audit ------------------------------------------------------------------

async function getAuditEvents({ search, range = "7d", scope, action, outcome, page, pageSize } = {}) {
  await wait();
  const days = { "24h": 1, "7d": 7, "30d": 30 }[range];
  const list = db.auditEvents
    .filter((e) => !days || Date.now() - new Date(e.at).getTime() <= days * DAY)
    .filter((e) => matches(search, e.actor, e.target, e.targetSub, e.id))
    .filter((e) => !scope || e.scope === scope)
    .filter((e) => !action || e.action === action)
    .filter((e) => !outcome || e.outcome === outcome);
  return copy({
    ...paginate(list, { page, pageSize }),
    scopes: [...new Set(db.auditEvents.map((e) => e.scope))].sort(),
    actions: [...new Set(db.auditEvents.map((e) => e.action))].sort(),
    retentionDays: db.settings.values.auditRetention,
  });
}

// ---- Settings ---------------------------------------------------------------

async function getSettings() {
  await wait();
  return copy({
    ...db.settings,
    appliesTo: {
      companies: db.companies.length,
      adminAccounts: db.admins.length + db.platformAdmins.length,
    },
  });
}

async function updateSettings(changes) {
  await wait(500);
  const locked = Object.keys(changes).filter((key) => db.settings.locked.includes(key));
  if (locked.length) fail("Protected governance rules can't be changed.", 403);
  Object.assign(db.settings.values, changes);
  db.settings.meta.lastChangedBy = "You · Super administrator";
  db.settings.meta.lastSavedAt = new Date().toISOString();
  const count = Object.keys(changes).length;
  audit({ scope: "Platform-wide", action: "Security policy saved", target: "Platform policy", targetSub: `${count} setting${count === 1 ? "" : "s"} changed` });
  return getSettings();
}

export const mockApi = {
  getOverview, getBadgeCounts,
  getCompanies, getCompany, createCompany, updateCompany, setCompanyStatus,
  getAdmins, getPlatformAdmins, inviteAdmin, resendInvite, setAdminAccess, deleteUser,
  getModerationQueue, getSubmission, approveSubmission, rejectSubmission,
  getProperties, getAuditEvents, getSettings, updateSettings,
};