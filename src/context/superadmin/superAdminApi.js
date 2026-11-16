import api from "../../api/axios";
import { mockApi } from "./mockApi";

// ---------------------------------------------------------------------------
// EVERY super admin request lives here. Pages import `superAdminApi` and never
// call axios directly, so this file is the one place to wire up the backend.
//
// While the backend endpoints don't exist yet, the fake version (mockApi.js)
// answers instead. To switch to the real backend, add this to your .env:
//     VITE_USE_MOCKS=false
// You can also switch one function at a time by editing `superAdminApi` below.
//
// TODO: the paths and query names are guesses. Confirm each one with your
// backend dev, and make sure each response has the same shape the mock returns
// (open mockApi.js to see it).
// ---------------------------------------------------------------------------

const data = (request) => request.then((res) => res.data);

const realApi = {
  // Overview + sidebar badge
  getOverview: () => data(api.get("/superadmin/overview")),
  getBadgeCounts: () => data(api.get("/superadmin/badges")),

  // Companies
  getCompanies: (params) => data(api.get("/superadmin/companies", { params })),
  getCompany: (id) => data(api.get(`/superadmin/companies/${id}`)),
  createCompany: (body) => data(api.post("/superadmin/companies", body)),
  updateCompany: (id, body) => data(api.patch(`/superadmin/companies/${id}`, body)),
  setCompanyStatus: (id, body) => data(api.patch(`/superadmin/companies/${id}/status`, body)),

  // Admin access
  getAdmins: (params) => data(api.get("/superadmin/admins", { params })),
  getPlatformAdmins: () => data(api.get("/superadmin/platform-admins")),
  inviteAdmin: (body) => data(api.post("/superadmin/admins/invitations", body)),
  resendInvite: (id) => data(api.post(`/superadmin/admins/${id}/resend-invitation`)),
  setAdminAccess: (id, body) => data(api.patch(`/superadmin/admins/${id}/access`, body)),

  // Moderation
  getModerationQueue: (params) => data(api.get("/superadmin/moderation", { params })),
  getSubmission: (id) => data(api.get(`/superadmin/moderation/${id}`)),
  approveSubmission: (id, body) => data(api.post(`/superadmin/moderation/${id}/approve`, body)),
  rejectSubmission: (id, body) => data(api.post(`/superadmin/moderation/${id}/reject`, body)),

  // Properties, audit, settings
  getProperties: (params) => data(api.get("/superadmin/properties", { params })),
  getAuditEvents: (params) => data(api.get("/superadmin/audit", { params })),
  getSettings: () => data(api.get("/superadmin/settings")),
  updateSettings: (changes) => data(api.patch("/superadmin/settings", changes)),
};

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS !== "false";

export const superAdminApi = USE_MOCKS ? mockApi : realApi;