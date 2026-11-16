import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, ImageOff, Images } from "lucide-react";
import { Modal } from "../dashboard/Modal";

/** <img> that shows a grey placeholder if the file is missing. */
function Photo({ src, alt, className }) {
  // Remember WHICH image failed, so a new src automatically gets another try
  const [failedSrc, setFailedSrc] = useState(null);
  if (!src || failedSrc === src) {
    return (
      <div className={`flex items-center justify-center bg-canvas text-body ${className}`}>
        <ImageOff className="h-6 w-6" aria-label="Image unavailable" />
      </div>
    );
  }
  return <img src={src} alt={alt} className={`object-cover ${className}`} onError={() => setFailedSrc(src)} />;
}

/**
 * Big photo + two thumbnails + "View all" tile. Clicking a thumbnail swaps the
 * big photo; "View all" (or the big photo) opens a full-size viewer with arrows.
 */
export function ImageGallery({ images = [], title, caption = "Company-submitted imagery" }) {
  const [current, setCurrent] = useState(0);
  const [viewerOpen, setViewerOpen] = useState(false);
  const count = images.length;
  const go = (step) => setCurrent((i) => (i + step + count) % count);

  // Arrow keys move through photos while the viewer is open
  useEffect(() => {
    if (!viewerOpen) return;
    const onKey = (e) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewerOpen, count]);

  if (!count) {
    return <div className="flex h-64 items-center justify-center rounded-xl border border-line bg-white text-sm text-body">No images submitted.</div>;
  }

  const others = images.map((src, i) => ({ src, i })).filter((x) => x.i !== current).slice(0, 2);

  return (
    <section className="overflow-hidden rounded-xl border border-line bg-white">
      <button type="button" onClick={() => setViewerOpen(true)} className="relative block w-full" aria-label="Open photo viewer">
        <Photo src={images[current]} alt={`${title} photo ${current + 1}`} className="h-64 w-full sm:h-80 lg:h-85" />
        <span className="absolute left-3 top-3 rounded-md bg-brand-900/90 px-2.5 py-1 text-xs font-medium text-white">
          {caption} · {current + 1} of {count}
        </span>
      </button>
      <div className="grid grid-cols-3 gap-3 p-3">
        {others.map(({ src, i }) => (
          <button key={i} type="button" onClick={() => setCurrent(i)} className="overflow-hidden rounded-md ring-brand-600 hover:ring-2" aria-label={`Show photo ${i + 1}`}>
            <Photo src={src} alt="" className="h-20 w-full sm:h-24" />
          </button>
        ))}
        <button
          type="button"
          onClick={() => setViewerOpen(true)}
          className="flex h-20 flex-col items-center justify-center gap-1.5 rounded-md bg-canvas text-sm font-semibold text-brand-600 hover:bg-brand-50 sm:h-24"
        >
          <Images className="h-5 w-5" aria-hidden />
          View all {count} photos
        </button>
      </div>

      <Modal open={viewerOpen} onClose={() => setViewerOpen(false)} title={title} description={`Photo ${current + 1} of ${count} · Use ← → to browse`} size="lg">
        <div className="relative">
          <Photo src={images[current]} alt={`${title} photo ${current + 1}`} className="h-[55vh] w-full rounded-lg" />
          {count > 1 && (
            <>
              <button type="button" onClick={() => go(-1)} className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow hover:bg-white" aria-label="Previous photo">
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button type="button" onClick={() => go(1)} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow hover:bg-white" aria-label="Next photo">
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}
        </div>
        <div className="mt-4 flex gap-3 overflow-x-auto">
          {images.map((src, i) => (
            <button key={i} type="button" onClick={() => setCurrent(i)} className={`shrink-0 overflow-hidden rounded-md ${i === current ? "ring-2 ring-brand-600" : "opacity-70 hover:opacity-100"}`}>
              <Photo src={src} alt="" className="h-16 w-24" />
            </button>
          ))}
        </div>
      </Modal>
    </section>
  );
}