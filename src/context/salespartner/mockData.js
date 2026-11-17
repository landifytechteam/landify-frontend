// ---------------------------------------------------------------------------
// Sample data for the sales partner screens while the backend endpoints don't
// exist. Dates are relative to "now", so "this month" always has something in it.
// ---------------------------------------------------------------------------

const HOUR = 3600000;
const DAY = 24 * HOUR;
const ago = (ms) => new Date(Date.now() - ms).toISOString();

export const profile = {
  phone: "+234 801 234 5678",
  companyName: "GoRealty and Homes",
  emailVerified: true,
};

export const notificationPrefs = {
  clientAssigned: true,
  clientPurchase: true,
  payments: false,
  commissions: true,
  properties: true,
  system: true,
};

// Property names match the sample images in /public/images/properties
const PROPS = {
  green: { propertyId: "p-green", propertyName: "Green Estate", propertyLocation: "Lekki, Lagos" },
  palm: { propertyId: "p-palm", propertyName: "Palm City", propertyLocation: "Epe, Lagos" },
  hill: { propertyId: "p-hill", propertyName: "Hilltop View", propertyLocation: "Ado-Ekiti, Ekiti" },
  dominion: { propertyId: "p-dominion", propertyName: "The Dominion", propertyLocation: "Lagos, Lagos" },
  kings: { propertyId: "p-kings", propertyName: "King's Court", propertyLocation: "Ibadan, Oyo" },
  royal: { propertyId: "p-royal", propertyName: "Royal Gardens", propertyLocation: "Enugu, Enugu" },
};
export const propertyOptions = Object.values(PROPS).map((p) => ({ value: p.propertyId, label: p.propertyName }));

const client = (n, fullName, phone, prop, status, purchaseStatus, lastActivity, createdAgo) => ({
  id: `c-${n}`,
  fullName,
  email: `${fullName.toLowerCase().replace(/[^a-z]+/g, ".")}@gmail.com`,
  phone,
  ...prop,
  status,
  purchaseStatus,
  lastActivityAt: ago(lastActivity),
  createdAt: ago(createdAgo),
});

export const clients = [
  client(1, "Chinedu Okafor", "+234 801 234 5678", PROPS.green, "active", "in_progress", 2 * HOUR, 5 * DAY),
  client(2, "Blessing Adeyemi", "+234 803 456 7890", PROPS.palm, "active", "completed", 4 * HOUR, 9 * DAY),
  client(3, "Tunde Adebayo", "+234 806 567 8901", PROPS.hill, "pending", "completed", 6 * HOUR, 12 * DAY),
  client(4, "Fatima Yusuf", "+234 809 876 5432", PROPS.dominion, "active", "in_progress", 1 * DAY, 40 * DAY),
  client(5, "Daniel Martins", "+234 810 123 4567", PROPS.green, "active", "completed", 1 * DAY, 60 * DAY),
  client(6, "Ngozi Eze", "+234 803 921 6540", PROPS.kings, "active", "in_progress", 2 * DAY, 70 * DAY),
  client(7, "Adebayo Johnson", "+234 805 742 1098", PROPS.royal, "pending", "inquiry", 2 * DAY, 75 * DAY),
  client(8, "Kemi Balogun", "+234 802 118 2290", PROPS.palm, "active", "completed", 3 * DAY, 80 * DAY),
  client(9, "Ibrahim Musa", "+234 807 664 1123", PROPS.hill, "active", "in_progress", 4 * DAY, 90 * DAY),
  client(10, "Grace Okon", "+234 813 450 7781", PROPS.royal, "active", "inquiry", 5 * DAY, 95 * DAY),
  client(11, "Samuel Obi", "+234 816 902 3345", PROPS.dominion, "active", "completed", 6 * DAY, 100 * DAY),
  client(12, "Aisha Bello", "+234 818 230 5567", PROPS.kings, "active", "inquiry", 7 * DAY, 110 * DAY),
  client(13, "Emeka Nwosu", "+234 703 551 8890", PROPS.green, "active", "completed", 8 * DAY, 120 * DAY),
  client(14, "Funke Alade", "+234 705 610 2234", PROPS.palm, "active", "inquiry", 9 * DAY, 130 * DAY),
  client(15, "Yusuf Garba", "+234 708 771 4456", PROPS.royal, "pending", "inquiry", 10 * DAY, 140 * DAY),
  client(16, "Chioma Udeh", "+234 909 334 6678", PROPS.hill, "active", "in_progress", 12 * DAY, 150 * DAY),
  client(17, "Olumide Ajayi", "+234 902 445 8890", PROPS.dominion, "active", "inquiry", 14 * DAY, 160 * DAY),
  client(18, "Halima Sani", "+234 906 556 1123", PROPS.kings, "pending", "inquiry", 20 * DAY, 170 * DAY),
];

// One commission per completed or in-progress sale. `amountPaid` is what the
// client paid; the partner earns `rate` of it.
const commission = (n, clientN, prop, amountPaid, status, daysAgo, method = "Bank Transfer") => {
  const date = new Date(Date.now() - daysAgo * DAY);
  const ref = `COM-${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getFullYear()).slice(2)}-${String(n).padStart(3, "0")}`;
  return {
    id: `cm-${n}`,
    reference: ref,
    date: date.toISOString(),
    clientName: clients[clientN - 1].fullName,
    propertyName: prop.propertyName,
    propertyLocation: prop.propertyLocation,
    amountPaid,
    rate: 0.1,
    amount: amountPaid * 0.1,
    status,
    paymentMethod: method,
    paidAt: status === "paid" ? new Date(date.getTime() + 3 * DAY).toISOString() : null,
  };
};

export const commissions = [
  commission(6, 1, PROPS.green, 700000, "pending", 2),
  commission(5, 2, PROPS.palm, 500000, "paid", 5),
  commission(4, 3, PROPS.hill, 600000, "paid", 40),
  commission(3, 4, PROPS.dominion, 100000, "processing", 74),
  commission(2, 5, PROPS.green, 1700000, "paid", 120),
  commission(1, 6, PROPS.kings, 600000, "pending", 150),
];

export const topPropertyId = "p-eden";
export const topProperty = {
  id: "p-eden",
  name: "Eden Cresent",
  location: "Lekki, Lagos",
  price: 2500000,
  plotSize: 500,
  propertyType: "Residential",
  image: "/images/properties/eden-cresent.jpg",
};

export const MONTHLY_TARGET = 8; // sales per month
