import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowRight, Ban, CircleCheck, Pencil, UserPlus } from "lucide-react";
import { superAdminApi } from "../../context/superadmin/superAdminApi";
import { useAction, useRequest } from "../../context/superadmin/hooks";
import { Breadcrumbs, Button, DetailList, ErrorState, LoadingState, Panel, StatCard, StatGrid, StatusBadge } from "../../components/dashboard/ui";
import { Tabs } from "../../components/dashboard/controls";
import { DataTable, Stacked } from "../../components/dashboard/DataTable";
import { ReasonDialog } from "../../components/dashboard/Modal";
import { CompanyFormModal } from "../../components/superadmin/CompanyFormModal";
import { InviteAdminModal } from "../../components/superadmin/InviteAdminModal";
import { useToast } from "../../components/dashboard/useToast";
import { useRefreshBadges } from "../../context/superadmin/useRefreshBadges";
import { dayMonth, fullDate, fullDateTime, timeWAT } from "../../utils/format";

const SUBMISSION_FILTERS = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "restricted", label: "Rejected & archived" },
];
const linkCls = "inline-flex items-center gap-1 whitespace-nowrap font-semibold text-brand-600 hover:underline";

export default function CompanyDetailPage() {
  const { companyId } = useParams();
  const { data, loading, error, reload } = useRequest(superAdminApi.getCompany, companyId);

  if (loading && !data) return <LoadingState label="Loading company…" />;
  if (error && !data) return <ErrorState message={error} onRetry={reload} />;
  return <CompanyDetail key={companyId} data={data} reload={reload} />;
}

