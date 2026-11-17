import { ButtonLink } from "../ui/Button";
import { Eyebrow } from "../ui/Eyebrow";
import { images, routes } from "../../data/landing";
import { Reveal } from "../ui/Reveal";

export function CallToAction() {
  return (
    <section className="bg-brand-600 py-16 text-white">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_400px] xl:px-0">
        <Reveal>
          <Eyebrow tone="gold">Your next chapter is waiting</Eyebrow>
          <h2 className="mt-6 text-4xl font-normal leading-tight sm:text-[56px]">
            Your Property Journey Starts Today
          </h2>
          <p className="mt-6 max-w-140 leading-7 text-white/90">
            Find new possibilities. Bring the details together. Take your next step with Landify.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href={routes.signup} arrow>
              Create Account
            </ButtonLink>
            <ButtonLink href={routes.properties} variant="outline-light">
              Explore Properties
            </ButtonLink>
          </div>
        </Reveal>
        <Reveal from="right" delay={200} className="group relative aspect-400/330 overflow-hidden rounded-2xl">
          <img
            src={images.cta}
            alt="Modern home entrance with a timber door"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
        </Reveal>
      </div>
    </section>
  );
}