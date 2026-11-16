// ---------------------------------------------------------------------------
// FAKE super admin data, matching the designs, so every screen works before
// the backend exists. Only mockApi.js uses this file. Delete both once the
// real endpoints are live (see superAdminApi.js).
//
// Times are relative to "now", so "2 hours ago" and "older than 48 hours"
// stay meaningful whenever you open the app.
// ---------------------------------------------------------------------------

const ago = ({ d = 0, h = 0, m = 0 }) =>
  new Date(Date.now() - ((d * 24 + h) * 60 + m) * 60000).toISOString();
const inDays = (d) => new Date(Date.now() + d * 86400000).toISOString();

export const companies = [
  {
    id: "CMP-001",
    name: "TerraVale Estates",
    legalName: "TerraVale Estates Limited",
    rcNumber: "RC 8192046",
    email: "governance@terravale.example",
    phone: "+234 800 000 0101",
    address: "18 Admiralty Way, Lekki Phase 1, Lagos State",
    city: "Lekki",
    state: "Lagos",
    status: "active",
    verified: true,
    joinedAt: "2026-01-12T10:00:00+01:00",
    lastReviewed: { by: "Amara Okafor", at: "2026-09-30T12:00:00+01:00" },
  },
  {
    id: "CMP-002",
    name: "Palmcrest Land Co.",
    legalName: "Palmcrest Land Company Limited",
    rcNumber: "RC 7730154",
    email: "admin@palmcrest.example",
    phone: "+234 800 000 0202",
    address: "4 Lekki-Epe Expressway, Epe, Lagos State",
    city: "Epe",
    state: "Lagos",
    status: "active",
    verified: true,
    joinedAt: "2026-02-03T10:00:00+01:00",
    lastReviewed: { by: "Tunde Bello", at: "2026-09-12T12:00:00+01:00" },
  },
  {
    id: "CMP-003",
    name: "CedarBridge Properties",
    legalName: "CedarBridge Properties Limited",
    rcNumber: "RC 6619873",
    email: "office@cedarbridge.example",
    phone: "+234 800 000 0303",
    address: "22 Aminu Kano Crescent, Wuse 2, Abuja",
    city: "Abuja",
    state: "FCT",
    status: "active",
    verified: true,
    joinedAt: "2026-02-18T10:00:00+01:00",
    lastReviewed: { by: "Amara Okafor", at: "2026-08-28T12:00:00+01:00" },
  },
  {
    id: "CMP-004",
    name: "Abeni Land & Homes",
    legalName: "Abeni Land and Homes Limited",
    rcNumber: "RC 5582310",
    email: "hello@abeni.example",
    phone: "+234 800 000 0404",
    address: "7 Ring Road, Ibadan, Oyo State",
    city: "Ibadan",
    state: "Oyo",
    status: "active",
    verified: true,
    joinedAt: "2026-03-09T10:00:00+01:00",
    lastReviewed: { by: "Tunde Bello", at: "2026-09-02T12:00:00+01:00" },
  },
  {
    id: "CMP-005",
    name: "Nuru Habitat",
    legalName: "Nuru Habitat Nigeria Limited",
    rcNumber: "RC 9104477",
    email: "team@nuru.example",
    phone: "+234 800 000 0505",
    address: "15 Ogui Road, Enugu, Enugu State",
    city: "Enugu",
    state: "Enugu",
    status: "under_review",
    verified: false,
    joinedAt: "2026-09-21T10:00:00+01:00",
    lastReviewed: null,
  },
  {
    id: "CMP-006",
    name: "Coastline Acreage",
    legalName: "Coastline Acreage Limited",
    rcNumber: "RC 4471209",
    email: "info@coastline.example",
    phone: "+234 800 000 0606",
    address: "9 Abak Road, Uyo, Akwa Ibom State",
    city: "Uyo",
    state: "Akwa Ibom",
    status: "suspended",
    verified: true,
    joinedAt: "2026-04-16T10:00:00+01:00",
    lastReviewed: { by: "Amara Okafor", at: ago({ d: 1, h: 2 }) },
  },
];

