import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ArrowRight, Download, PauseCircle, PlayCircle, Send, Trash2, UserX } from "lucide-react";
import { superAdminApi } from "../../context/superadmin/superAdminApi";
import { useAction, useListState, useRequest } from "../../context/superadmin/hooks";
import { Button, ErrorState, FormError, PageHeader, Panel, Pill, StatCard, StatGrid, StatusBadge } from "../../components/dashboard/ui";
import { Field, FilterBar, SearchInput, Select } from "../../components/dashboard/controls";
import { DataTable, Pagination, Stacked } from "../../components/dashboard/DataTable";
import { useToast } from "../../components/dashboard/useToast";
import { downloadCsv } from "../../utils/csv";
import { dayMonth, fullDate, fullDateTime, timeWAT, yearOf } from "../../utils/format";

const ACCESS_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "invited", label: "Invited" },
  { value: "suspended", label: "Suspended" },
  { value: "revoked", label: "Revoked" },
];
const groupLabel = { "": "All accounts", active: "Active accounts", invited: "Pending invitations", restricted: "Suspended and revoked accounts" };
const INVITE_VALIDITY_DAYS = 7; // TODO: read from system settings (invitationValidity) if the backend returns it here

export default function AdminAccessPage() {
  const toast = useToast();
  const [searchParams] = useSearchParams();
  const list = useListState({ search: "", companyId: "", access: "", group: "" });
  const { data, loading, error, reload } = useRequest(superAdminApi.getAdmins, list.params);
  const platform = useRequest(superAdminApi.getPlatformAdmins, {});
  const resend = useAction(superAdminApi.resendInvite);
  const [selected, setSelected] = useState(null);

  // Pick the account named in the URL (?admin=ADM-01, from the company page), else the first row
  const wantedId = searchParams.get("admin");
  useEffect(() => {
    if (!wantedId) return;
    superAdminApi.getAdmins({ pageSize: 1000 }).then((all) => {
      const match = all.items.find((a) => a.id === wantedId);
      if (match) setSelected(match);
    });
  }, [wantedId]);
  // Until a row is clicked, show the first row (unless the URL asked for a specific account)
  const shownAdmin = selected ?? (wantedId ? null : data?.items[0] ?? null);

  const s = data?.summary;
  const group = list.filters.group;
  const filterByGroup = (value) => list.setFilter("group", group === value ? "" : value);

  const resendInvite = async (admin) => {
    if (await resend.run(admin.id)) {
      toast(`Invitation resent to ${admin.email}. It now expires in ${INVITE_VALIDITY_DAYS} days.`);
      reload();
    } else toast("Couldn't resend the invitation. Please try again.", "error");
  };

  const exportCsv = async () => {
    const all = await superAdminApi.getAdmins({ ...list.params, page: 1, pageSize: 1000 });
    downloadCsv("landify-access-register.csv", [
      { header: "Admin ID", value: (a) => a.id },
      { header: "Name", value: (a) => a.name },
      { header: "Email", value: (a) => a.email },
      { header: "Company", value: (a) => a.companyName },
      { header: "Access", value: (a) => a.access },
      { header: "Last active / expiry (WAT)", value: (a) => (a.access === "invited" ? `Expires ${fullDateTime(a.expiresAt)}` : a.lastActive ? fullDateTime(a.lastActive) : "") },
    ], all.items);
    toast(`Exported ${all.items.length} accounts`);
  };

  const columns = [
    { key: "name", header: "Administrator", render: (a) => <Stacked main={a.name} sub={a.email} /> },
    { key: "company", header: "Company scope", render: (a) => a.companyName },
    { key: "role", header: "Role", render: () => "Company admin" },
    { key: "access", header: "Access", render: (a) => <StatusBadge status={a.access} /> },
    {
      key: "last",
      header: "Last active / expiry",
      render: (a) => {
        const at = a.access === "invited" ? a.expiresAt : a.lastActive;
        if (!at) return "–";
        return <Stacked main={`${a.access === "invited" ? "Expires " : ""}${dayMonth(at)}${a.access === "invited" ? "" : ` · ${timeWAT(at)}`}`} sub={`${yearOf(at)} · WAT`} strong={false} />;
      },
    },
    {
      key: "action",
      header: "Action",
      render: (a) => (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (a.access === "invited") resendInvite(a);
            else setSelected(a);
          }}
          className="inline-flex items-center gap-1 font-semibold text-brand-600 hover:underline"
        >
          {a.access === "invited" ? "Resend" : "Manage"} <ArrowRight className="h-4 w-4" />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Platform governance"
        title="Admin access"
        subtitle="Control who can administer LANDIFY and the company scope of every account."
        actions={<Button icon={Download} onClick={exportCsv} disabled={!data}>Export access register</Button>}
      />

      <StatGrid>
        <StatCard label="All company administrators" value={s && s.active + s.invited + s.restricted} detail={s && `Plus ${s.platform} super administrators · All companies`} active={group === ""} onClick={() => list.setFilter("group", "")} />
        <StatCard label="Active company administrators" value={s?.active} detail="Company-scoped permissions only" active={group === "active"} onClick={() => filterByGroup("active")} />
        <StatCard label="Pending invitations" value={s?.invited} detail={s?.invitedCompanies.join(" · ") || "None waiting"} active={group === "invited"} onClick={() => filterByGroup("invited")} />
        <StatCard label="Restricted company accounts" value={s?.restricted} detail={s && `${s.suspended} suspended · ${s.revoked} revoked`} active={group === "restricted"} onClick={() => filterByGroup("restricted")} />
      </StatGrid>

      {error && !data ? (
        <ErrorState message={error} onRetry={reload} />
      ) : (
        <Panel title="Company administrator directory" subtitle={`${data?.total ?? "–"} accounts · ${groupLabel[group]} · Company role and scope are governed at platform level`} flush>
          <FilterBar>
            <SearchInput value={list.filters.search} onChange={(v) => list.setFilter("search", v)} placeholder="Search administrator name or email" />
            <Select value={list.filters.companyId} onChange={(v) => list.setFilter("companyId", v)} options={data?.companies ?? []} placeholder="All companies" className="lg:w-48" />
            <Select value={list.filters.access} onChange={(v) => list.setFilter("access", v)} options={ACCESS_OPTIONS} placeholder="All access states" className="lg:w-44" />
          </FilterBar>
          <DataTable columns={columns} rows={data?.items} loading={loading} onRowClick={setSelected} selectedKey={shownAdmin?.id} empty="No administrators match these filters." />
          <Pagination page={list.page} pageSize={list.pageSize} total={data?.total ?? 0} onChange={list.setPage} noun="company administrator accounts" />
        </Panel>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <InviteForm companies={data?.companies ?? []} onInvited={reload} />
        <ManageAccount
          key={shownAdmin?.id ?? "none"} // a different account gets a fresh form (empty reason, no errors)
          admin={shownAdmin}
          onResend={resendInvite}
          onChanged={(updated) => {
            setSelected({ ...shownAdmin, ...updated });
            reload();
          }}
          onDeleted={() => {
            setSelected(null);
            reload();
          }}
        />
      </div>

      <Panel title="Platform-level administrators" subtitle="Super administrator role · Unrestricted company scope" action={platform.data && <StatusBadge status="active">{platform.data.length} active</StatusBadge>} flush>
        <DataTable
          rows={platform.data}
          loading={platform.loading}
          columns={[
            { key: "name", header: "Administrator", render: (a) => <Stacked main={a.name} sub={a.email} /> },
            { key: "role", header: "Role", render: () => "Super administrator" },
            { key: "scope", header: "Scope", render: () => "All companies · Platform-wide" },
            { key: "mfa", header: "Security", render: (a) => (a.mfa ? <StatusBadge status="mfa">MFA enabled</StatusBadge> : <StatusBadge status="pending">MFA not set up</StatusBadge>) },
          ]}
        />
      </Panel>
    </div>
  );
}

function InviteForm({ companies, onInvited }) {
  const toast = useToast();
  const invite = useAction(superAdminApi.inviteAdmin);
  const [email, setEmail] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [touched, setTouched] = useState(false);

  const errors = {
    email: !/^\S+@\S+\.\S+$/.test(email) && "Enter a valid email address.",
    companyId: !companyId && "Choose a company.",
  };

  const submit = async (e) => {
    e.preventDefault();
    setTouched(true);
    if (errors.email || errors.companyId) return;
    if (await invite.run({ email: email.trim(), companyId })) {
      toast(`Invitation sent to ${email.trim()}`);
      setEmail("");
      setCompanyId("");
      setTouched(false);
      onInvited();
    }
  };

  return (
    <Panel title="Invite a company administrator" subtitle="A secure invitation grants access to one company only.">
      <form onSubmit={submit} noValidate className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_200px]">
          <Field label="Email address" type="email" value={email} onChange={(e) => { setEmail(e.target.value); invite.clearError(); }} placeholder="name@company.com" error={touched ? errors.email || undefined : undefined} />
          <div>
            <Select label="Company scope" value={companyId} onChange={(v) => { setCompanyId(v); invite.clearError(); }} options={companies} placeholder="Choose company" />
            {touched && errors.companyId && <span className="mt-1.5 block text-xs text-red-600">{errors.companyId}</span>}
          </div>
        </div>
        <div className="flex items-center justify-between gap-3 text-xs text-body">
          <Pill>Company administrator</Pill>
          <span>Expires after {INVITE_VALIDITY_DAYS} days</span>
        </div>
        <FormError>{invite.error}</FormError>
        <Button type="submit" variant="primary" icon={Send} loading={invite.busy}>Send invitation</Button>
      </form>
    </Panel>
  );
}

/** Suspend / restore / revoke one account. Every change needs a reason for the audit log. */
function ManageAccount({ admin, onChanged, onResend, onDeleted }) {
  const toast = useToast();
  const change = useAction(superAdminApi.setAdminAccess);
  const [reason, setReason] = useState("");
  const [touched, setTouched] = useState(false);
  const [confirmRevoke, setConfirmRevoke] = useState(false);

  if (!admin) {
    return (
      <Panel title="Manage selected account" subtitle="Choose an account in the directory to manage it.">
        <p className="text-sm text-body">Click any row or its Manage link.</p>
      </Panel>
    );
  }

  const apply = async (access) => {
    setTouched(true);
    if (!reason.trim()) return;
    const updated = await change.run(admin.id, { access, reason: reason.trim() });
    if (updated) {
      const verbs = { suspended: "suspended", revoked: "revoked", active: "restored" };
      toast(`${admin.name}'s access ${verbs[access]}`);
      onChanged(updated);
      setReason("");
      setTouched(false);
      setConfirmRevoke(false);
    }
  };

  const revoked = admin.access === "revoked";

  return (
    <Panel
      title="Manage selected account"
      subtitle={`${admin.name} · ${admin.companyName}`}
      action={<StatusBadge status={admin.access} />}
    >
      {revoked ? (
        <p className="text-sm text-body">This account's company role was removed. Revoked access can't be restored. Send a new invitation from the form if they need access again.</p>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-body">
            {admin.access === "invited"
              ? `Invitation expires ${fullDate(admin.expiresAt)}. You can resend it, or revoke it so it can't be accepted.`
              : "Suspension pauses access. Revocation removes this company role and ends active sessions. A reason is required for either action."}
          </p>
          <Field
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Enter an access-change reason…"
            aria-label="Access-change reason"
            error={touched && !reason.trim() ? "A reason is required." : undefined}
          />
          <FormError>{change.error}</FormError>

          {confirmRevoke ? (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4">
              <p className="text-sm font-semibold text-red-700">Revoke {admin.name}'s access? This can't be undone.</p>
              <div className="mt-3 flex flex-wrap gap-3">
                <Button variant="danger" icon={UserX} loading={change.busy} onClick={() => apply("revoked")}>Yes, revoke access</Button>
                <Button onClick={() => setConfirmRevoke(false)}>Keep access</Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap gap-3">
              {admin.access === "active" && <Button icon={PauseCircle} loading={change.busy} onClick={() => apply("suspended")}>Suspend access</Button>}
              {admin.access === "suspended" && <Button icon={PlayCircle} loading={change.busy} onClick={() => apply("active")}>Restore access</Button>}
              {admin.access === "invited" && <Button icon={Send} onClick={() => onResend(admin)}>Resend invitation</Button>}
              <Button
                variant="danger"
                icon={UserX}
                disabled={change.busy}
                onClick={() => {
                  setTouched(true);
                  if (reason.trim()) setConfirmRevoke(true);
                }}
              >
                {admin.access === "invited" ? "Revoke invitation" : "Revoke access"}
              </Button>
            </div>
          )}
        </div>
      )}
      <DeleteAccount admin={admin} onDeleted={onDeleted} />
    </Panel>
  );
}

/** Permanently delete the account (DELETE /auth/admin/users/:id). Asks for confirmation first. */
function DeleteAccount({ admin, onDeleted }) {
  const toast = useToast();
  const remove = useAction(superAdminApi.deleteUser);
  const [confirming, setConfirming] = useState(false);

  const handleDelete = async () => {
    if (await remove.run(admin.id)) {
      toast(`${admin.name}'s account was deleted`);
      onDeleted();
    }
  };

  return (
    <div className="mt-6 border-t border-line pt-5">
      {!confirming ? (
        <button type="button" onClick={() => setConfirming(true)} className="inline-flex items-center gap-2 text-sm font-semibold text-red-700 hover:underline">
          <Trash2 className="h-4 w-4" /> Delete this account permanently
        </button>
      ) : (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-semibold text-red-700">Delete {admin.name}'s account? Their sign-in is removed for good. This can't be undone.</p>
          <div className="mt-3"><FormError>{remove.error}</FormError></div>
          <div className="mt-3 flex flex-wrap gap-3">
            <Button variant="danger" icon={Trash2} loading={remove.busy} onClick={handleDelete}>Yes, delete account</Button>
            <Button onClick={() => { setConfirming(false); remove.clearError(); }}>Cancel</Button>
          </div>
        </div>
      )}
    </div>
  );
}