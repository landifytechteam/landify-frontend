import { useParams } from "react-router-dom";
import { Building2, CalendarDays, Check, Copy, CreditCard, Download, Hash, History, Landmark, Percent, User } from "lucide-react";
import { useRequest } from "../../context/hooks";
import { COMMISSION_STATUSES, partnerApi } from "../../context/salespartner/partnerApi";
import { Button, ErrorState, LoadingState, Panel } from "../../components/dashboard/ui";
import { BackLink, PartnerBadge } from "../../components/salespartner/shared";
import { downloadStatement } from "../../components/salespartner/statement";
import { useToast } from "../../components/dashboard/useToast";
import { Reveal } from "../../components/ui/Reveal";
import { fullDate, naira } from "../../utils/format";

// How far along the payout is, from the commission status.
// TODO (backend): if the API returns real timestamps per step, show them here.
const STEPS = [
  { title: "Payment Received", detail: "Customer made payment for the property" },
  { title: "Payment Verified", detail: "Payment confirmed by your Company Admin" },
  { title: "Commission Processed", detail: "Commission calculated and prepared" },
  { title: "Commission Paid", detail: "Commission transferred to your account" },
];
const stepsDone = { pending: 1, processing: 3, paid: 4 };

/** /salespartner/commissions/:commissionId: one commission and its payout progress. */
export default function CommissionDetailPage() {
  const { commissionId } = useParams();
  const toast = useToast();
  const { data: c, error, reload } = useRequest(partnerApi.getCommission, commissionId);

  if (error && !c) {
    return (
      <div className="space-y-6">
        <BackLink to="..">Back to Commissions</BackLink>
        <ErrorState message={error} onRetry={reload} />
      </div>
    );
  }
  if (!c) return <LoadingState label="Loading payment details…" />;

  const done = stepsDone[c.status] ?? 1;
  const ratePct = `${Math.round(c.rate * 100)}%`;

  const copyReference = async () => {
    try {
      await navigator.clipboard.writeText(c.reference);
      toast("Reference copied.");
    } catch {
      toast("Couldn't copy. Select the reference and copy it.", "error");
    }
  };

  return (
    <div className="space-y-6">
      <Reveal className="space-y-3">
        <BackLink to="..">Back to Commissions</BackLink>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-[34px]">Payment Details</h1>
          <PartnerBadge list={COMMISSION_STATUSES} value={c.status} />
        </div>
        <p className="text-sm text-body">Customer, property, and payment information for this commission.</p>
      </Reveal>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
        <div className="space-y-6">
          <Panel title={<span className="flex items-center gap-2"><User className="h-5 w-5 text-brand-600" aria-hidden />Customer & Property Information</span>}>
            <div className="grid gap-6 sm:grid-cols-2 sm:divide-x sm:divide-line">
              <dl className="space-y-5">
                <Info icon={User} label="Customer's Name" value={c.clientName} />
                <Info icon={Building2} label="Property" value={c.propertyName} sub={c.propertyLocation} />
              </dl>
              <dl className="space-y-5 sm:pl-6">
                <Info icon={CalendarDays} label="Payment Date" value={fullDate(c.date)} />
                <Info icon={Hash} label="Payment Reference" value={c.reference} />
              </dl>
            </div>
          </Panel>

          <Panel title="Payment & Commission Summary" flush>
            <div className="overflow-x-auto">
              <table className="w-full min-w-120 text-left text-sm">
                <thead className="border-y border-line bg-canvas text-xs text-body">
                  <tr>
                    <th scope="col" className="px-6 py-3 font-medium">Amount Paid</th>
                    <th scope="col" className="px-6 py-3 font-medium">Commission Rate</th>
                    <th scope="col" className="px-6 py-3 font-medium">Commission Earned</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="font-semibold text-ink">
                    <td className="px-6 py-4">{naira(c.amountPaid)}</td>
                    <td className="px-6 py-4">{ratePct}</td>
                    <td className="px-6 py-4 text-brand-600">{naira(c.amount)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Panel>
        </div>

        <div className="space-y-6">
          <Panel title={<span className="flex items-center gap-2"><CreditCard className="h-5 w-5 text-brand-600" aria-hidden />Payment Summary</span>}>
            <div className="flex flex-wrap items-center gap-3 border-b border-line pb-5">
              <p className="text-4xl font-semibold tracking-tight text-ink">{naira(c.amountPaid)}</p>
              <PartnerBadge list={COMMISSION_STATUSES} value={c.status} />
            </div>
            <dl className="mt-5 grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 text-sm">
              <dt className="text-body">Payment Method</dt>
              <dd className="flex items-center gap-2 text-ink">
                <Landmark className="h-4 w-4 text-body" aria-hidden />
                {c.paymentMethod}
              </dd>
              <dt className="text-body">Reference</dt>
              <dd className="flex items-center gap-2 font-semibold text-ink">
                {c.reference}
                <button type="button" onClick={copyReference} className="rounded p-1 text-brand-600 hover:bg-brand-50" aria-label="Copy reference">
                  <Copy className="h-4 w-4" aria-hidden />
                </button>
              </dd>
              {c.paidAt && (
                <>
                  <dt className="text-body">Paid On</dt>
                  <dd className="text-ink">{fullDate(c.paidAt)}</dd>
                </>
              )}
            </dl>
            <Button
              variant="primary"
              icon={Download}
              className="mt-6"
              onClick={() => downloadStatement([c], `commission-${c.reference}.csv`)}
            >
              Download statement
            </Button>
          </Panel>

          <Panel title={<span className="flex items-center gap-2"><Percent className="h-5 w-5 text-brand-600" aria-hidden />Commission Breakdown</span>}>
            {/* Property payment × rate = commission, one figure per column */}
            <div className="grid grid-cols-[auto_auto_auto_auto_auto] items-end justify-between gap-x-2 gap-y-1">
              <p className="text-xs font-medium text-brand-600">Property Payment</p>
              <span />
              <p className="text-xs font-medium text-brand-600">Rate</p>
              <span />
              <p className="text-xs font-medium text-brand-600">Commission Earned</p>
              <p className="text-xl font-semibold text-ink">{naira(c.amountPaid)}</p>
              <p className="text-lg text-body" aria-label="times">×</p>
              <p className="text-xl font-semibold text-ink">{ratePct}</p>
              <p className="text-lg text-body" aria-label="equals">=</p>
              <p className="text-xl font-semibold text-brand-600">{naira(c.amount)}</p>
            </div>
          </Panel>

          <Panel title={<span className="flex items-center gap-2"><History className="h-5 w-5 text-brand-600" aria-hidden />Payment Timeline</span>}>
            <ol className="relative space-y-6 before:absolute before:bottom-3 before:left-3 before:top-3 before:w-px before:bg-line">
              {STEPS.map((step, i) => {
                const complete = i < done;
                const current = i === done && c.status !== "paid";
                return (
                  <li key={step.title} className="relative flex gap-4">
                    <span
                      className={`relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                        complete ? "bg-brand-600 text-white" : current ? "border-2 border-gold-500 bg-white" : "border-2 border-line bg-white"
                      }`}
                    >
                      {complete && <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden />}
                      {current && <span className="h-2 w-2 animate-pulse rounded-full bg-gold-500" aria-hidden />}
                    </span>
                    <div>
                      <p className={`text-sm font-semibold ${complete || current ? "text-ink" : "text-body"}`}>
                        {step.title}
                        <span className="sr-only">{complete ? " (done)" : current ? " (in progress)" : " (not yet)"}</span>
                      </p>
                      <p className="mt-0.5 text-xs text-body">{step.detail}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </Panel>
        </div>
      </div>
    </div>
  );
}

function Info({ icon: Icon, label, value, sub }) {
  return (
    <div>
      <dt className="flex items-center gap-2 text-sm text-body">
        <Icon className="h-4 w-4" aria-hidden />
        {label}
      </dt>
      <dd className="mt-1.5 pl-6 font-medium text-ink">
        {value}
        {sub && <span className="block text-xs font-normal text-body">{sub}</span>}
      </dd>
    </div>
  );
}
