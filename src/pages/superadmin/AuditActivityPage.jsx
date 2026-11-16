import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Download, ShieldCheck } from "lucide-react";
import { superAdminApi } from "../../context/superadmin/superAdminApi";
import { useListState, useRequest } from "../../context/superadmin/hooks";
import {
  Button,
  ErrorState,
  PageHeader,
  Panel,
  StatusBadge,
} from "../../components/dashboard/ui";
import {
  FilterBar,
  SearchInput,
  Select,
} from "../../components/dashboard/controls";
import {
  DataTable,
  Pagination,
  Stacked,
} from "../../components/dashboard/DataTable";
import { useToast } from "../../components/dashboard/useToast";
import { downloadCsv } from "../../utils/csv";
import { dayMonth, fullDateTime, timeWAT, yearOf } from "../../utils/format";

const RANGE_OPTIONS = [
  { value: "24h", label: "Last 24 hours" },
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "all", label: "All time" },
];
const OUTCOME_OPTIONS = [
  { value: "success", label: "Success" },
  { value: "denied", label: "Denied" },
];
const EMPTY = { search: "", range: "7d", scope: "", action: "", outcome: "" };

export default function AuditActivityPage() {
  const toast = useToast();
  const [searchParams] = useSearchParams();
  const list = useListState(EMPTY);
  const { data, loading, error, reload } = useRequest(
    superAdminApi.getAuditEvents,
    list.params,
  );
  const [selected, setSelected] = useState(null);
  const detailRef = useRef(null);

  // Links like ?search=LND-0048&range=all (from a submission) pre-fill the filters
  useEffect(() => {
    ["search", "range", "scope"].forEach((key) => {
      const value = searchParams.get(key);
      if (value !== null) list.setFilter(key, value);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Show the clicked event, or the newest one if nothing on this page is clicked.
  // Worked out during render, so no effect + extra render is needed.
  const shown = data?.items.find((e) => e.id === selected?.id) ?? data?.items[0] ?? null;

  const select = (event) => {
    setSelected(event);
    // On small screens the detail panel is far below, so bring it into view
    if (window.innerWidth < 1024)
      detailRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const rangeLabel = RANGE_OPTIONS.find(
    (r) => r.value === list.filters.range,
  )?.label.toLowerCase();

  const exportCsv = async () => {
    const all = await superAdminApi.getAuditEvents({
      ...list.params,
      page: 1,
      pageSize: 1000,
    });
    downloadCsv(
      "landify-audit-log.csv",
      [
        { header: "Event ID", value: (e) => e.id },
        { header: "Timestamp (WAT)", value: (e) => fullDateTime(e.at) },
        { header: "Actor", value: (e) => e.actor },
        { header: "Actor role", value: (e) => e.actorRole },
        { header: "Company scope", value: (e) => e.scope },
        { header: "Action", value: (e) => e.action },
        { header: "Target", value: (e) => e.target },
        { header: "Target detail", value: (e) => e.targetSub },
        { header: "State change", value: (e) => e.stateChange },
        { header: "Reason", value: (e) => e.reason },
        { header: "Outcome", value: (e) => e.outcome },
      ],
      all.items,
    );
    toast(`Exported ${all.items.length} events`);
  };

  const columns = [
    {
      key: "at",
      header: "Timestamp · WAT",
      render: (e) => (
        <Stacked
          main={`${dayMonth(e.at)} · ${timeWAT(e.at)}`}
          sub={yearOf(e.at)}
          strong={false}
        />
      ),
    },
    {
      key: "actor",
      header: "Actor",
      render: (e) => <Stacked main={e.actor} sub={e.actorRole} />,
    },
    { key: "scope", header: "Company scope", render: (e) => e.scope },
    { key: "action", header: "Action", render: (e) => e.action },
    {
      key: "target",
      header: "Target",
      render: (e) => (
        <Stacked main={e.target} sub={e.targetSub} strong={false} />
      ),
    },
    {
      key: "outcome",
      header: "Outcome",
      render: (e) => <StatusBadge status={e.outcome} />,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Platform governance"
        title="Audit activity"
        subtitle="An accountable record of platform decisions, access changes and cross-company submissions."
        actions={
          <Button icon={Download} onClick={exportCsv} disabled={!data}>
            Export audit log
          </Button>
        }
      />

      <div className="flex flex-col gap-2 rounded-xl border border-brand-600/20 bg-brand-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-center gap-2 text-sm font-semibold text-brand-600">
          <ShieldCheck className="h-5 w-5" aria-hidden /> Append-only governance
          record
        </p>
        <p className="text-sm text-body">
          Retention: {data?.retentionDays ?? "–"} days · Time zone: Africa/Lagos
          (WAT)
        </p>
      </div>

      {error && !data ? (
        <ErrorState message={error} onRetry={reload} />
      ) : (
        <Panel
          title="Activity log"
          subtitle={`${data?.total ?? "–"} events in the ${rangeLabel === "all time" ? "full record" : rangeLabel} · ${list.filters.scope || "All company scopes"} · Click a row for details`}
          action={
            list.isFiltered && (
              <button
                type="button"
                onClick={list.reset}
                className="text-sm font-semibold text-brand-600 hover:underline"
              >
                Reset filters
              </button>
            )
          }
          flush
        >
          <FilterBar>
            <SearchInput
              value={list.filters.search}
              onChange={(v) => list.setFilter("search", v)}
              placeholder="Search actor, target or event ID"
            />
            <Select
              value={list.filters.range}
              onChange={(v) => list.setFilter("range", v)}
              options={RANGE_OPTIONS}
              className="lg:w-40"
            />
            <Select
              value={list.filters.scope}
              onChange={(v) => list.setFilter("scope", v)}
              options={data?.scopes ?? []}
              placeholder="All scopes"
              className="lg:w-44"
            />
            <Select
              value={list.filters.action}
              onChange={(v) => list.setFilter("action", v)}
              options={data?.actions ?? []}
              placeholder="All actions"
              className="lg:w-44"
            />
            <Select
              value={list.filters.outcome}
              onChange={(v) => list.setFilter("outcome", v)}
              options={OUTCOME_OPTIONS}
              placeholder="All outcomes"
              className="lg:w-40"
            />
          </FilterBar>
          <DataTable
            columns={columns}
            rows={data?.items}
            loading={loading}
            minWidth={900}
            onRowClick={select}
            selectedKey={shown?.id}
            empty="No events match these filters. Try a longer time range."
          />
          <Pagination
            page={list.page}
            pageSize={list.pageSize}
            total={data?.total ?? 0}
            onChange={list.setPage}
            noun="events"
          />
        </Panel>
      )}

      <div ref={detailRef} className="scroll-mt-24">
        {shown && <EventDetail event={shown} />}
      </div>
    </div>
  );
}

function EventDetail({ event: e }) {
  return (
    <Panel
      title={`Event detail · ${e.id}`}
      subtitle={`${e.action} · ${fullDateTime(e.at)}`}
      action={<StatusBadge status={e.outcome} />}
    >
      <dl className="grid gap-6 text-sm sm:grid-cols-3">
        <div>
          <dt className="text-body">Actor</dt>
          <dd className="mt-1.5 font-semibold text-ink">
            {e.actor} · {e.actorRole}
          </dd>
        </div>
        <div>
          <dt className="text-body">Company scope / target</dt>
          <dd className="mt-1.5 font-semibold text-ink">
            {e.scope} · {e.target}
            {e.targetSub ? ` (${e.targetSub})` : ""}
          </dd>
        </div>
        <div>
          <dt className="text-body">State change</dt>
          <dd className="mt-1.5 font-semibold text-ink">
            {e.stateChange ?? "No state change"}
          </dd>
        </div>
      </dl>
      <p className="mt-5 rounded-lg bg-canvas px-4 py-3 text-sm text-ink">
        {e.reason
          ? `Recorded reason: ${e.reason}`
          : "No reason was required for this action."}
      </p>
    </Panel>
  );
}
