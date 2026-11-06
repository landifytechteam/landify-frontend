import { ArrowUpRight, LockKeyhole } from "lucide-react";
import { AuthHero } from "./AuthHero";
import { Logo } from "../ui/Logo";
import { authRoutes } from "../../data/auth";

/**
 * Split layout for auth screens: photo panel on the left (desktop only),
 * form column on the right. `badge` is the small label in the top-left corner.
 */
export function AuthLayout({ badge, children }) {
  return (
    <div className="flex min-h-screen bg-canvas">
      <AuthHero />

      <main className="flex flex-1 flex-col px-4 py-6 sm:px-8 lg:px-10">
        <div className="flex items-center justify-between gap-4">
          {/* Logo only shows on mobile, where the photo panel is hidden */}
          <Logo className="lg:hidden" />
          <p className="hidden items-center gap-2 text-xs uppercase tracking-wide text-body lg:flex">
            <LockKeyhole className="h-3.5 w-3.5 text-brand-600" aria-hidden />
            {badge}
          </p>
          <p className="text-xs text-body">
            <span className="hidden sm:inline">Need help? </span>
            <a
              href={authRoutes.support}
              className="inline-flex items-center gap-0.5 font-semibold text-brand-600 hover:underline"
            >
              Contact support
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
            </a>
          </p>
        </div>

        <div className="flex flex-1 items-center justify-center py-8">
          <div className="w-full max-w-123">{children}</div>
        </div>
      </main>
    </div>
  );
}

/** Eyebrow + title + subtitle at the top of each auth form. */
export function AuthHeading({ eyebrow, title, subtitle }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-brand-600">{eyebrow}</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-ink sm:text-[34px]">{title}</h1>
      <p className="mt-2 text-sm text-body">{subtitle}</p>
    </div>
  );
}

export function SecureNote() {
  return (
    <p className="mt-6 flex items-center justify-center gap-2 text-xs text-body">
      <LockKeyhole className="h-3.5 w-3.5" aria-hidden />
      Your information is encrypted and kept private.
    </p>
  );
}