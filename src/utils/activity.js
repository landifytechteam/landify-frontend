// ---------------------------------------------------------------------------
// Counts how many requests are running right now, app-wide. The top progress
// bar (components/ui/TopProgressBar.jsx) shows while the count is above 0.
//
// You rarely call this yourself: every axios request and every
// useRequest/useAction call is counted automatically. For anything else that
// makes the user wait, wrap it:   await track(somePromise)
// ---------------------------------------------------------------------------

let running = 0;
const listeners = new Set();
const emit = () => listeners.forEach((fn) => fn());

export const activity = {
  start() {
    running += 1;
    emit();
  },
  done() {
    running = Math.max(0, running - 1); // never below 0, even if a done() is doubled
    emit();
  },
  /** For useSyncExternalStore: call `fn` on every change, return an unsubscribe. */
  subscribe(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
  isBusy: () => running > 0,
};

/** Count a promise as "work in progress" until it settles; returns the same result. */
export async function track(promise) {
  activity.start();
  try {
    return await promise;
  } finally {
    activity.done();
  }
}
