import { useEffect, useState } from "react";
import { publicApi } from "./publicApi";

/**
 * Landing page "Featured properties": the first 3 live listings, shaped for
 * the landing <PropertyCard />. Shows `fallback` (your demo listings) while
 * loading, or if the API has nothing / is unreachable, so the page never looks empty.
 */
export function useFeaturedProperties(fallback, count = 3) {
  const [live, setLive] = useState(null);

  useEffect(() => {
    let cancelled = false;
    publicApi
      .getProperties()
      .then((list) => !cancelled && setLive(list.slice(0, count)))
      .catch(() => !cancelled && setLive([]));
    return () => {
      cancelled = true;
    };
  }, [count]);

  if (!live?.length) return fallback;
  return live.map((p) => ({
    id: p.id,
    title: p.name,
    type: p.propertyType,
    location: p.location,
    price: p.price,
    image: p.images[0],
    href: `/properties/${p.id}`,
    status: p.status === "available" ? "For sale" : p.status,
    plotSize: p.plotSize,
    plotsAvailable: p.plotsAvailable,
    bedrooms: null, // land: the card shows plot size instead
  }));
}