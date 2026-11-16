import { Link } from "react-router-dom";
import { AlertCircle, ArrowDown, BarChart2, Info, LoaderCircle, ShieldCheck } from "lucide-react";

/** Eyebrow + big title + subtitle at the top of a dashboard page, with optional actions. */
export function PageHeader({ eyebrow, title, subtitle, actions, children }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        {eyebrow && <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">{eyebrow}</p>}
        <h1 className="mt-2 text-3xl tracking-tight text-ink sm:text-[34px]">{title}</h1>
        {subtitle && <p className="mt-2 text-[15px] text-body">{subtitle}</p>}
        {children}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap gap-3">{actions}</div>}
    </div>
  );
}

/**
 * Number tile.
 * - `tone="dark"` is the green highlighted version.
 * - Pass `onClick` to make it a filter button; `active` then shows it highlighted.
 * - `onDetails` shows the small arrow button (e.g. scroll to a breakdown).
 */
export function StatCard({ label, value, detail, icon: Icon = BarChart2, tone, active, onClick, onDetails }) {
  const dark = tone === "dark" || active;
  const Tag = onClick ? "button" : "div";
  return (
    <Tag
      type={onClick ? "button" : undefined}
      onClick={onClick}
      aria-pressed={onClick ? Boolean(active) : undefined}
      className={`flex flex-col rounded-xl border p-5 text-left transition-colors ${
        dark ? "border-brand-900 bg-brand-900 text-white" : "border-line bg-white"
      } ${onClick && !dark ? "hover:border-brand-600/50" : ""} ${onClick ? "cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600" : ""}`}
    >
      <div className="flex w-full items-start justify-between gap-3">
        <p className={`text-sm ${dark ? "text-white/80" : "text-body"}`}>{label}</p>
        {Icon && (
          <Icon className={`h-5 w-5 shrink-0 ${dark ? "text-gold-500" : "text-brand-600"}`} strokeWidth={1.6} aria-hidden />
        )}
      </div>
      <p className={`mt-3 text-4xl font-semibold ${dark ? "text-[#f6ecc9]" : "text-ink"}`}>{value ?? "–"}</p>
      <div className="mt-3 flex w-full items-center justify-between gap-2">
        <p className={`text-xs ${dark ? "text-white/80" : "text-body"}`}>{detail}</p>
        {onDetails && (
          <button
            type="button"
            onClick={onDetails}
            className="rounded p-0.5 text-brand-600 hover:bg-brand-50"
            aria-label={`More about ${label}`}
          >
            <ArrowDown className="h-4 w-4" />
          </button>
        )}
      </div>
    </Tag>
  );
}

export function StatGrid({ children }) {
  return <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{children}</div>;
}

