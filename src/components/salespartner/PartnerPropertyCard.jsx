import { Link } from "react-router-dom";
import { ArrowRight, Heart, LandPlot, MapPin, Ruler, Share2 } from "lucide-react";
import { naira } from "../../utils/format";

// Coloured corner tag. The backend doesn't send one yet (TODO: e.g. `badge: "Featured"`),
// so cards only show it when the property has one.
const badgeStyles = {
  featured: "bg-brand-600 text-white",
  new: "bg-gold-500 text-ink",
  hot: "bg-brand-900 text-white",
  "limited units": "bg-gold-500 text-ink",
};
const badgeOf = (p) => p.raw?.badge ?? p.raw?.tag ?? null;

// Few plots left gets a gold warning instead of the green "Available"
const LOW_STOCK = 5;
function Availability({ property }) {
  const left = property.plotsAvailable;
  const low = left != null && left > 0 && left <= LOW_STOCK;
  const soldOut = left === 0 || property.status === "sold";
  const [dot, text, label] = soldOut
    ? ["bg-red-600", "text-red-700", "Sold out"]
    : low
      ? ["bg-gold-500", "text-[#8a6a10]", `${left} plot${left === 1 ? "" : "s"} left`]
      : ["bg-brand-600", "text-brand-600", "Available"];
  return (
    <span className={`flex shrink-0 items-center gap-1.5 text-xs ${text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} aria-hidden />
      {label}
    </span>
  );
}

/**
 * Property card for the partner screens.
 * - `layout="list"` puts the photo on the left (the list view toggle).
 * - `compact` is the smaller version on the dashboard (Share only).
 * - `to` is the detail page link.
 */
export function PartnerPropertyCard({ property: p, to, onShare, favourite, onToggleFavourite, layout = "grid", compact }) {
  const badge = badgeOf(p);
  const list = layout === "list";

  return (
    <article
      className={`group flex h-full overflow-hidden rounded-xl border border-line bg-white transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_36px_-20px_rgba(19,38,30,0.45)] ${
        list ? "flex-col sm:flex-row" : "flex-col"
      }`}
    >
      <div className={`relative shrink-0 overflow-hidden ${list ? "aspect-video sm:aspect-auto sm:w-64" : compact ? "aspect-16/9" : "aspect-41/17"}`}>
        <img
          src={p.images[0]}
          alt={p.name}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {badge && (
          <span className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-semibold ${badgeStyles[String(badge).toLowerCase()] ?? "bg-white text-ink"}`}>
            {badge}
          </span>
        )}
        {onToggleFavourite && (
          <button
            type="button"
            onClick={() => onToggleFavourite(p.id)}
            aria-pressed={favourite}
            aria-label={favourite ? `Remove ${p.name} from saved` : `Save ${p.name}`}
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-ink shadow transition-transform hover:scale-110"
          >
            <Heart className={`h-4 w-4 transition-colors ${favourite ? "fill-red-500 text-red-500" : ""}`} aria-hidden />
          </button>
        )}
      </div>

      <div className={`flex flex-1 flex-col ${compact ? "p-3" : "p-4"}`}>
        <div className="flex items-start justify-between gap-2">
          <h3 className={`font-medium text-ink ${compact ? "text-sm" : "text-[15px]"}`}>{p.name}</h3>
          {!compact && <Availability property={p} />}
        </div>
        <p className="mt-1 flex items-center gap-1 text-xs text-body">
          <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden />
          {p.location}
        </p>

        <div className="mt-2 flex items-center justify-between gap-2">
          <p className={`font-semibold text-ink ${compact ? "text-[15px]" : "text-xl"}`}>{naira(p.price)}</p>
          {p.plotSize && !compact && (
            <span className="flex items-center gap-1 text-xs text-body">
              <Ruler className="h-3.5 w-3.5" aria-hidden />
              {p.plotSize}sqm
            </span>
          )}
        </div>
        <p className="mt-1.5 flex items-center gap-1 text-xs text-body">
          <LandPlot className="h-3.5 w-3.5 shrink-0" aria-hidden />
          {/* Compact cards only have room for size + type */}
          {(compact ? [p.plotSize && `${p.plotSize}sqm`, p.propertyType] : [p.propertyType, p.title]).filter(Boolean).join(" • ")}
        </p>

        <div className={`mt-auto flex items-center gap-2 ${compact ? "pt-3" : "pt-4"}`}>
          <button
            type="button"
            onClick={() => onShare(p)}
            className={`inline-flex h-9 items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors ${
              compact ? "w-full bg-brand-600 text-white hover:bg-brand-700" : "border border-line px-3 text-ink hover:border-brand-600 hover:text-brand-600"
            }`}
          >
            <Share2 className="h-4 w-4" aria-hidden />
            Share
          </button>
          {!compact && (
            <Link
              to={to}
              className="ml-auto inline-flex h-9 items-center gap-2 rounded-md bg-brand-600 px-3 text-sm font-medium text-white transition-colors hover:bg-brand-700"
            >
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
              View Details
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
