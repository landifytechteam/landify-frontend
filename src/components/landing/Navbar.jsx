import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Logo } from "../ui/Logo";
import { ButtonLink } from "../ui/Button";
import { AppLink } from "../ui/AppLink";
import { navLinks, routes } from "../../data/landing";

// How far (px) the page must scroll before the bar turns into the floating pill
const SCROLL_THRESHOLD = 12;

export function Navbar() {
  // useLocation() updates on every route change; window.location would not re-render
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(() => window.scrollY > SCROLL_THRESHOLD);

  // Watch the scroll position. `passive: true` tells the browser we never block
  // scrolling here, so it stays smooth on phones.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const floating = scrolled || open; // the open mobile menu needs the solid pill behind it

  return (
    // The outer band keeps a fixed height, so the page below never jumps when the
    // bar changes shape. It's click-through (pointer-events-none) except the bar itself.
    <header className="animate-nav-drop pointer-events-none sticky top-0 z-50 flex h-24 items-center px-3 sm:px-6">
      <div
        className={`pointer-events-auto relative mx-auto flex w-full max-w-7xl items-center justify-between rounded-full border transition-all duration-500 ease-out ${
          floating
            ? "h-16 border-white/60 bg-white/65 px-4 shadow-[0_10px_40px_-12px_rgba(19,38,30,0.28)] ring-1 ring-ink/5 backdrop-blur-3xl backdrop-saturate-150 sm:px-6"
            : "h-20 border-transparent bg-transparent px-1 xl:px-0"
        }`}
      >
        <Logo />

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {navLinks.map((link) => {
            const active = link.href === pathname;
            return (
              <AppLink
                key={link.label}
                href={link.href}
                className={`relative rounded-full px-4 py-2 text-sm transition-colors duration-200 ${
                  active ? "font-medium text-brand-600" : "text-body hover:bg-brand-50/80 hover:text-ink"
                }`}
              >
                {link.label}
                {active && (
                  <span className="absolute bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-gold-500" />
                )}
              </AppLink>
            );
          })}
        </nav>

        <div className="hidden items-center gap-5 md:flex">
          <Link to={routes.login} className="text-sm font-semibold text-ink transition-colors hover:text-brand-600">
            Log In
          </Link>
          <ButtonLink
            href={routes.signup}
            arrow
            className={`rounded-full! transition-all duration-500 ${floating ? "h-11! px-5!" : ""}`}
          >
            Get Started
          </ButtonLink>
        </div>

        <button
          type="button"
          className="rounded-full p-2 transition-colors hover:bg-brand-50 md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        {/* Mobile menu: a frosted card that drops down under the pill */}
        {open && (
          <div className="animate-menu-pop absolute inset-x-0 top-full mt-3 rounded-3xl border border-white/60 bg-white/85 p-5 shadow-[0_20px_50px_-15px_rgba(19,38,30,0.35)] ring-1 ring-ink/5 backdrop-blur-xl md:hidden">
            <nav className="flex flex-col gap-1" aria-label="Mobile">
              {navLinks.map((link) => (
                <AppLink
                  key={link.label}
                  href={link.href}
                  className={`rounded-xl px-4 py-3 text-base transition-colors hover:bg-brand-50 ${
                    link.href === pathname ? "font-medium text-brand-600" : "text-ink"
                  }`}
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </AppLink>
              ))}
              <Link
                to={routes.login}
                className="rounded-xl px-4 py-3 text-base font-semibold text-ink hover:bg-brand-50"
                onClick={() => setOpen(false)}
              >
                Log In
              </Link>
              <ButtonLink href={routes.signup} arrow className="mt-2 rounded-full!">
                Get Started
              </ButtonLink>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