export const admins = [
  { id: "ADM-01", name: "Kemi Adeyemi", email: "kemi.adeyemi@terravale.example", companyId: "CMP-001", access: "active", lastActive: ago({ h: 2 }) },
  { id: "ADM-02", name: "Chidi Nwosu", email: "chidi.nwosu@terravale.example", companyId: "CMP-001", access: "active", lastActive: ago({ d: 1, h: 1 }) },
  { id: "ADM-03", name: "Zainab Musa", email: "zainab.musa@terravale.example", companyId: "CMP-001", access: "invited", expiresAt: inDays(3) },
  { id: "ADM-04", name: "Folake Akinola", email: "folake.akinola@palmcrest.example", companyId: "CMP-002", access: "active", lastActive: ago({ h: 3 }) },
  { id: "ADM-05", name: "Tunji Bakare", email: "tunji.bakare@palmcrest.example", companyId: "CMP-002", access: "active", lastActive: ago({ d: 2 }) },
  { id: "ADM-06", name: "Ife Eze", email: "ife.eze@cedarbridge.example", companyId: "CMP-003", access: "active", lastActive: ago({ h: 19 }) },
  { id: "ADM-07", name: "Musa Garba", email: "musa.garba@cedarbridge.example", companyId: "CMP-003", access: "active", lastActive: ago({ d: 3 }) },
  { id: "ADM-08", name: "Seyi Adebayo", email: "seyi.adebayo@abeni.example", companyId: "CMP-004", access: "active", lastActive: ago({ h: 21 }) },
  { id: "ADM-09", name: "Bisi Ola", email: "bisi.ola@abeni.example", companyId: "CMP-004", access: "active", lastActive: ago({ d: 4 }) },
  { id: "ADM-10", name: "Ada Nwankwo", email: "ada.nwankwo@nuru.example", companyId: "CMP-005", access: "invited", expiresAt: inDays(7) },
  { id: "ADM-11", name: "Obinna Umeh", email: "obinna.umeh@nuru.example", companyId: "CMP-005", access: "suspended", lastActive: ago({ d: 3, h: 1 }) },
  { id: "ADM-12", name: "Dele Etim", email: "dele.etim@coastline.example", companyId: "CMP-006", access: "revoked", lastActive: ago({ d: 1, h: 2 }) },
];

export const platformAdmins = [
  { id: "SUP-01", name: "Amara Okafor", email: "amara.okafor@landify.example", mfa: true },
  { id: "SUP-02", name: "Tunde Bello", email: "tunde.bello@landify.example", mfa: true },
];

// ---- Properties ------------------------------------------------------------

const images = [
  "/images/properties/royal-gardens.jpg",
  "/images/properties/palm-city.jpg",
  "/images/properties/hilltop-view.jpg",
  "/images/properties/eden-cresent.jpg",
  "/images/properties/kings-court.jpg",
  "/images/properties/the-dominion.jpg",
];

const baseDocs = [
  { name: "Governor's consent", file: "consent.pdf", size: "2.4 MB" },
  { name: "Registered survey plan", file: "survey-plan.pdf", size: "1.8 MB" },
  { name: "Deed of assignment", file: "deed.pdf", size: "3.1 MB" },
  { name: "Company registration", file: "cac.pdf", size: "0.9 MB" },
  { name: "Excision gazette", file: "gazette.pdf", size: "1.2 MB" },
];

const slug = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

let imageIndex = 0;
function makeProperty(p) {
  const docCount = p.docCount ?? 4;
  const pics = [0, 1, 2].map(() => images[imageIndex++ % images.length]);
  return {
    submissionType: "initial",
    publication: "unpublished",
    details: {
      type: "Residential land",
      plotSize: "500 m²",
      plots: 60,
      area: "3.2 hectares",
      price: 12500000,
      title: "Certificate of Occupancy",
      address: `${p.location}, Nigeria`,
      description:
        "A residential land estate with surveyed plots. Title and infrastructure claims are supplied by the submitting company.",
    },
    images: pics,
    documents: baseDocs.slice(0, docCount).map((d) => ({
      ...d,
      file: `${slug(p.name)}-${d.file}`,
      reviewed: p.moderation !== "pending",
    })),
    checklist: p.moderation === "pending" ? {} : null,
    decision: null,
    updatedAt: p.submittedAt,
    ...p,
  };
}

