import { Eyebrow } from "../ui/Eyebrow";
import { howItWorksSteps } from "../../data/landing";
import { Reveal } from "../ui/Reveal";

export function HowItWorks() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 xl:px-0">
        <Reveal>
          <Eyebrow>How it works</Eyebrow>
        </Reveal>
        <Reveal className="mt-4 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <h2 className="text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
            From possibility to a plan.
          </h2>
          <p className="max-w-75 leading-7 text-body">
            Five considered steps. One connected property journey.
          </p>
        </Reveal>

        <ol className="reveal-stagger mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-5 lg:gap-7">
          {howItWorksSteps.map((step, i) => (
            <Reveal as="li" key={step.title} className="group">
              <div className="flex items-center gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-50 text-sm font-semibold text-brand-900 transition-colors duration-300 group-hover:bg-brand-600 group-hover:text-white">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="h-px flex-1 bg-line" aria-hidden />
              </div>
              <h3 className="mt-8 text-lg font-semibold text-ink">{step.title}</h3>
              <p className="mt-4 text-sm leading-6 text-body">{step.body}</p>
            </Reveal>
          ))}
        </ol>

        <p className="mt-16 text-xs text-body">
          The exact process, reservation options and document availability depend on the property
          company and the selected property.
        </p>
      </div>
    </section>
  );
}