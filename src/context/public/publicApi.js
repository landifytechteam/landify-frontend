import api from "../../api/axios";

// ---------------------------------------------------------------------------
// Public storefront: no login needed.
//   GET  /public/properties?companyId&city&propertyType
//   GET  /public/properties/:id
//   POST /public/inquiries
//
// The Swagger docs don't show the property fields yet, so `toProperty` below
// accepts the common names (_id or id, title or name, ...) and turns every
// property into ONE shape for the pages. If something shows up blank, log
// the raw response and add the backend's field name here. Nowhere else.
// ---------------------------------------------------------------------------

const FALLBACK_IMAGE = "/images/properties/royal-gardens.jpg";

// Responses may be [..], { data: [..] }, { properties: [..] } or { data: { properties: [..] } }
function pickList(body) {
  if (Array.isArray(body)) return body;
  const inner = body?.data ?? body?.properties ?? body?.items ?? body?.results;
  if (Array.isArray(inner)) return inner;
  if (inner && typeof inner === "object") return pickList(inner);
  return [];
}
function pickOne(body) {
  const inner = body?.data ?? body?.property ?? body;
  return inner?.property ?? inner;
}

const text = (v) => (typeof v === "string" ? v : v?.name ?? "");
const imageUrl = (img) => (typeof img === "string" ? img : img?.url ?? img?.secure_url ?? img?.src);

/** One property, in the shape every public page uses. */
export function toProperty(raw = {}) {
  const loc = typeof raw.location === "object" && raw.location ? raw.location : {};
  const city = raw.city ?? loc.city ?? "";
  const state = raw.state ?? loc.state ?? "";
  const images = (raw.images ?? raw.photos ?? raw.media ?? (raw.image ? [raw.image] : [])).map(imageUrl).filter(Boolean);
  const company = typeof raw.company === "object" && raw.company ? raw.company : typeof raw.companyId === "object" && raw.companyId ? raw.companyId : {};

  return {
    id: raw._id ?? raw.id,
    name: raw.title ?? raw.name ?? "Untitled property",
    city,
    state,
    location: [city, state].filter(Boolean).join(", ") || (typeof raw.location === "string" ? raw.location : "") || raw.address || "Nigeria",
    address: raw.address ?? loc.address ?? "",
    price: Number(raw.pricePerPlot ?? raw.price ?? raw.amount ?? 0),
    propertyType: raw.propertyType ?? raw.type ?? "Land",
    plotSize: raw.plotSize ?? raw.size ?? raw.sizeSqm ?? null,
    plotsAvailable: raw.availablePlots ?? raw.plotsAvailable ?? raw.numberOfPlots ?? raw.totalPlots ?? null,
    title: raw.titleDocument ?? raw.documentType ?? raw.landTitle ?? null,
    description: raw.description ?? "",
    status: raw.status ?? raw.availability ?? "available",
    images: images.length ? images : [FALLBACK_IMAGE],
    companyId: company._id ?? company.id ?? (typeof raw.companyId === "string" ? raw.companyId : raw.company?.toString?.()) ?? null,
    companyName: text(raw.company) || company.name || raw.companyName || "",
    raw, // the original object, for debugging
  };
}

export const publicApi = {
  /** filters: { companyId?, city?, propertyType? }. Empty values are left out. */
  async getProperties(filters = {}) {
    const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v));
    const res = await api.get("/public/properties", { params });
    return pickList(res.data).map(toProperty);
  },

  async getProperty(id) {
    const res = await api.get(`/public/properties/${id}`);
    return toProperty(pickOne(res.data));
  },

  /** body: { companyId, propertyId, fullName, email, phone, message } */
  async submitInquiry(body) {
    const res = await api.post("/public/inquiries", body);
    return res.data;
  },
};