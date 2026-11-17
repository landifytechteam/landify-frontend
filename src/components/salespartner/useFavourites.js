import { useCallback, useState } from "react";

// Saved (♥) properties, kept in this browser only.
// TODO (backend): there's no "saved properties" endpoint, so hearts don't follow
// the partner to another device. Swap these two helpers for API calls once it exists.
const KEY = "landify:partner-favourites";

const load = () => {
  try {
    return new Set(JSON.parse(localStorage.getItem(KEY)) ?? []);
  } catch {
    return new Set(); // storage blocked (private mode): hearts just won't persist
  }
};
const save = (set) => {
  try {
    localStorage.setItem(KEY, JSON.stringify([...set]));
  } catch {
    // ignore, see above
  }
};

export function useFavourites() {
  const [ids, setIds] = useState(load);

  const toggle = useCallback((id) => {
    setIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      save(next);
      return next;
    });
  }, []);

  return { isFavourite: (id) => ids.has(id), toggle };
}
