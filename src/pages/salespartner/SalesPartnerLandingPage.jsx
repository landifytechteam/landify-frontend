import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  ArrowUp,
  CalendarDays,
  ChevronRight,
  Coins,
  Home,
  LineChart,
  MapPin,
  Star,
  Target,
  TrendingUp,
  UserPlus,
  Users,
  Wallet,
} from "lucide-react";
import useAuth from "../../context/useAuth";
import { useRequest } from "../../context/hooks";
import { CLIENT_STATUSES, partnerApi } from "../../context/salespartner/partnerApi";
import { usePartnerProperties } from "../../context/salespartner/usePartnerProperties";
import { ErrorState, LoadingState, Panel } from "../../components/dashboard/ui";
import { Select } from "../../components/dashboard/controls";
import { Avatar, PartnerBadge, PartnerStat, Trend } from "../../components/salespartner/shared";
import { PartnerPropertyCard } from "../../components/salespartner/PartnerPropertyCard";
import { AddClientModal } from "../../components/salespartner/AddClientModal";
import { useShareProperty } from "../../components/salespartner/shareProperty";
import { Reveal } from "../../components/ui/Reveal";
import { useToast } from "../../components/dashboard/useToast";
import { naira, timeAgo } from "../../utils/format";

const PERIODS = [
  { value: "month", label: "This Month" },
  { value: "last_month", label: "Last Month" },
  { value: "year", label: "This Year" },
];

// Greeting and date in Lagos time, whatever the viewer's clock says
const lagosHour = () => Number(new Intl.DateTimeFormat("en-GB", { hour: "numeric", hourCycle: "h23", timeZone: "Africa/Lagos" }).format(new Date()));
const greeting = () => {
  const h = lagosHour();
  return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
};
const today = () =>
  new Intl.DateTimeFormat("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric", timeZone: "Africa/Lagos" }).format(new Date());

