import { useState } from "react";
import { Bell, Eye, EyeOff, KeyRound, LockKeyhole, LogOut, Monitor, ShieldCheck, ShieldAlert, User } from "lucide-react";
import useAuth from "../../context/useAuth";
import { useAction, useRequest } from "../../context/hooks";
import { NOTIFICATION_TYPES, partnerApi } from "../../context/salespartner/partnerApi";
import { Button, ErrorState, FormError, LoadingState, PageHeader, Panel } from "../../components/dashboard/ui";
import { Field, Toggle } from "../../components/dashboard/controls";
import { Avatar } from "../../components/salespartner/shared";
import { useToast } from "../../components/dashboard/useToast";
import { Reveal } from "../../components/ui/Reveal";
import { isNigerianPhone, isStrongPassword } from "../../utils/validation";

// Left menu: each entry scrolls to its panel below
const SECTIONS = [
  { group: "Account", items: [{ id: "profile", label: "Profile", icon: User }] },
  { group: "Preferences", items: [{ id: "notifications", label: "Notifications", icon: Bell }] },
  {
    group: "Security",
    items: [
      { id: "password", label: "Change Password", icon: LockKeyhole },
      { id: "security", label: "Security Preferences", icon: ShieldCheck },
    ],
  },
];

/** /salespartner/settings: profile, notification switches, password and session. */
export default function PartnerSettingsPage() {
  const [activeId, setActiveId] = useState("profile");
  const profile = useRequest(partnerApi.getProfile, {}); // shared by the Profile and Security panels

  const jumpTo = (id) => {
    setActiveId(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" subtitle="Manage your account preferences and profile." />

      <div className="grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
        {/* Section menu. Sticky on desktop so it stays in reach while scrolling. */}
        <nav aria-label="Settings sections" className="self-start rounded-xl border border-line bg-white p-4 lg:sticky lg:top-24">
          {SECTIONS.map((section) => (
            <div key={section.group} className="mb-4 last:mb-0">
              <p className="px-2 text-[11px] font-semibold uppercase tracking-wider text-body">{section.group}</p>
              <ul className="mt-2 space-y-1">
                {section.items.map(({ id, label, icon: Icon }) => (
                  <li key={id}>
                    <button
                      type="button"
                      onClick={() => jumpTo(id)}
                      aria-current={activeId === id ? "true" : undefined}
                      className={`flex w-full items-center gap-3 rounded-md border-l-2 px-3 py-2.5 text-left text-sm transition-colors ${
                        activeId === id ? "border-gold-500 bg-brand-50 font-semibold text-brand-700" : "border-transparent text-ink hover:bg-canvas"
                      }`}
                    >
                      <Icon className="h-4 w-4 shrink-0" aria-hidden />
                      {label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className="min-w-0 space-y-6 [&_section]:scroll-mt-24">
          <div className="grid gap-6 wide:grid-cols-2">
            <ProfilePanel request={profile} />
            <NotificationsPanel />
          </div>
          <div className="grid gap-6 wide:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
            <PasswordPanel />
            <SecurityPanel profile={profile.data} />
          </div>
          <SignOutPanel />
        </div>
      </div>
    </div>
  );
}

function ProfilePanel({ request }) {
  const { user, updateUser } = useAuth();
  const toast = useToast();
  const { data, error, reload } = request;
  const save = useAction(partnerApi.updateProfile);
  const [draft, setDraft] = useState(null); // null = not editing
  const [errors, setErrors] = useState({});

  // The session has name + email; the profile endpoint adds phone and company
  const profile = { fullName: user?.fullName ?? "", email: user?.email ?? "", ...data };

  const startEditing = () => {
    setDraft({ fullName: profile.fullName, phone: profile.phone ?? "" });
    setErrors({});
    save.clearError();
  };

  const submit = async (e) => {
    e.preventDefault();
    const next = {};
    if (!draft.fullName.trim()) next.fullName = "Enter your full name.";
    if (draft.phone && !isNigerianPhone(draft.phone)) next.phone = "Enter a valid Nigerian phone number.";
    setErrors(next);
    if (Object.keys(next).length) return;

    const changes = { fullName: draft.fullName.trim(), phone: draft.phone.trim() };
    if (await save.run(changes)) {
      updateUser({ fullName: changes.fullName }); // sidebar name updates straight away
      reload();
      setDraft(null);
      toast("Profile updated.");
    }
  };

  return (
    <Panel
      id="profile"
      title="Profile"
      action={<span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-600">Sales Partner</span>}
      footer="Your role and company are managed by your Company Admin."
    >
      {error && !data ? (
        <ErrorState message={error} onRetry={reload} />
      ) : !data ? (
        <LoadingState />
      ) : (
        <form onSubmit={submit} noValidate className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar name={profile.fullName} size="lg" />
            <div className="min-w-0">
              <p className="truncate font-semibold text-ink">{profile.fullName}</p>
              <p className="truncate text-sm text-body">{profile.companyName || "No company linked yet"}</p>
            </div>
          </div>

          <FormError>{save.error}</FormError>
          <Field
            label="Full Name"
            value={draft ? draft.fullName : profile.fullName}
            onChange={(e) => setDraft((d) => ({ ...d, fullName: e.target.value }))}
            readOnly={!draft}
            error={errors.fullName}
            className={draft ? "" : "[&_input]:bg-canvas/40"}
          />
          {/* Changing email needs a new verification code, so it isn't editable here */}
          <Field label="Email Address" value={profile.email} readOnly className="[&_input]:bg-canvas/40" hint={draft ? "Contact your Company Admin to change your email." : undefined} />
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <Field
              label="Phone Number"
              type="tel"
              value={draft ? draft.phone : profile.phone || "Not added"}
              onChange={(e) => setDraft((d) => ({ ...d, phone: e.target.value }))}
              readOnly={!draft}
              error={errors.phone}
              className={`flex-1 ${draft ? "" : "[&_input]:bg-canvas/40"}`}
            />
            {draft ? (
              <div className="flex gap-2">
                <Button onClick={() => setDraft(null)}>Cancel</Button>
                <Button variant="primary" type="submit" loading={save.busy}>Save</Button>
              </div>
            ) : (
              <button
                type="button"
                onClick={startEditing}
                className="inline-flex h-11 shrink-0 items-center justify-center rounded-full bg-gold-500 px-5 text-sm font-semibold text-ink transition-colors hover:bg-gold-400"
              >
                Edit Profile
              </button>
            )}
          </div>
        </form>
      )}
    </Panel>
  );
}

function NotificationsPanel() {
  const toast = useToast();
  const { data, error, reload } = useRequest(partnerApi.getNotificationPrefs, {});
  // Switches flip instantly (optimistic); a failed save flips them back
  const [overrides, setOverrides] = useState({});
  const prefs = { ...data, ...overrides };

  const flip = async (key, value) => {
    setOverrides((o) => ({ ...o, [key]: value }));
    try {
      await partnerApi.updateNotificationPrefs({ [key]: value });
    } catch {
      setOverrides((o) => ({ ...o, [key]: !value }));
      toast("Couldn't save that setting. Try again.", "error");
    }
  };

  return (
    <Panel id="notifications" title="Notification Settings" footer="Choose which updates you'd like to receive.">
      {error && !data ? (
        <ErrorState message={error} onRetry={reload} />
      ) : !data ? (
        <LoadingState />
      ) : (
        <ul className="space-y-4">
          {NOTIFICATION_TYPES.map((n) => (
            <li key={n.key} className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="text-sm font-medium text-ink">{n.label}</p>
                <p className="text-xs text-body">{n.detail}</p>
              </div>
              <Toggle checked={Boolean(prefs[n.key])} onChange={(v) => flip(n.key, v)} label={n.label} />
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}

const EMPTY_PASSWORDS = { currentPassword: "", newPassword: "", confirmPassword: "" };

function PasswordPanel() {
  const toast = useToast();
  const change = useAction(partnerApi.changePassword);
  const [form, setForm] = useState(EMPTY_PASSWORDS);
  const [errors, setErrors] = useState({});

  const set = (name) => (e) => {
    setForm((f) => ({ ...f, [name]: e.target.value }));
    setErrors((errs) => ({ ...errs, [name]: undefined }));
  };

  const submit = async (e) => {
    e.preventDefault();
    const next = {};
    if (!form.currentPassword) next.currentPassword = "Enter your current password.";
    if (!isStrongPassword(form.newPassword)) next.newPassword = "Password doesn't meet the rule below.";
    if (form.confirmPassword !== form.newPassword) next.confirmPassword = "Passwords don't match.";
    setErrors(next);
    if (Object.keys(next).length) return;

    if (await change.run({ currentPassword: form.currentPassword, newPassword: form.newPassword })) {
      setForm(EMPTY_PASSWORDS);
      toast("Password updated.");
    }
  };

  return (
    <Panel id="password" title="Security" subtitle="Keep your account secure with a strong, unique password." action={<LockKeyhole className="h-5 w-5 text-brand-600" aria-hidden />}>
      <form onSubmit={submit} noValidate className="space-y-4">
        <FormError>{change.error}</FormError>
        <PasswordField label="Current Password" value={form.currentPassword} onChange={set("currentPassword")} error={errors.currentPassword} placeholder="Enter current password" autoComplete="current-password" />
        <div className="grid gap-4 sm:grid-cols-2">
          <PasswordField label="New Password" value={form.newPassword} onChange={set("newPassword")} error={errors.newPassword} placeholder="Enter new password" autoComplete="new-password" />
          <PasswordField label="Confirm New Password" value={form.confirmPassword} onChange={set("confirmPassword")} error={errors.confirmPassword} placeholder="Confirm new password" autoComplete="new-password" />
        </div>
        <p className="text-xs text-body">Use at least 8 characters, with upper and lower case letters and a number.</p>
        <button
          type="submit"
          disabled={change.busy}
          className="inline-flex h-11 items-center gap-2 rounded-full bg-gold-500 px-6 text-sm font-semibold text-ink transition-colors hover:bg-gold-400 disabled:opacity-60"
        >
          <KeyRound className="h-4 w-4" aria-hidden />
          {change.busy ? "Updating…" : "Update Password"}
        </button>
      </form>
    </Panel>
  );
}

/** Password input with a show/hide eye button. */
function PasswordField({ label, error, ...props }) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative">
      <Field label={label} type={visible ? "text" : "password"} error={error} className="[&_input]:pr-11" {...props} />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
        className="absolute right-3 top-8.5 rounded p-1 text-body hover:text-ink"
      >
        {visible ? <Eye className="h-4.5 w-4.5" aria-hidden /> : <EyeOff className="h-4.5 w-4.5" aria-hidden />}
      </button>
    </div>
  );
}

// "Chrome on Windows", read from this browser.
// TODO (backend): a list of all signed-in devices (with location) needs a sessions endpoint.
function thisDevice() {
  const ua = navigator.userAgent;
  const browser = /Edg\//.test(ua) ? "Edge" : /OPR\//.test(ua) ? "Opera" : /Firefox\//.test(ua) ? "Firefox" : /Chrome\//.test(ua) ? "Chrome" : /Safari\//.test(ua) ? "Safari" : "Browser";
  const os = /Windows/.test(ua) ? "Windows" : /Android/.test(ua) ? "Android" : /iPhone|iPad/.test(ua) ? "iOS" : /Mac OS/.test(ua) ? "macOS" : /Linux/.test(ua) ? "Linux" : "your device";
  return `${browser} on ${os}`;
}

function SecurityPanel({ profile }) {
  const verified = profile?.emailVerified ?? true; // you can't log in unverified, so assume yes until loaded

  return (
    <Panel id="security" title="Security Preferences">
      <div className="flex items-start gap-3 border-b border-line pb-5">
        {verified ? <ShieldCheck className="h-6 w-6 shrink-0 text-brand-600" aria-hidden /> : <ShieldAlert className="h-6 w-6 shrink-0 text-[#8a6a10]" aria-hidden />}
        <div>
          <p className="text-sm font-medium text-ink">{verified ? "Email verified" : "Email not verified"}</p>
          <p className="text-xs text-body">{verified ? "Your account is protected." : "Verify your email to secure your account."}</p>
        </div>
      </div>
      <p className="mt-5 text-sm font-semibold text-ink">Current session</p>
      <div className="mt-3 flex items-start gap-3">
        <Monitor className="h-6 w-6 shrink-0 text-body" aria-hidden />
        <div>
          <p className="text-sm text-ink">{thisDevice()}</p>
          <p className="flex items-center gap-1.5 text-xs text-body">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-600" aria-hidden />
            Active now
          </p>
          <span className="mt-2 inline-block rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-600">This device</span>
        </div>
      </div>
      <p className="mt-5 text-xs text-body">Never share your password or verification codes with anyone.</p>
    </Panel>
  );
}

function SignOutPanel() {
  const { logout } = useAuth();
  const [busy, setBusy] = useState(false);
  return (
    <Reveal className="flex flex-col gap-4 rounded-xl border border-line bg-white px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <div>
        <p className="text-sm font-semibold text-ink">Sign out of your account</p>
        <p className="mt-1 text-sm text-body">You can securely sign back in whenever you need.</p>
      </div>
      <Button
        variant="danger"
        icon={LogOut}
        loading={busy}
        onClick={() => {
          setBusy(true);
          logout();
        }}
      >
        Sign Out
      </Button>
    </Reveal>
  );
}
