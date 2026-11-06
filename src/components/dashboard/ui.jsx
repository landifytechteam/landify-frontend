import { ArrowDown } from "lucide-react";

/** Eyebrow + big title + subtitle at the top of a dashboard page, with optional actions. */
export function PageHeader({ eyebrow, title, subtitle, actions }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">{eyebrow}</p>
        <h1 className="mt-2 text-3xl tracking-tight text-ink sm:text-[34px]">{title}</h1>
        {subtitle && <p className="mt-2 text-[15px] text-body">{subtitle}</p>}
      </div>
      {actions && <div className="flex shrink-0 gap-3">{actions}</div>}
    </div>
  );
}

/**
 * Number tile. `tone="dark"` is the green highlighted version.
 * `onDetails` shows the small arrow button (e.g. scroll to a breakdown).
 */
export function StatCard({ label, value, detail, icon: Icon, tone = "light", onDetails }) {
  const dark = tone === "dark";
  return (
    <div
      className={`flex flex-col rounded-xl border p-5 ${
        dark ? "border-brand-900 bg-brand-900 text-white" : "border-line bg-white"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <p className={`text-sm ${dark ? "text-white/80" : "text-body"}`}>{label}</p>
        {Icon && (
          <Icon
            className={`h-5 w-5 shrink-0 ${dark ? "text-gold-500" : "text-brand-600"}`}
            strokeWidth={1.6}
            aria-hidden
          />
        )}
      </div>
      <p className={`mt-3 text-4xl font-semibold ${dark ? "text-[#f6ecc9]" : "text-ink"}`}>{value}</p>
      <div className="mt-3 flex items-center justify-between gap-2">
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
    </div>
  );
}

/** White card with a title row; `footer` renders in a grey strip at the bottom. */
export function Panel({ title, subtitle, action, footer, children, className = "", id }) {
  return (
    <section id={id} className={`flex flex-col overflow-hidden rounded-xl border border-line bg-white ${className}`}>
      <div className="flex items-start justify-between gap-4 px-5 pt-5 sm:px-6">
        <div>
          <h2 className="text-lg font-semibold text-ink">{title}</h2>
          {subtitle && <p className="mt-1 text-sm text-body">{subtitle}</p>}
        </div>
        {action}
      </div>
      <div className="flex-1 px-5 pb-5 pt-5 sm:px-6">{children}</div>
      {footer && <div className="border-t border-line bg-canvas px-5 py-3 text-xs text-body sm:px-6">{footer}</div>}
    </section>
  );
}

/** Small grey pill, e.g. "48 total". */
export function Pill({ children }) {
  return <span className="shrink-0 rounded-full bg-canvas px-3 py-1 text-xs font-medium text-body">{children}</span>;
}