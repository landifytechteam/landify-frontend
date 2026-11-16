import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Ban, Building2, Download, FileUp, Info, LandPlot, Settings2, ShieldCheck, ShieldX, UserPlus, Users, XCircle } from "lucide-react";
import { superAdminApi } from "../../context/superadmin/superAdminApi";
import { useRequest } from "../../context/superadmin/hooks";
import { Button, ErrorState, LoadingState, PageHeader, Panel, Pill, StatCard, StatGrid } from "../../components/dashboard/ui";
import { DataTable, Stacked } from "../../components/dashboard/DataTable";
import { useToast } from "../../components/dashboard/useToast";
import useAuth from "../../context/useAuth";
import { downloadCsv } from "../../utils/csv";
import { dayMonth, timeAgo, timeWAT, yearOf } from "../../utils/format";

// Bars + legend, in this order. `query` is the All properties filter each one opens.
const PORTFOLIO = [
  { key: "published", label: "Published", short: "Pub.", color: "bg-brand-600", query: "publication=published" },
  { key: "approvedUnpublished", label: "Approved, unpublished", short: "Appr.", color: "bg-brand-900", query: "moderation=approved&publication=unpublished" },
  { key: "pending", label: "Pending review", short: "Pend.", color: "bg-gold-500", query: "moderation=pending" },
  { key: "rejected", label: "Rejected", short: "Rej.", color: "bg-[#b9776a]", query: "moderation=rejected" },
  { key: "archived", label: "Archived", short: "Arch.", color: "bg-line", query: "moderation=archived" },
];

export default function SuperAdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const { data, loading, error, reload } = useRequest(superAdminApi.getOverview, {});
  const firstName = (user?.fullName || "").split(" ")[0];

  if (loading && !data) return <LoadingState label="Loading platform overview…" />;
  if (error && !data) return <ErrorState message={error} onRetry={reload} />;
  const { companies, admins, properties, moderation } = data;

  const downloadReport = () => {
    const rows = [
      ["Companies", companies.total, `${companies.active} active, ${companies.underReview} under review, ${companies.suspended} suspended`],
      ["Company administrators", admins.total, `${admins.active} active, ${admins.invited} invited, ${admins.restricted} restricted`],
      ["Properties", properties.total, `${properties.published} published, ${properties.approvedUnpublished} approved unpublished`],
      ["Awaiting moderation", moderation.pending, `${moderation.olderThan48h} older than 48 hours`],
    ];
    downloadCsv("landify-platform-report.csv", [
      { header: "Metric", value: (r) => r[0] },
      { header: "Total", value: (r) => r[1] },
      { header: "Breakdown", value: (r) => r[2] },
    ], rows);
    toast("Platform report downloaded");
  };

  return (
    <div className="mx-auto max-w-350 space-y-6">
      <PageHeader
        eyebrow="Platform governance"
        title="A clear view of the platform."
        subtitle={`Welcome back${firstName ? `, ${firstName}` : ""}. Here's what needs your attention across all companies.`}
        actions={<Button icon={Download} onClick={downloadReport}>Download report</Button>}
      />

      <StatGrid>
        <StatCard label="Companies" value={companies.total} icon={Building2} detail={`${companies.active} active · ${companies.underReview} under review · ${companies.suspended} suspended`} onClick={() => navigate("companies")} />
        <StatCard label="Company administrators" value={admins.total} icon={Users} detail={`${admins.active} active · ${admins.invited} invited · ${admins.restricted} restricted`} onClick={() => navigate("admins")} />
        <StatCard label="Properties across all companies" value={properties.total} icon={LandPlot} detail={`${properties.published} published · ${properties.approvedUnpublished} approved, unpublished`} onClick={() => navigate("properties")} />
        <StatCard tone="dark" label="Awaiting moderation" value={moderation.pending} icon={ShieldCheck} detail={`${moderation.olderThan48h} submissions older than 48 hours`} onClick={() => navigate("moderation")} />
      </StatGrid>

      <div className="grid gap-6 xl:grid-cols-2">
        <PortfolioPanel summary={properties} />
        <ActivityPanel events={data.recentActivity} />
      </div>

      <Panel
        title="Submissions requiring review"
        subtitle={`${moderation.pending} pending submissions · Newest shown here, oldest first available in the moderation queue`}
        action={<Button variant="primary" icon={ArrowRight} to="/superadmin/moderation">Open moderation queue</Button>}
        flush
      >
        <DataTable
          rows={data.pendingSubmissions}
          minWidth={720}
          onRowClick={(s) => navigate(`moderation/${s.id}`)}
          empty="Nothing waiting for review."
          columns={[
            { key: "name", header: "Property", render: (s) => <Stacked main={s.name} sub={s.id} /> },
            { key: "company", header: "Company", render: (s) => s.companyName },
            { key: "location", header: "Location", render: (s) => s.location },
            { key: "submitted", header: "Submitted", render: (s) => <Stacked main={`${dayMonth(s.submittedAt)} · ${timeWAT(s.submittedAt)}`} sub={`${yearOf(s.submittedAt)} · WAT · ${timeAgo(s.submittedAt)}`} strong={false} /> },
            {
              key: "action",
              header: "Action",
              render: (s) => (
                <Link to={`/superadmin/moderation/${s.id}`} onClick={(e) => e.stopPropagation()} className="inline-flex items-center gap-1 whitespace-nowrap font-semibold text-brand-600 hover:underline">
                  Review submission <ArrowRight className="h-4 w-4" />
                </Link>
              ),
            },
          ]}
        />
      </Panel>
    </div>
  );
}

