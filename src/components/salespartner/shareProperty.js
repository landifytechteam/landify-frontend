import { useCallback } from "react";
import { useToast } from "../dashboard/useToast";

/**
 * Share a property's PUBLIC page (/properties/:id), which anyone can open
 * without logging in. Uses the phone's share sheet when there is one
 * (WhatsApp, SMS…), otherwise copies the link.
 *
 * Returns "shared", "copied", or null if the user cancelled / it failed.
 *
 * TODO (backend): to credit the partner for a sale that starts from this
 * link, the backend needs a referral field, e.g. /properties/:id?ref=<partnerId>
 * recorded on the inquiry. Nothing reads such a field yet, so it isn't added.
 */
export async function shareProperty(property) {
  const url = `${window.location.origin}/properties/${property.id}`;
  const text = `${property.name} in ${property.location}`;

  if (navigator.share) {
    try {
      await navigator.share({ title: property.name, text, url });
      return "shared";
    } catch (err) {
      if (err?.name === "AbortError") return null; // user closed the share sheet
    }
  }
  try {
    await navigator.clipboard.writeText(url);
    return "copied";
  } catch {
    return null;
  }
}

/** shareProperty + a toast telling the partner what happened. */
export function useShareProperty() {
  const toast = useToast();
  return useCallback(
    async (property) => {
      const result = await shareProperty(property);
      if (result === "copied") toast("Link copied. Paste it to your client.");
      else if (result === null && !navigator.share) toast("Couldn't copy the link. Try again.", "error");
    },
    [toast],
  );
}
