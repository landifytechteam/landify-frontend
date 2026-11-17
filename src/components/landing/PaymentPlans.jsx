import { CalendarDays, Check, CircleCheck } from "lucide-react";
import { ButtonLink } from "../ui/Button";
import { Eyebrow } from "../ui/Eyebrow";
import { images, routes } from "../../data/landing";
import { Reveal } from "../ui/Reveal";

const planSteps = [
  "Review the property’s terms",
  "Understand the agreed schedule",
  "Keep recorded payments in view",
];

const points = [
  {
    title: "Options, not assumptions",
    body: "Available instalment options depend on each property’s terms.",
  },
  {
    title: "Clarity before commitment",
    body: "Review the deposit, schedule, fees and conditions with the property company.",
  },
];

export function PaymentPlans() {
  return (
    <section id="payment-plans" className="bg-sand py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-16 px-4 sm:px-6 lg:grid-cols-[568px_1fr] lg:gap-24 xl:px-0">
        <Reveal from="left" className="relative pb-20 lg:pb-0">
          <div className="group relative aspect-520/470 w-full max-w-130 overflow-hidden rounded-2xl">
            <img
              src={images.paymentPlans}
              alt="Shaded patio with a timber pergola and lush plants"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
          </div>

          <Reveal from="zoom" delay={450} className="absolute bottom-0 right-0 w-[min(370px,90%)] rounded-2xl bg-white p-7 shadow-xl lg:-bottom-16 lg:right-0">
            <div className="flex items-center justify-between">
              <p className="text-base font-medium text-ink">A plan you can follow</p>
              <CalendarDays className="h-5 w-5 text-brand-600" aria-hidden />
            </div>
            <ul className="mt-5 space-y-4">
              {planSteps.map((s) => (
                <li key={s} className="flex items-center gap-3 text-sm text-body">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-50">
                    <Check className="h-3.5 w-3.5 text-brand-600" aria-hidden />
                  </span>
                  {s}
                </li>
              ))}
            </ul>
            <p className="mt-5 text-[10px] text-body">
              Illustrative journey · not a financing offer
            </p>
          </Reveal>
        </Reveal>

        <Reveal from="right" delay={150}>
          <Eyebrow>Flexible payment plans</Eyebrow>
          <h2 className="mt-6 text-4xl font-semibold leading-tight tracking-tight text-ink sm:text-5xl">
            Your next chapter.
            <br />A considered pace.
          </h2>
          <p className="mt-8 text-[17px] leading-7 text-body">
            A great property deserves a payment conversation that makes sense for you. Explore
            instalment options where offered, review the schedule and keep track of your progress
            with Landify.
          </p>

          <ul className="mt-6 space-y-5">
            {points.map((p) => (
              <li key={p.title} className="flex gap-4">
                <CircleCheck className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" aria-hidden />
                <div>
                  <p className="font-semibold text-ink">{p.title}</p>
                  <p className="mt-1 text-sm text-body">{p.body}</p>
                </div>
              </li>
            ))}
          </ul>

          <ButtonLink href={routes.properties} variant="primary" arrow className="mt-8">
            Explore Property Options
          </ButtonLink>

          <p className="mt-8 text-xs leading-5 text-body">
            Landify does not promise universal financing, fixed rates or guaranteed payment terms.
            Confirm availability with the property company.
          </p>
        </Reveal>
      </div>
    </section>
  );
}