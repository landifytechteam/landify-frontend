import { Logo } from "./Logo";

/**
 * Full-screen "please wait" with the logo and a spinning ring.
 *
 *   <PageLoader label="Restoring your session…" />           page-level (refresh, page loading)
 *   <PageLoader overlay label="Signing you out…" />          frosted cover over the current page
 *
 * `overlay` also blocks clicks underneath, so nobody double-submits a login/logout.
 * role="status" + the label make screen readers announce what's happening.
 */
export function PageLoader({ label = "Loading…", overlay = false }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed inset-0 z-90 flex flex-col items-center justify-center gap-6 ${
        overlay ? "animate-fade-in bg-white/75 backdrop-blur-sm" : "bg-canvas"
      }`}
    >
      <div className="relative flex h-20 w-20 items-center justify-center">
        {/* Gold arc spinning around a soft green ring */}
        <span className="absolute inset-0 rounded-full border-4 border-brand-50" aria-hidden />
        <span className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-gold-500 border-r-brand-600" aria-hidden />
        <span className="animate-pulse-soft h-3 w-3 rounded-full bg-brand-600" aria-hidden />
      </div>
      <div className="flex flex-col items-center gap-2 text-center">
        {!overlay && <Logo />}
        <p className="text-sm font-medium text-body">{label}</p>
      </div>
    </div>
  );
}
