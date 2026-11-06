/** The small uppercase label above each section heading. */
export function Eyebrow({ children, tone = "green", className = "" }) {
  const color = tone === "gold" ? "text-gold-500 font-semibold" : "text-brand-600";
  return <p className={`text-xs uppercase tracking-wide ${color} ${className}`}>{children}</p>;
}