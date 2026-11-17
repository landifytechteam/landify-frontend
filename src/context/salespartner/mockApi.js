// ---------------------------------------------------------------------------
// FAKE backend for the sales partner screens. Same function names and response
// shapes as `realApi` in partnerApi.js, so the backend dev can copy these shapes.
// Changes (new client, profile, toggles) live in memory until the page reloads.
// ---------------------------------------------------------------------------
import * as db from "./mockData";

const DAY = 86400000;
const wait = (ms = 350) => new Promise((r) => setTimeout(r, ms));
const copy = (value) => structuredClone(value);

// Errors shaped like axios errors, so getErrorMessage() reads them the same way
const fail = (message, status = 400) => {
  const error = new Error(message);
  error.response = { status, data: { message } };
  throw error;
};

const matches = (search, ...fields) =>
  !search || fields.some((f) => f?.toLowerCase().includes(search.trim().toLowerCase()));

function paginate(list, { page = 1, pageSize = 10 } = {}) {
  const start = (page - 1) * pageSize;
  return { items: list.slice(start, start + pageSize), total: list.length, page, pageSize };
}

const startOfMonth = (offset = 0) => {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth() + offset, 1).getTime();
};
const inRange = (iso, from, to = Infinity) => {
  const t = new Date(iso).getTime();
  return t >= from && t < to;
};
const sum = (list, key) => list.reduce((total, item) => total + item[key], 0);
const pct = (now, before) => (before ? Math.round(((now - before) / before) * 100) : now ? 100 : 0);

function periodBounds(period) {
  if (period === "last_month") return [startOfMonth(-1), startOfMonth(0)];
  if (period === "year") return [new Date(new Date().getFullYear(), 0, 1).getTime(), Infinity];
  return [startOfMonth(0), Infinity];
}