/** White card with a title row; `footer` renders in a grey strip at the bottom. */
export function Panel({ title, subtitle, action, footer, children, className = "", bodyClassName = "", id, flush }) {
  return (
    <section id={id} className={`flex flex-col overflow-hidden rounded-xl border border-line bg-white ${className}`}>
      {(title || action) && (
        <div className="flex flex-col gap-3 px-5 pt-5 sm:flex-row sm:items-start sm:justify-between sm:px-6">
          <div className="min-w-0">
            {title && <h2 className="text-lg font-semibold text-ink">{title}</h2>}
            {subtitle && <p className="mt-1 text-sm text-body">{subtitle}</p>}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
      <div className={`flex-1 ${flush ? "pt-5" : "px-5 pb-5 pt-5 sm:px-6"} ${bodyClassName}`}>{children}</div>
      {footer && <div className="border-t border-line bg-canvas px-5 py-3 text-xs text-body sm:px-6">{footer}</div>}
    </section>
  );
}

/** Small grey pill, e.g. "48 total". */
export function Pill({ children, className = "" }) {
  return <span className={`inline-block shrink-0 rounded-full bg-canvas px-3 py-1 text-xs font-medium text-body ${className}`}>{children}</span>;
}

// Colour for every status word used on the platform
const badgeTones = {
  green: "bg-brand-50 text-brand-600",
  gold: "bg-[#f6ecc9] text-[#8a6a10]",
  red: "bg-red-50 text-red-700",
  grey: "bg-canvas text-body",
};
const statusTone = {
  active: "green", success: "green", approved: "green", published: "green", reviewed: "green", verified: "green", saved: "green", mfa: "green",
  pending: "gold", invited: "gold", under_review: "gold", hold: "gold", unsaved: "gold",
  rejected: "red", suspended: "red", revoked: "red", denied: "red",
};
const statusText = {
  active: "Active", success: "Success", approved: "Approved", published: "Published", reviewed: "Reviewed",
  pending: "Pending review", invited: "Invited", under_review: "Under review", rejected: "Rejected",
  suspended: "Suspended", revoked: "Revoked", denied: "Denied", unpublished: "Unpublished", archived: "Archived",
  initial: "Initial submission", resubmission: "Resubmission", hold: "Company under review",
};

/** Coloured status pill. `status` picks colour + default text; `children` overrides the text. */
export function StatusBadge({ status, children, tone }) {
  const t = tone ?? statusTone[status] ?? "grey";
  return (
    <span className={`inline-flex shrink-0 items-center whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${badgeTones[t]}`}>
      {children ?? statusText[status] ?? status}
    </span>
  );
}

/** Full-width info strip. tone: "green" (default) or "gold". */
export function Notice({ title, children, tone = "green", icon }) {
  const Icon = icon ?? (tone === "gold" ? Info : ShieldCheck);
  const styles = tone === "gold" ? "border-gold-500/40 bg-[#fbf6e6] [&_svg]:text-[#8a6a10]" : "border-brand-600/20 bg-brand-50 [&_svg]:text-brand-600";
  return (
    <div className={`flex gap-3 rounded-xl border px-5 py-4 ${styles}`}>
      <Icon className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
      <div className="text-sm">
        {title && <p className="font-semibold text-ink">{title}</p>}
        {children && <div className="mt-0.5 text-body">{children}</div>}
      </div>
    </div>
  );
}

const buttonStyles = {
  primary: "bg-brand-600 text-white hover:bg-brand-700 border-brand-600",
  secondary: "bg-white text-brand-600 border-line hover:border-brand-600",
  danger: "bg-white text-red-700 border-red-300 hover:border-red-600 hover:bg-red-50",
  ghost: "border-transparent text-brand-600 hover:underline px-0",
};

/** Button with variants and a spinner. Pass `to` to render a router Link instead. */
export function Button({ variant = "secondary", icon: Icon, loading, children, to, className = "", ...props }) {
  const classes = `inline-flex h-11 items-center justify-center gap-2 rounded-md border px-4 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${buttonStyles[variant]} ${className}`;
  const content = (
    <>
      {loading ? <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden /> : Icon && <Icon className="h-4 w-4" aria-hidden />}
      {children}
    </>
  );
  if (to) return <Link to={to} className={classes}>{content}</Link>;
  return (
    <button type="button" {...props} disabled={loading || props.disabled} className={classes}>
      {content}
    </button>
  );
}

/** "Companies / TerraVale Estates / Governance" */
export function Breadcrumbs({ items }) {
  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm text-body">
      {items.map((item, i) => (
        <span key={item.label} className="flex items-center gap-1.5">
          {i > 0 && <span aria-hidden>/</span>}
          {item.to ? <Link to={item.to} className="hover:text-brand-600 hover:underline">{item.label}</Link> : <span>{item.label}</span>}
        </span>
      ))}
    </nav>
  );
}

/** Label-over-value pairs in a grid, e.g. company information. */
export function DetailList({ items, columns = 2 }) {
  const cols = { 1: "", 2: "sm:grid-cols-2", 3: "sm:grid-cols-3" }[columns];
  return (
    <dl className={`grid gap-x-8 gap-y-6 ${cols}`}>
      {items.map((item) => (
        <div key={item.label} className={item.wide ? "sm:col-span-full" : ""}>
          <dt className="text-sm text-body">{item.label}</dt>
          <dd className="mt-1.5 font-semibold text-ink">{item.value || "–"}</dd>
        </div>
      ))}
    </dl>
  );
}

export function LoadingState({ label = "Loading…" }) {
  return (
    <div className="flex items-center justify-center gap-2 py-16 text-sm text-body">
      <LoaderCircle className="h-5 w-5 animate-spin text-brand-600" aria-hidden />
      {label}
    </div>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-6 py-10 text-center">
      <AlertCircle className="h-6 w-6 text-red-600" aria-hidden />
      <p className="text-sm text-red-700">{message}</p>
      {onRetry && <Button onClick={onRetry}>Try again</Button>}
    </div>
  );
}

/** Red text under a form when an action fails. */
export function FormError({ children }) {
  if (!children) return null;
  return (
    <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
      {children}
    </p>
  );
}