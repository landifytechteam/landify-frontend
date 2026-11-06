import { House } from "lucide-react";
import { ButtonLink } from "../ui/Button";
import { images, routes } from "../../data/landing";

export function Hero() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 xl:px-0">
      <div className="relative overflow-hidden rounded-2xl bg-brand-900">
        <img
          src={images.hero}
          alt="Modern two-storey home surrounded by tropical plants"
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* Green wash so the white text stays readable over the photo */}
        <div className="absolute inset-0 bg-linear-to-r from-brand-900/95 via-brand-900/70 to-brand-900/20" />

        <div className="relative flex min-h-160 flex-col justify-between px-6 py-12 sm:px-14 sm:py-14">
          <div className="max-w-150">
            <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wide text-white">
              <span className="h-0.5 w-6 bg-gold-500" aria-hidden />A better way to find your place
            </p>
            <h1 className="mt-8 text-5xl font-semibold leading-[1.05] tracking-tight text-white sm:text-7xl">
              Your Next Property Starts Here
            </h1>
            <p className="mt-8 max-w-117.5 text-lg leading-relaxed text-white/90">
              Discover a place to call yours. Connect with property companies and manage your
              journey, from first look to the next milestone, with Landify.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <ButtonLink href={routes.properties} arrow>
                Explore Properties
              </ButtonLink>
              <ButtonLink href={routes.signup} variant="outline-light">
                Get Started
              </ButtonLink>
            </div>
          </div>

          <div className="mt-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <p className="flex items-center gap-3 text-sm text-white">
              <House className="h-4 w-4 text-gold-500" aria-hidden />
              Find your place. Keep your journey in view.
            </p>
            <div className="text-xs text-white/90 sm:text-right">
              <p className="uppercase tracking-wide">The art of living well</p>
              <p className="mt-1 flex items-center gap-2 sm:justify-end">
                <span className="h-1.5 w-1.5 rounded-full bg-gold-500" aria-hidden />
                Nigerian homes, thoughtfully considered
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}