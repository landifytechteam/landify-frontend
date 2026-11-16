import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Download, Plus } from "lucide-react";
import { superAdminApi } from "../../context/superadmin/superAdminApi";
import { useAction, useListState, useRequest } from "../../context/superadmin/hooks";
import { Button, ErrorState, Notice, PageHeader, Panel, StatCard, StatGrid, StatusBadge } from "../../components/dashboard/ui";
import { FilterBar, SearchInput, Select } from "../../components/dashboard/controls";
import { DataTable, Pagination, Stacked } from "../../components/dashboard/DataTable";
import { CompanyFormModal } from "../../components/superadmin/CompanyFormModal";
import { useToast } from "../../components/dashboard/Toast";
import { downloadCsv } from "../../utils/csv";
import { fullDate, fullDateTime } from "../../utils/format";

const STATUS_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "under_review", label: "Under review" },
  { value: "suspended", label: "Suspended" },
];
const scopeLabel = { "": "All companies", active: "Active companies", under_review: "Companies under review", suspended: "Suspended companies" };

export default function CompaniesPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const list = useListState({ search: "", status: "", state: "" });
  const { data, loading, error, reload } = useRequest(superAdminApi.getCompanies, list.params);
  const create = useAction(superAdminApi.createCompany);
  const [adding, setAdding] = useState(false);

  const s = data?.summary;
  const status = list.filters.status;
  // The stat cards double as status filters. Clicking the active card again clears it.
  const filterBy = (value) => list.setFilter("status", status === value ? "" : value);

  const exportCsv = async () => {
    const all = await superAdminApi.getCompanies({ ...list.params, page: 1, pageSize: 1000 });
    downloadCsv("landify-companies.csv", [
      { header: "Company ID", value: (c) => c.id },
      { header: "Company", value: (c) => c.name },
      { header: "City", value: (c) => c.city },
      { header: "State", value: (c) => c.state },
      { header: "Status", value: (c) => c.status },
      { header: "Admins", value: (c) => c.stats.admins },
      { header: "Properties", value: (c) => c.stats.properties },
      { header: "Pending", value: (c) => c.stats.pending },
      { header: "Joined", value: (c) => fullDate(c.joinedAt) },
    ], all.items);
    toast(`Exported ${all.items.length} companies`);
  };

  const addCompany = async (values) => {
    const company = await create.run(values);
    if (company) {
      toast(`${company.name} added. It's under review until verified.`);
      reload();
    }
    return company;
  };

  const columns = [
    { key: "name", header: "Company", render: (c) => <Stacked main={c.name} sub={c.id} /> },
    { key: "location", header: "Registered location", render: (c) => `${c.city}, ${c.state}` },
    { key: "status", header: "Status", render: (c) => <StatusBadge status={c.status} /> },
    { key: "admins", header: "Admins", render: (c) => c.stats.admins },
    { key: "properties", header: "Properties", render: (c) => c.stats.properties },
    { key: "pending", header: "Pending", render: (c) => c.stats.pending },
    { key: "joined", header: "Joined", render: (c) => fullDate(c.joinedAt) },
    {
      key: "action",
      header: "Action",
      render: (c) => (
        <Link to={c.id} onClick={(e) => e.stopPropagation()} className="inline-flex items-center gap-1 whitespace-nowrap font-semibold text-brand-600 hover:underline">
          View company <ArrowRight className="h-4 w-4" />
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Platform governance"
        title="Companies"
        subtitle="Govern every company on LANDIFY. Manage standing, administrator access and submission oversight."
        actions={
          <>
            <Button icon={Download} onClick={exportCsv} disabled={!data}>Export</Button>
            <Button variant="primary" icon={Plus} onClick={() => setAdding(true)}>Add company</Button>
          </>
        }
      />

      <StatGrid>
        <StatCard label="Registered companies" value={s?.total} detail={s && `${s.totalProperties} properties across the platform`} active={status === ""} onClick={() => list.setFilter("status", "")} />
        <StatCard label="Active" value={s?.active} detail="Eligible to submit properties" active={status === "active"} onClick={() => filterBy("active")} />
        <StatCard label="Under review" value={s?.underReview} detail={s && (s.underReviewNames.length ? `${s.underReviewNames.join(", ")} · Verification in progress` : "Nothing waiting")} active={status === "under_review"} onClick={() => filterBy("under_review")} />
        <StatCard label="Suspended" value={s?.suspended} detail={s && (s.suspendedNames.length ? `${s.suspendedNames.join(", ")} · Access restricted` : "No restrictions")} active={status === "suspended"} onClick={() => filterBy("suspended")} />
      </StatGrid>

      {error && !data ? (
        <ErrorState message={error} onRetry={reload} />
      ) : (
        <Panel
          title="Company registry"
          subtitle={`${scopeLabel[status]} · Platform-wide scope`}
          action={data && <p className="text-sm text-body">Updated {fullDateTime(data.updatedAt)}</p>}
          flush
        >
          <FilterBar>
            <SearchInput value={list.filters.search} onChange={(v) => list.setFilter("search", v)} placeholder="Search company name or ID" />
            <Select value={status} onChange={(v) => list.setFilter("status", v)} options={STATUS_OPTIONS} placeholder="All statuses" className="lg:w-44" />
            <Select value={list.filters.state} onChange={(v) => list.setFilter("state", v)} options={data?.states ?? []} placeholder="All states" className="lg:w-40" />
            <button type="button" onClick={list.reset} disabled={!list.isFiltered} className="h-11 px-1 text-sm font-semibold text-brand-600 hover:underline disabled:text-body/50 disabled:no-underline">
              Reset
            </button>
          </FilterBar>
          <DataTable columns={columns} rows={data?.items} loading={loading} onRowClick={(c) => navigate(c.id)} empty="No companies match these filters." />
          <Pagination page={list.page} pageSize={list.pageSize} total={data?.total ?? 0} onChange={list.setPage} noun="companies" />
        </Panel>
      )}

      <Notice title="Company standing is a platform control">
        Suspension restricts company administrator access and new submissions. Existing publication states are retained until a separate moderation action is recorded.
      </Notice>

      <div className="flex flex-col gap-2 text-sm text-body sm:flex-row sm:items-center sm:justify-between">
        <p>Company administrators are scoped to one company. Super administrators govern the platform.</p>
        <Link to="/superadmin/admins" className="inline-flex items-center gap-1 font-semibold text-brand-600 hover:underline">
          Manage admin access <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <CompanyFormModal
        open={adding}
        onClose={() => { setAdding(false); create.clearError(); }}
        onSubmit={addCompany}
        busy={create.busy}
        error={create.error}
      />
    </div>
  );
}