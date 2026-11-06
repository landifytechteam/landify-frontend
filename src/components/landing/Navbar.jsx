import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "../ui/Logo";
import { ButtonLink } from "../ui/Button";
import { navLinks, routes } from "../../data/landing";

export function Navbar() {
  // Using React Router? Swap this for useLocation().pathname.
  const pathname = window.location.pathname;
  const [open, setOpen] = useState(false);

  return (
    <header className="relative mx-auto flex h-24 max-w-7xl items-center justify-between px-4 sm:px-6 xl:px-0">
      <Logo />

      <nav className="hidden items-center gap-8 md:flex" aria-label="Main">
        {navLinks.map((link) => {
          const active = link.href === pathname;
          return (
            <a
              key={link.label}
              href={link.href}
              className={`relative text-sm transition-colors ${
                active ? "text-brand-600" : "text-body hover:text-ink"
              }`}
            >
              {link.label}
              {active && (
                <span className="absolute -bottom-2 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-gold-500" />
              )}
            </a>
          );
        })}
      </nav>

      <div className="hidden items-center gap-7 md:flex">
        <a href={routes.login} className="text-sm font-semibold text-ink">
          Log In
        </a>
        <ButtonLink href={routes.signup} arrow>
          Get Started
        </ButtonLink>
      </div>

      <button
        type="button"
        className="md:hidden"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {open && (
        <div className="absolute inset-x-0 top-24 z-50 border-y border-line bg-white px-4 py-6 shadow-lg md:hidden">
          <nav className="flex flex-col gap-4" aria-label="Mobile">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-base text-ink"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <a href={routes.login} className="text-base font-semibold text-ink">
              Log In
            </a>
            <ButtonLink href={routes.signup} arrow className="mt-2">
              Get Started
            </ButtonLink>
          </nav>
        </div>
      )}
    </header>
  );
}