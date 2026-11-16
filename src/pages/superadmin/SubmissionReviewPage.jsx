import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, ChevronLeft, ChevronRight, Download, History, ShieldCheck, X } from "lucide-react";
import { superAdminApi } from "../../context/superadmin/superAdminApi";
import { useAction, useRequest } from "../../context/superadmin/hooks";
import { Breadcrumbs, Button, DetailList, ErrorState, FormError, LoadingState, Notice, Panel, StatusBadge } from "../../components/dashboard/ui";
import { Field, Select } from "../../components/dashboard/controls";
import { DataTable, Stacked } from "../../components/dashboard/DataTable";
import { ImageGallery } from "../../components/superadmin/ImageGallery";
import { useToast } from "../../components/dashboard/Toast";
import { useRefreshBadges } from "./SuperAdminLayout";
import { dayMonth, fullDate, fullDateTime, naira, timeWAT } from "../../utils/format";

const companyStanding = { active: "Active · Registration verified", under_review: "Under review · Verification in progress", suspended: "Suspended · Access restricted" };

export default function SubmissionReviewPage() {
  const { submissionId } = useParams();
  const { data, loading, error, reload } = useRequest(superAdminApi.getSubmission, submissionId);

  if (loading && !data) return <LoadingState label="Loading submission…" />;
  if (error && !data) return <ErrorState message={error} onRetry={reload} />;
  // key makes React start fresh (checklist, reason...) when moving to another submission
  return <Review key={data.id} submission={data} onChanged={reload} />;
}

function Review({ submission: s, onChanged }) {
  const navigate = useNavigate();
  const toast = useToast();
  const refreshBadges = useRefreshBadges();
  const isPending = s.moderation === "pending";
  const { position, total, prevId, nextId } = s.queue;

  // Start at the top when moving to the next submission
  useEffect(() => window.scrollTo({ top: 0 }), []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Breadcrumbs items={[{ label: "Property moderation", to: "/superadmin/moderation" }, { label: s.id }, { label: "Submission review" }]} />
        <div className="flex items-center gap-2 text-sm">
          {isPending && (
            <>
              <QueueArrow to={prevId} label="Previous submission" icon={ChevronLeft} />
              <QueueArrow to={nextId} label="Next submission" icon={ChevronRight} />
            </>
          )}
          <Link to="/superadmin/moderation" className="inline-flex items-center gap-1 font-semibold text-brand-600 hover:underline">
            <ArrowLeft className="h-4 w-4" /> Back to queue{isPending && position ? ` · ${position} of ${total}` : ""}
          </Link>
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">Platform submission review</p>
          <h1 className="mt-2 text-3xl tracking-tight text-ink sm:text-[34px]">{s.name}</h1>
          <p className="mt-2 text-[15px] text-body">
            {s.id} · Submitted {fullDateTime(s.submittedAt)} · {s.submissionType === "resubmission" ? "Resubmission" : "Initial submission"}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <StatusBadge status={s.moderation} />
          <Button icon={History} onClick={() => navigate(`/superadmin/audit?search=${s.id}&range=all`)}>View audit history</Button>
        </div>
      </div>

      {s.previousRejection && (
        <Notice tone="gold" title="Previously rejected">
          {s.previousRejection} Check that the company corrected this before approving.
        </Notice>
      )}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="min-w-0 space-y-6">
          <ImageGallery images={s.images} title={s.name} />
          <PropertyFacts s={s} />
          <Documents s={s} isPending={isPending} />
        </div>

        <div className="space-y-6">
          <CompanyCard s={s} />
          <DecisionArea
            s={s}
            onDecided={(message) => {
              toast(message);
              refreshBadges();
              // Jump to the next submission in the queue, or back to the queue when it's empty
              const next = nextId ?? prevId;
              if (next) navigate(`/superadmin/moderation/${next}`);
              else onChanged();
            }}
          />
        </div>
      </div>

      <Notice title="Evidence-led moderation">
        This review evaluates submitted evidence against platform policy. It does not constitute an independent legal guarantee of land title. Every decision records its actor, company scope and timestamp.
      </Notice>
    </div>
  );
}

function QueueArrow({ to, label, icon: Icon }) {
  const cls = "rounded-md border border-line bg-white p-1.5";
  if (!to) return <span className={`${cls} text-body/40`} aria-hidden><Icon className="h-4 w-4" /></span>;
  return <Link to={`/superadmin/moderation/${to}`} className={`${cls} text-ink hover:border-brand-600`} aria-label={label} title={label}><Icon className="h-4 w-4" /></Link>;
}

