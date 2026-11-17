import { Link } from "react-router-dom";
import { ArrowUp, ChevronLeft } from "lucide-react";
import { StatusBadge } from "../dashboard/ui";
import { useReveal } from "../ui/useReveal";
import { statusInfo } from "../../context/salespartner/partnerApi";

const initialsOf = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");

/** Round initials badge. TODO: show the photo once the backend stores one (no field yet). */
export function Avatar({ name, size = "md" }) {
  const sizes = { sm: "h-8 w-8 text-[11px]", md: "h-10 w-10 text-xs", lg: "h-14 w-14 text-base" };
  return (
    <span className={`flex shrink-0 items-center justify-center rounded-full bg-brand-50 font-semibold text-brand-700 ${sizes[size]}`} aria-hidden>
      {initialsOf(name) || "?"}
    </span>
  );
}

/** "↑ +3 this month" in green. Hidden when there's nothing to say. */
export function Trend({ children, up = true }) {
  if (children == null) return null;
  return (
    <p className="mt-3 flex items-center gap-1 text-xs text-brand-600">
      {up && <ArrowUp className="h-3.5 w-3.5" aria-hidden />}
      {children}
    </p>
  );
}

/**
 * Number tile from the partner designs: label, icon in a tinted square, big value.
 * `highlight` gives the soft gold card used for money figures.
 */
export function PartnerStat({ label, value, icon: Icon, highlight, children }) {
  const reveal = useReveal();
  return (
    <div
      {...reveal}
      className={`rounded-xl border p-5 transition-shadow duration-300 hover:shadow-[0_12px_30px_-20px_rgba(19,38,30,0.45)] ${
        highlight ? "border-gold-500/40 bg-[#fffaeb]" : "border-line bg-white"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm text-ink">{label}</p>
        {Icon && (
          <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${highlight ? "bg-gold-500/20 text-[#8a6a10]" : "bg-brand-50 text-brand-600"}`}>
            <Icon className="h-5 w-5" strokeWidth={1.7} aria-hidden />
          </span>
        )}
      </div>
      <p className="mt-2 truncate text-2xl font-semibold tracking-tight text-ink 2xl:text-3xl" title={typeof value === "string" ? value : undefined}>{value ?? "–"}</p>
      {children}
    </div>
  );
}

/** Coloured pill for any value in CLIENT_STATUSES / PURCHASE_STATUSES / COMMISSION_STATUSES. */
export function PartnerBadge({ list, value }) {
  const info = statusInfo(list, value);
  return <StatusBadge tone={info.tone}>{info.label}</StatusBadge>;
}

/**
 * Outlined "‹ Back to …" button. Relative paths count URL segments
 * (relative="path"), so ".." from /salespartner/commissions/cm-1 goes to
 * /salespartner/commissions, not up to the dashboard.
 */
export function BackLink({ to, children }) {
  return (
    <Link
      to={to}
      relative="path"
      className="inline-flex h-9 items-center gap-1 rounded-md border border-brand-600 px-3 text-sm font-medium text-brand-600 transition-colors hover:bg-brand-50"
    >
      <ChevronLeft className="h-4 w-4" aria-hidden />
      {children}
    </Link>
  );
}
