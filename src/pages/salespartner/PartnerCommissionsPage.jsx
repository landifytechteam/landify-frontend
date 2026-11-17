import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarDays, ChevronRight, Coins, Download, Hourglass, ShieldCheck } from "lucide-react";
import { useListState, useRequest } from "../../context/hooks";
import { COMMISSION_STATUSES, partnerApi } from "../../context/salespartner/partnerApi";
import { Button, ErrorState, LoadingState, PageHeader, Panel } from "../../components/dashboard/ui";
import { Select } from "../../components/dashboard/controls";
import { DataTable, Pagination } from "../../components/dashboard/DataTable";
import { PartnerBadge, PartnerStat } from "../../components/salespartner/shared";
import { EarningsChart } from "../../components/salespartner/EarningsChart";
import { useToast } from "../../components/dashboard/useToast";
import { downloadStatement } from "../../components/salespartner/statement";
import { fullDate, naira } from "../../utils/format";

const PAGE_SIZE = 10;

const RANGES = [
  { value: "30d", label: "Last 30 days" },
  { value: "90d", label: "Last 90 days" },
  { value: "year", label: "This year" },
];
const CHART_RANGES = [
  { value: "6", label: "Last 6 months" },
  { value: "12", label: "Last 12 months" },
];

const monthYear = (d) => new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric", timeZone: "Africa/Lagos" }).format(d);
const plural = (n, word) => `${n} ${word}${n === 1 ? "" : "s"}`;

const columns = [
  { key: "date", header: "Date", render: (c) => <span className="whitespace-nowrap text-body">{fullDate(c.date)}</span> },
  { key: "client", header: "Client", render: (c) => <span className="font-medium text-ink">{c.clientName}</span> },
  { key: "property", header: "Property", render: (c) => c.propertyName },
  { key: "amount", header: "Amount", render: (c) => <span className="font-semibold text-ink">{naira(c.amount)}</span> },
  { key: "status", header: "Status", render: (c) => <PartnerBadge list={COMMISSION_STATUSES} value={c.status} /> },
  { key: "reference", header: "Payment Reference", render: (c) => <span className="text-xs text-body">{c.reference}</span> },
  { key: "go", header: <span className="sr-only">Open</span>, className: "w-10", render: () => <ChevronRight className="h-4 w-4 text-body" aria-hidden /> },
];

/** /salespartner/commissions: earnings summary, monthly chart and history. */
export default function PartnerCommissionsPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const [months, setMonths] = useState("6");
  const [downloading, setDownloading] = useState(false);
  const list = useListState({ status: "", range: "" }, PAGE_SIZE);
  const { data, loading, error, reload } = useRequest(partnerApi.getCommissions, { ...list.params, months });
  const s = data?.summary;

  const statement = async () => {
    setDownloading(true);
    try {
      const all = await partnerApi.getCommissions({ ...list.params, page: 1, pageSize: 10000 });
      downloadStatement(all.items);
    } catch {
      toast("Couldn't download the statement. Try again.", "error");
    } finally {
      setDownloading(false);
    }
  };

  if (error && !data) return <ErrorState message={error} onRetry={reload} />;
  if (!data) return <LoadingState label="Loading your commissions…" />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Commissions"
        subtitle="Track your personal earnings, commissions, and payment status."
        actions={
          <Button icon={Download} onClick={statement} loading={downloading} disabled={!data.total}>
            Download statement
          </Button>
        }
      />

      <div className="reveal-stagger grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <PartnerStat label="Total Commission" value={naira(s.total)} icon={Coins} highlight>
          <p className="mt-3 text-xs text-brand-600">Earned across {plural(s.totalSales, "sale")}</p>
        </PartnerStat>
        <PartnerStat label="Paid Commission" value={naira(s.paid)} icon={ShieldCheck}>
          <p className="mt-3 text-xs text-brand-600">{plural(s.paidCount, "payment")} received</p>
        </PartnerStat>
        <PartnerStat label="Pending Commission" value={naira(s.pending)} icon={Hourglass} highlight>
          <p className="mt-3 text-xs text-brand-600">{s.processing ? `Includes ${naira(s.processing)} processing` : "Waiting for client payments"}</p>
        </PartnerStat>
        <PartnerStat label="This Month" value={naira(s.thisMonth)} icon={CalendarDays}>
          <p className="mt-3 text-xs text-brand-600">
            {monthYear(new Date())} • {plural(s.thisMonthSales, "sale")}
          </p>
        </PartnerStat>
      </div>

      <Panel
        title={
          <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            Commission Earnings
            <span className="text-xs font-normal text-body">Monthly earnings in naira</span>
          </span>
        }
        action={
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="flex items-center gap-1.5 text-xs text-body"><span className="h-2 w-2 rounded-full bg-brand-600" aria-hidden />Paid</span>
            <span className="flex items-center gap-1.5 text-xs text-body"><span className="h-2 w-2 rounded-full bg-gold-500" aria-hidden />Pending / processing</span>
            <Select value={months} onChange={setMonths} options={CHART_RANGES} className="w-40 shrink-0" />
          </div>
        }
      >
        {/* key: replay the grow animation when the range changes */}
        <div className={loading ? "opacity-60" : ""}>
          <EarningsChart key={months + data.monthly.length} months={data.monthly} />
        </div>
      </Panel>

      <Panel
        title="Commission History"
        flush
        action={
          <div className="flex flex-col gap-3 sm:flex-row">
            <Select value={list.filters.status} onChange={(v) => list.setFilter("status", v)} options={COMMISSION_STATUSES} placeholder="All Payment Statuses" className="sm:w-52" />
            <Select value={list.filters.range} onChange={(v) => list.setFilter("range", v)} options={RANGES} placeholder="All Dates" className="sm:w-40" />
          </div>
        }
      >
        <DataTable
          columns={columns}
          rows={data.items}
          loading={loading}
          minWidth={820}
          onRowClick={(c) => navigate(c.id)}
          empty={list.isFiltered ? "No commissions match these filters." : "No commissions yet. They appear here after your first sale."}
        />
        <Pagination page={list.page} pageSize={PAGE_SIZE} total={data.total} onChange={list.setPage} noun="commission records" />
      </Panel>
    </div>
  );
}
