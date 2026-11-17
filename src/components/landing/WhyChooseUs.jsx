import { BadgeCheck, Files, ScanText, ShieldCheck, WalletCards } from "lucide-react";
import { Eyebrow } from "../ui/Eyebrow";
import { images } from "../../data/landing";
import { Reveal } from "../ui/Reveal";

const reasons = [
  {
    icon: BadgeCheck,
    title: "Verified, where it matters",
    body: "Look for verification details on applicable listings and review the information provided before you decide.",
  },
  {
    icon: ScanText,
    title: "Details you can actually use",
    body: "See property specifications, pricing and the company’s terms together, so you can ask better questions.",
  },
  {
    icon: ShieldCheck,
    title: "Supported payment processing",
    body: "Use secure payment processing where supported. Available payment methods depend on the property and provider.",
  },
  {
    icon: WalletCards,
    title: "Your payments, in perspective",
    body: "Keep track of recorded payments, upcoming instalments and your progress in one convenient place.",
  },
  {
    icon: Files,
    title: "Less paperwork. More clarity.",
    body: "Access and organise available property documents as they are shared by the property company.",
  },
];

export function WhyChooseUs() {
  return (
    <section id="features" className="bg-brand-900 py-24 text-white">
      <div className="mx-auto grid max-w-7xl gap-14 px-4 sm:px-6 lg:grid-cols-[440px_1fr] lg:gap-25 xl:px-0">
        <Reveal from="left">
          <Eyebrow tone="gold">Why choose us</Eyebrow>
          <h2 className="mt-7 text-4xl font-normal leading-tight sm:text-5xl">
            Big decisions deserve a clearer picture.
          </h2>
          <p className="mt-9 leading-7 text-white/85">
            Thoughtful tools to help you move forward with more information, less friction and a
            better sense of what comes next.
          </p>
          <div className="group relative mt-8 aspect-440/280 overflow-hidden rounded-xl">
            <img
              src={images.whyChooseUs}
              alt="Sunlit entrance with a wooden door and tropical plants"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
          </div>
          <p className="mt-8 text-xs leading-5 text-white/75">
            Always review the terms and carry out your own due diligence before making a property
            commitment.
          </p>
        </Reveal>

        <ul>
          {reasons.map((reason, i) => (
            <Reveal
              as="li"
              key={reason.title}
              delay={i * 100}
              className={`group flex gap-6 py-6 ${i < reasons.length - 1 ? "border-b" : ""} ${
                i === 0 ? "border-t" : ""
              } border-white/15`}
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-white/5 transition-colors duration-300 group-hover:bg-gold-500/15">
                <reason.icon className="h-5 w-5 text-gold-500" aria-hidden />
              </span>
              <div>
                <h3 className="text-xl">{reason.title}</h3>
                <p className="mt-2 text-sm leading-6 text-white/80">{reason.body}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}