// The named properties from the designs
const named = [
  {
    id: "LND-0048", name: "Idera Gardens", companyId: "CMP-001", location: "Ibeju-Lekki, Lagos",
    moderation: "pending", submittedAt: ago({ h: 2 }), submittedBy: "Kemi Adeyemi",
    details: {
      type: "Residential land", plotSize: "500 m²", plots: 96, area: "4.8 hectares", price: 18500000,
      title: "Governor's consent", address: "Idera Access Road, Ibeju-Lekki, Lagos State, Nigeria",
      description:
        "A planned residential land estate with graded internal roads and surveyed plots. Title and infrastructure claims are supplied by the submitting company.",
    },
  },
  { id: "LND-0047", name: "Palmcrest Meadows", companyId: "CMP-002", location: "Epe, Lagos", moderation: "pending", submittedAt: ago({ h: 3 }), submittedBy: "Folake Akinola" },
  { id: "LND-0046", name: "Kuje Greenfields", companyId: "CMP-003", location: "Kuje, FCT", moderation: "pending", submissionType: "resubmission", submittedAt: ago({ h: 19 }), submittedBy: "Ife Eze", docCount: 5, previousRejection: "Survey plan coordinates did not match the stated site area." },
  { id: "LND-0045", name: "Abeni Hills", companyId: "CMP-004", location: "Moniya, Oyo", moderation: "pending", submittedAt: ago({ h: 21 }), submittedBy: "Seyi Adebayo", docCount: 3 },
  { id: "LND-0044", name: "Nuru Grove", companyId: "CMP-005", location: "Nsukka, Enugu", moderation: "pending", submittedAt: ago({ h: 47 }), submittedBy: "Obinna Umeh", docCount: 3 },
  { id: "LND-0043", name: "Eleranigbe Acres", companyId: "CMP-001", location: "Eleranigbe, Lagos", moderation: "pending", submittedAt: ago({ d: 3, h: 2 }), submittedBy: "Chidi Nwosu" },
  { id: "LND-0042", name: "Odo-Iragun Park", companyId: "CMP-002", location: "Epe, Lagos", moderation: "pending", submissionType: "resubmission", submittedAt: ago({ d: 4, h: 1 }), submittedBy: "Folake Akinola", previousRejection: "Deed of assignment was unsigned." },
  { id: "LND-0041", name: "Lakowe Reserve", companyId: "CMP-001", location: "Lakowe, Lagos", moderation: "pending", submittedAt: ago({ d: 4, h: 3 }), submittedBy: "Kemi Adeyemi" },
  { id: "LND-0039", name: "Aderin Court", companyId: "CMP-001", location: "Ajah, Lagos", moderation: "approved", publication: "published", submittedAt: ago({ d: 6 }), updatedAt: ago({ h: 4 }), submittedBy: "Kemi Adeyemi" },
  { id: "LND-0038", name: "Terra Haven", companyId: "CMP-001", location: "Lekki, Lagos", moderation: "approved", submittedAt: ago({ d: 9 }), updatedAt: ago({ d: 2 }), submittedBy: "Chidi Nwosu" },
  { id: "LND-0035", name: "Abeni Orchard", companyId: "CMP-004", location: "Moniya, Oyo", moderation: "approved", publication: "published", submittedAt: ago({ d: 12 }), updatedAt: ago({ d: 3 }), submittedBy: "Seyi Adebayo" },
  { id: "LND-0032", name: "Palmcrest Ridge", companyId: "CMP-002", location: "Epe, Lagos", moderation: "rejected", submittedAt: ago({ d: 10 }), updatedAt: ago({ d: 4 }), submittedBy: "Tunji Bakare", decisionReason: "Title documents did not match the registered company name." },
  { id: "LND-0029", name: "Cedar Vale", companyId: "CMP-003", location: "Lugbe, FCT", moderation: "approved", publication: "published", submittedAt: ago({ d: 20 }), updatedAt: ago({ d: 7 }), submittedBy: "Ife Eze" },
  { id: "LND-0022", name: "Terra Creek", companyId: "CMP-001", location: "Sangotedo, Lagos", moderation: "rejected", submittedAt: ago({ d: 15 }), updatedAt: ago({ d: 9 }), submittedBy: "Kemi Adeyemi", decisionReason: "Survey plan was not registered with the Surveyor-General." },
  { id: "LND-0018", name: "Coastline Fields", companyId: "CMP-006", location: "Uyo, Akwa Ibom", moderation: "archived", submittedAt: ago({ d: 40 }), updatedAt: ago({ d: 1, h: 2 }), submittedBy: "Dele Etim" },
];

