import { useSearchParams } from "react-router-dom";
import { PropertyCard } from "../../components/landing/PropertyCard";
import { publicApi } from "../../context/public/publicApi";
import { useDebouncedValue, useRequest } from "../../context/hooks";
import { Button, ErrorState, LoadingState } from "../../components/dashboard/ui";
import { SearchInput, Select } from "../../components/dashboard/controls";
import { PROPERTY_TYPES } from "../../data/landing";

/**
 * /properties: every available property on the platform (GET /v1/public/properties).
 * Filters live in the URL (?city=Lekki&propertyType=Residential), so results can be shared.
 * Also used at /salespartner/properties, so links below are relative to the current URL.
 */
export default function PublicPropertiesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const city = searchParams.get("city") ?? "";
  const propertyType = searchParams.get("propertyType") ?? "";
  const companyId = searchParams.get("companyId") ?? "";

  const setParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    setSearchParams(next, { replace: true });
  };

  // Wait until typing pauses before asking the server
  const cityQuery = useDebouncedValue(city.trim(), 400);
  const { data, loading, error, reload } = useRequest(publicApi.getProperties, { city: cityQuery, propertyType, companyId });

  const filtered = Boolean(city || propertyType || companyId);

  return (
    // MainLayout already renders the Navbar, Footer and <main>
    <div className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 xl:px-0">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">Properties</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-ink sm:text-5xl">Find land you can trust.</h1>
        <p className="mt-3 text-body">Every listing is from a verified company and reviewed before it goes live.</p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <SearchInput value={city} onChange={(v) => setParam("city", v)} placeholder="Search by city, e.g. Lekki" className="sm:flex-1" />
          <Select value={propertyType} onChange={(v) => setParam("propertyType", v)} options={PROPERTY_TYPES} placeholder="All property types" className="sm:w-56" />
          {filtered && <Button variant="ghost" onClick={() => setSearchParams({}, { replace: true })}>Clear filters</Button>}
        </div>

        <div className="mt-8">
          {error && !data ? (
            <ErrorState message={`${error} The server may be waking up; try again in a few seconds.`} onRetry={reload} />
          ) : !data ? (
            <LoadingState label="Loading properties…" />
          ) : data.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-line bg-white px-6 py-16 text-center">
              <p className="font-medium text-ink">{filtered ? "No properties match your search" : "No properties are listed yet"}</p>
              <p className="mt-1 text-sm text-body">{filtered ? "Try another city or property type." : "Check back soon."}</p>
            </div>
          ) : (
            <>
              <p className={`mb-5 text-sm text-body ${loading ? "opacity-60" : ""}`}>
                {data.length} {data.length === 1 ? "property" : "properties"}
                {city && ` in “${city}”`}
              </p>
              <div className={`grid gap-6 sm:grid-cols-2 lg:grid-cols-3 ${loading ? "opacity-60" : ""}`}>
                {data.map((p) => (
                  <PropertyCard
                    key={p.id}
                    property={{
                      ...p,
                      title: p.name,
                      type: p.propertyType,
                      image: p.images[0],
                      href: String(p.id), // relative: /properties/123 or /salespartner/properties/123
                      status: p.status === "available" ? "For sale" : p.status,
                      bedrooms: null,
                    }}
                  />
                ))}
              </div>
            </>
          )}
        </div>
    </div>
  );
}