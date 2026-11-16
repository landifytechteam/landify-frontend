/**
 * All copy, links and listing data for the landing page.
 *
 * Items marked TODO are placeholders that could not be taken from the design.
 * When the API is ready, replace `featuredProperties` (and the search options)
 * with a fetch in src/pages/LandingPage.jsx and pass the result into the components.
 *
 * Each featured property must have this shape:
 * {
 *   id: string,
 *   title: string,
 *   type: string,          // e.g. "Detached duplex"
 *   location: string,
 *   bedrooms: number,
 *   bathrooms: number,
 *   price: number,         // in naira; formatted with formatNaira()
 *   image: string,         // path under /public or a full URL
 *   href: string,          // link for "View Details"
 *   status: string,        // e.g. "For sale"
 *   isDemo?: boolean,      // true shows the "Demo listing" badge + disclaimer
 * }
 */

// ---------------------------------------------------------------------------
// Routes. TODO: point these at the real pages once they exist.
// ---------------------------------------------------------------------------
export const routes = {
  home: "/",
  properties: "/properties",
  about: "/#about",
  features: "/#features",
  contact: "/#contact",
  paymentPlans: "/#payment-plans",
  login: "/login",
  signup: "/signup",
  signupClient: "/signup?role=client",
  signupCompany: "/signup?role=company",
  signupPartner: "/signup?role=partner",
  forCompanies: "/companies",
  forPartners: "/partners",
  privacy: "/privacy",
  terms: "/terms",
};

// Property types used by the landing search AND the /properties filter.
// TODO: confirm the exact spellings with the backend's propertyType values.
export const PROPERTY_TYPES = ["Residential", "Commercial", "Mixed-use", "Agricultural"];

export const navLinks = [
  { label: "Home", href: routes.home },
  { label: "Properties", href: routes.properties },
  { label: "About", href: routes.about },
  { label: "Features", href: routes.features },
  { label: "Contact", href: routes.contact },
];

// ---------------------------------------------------------------------------
// Search bar options. TODO: load from the API (locations, property types).
// ---------------------------------------------------------------------------
export const searchOptions = {
  locations: [
    { label: "Lekki, Lagos", value: "lekki-lagos" },
    { label: "Victoria Island, Lagos", value: "victoria-island-lagos" },
    { label: "Ikoyi, Lagos", value: "ikoyi-lagos" },
    { label: "Asokoro, Abuja", value: "asokoro-abuja" },
    { label: "Maitama, Abuja", value: "maitama-abuja" },
  ],
  // Same names the /properties page filters by (sent to the API as ?propertyType=)
  propertyTypes: PROPERTY_TYPES.map((t) => ({ label: t, value: t })),
  budgets: [
    { label: "Under ₦50m", value: "0-50000000" },
    { label: "₦50m – ₦100m", value: "50000000-100000000" },
    { label: "₦100m – ₦250m", value: "100000000-250000000" },
    { label: "Above ₦250m", value: "250000000-" },
  ],
};

// ---------------------------------------------------------------------------
// Featured properties. TODO: replace with real listings from the API.
// These are the demo listings shown in the design.
// ---------------------------------------------------------------------------
export const featuredProperties = [
  {
    id: "demo-palm-residence",
    title: "The Palm Residence",
    type: "Detached duplex",
    location: "Lekki Phase 1, Lagos",
    bedrooms: 4,
    bathrooms: 5,
    price: 185_000_000,
    image: "/images/landing/property-palm-residence.jpg",
    href: "/properties/demo-palm-residence",
    status: "For sale",
    isDemo: true,
  },
  {
    id: "demo-asokoro-garden-villa",
    title: "Asokoro Garden Villa",
    type: "Detached villa",
    location: "Asokoro, Abuja",
    bedrooms: 5,
    bathrooms: 6,
    price: 320_000_000,
    image: "/images/landing/property-asokoro-villa.jpg",
    href: "/properties/demo-asokoro-garden-villa",
    status: "For sale",
    isDemo: true,
  },
  {
    id: "demo-oniru-apartments",
    title: "The Oniru Apartments",
    type: "Apartment",
    location: "Oniru, Victoria Island, Lagos",
    bedrooms: 3,
    bathrooms: 3,
    price: 95_000_000,
    image: "/images/landing/property-oniru-apartments.jpg",
    href: "/properties/demo-oniru-apartments",
    status: "For sale",
    isDemo: true,
  },
];

// ---------------------------------------------------------------------------
// Images. TODO: replace the files in public/images/landing/ with full-resolution
// photos (the current ones are low-res crops of the design mock-up).
// ---------------------------------------------------------------------------
export const images = {
  hero: "/images/landing/hero.jpg",
  about: "/images/landing/about.jpg",
  whyChooseUs: "/images/landing/why-choose-us.jpg",
  paymentPlans: "/images/landing/payment-plans.jpg",
  cta: "/images/landing/cta.jpg",
};

// ---------------------------------------------------------------------------
// Contact details. TODO: the design itself marks these as placeholders.
// ---------------------------------------------------------------------------
export const contact = {
  email: "hello@landify.example",
  phone: "+234 (0) 000 000 0000",
  address: "Office address to be confirmed, Nigeria",
};

export const howItWorksSteps = [
  {
    title: "Discover a property",
    body: "Explore locations and property types that fit the life you have in mind.",
  },
  {
    title: "Review the details",
    body: "Understand the pricing, specifications and company’s terms. Ask questions.",
  },
  {
    title: "Reserve or purchase",
    body: "Choose your next step using the options available for that property.",
  },
  {
    title: "Follow the payment plan",
    body: "Where a payment plan applies, track instalments against the agreed schedule.",
  },
  {
    title: "Access documents",
    body: "Find available documents shared by the property company in one place.",
  },
];

export const footerColumns = [
  {
    title: "Explore",
    links: [
      { label: "Home", href: routes.home },
      { label: "Properties", href: routes.properties },
      { label: "Features", href: routes.features },
      { label: "Payment Plans", href: routes.paymentPlans },
    ],
  },
  {
    title: "Landify",
    links: [
      { label: "About Us", href: routes.about },
      { label: "For Companies", href: routes.forCompanies },
      { label: "For Sales Partners", href: routes.forPartners },
      { label: "Contact", href: routes.contact },
    ],
  },
];

export function formatNaira(amount) {
  return `₦${amount.toLocaleString("en-NG")}`;
}