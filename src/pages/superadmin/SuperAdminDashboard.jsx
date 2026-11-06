import { Link } from "react-router-dom";
import {
  ArrowRight,
  Building2,
  Download,
  FileUp,
  Info,
  LandPlot,
  ShieldCheck,
  UserPlus,
  Users,
} from "lucide-react";
import { PageHeader, Panel, Pill, StatCard } from "../../components/dashboard/ui";
import useAuth from "../../context/useAuth";
// TODO: replace these placeholders with data from the backend (see data/superadmin.js)
import {
  overviewStats,
  pendingSubmissions,
  portfolio,
  recentActivity,
} from "../../data/superadmin";

const lagos = (options) => new Intl.DateTimeFormat("en-GB", { timeZone: "Africa/Lagos", ...options });
const timeWAT = (iso) => lagos({ hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date(iso));
const dayMonth = (iso) => lagos({ day: "2-digit", month: "short" }).format(new Date(iso));
const yearOf = (iso) => lagos({ year: "numeric" }).format(new Date(iso));
const isToday = (iso) => dayMonth(iso) === dayMonth(new Date().toISOString());

export default function SuperAdminDashboard() {
  const { user } = useAuth();
  const firstName = (user?.fullName || user?.name || "").split(" ")[0];
  const { companies, admins, properties, moderation } = overviewStats;

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="mx-auto max-w-350 space-y-6">
      <PageHeader
        eyebrow="Platform governance"
        title="A clear view of the platform."
        subtitle={`Welcome back${firstName ? `, ${firstName}` : ""}. Here's what needs your attention across all companies.`}
        actions={
          <button
            type="button"
            // TODO: call the report endpoint and download the file
            className="flex h-11 items-center gap-2 rounded-md border border-line bg-white px-4 text-sm font-semibold text-brand-600 hover:border-brand-600"
          >
            <Download className="h-4 w-4" aria-hidden />
            Download report
          </button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Companies"
          value={companies.total}
          icon={Building2}
          detail={`${companies.active} active · ${companies.underReview} under review · ${companies.suspended} suspended`}
          onDetails={() => scrollTo("governance-activity")}
        />
        <StatCard
          label="Company administrators"
          value={admins.total}
          icon={Users}
          detail={`${admins.active} active · ${admins.invited} invited · ${admins.restricted} restricted`}
          onDetails={() => scrollTo("governance-activity")}
        />
        <StatCard
          label="Properties across all companies"
          value={properties.total}
          icon={LandPlot}
          detail={`${properties.published} published · ${properties.approvedUnpublished} approved, unpublished`}
        />
        <StatCard
          tone="dark"
          label="Awaiting moderation"
          value={moderation.pending}
          icon={ShieldCheck}
          detail={`${moderation.olderThan48h} submissions older than 48 hours`}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <PortfolioPanel total={properties.total} />
        <ActivityPanel />
      </div>

      <SubmissionsPanel pending={moderation.pending} />
    </div>
  );
}

function PortfolioPanel({ total }) {
  const max = Math.max(...portfolio.map((p) => p.count), 1);

  return (
    <Panel
      title="Property portfolio"
      subtitle="Moderation and publication across all companies"
      action={<Pill>{total} total</Pill>}
      footer={
        <span className="flex items-center gap-2">
          <Info className="h-4 w-4" aria-hidden />
          Publication remains separate from platform approval.
        </span>
      }
    >
      <div className="grid gap-6 sm:grid-cols-[260px_1fr] sm:items-center">
        {/* Mini bar chart, drawn with divs (no chart library needed) */}
        <figure className="rounded-lg border border-line p-4" aria-label="Properties by status">
          <figcaption className="flex justify-between text-sm font-semibold text-ink">
            Properties <span className="text-brand-600">{total}</span>
          </figcaption>
          <div className="mt-3 flex h-36 items-end">
            {portfolio.map((p) => (
              <div
                key={p.key}
                className={`flex-1 ${p.color}`}
                style={{ height: `${Math.max((p.count / max) * 100, 4)}%` }}
                title={`${p.label}: ${p.count}`}
              />
            ))}
          </div>
          <div className="mt-3 flex text-center text-[11px] leading-4 text-body">
            {portfolio.map((p) => (
              <span key={p.key} className="flex-1">
                {p.short}
                <br />
                {p.count}
              </span>
            ))}
          </div>
        </figure>

        <ul className="space-y-4">
          {portfolio.map((p) => (
            <li key={p.key} className="flex items-center gap-3 text-sm">
              <span className={`h-2 w-2 shrink-0 rounded-full ${p.color}`} aria-hidden />
              <span className="flex-1 text-body">{p.label}</span>
              <span className="font-semibold text-ink">{p.count}</span>
            </li>
          ))}
        </ul>
      </div>
    </Panel>
  );
}

const activityIcons = {
  approved: ShieldCheck,
  invited: UserPlus,
  submitted: FileUp,
  company: Building2,
};

function ActivityPanel() {
  return (
    <Panel
      id="governance-activity"
      title="Recent governance activity"
      action={
        <Link
          to="/superadmin/audit"
          className="flex shrink-0 items-center gap-1 text-sm font-semibold text-brand-600 hover:underline"
        >
          View audit log <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      }
    >
      <ul className="space-y-5">
        {recentActivity.map((event) => {
          const Icon = activityIcons[event.type] ?? Info;
          return (
            <li key={event.id} className="flex gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                <Icon className="h-4.5 w-4.5" strokeWidth={1.6} aria-hidden />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-ink">{event.title}</p>
                <p className="text-sm text-body">{event.detail}</p>
                <p className="mt-0.5 text-xs text-body">
                  {event.actor} ·{" "}
                  {isToday(event.at) ? `${timeWAT(event.at)} WAT` : `${dayMonth(event.at)}, ${timeWAT(event.at)}`}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </Panel>
  );
}

function SubmissionsPanel({ pending }) {
  return (
    <section className="overflow-hidden rounded-xl border border-line bg-white">
      <div className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <h2 className="text-lg font-semibold text-ink">Submissions requiring review</h2>
          <p className="mt-1 text-sm text-body">
            {pending} pending submissions · Oldest first available in the moderation queue
          </p>
        </div>
        <Link
          to="/superadmin/moderation"
          className="flex h-11 shrink-0 items-center justify-center gap-2 rounded-md bg-brand-600 px-5 text-sm font-semibold text-white hover:bg-brand-700"
        >
          <ArrowRight className="h-4 w-4" aria-hidden />
          Open moderation queue
        </Link>
      </div>

      {/* Scrolls sideways on small screens instead of squashing the columns */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-180 text-left text-sm">
          <thead className="border-y border-line bg-canvas text-xs uppercase tracking-wide text-body">
            <tr>
              <th className="px-6 py-3 font-medium">Property</th>
              <th className="px-6 py-3 font-medium">Company</th>
              <th className="px-6 py-3 font-medium">Location</th>
              <th className="px-6 py-3 font-medium">Submitted</th>
              <th className="px-6 py-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {pendingSubmissions.map((s) => (
              <tr key={s.id}>
                <td className="px-6 py-4">
                  <p className="font-semibold text-ink">{s.property}</p>
                  <p className="text-xs text-body">{s.id}</p>
                </td>
                <td className="px-6 py-4 text-ink">{s.company}</td>
                <td className="px-6 py-4 text-ink">{s.location}</td>
                <td className="px-6 py-4">
                  <p className="text-ink">
                    {dayMonth(s.submittedAt)} · {timeWAT(s.submittedAt)}
                  </p>
                  <p className="text-xs text-body">{yearOf(s.submittedAt)} · WAT</p>
                </td>
                <td className="px-6 py-4">
                  <Link
                    to={`/superadmin/moderation/${s.id}`}
                    className="inline-flex items-center gap-1 font-semibold text-brand-600 hover:underline"
                  >
                    Review submission <ArrowRight className="h-4 w-4" aria-hidden />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}