// Filler properties so the totals match the designs (48 across 6 companies)
const filler = [
  ["CMP-001", "approved", "published", 7, ["Vale Park", "Lekki Pointe", "Terra Bay", "Ajah Fields", "Abijo Gardens", "Awoyaya Court", "Bogije Crest"], ["Lekki, Lagos", "Ajah, Lagos", "Abijo, Lagos"]],
  ["CMP-001", "approved", "unpublished", 1, ["Ogombo Heights"], ["Ogombo, Lagos"]],
  ["CMP-002", "approved", "published", 6, ["Palm Grove", "Epe Riverside", "Itoikin Acres", "Palm Fields", "Ketu-Epe Court", "Noforija Park"], ["Epe, Lagos"]],
  ["CMP-002", "approved", "unpublished", 1, ["Palm Terrace"], ["Epe, Lagos"]],
  ["CMP-003", "approved", "published", 5, ["Cedar Heights", "Kuje Court", "Idu Gardens", "Lugbe Crest", "Kubwa Park"], ["Kuje, FCT", "Lugbe, FCT", "Kubwa, FCT"]],
  ["CMP-003", "approved", "unpublished", 1, ["Gwagwalada Fields"], ["Gwagwalada, FCT"]],
  ["CMP-004", "approved", "published", 4, ["Abeni Court", "Akobo Gardens", "Oluyole Park", "Moniya Crest"], ["Ibadan, Oyo", "Moniya, Oyo"]],
  ["CMP-004", "approved", "unpublished", 1, ["Apata Acres"], ["Ibadan, Oyo"]],
  ["CMP-005", "approved", "published", 4, ["Nuru Court", "Independence Layout Park", "Emene Gardens", "Nsukka Heights"], ["Enugu, Enugu", "Nsukka, Enugu"]],
  ["CMP-005", "rejected", "unpublished", 1, ["Nuru Terrace"], ["Enugu, Enugu"]],
  ["CMP-006", "rejected", "unpublished", 1, ["Coastline Bay"], ["Uyo, Akwa Ibom"]],
  ["CMP-006", "archived", "unpublished", 1, ["Ibom Fields"], ["Uyo, Akwa Ibom"]],
];

const submitters = {
  "CMP-001": "Chidi Nwosu", "CMP-002": "Tunji Bakare", "CMP-003": "Musa Garba",
  "CMP-004": "Bisi Ola", "CMP-005": "Obinna Umeh", "CMP-006": "Dele Etim",
};

const usedIds = new Set(named.map((p) => p.id));
let nextId = 1;
const freeId = () => {
  while (usedIds.has(`LND-${String(nextId).padStart(4, "0")}`)) nextId++;
  const id = `LND-${String(nextId).padStart(4, "0")}`;
  usedIds.add(id);
  return id;
};

const generated = [];
filler.forEach(([companyId, moderation, publication, count, names, locations]) => {
  for (let i = 0; i < count; i++) {
    const daysAgo = 25 + generated.length * 2;
    generated.push({
      id: freeId(), name: names[i], companyId, location: locations[i % locations.length],
      moderation, publication, submittedAt: ago({ d: daysAgo }), updatedAt: ago({ d: daysAgo - 5 }),
      submittedBy: submitters[companyId],
      decisionReason: moderation === "rejected" ? "Ownership evidence was incomplete." : undefined,
    });
  }
});

export const properties = [...named, ...generated].map(makeProperty);

// Idera Gardens was fully checked in the design
properties[0].checklist = { company: true, facts: true, ownership: true, survey: true, images: true };
properties[0].checklistBy = { name: "Amara Okafor", at: ago({ h: 1 }) };
properties[0].documents.forEach((d) => (d.reviewed = true));

export const checklistItems = [
  { key: "company", label: "Company is active and registration reviewed" },
  { key: "facts", label: "Location and property facts are consistent" },
  { key: "ownership", label: "Ownership evidence reviewed" },
  { key: "survey", label: "Survey plan and boundaries reviewed" },
  { key: "images", label: "Images and listing content meet policy" },
];

export const rejectionCategories = [
  "Incomplete or missing documents",
  "Title or ownership mismatch",
  "Survey plan issue",
  "Inaccurate property facts",
  "Images or content breach policy",
  "Other",
];

// ---- Audit log -------------------------------------------------------------

