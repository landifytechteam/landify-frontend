// ---------------------------------------------------------------------------
// Sign up / log in placeholders. Everything you need to swap later lives here.
// ---------------------------------------------------------------------------

export const authRoutes = {
  home: "/",
  login: "/login",
  signup: "/signup",
  forgotPassword: "/forgot-password", // TODO: build this page
  afterSignup: "/verify-email", // TODO: confirm where new users land
  afterLogin: "/dashboard", // TODO: confirm per role (client, partner, company admin)
  otp: "/verify-otp",
  resetPassword: "/reset-password",
  // TODO: replace with the real legal pages once written
  terms: "/terms",
  privacy: "/privacy",
  // TODO: real support channel (mailto, WhatsApp or help centre)
  support: "mailto:support@landify.ng",
};

// TODO: replace with the designer's original photo; this is a crop of the mock-up.
export const authImages = {
  hero: "/images/auth/hero.jpg",
};

export const authHero = {
  country: "Nigeria",
  eyebrow: "A better way to property",
  title: "Your Property Journey Starts Here",
  body: "Discover exceptional properties, connect with trusted professionals, and make your next move with confidence.",
  tagline: "Your next chapter. A trusted place to begin.",
  caption: "Inspired by modern living in Ikoyi, Lagos",
};

// `value` matches the ?role= query used by the landing page links
// (/signup?role=client, /signup?role=partner, /signup?role=company).
export const accountTypes = [
  { value: "Client", label: "Client", slug: "client" },
  { value: "Sales Partner", label: "Sales Partner", slug: "partner" },
  { value: "Company Admin", label: "Company Admin", slug: "company" },
];

export const PASSWORD_HINT =
  "Use 8+ characters with uppercase, lowercase and a number.";

// ---------------------------------------------------------------------------
// API calls. TODO: wire these to the backend once the endpoints exist.
// Each should resolve on success and throw an Error with a readable message.
// ---------------------------------------------------------------------------

// eslint-disable-next-line no-unused-vars
export async function signUp(payload) {
  // TODO: POST /auth/signup with { fullName, email, phone, password, accountType }
  await new Promise((r) => setTimeout(r, 800));
}

// eslint-disable-next-line no-unused-vars
export async function logIn(payload) {
  // TODO: POST /auth/login with { email, password, remember }, then store the session
  await new Promise((r) => setTimeout(r, 800));
}

// eslint-disable-next-line no-unused-vars
export function continueWithGoogle(accountType) {
  // TODO: redirect to the backend's Google OAuth URL, e.g.
  // window.location.href = `${API_URL}/auth/google?role=${accountType ?? ""}`;
  alert("Google sign in isn't connected yet.");
}

export const homeForRole = {
  "Client": "/clients",
  "Sales Partner": "/salespartner",
  "Company Admin": "/admin",
  superadmin: "/superadmin",
};

export const getRole = (user) => (user?.isSuperAdmin ? "superadmin" : user?.accountType);
