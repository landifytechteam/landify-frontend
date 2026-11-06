import { ArrowRight, LoaderCircle } from "lucide-react";

/** Full-width green submit button with a spinner while the request runs. */
export function SubmitButton({ loading, children }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="flex h-13 w-full items-center justify-center gap-3 rounded-md bg-brand-600 text-[15px] font-semibold text-white shadow-[0_8px_20px_-8px_rgba(11,93,59,0.6)] transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-70"
    >
      {loading ? (
        <LoaderCircle className="h-5 w-5 animate-spin" aria-label="Please wait" />
      ) : (
        <>
          {children}
          <ArrowRight className="h-4 w-4" aria-hidden />
        </>
      )}
    </button>
  );
}