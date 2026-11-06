import { Info } from "lucide-react";
import { ButtonLink } from "../ui/Button";
import { Eyebrow } from "../ui/Eyebrow";
import { routes } from "../../data/landing";
import { PropertyCard } from "./PropertyCard";

export function FeaturedProperties({ properties }) {
  const hasDemo = properties.some((p) => p.isDemo);

  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 xl:px-0">
        <Eyebrow>Featured properties</Eyebrow>
        <div className="mt-4 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <h2 className="text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
              Find a place that feels like you.
            </h2>
            <p className="mt-4 text-body">A glimpse of the homes you could explore with Landify.</p>
          </div>
          <ButtonLink href={routes.properties} variant="outline" arrow>
            Explore All Properties
          </ButtonLink>
        </div>

        <div className="mt-9 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>

        {hasDemo && (
          <p className="mt-10 flex items-center gap-2 text-xs text-body">
            <Info className="h-4 w-4" aria-hidden />
            Illustrative sample data only. These demo listings, images and prices do not represent
            actual inventory or offers.
          </p>
        )}
      </div>
    </section>
  );
}