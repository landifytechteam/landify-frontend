import api from "../../api/axios";
import { publicApi } from "../public/publicApi";
import { mockApi } from "./mockApi";

// ---------------------------------------------------------------------------
// EVERY sales partner request lives here. Pages import `partnerApi` and never
// call axios directly, so this is the one file to change when the backend grows.
//
// ✅ LIVE today:  properties (GET /public/properties?companyId=…, /public/properties/:id)
// ❌ NOT BUILT on the backend yet (all answer 404). The paths below are a
//    PROPOSAL for the backend dev; mock data answers while VITE_USE_MOCKS is on
//    (the default). Each response must have the shape the mock returns, see
//    mockApi.js. Set VITE_USE_MOCKS=false in .env to hit the real paths.
//
//   GET   /partner/dashboard?period=month|last_month|year
//   GET   /partner/clients?search&status&propertyId&purchaseStatus&page&pageSize
//   POST  /partner/clients                { fullName, email, phone, propertyId?, notes? }
//   GET   /partner/commissions?status&range&page&pageSize
//   GET   /partner/commissions/:id
//   GET   /users/me                       → { fullName, email, phone, companyName, emailVerified }
//   PATCH /users/me                       { fullName?, phone? }
//   GET   /users/me/notification-preferences
//   PATCH /users/me/notification-preferences   { clientAssigned: false, ... }
//   PUT   /auth/change-password           { currentPassword, newPassword }  (401 = wrong current)
// ---------------------------------------------------------------------------

// Status values shared by the pages, the filters and the mock data
export const CLIENT_STATUSES = [
  { value: "active", label: "Active", tone: "green" },
  { value: "pending", label: "Pending", tone: "gold" },
];
export const PURCHASE_STATUSES = [
  { value: "inquiry", label: "Inquiry", tone: "grey" },
  { value: "in_progress", label: "Payment in progress", tone: "gold" },
  { value: "completed", label: "Completed", tone: "blue" },
];
export const COMMISSION_STATUSES = [
  { value: "pending", label: "Pending", tone: "gold" },
  { value: "processing", label: "Processing", tone: "blue" },
  { value: "paid", label: "Paid", tone: "green" },
];
export const NOTIFICATION_TYPES = [
  { key: "clientAssigned", label: "New Client Assigned", detail: "When a client is assigned to you" },
  { key: "clientPurchase", label: "Client Purchase Updates", detail: "Changes to your clients' purchases" },
  { key: "payments", label: "Payment Updates", detail: "Client payment confirmations" },
  { key: "commissions", label: "Commission Updates", detail: "Earnings and payout notifications" },
  { key: "properties", label: "Property Updates", detail: "New listings and availability changes" },
  { key: "system", label: "System Notifications", detail: "Important account and service alerts" },
];

/** { value, label, tone } for a status value, from one of the lists above. */
export const statusInfo = (list, value) => list.find((s) => s.value === value) ?? { value, label: value, tone: "grey" };

const data = (request) => request.then((res) => res.data?.data ?? res.data);

const realApi = {
  getDashboard: (params) => data(api.get("/partner/dashboard", { params })),
  getClients: (params) => data(api.get("/partner/clients", { params })),
  createClient: (body) => data(api.post("/partner/clients", body)),
  getCommissions: (params) => data(api.get("/partner/commissions", { params })),
  getCommission: (id) => data(api.get(`/partner/commissions/${id}`)),
  getProfile: () => data(api.get("/users/me")),
  updateProfile: (body) => data(api.patch("/users/me", body)),
  getNotificationPrefs: () => data(api.get("/users/me/notification-preferences")),
  updateNotificationPrefs: (changes) => data(api.patch("/users/me/notification-preferences", changes)),
  changePassword: (body) => data(api.put("/auth/change-password", body)),
};

// ✅ LIVE: the company's approved, listed properties. Always the real backend.
const liveApi = {
  /** `companyId` = the partner's company, so they only see what they can sell. */
  getProperties: ({ companyId } = {}) => publicApi.getProperties({ companyId }),
  getProperty: (id) => publicApi.getProperty(id),
};

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS !== "false";

export const partnerApi = {
  ...(USE_MOCKS ? mockApi : realApi),
  ...liveApi,
};
