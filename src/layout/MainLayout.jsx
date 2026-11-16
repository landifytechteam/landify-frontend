import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Navbar } from "../components/landing/Navbar";
import { Footer } from "../components/landing/Footer";

/**
 * Navbar + Footer around every public page. Pages rendered inside it must NOT
 * render their own Navbar/Footer (that caused the double navbar).
 */
export default function MainLayout() {
  useScrollOnNavigate();

  return (
    <div>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

/**
 * <Link to="/#about"> changes the URL without a reload, so the browser no
 * longer jumps to the section by itself. This scrolls to the #section (waiting
 * briefly in case the lazy page is still loading), or to the top for a new page.
 */
function useScrollOnNavigate() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      return;
    }
    let tries = 0;
    const timer = setInterval(() => {
      const el = document.getElementById(hash.slice(1));
      if (el || ++tries > 20) clearInterval(timer);
      el?.scrollIntoView({ behavior: "smooth" });
    }, 50);
    return () => clearInterval(timer);
  }, [pathname, hash]);
}
