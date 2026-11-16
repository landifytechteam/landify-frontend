import { useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowRight, Download } from "lucide-react";
import { superAdminApi } from "../../context/superadmin/superAdminApi";
import { useListState, useRequest } from "../../context/superadmin/hooks";
import { Button, ErrorState, Notice, PageHeader, Panel, StatCard, StatGrid, StatusBadge } from "../../components/dashboard/ui";
import { FilterBar, SearchInput, Select } from "../../components/dashboard/controls";
import { DataTable, Pagination, Stacked } from "../../components/dashboard/DataTable";
import { useToast } from "../../components/dashboard/Toast";
import { downloadCsv } from "../../utils/csv";
import { fullDate } from "../../utils/format";

const MODERATION_OPTIONS = [
  { value: "pending", label: "Moderation: pending" },
  { value: "approved", label: "Moderation: approved" },
  { value: "rejected", label: "Moderation: rejected" },
  { value: "archived", label: "Moderation: archived" },
];
const PUBLICATION_OPTIONS = [
  { value: "published", label: "Publication: published" },
  { value: "unpublished", label: "Publication: unpublished" },
];
const EMPTY = { search: "", companyId: "", state: "", moderation: "", publication: "" };

// Each stat card is a preset of filters
const PRESETS = {
  all: {},
  published: { publication: "published" },
  approvedUnpublished: { moderation: "approved", publication: "unpublished" },
  pending: { moderation: "pending" },
};

export default function AllPropertiesPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const [searchParams] = useSearchParams();
  const list = useListState(EMPTY);
  const { data, loading, error, reload } = useRequest(superAdminApi.getProperties, list.params);

  // Links like ?companyId=CMP-001, ?moderation=pending or ?search=idera (header search) pre-fill the filters
  useEffect(() => {
    ["search", "companyId", "moderation", "publication"].forEach((key) => {
      const value = searchParams.get(key);
      if (value !== null) list.setFilter(key, value);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const { moderation, publication } = list.filters;
  const activePreset = Object.keys(PRESETS).find((name) => {
    const p = PRESETS[name];
    return (p.moderation ?? "") === moderation && (p.publication ?? "") === publication;
  });
  const applyPreset = (name) => {
    const preset = activePreset === name && name !== "all" ? {} : PRESETS[name];
    list.setFilter("moderation", preset.moderation ?? "");
    list.setFilter("publication", preset.publication ?? "");
  };

  const s = data?.summary;
  const companyName = data?.companies.find((c) => c.value === list.filters.companyId)?.label;

  const exportCsv = async () => {
    const all = await superAdminApi.getProperties({ ...list.params, page: 1, pageSize: 1000 });
    downloadCsv("landify-property-register.csv", [
      { header: "Property ID", value: (p) => p.id },
      { header: "Property", value: (p) => p.name },
      { header: "Company", value: (p) => p.companyName },
      { header: "Location", value: (p) => p.location },
      { header: "Moderation", value: (p) => p.moderation },
      { header: "Publication", value: (p) => p.publication },
      { header: "Updated", value: (p) => fullDate(p.updatedAt) },
    ], all.items);
    toast(`Exported ${all.items.length} properties`);
  };

  const columns = [
    { key: "name", header: "Property", render: (p) => <Stacked main={p.name} sub={p.id} /> },
    { key: "company", header: "Company", render: (p) => p.companyName },
    { key: "location", header: "Location", render: (p) => p.location },
    { key: "moderation", header: "Moderation", render: (p) => <StatusBadge status={p.moderation} /> },
    { key: "publication", header: "Publication", render: (p) => <StatusBadge status={p.publication} /> },
    { key: "updated", header: "Updated", render: (p) => fullDate(p.updatedAt) },
    {
      key: "action",
      header: "Action",
      render: (p) => (
        <Link to={`/superadmin/moderation/${p.id}`} onClick={(e) => e.stopPropagation()} className="inline-flex items-center gap-1 font-semibold text-brand-600 hover:underline">
          View <ArrowRight className="h-4 w-4" />
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Platform governance"
        title="All properties"
        subtitle="The platform-wide property register. Track company ownership, moderation and publication independently."
        actions={<Button icon={Download} onClick={exportCsv} disabled={!data}>Export register</Button>}
      />

      <StatGrid>
        <StatCard label="Total properties" value={s?.total} detail={s && `Across ${s.companies} registered companies`} active={activePreset === "all"} onClick={() => applyPreset("all")} />
        <StatCard label="Published" value={s?.published} detail="Approved and publicly listed" active={activePreset === "published"} onClick={() => applyPreset("published")} />
        <StatCard label="Approved, unpublished" value={s?.approvedUnpublished} detail="Eligible but not yet publicly listed" active={activePreset === "approvedUnpublished"} onClick={() => applyPreset("approvedUnpublished")} />
        <StatCard label="Pending moderation" value={s?.pending} detail={s && `${s.rejected} rejected · ${s.archived} archived`} active={activePreset === "pending"} onClick={() => applyPreset("pending")} />
      </StatGrid>

      {error && !data ? (
        <ErrorState message={error} onRetry={reload} />
      ) : (
        <Panel
          title="Property register"
          subtitle={`${data?.total ?? "–"} records · ${companyName ? `${companyName} only` : "No company filter applied"}`}
          action={
            <div className="flex items-center gap-4">
              {list.isFiltered && (
                <button type="button" onClick={list.reset} className="text-sm font-semibold text-body hover:text-ink hover:underline">
                  Clear filters
                </button>
              )}
              <Link to="/superadmin/moderation" className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600 hover:underline">
                Open moderation queue <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          }
          flush
        >
          <FilterBar>
            <SearchInput value={list.filters.search} onChange={(v) => list.setFilter("search", v)} placeholder="Search property or ID" />
            <Select value={list.filters.companyId} onChange={(v) => list.setFilter("companyId", v)} options={data?.companies ?? []} placeholder="All companies" className="lg:w-44" />
            <Select value={list.filters.state} onChange={(v) => list.setFilter("state", v)} options={data?.states ?? []} placeholder="All locations" className="lg:w-40" />
            <Select value={moderation} onChange={(v) => list.setFilter("moderation", v)} options={MODERATION_OPTIONS} placeholder="Moderation: all" className="lg:w-48" />
            <Select value={publication} onChange={(v) => list.setFilter("publication", v)} options={PUBLICATION_OPTIONS} placeholder="Publication: all" className="lg:w-48" />
          </FilterBar>
          <DataTable columns={columns} rows={data?.items} loading={loading} minWidth={900} onRowClick={(p) => navigate(`/superadmin/moderation/${p.id}`)} empty="No properties match these filters." />
          <Pagination page={list.page} pageSize={list.pageSize} total={data?.total ?? 0} onChange={list.setPage} noun={`properties · ${list.pageSize} per page`} />
        </Panel>
      )}

      <Notice title="One register, two status dimensions">
        Moderation tracks pending, approved, rejected or archived submissions. Publication tracks whether an approved property is publicly listed. Only approved properties can be published.
      </Notice>
    </div>
  );
}