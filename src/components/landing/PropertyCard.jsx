import { Link } from "react-router-dom";
import { ArrowUpRight, Bath, BedDouble, LandPlot, MapPin, Ruler } from "lucide-react";
import { formatNaira } from "../../data/landing";

export function PropertyCard({ property }) {
  return (
    <article className="overflow-hidden rounded-2xl bg-white shadow-[0_8px_30px_rgba(19,38,30,0.06)]">
      <div className="relative aspect-41/27">
        <img
          src={property.image}
          alt={property.title}
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
        />
        {property.isDemo && (
          <span className="absolute left-4 top-4 rounded bg-white px-2.5 py-1.5 text-[11px] uppercase tracking-wide text-ink">
            Demo listing
          </span>
        )}
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between text-xs">
          <span className="text-body">{property.type}</span>
          <span className="font-semibold uppercase text-brand-600">
            {property.status}
            {property.isDemo && " · Sample"}
          </span>
        </div>
        <h3 className="mt-3 text-[22px] font-semibold text-ink">{property.title}</h3>
        <p className="mt-1.5 flex items-center gap-2 text-sm text-body">
          <MapPin className="h-4 w-4" aria-hidden />
          {property.location}
        </p>

        {/* Homes show bedrooms/bathrooms; land from the API shows plot size + plots left */}
        <div className="mt-4 flex gap-6 border-y border-line py-3.5 text-sm text-body">
          {property.bedrooms != null ? (
            <>
              <span className="flex items-center gap-2">
                <BedDouble className="h-4 w-4 text-brand-600" aria-hidden />
                {property.bedrooms} bedrooms
              </span>
              <span className="flex items-center gap-2">
                <Bath className="h-4 w-4 text-brand-600" aria-hidden />
                {property.bathrooms} bathrooms
              </span>
            </>
          ) : (
            <>
              <span className="flex items-center gap-2">
                <Ruler className="h-4 w-4 text-brand-600" aria-hidden />
                {property.plotSize ? `${property.plotSize} per plot` : "Plot size on request"}
              </span>
              {property.plotsAvailable != null && (
                <span className="flex items-center gap-2">
                  <LandPlot className="h-4 w-4 text-brand-600" aria-hidden />
                  {property.plotsAvailable} plots
                </span>
              )}
            </>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <p className="text-2xl text-brand-600">{formatNaira(property.price)}</p>
          <Link
            to={property.href}
            className="flex items-center gap-2 text-sm font-semibold text-brand-600 hover:underline"
          >
            View Details
            <ArrowUpRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </div>
    </article>
  );
}