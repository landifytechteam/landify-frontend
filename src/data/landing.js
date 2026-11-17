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
  faq: "/#faq",
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
  { label: "FAQ", href: routes.faq },
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

// ---------------------------------------------------------------------------
// FAQ. `topic` must be one of the `faqTopics` ids (it drives the filter chips).
// TODO (legal review): answers marked `underReview: true` (4, 5 and 10) may
// change after the team's review / a lawyer's advice. Nothing about the flag
// shows on the page; it's just a reminder for whoever edits this file.
// ---------------------------------------------------------------------------
export const faqTopics = [
  { id: "all", label: "All questions" },
  { id: "verification", label: "Verification" },
  { id: "documents", label: "Documents" },
  { id: "buying", label: "Buying & paying" },
  { id: "support", label: "Help & support" },
];

export const faqs = [
  {
    id: "land-is-real",
    topic: "verification",
    question: "How do I know the land is real?",
    answer:
      "Every plot on Landify has been checked before you see it. The company has to show us a registered survey, and we confirm the plot is where they say it is, by hand and with GPS. A plot that doesn't pass doesn't go up.",
  },
  {
    id: "is-it-safe",
    topic: "verification",
    question: "So is it completely safe to buy?",
    answer:
      "We won't tell you that, because nobody can honestly promise it. What we do is keep listings that fail our checks away from you, and show you what we checked so you know what to ask. Please have your own lawyer look at the documents before you commit.",
  },
  {
    id: "documents-to-be-added",
    topic: "documents",
    question: "The listing says some documents are “to be added.” Should I worry?",
    answer:
      "Ask about it. Some documents, like the C of O, take time, so a company can add them after approval. Each listing shows what is on file and what is still coming. If a document matters to you, ask when you'll have it before you pay your deposit.",
  },
  {
    id: "who-am-i-buying-from",
    topic: "buying",
    underReview: true,
    question: "Who am I buying from?",
    answer:
      "From the company that listed the plot. Landify checks the listing, runs your payment plan and shows you where you stand. It doesn't own the land.",
  },
  {
    id: "instalments",
    topic: "buying",
    underReview: true,
    question: "How does paying in instalments work?",
    answer:
      "You pick a plot, sign the contract online and pay an initial deposit. Then you pay the rest over the period the company has set. You can pay online or by bank transfer, and we confirm transfers automatically, so you don't need to send a receipt. Your dashboard shows what you've paid, what's left and your next due date.",
  },
  {
    id: "verify-identity",
    topic: "buying",
    question: "Why do I have to verify my identity?",
    answer:
      "So a plot ends up in the name of the person who paid for it. Each company decides what it needs from you. You can look around Landify before you do this.",
  },
  {
    id: "missed-payments",
    topic: "buying",
    question: "What if I can't keep up with my payments?",
    answer:
      "It happens, so there's a plan. You get reminders, and your dashboard shows when you're behind. The company gives you a grace period and a final notice, so nothing happens without warning. If you still can't pay, you choose: a smaller plot that matches what you've paid, a refund minus 30 to 40 percent (the company sets the exact figure), or adding money to reach a plot of a useful size. Nobody chooses for you.",
  },
  {
    id: "when-documents",
    topic: "documents",
    question: "When do I get my documents?",
    answer:
      "After your first deposit you can download your Contract of Sale, an invoice and an acknowledgement letter. Your final documents come after you've paid in full. Each company tells you up front how long that takes, and your dashboard shows whether yours are still being prepared or ready.",
  },
  {
    id: "partner-edits",
    topic: "support",
    question: "Can a sales partner change what a listing says?",
    answer:
      "No. Only the company can edit a listing. If you spot a mistake, send a suggestion from your dashboard.",
  },
  {
    id: "something-goes-wrong",
    topic: "support",
    underReview: true,
    question: "What if something goes wrong?",
    answer:
      "Send private feedback to the company, rate your sales partner, or leave a public review. If you think a listing is fake or misleading, use “Report this listing.”",
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
      { label: "FAQ", href: routes.faq },
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