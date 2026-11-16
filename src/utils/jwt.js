/**
 * Read the data inside a JWT (no verification: the backend does that).
 * The refresh-token endpoint only returns `accessToken`, not `user`, so we
 * rebuild the user from the token's payload when the page reloads.
 */
export function decodeJwt(token) {
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => `%${c.charCodeAt(0).toString(16).padStart(2, "0")}`)
        .join(""),
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}

/** Same shape as `user` in the login response. */
export function userFromToken(token) {
  const p = decodeJwt(token);
  if (!p) return null;
  return {
    id: p.id ?? p._id ?? p.userId ?? p.sub,
    fullName: p.fullName ?? p.name ?? "",
    email: p.email ?? "",
    accountType: p.accountType,
    companyId: p.companyId ?? null,
    isSuperAdmin: Boolean(p.isSuperAdmin),
  };
}