/**
 * Listings and filter options for the Properties page.
 *
 * TODO: these are demo listings. When the API is ready, fetch them in
 * src/pages/PropertiesPage.jsx and drop `properties`. Each listing has this shape:
 * {
 *   id: string,
 *   name: string,
 *   project: string,          // estate / project the plots belong to
 *   location: string,         // display text, e.g. "Lekki, Lagos"
 *   locationValue: string,    // must match a value in filterOptions.locations
 *   price: number,            // in naira
 *   sizeSqm: number,
 *   propertyType: string,     // must match a value in filterOptions.propertyTypes
 *   landType: string,         // e.g. "Serviced plots"
 *   availability: "available" | "limited" | "sold-out",
 *   unitsLeft?: number,       // shown as "3 plots left" when availability is "limited"
 *   badge?: "Featured" | "New" | "Hot" | "Limited Units",
 *   image: string,
 *   href: string,             // where "View Details" goes
 * }
 */

export const PAGE_SIZE = 6;

export const filterOptions = {
  locations: [
    { label: "Lagos", value: "lagos" },
    { label: "Oyo", value: "oyo" },
    { label: "Ekiti", value: "ekiti" },
    { label: "Enugu", value: "enugu" },
    { label: "Abuja", value: "abuja" },
    { label: "Ogun", value: "ogun" },
  ],
  propertyTypes: [
    { label: "Residential", value: "Residential" },
    { label: "Commercial", value: "Commercial" },
    { label: "Mixed-use", value: "Mixed-use" },
  ],
  prices: [
    { label: "Under ₦2,000,000", value: "0-2000000" },
    { label: "₦2,000,000 – ₦3,000,000", value: "2000000-3000000" },
    { label: "₦3,000,000 – ₦5,000,000", value: "3000000-5000000" },
    { label: "Above ₦5,000,000", value: "5000000-" },
  ],
  availability: [
    { label: "Available", value: "available" },
    { label: "Limited units", value: "limited" },
    { label: "Sold out", value: "sold-out" },
  ],
};

// TODO: replace with each listing's real photos (these are crops of the design).
const img = (name) => `/images/properties/${name}.jpg`;

export const properties = [
  {
    id: "eden-cresent",
    name: "Eden Cresent",
    project: "Green Estate",
    location: "Lekki, Lagos",
    locationValue: "lagos",
    price: 2_500_000,
    sizeSqm: 500,
    propertyType: "Residential",
    landType: "Serviced plots",
    availability: "available",
    badge: "Featured",
    image: img("eden-cresent"),
    href: "/properties/eden-cresent",
  },
  {
    id: "palm-city",
    name: "Palm City",
    project: "Palm City Estate",
    location: "Epe, Lagos",
    locationValue: "lagos",
    price: 1_800_000,
    sizeSqm: 400,
    propertyType: "Residential",
    landType: "Serviced plots",
    availability: "available",
    badge: "New",
    image: img("palm-city"),
    href: "/properties/palm-city",
  },
  {
    id: "hilltop-view",
    name: "Hilltop View",
    project: "Hilltop View Residential Estate",
    location: "Ado-Ekiti, Ekiti",
    locationValue: "ekiti",
    price: 3_200_000,
    sizeSqm: 600,
    propertyType: "Residential",
    landType: "Serviced plots",
    availability: "available",
    badge: "Hot",
    image: img("hilltop-view"),
    href: "/properties/hilltop-view",
  },
  {
    id: "the-dominion",
    name: "The Dominion",
    project: "Dominion Residential Estate",
    location: "Lagos, Lagos",
    locationValue: "lagos",
    price: 4_500_000,
    sizeSqm: 800,
    propertyType: "Residential",
    landType: "Serviced plots",
    availability: "limited",
    unitsLeft: 3,
    badge: "Limited Units",
    image: img("the-dominion"),
    href: "/properties/the-dominion",
  },
  {
    id: "kings-court",
    name: "King’s Court",
    project: "King’s Court Estate",
    location: "Ibadan, Oyo",
    locationValue: "oyo",
    price: 2_800_000,
    sizeSqm: 500,
    propertyType: "Residential",
    landType: "Serviced plots",
    availability: "available",
    badge: "Featured",
    image: img("kings-court"),
    href: "/properties/kings-court",
  },
  {
    id: "royal-gardens",
    name: "Royal Gardens",
    project: "Royal Gardens Estate",
    location: "Enugu, Enugu",
    locationValue: "enugu",
    price: 1_950_000,
    sizeSqm: 450,
    propertyType: "Residential",
    landType: "Serviced plots",
    availability: "available",
    badge: "New",
    image: img("royal-gardens"),
    href: "/properties/royal-gardens",
  },
  // Page 2 of the design (not shown in the mock-up, so these are made up).
  {
    id: "cedar-park",
    name: "Cedar Park",
    project: "Green Estate",
    location: "Ajah, Lagos",
    locationValue: "lagos",
    price: 3_600_000,
    sizeSqm: 600,
    propertyType: "Residential",
    landType: "Serviced plots",
    availability: "available",
    image: img("eden-cresent"),
    href: "/properties/cedar-park",
  },
  {
    id: "unity-plaza",
    name: "Unity Plaza",
    project: "Unity Business District",
    location: "Lugbe, Abuja",
    locationValue: "abuja",
    price: 6_500_000,
    sizeSqm: 1000,
    propertyType: "Commercial",
    landType: "Commercial plots",
    availability: "available",
    badge: "Hot",
    image: img("kings-court"),
    href: "/properties/unity-plaza",
  },
  {
    id: "riverside-haven",
    name: "Riverside Haven",
    project: "Riverside Estate",
    location: "Mowe, Ogun",
    locationValue: "ogun",
    price: 1_200_000,
    sizeSqm: 450,
    propertyType: "Residential",
    landType: "Dry land",
    availability: "limited",
    unitsLeft: 5,
    badge: "Limited Units",
    image: img("palm-city"),
    href: "/properties/riverside-haven",
  },
  {
    id: "crown-heights",
    name: "Crown Heights",
    project: "Crown Heights Estate",
    location: "Ibadan, Oyo",
    locationValue: "oyo",
    price: 2_200_000,
    sizeSqm: 500,
    propertyType: "Mixed-use",
    landType: "Serviced plots",
    availability: "available",
    image: img("royal-gardens"),
    href: "/properties/crown-heights",
  },
  {
    id: "emerald-court",
    name: "Emerald Court",
    project: "Dominion Residential Estate",
    location: "Ikorodu, Lagos",
    locationValue: "lagos",
    price: 1_650_000,
    sizeSqm: 400,
    propertyType: "Residential",
    landType: "Serviced plots",
    availability: "sold-out",
    image: img("the-dominion"),
    href: "/properties/emerald-court",
  },
  {
    id: "orchid-ridge",
    name: "Orchid Ridge",
    project: "Hilltop View Residential Estate",
    location: "Ado-Ekiti, Ekiti",
    locationValue: "ekiti",
    price: 2_900_000,
    sizeSqm: 550,
    propertyType: "Residential",
    landType: "Serviced plots",
    availability: "available",
    badge: "New",
    image: img("hilltop-view"),
    href: "/properties/orchid-ridge",
  },
];

/** "All Projects" options, built from the listings so they never drift apart. */
export function projectOptions(list) {
  return [...new Set(list.map((p) => p.project))]
    .sort()
    .map((name) => ({ label: name, value: name }));
}

export function formatNaira(amount) {
  return `₦${amount.toLocaleString("en-NG")}`;
}