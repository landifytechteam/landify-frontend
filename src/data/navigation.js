import {
  Building2,
  ClipboardList,
  CreditCard,
  FileText,
  Globe,
  History,
  Home,
  LandPlot,
  LayoutGrid,
  Settings2,
  ShieldCheck,
  Users,
  Wallet,
  KeyRound,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Sidebar + header setup for every role. The dashboard shell reads one entry
// based on the logged-in user's role, so adding a role means adding an entry.
//
// Keys must match the `role` prop passed to <DashboardLayout role="..."> in
// App.jsx: superadmin, admin (Company Admin), salespartner, client.
// `badgeKey` links a menu item to a live count passed into DashboardLayout.
// ---------------------------------------------------------------------------

export const navForRole = {
  superadmin: {
    roleLabel: "Super Admin",
    userTitle: "Super administrator",
    scopeLabel: "Platform-wide",
    workspace: { eyebrow: "Governance workspace", name: "Super Admin Console", icon: Globe },
    searchPlaceholder: "Search companies, properties or administrators",
    items: [
      { label: "Platform overview", to: "/superadmin", icon: LayoutGrid, end: true },
      { label: "Companies", to: "/superadmin/companies", icon: Building2 },
      { label: "Admin access", to: "/superadmin/admins", icon: Users },
      {
        label: "Property moderation",
        to: "/superadmin/moderation",
        icon: ShieldCheck,
        badgeKey: "moderation",
      },
      { label: "All properties", to: "/superadmin/properties", icon: LandPlot },
      { label: "Audit activity", to: "/superadmin/audit", icon: History },
      { label: "System settings", to: "/superadmin/settings", icon: Settings2 },
      { label: "Account security", to: "/superadmin/account", icon: KeyRound },
    ],
    note: {
      title: "Platform-level access",
      body: "Every governance action is recorded in the audit log.",
    },
  },

  // TODO: replace these menus with the real ones once their designs arrive.
  admin: {
    roleLabel: "Company Admin",
    userTitle: "Company administrator",
    scopeLabel: "Company",
    workspace: { eyebrow: "Company workspace", name: "Company Console", icon: Building2 },
    searchPlaceholder: "Search properties, clients or partners",
    items: [
      { label: "Overview", to: "/admin", icon: LayoutGrid, end: true },
      { label: "Properties", to: "/admin/properties", icon: LandPlot },
      { label: "Clients", to: "/admin/clients", icon: Users },
      { label: "Payments", to: "/admin/payments", icon: CreditCard },
      { label: "Settings", to: "/admin/settings", icon: Settings2 },
      { label: "Leads", to: "/admin/leads", icon: Users },
    ],
  },
  salespartner: {
    roleLabel: "Sales Partner",
    userTitle: "Sales partner",
    scopeLabel: "My sales",
    workspace: { eyebrow: "Partner workspace", name: "Sales Partner", icon: ClipboardList },
    searchPlaceholder: "Search properties or clients",
    items: [
      { label: "Overview", to: "/salespartner", icon: LayoutGrid, end: true },
      { label: "Properties", to: "/salespartner/properties", icon: LandPlot },
      { label: "My clients", to: "/salespartner/clients", icon: Users },
      { label: "Commissions", to: "/salespartner/commissions", icon: Wallet },
    ],
  },
  client: {
    roleLabel: "Client",
    userTitle: "Client",
    scopeLabel: "My account",
    workspace: { eyebrow: "My workspace", name: "My Properties", icon: Home },
    searchPlaceholder: "Search properties",
    items: [
      { label: "Overview", to: "/clients", icon: LayoutGrid, end: true },
      { label: "My plots", to: "/clients/plots", icon: LandPlot },
      { label: "Payments", to: "/clients/payments", icon: CreditCard },
      { label: "Documents", to: "/clients/documents", icon: FileText },
    ],
  },
};