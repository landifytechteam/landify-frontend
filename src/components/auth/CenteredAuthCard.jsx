import { ArrowLeft, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { Logo } from "../ui/Logo";
import { authRoutes } from "../../data/auth";

/**
 * Centred card used by the smaller auth steps (OTP, forgot password, reset password).
 * `icon` is a lucide component shown in the round tile above the title.
 * `accent` is the small gold mark on that tile: "check" (badge) or "dot".
 */
export function CenteredAuthCard({ icon: Icon, accent = "dot", title, subtitle, children }) {
  return (
    <div className="flex min-h-screen flex-col items-center bg-white px-4 py-8 sm:py-24">
      <div className="w-full max-w-200 rounded-2xl border border-line bg-white px-5 py-8 shadow-[0_12px_40px_-24px_rgba(19,38,30,0.25)] sm:min-h-200 sm:px-10 sm:py-10">
        <div className="flex items-center justify-between gap-4">
          <Logo />
          <Link
            to={authRoutes.login}
            className="inline-flex items-center gap-2 text-sm font-medium text-brand-600 hover:underline"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Back to Login
          </Link>
        </div>

        <main className="mx-auto mt-12 w-full max-w-116 text-center">
          <IconTile icon={Icon} accent={accent} />
          <h1 className="mt-7 text-[28px] font-semibold tracking-tight text-ink sm:text-[32px]">
            {title}
          </h1>
          <div className="mt-3 text-[15px] leading-6 text-body">{subtitle}</div>
          <div className="mt-8 text-left">{children}</div>
        </main>
      </div>

      <footer className="mt-12 flex w-full max-w-200 flex-col items-center justify-between gap-3 text-xs text-body sm:flex-row">
        <p>© {new Date().getFullYear()} Landify. All rights reserved.</p>
        <nav className="flex gap-6">
          <Link to={authRoutes.privacy} className="hover:text-brand-600">
            Privacy Policy
          </Link>
          <a href={authRoutes.support} className="hover:text-brand-600">
            Need help?
          </a>
        </nav>
      </footer>
    </div>
  );
}

function IconTile({ icon: Icon, accent }) {
  return (
    <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-brand-50">
      <Icon className="h-8 w-8 text-brand-600" strokeWidth={1.25} aria-hidden />
      {accent === "check" ? (
        <span className="absolute bottom-2 right-2 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-gold-500">
          <Check className="h-3 w-3 text-white" strokeWidth={3} aria-hidden />
        </span>
      ) : (
        <span className="absolute right-2 top-3 h-1.5 w-1.5 rounded-full bg-gold-500" aria-hidden />
      )}
    </div>
  );
}

/** Small green info strip, e.g. "You can paste the code directly into the boxes." */
export function InfoNote({ icon: Icon, children }) {
  return (
    <p className="flex items-center gap-3 rounded-md bg-brand-50 px-4 py-3 text-xs text-brand-600">
      <Icon className="h-4 w-4 shrink-0" aria-hidden />
      {children}
    </p>
  );
}

/** Red message shown above the button when the server rejects a request. */
export function FormAlert({ children }) {
  if (!children) return null;
  return (
    <p role="alert" className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
      {children}
    </p>
  );
}