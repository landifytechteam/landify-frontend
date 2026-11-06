import { ArrowUpRight, Building2, Handshake, House } from "lucide-react";
import { Eyebrow } from "../ui/Eyebrow";
import { routes } from "../../data/landing";

const roles = [
  {
    icon: House,
    tag: "Clients",
    title: "Find your place.",
    body: "For buyers ready to turn a property search into a more organised journey.",
    bullets: [
      "Explore property opportunities",
      "Keep track of your payments",
      "Access available documents",
    ],
    cta: "Join as a Client",
    href: routes.signupClient,
  },
  {
    icon: Building2,
    tag: "Company Admins",
    title: "Bring it all together.",
    body: "For property companies managing listings, clients and the details in between.",
    bullets: [
      "Organise your property listings",
      "Manage client and payment records",
      "Share relevant property documents",
    ],
    cta: "Register Your Company",
    href: routes.signupCompany,
  },
  {
    icon: Handshake,
    tag: "Sales Partners",
    title: "Make better connections.",
    body: "For partners connecting the right people with the right property opportunities.",
    bullets: [
      "Discover company opportunities",
      "Keep client referrals organised",
      "Follow your sales activity",
    ],
    cta: "Become a Sales Partner",
    href: routes.signupPartner,
  },
];

export function Roles() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 xl:px-0">
        <Eyebrow>Who Landify serves</Eyebrow>
        <h2 className="mt-4 text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
          Different roles. Shared possibilities.
        </h2>
        <p className="mt-5 text-body">
          One connected platform for the people moving real estate forward.
        </p>

        <div className="mt-14 grid gap-6 text-left lg:grid-cols-3">
          {roles.map((role) => (
            <article
              key={role.tag}
              className="flex flex-col rounded-2xl border border-line bg-white p-8"
            >
              <div className="flex items-center justify-between">
                <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-50">
                  <role.icon className="h-5 w-5 text-brand-600" aria-hidden />
                </span>
                <span className="text-xs font-semibold text-brand-600">{role.tag}</span>
              </div>
              <h3 className="mt-6 text-2xl font-semibold text-ink">{role.title}</h3>
              <p className="mt-3 text-sm leading-6 text-body">{role.body}</p>
              <ul className="mt-5 flex-1 space-y-3">
                {role.bullets.map((b) => (
                  <li key={b} className="flex items-center gap-3 text-sm text-body">
                    <span className="h-1 w-1 rounded-full bg-gold-500" aria-hidden />
                    {b}
                  </li>
                ))}
              </ul>
              <a
                href={role.href}
                className="mt-6 flex items-center justify-between border-t border-line pt-6 text-sm font-semibold text-brand-600 hover:underline"
              >
                {role.cta}
                <ArrowUpRight className="h-4 w-4" aria-hidden />
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}