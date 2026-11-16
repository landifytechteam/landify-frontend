import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Info, Lock } from "lucide-react";
import { superAdminApi } from "../../context/superadmin/superAdminApi";
import { useAction, useRequest } from "../../context/superadmin/hooks";
import { Button, ErrorState, FormError, LoadingState, PageHeader, Panel, StatusBadge } from "../../components/dashboard/ui";
import { LockIcon, Select, Tabs, Toggle } from "../../components/dashboard/controls";
import { useToast } from "../../components/dashboard/useToast";
import { fullDateTime } from "../../utils/format";

// Every setting on the page. `options` makes it a dropdown, otherwise it's a switch.
const SECTIONS = [
  {
    tab: "governance",
    title: "Administrator security",
    subtitle: "Secure platform and company administrator accounts.",
    rows: [
      { key: "requireMfa", label: "Require multi-factor authentication", help: "All administrators must verify a second factor at sign-in." },
      { key: "idleTimeout", label: "Idle session timeout", help: "End inactive administrator sessions automatically.", options: [15, 30, 60, 120].map((n) => ({ value: n, label: `${n} minutes` })) },
      { key: "failedSignInLimit", label: "Failed sign-in limit", help: "Temporarily lock access after repeated failed attempts.", options: [3, 5, 10].map((n) => ({ value: n, label: `${n} attempts` })) },
      { key: "invitationValidity", label: "Invitation validity", help: "Unaccepted administrator invitations expire after this period.", options: [3, 7, 14, 30].map((n) => ({ value: n, label: `${n} days` })) },
      { key: "terminateOnRemoval", label: "Terminate sessions on access removal", help: "Suspension or revocation immediately ends active sessions." },
    ],
  },
  {
    tab: "governance",
    title: "Company & property governance",
    subtitle: "Platform rules, not company operational settings.",
    rows: [
      { key: "requireCompanyVerification", label: "Require company verification", help: "Registration evidence must be reviewed before activation." },
      { key: "activeCompanyForApproval", label: "Active company required for approval", help: "Block property approvals while a company is under review or suspended." },
      { key: "requireReasons", label: "Require rejection and restriction reasons", help: "Capture a reason for rejected submissions and restricted access." },
      { key: "approvalSeparateFromPublication", label: "Keep approval separate from publication", help: "An approval never automatically publishes a property." },
      { key: "defaultInvitationRole", label: "Default invitation role", help: "New company invitations receive a single-company scope.", text: true },
    ],
  },
  {
    tab: "audit",
    title: "Audit & oversight",
    subtitle: "Accountability across all companies and administrators.",
    rows: [
      { key: "auditRetention", label: "Audit retention", help: "Retain governance, moderation and access-change events.", options: [90, 180, 365, 730].map((n) => ({ value: n, label: `${n} days` })) },
      { key: "appendOnlyAudit", label: "Append-only audit record", help: "Recorded events cannot be edited or deleted by administrators." },
      { key: "notifyHighImpact", label: "Notify on high-impact governance actions", help: "Alert super administrators to suspensions and access revocations." },
    ],
  },
  {
    tab: "notifications",
    title: "Administrator notifications",
    subtitle: "What super administrators are alerted about.",
    rows: [
      { key: "notifyNewSubmissions", label: "New property submissions", help: "Alert when a company submits or resubmits a property for review." },
      { key: "notifySlaBreach", label: "Review older than 48 hours", help: "Alert when a pending submission passes the review target." },
      { key: "notifyHighImpact", label: "High-impact governance actions", help: "Suspensions, revocations and policy changes." },
      { key: "dailyDigest", label: "Daily digest email", help: "One summary email at 08:00 WAT instead of individual alerts." },
    ],
  },
];
const TAB_LABEL = { governance: "Governance & security configuration", audit: "Audit & retention configuration", notifications: "Administrator notification configuration" };
const allRows = SECTIONS.flatMap((s) => s.rows);
const labelFor = (key) => allRows.find((r) => r.key === key)?.label;

export default function SystemSettingsPage() {
  const { data, loading, error, reload } = useRequest(superAdminApi.getSettings, {});
  if (loading && !data) return <LoadingState label="Loading settings…" />;
  if (error && !data) return <ErrorState message={error} onRetry={reload} />;
  return <SettingsForm saved={data} />;
}

