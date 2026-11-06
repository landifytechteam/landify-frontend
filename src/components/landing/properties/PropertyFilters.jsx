import { ChevronDown, Search } from "lucide-react";

function FilterSelect({ label, value, options, onChange }) {
  return (
    <div className="relative">
      <select
        aria-label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-9.5 w-full appearance-none rounded-md border border-line bg-white pl-3 pr-9 text-sm text-ink outline-none focus:border-brand-600"
      >
        <option value="">{label}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink" />
    </div>
  );
}

/**
 * Search box + the five dropdowns.
 * `filters` is { search, location, project, propertyType, price, availability };
 * `onChange(key, value)` updates one of them.
 */
export function PropertyFilters({ filters, options, onChange }) {
  return (
    <div className="space-y-2">
      <div className="relative max-w-177.5">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-body" />
        <input
          type="search"
          value={filters.search}
          onChange={(e) => onChange("search", e.target.value)}
          placeholder="Search properties by name or location..."
          aria-label="Search properties"
          className="h-10 w-full rounded-md border border-line bg-white pl-10 pr-3 text-sm text-ink outline-none placeholder:text-body focus:border-brand-600"
        />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <FilterSelect
          label="All Locations"
          value={filters.location}
          options={options.locations}
          onChange={(v) => onChange("location", v)}
        />
        <FilterSelect
          label="All Projects"
          value={filters.project}
          options={options.projects}
          onChange={(v) => onChange("project", v)}
        />
        <FilterSelect
          label="All Property Types"
          value={filters.propertyType}
          options={options.propertyTypes}
          onChange={(v) => onChange("propertyType", v)}
        />
        <FilterSelect
          label="All Prices"
          value={filters.price}
          options={options.prices}
          onChange={(v) => onChange("price", v)}
        />
        <FilterSelect
          label="All Availability"
          value={filters.availability}
          options={options.availability}
          onChange={(v) => onChange("availability", v)}
        />
      </div>
    </div>
  );
}
export default PropertyFilters;