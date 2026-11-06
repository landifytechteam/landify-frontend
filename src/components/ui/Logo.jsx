/**
 * TODO: replace the inline SVG with the designer's logo file
 * (e.g. <img src="/logo.svg" alt="Landify" />). This is a close approximation.
 *
 * tone="light" is the gold-and-white version used on dark photos (auth pages).
 */
export function Logo({ tone = "default", className = "" }) {
  const light = tone === "light";
  return (
    <a
      href="/"
      className={`flex items-center gap-2 ${light ? "text-white" : "text-brand-600"} ${className}`}
    >
      <svg
        viewBox="0 0 36 36"
        className={`h-9 w-9 ${light ? "text-gold-500" : ""}`}
        fill="currentColor"
        aria-hidden
      >
        <path d="M18 2 2 15.5l2.6 3L18 7.2l13.4 11.3 2.6-3z" />
        <path d="M8 18h7v6h6v-6h-2v-3h7v19H8z" />
        <path d="M15 24h6v4h-6z" fill={light ? "#073d2b" : "white"} />
      </svg>
      <span className="text-[28px] font-medium tracking-tight">Landify</span>
    </a>
  );
}