function CompanyDetail({ data, reload }) {
  const { company: c, stats, admins, submissions, audit } = data;
  const toast = useToast();
  const refreshBadges = useRefreshBadges();
  const [tab, setTab] = useState("overview");
  const [submissionFilter, setSubmissionFilter] = useState("all");
  const [dialog, setDialog] = useState(null); // "edit" | "status" | "invite"

  const update = useAction(superAdminApi.updateCompany);
  const setStatus = useAction(superAdminApi.setCompanyStatus);
  const invite = useAction(superAdminApi.inviteAdmin);
  const resend = useAction(superAdminApi.resendInvite);

  const suspended = c.status === "suspended";
  const nextStatus = c.status === "active" ? "suspended" : "active";
  const pending = submissions.filter((p) => p.moderation === "pending");
  const close = () => {
    setDialog(null);
    [update, setStatus, invite].forEach((a) => a.clearError());
  };

  const showSubmissions = (filter) => {
    setSubmissionFilter(filter);
    setTab("submissions");
  };

  const saveDetails = async (values) => {
    const ok = await update.run(c.id, values);
    if (ok) { toast("Company details saved"); reload(); }
    return ok;
  };

  const changeStatus = async (reason) => {
    const ok = await setStatus.run(c.id, { status: nextStatus, reason });
    if (ok) {
      toast(nextStatus === "suspended" ? `${c.name} suspended. Its administrators have lost access.` : `${c.name} is now active.`);
      reload();
      refreshBadges();
    }
    return ok;
  };

  const sendInvite = async (body) => {
    const ok = await invite.run({ ...body, companyId: c.id });
    if (ok) { toast(`Invitation sent to ${body.email}`); reload(); }
    return ok;
  };

  const resendInvite = async (admin) => {
    if (await resend.run(admin.id)) { toast(`Invitation resent to ${admin.email}`); reload(); }
    else toast("Couldn't resend the invitation. Please try again.", "error");
  };

  const adminColumns = [
    { key: "name", header: "Administrator", render: (a) => <Stacked main={a.name} sub={a.email} /> },
    { key: "role", header: "Role & scope", render: () => <Stacked main="Company administrator" sub={`${c.name} only`} strong={false} /> },
    { key: "access", header: "Access", render: (a) => <StatusBadge status={a.access} /> },
    {
      key: "last",
      header: "Last active",
      render: (a) => (a.access === "invited" ? `Expires ${fullDate(a.expiresAt)}` : a.lastActive ? `${dayMonth(a.lastActive)} · ${timeWAT(a.lastActive)} WAT` : "–"),
    },
    {
      key: "manage",
      header: "Manage",
      render: (a) =>
        a.access === "invited" ? (
          <button type="button" onClick={() => resendInvite(a)} disabled={resend.busy} className={linkCls}>
            Resend invite <ArrowRight className="h-4 w-4" />
          </button>
        ) : (
          <Link to={`/superadmin/admins?admin=${a.id}`} className={linkCls}>
            Manage access <ArrowRight className="h-4 w-4" />
          </Link>
        ),
    },
  ];

  const submissionColumns = [
    { key: "name", header: "Submission", render: (p) => <Stacked main={p.name} sub={p.id} /> },
    { key: "location", header: "Location", render: (p) => p.location },
    { key: "submitted", header: "Submitted", render: (p) => `${dayMonth(p.submittedAt)} · ${timeWAT(p.submittedAt)}` },
    { key: "moderation", header: "Moderation", render: (p) => <StatusBadge status={p.moderation} /> },
    {
      key: "action",
      header: "Action",
      render: (p) => (
        <Link to={`/superadmin/moderation/${p.id}`} className={linkCls}>
          {p.moderation === "pending" ? "Review" : "View"} <ArrowRight className="h-4 w-4" />
        </Link>
      ),
    },
  ];

  const filteredSubmissions = submissions.filter((p) =>
    submissionFilter === "all" ? true
      : submissionFilter === "restricted" ? ["rejected", "archived"].includes(p.moderation)
        : p.moderation === submissionFilter,
  );

  const adminsPanel = (
    <Panel
      title="Associated company administrators"
      action={<Button icon={UserPlus} onClick={() => setDialog("invite")} disabled={suspended} title={suspended ? "Reactivate the company to invite administrators" : undefined}>Invite administrator</Button>}
      flush
    >
      <DataTable columns={adminColumns} rows={admins} empty="No administrators yet. Invite one to get started." />
    </Panel>
  );

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: "Companies", to: "/superadmin/companies" }, { label: c.name }, { label: "Governance" }]} />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">Platform governance</p>
          <h1 className="mt-2 text-3xl tracking-tight text-ink sm:text-[34px]">{c.name}</h1>
          <p className="mt-2 text-[15px] text-body">{c.id} · Company governance and platform standing</p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-3">
          <Button icon={Pencil} onClick={() => setDialog("edit")}>Edit company</Button>
          {nextStatus === "suspended" ? (
            <Button variant="danger" icon={Ban} onClick={() => setDialog("status")}>Suspend company</Button>
          ) : (
            <Button variant="primary" icon={CircleCheck} onClick={() => setDialog("status")}>{suspended ? "Reactivate company" : "Approve company"}</Button>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 text-sm text-body">
        <StatusBadge status={c.status} />
        {c.verified ? <StatusBadge status="verified">Company verified</StatusBadge> : <StatusBadge status="pending">Verification pending</StatusBadge>}
        <span>
          Registered {fullDate(c.joinedAt)}
          {c.lastReviewed ? ` · Last reviewed by ${c.lastReviewed.by}, ${fullDate(c.lastReviewed.at)}` : " · Not reviewed yet"}
        </span>
      </div>

      <Tabs
        label="Company sections"
        value={tab}
        onChange={setTab}
        tabs={[
          { value: "overview", label: "Document overview" },
          { value: "admins", label: "Administrator access", count: stats.admins },
          { value: "submissions", label: "Submissions", count: stats.properties },
          { value: "audit", label: "Audit history" },
        ]}
      />

      {tab === "overview" && (
        <>
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
            <Panel title="Company information" subtitle="Registered details held by the platform">
              <DetailList
                items={[
                  { label: "Legal company name", value: c.legalName },
                  { label: "Registration number", value: c.rcNumber },
                  { label: "Company email", value: c.email },
                  { label: "Contact number", value: c.phone },
                  { label: "Registered address", value: c.address, wide: true },
                ]}
              />
            </Panel>
            <Panel title="Platform standing">
              <DetailList
                columns={1}
                items={[
                  { label: "Company access", value: suspended ? "Restricted · Administrators suspended" : `Enabled · ${stats.activeAdmins} active administrators` },
                  { label: "Submission eligibility", value: c.status === "active" ? "New submissions permitted" : "Approvals blocked until active" },
                  { label: "Registration verification", value: c.verified ? `Reviewed · ${fullDate(c.joinedAt)}` : "In progress" },
                ]}
              />
              <p className="mt-5 text-sm text-body">Suspension restricts access and submissions; it does not automatically remove approved properties.</p>
            </Panel>
          </div>

          <StatGrid>
            <StatCard label="Company properties" value={stats.properties} detail={`${stats.published} published · ${stats.approvedUnpublished} approved, unpublished`} onClick={() => showSubmissions("all")} />
            <StatCard label="Pending submissions" value={stats.pending} tone="dark" detail={pending.map((p) => p.name.split(" ")[0]).join(", ") || "Nothing waiting"} onClick={() => showSubmissions("pending")} />
            <StatCard label="Restricted properties" value={stats.rejected + stats.archived} detail={`${stats.rejected} rejected · ${stats.archived} archived`} onClick={() => showSubmissions("restricted")} />
            <StatCard label="Associated administrators" value={stats.admins} detail={`${stats.activeAdmins} active · ${stats.invitedAdmins} invitation pending`} onClick={() => setTab("admins")} />
          </StatGrid>

          {adminsPanel}

          <Panel
            title="Property submission overview"
            subtitle={`${stats.pending} pending · ${stats.published} published · ${stats.approvedUnpublished} approved, unpublished · ${stats.rejected} rejected`}
            action={
              <Link to={`/superadmin/properties?companyId=${c.id}`} className={`${linkCls} text-sm`}>
                View all {stats.properties} properties <ArrowRight className="h-4 w-4" />
              </Link>
            }
            flush
          >
            <DataTable columns={submissionColumns} rows={(pending.length ? pending : submissions).slice(0, 5)} empty="No submissions yet." />
          </Panel>
        </>
      )}

      {tab === "admins" && adminsPanel}

      {tab === "submissions" && (
        <Panel title="Submissions" subtitle={`${filteredSubmissions.length} of ${submissions.length} properties`} flush>
          <div className="flex flex-wrap gap-2 px-5 pb-5 sm:px-6">
            {SUBMISSION_FILTERS.map((f) => (
              <button
                key={f.value}
                type="button"
                onClick={() => setSubmissionFilter(f.value)}
                aria-pressed={submissionFilter === f.value}
                className={`h-9 rounded-full border px-4 text-sm font-medium ${submissionFilter === f.value ? "border-brand-600 bg-brand-600 text-white" : "border-line bg-white text-ink hover:border-brand-600"}`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <DataTable columns={submissionColumns} rows={filteredSubmissions} empty="No submissions in this group." />
        </Panel>
      )}

      {tab === "audit" && (
        <Panel title="Audit history" subtitle={`Every recorded action scoped to ${c.name}`} flush>
          <DataTable
            rows={audit}
            empty="No recorded actions for this company yet."
            columns={[
              { key: "at", header: "Time (WAT)", render: (e) => fullDateTime(e.at) },
              { key: "actor", header: "Actor", render: (e) => <Stacked main={e.actor} sub={e.actorRole} /> },
              { key: "action", header: "Action", render: (e) => <Stacked main={e.action} sub={e.stateChange} strong={false} /> },
              { key: "target", header: "Target", render: (e) => <Stacked main={e.target} sub={e.targetSub} strong={false} /> },
              { key: "outcome", header: "Outcome", render: (e) => <StatusBadge status={e.outcome} /> },
            ]}
          />
        </Panel>
      )}

      <CompanyFormModal open={dialog === "edit"} onClose={close} company={c} onSubmit={saveDetails} busy={update.busy} error={update.error} />
      <InviteAdminModal open={dialog === "invite"} onClose={close} company={c} onInvite={sendInvite} busy={invite.busy} error={invite.error} />
      <ReasonDialog
        open={dialog === "status"}
        onClose={close}
        title={nextStatus === "suspended" ? `Suspend ${c.name}?` : `${suspended ? "Reactivate" : "Approve"} ${c.name}?`}
        description={
          nextStatus === "suspended"
            ? "Its administrators lose access and new submissions are blocked. Published properties stay as they are."
            : "The company returns to active standing and can submit properties for approval again."
        }
        confirmLabel={nextStatus === "suspended" ? "Suspend company" : suspended ? "Reactivate company" : "Approve company"}
        variant={nextStatus === "suspended" ? "danger" : "primary"}
        onConfirm={changeStatus}
        busy={setStatus.busy}
        error={setStatus.error}
      />
    </div>
  );
}