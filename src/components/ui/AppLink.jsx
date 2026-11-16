import { Link } from "react-router-dom";

/**
 * One link component for data-driven links (nav, footer, cards).
 * - Internal paths ("/properties", "/#about") use React Router's <Link>, which
 *   changes the page without reloading the whole app (and losing the login).
 * - Everything else (mailto:, tel:, https://...) is a normal <a>.
 */
export function AppLink({ href, children, ...props }) {
  if (typeof href === "string" && href.startsWith("/")) {
    return (
      <Link to={href} {...props}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} {...props}>
      {children}
    </a>
  );
}
