import { useState } from "react";
import { ArrowRight, Building2, Heart, MapPin, Ruler, Share2 } from "lucide-react";
import { formatNaira } from "../../../data/properties";

const badgeStyles = {
  Featured: "bg-brand-600 text-white",
  Hot: "bg-brand-600 text-white",
  New: "bg-gold-500 text-white",
  "Limited Units": "bg-gold-500 text-white",
};

function AvailabilityTag({ availability, unitsLeft }) {
  if (availability === "limited") {
    return (
      <span className="flex items-center gap-1.5 text-[11px] text-amber-700">
        <span className="h-1.5 w-1.5 rounded-full bg-amber-500" aria-hidden />
        {unitsLeft ? `${unitsLeft} plots left` : "Limited units"}
      </span>
    );
  }
  if (availability === "sold-out") {
    return (
      <span className="flex items-center gap-1.5 text-[11px] text-body">
        <span className="h-1.5 w-1.5 rounded-full bg-body" aria-hidden />
        Sold out
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1.5 text-[11px] text-brand-600">
      <span className="h-1.5 w-1.5 rounded-full bg-brand-600" aria-hidden />
      Available
    </span>
  );
}

/**
 * One property card. `isSaved` / `onToggleSave` drive the heart button, and
 * `onShare` is called with the listing when Share is clicked.
 */
export function ListingCard({ property, isSaved, onToggleSave, onShare }) {
  const [shared, setShared] = useState(false);

  async function handleShare() {
    await onShare(property);
    setShared(true);
    setTimeout(() => setShared(false), 2000);
  }

  return (
    <article className="overflow-hidden rounded-xl border border-line bg-white shadow-sm">
      <div className="relative h-38.25">
        <img
          src={property.image}
          alt={property.name}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
        />
        {property.badge && (
          <span
            className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-medium ${
              badgeStyles[property.badge] ?? "bg-brand-600 text-white"
            }`}
          >
            {property.badge}
          </span>
        )}
        <button
          type="button"
          onClick={() => onToggleSave(property.id)}
          aria-pressed={isSaved}
          aria-label={isSaved ? `Remove ${property.name} from saved` : `Save ${property.name}`}
          className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-white shadow-sm"
        >
          <Heart
            className={`h-4 w-4 ${isSaved ? "fill-brand-600 text-brand-600" : "text-ink"}`}
            aria-hidden
          />
        </button>
      </div>

      <div className="px-3 pb-3 pt-3.5">
        <div className="flex items-center justify-between gap-2">
          <h3 className="truncate text-[15px] font-medium text-ink">{property.name}</h3>
          <AvailabilityTag availability={property.availability} unitsLeft={property.unitsLeft} />
        </div>

        <p className="mt-1 flex items-center gap-1.5 text-xs text-body">
          <MapPin className="h-3.5 w-3.5" aria-hidden />
          {property.location}
        </p>

        <div className="mt-1 flex items-center justify-between">
          <p className="text-xl font-bold text-ink">{formatNaira(property.price)}</p>
          <p className="flex items-center gap-1.5 text-xs text-body">
            <Ruler className="h-3.5 w-3.5" aria-hidden />
            {property.sizeSqm}sqm
          </p>
        </div>

        <p className="mt-1 flex items-center gap-1.5 text-[11px] text-body">
          <Building2 className="h-3.5 w-3.5" aria-hidden />
          {property.propertyType} • {property.landType}
        </p>

        <div className="mt-3 flex items-center justify-between">
          <button
            type="button"
            onClick={handleShare}
            className="inline-flex h-8 items-center gap-2 rounded-md border border-line px-3 text-xs font-medium text-brand-600 hover:border-brand-600"
          >
            <Share2 className="h-3.5 w-3.5" aria-hidden />
            {shared ? "Link copied" : "Share"}
          </button>
          {/* Using React Router? Swap this <a> for <Link to={property.href}>. */}
          <a
            href={property.href}
            className="inline-flex h-8 items-center gap-2 rounded-md bg-brand-600 px-3.5 text-xs font-medium text-white hover:bg-brand-700"
          >
            <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            View Details
          </a>
        </div>
      </div>
    </article>
  );
}

export default ListingCard;