// ---------------------------------------------------------------------------
// Super admin overview: PLACEHOLDER numbers copied from the design.
// YOUR TURN: replace each with a call in the page (see the TODOs there), e.g.
//   GET /superadmin/overview  -> stats + portfolio
//   GET /superadmin/audit?limit=4
//   GET /superadmin/moderation?status=pending&limit=3
// Ask the backend dev for the real paths and response shapes.
// ---------------------------------------------------------------------------

export const overviewStats = {
  companies: { total: 6, active: 4, underReview: 1, suspended: 1 },
  admins: { total: 12, active: 8, invited: 2, restricted: 2 },
  properties: { total: 48, published: 29, approvedUnpublished: 5 },
  moderation: { pending: 8, olderThan48h: 3 },
};

// Order here is the order of the bars and the legend.
export const portfolio = [
  { key: "published", label: "Published", short: "Pub.", count: 29, color: "bg-brand-600" },
  { key: "approved", label: "Approved, unpublished", short: "Appr.", count: 5, color: "bg-brand-900" },
  { key: "pending", label: "Pending review", short: "Pend.", count: 8, color: "bg-gold-500" },
  { key: "rejected", label: "Rejected", short: "Rej.", count: 4, color: "bg-[#b9776a]" },
  { key: "archived", label: "Archived", short: "Arch.", count: 2, color: "bg-line" },
];

// `type` picks the icon in the activity list.
export const recentActivity = [
  {
    id: 1,
    type: "approved",
    title: "Submission approved",
    detail: "Aderin Court · TerraVale Estates",
    actor: "Tunde Bello",
    at: "2026-10-06T10:58:00+01:00",
  },
  {
    id: 2,
    type: "invited",
    title: "Administrator invited",
    detail: "Nuru Habitat · Company scope",
    actor: "Amara Okafor",
    at: "2026-10-06T10:20:00+01:00",
  },
  {
    id: 3,
    type: "submitted",
    title: "New property submitted",
    detail: "Idera Gardens · TerraVale Estates",
    actor: "Kemi Adeyemi",
    at: "2026-10-06T09:42:00+01:00",
  },
  {
    id: 4,
    type: "company",
    title: "Company status changed",
    detail: "Coastline Acreage · Suspended",
    actor: "Amara Okafor",
    at: "2026-10-05T16:12:00+01:00",
  },
];

export const pendingSubmissions = [
  {
    id: "LND-0048",
    property: "Island",
    company: "Adron Home",
    location: "Ibadan",
    submittedAt: "2026-10-06T09:42:00+01:00",
  },
  {
    id: "LND-0047",
    property: "Palmcrest Meadows",
    company: "Palmcrest Land Co.",
    location: "Epe, Lagos",
    submittedAt: "2026-10-06T08:15:00+01:00",
  },
  {
    id: "LND-0046",
    property: "Kuje Greenfields",
    company: "CedarBridge Properties",
    location: "Kuje, FCT",
    submittedAt: "2026-10-05T16:30:00+01:00",
  },
];