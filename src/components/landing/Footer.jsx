import { MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { Logo } from "../ui/Logo";
import { AppLink } from "../ui/AppLink";
import { contact, footerColumns, routes } from "../../data/landing";
import { Reveal } from "../ui/Reveal";

export function Footer() {
  return (
    <footer id="contact" className="bg-white">
      <div className="mx-auto max-w-7xl px-4 pt-16 sm:px-6 xl:px-0">
        <Reveal className="grid gap-12 md:grid-cols-2 lg:grid-cols-[445px_1fr_1fr_265px]">
          <div>
            <Logo />
            <p className="mt-6 max-w-77.5 text-sm leading-6 text-body">
              Connecting people, property and possibility. A clearer way to discover and manage your
              real estate journey.
            </p>
            <p className="mt-5 flex items-center gap-2 text-xs text-brand-600">
              <MapPin className="h-4 w-4" aria-hidden />
              Built for your next move in Nigeria.
            </p>
          </div>

          {footerColumns.map((col) => (
            <div key={col.title}>
              <p className="text-sm text-ink">{col.title}</p>
              <ul className="mt-5 space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <AppLink href={l.href} className="text-sm text-body hover:text-ink">
                      {l.label}
                    </AppLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <p className="text-sm text-ink">Let’s connect</p>
            {/* TODO: real contact details go in src/data/landing.js → contact */}
            <ul className="mt-5 space-y-3 text-sm text-body">
              <li>
                <a href={`mailto:${contact.email}`} className="hover:text-ink">
                  {contact.email}
                </a>
              </li>
              <li>
                <a href={`tel:${contact.phone.replace(/[^\d+]/g, "")}`} className="hover:text-ink">
                  {contact.phone}
                </a>
              </li>
              <li>{contact.address}</li>
            </ul>
          </div>
        </Reveal>

        <div className="mt-16 flex flex-col justify-between gap-4 border-t border-line py-7 text-xs text-body sm:flex-row">
          <p>© {new Date().getFullYear()} Landify. All rights reserved.</p>
          <div className="flex gap-7">
            <Link to={routes.privacy} className="hover:text-ink">
              Privacy Policy
            </Link>
            <Link to={routes.terms} className="hover:text-ink">
              Terms of Use
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}