import { ArrowUpRight } from "lucide-react";
import { AppLink } from "./AppLink";

const variants = {
  gold: "bg-gold-500 text-ink hover:bg-gold-400",
  primary: "bg-brand-600 text-white hover:bg-brand-700",
  outline: "border border-line bg-white text-ink hover:border-brand-600",
  "outline-light": "border border-white/60 text-white hover:bg-white/10",
};

export function ButtonLink({ href, children, variant = "gold", arrow = false, className = "" }) {
  return (
    <AppLink
      href={href}
      className={`inline-flex h-13 items-center justify-center gap-3 rounded-md px-6 text-sm font-semibold transition-colors ${variants[variant]} ${className}`}
    >
      {children}
      {arrow && <ArrowUpRight className="h-4 w-4" aria-hidden />}
    </AppLink>
  );
}