export const auditEvents = [
  { id: "EVT-1032", at: ago({ h: 1, m: 40 }), actor: "Tunde Bello", actorRole: "Super administrator", scope: "TerraVale Estates", action: "Property approved", target: "Aderin Court", targetSub: "LND-0039", outcome: "success", stateChange: "Pending review → Approved" },
  { id: "EVT-1031", at: ago({ h: 2, m: 18 }), actor: "Amara Okafor", actorRole: "Super administrator", scope: "Nuru Habitat", action: "Invitation sent", target: "Ada Nwankwo", targetSub: "Company administrator", outcome: "success" },
  { id: "EVT-1030", at: ago({ h: 2 }), actor: "Kemi Adeyemi", actorRole: "Company administrator", scope: "TerraVale Estates", action: "Property submitted", target: "Idera Gardens", targetSub: "LND-0048", outcome: "success" },
  { id: "EVT-1029", at: ago({ h: 3 }), actor: "Folake Akinola", actorRole: "Company administrator", scope: "Palmcrest Land Co.", action: "Property submitted", target: "Palmcrest Meadows", targetSub: "LND-0047", outcome: "success" },
  { id: "EVT-1028", at: ago({ h: 19 }), actor: "Ife Eze", actorRole: "Company administrator", scope: "CedarBridge Properties", action: "Property resubmitted", target: "Kuje Greenfields", targetSub: "LND-0046", outcome: "success" },
  { id: "EVT-1027", at: ago({ d: 1, h: 1, m: 57 }), actor: "Dele Etim", actorRole: "Company administrator", scope: "Coastline Acreage", action: "Sign-in blocked", target: "Administrator session", targetSub: "Revoked company access", outcome: "denied" },
  { id: "EVT-1026", at: ago({ d: 1, h: 2 }), actor: "Amara Okafor", actorRole: "Super administrator", scope: "Coastline Acreage", action: "Company suspended", target: "Coastline Acreage", targetSub: "CMP-006", outcome: "success", stateChange: "Active → Suspended", reason: "Company registration renewal evidence remains outstanding. New submissions are blocked; existing publication states are unchanged." },
  { id: "EVT-1025", at: ago({ d: 1, h: 2 }), actor: "Amara Okafor", actorRole: "Super administrator", scope: "Coastline Acreage", action: "Admin access revoked", target: "Dele Etim", targetSub: "Company administrator", outcome: "success", stateChange: "Active → Revoked", reason: "Company suspended pending registration renewal." },
  { id: "EVT-1024", at: ago({ d: 3, h: 1 }), actor: "Tunde Bello", actorRole: "Super administrator", scope: "Platform-wide", action: "Security policy saved", target: "Admin session policy", targetSub: "30-minute idle timeout", outcome: "success" },
];

// Older routine events so the log has 32 entries
const routine = [
  ["Amara Okafor", "Super administrator", "Property approved", "success"],
  ["Seyi Adebayo", "Company administrator", "Property submitted", "success"],
  ["Tunde Bello", "Super administrator", "Property rejected", "success"],
  ["Chidi Nwosu", "Company administrator", "Sign-in", "success"],
  ["Musa Garba", "Company administrator", "Sign-in blocked", "denied"],
  ["Amara Okafor", "Super administrator", "Invitation sent", "success"],
];
for (let i = 0; i < 23; i++) {
  const [actor, actorRole, action, outcome] = routine[i % routine.length];
  const property = properties[10 + (i % 30)];
  const company = companies.find((c) => c.id === property.companyId);
  auditEvents.push({
    id: `EVT-${1023 - i}`,
    at: ago({ d: 3, h: 4 + i * 3 }),
    actor, actorRole, scope: company.name, action,
    target: action.startsWith("Property") ? property.name : actor,
    targetSub: action.startsWith("Property") ? property.id : actorRole,
    outcome,
  });
}

// ---- Settings --------------------------------------------------------------

export const settings = {
  values: {
    requireMfa: true,
    idleTimeout: 30,
    failedSignInLimit: 5,
    invitationValidity: 7,
    terminateOnRemoval: true,
    requireCompanyVerification: true,
    activeCompanyForApproval: true,
    requireReasons: true,
    approvalSeparateFromPublication: true,
    defaultInvitationRole: "Company admin",
    auditRetention: 365,
    appendOnlyAudit: true,
    notifyHighImpact: true,
    notifyNewSubmissions: true,
    notifySlaBreach: true,
    dailyDigest: false,
  },
  locked: [
    "activeCompanyForApproval",
    "requireReasons",
    "approvalSeparateFromPublication",
    "defaultInvitationRole",
    "appendOnlyAudit",
  ],
  meta: {
    lastChangedBy: "Tunde Bello · Super administrator",
    lastSavedAt: ago({ d: 3, h: 1 }),
    timeZone: "Africa/Lagos · UTC+1",
  },
};