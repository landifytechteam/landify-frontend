import { useMemo, useState } from "react";
// import { ListingCard, Pagination, PropertyFilters } from "../components/landing/properties";
import ListingCard from "../components/landing/properties/ListingCard";
import Pagination from "../components/landing/properties/Pagination";
import PropertyFilters from "../components/landing/properties/PropertyFilters";
import {
  filterOptions,
  PAGE_SIZE,
  projectOptions,
  properties as demoProperties,
} from "../data/properties";

const EMPTY_FILTERS = {
  search: "",
  location: "",
  project: "",
  propertyType: "",
  price: "",
  availability: "",
};

function matches(property, filters) {
  const q = filters.search.trim().toLowerCase();
  if (q && !`${property.name} ${property.location}`.toLowerCase().includes(q)) return false;
  if (filters.location && property.locationValue !== filters.location) return false;
  if (filters.project && property.project !== filters.project) return false;
  if (filters.propertyType && property.propertyType !== filters.propertyType) return false;
  if (filters.availability && property.availability !== filters.availability) return false;
  if (filters.price) {
    // Price values look like "2000000-3000000" or "5000000-" (no upper limit).
    const [min, max] = filters.price.split("-");
    if (property.price < Number(min)) return false;
    if (max && property.price > Number(max)) return false;
  }
  return true;
}

async function shareListing(property) {
  const url = new URL(property.href, window.location.origin).toString();
  // Phones get the native share sheet; desktops fall back to copying the link.
  if (navigator.share) {
    try {
      await navigator.share({
        title: property.name,
        text: `${property.name}, ${property.location}`,
        url,
      });
      return;
    } catch {
      // The user closed the share sheet; fall through to copying.
    }
  }
  await navigator.clipboard?.writeText(url);
}

/**
 * Content for the Properties tab. It has no navbar or sidebar of its own, so
 * render it inside your workspace layout.
 */
export default function PropertiesPage() {
  // TODO: swap for the API once it exists. With many listings, send the filters
  // and page number to the backend instead of filtering here.
  const properties = demoProperties;

  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [page, setPage] = useState(1);
  // TODO: load and save favourites through the API.
  const [savedIds, setSavedIds] = useState(() => new Set());

  const options = useMemo(
    () => ({ ...filterOptions, projects: projectOptions(properties) }),
    [properties],
  );
  const results = useMemo(
    () => properties.filter((p) => matches(p, filters)),
    [properties, filters],
  );

  const pageCount = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const start = (currentPage - 1) * PAGE_SIZE;
  const pageItems = results.slice(start, start + PAGE_SIZE);

  function updateFilter(key, value) {
    setFilters((f) => ({ ...f, [key]: value }));
    setPage(1);
  }

  function toggleSave(id) {
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function goToPage(n) {
    setPage(n);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <section className="px-4 py-6 sm:px-7">
      <h1 className="text-[26px] font-semibold tracking-tight text-ink">Properties</h1>
      <p className="mt-1 text-sm text-body">
        Browse company properties available for you to market to clients.
      </p>

      <div className="mt-6">
        <PropertyFilters filters={filters} options={options} onChange={updateFilter} />
      </div>

      {pageItems.length > 0 ? (
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {pageItems.map((p) => (
            <ListingCard
              key={p.id}
              property={p}
              isSaved={savedIds.has(p.id)}
              onToggleSave={toggleSave}
              onShare={shareListing}
            />
          ))}
        </div>
      ) : (
        <div className="mt-5 rounded-xl border border-dashed border-line bg-white px-6 py-16 text-center">
          <p className="font-medium text-ink">No properties match your search</p>
          <p className="mt-1 text-sm text-body">Try another location or price range.</p>
          <button
            type="button"
            onClick={() => {
              setFilters(EMPTY_FILTERS);
              setPage(1);
            }}
            className="mt-5 inline-flex h-9 items-center rounded-md bg-brand-600 px-4 text-sm font-medium text-white hover:bg-brand-700"
          >
            Clear filters
          </button>
        </div>
      )}

      <div className="mt-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <p className="text-xs text-body">
          {results.length === 0
            ? "Showing 0 properties"
            : `Showing ${start + 1}–${start + pageItems.length} of ${results.length} properties`}
        </p>
        <Pagination page={currentPage} pageCount={pageCount} onPageChange={goToPage} />
      </div>
    </section>
  );
}