import { useEffect, useRef, useSyncExternalStore } from "react";
import { activity } from "../../utils/activity";

const SHOW_AFTER_MS = 150; // quick requests finish before the bar appears, so it doesn't flicker

/**
 * Thin gold bar across the top of the screen while ANY request is running
 * (see utils/activity.js). Mounted once in App.jsx.
 *
 * Nobody knows how long a request will take, so the bar creeps towards 90%
 * (fast at first, then slower), then shoots to 100% and fades when it's done.
 * The animation writes straight to the element's style, so it doesn't
 * re-render React 60 times a second.
 */
export function TopProgressBar() {
  const busy = useSyncExternalStore(activity.subscribe, activity.isBusy);
  const barRef = useRef(null);
  const progress = useRef(0);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;

    if (busy) {
      let frame;
      const creep = () => {
        progress.current += (0.9 - progress.current) * 0.015;
        bar.style.transform = `scaleX(${progress.current})`;
        frame = requestAnimationFrame(creep);
      };
      const timer = setTimeout(() => {
        progress.current = Math.max(progress.current, 0.08);
        bar.style.transition = "opacity 150ms";
        bar.style.opacity = "1";
        creep();
      }, progress.current > 0 ? 0 : SHOW_AFTER_MS); // already showing? keep going straight away
      return () => {
        clearTimeout(timer);
        cancelAnimationFrame(frame);
      };
    }

    // Done: finish the bar, fade it out, then reset for next time
    if (progress.current === 0) return; // never became visible
    bar.style.transition = "transform 200ms ease-out, opacity 300ms 200ms";
    bar.style.transform = "scaleX(1)";
    bar.style.opacity = "0";
    const reset = setTimeout(() => {
      progress.current = 0;
      bar.style.transition = "none";
      bar.style.transform = "scaleX(0)";
    }, 550);
    return () => clearTimeout(reset);
  }, [busy]);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-100 h-[3px]" aria-hidden>
      <div
        ref={barRef}
        className="h-full origin-left bg-gold-500 shadow-[0_0_10px_rgba(201,162,39,0.7)]"
        style={{ transform: "scaleX(0)", opacity: 0 }}
      />
    </div>
  );
}
