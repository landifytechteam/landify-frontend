import { Check } from "lucide-react";
import { ButtonLink } from "../ui/Button";
import { Eyebrow } from "../ui/Eyebrow";
import { images, routes } from "../../data/landing";
import { Reveal } from "../ui/Reveal";

export function About() {
  return (
    <section id="about" className="bg-white py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-16 px-4 sm:px-6 lg:grid-cols-[552px_1fr] lg:gap-25 xl:px-0">
        <Reveal from="left" className="group relative aspect-552/520 overflow-hidden rounded-2xl">
          <img
            src={images.about}
            alt="Bright living room with tall windows and indoor plants"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
          <Reveal from="zoom" delay={400} className="absolute bottom-6 left-6 max-w-77.5 rounded-lg bg-white p-5 shadow-lg">
            <p className="text-[10px] uppercase tracking-wide text-brand-600">
              More than an address
            </p>
            <p className="mt-2 text-[22px] leading-snug text-ink">
              Room for the life you’re building.
            </p>
          </Reveal>
        </Reveal>

        <Reveal from="right" delay={150}>
          <Eyebrow>About Landify</Eyebrow>
          <h2 className="mt-6 text-4xl font-semibold leading-tight tracking-tight text-ink sm:text-5xl">
            Real estate, connected.
            <br />
            Your journey, simplified.
          </h2>
          <p className="mt-8 leading-7 text-body">
            Buying property is a big move. Keeping track of it shouldn’t be. Landify brings buyers,
            property companies and sales partners together in one real estate platform.
          </p>
          <p className="mt-5 leading-7 text-body">
            Discover opportunities, understand the details and keep your payments and available
            documents organised, with a clearer view of what comes next.
          </p>

          <ul className="mt-6 flex flex-wrap gap-8 border-y border-line py-5 text-sm text-ink">
            {["People, connected", "Progress, in view"].map((item) => (
              <li key={item} className="flex items-center gap-3">
                <Check className="h-4 w-4 text-brand-600" aria-hidden />
                {item}
              </li>
            ))}
          </ul>

          <ButtonLink href={routes.about} variant="outline" arrow className="mt-6">
            Get to Know Landify
          </ButtonLink>
        </Reveal>
      </div>
    </section>
  );
}