function PortfolioPanel({ summary }) {
  const max = Math.max(...PORTFOLIO.map((p) => summary[p.key]), 1);
  return (
    <Panel
      title="Property portfolio"
      subtitle="Moderation and publication across all companies · Click a status to open it"
      action={<Pill>{summary.total} total</Pill>}
      footer={<span className="flex items-center gap-2"><Info className="h-4.5 w-4.5" aria-hidden />Publication remains separate from platform approval.</span>}
    >
      <div className="grid gap-6 sm:grid-cols-[260px_1fr] sm:items-center">
        {/* Mini bar chart drawn with divs, no chart library needed */}
        <figure className="rounded-lg border border-line p-4" aria-label="Properties by status">
          <figcaption className="flex justify-between text-sm font-semibold text-ink">
            Properties <span className="text-brand-600">{summary.total}</span>
          </figcaption>
          <div className="mt-3 flex h-36 items-end gap-px">
            {PORTFOLIO.map((p) => (
              <Link
                key={p.key}
                to={`/superadmin/properties?${p.query}`}
                className={`flex-1 transition-opacity hover:opacity-80 ${p.color}`}
                style={{ height: `${Math.max((summary[p.key] / max) * 100, 4)}%` }}
                title={`${p.label}: ${summary[p.key]}`}
                aria-label={`${p.label}: ${summary[p.key]}`}
              />
            ))}
          </div>
          <div className="mt-3 flex text-center text-[11px] leading-4 text-body">
            {PORTFOLIO.map((p) => (
              <span key={p.key} className="flex-1">{p.short}<br />{summary[p.key]}</span>
            ))}
          </div>
        </figure>
        <ul className="space-y-1">
          {PORTFOLIO.map((p) => (
            <li key={p.key}>
              <Link to={`/superadmin/properties?${p.query}`} className="flex items-center gap-3 rounded-md px-2 py-1.5 text-sm hover:bg-canvas">
                <span className={`h-2 w-2 shrink-0 rounded-full ${p.color}`} aria-hidden />
                <span className="flex-1 text-body">{p.label}</span>
                <span className="font-semibold text-ink">{summary[p.key]}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </Panel>
  );
}

// Pick an icon from the audit action name
function iconFor(action) {
  if (/approved/i.test(action)) return ShieldCheck;
  if (/rejected/i.test(action)) return XCircle;
  if (/invit/i.test(action)) return UserPlus;
  if (/submitted|resubmitted/i.test(action)) return FileUp;
  if (/suspended|revoked/i.test(action)) return Ban;
  if (/blocked|denied/i.test(action)) return ShieldX;
  if (/policy|settings/i.test(action)) return Settings2;
  return Building2;
}

const isToday = (iso) => dayMonth(iso) === dayMonth(new Date());

function ActivityPanel({ events }) {
  return (
    <Panel
      title="Recent governance activity"
      action={
        <Link to="/superadmin/audit" className="flex shrink-0 items-center gap-1 text-sm font-semibold text-brand-600 hover:underline">
          View audit log <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      }
    >
      <ul className="space-y-5">
        {events.map((e) => {
          const Icon = iconFor(e.action);
          return (
            <li key={e.id} className="flex gap-4">
              <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${e.outcome === "denied" ? "bg-red-50 text-red-600" : "bg-brand-50 text-brand-600"}`}>
                <Icon className="h-4.5 w-4.5" strokeWidth={1.6} aria-hidden />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-ink">{e.action}</p>
                <p className="text-sm text-body">{e.target} · {e.scope}</p>
                <p className="mt-0.5 text-xs text-body">
                  {e.actor} · {isToday(e.at) ? `${timeWAT(e.at)} WAT` : `${dayMonth(e.at)}, ${timeWAT(e.at)}`}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </Panel>
  );
}