import { useEffect, useRef, useState } from "react";

// Browsers without IntersectionObserver (very old ones) just show everything.
const canObserve = () => typeof window !== "undefined" && "IntersectionObserver" in window;

/**
 * Makes an element fade/slide in the first time it scrolls into view.
 * Spread the result onto the element; the animation itself lives in index.css.
 *
 *   const reveal = useReveal("left");
 *   return <section {...reveal}>...</section>;
 *
 * `from`: "up" (default), "left", "right", "zoom" or "fade".
 * Elements already on screen when the page opens animate in straight away.
 */
export function useReveal(from = "up") {
  const ref = useRef(null);
  const [visible, setVisible] = useState(() => !canObserve());

  useEffect(() => {
    const el = ref.current;
    if (!el || visible) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setVisible(true);
        observer.disconnect(); // animate once, not every time it scrolls past
      },
      // Fire when the top of the element is 10% above the bottom of the screen
      { threshold: 0, rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [visible]);

  return { ref, "data-reveal": from, "data-visible": visible || undefined };
}
