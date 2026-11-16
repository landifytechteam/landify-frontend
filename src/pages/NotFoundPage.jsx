import { ButtonLink } from "../components/ui/Button";

/** Shown for any URL that doesn't match a route (rendered inside MainLayout). */
export default function NotFoundPage() {
  return (
    <div className="mx-auto flex max-w-7xl flex-col items-center px-4 py-32 text-center sm:px-6 xl:px-0">
      <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">404</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight text-ink">We couldn&apos;t find that page</h1>
      <p className="mt-3 text-body">It may have moved, or it isn&apos;t built yet.</p>
      <ButtonLink href="/" arrow className="mt-8">
        Back to home
      </ButtonLink>
    </div>
  );
}
