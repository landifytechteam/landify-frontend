import { useState } from "react";
import { CircleCheck, Clock, Download, UserCheck, UserPlus, Users } from "lucide-react";
import { useListState, useRequest } from "../../context/hooks";
import { CLIENT_STATUSES, PURCHASE_STATUSES, partnerApi, statusInfo } from "../../context/salespartner/partnerApi";
import { Button, ErrorState, PageHeader, Panel } from "../../components/dashboard/ui";
import { FilterBar, SearchInput, Select } from "../../components/dashboard/controls";
import { DataTable, Pagination, Stacked } from "../../components/dashboard/DataTable";
import { Avatar, PartnerBadge, PartnerStat, Trend } from "../../components/salespartner/shared";
import { AddClientModal } from "../../components/salespartner/AddClientModal";
import { useToast } from "../../components/dashboard/useToast";
import { Reveal } from "../../components/ui/Reveal";
import { contact } from "../../data/landing";
import { downloadCsv } from "../../utils/csv";
import { fullDate, timeAgo } from "../../utils/format";

const PAGE_SIZE = 10;

const columns = [
  {
    key: "client",
    header: "Client",
    render: (c) => (
      <div className="flex items-center gap-3">
        <Avatar name={c.fullName} size="sm" />
        <Stacked main={c.fullName} sub={c.email} />
      </div>
    ),
  },
  { key: "phone", header: "Phone Number", render: (c) => <span className="whitespace-nowrap text-body">{c.phone}</span> },
  { key: "property", header: "Assigned Property", render: (c) => <Stacked main={c.propertyName} sub={c.propertyLocation} strong={false} /> },
  { key: "status", header: "Client Status", render: (c) => <PartnerBadge list={CLIENT_STATUSES} value={c.status} /> },
  { key: "purchase", header: "Purchase Status", render: (c) => <PartnerBadge list={PURCHASE_STATUSES} value={c.purchaseStatus} /> },
  { key: "activity", header: "Last Activity", render: (c) => <span className="whitespace-nowrap text-body">{timeAgo(c.lastActivityAt)}</span> },
];

/** /salespartner/clients: every client assigned to this partner. */
export default function PartnerClientsPage() {
  const toast = useToast();
  const [adding, setAdding] = useState(false);
  const list = useListState({ search: "", status: "", propertyId: "", purchaseStatus: "" }, PAGE_SIZE);
  const { data, loading, error, reload } = useRequest(partnerApi.getClients, list.params);
  const [exporting, setExporting] = useState(false);
  const summary = data?.summary;

  // Export every client that matches the filters (not just this page)
  const exportClients = async () => {
    setExporting(true);
    try {
      const all = await partnerApi.getClients({ ...list.params, page: 1, pageSize: 10000 });
      downloadCsv("my-clients.csv", [
        { header: "Name", value: (c) => c.fullName },
        { header: "Email", value: (c) => c.email },
        { header: "Phone", value: (c) => c.phone },
        { header: "Property", value: (c) => c.propertyName },
        { header: "Location", value: (c) => c.propertyLocation },
        { header: "Client status", value: (c) => statusInfo(CLIENT_STATUSES, c.status).label },
        { header: "Purchase status", value: (c) => statusInfo(PURCHASE_STATUSES, c.purchaseStatus).label },
        { header: "Last activity", value: (c) => fullDate(c.lastActivityAt) },
      ], all.items);
    } catch {
      toast("Couldn't export your clients. Try again.", "error");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Clients"
        subtitle="Manage and track the clients assigned to you."
        actions={
          <>
            <Button icon={Download} onClick={exportClients} loading={exporting} disabled={!data?.total}>
              Export clients
            </Button>
            <Button variant="primary" icon={UserPlus} onClick={() => setAdding(true)}>
              Add client
            </Button>
          </>
        }
      />

      <div className="reveal-stagger grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <PartnerStat label="Total Clients" value={summary?.total} icon={Users}>
          {summary && <Trend>+{summary.newThisMonth} this month</Trend>}
        </PartnerStat>
        <PartnerStat label="Active Clients" value={summary?.active} icon={UserCheck}>
          {summary && <Trend>+{summary.activeThisMonth} this month</Trend>}
        </PartnerStat>
        <PartnerStat label="Pending Clients" value={summary?.pending} icon={Clock}>
          <Trend up={false}>Awaiting follow-up or confirmation</Trend>
        </PartnerStat>
        <PartnerStat label="Total Sales" value={summary?.sales} icon={CircleCheck} highlight>
          {summary && <Trend>+{summary.salesThisMonth} this month</Trend>}
        </PartnerStat>
      </div>

      <Panel title="Your Assigned Clients" flush>
        <FilterBar>
          <SearchInput value={list.filters.search} onChange={(v) => list.setFilter("search", v)} placeholder="Search clients by name, phone, or email…" />
          <Select value={list.filters.status} onChange={(v) => list.setFilter("status", v)} options={CLIENT_STATUSES} placeholder="All Statuses" className="lg:w-44" />
          <Select value={list.filters.propertyId} onChange={(v) => list.setFilter("propertyId", v)} options={data?.properties ?? []} placeholder="All Properties" className="lg:w-44" />
          <Select value={list.filters.purchaseStatus} onChange={(v) => list.setFilter("purchaseStatus", v)} options={PURCHASE_STATUSES} placeholder="All Purchases" className="lg:w-48" />
        </FilterBar>

        {error && !data ? (
          <div className="px-5 pb-5 sm:px-6"><ErrorState message={error} onRetry={reload} /></div>
        ) : (
          <>
            <DataTable
              columns={columns}
              rows={data?.items}
              loading={loading}
              minWidth={900}
              empty={list.isFiltered ? "No clients match these filters." : "No clients are assigned to you yet."}
            />
            {data && <Pagination page={list.page} pageSize={PAGE_SIZE} total={data.total} onChange={list.setPage} noun="clients" />}
          </>
        )}
      </Panel>

      <Reveal className="flex flex-col gap-4 rounded-xl border border-brand-600/15 bg-brand-50 px-5 py-5 sm:flex-row sm:items-center sm:px-6">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-brand-600">
          <Users className="h-6 w-6" aria-hidden />
        </span>
        <div className="flex-1">
          <p className="font-semibold text-ink">Need help with a client?</p>
          <p className="mt-1 text-sm text-body">Contact your Company Admin for assistance with assignments and client purchases.</p>
        </div>
        {/* TODO: send this to the partner's Company Admin once the backend returns their email */}
        <a
          href={`mailto:${contact.email}?subject=${encodeURIComponent("Help with a client")}`}
          className="inline-flex h-11 shrink-0 items-center justify-center rounded-full bg-gold-500 px-6 text-sm font-semibold text-ink transition-colors hover:bg-gold-400"
        >
          Contact Support
        </a>
      </Reveal>

      <AddClientModal
        open={adding}
        onClose={() => setAdding(false)}
        properties={data?.properties}
        onCreated={(c) => {
          toast(`${c.fullName} was added to your clients.`);
          reload();
        }}
      />
    </div>
  );
}