export const mockApi = {
  /** period: "month" (default) | "last_month" | "year" */
  async getDashboard({ period = "month" } = {}) {
    await wait();
    const [from, to] = periodBounds(period);
    const sales = db.commissions.filter((c) => inRange(c.date, from, to));
    const prevSales = db.commissions.filter((c) => inRange(c.date, startOfMonth(-1), startOfMonth(0)));
    const thisMonth = db.commissions.filter((c) => inRange(c.date, startOfMonth(0)));
    const pending = db.clients.filter((c) => c.purchaseStatus === "in_progress");

    return copy({
      stats: {
        totalClients: db.clients.length,
        clientsThisMonth: db.clients.filter((c) => inRange(c.createdAt, startOfMonth(0))).length,
        totalSales: db.commissions.length,
        salesThisMonth: thisMonth.length,
        commissionTotal: sum(db.commissions, "amount"),
        commissionChangePct: pct(sum(thisMonth, "amount"), sum(prevSales, "amount")),
      },
      performance: {
        salesValue: sum(sales, "amountPaid"),
        salesChangePct: pct(sum(sales, "amountPaid"), sum(prevSales, "amountPaid")),
        commissions: sum(sales, "amount"),
        commissionsChangePct: pct(sum(sales, "amount"), sum(prevSales, "amount")),
        pendingPayments: pending.length * 600000,
        pendingClients: pending.length,
        conversionRate: Math.round((db.commissions.length / db.clients.length) * 100),
        conversionChangePct: 8,
        salesCount: sales.length,
        monthlyTarget: db.MONTHLY_TARGET,
      },
      topProperty: db.topProperty,
    });
  },

  async getClients(params = {}) {
    await wait();
    const { search, status, propertyId, purchaseStatus } = params;
    const list = db.clients
      .filter((c) => matches(search, c.fullName, c.email, c.phone))
      .filter((c) => !status || c.status === status)
      .filter((c) => !propertyId || c.propertyId === propertyId)
      .filter((c) => !purchaseStatus || c.purchaseStatus === purchaseStatus)
      .sort((a, b) => new Date(b.lastActivityAt) - new Date(a.lastActivityAt));

    const monthStart = startOfMonth(0);
    return copy({
      ...paginate(list, params),
      summary: {
        total: db.clients.length,
        newThisMonth: db.clients.filter((c) => inRange(c.createdAt, monthStart)).length,
        active: db.clients.filter((c) => c.status === "active").length,
        activeThisMonth: db.clients.filter((c) => c.status === "active" && inRange(c.createdAt, monthStart)).length,
        pending: db.clients.filter((c) => c.status === "pending").length,
        sales: db.commissions.length,
        salesThisMonth: db.commissions.filter((c) => inRange(c.date, monthStart)).length,
      },
      // Options for the "All Properties" filter
      properties: db.propertyOptions,
    });
  },

  async createClient({ fullName, email, phone, propertyId, propertyName }) {
    await wait(500);
    if (db.clients.some((c) => c.email.toLowerCase() === email.trim().toLowerCase())) {
      fail("A client with this email is already assigned to you.", 409);
    }
    const prop = db.propertyOptions.find((p) => p.value === propertyId);
    const now = new Date().toISOString();
    const created = {
      id: `c-${Date.now()}`,
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      propertyId: propertyId ?? null,
      propertyName: prop?.label ?? propertyName ?? "Not chosen yet",
      propertyLocation: "",
      status: "pending",
      purchaseStatus: "inquiry",
      lastActivityAt: now,
      createdAt: now,
    };
    db.clients.unshift(created);
    return copy(created);
  },

  /** range: "" (all) | "30d" | "90d" | "year";  months: chart length (6 or 12) */
  async getCommissions(params = {}) {
    await wait();
    const { status, range, months = 6 } = params;
    const from = { "30d": Date.now() - 30 * DAY, "90d": Date.now() - 90 * DAY, year: new Date(new Date().getFullYear(), 0, 1).getTime() }[range] ?? 0;
    const list = db.commissions
      .filter((c) => !status || c.status === status)
      .filter((c) => inRange(c.date, from))
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    const all = db.commissions;
    const thisMonth = all.filter((c) => inRange(c.date, startOfMonth(0)));
    const unpaid = all.filter((c) => c.status !== "paid");

    // One bar pair per month, oldest first: { month: "2026-06", paid, pending }
    const monthly = Array.from({ length: Number(months) }, (_, i) => {
      const start = startOfMonth(i - Number(months) + 1);
      const end = startOfMonth(i - Number(months) + 2);
      const inMonth = all.filter((c) => inRange(c.date, start, end));
      const d = new Date(start);
      return {
        month: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
        paid: sum(inMonth.filter((c) => c.status === "paid"), "amount"),
        pending: sum(inMonth.filter((c) => c.status !== "paid"), "amount"),
      };
    });

    return copy({
      ...paginate(list, params),
      summary: {
        total: sum(all, "amount"),
        totalSales: all.length,
        paid: sum(all.filter((c) => c.status === "paid"), "amount"),
        paidCount: all.filter((c) => c.status === "paid").length,
        pending: sum(unpaid, "amount"),
        processing: sum(all.filter((c) => c.status === "processing"), "amount"),
        thisMonth: sum(thisMonth, "amount"),
        thisMonthSales: thisMonth.length,
      },
      monthly,
    });
  },

  async getCommission(id) {
    await wait();
    const found = db.commissions.find((c) => c.id === id) ?? fail("Commission not found.", 404);
    return copy(found);
  },

  /** Only the fields the login response doesn't carry; the page adds name + email from the session. */
  async getProfile() {
    await wait();
    return copy(db.profile);
  },

  async updateProfile(changes) {
    await wait(500);
    Object.assign(db.profile, changes);
    return copy(db.profile);
  },

  async getNotificationPrefs() {
    await wait();
    return copy(db.notificationPrefs);
  },

  async updateNotificationPrefs(changes) {
    await wait(250);
    Object.assign(db.notificationPrefs, changes);
    return copy(db.notificationPrefs);
  },

  async changePassword({ currentPassword, newPassword }) {
    await wait(600);
    if (!currentPassword) fail("Enter your current password.");
    if (currentPassword === newPassword) fail("Your new password must be different from the current one.");
    return { success: true };
  },
};
