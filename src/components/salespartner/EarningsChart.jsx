import { useState } from "react";
import { naira } from "../../utils/format";

// Short labels for the axis: 150000 -> "₦150k", 1200000 -> "₦1.2m"
const short = (n) => (n >= 1e6 ? `₦${+(n / 1e6).toFixed(1)}m` : n >= 1e3 ? `₦${Math.round(n / 1e3)}k` : `₦${n}`);

// Round the top of the axis up to a tidy number, so the grid lines read well
function niceMax(value) {
  if (value <= 0) return 200000;
  const step = 10 ** Math.floor(Math.log10(value));
  return Math.ceil(value / step / 2) * step * 2;
}

// en-US gives "Sep" (en-GB says "Sept"), matching the design
const monthName = (key) =>
  new Intl.DateTimeFormat("en-US", { month: "short" }).format(new Date(`${key}-01T12:00:00`));

/**
 * Paid vs pending bars per month. Plain divs, no chart library needed.
 * `months` = [{ month: "2026-06", paid, pending }], oldest first.
 * Hover (or tap) a month to see the exact amounts.
 */
export function EarningsChart({ months = [] }) {
  const [hovered, setHovered] = useState(null);
  const max = niceMax(Math.max(0, ...months.flatMap((m) => [m.paid, m.pending])));
  const ticks = [1, 0.75, 0.5, 0.25, 0];

  return (
    <div className="flex gap-3">
      {/* Y axis labels */}
      <div className="flex h-44 flex-col justify-between pb-6 text-right text-[11px] text-body" aria-hidden>
        {ticks.map((t) => (
          <span key={t} className="-translate-y-1/2 leading-none">{short(max * t)}</span>
        ))}
      </div>

      <div className="relative flex-1">
        {/* Grid lines */}
        <div className="pointer-events-none absolute inset-x-0 top-0 flex h-38 flex-col justify-between" aria-hidden>
          {ticks.map((t) => (
            <span key={t} className={`border-t ${t === 0 ? "border-line" : "border-dashed border-line/70"}`} />
          ))}
        </div>

        <ul className="relative flex h-44 items-stretch" aria-label="Commission earnings by month">
          {months.map((m, i) => {
            const active = hovered === i;
            return (
              <li
                key={m.month}
                className="relative flex flex-1 flex-col items-center"
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => setHovered(active ? null : i)}
              >
                <div className="flex h-38 items-end gap-1.5">
                  <Bar value={m.paid} max={max} className="bg-brand-600" delay={i * 60} dim={hovered !== null && !active} />
                  <Bar value={m.pending} max={max} className="bg-gold-500" delay={i * 60 + 30} dim={hovered !== null && !active} />
                </div>
                <span className={`mt-2 text-xs ${active ? "font-semibold text-ink" : "text-body"}`}>{monthName(m.month)}</span>

                {active && (
                  <div className="absolute bottom-full z-10 mb-1 w-max rounded-lg bg-ink px-3 py-2 text-xs text-white shadow-lg">
                    <p className="font-semibold">{monthName(m.month)}</p>
                    <p className="mt-1">Paid: {naira(m.paid)}</p>
                    <p>Pending: {naira(m.pending)}</p>
                  </div>
                )}
                <span className="sr-only">
                  {monthName(m.month)}: paid {naira(m.paid)}, pending {naira(m.pending)}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

function Bar({ value, max, className, delay, dim }) {
  // Tiny stub for zero months, so the month doesn't look missing
  const height = value > 0 ? Math.max(4, (value / max) * 100) : 2;
  return (
    <span
      className={`animate-bar-grow block w-4 origin-bottom rounded-t-md transition-opacity sm:w-6 ${className} ${dim ? "opacity-40" : ""}`}
      style={{ height: `${height}%`, animationDelay: `${delay}ms` }}
      aria-hidden
    />
  );
}