function PropertyFacts({ s }) {
  const d = s.details;
  return (
    <Panel title="Property facts" subtitle={`Information supplied by ${s.company.name}`}>
      <DetailList
        columns={3}
        items={[
          { label: "Property type", value: d.type },
          { label: "Plot size", value: d.plotSize },
          { label: "Number of plots", value: `${d.plots} plots` },
          { label: "Total site area", value: d.area },
          { label: "Listed price / plot", value: naira(d.price) },
          { label: "Submitted title", value: d.title },
          { label: "Location", value: d.address, wide: true },
        ]}
      />
      <p className="mt-6 text-sm text-body">{d.description}</p>
    </Panel>
  );
}

/**
 * Documents table. Opening a document marks it "Reviewed" on screen, so the
 * reviewer can see what they've checked.
 * TODO: when the backend returns a file URL (doc.url), Open will show the real file.
 */
function Documents({ s, isPending }) {
  const toast = useToast();
  const [docs, setDocs] = useState(s.documents);
  useEffect(() => setDocs(s.documents), [s.documents]);

  const open = (doc) => {
    if (doc.url) window.open(doc.url, "_blank", "noopener");
    else toast(`${doc.file} would open here once the backend serves files.`);
    setDocs((list) => list.map((d) => (d.file === doc.file ? { ...d, reviewed: true } : d)));
  };

  const columns = [
    { key: "name", header: "Document", render: (d) => <Stacked main={d.name} sub={d.file} /> },
    { key: "file", header: "File", render: (d) => `PDF · ${d.size}` },
    { key: "review", header: "Review", render: (d) => (d.reviewed ? <StatusBadge status="reviewed" /> : <StatusBadge tone="grey">Not opened</StatusBadge>) },
    {
      key: "action",
      header: "Action",
      render: (d) => (
        <button type="button" onClick={() => open(d)} className="inline-flex items-center gap-1 font-semibold text-brand-600 hover:underline">
          Open <ArrowUpRight className="h-4 w-4" />
        </button>
      ),
    },
  ];

  const reviewedCount = docs.filter((d) => d.reviewed).length;
  return (
    <Panel
      title="Submitted documents"
      subtitle={`${docs.length} files · Uploaded ${fullDate(s.submittedAt)} by ${s.submittedBy}${isPending ? ` · ${reviewedCount} of ${docs.length} opened` : ""}`}
      action={
        <button type="button" onClick={() => toast(`Preparing ${docs.length} files for download…`)} className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600 hover:underline">
          Download all <Download className="h-4 w-4" />
        </button>
      }
      flush
    >
      <DataTable columns={columns} rows={docs} rowKey="file" minWidth={560} />
    </Panel>
  );
}

function CompanyCard({ s }) {
  const c = s.company;
  return (
    <Panel title="Submitting company" action={<StatusBadge status={c.status} />}>
      <dl className="space-y-4 text-sm">
        <div>
          <dt className="text-body">Company</dt>
          <dd className="mt-1 font-semibold text-ink">{c.name} · {c.id}</dd>
        </div>
        <div>
          <dt className="text-body">Submitted by</dt>
          <dd className="mt-1 font-semibold text-ink">{s.submittedBy} · Company administrator</dd>
        </div>
        <div>
          <dt className="text-body">Platform standing</dt>
          <dd className="mt-1 font-semibold text-ink">{companyStanding[c.status]}</dd>
        </div>
      </dl>
      <Link to={`/superadmin/companies/${c.id}`} className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-600 hover:underline">
        Open company governance <ArrowRight className="h-4 w-4" />
      </Link>
    </Panel>
  );
}

