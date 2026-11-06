import { Bell, Menu, Search, ShieldCheck } from "lucide-react";

// e.g. "06 Oct 2026 · WAT", always in Lagos time whatever the viewer's clock says
const todayInLagos = () =>
  `${new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "Africa/Lagos",
  }).format(new Date())} · WAT`;

/**
 * Header bar above every dashboard page: search, scope pill, date,
 * notifications and the role label. `onMenuClick` opens the sidebar on mobile.
 */
export function Topbar({ nav, onMenuClick, onSearch, hasNotifications }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    const query = new FormData(e.currentTarget).get("q").trim();
    if (query) onSearch?.(query);
  };

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-line bg-white px-4 sm:px-6 lg:h-19 lg:px-8">
      <button
        type="button"
        onClick={onMenuClick}
        className="rounded-md p-2 text-ink hover:bg-canvas lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      <form onSubmit={handleSubmit} role="search" className="relative min-w-0 flex-1 lg:max-w-115">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-body" aria-hidden />
        <input
          type="search"
          name="q"
          placeholder={nav.searchPlaceholder}
          aria-label={nav.searchPlaceholder}
          className="h-10 w-full rounded-md border border-line bg-canvas/60 pl-10 pr-3 text-sm text-ink outline-none placeholder:text-body/80 focus:border-brand-600 focus:bg-white sm:pr-14"
        />
        <kbd className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 font-sans text-xs text-body sm:block">
          ⌘ K
        </kbd>
      </form>

      <div className="ml-auto flex items-center gap-3 sm:gap-5">
        <span className="hidden rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-600 xl:inline">
          {nav.scopeLabel}
        </span>
        <span className="hidden text-sm text-body xl:inline">{todayInLagos()}</span>
        <button
          type="button"
          className="relative rounded-md p-2 text-body hover:bg-canvas hover:text-ink"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" strokeWidth={1.6} />
          {hasNotifications && (
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-gold-500" aria-hidden />
          )}
        </button>
        <span className="hidden h-7 w-px bg-line sm:block" aria-hidden />
        <span className="hidden items-center gap-2 text-sm font-semibold text-ink sm:flex">
          <ShieldCheck className="h-5 w-5 text-brand-600" strokeWidth={1.6} aria-hidden />
          {nav.roleLabel}
        </span>
      </div>
    </header>
  );
}