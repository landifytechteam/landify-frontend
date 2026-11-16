import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowUpRight, Building2, ChevronDown, MapPin, Wallet } from "lucide-react";
import { routes, searchOptions } from "../../data/landing";

function SearchField({ id, label, placeholder, icon, options, value, onChange }) {
  const Icon = icon;
  return (
    <div className="flex-1">
      <label htmlFor={id} className="text-xs font-medium uppercase tracking-wide text-body">
        {label}
      </label>
      <div className="relative mt-2">
        <Icon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-600" />
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-13 w-full appearance-none rounded-md border border-line bg-white pl-11 pr-10 text-sm text-ink outline-none focus:border-brand-600"
        >
          <option value="">{placeholder}</option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-body" />
      </div>
    </div>
  );
}

export function SearchBar() {
  const [location, setLocation] = useState("");
  const [type, setType] = useState("");
  const [budget, setBudget] = useState("");

  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    // Use the same query names the /properties page reads (?city=&propertyType=).
    // "Lekki, Lagos" -> city "Lekki", since the backend filters by city.
    const params = new URLSearchParams();
    const city = searchOptions.locations.find((o) => o.value === location)?.label.split(",")[0];
    if (city) params.set("city", city);
    if (type) params.set("propertyType", type);
    // TODO: the public API has no price filter yet, so the page ignores this for now.
    if (budget) params.set("budget", budget);
    const qs = params.toString();
    navigate(qs ? `${routes.properties}?${qs}` : routes.properties);
  }

  return (
    <section className="mt-8 bg-white">
      <form onSubmit={handleSubmit} className="mx-auto max-w-7xl px-4 py-8 sm:px-6 xl:px-0">
        <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-baseline">
          <h2 className="text-xl font-semibold text-ink">What does your next chapter look like?</h2>
          <p className="text-sm text-body">A home. An investment. A place to begin.</p>
        </div>
        <div className="mt-5 flex flex-col gap-5 lg:flex-row lg:items-end">
          <SearchField
            id="search-location"
            label="Location"
            placeholder="Choose a city or area"
            icon={MapPin}
            options={searchOptions.locations}
            value={location}
            onChange={setLocation}
          />
          <SearchField
            id="search-type"
            label="Property type"
            placeholder="All property types"
            icon={Building2}
            options={searchOptions.propertyTypes}
            value={type}
            onChange={setType}
          />
          <SearchField
            id="search-budget"
            label="Budget"
            placeholder="Select a price range"
            icon={Wallet}
            options={searchOptions.budgets}
            value={budget}
            onChange={setBudget}
          />
          <button
            type="submit"
            className="inline-flex h-13 items-center justify-center gap-3 rounded-md bg-brand-600 px-6 text-sm font-semibold text-white transition-colors hover:bg-brand-700 lg:w-50"
          >
            Search Properties
            <ArrowUpRight className="h-4 w-4" aria-hidden />
          </button>
        </div>
      </form>
    </section>
  );
}