function DecisionArea({ s, onDecided }) {
  const isPending = s.moderation === "pending";
  const [checks, setChecks] = useState(s.checklist ?? {});
  const [category, setCategory] = useState("");
  const [reason, setReason] = useState("");
  const [rejectTouched, setRejectTouched] = useState(false);
  const approve = useAction(superAdminApi.approveSubmission);
  const reject = useAction(superAdminApi.rejectSubmission);

  const items = s.checklistItems;
  const done = items.filter((i) => checks[i.key]).length;
  const allChecked = done === items.length;
  const canApprove = isPending && allChecked && !s.approvalBlocked;

  const rejectErrors = {
    category: !category && "Choose a reason category.",
    reason: reason.trim().length < 10 && "Explain the issue in at least 10 characters.",
  };

  const handleApprove = async () => {
    if (await approve.run(s.id, { checklist: checks })) onDecided(`${s.name} approved. It stays unpublished until publication changes.`);
  };

  const handleReject = async () => {
    setRejectTouched(true);
    if (rejectErrors.category || rejectErrors.reason) return;
    if (await reject.run(s.id, { category, reason })) onDecided(`${s.name} rejected. The company has been sent your reason.`);
  };

  const readiness = s.approvalBlocked
    ? { tone: "red", text: "Company not in active standing" }
    : allChecked
      ? { tone: "green", text: "Ready for platform decision" }
      : { tone: "gold", text: `${items.length - done} check${items.length - done === 1 ? "" : "s"} left before approval` };

  return (
    <>
      <Panel title="Review checklist" subtitle={`${done} of ${items.length} checks complete`} action={<ShieldCheck className={`h-5 w-5 ${allChecked ? "text-brand-600" : "text-body/50"}`} aria-hidden />}>
        <ul className="space-y-3">
          {items.map((item) => (
            <li key={item.key}>
              <label className={`flex items-start gap-3 text-sm text-ink ${isPending ? "cursor-pointer" : ""}`}>
                <input
                  type="checkbox"
                  className="peer sr-only"
                  checked={Boolean(checks[item.key])}
                  disabled={!isPending}
                  onChange={(e) => setChecks((c) => ({ ...c, [item.key]: e.target.checked }))}
                />
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border border-line bg-white peer-checked:border-brand-600 peer-checked:bg-brand-600 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand-600">
                  {checks[item.key] && <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />}
                </span>
                {item.label}
              </label>
            </li>
          ))}
        </ul>
        {s.checklistBy && <p className="mt-4 text-xs text-body">Reviewed by {s.checklistBy.name} · {dayMonth(s.checklistBy.at)}, {timeWAT(s.checklistBy.at)} WAT</p>}
      </Panel>

      {!isPending ? (
        <Panel title="Decision recorded">
          <StatusBadge status={s.moderation} />
          {s.decision && <p className="mt-3 text-sm text-body">By {s.decision.by} · {fullDateTime(s.decision.at)}</p>}
          {s.decisionReason && <p className="mt-3 text-sm text-ink">{s.decisionReason}</p>}
          {s.moderation === "approved" && (
            <p className="mt-3 text-sm text-body">Publication: <span className="font-semibold text-ink">{s.publication === "published" ? "Published" : "Unpublished"}</span></p>
          )}
        </Panel>
      ) : (
        <Panel title="Record a decision" subtitle="Your decision applies to this submission only.">
          <StatusBadge tone={readiness.tone}>{readiness.text}</StatusBadge>
          <p className="mt-3 text-sm text-body">
            {s.approvalBlocked ?? "Approval makes the property eligible for publication. It does not publish the listing."}
          </p>
          <Button variant="primary" icon={Check} className="mt-4" disabled={!canApprove || reject.busy} loading={approve.busy} onClick={handleApprove}>
            Approve submission
          </Button>
          {!allChecked && !s.approvalBlocked && <p className="mt-2 text-xs text-body">Tick every check above to enable approval.</p>}
          <div className="mt-3"><FormError>{approve.error}</FormError></div>

          <div className="mt-5 space-y-3 border-t border-line pt-5">
            <p className="text-sm font-semibold text-ink">Rejection reason</p>
            <Select value={category} onChange={setCategory} options={s.rejectionCategories} placeholder="Select reason category" />
            {rejectTouched && rejectErrors.category && <p className="text-xs text-red-600">{rejectErrors.category}</p>}
            <Field
              multiline
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Explain the issue and what the company must correct…"
              error={rejectTouched ? rejectErrors.reason || undefined : undefined}
              hint="Required for rejection. Shared with the submitting company and retained in the audit log."
              aria-label="Rejection details"
            />
            <FormError>{reject.error}</FormError>
            <Button variant="danger" icon={X} loading={reject.busy} disabled={approve.busy} onClick={handleReject}>
              Reject submission
            </Button>
          </div>
        </Panel>
      )}
    </>
  );
}