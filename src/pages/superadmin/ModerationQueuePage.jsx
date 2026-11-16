import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Download } from "lucide-react";
import { superAdminApi } from "../../context/superadmin/superAdminApi";
import { useListState, useRequest } from "../../context/superadmin/hooks";
import { Button, ErrorState, Notice, PageHeader, Panel, StatCard, StatGrid, StatusBadge } from "../../components/dashboard/ui";
import { FilterBar, SearchInput, Select, Tabs } from "../../components/dashboard/controls";
import { DataTable, Pagination, Stacked } from "../../components/dashboard/DataTable";
import { useToast } from "../../components/dashboard/Toast";
import { downloadCsv } from "../../utils/csv";
import { dayMonth, fullDateTime, timeAgo, timeWAT, yearOf } from "../../utils/format";

const TYPE_OPTIONS = [
  { value: "initial", label: "Initial submission" },
  { value: "resubmission", label: "Resubmission" },
];
const SORT_OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
];
const tabNouns = { pending: "pending submissions", approved: "approved submissions", rejected: "rejected submissions", archived: "archived submissions" };

/** "Initial submission", "Resubmission", or a hold badge when the company isn't active. */
function ReviewContext({ row }) {
  if (row.hold) return <StatusBadge status="hold">{row.companyStatus === "suspended" ? "Company suspended" : "Company under review"}</StatusBadge>;
  return <StatusBadge status={row.submissionType} tone="grey" />;
}

export default function ModerationQueuePage() {
  const navigate = useNavigate();
  const toast = useToast();
  const list = useListState({ tab: "pending", search: "", companyId: "", type: "", flag: "", sort: "newest" });
  const { data, loading, error, reload } = useRequest(superAdminApi.getModerationQueue, list.params);

  const s = data?.summary;
  const { tab, flag } = list.filters;
  const counts = data?.tabCounts ?? {};

  // Stat cards filter the pending queue by a flag. Clicking the active one clears it.
  const filterByFlag = (value) => {
    if (tab !== "pending") list.setFilter("tab", "pending");
    list.setFilter("flag", flag === value ? "" : value);
  };

  const exportCsv = async () => {
    const all = await superAdminApi.getModerationQueue({ ...list.params, page: 1, pageSize: 1000 });
    downloadCsv(`landify-moderation-${tab}.csv`, [
      { header: "Submission ID", value: (p) => p.id },
      { header: "Property", value: (p) => p.name },
      { header: "Company", value: (p) => p.companyName },
      { header: "Location", value: (p) => p.location },
      { header: "Submitted (WAT)", value: (p) => fullDateTime(p.submittedAt) },
      { header: "Type", value: (p) => p.submissionType },
      { header: "Documents", value: (p) => p.documents.length },
    ], all.items);
    toast(`Exported ${all.items.length} ${tabNouns[tab]}`);
  };

  const columns = [
    { key: "name", header: "Submission", render: (p) => <Stacked main={p.name} sub={p.id} /> },
    { key: "company", header: "Company / location", render: (p) => <Stacked main={p.companyName} sub={p.location} strong={false} /> },
    {
      key: "submitted",
      header: "Submitted",
      render: (p) => <Stacked main={`${dayMonth(p.submittedAt)} · ${timeWAT(p.submittedAt)}`} sub={`${timeAgo(p.submittedAt)} · ${yearOf(p.submittedAt)}`} strong={false} />,
    },
    { key: "context", header: "Review context", render: (p) => <ReviewContext row={p} /> },
    { key: "docs", header: "Documents", render: (p) => `${p.documents.length} documents` },
    {
      key: "action",
      header: "Action",
      render: (p) => (
        <Link to={p.id} onClick={(e) => e.stopPropagation()} className="inline-flex items-center gap-1 whitespace-nowrap font-semibold text-brand-600 hover:underline">
          {tab === "pending" ? "Review submission" : "View submission"} <ArrowRight className="h-4 w-4" />
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Platform governance"
        title="Property moderation"
        subtitle="Review land submissions from every company before they become eligible for publication."
        actions={<Button icon={Download} onClick={exportCsv} disabled={!data}>Export queue</Button>}
      />

      <StatGrid>
        <StatCard label="Awaiting platform review" value={s?.pending} detail={s && `Across ${s.pendingCompanies} companies`} active={tab === "pending" && !flag} onClick={() => { list.setFilter("tab", "pending"); list.setFilter("flag", ""); }} />
        <StatCard label="Older than 48 hours" value={s?.stale} detail={s?.staleNames.join(" · ") || "Nothing overdue"} active={flag === "stale"} onClick={() => filterByFlag("stale")} />
        <StatCard label="Resubmissions" value={s?.resubmissions} detail="Previous rejection reasons retained" active={flag === "resubmission"} onClick={() => filterByFlag("resubmission")} />
        <StatCard label="Company standing hold" value={s?.hold} detail={s?.holdNames.join(" · ") || "No holds"} active={flag === "hold"} onClick={() => filterByFlag("hold")} />
      </StatGrid>

      <Tabs
        label="Moderation status"
        value={tab}
        onChange={(value) => { list.setFilter("tab", value); list.setFilter("flag", ""); }}
        tabs={[
          { value: "pending", label: "Pending review", count: counts.pending },
          { value: "approved", label: "Approved", count: counts.approved },
          { value: "rejected", label: "Rejected", count: counts.rejected },
          { value: "archived", label: "Archived", count: counts.archived },
        ]}
      />

      {error && !data ? (
        <ErrorState message={error} onRetry={reload} />
      ) : (
        <Panel
          title={tab === "pending" ? "Cross-company review queue" : `${tab[0].toUpperCase()}${tab.slice(1)} submissions`}
          subtitle={`${list.filters.sort === "newest" ? "Newest" : "Oldest"} submissions first · All timestamps in WAT`}
          action={flag && (
            <button type="button" onClick={() => list.setFilter("flag", "")} className="text-sm font-semibold text-brand-600 hover:underline">
              Clear card filter
            </button>
          )}
          flush
        >
          <FilterBar>
            <SearchInput value={list.filters.search} onChange={(v) => list.setFilter("search", v)} placeholder="Search property name or submission ID" />
            <Select value={list.filters.companyId} onChange={(v) => list.setFilter("companyId", v)} options={data?.companies ?? []} placeholder="All companies" className="lg:w-48" />
            <Select value={list.filters.type} onChange={(v) => list.setFilter("type", v)} options={TYPE_OPTIONS} placeholder="All submission types" className="lg:w-56" />
            <Select value={list.filters.sort} onChange={(v) => list.setFilter("sort", v)} options={SORT_OPTIONS} className="lg:w-40" />
          </FilterBar>
          <DataTable
            columns={columns}
            rows={data?.items}
            loading={loading}
            minWidth={980}
            onRowClick={(p) => navigate(p.id)}
            empty={tab === "pending" && !list.isFiltered ? "The queue is clear. Nice work." : "No submissions match these filters."}
          />
          <Pagination page={list.page} pageSize={list.pageSize} total={data?.total ?? 0} onChange={list.setPage} noun={tabNouns[tab]} />
        </Panel>
      )}

      <Notice tone="gold" title="Approval is not publication">
        Platform approval confirms that a submission passed moderation. Properties remain unpublished until their separate publication status changes. Approval is blocked for companies not in active standing.
      </Notice>
    </div>
  );
}