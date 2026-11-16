// ---------------------------------------------------------------------------
// Sign up / log in settings. The API calls themselves live in context/AuthContext.jsx.
// ---------------------------------------------------------------------------

export const authRoutes = {
  home: "/",
  login: "/login",
  signup: "/signup",
  forgotPassword: "/forgot-password",
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

// Where each role lands after login. Keys are what getRole(user) returns.
export const homeForRole = {
  "Client": "/clients",
  "Sales Partner": "/salespartner",
  "Company Admin": "/admin",
  superadmin: "/superadmin",
};

// Super admin is a flag, not an accountType, so check it first.
export const getRole = (user) => (user?.isSuperAdmin ? "superadmin" : user?.accountType);