function SettingsForm({ saved: initial }) {
  const toast = useToast();
  const [saved, setSaved] = useState(initial); // what the server has
  const [draft, setDraft] = useState(initial.values); // what's on screen
  const [tab, setTab] = useState("governance");
  const save = useAction(superAdminApi.updateSettings);

  const locked = saved.locked;
  // Only the settings that differ from the saved version get sent
  const changes = useMemo(
    () => Object.fromEntries(Object.entries(draft).filter(([key, value]) => saved.values[key] !== value)),
    [draft, saved],
  );
  const changeCount = Object.keys(changes).length;
  const dirty = changeCount > 0;

  // Warn before closing the tab with unsaved changes
  useEffect(() => {
    if (!dirty) return;
    const warn = (e) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const setValue = (key, value) => {
    setDraft((d) => ({ ...d, [key]: value }));
    save.clearError();
  };

  const discard = () => {
    setDraft(saved.values);
    toast("Changes discarded");
  };

  const submit = async () => {
    const result = await save.run(changes);
    if (result) {
      setSaved(result);
      setDraft(result.values);
      toast(`${changeCount} setting${changeCount === 1 ? "" : "s"} saved and recorded in the audit log`);
    }
  };

  const actions = (
    <>
      <Button onClick={discard} disabled={!dirty || save.busy}>Discard changes</Button>
      <Button variant="primary" icon={Check} onClick={submit} disabled={!dirty} loading={save.busy}>Save changes</Button>
    </>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Platform governance"
        title="System settings"
        subtitle="Set the governance and security standards applied across the entire LANDIFY platform."
        actions={actions}
      />

      <Tabs
        label="Settings sections"
        value={tab}
        onChange={setTab}
        tabs={[
          { value: "governance", label: "Governance & security" },
          { value: "audit", label: "Audit & retention" },
          { value: "notifications", label: "Administrator notifications" },
        ]}
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
        <div className="min-w-0 space-y-6">
          {SECTIONS.filter((s) => s.tab === tab).map((section) => (
            <section key={section.title} className="overflow-hidden rounded-xl border border-line bg-white">
              <div className="border-b border-line px-5 py-5 sm:px-6">
                <h2 className="text-lg font-semibold text-ink">{section.title}</h2>
                <p className="mt-1 text-sm text-body">{section.subtitle}</p>
              </div>
              <ul className="divide-y divide-line">
                {section.rows.map((row) => (
                  <SettingRow key={row.key} row={row} value={draft[row.key]} changed={row.key in changes} locked={locked.includes(row.key)} onChange={(v) => setValue(row.key, v)} />
                ))}
              </ul>
            </section>
          ))}
          <FormError>{save.error}</FormError>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-body">
              {dirty ? (
                <span className="font-semibold text-[#8a6a10]">{changeCount} unsaved change{changeCount === 1 ? "" : "s"}: {Object.keys(changes).map(labelFor).join(", ")}</span>
              ) : (
                "No unsaved changes"
              )}{" "}
              · {TAB_LABEL[tab]}
            </p>
            <div className="flex shrink-0 flex-col-reverse gap-3 sm:flex-row">{actions}</div>
          </div>
        </div>

        <aside className="space-y-6">
          <Panel title="Effective platform policy" action={dirty ? <StatusBadge status="unsaved">Unsaved</StatusBadge> : <StatusBadge status="saved">Saved</StatusBadge>}>
            <dl className="space-y-4 text-sm">
              <Fact label="Applies to" value={`All ${saved.appliesTo.companies} companies · ${saved.appliesTo.adminAccounts} admin accounts`} />
              <Fact label="Administrator permissions" value="Platform-level changes only" />
              <Fact label="Last changed by" value={saved.meta.lastChangedBy} />
              <Fact label="Last saved" value={fullDateTime(saved.meta.lastSavedAt)} />
              <Fact label="Time zone" value={saved.meta.timeZone} />
            </dl>
            <Link to="/superadmin/audit?scope=Platform-wide&range=all" className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-brand-600 hover:underline">
              View configuration audit history <ArrowRight className="h-4 w-4" />
            </Link>
          </Panel>

          <div className="flex gap-3 rounded-xl border border-gold-500/40 bg-[#fbf6e6] px-5 py-4">
            <Info className="mt-0.5 h-5 w-5 shrink-0 text-[#8a6a10]" aria-hidden />
            <div className="text-sm">
              <p className="font-semibold text-ink">Changes apply platform-wide</p>
              <p className="mt-0.5 text-body">Security and governance changes affect every company. Review the policy before saving; all changes are captured in the audit log.</p>
            </div>
          </div>

          <Panel title="Protected governance rules">
            <Lock className="h-6 w-6 text-brand-600" strokeWidth={1.6} aria-hidden />
            <p className="mt-3 text-sm text-body">Locked rules preserve the separation between company access, property approval and publication. They cannot be disabled in this console.</p>
            <ul className="mt-3 space-y-1.5 text-xs text-body">
              {locked.map((key) => <li key={key}>· {labelFor(key)}</li>)}
            </ul>
          </Panel>
        </aside>
      </div>
    </div>
  );
}

function SettingRow({ row, value, changed, locked, onChange }) {
  let control;
  if (row.text) {
    control = <span className="flex h-11 w-full items-center rounded-md border border-line bg-white px-3.5 text-sm text-ink sm:w-44">{value}</span>;
  } else if (row.options) {
    control = <Select value={value} onChange={(v) => onChange(Number(v))} options={row.options} disabled={locked} className="w-full sm:w-44" />;
  } else {
    control = <Toggle checked={value} onChange={onChange} label={row.label} locked={locked} />;
  }

  return (
    <li className={`flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 ${changed ? "bg-[#fbf6e6]/70" : ""}`}>
      <div className="min-w-0">
        <p className="flex items-center gap-2 text-sm font-semibold text-ink">
          {row.label} {locked && <LockIcon />}
          {changed && <span className="rounded-full bg-[#f6ecc9] px-2 py-0.5 text-[11px] font-medium text-[#8a6a10]">Changed</span>}
        </p>
        <p className="mt-0.5 text-sm text-body">{row.help}</p>
      </div>
      <div className="shrink-0">{control}</div>
    </li>
  );
}

function Fact({ label, value }) {
  return (
    <div>
      <dt className="text-body">{label}</dt>
      <dd className="mt-1 font-semibold text-ink">{value}</dd>
    </div>
  );
}