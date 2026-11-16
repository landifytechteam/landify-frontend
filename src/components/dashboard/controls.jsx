import { ChevronDown, Lock, Search } from "lucide-react";

/** Search box used above tables. */
export function SearchInput({ value, onChange, placeholder, className = "" }) {
  return (
    <div className={`relative min-w-0 ${className}`}>
      <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-body" aria-hidden />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="h-11 w-full rounded-md border border-line bg-white pl-10 pr-3 text-sm text-ink outline-none placeholder:text-body/80 focus:border-brand-600"
      />
    </div>
  );
}

/**
 * Styled native <select>. `options` is [{ value, label }] or plain strings.
 * `placeholder` becomes the first "all" option with value "".
 */
export function Select({ value, onChange, options, placeholder, label, className = "", disabled, id }) {
  const normalized = options.map((o) => (typeof o === "string" ? { value: o, label: o } : o));
  return (
    <label className={`relative block ${className}`}>
      {label && <span className="mb-1.5 block text-sm text-body">{label}</span>}
      <span className="relative block">
        <select
          id={id}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          aria-label={label ? undefined : placeholder}
          className="h-11 w-full appearance-none rounded-md border border-line bg-white pl-3.5 pr-9 text-sm text-ink outline-none focus:border-brand-600 disabled:bg-canvas disabled:text-body"
        >
          {placeholder !== undefined && <option value="">{placeholder}</option>}
          {normalized.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-body" aria-hidden />
      </span>
    </label>
  );
}

/** Row of filters above a table: search grows, selects stay compact. */
export function FilterBar({ children }) {
  return <div className="flex flex-col gap-3 px-5 pb-5 sm:px-6 lg:flex-row lg:items-center [&>*:first-child]:flex-1">{children}</div>;
}

/** Underlined tabs. `tabs` is [{ value, label, count? }]. */
export function Tabs({ tabs, value, onChange, label = "Sections" }) {
  return (
    <div role="tablist" aria-label={label} className="flex gap-6 overflow-x-auto border-b border-line">
      {tabs.map((tab) => {
        const selected = tab.value === value;
        return (
          <button
            key={tab.value}
            role="tab"
            type="button"
            aria-selected={selected}
            onClick={() => onChange(tab.value)}
            className={`-mb-px shrink-0 border-b-2 pb-3 text-[15px] transition-colors ${
              selected ? "border-gold-500 font-medium text-brand-600" : "border-transparent text-body hover:text-ink"
            }`}
          >
            {tab.label}
            {tab.count !== undefined && <span className="ml-2">{tab.count}</span>}
          </button>
        );
      })}
    </div>
  );
}

/** On/off switch. `locked` shows it as a protected rule that can't be changed. */
export function Toggle({ checked, onChange, label, locked, disabled }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled || locked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors disabled:cursor-not-allowed ${
        checked ? "bg-brand-600" : "bg-line"
      } ${locked ? "opacity-80" : ""} focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600`}
    >
      <span className={`inline-block h-5 w-5 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-6" : "translate-x-1"}`} />
    </button>
  );
}

export const LockIcon = () => <Lock className="inline h-3.5 w-3.5 text-body" aria-label="Protected rule" />;

/** Labelled text input / textarea for forms in panels and dialogs. */
export function Field({ label, error, multiline, className = "", hint, ...props }) {
  const Tag = multiline ? "textarea" : "input";
  return (
    <label className={`block ${className}`}>
      {label && <span className="mb-1.5 block text-sm text-body">{label}</span>}
      <Tag
        {...props}
        aria-invalid={Boolean(error)}
        className={`w-full rounded-md border bg-white px-3.5 text-sm text-ink outline-none placeholder:text-body/70 focus:border-brand-600 ${
          multiline ? "min-h-28 py-3" : "h-11"
        } ${error ? "border-red-500" : "border-line"}`}
      />
      {hint && !error && <span className="mt-1.5 block text-xs text-body">{hint}</span>}
      {error && <span className="mt-1.5 block text-xs text-red-600">{error}</span>}
    </label>
  );
}