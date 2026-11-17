import api from "../../api/axios";

// ---------------------------------------------------------------------------
// Company leads (logged-in Company Admin; the backend scopes them to the
// admin's company and answers 403 "Company context required" otherwise).
//   GET  /leads
//   POST /leads        { fullName, email, phone, status }
//   PUT  /leads/:id    { ...changed fields }
//
// Public inquiries (POST /public/inquiries) show up here as leads too.
// The response fields aren't documented yet, so `toLead` accepts common names.
// ---------------------------------------------------------------------------

// TODO: confirm the full status list with the backend dev. Only "NEW" is documented.
export const LEAD_STATUSES = [
  { value: "NEW", label: "New" },
  { value: "CONTACTED", label: "Contacted" },
  { value: "QUALIFIED", label: "Qualified" },
  { value: "CONVERTED", label: "Converted" },
  { value: "LOST", label: "Lost" },
];

function pickList(body) {
  if (Array.isArray(body)) return body;
  const inner = body?.data ?? body?.leads ?? body?.items;
  if (Array.isArray(inner)) return inner;
  if (inner && typeof inner === "object") return pickList(inner);
  return [];
}
const pickOne = (body) => body?.data?.lead ?? body?.lead ?? body?.data ?? body;

export function toLead(raw = {}) {
  const property = typeof raw.property === "object" && raw.property ? raw.property : typeof raw.propertyId === "object" && raw.propertyId ? raw.propertyId : null;
  return {
    id: raw._id ?? raw.id,
    fullName: raw.fullName ?? raw.name ?? "Unnamed lead",
    email: raw.email ?? "",
    phone: raw.phone ?? "",
    status: String(raw.status ?? "NEW").toUpperCase(),
    message: raw.message ?? raw.notes ?? "",
    source: raw.source ?? (raw.propertyId || raw.property ? "Website inquiry" : "Added manually"),
    propertyName: property?.title ?? property?.name ?? "",
    createdAt: raw.createdAt ?? raw.created_at ?? null,
  };
}

export const leadsApi = {
  async getLeads() {
    const res = await api.get("/leads");
    return pickList(res.data).map(toLead);
  },
  async createLead(body) {
    const res = await api.post("/leads", body);
    return toLead(pickOne(res.data));
  },
  /** changes: e.g. { status: "CONTACTED" }. The page updates its own copy of the lead. */
  async updateLead(id, changes) {
    const res = await api.put(`/leads/${id}`, changes);
    return res.data;
  },
};