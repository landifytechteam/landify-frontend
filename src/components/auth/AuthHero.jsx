import { MapPin, ShieldCheck } from "lucide-react";
import { Logo } from "../ui/Logo";
import { authHero, authImages } from "../../data/auth";

/** Left photo panel shared by the sign up and log in pages. Hidden below lg. */
export function AuthHero() {
  return (
    <aside className="relative hidden overflow-hidden bg-brand-900 lg:sticky lg:top-0 lg:block lg:h-screen lg:w-[44%] lg:shrink-0">
      <img
        src={authImages.hero}
        alt="Modern two-storey home surrounded by tropical plants"
        className="absolute inset-x-0 top-0 h-[68%] w-full object-cover object-bottom"
      />
      {/* Photo sits at the top and fades into solid green behind the copy */}
      <div className="absolute inset-0 bg-linear-to-b from-black/25 via-transparent via-25% to-brand-900 to-68%" />

      <div className="relative flex h-full flex-col justify-between px-12 py-10">
        <div className="flex items-center justify-between">
          <Logo tone="light" />
          <span className="text-xs uppercase tracking-wide text-white/90">{authHero.country}</span>
        </div>

        <div>
          <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wide text-white">
            <span className="h-0.5 w-6 bg-gold-500" aria-hidden />
            {authHero.eyebrow}
          </p>
          <h2 className="mt-6 text-5xl font-semibold leading-[1.1] tracking-tight text-white">
            {authHero.title}
          </h2>
          <p className="mt-6 max-w-107.5 text-base leading-relaxed text-white/90">
            {authHero.body}
          </p>

          <div className="mt-8 border-t border-white/15 pt-6">
            <p className="flex items-center gap-3 text-sm text-white">
              <ShieldCheck className="h-5 w-5 text-gold-500" aria-hidden />
              {authHero.tagline}
            </p>
            <div className="mt-10 flex items-center justify-between">
              <p className="flex items-center gap-2 text-xs text-white/90">
                <MapPin className="h-3.5 w-3.5" aria-hidden />
                {authHero.caption}
              </p>
              <span className="flex items-center gap-1.5" aria-hidden>
                <span className="h-0.5 w-6 rounded-full bg-gold-500" />
                <span className="h-1 w-1 rounded-full bg-white/50" />
                <span className="h-1 w-1 rounded-full bg-white/50" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}