/** /salespartner: the partner's home dashboard. */
export default function SalesPartnerLandingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const share = useShareProperty();
  const [period, setPeriod] = useState("month");
  const [adding, setAdding] = useState(false);

  const dashboard = useRequest(partnerApi.getDashboard, { period });
  const clients = useRequest(partnerApi.getClients, { page: 1, pageSize: 5 });
  const properties = usePartnerProperties();

  const firstName = (user?.fullName ?? "").split(" ")[0];
  const stats = dashboard.data?.stats;
  const perf = dashboard.data?.performance;
  const top = dashboard.data?.topProperty;

  if (dashboard.error && !dashboard.data) return <ErrorState message={dashboard.error} onRetry={dashboard.reload} />;
  if (!dashboard.data) return <LoadingState label="Loading your dashboard…" />;

  // Live company properties for the "Interested in" picker (mock list while there are none)
  const propertyOptions = properties.data?.length
    ? properties.data.map((p) => ({ value: p.id, label: p.name }))
    : (clients.data?.properties ?? []);

  const salesLeft = Math.max(0, perf.monthlyTarget - perf.salesCount);

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
      <div className="min-w-0 space-y-6">
        <Reveal className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-[34px]">
              {greeting()}
              {firstName && `, ${firstName}`} <span aria-hidden>👋</span>
            </h1>
            <p className="mt-2 text-[15px] text-body">Here's an overview of your sales performance and assigned clients.</p>
          </div>
          <span className="inline-flex h-10 shrink-0 items-center gap-2 self-start rounded-md border border-line bg-white px-3 text-sm text-ink">
            <CalendarDays className="h-4 w-4 text-body" aria-hidden />
            {today()}
          </span>
        </Reveal>

        <div className="reveal-stagger grid gap-4 sm:grid-cols-2 wide:grid-cols-4">
          <PartnerStat label="Total Clients" value={stats.totalClients} icon={Users}>
            <Trend>+{stats.clientsThisMonth} this month</Trend>
          </PartnerStat>
          <PartnerStat label="Active Properties" value={properties.data?.length ?? "–"} icon={Home}>
            <Trend up={false}>{properties.error ? "Couldn't load" : "Listed and approved"}</Trend>
          </PartnerStat>
          <PartnerStat label="Total Sales" value={stats.totalSales} icon={LineChart}>
            <Trend>+{stats.salesThisMonth} this month</Trend>
          </PartnerStat>
          <PartnerStat label="Your Commission" value={naira(stats.commissionTotal)} icon={Coins} highlight>
            <Trend up={stats.commissionChangePct >= 0}>
              {stats.commissionChangePct >= 0 ? "+" : ""}
              {stats.commissionChangePct}% this month
            </Trend>
          </PartnerStat>
        </div>

        <div className="grid gap-6 wide:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
          <Panel
            title="Your Assigned Clients"
            subtitle="Clients you're currently working with."
            action={<ViewAll to="clients" />}
            flush
          >
            {clients.error && !clients.data ? (
              <div className="px-5 pb-5 sm:px-6"><ErrorState message={clients.error} onRetry={clients.reload} /></div>
            ) : !clients.data ? (
              <LoadingState />
            ) : clients.data.items.length === 0 ? (
              <p className="px-6 pb-8 text-sm text-body">No clients are assigned to you yet.</p>
            ) : (
              <ul className="divide-y divide-line border-t border-line">
                {clients.data.items.map((c) => (
                  <li key={c.id}>
                    <Link to="clients" className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-canvas/70 sm:px-6">
                      <Avatar name={c.fullName} size="sm" />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium text-ink">{c.fullName}</span>
                        <span className="block truncate text-xs text-body">{c.phone}</span>
                      </span>
                      <PartnerBadge list={CLIENT_STATUSES} value={c.status} />
                      <span className="hidden w-24 text-right text-xs text-body sm:block wide:hidden 2xl:block">{timeAgo(c.lastActivityAt)}</span>
                      <ChevronRight className="h-4 w-4 text-body" aria-hidden />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          <Panel
            title="Your Sales Performance"
            action={<Select value={period} onChange={setPeriod} options={PERIODS} className="w-36" />}
          >
            <div className={`grid grid-cols-2 gap-3 ${dashboard.loading ? "opacity-60" : ""}`}>
              <MiniStat label="Total Sales" value={naira(perf.salesValue)} change={perf.salesChangePct} />
              <MiniStat label="Total Commissions" value={naira(perf.commissions)} change={perf.commissionsChangePct} />
              <MiniStat label="Pending Payments" value={naira(perf.pendingPayments)}>
                <span className="mt-2 inline-block rounded-full bg-[#f6ecc9] px-2 py-0.5 text-[11px] font-medium text-[#8a6a10]">
                  {perf.pendingClients} client{perf.pendingClients === 1 ? "" : "s"}
                </span>
              </MiniStat>
              <MiniStat label="Conversion Rate" value={`${perf.conversionRate}%`} change={perf.conversionChangePct} />
            </div>
            <div className="mt-4 flex items-center gap-3 rounded-lg bg-brand-50 px-4 py-3">
              <Target className="h-6 w-6 shrink-0 text-gold-500" aria-hidden />
              <div className="text-sm">
                <p className="font-medium text-brand-700">{salesLeft === 0 ? "Target reached, brilliant work!" : "Keep up the great work!"}</p>
                <p className="text-xs text-body">
                  {salesLeft === 0
                    ? `You've hit your target of ${perf.monthlyTarget} sales.`
                    : `You're ${salesLeft} sale${salesLeft === 1 ? "" : "s"} away from your monthly target.`}
                </p>
              </div>
            </div>
          </Panel>
        </div>

        <Panel title="Available Properties" subtitle="Properties you can market to your clients." action={<ViewAll to="properties" />}>
          {properties.error && !properties.data ? (
            <ErrorState message={`${properties.error} The server may be waking up; try again in a few seconds.`} onRetry={properties.reload} />
          ) : !properties.data ? (
            <LoadingState label="Loading properties…" />
          ) : properties.data.length === 0 ? (
            <p className="py-6 text-center text-sm text-body">No approved properties are listed for your company yet.</p>
          ) : (
            <div className="reveal-stagger grid gap-4 sm:grid-cols-2 wide:grid-cols-4">
              {properties.data.slice(0, 4).map((p) => (
                <Reveal key={p.id}>
                  <PartnerPropertyCard property={p} compact onShare={share} />
                </Reveal>
              ))}
            </div>
          )}
        </Panel>
      </div>

      {/* Right column */}
      <aside className="space-y-6">
        {top && (
          <Reveal from="right" className="group relative overflow-hidden rounded-xl bg-brand-900 p-6 text-white">
            <img src={top.image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-45 transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-linear-to-t from-brand-900 via-brand-900/70 to-brand-900/20" aria-hidden />
            <div className="relative">
              <span className="inline-flex items-center gap-1.5 rounded-md bg-gold-500 px-2.5 py-1 text-xs font-semibold text-ink">
                <Star className="h-3.5 w-3.5" aria-hidden />
                Top Performing Property
              </span>
              <p className="mt-4 text-2xl font-semibold uppercase tracking-wide">{top.name}</p>
              <p className="mt-1 flex items-center gap-1 text-sm text-white/85">
                <MapPin className="h-4 w-4" aria-hidden />
                {top.location}
              </p>
              <p className="mt-3 text-2xl font-semibold">{naira(top.price)}</p>
              <p className="mt-1 text-xs text-white/80">
                {top.plotSize}sqm • {top.propertyType}
              </p>
              <Link
                to={`properties/${top.id}`}
                className="mt-4 inline-flex h-9 items-center gap-2 rounded-full bg-gold-500 px-4 text-sm font-semibold text-ink transition-colors hover:bg-gold-400"
              >
                View Details
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
          </Reveal>
        )}

        <Panel title="Quick Actions">
          <div className="space-y-3">
            <QuickAction icon={UserPlus} title="Add New Client" detail="Register a new client" onClick={() => setAdding(true)} />
            <QuickAction icon={Home} title="View Properties" detail="Browse and share listings" onClick={() => navigate("properties")} />
            <QuickAction icon={Wallet} title="Track Commission" detail="Check your earnings" onClick={() => navigate("commissions")} />
          </div>
        </Panel>

        <Reveal className="relative overflow-hidden rounded-xl bg-brand-700 p-6 text-white">
          <TrendingUp className="absolute -bottom-4 -right-4 h-32 w-32 text-gold-500/25" strokeWidth={1.2} aria-hidden />
          <Home className="h-7 w-7 text-gold-500" aria-hidden />
          <p className="mt-4 text-xl font-medium leading-snug">Your effort builds bigger dreams.</p>
          <p className="mt-3 text-xs text-white/80">More clients. More sales. More rewards.</p>
        </Reveal>
      </aside>

      <AddClientModal
        open={adding}
        onClose={() => setAdding(false)}
        properties={propertyOptions}
        onCreated={(c) => {
          toast(`${c.fullName} was added to your clients.`);
          clients.reload();
          dashboard.reload();
        }}
      />
    </div>
  );
}

function ViewAll({ to }) {
  return (
    <Link to={to} className="group inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:underline">
      View all
      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
    </Link>
  );
}

function MiniStat({ label, value, change, children }) {
  return (
    <div className="rounded-lg border border-line p-3">
      <p className="text-xs text-body">{label}</p>
      <p className="mt-1.5 truncate text-lg font-semibold text-ink">{value}</p>
      {change != null && (
        <span className="mt-2 inline-flex items-center gap-0.5 rounded-full bg-brand-50 px-2 py-0.5 text-[11px] font-medium text-brand-600">
          <ArrowUp className={`h-3 w-3 ${change < 0 ? "rotate-180" : ""}`} aria-hidden />
          {change >= 0 ? "+" : ""}
          {change}%
        </span>
      )}
      {children}
    </div>
  );
}

function QuickAction({ icon: Icon, title, detail, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full items-center gap-3 rounded-lg border border-line p-3 text-left transition-colors hover:border-brand-600/40 hover:bg-brand-50/50"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white">
        <Icon className="h-5 w-5" aria-hidden />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-ink">{title}</span>
        <span className="block text-xs text-body">{detail}</span>
      </span>
      <ChevronRight className="h-4 w-4 text-body transition-transform group-hover:translate-x-0.5" aria-hidden />
    </button>
  );
}
