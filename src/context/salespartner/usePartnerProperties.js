import useAuth from "../useAuth";
import { useRequest } from "../hooks";
import { partnerApi } from "./partnerApi";

/**
 * The partner's company properties (LIVE endpoint).
 * TODO (backend): the login user has `companyId` only for company accounts so far.
 * If a partner's account has no companyId, this falls back to every public listing.
 */
export function usePartnerProperties() {
  const { user } = useAuth();
  return useRequest(partnerApi.getProperties, { companyId: user?.companyId ?? "" });
}
