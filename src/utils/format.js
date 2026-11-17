// Date helpers. Every timestamp on the platform is shown in Lagos time (WAT).

const lagos = (options) => new Intl.DateTimeFormat("en-GB", { timeZone: "Africa/Lagos", ...options });

const toDate = (value) => (value instanceof Date ? value : new Date(value));

/** "09:42" */
export const timeWAT = (value) =>
  lagos({ hour: "2-digit", minute: "2-digit", hour12: false }).format(toDate(value));

/** "06 Oct" */
export const dayMonth = (value) => lagos({ day: "2-digit", month: "short" }).format(toDate(value));

/** "2026" */
export const yearOf = (value) => lagos({ year: "numeric" }).format(toDate(value));

/** "06 Oct 2026" */
export const fullDate = (value) =>
  lagos({ day: "2-digit", month: "short", year: "numeric" }).format(toDate(value));

/** "06 Oct 2026, 09:42 WAT" */
export const fullDateTime = (value) => `${fullDate(value)}, ${timeWAT(value)} WAT`;

/** "2 hours ago", "1 day ago", "3 days ago" */
export function timeAgo(value) {
  const minutes = Math.round((Date.now() - toDate(value).getTime()) / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}

/** ₦18,500,000 */
export const naira = (amount) =>
  new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(amount);