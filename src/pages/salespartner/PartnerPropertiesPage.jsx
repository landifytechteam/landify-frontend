import { useMemo, useState } from "react";
import { LayoutGrid, List } from "lucide-react";
import { usePartnerProperties } from "../../context/salespartner/usePartnerProperties";
import { Button, ErrorState, LoadingState, PageHeader } from "../../components/dashboard/ui";
import { SearchInput, Select } from "../../components/dashboard/controls";
import { Pagination } from "../../components/dashboard/DataTable";
import { PartnerPropertyCard } from "../../components/salespartner/PartnerPropertyCard";
import { useShareProperty } from "../../components/salespartner/shareProperty";
import { useFavourites } from "../../components/salespartner/useFavourites";
import { Reveal } from "../../components/ui/Reveal";
import { PROPERTY_TYPES } from "../../data/landing";

const PAGE_SIZE = 6;

const PRICE_RANGES = [
  { value: "0-2000000", label: "Under ₦2m" },
  { value: "2000000-3000000", label: "₦2m – ₦3m" },
  { value: "3000000-5000000", label: "₦3m – ₦5m" },
  { value: "5000000-", label: "Above ₦5m" },
];
const AVAILABILITY = [
  { value: "available", label: "Available" },
  { value: "low", label: "Few plots left" },
  { value: "saved", label: "Saved (♥)" },
];

const inPrice = (price, range) => {
  if (!range) return true;
  const [min, max] = range.split("-").map((n) => (n ? Number(n) : null));
  return price >= min && (max == null || price < max);
};

/**
 * /salespartner/properties: the company's approved listings, for the partner to share.
 * The live endpoint only filters by company/city/type, so everything here is
 * filtered in the browser. Fine for a company's list; if lists grow into the
 * hundreds, ask the backend for search + price + paging query params.
 */
export default function PartnerPropertiesPage() {
  const { data, error, reload } = usePartnerProperties();
  const share = useShareProperty();
  const favourites = useFavourites();
  const [layout, setLayout] = useState("grid");
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({ search: "", location: "", type: "", price: "", availability: "" });

  const setFilter = (name) => (value) => {
    setFilters((f) => ({ ...f, [name]: value }));
    setPage(1);
  };

  // Location options come from the listings themselves (state names)
  const locations = useMemo(() => [...new Set((data ?? []).map((p) => p.state || p.city).filter(Boolean))].sort(), [data]);

  const shown = (data ?? []).filter((p) => {
    const q = filters.search.trim().toLowerCase();
    if (q && !`${p.name} ${p.location}`.toLowerCase().includes(q)) return false;
    if (filters.location && (p.state || p.city) !== filters.location) return false;
    if (filters.type && p.propertyType !== filters.type) return false;
    if (!inPrice(p.price, filters.price)) return false;
    if (filters.availability === "available" && p.plotsAvailable === 0) return false;
    if (filters.availability === "low" && !(p.plotsAvailable > 0 && p.plotsAvailable <= 5)) return false;
    if (filters.availability === "saved" && !favourites.isFavourite(p.id)) return false;
    return true;
  });
  const pageItems = shown.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const filtered = Object.values(filters).some(Boolean);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Properties"
        subtitle="Browse company properties available for you to market to clients."
        actions={data && <span className="rounded-full bg-brand-50 px-3 py-1.5 text-xs font-medium text-brand-600">{data.length} active properties</span>}
      />

      <Reveal className="space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <SearchInput value={filters.search} onChange={setFilter("search")} placeholder="Search properties by name or location…" className="sm:flex-1" />
          <div className="flex items-center justify-between gap-3 sm:justify-end">
            <span className="text-xs text-body">{shown.length} properties available</span>
            <div className="flex gap-1" role="group" aria-label="Layout">
              {[
                ["grid", LayoutGrid, "Grid view"],
                ["list", List, "List view"],
              ].map(([value, Icon, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setLayout(value)}
                  aria-pressed={layout === value}
                  aria-label={label}
                  className={`flex h-10 w-10 items-center justify-center rounded-md border transition-colors ${
                    layout === value ? "border-brand-600/30 bg-brand-50 text-brand-600" : "border-line bg-white text-body hover:text-ink"
                  }`}
                >
                  <Icon className="h-4.5 w-4.5" aria-hidden />
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Select value={filters.location} onChange={setFilter("location")} options={locations} placeholder="All Locations" />
          <Select value={filters.type} onChange={setFilter("type")} options={PROPERTY_TYPES} placeholder="All Property Types" />
          <Select value={filters.price} onChange={setFilter("price")} options={PRICE_RANGES} placeholder="All Prices" />
          <Select value={filters.availability} onChange={setFilter("availability")} options={AVAILABILITY} placeholder="All Availability" />
        </div>
      </Reveal>

      {error && !data ? (
        <ErrorState message={`${error} The server may be waking up; try again in a few seconds.`} onRetry={reload} />
      ) : !data ? (
        <LoadingState label="Loading properties…" />
      ) : shown.length === 0 ? (
        <div className="rounded-xl border border-dashed border-line bg-white px-6 py-16 text-center">
          <p className="font-medium text-ink">{filtered ? "No properties match these filters" : "No approved properties are listed for your company yet"}</p>
          <p className="mt-1 text-sm text-body">{filtered ? "Try a different filter." : "Once your Company Admin's listings are approved, they'll show here."}</p>
          {filtered && (
            <Button
              variant="ghost"
              className="mt-2"
              onClick={() => {
                setFilters({ search: "", location: "", type: "", price: "", availability: "" });
                setPage(1);
              }}
            >
              Clear filters
            </Button>
          )}
        </div>
      ) : (
        <div>
          <div className={`reveal-stagger grid gap-5 ${layout === "grid" ? "sm:grid-cols-2 xl:grid-cols-3" : ""}`}>
            {pageItems.map((p) => (
              <Reveal key={p.id}>
                <PartnerPropertyCard
                  property={p}
                  to={String(p.id)}
                  layout={layout}
                  onShare={share}
                  favourite={favourites.isFavourite(p.id)}
                  onToggleFavourite={favourites.toggle}
                />
              </Reveal>
            ))}
          </div>
          <div className="mt-6 overflow-hidden rounded-xl border border-line bg-white [&>div]:border-t-0">
            <Pagination page={page} pageSize={PAGE_SIZE} total={shown.length} onChange={setPage} noun="properties" />
          </div>
        </div>
      )}
    </div>
  );
}
