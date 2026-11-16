import { createContext, useContext } from "react";

export const RefreshBadgesContext = createContext(() => {});

/** Call after a change that moves a sidebar count (e.g. approving a submission). */
export const useRefreshBadges = () => useContext(RefreshBadgesContext);