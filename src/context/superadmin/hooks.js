import { useCallback, useEffect, useRef, useState } from "react";
import { getErrorMessage } from "../../utils/apiError";

/**
 * Load data from an API function and track loading + error state.
 *
 *   const { data, loading, error, reload } = useRequest(superAdminApi.getCompanies, filters);
 *
 * It re-runs whenever `params` changes (compared by value), and keeps the old
 * data on screen while the new request runs, so tables don't flash empty.
 * Pass `null` as params to skip the request.
 */
export function useRequest(fn, params) {
  // Keep the latest `fn` without re-running the request when it changes.
  // (Updated in an effect: writing a ref during render is not allowed.)
  const fnRef = useRef(fn);
  useEffect(() => {
    fnRef.current = fn;
  });

  const key = JSON.stringify(params ?? null);
  const [version, setVersion] = useState(0);
  const requestId = `${key}#${version}`;
  // `doneFor` says which request the stored data/error belong to. While it
  // differs from the current request we're loading, so there's no need to
  // call setState at the start of the effect.
  const [state, setState] = useState({ data: null, error: null, doneFor: null });

  useEffect(() => {
    if (params === null) return;
    let cancelled = false; // ignore answers that arrive after a newer request started
    fnRef
      .current(params)
      .then((data) => !cancelled && setState({ data, error: null, doneFor: requestId }))
      .catch((err) => !cancelled && setState((s) => ({ ...s, error: getErrorMessage(err, "Couldn't load this data."), doneFor: requestId })));
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestId]);

  const loading = params !== null && state.doneFor !== requestId;
  const reload = useCallback(() => setVersion((v) => v + 1), []);
  // Old data stays on screen while reloading; an old error is hidden meanwhile.
  return { data: state.data, loading, error: loading ? null : state.error, reload };
}

/**
 * Run a change (approve, suspend, save...) and track whether it's busy.
 *
 *   const approve = useAction(superAdminApi.approveSubmission);
 *   const result = await approve.run(id, body);   // resolves to the result, or null on error
 *   approve.busy, approve.error
 */
export function useAction(fn) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const run = useCallback(
    async (...args) => {
      setBusy(true);
      setError(null);
      try {
        return (await fn(...args)) ?? true;
      } catch (err) {
        setError(getErrorMessage(err, "Something went wrong. Please try again."));
        return null;
      } finally {
        setBusy(false);
      }
    },
    [fn],
  );

  return { run, busy, error, clearError: () => setError(null) };
}

/** Wait until the user stops typing before using a value (e.g. a search box). */
export function useDebouncedValue(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

/**
 * Filter + page state for list screens. Changing any filter jumps back to page 1.
 *
 *   const list = useListState({ search: "", status: "" });
 *   list.filters.status, list.setFilter("status", "active"), list.page, list.setPage(2), list.reset()
 */
export function useListState(initialFilters, pageSize = 10) {
  const [filters, setFilters] = useState(initialFilters);
  const [page, setPage] = useState(1);

  const setFilter = useCallback((name, value) => {
    setFilters((f) => ({ ...f, [name]: value }));
    setPage(1);
  }, []);

  const reset = useCallback(() => {
    setFilters(initialFilters);
    setPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const search = useDebouncedValue(filters.search ?? "");
  const params = { ...filters, search, page, pageSize };
  const isFiltered = Object.keys(initialFilters).some((k) => filters[k] !== initialFilters[k]);

  return { filters, setFilter, page, setPage, reset, params, pageSize, isFiltered };
}