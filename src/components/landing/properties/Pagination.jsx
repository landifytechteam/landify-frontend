import { ChevronLeft, ChevronRight } from "lucide-react";

export function Pagination({ page, pageCount, onPageChange }) {
  if (pageCount <= 1) return null;

  const pages = Array.from({ length: pageCount }, (_, i) => i + 1);
  const box =
    "flex h-[30px] min-w-[30px] items-center justify-center rounded-md border px-2 text-xs transition-colors";

  return (
    <nav className="flex items-center gap-1.5" aria-label="Pagination">
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        aria-label="Previous page"
        className={`${box} border-line bg-white text-ink hover:border-brand-600 disabled:opacity-40`}
      >
        <ChevronLeft className="h-4 w-4" aria-hidden />
      </button>
      {pages.map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onPageChange(n)}
          aria-current={n === page ? "page" : undefined}
          className={`${box} ${
            n === page
              ? "border-brand-600 bg-brand-600 font-medium text-white"
              : "border-line bg-white text-body hover:border-brand-600"
          }`}
        >
          {n}
        </button>
      ))}
      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page === pageCount}
        aria-label="Next page"
        className={`${box} border-line bg-white text-ink hover:border-brand-600 disabled:opacity-40`}
      >
        <ChevronRight className="h-4 w-4" aria-hidden />
      </button>
    </nav>
  );
}

export default Pagination;