import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { KeyRound, LogOut, Save, TriangleAlert } from "lucide-react";
import { superAdminApi } from "../../context/superadmin/superAdminApi";
import { useAction } from "../../context/hooks";
import { Button, FormError, Notice, PageHeader, Panel } from "../../components/dashboard/ui";
import { Field } from "../../components/dashboard/controls";
import { useToast } from "../../components/dashboard/useToast";
import useAuth from "../../context/useAuth";

const strongEnough = (p) => p.length >= 8 && /[a-z]/.test(p) && /[A-Z]/.test(p) && /\d/.test(p);

/**
 * /superadmin/account: the logged-in super admin's own sign-in details.
 *   PUT    /auth/super-admin/credentials  { currentPassword, newEmail?, newPassword? }
 *   DELETE /auth/super-admin/self         { password }
 */
export default function AccountSecurityPage() {
  const { user } = useAuth();
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader eyebrow="My account" title="Account security" subtitle={`Signed in as ${user?.email ?? "super administrator"}. Changes apply to your account only.`} />
      <CredentialsForm currentEmail={user?.email} />
      <ResignPanel />
    </div>
  );
}

function CredentialsForm({ currentEmail }) {
  const toast = useToast();
  const { logout } = useAuth();
  const save = useAction(superAdminApi.updateCredentials);
  const empty = { newEmail: "", newPassword: "", confirmPassword: "", currentPassword: "" };
  const [values, setValues] = useState(empty);
  const [touched, setTouched] = useState(false);

  const set = (key) => (e) => {
    setValues((v) => ({ ...v, [key]: e.target.value }));
    save.clearError();
  };

  const changingEmail = values.newEmail.trim() !== "" && values.newEmail.trim() !== currentEmail;
  const changingPassword = values.newPassword !== "";
  const errors = {
    newEmail: values.newEmail.trim() && !/^\S+@\S+\.\S+$/.test(values.newEmail) && "Enter a valid email address.",
    newPassword: changingPassword && !strongEnough(values.newPassword) && "Use 8+ characters with uppercase, lowercase and a number.",
    confirmPassword: changingPassword && values.confirmPassword !== values.newPassword && "Passwords don't match.",
    currentPassword: !values.currentPassword && "Enter your current password to confirm.",
    nothing: !changingEmail && !changingPassword && "Enter a new email, a new password, or both.",
  };
  const show = (key) => (touched ? errors[key] || undefined : undefined);

  const submit = async (e) => {
    e.preventDefault();
    setTouched(true);
    if (Object.values(errors).some(Boolean)) return;
    const body = { currentPassword: values.currentPassword };
    if (changingEmail) body.newEmail = values.newEmail.trim();
    if (changingPassword) body.newPassword = values.newPassword;

    if (await save.run(body)) {
      setValues(empty);
      setTouched(false);
      if (changingEmail) {
        // The token still carries the old email, so start a fresh session
        toast("Email updated. Log in again with your new email.");
        setTimeout(logout, 1500);
      } else {
        toast("Password updated");
      }
    }
  };

  return (
    <Panel title="Sign-in details" subtitle="Leave a field empty to keep it as it is.">
      <form onSubmit={submit} noValidate className="space-y-5">
        <Field label="New email address" type="email" value={values.newEmail} onChange={set("newEmail")} placeholder={currentEmail} error={show("newEmail")} autoComplete="email" />
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="New password" type="password" value={values.newPassword} onChange={set("newPassword")} error={show("newPassword")} autoComplete="new-password" />
          <Field label="Confirm new password" type="password" value={values.confirmPassword} onChange={set("confirmPassword")} error={show("confirmPassword")} autoComplete="new-password" />
        </div>
        <div className="border-t border-line pt-5">
          <Field label="Current password" type="password" value={values.currentPassword} onChange={set("currentPassword")} error={show("currentPassword")} autoComplete="current-password" hint="Required for any change." />
        </div>
        {touched && errors.nothing && <p className="text-sm text-red-600">{errors.nothing}</p>}
        <FormError>{save.error}</FormError>
        <Button type="submit" variant="primary" icon={Save} loading={save.busy}>Save changes</Button>
      </form>
    </Panel>
  );
}

/** Permanently delete your own super admin account (the backend refuses if you're the last one). */
function ResignPanel() {
  const toast = useToast();
  const { endSession } = useAuth();
  const navigate = useNavigate();
  const resign = useAction(superAdminApi.resignAccount);
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmText, setConfirmText] = useState("");

  const ready = password && confirmText === "DELETE";

  const submit = async (e) => {
    e.preventDefault();
    if (!ready) return;
    if (await resign.run(password)) {
      toast("Your super admin account has been deleted.");
      endSession(); // the account no longer exists, so skip the logout call
      navigate("/login", { replace: true });
    }
  };

  return (
    <Panel title="Resign as super admin" subtitle="Permanently delete your super admin account.">
      <Notice tone="gold" icon={TriangleAlert} title="This can't be undone">
        Your account and access are removed for good. Audit records of your actions are kept. The platform must always keep at least one super admin, so this fails if you are the last one.
      </Notice>
      {!open ? (
        <Button variant="danger" icon={LogOut} className="mt-5" onClick={() => setOpen(true)}>I want to resign</Button>
      ) : (
        <form onSubmit={submit} noValidate className="mt-5 space-y-4">
          <Field label="Your password" type="password" value={password} onChange={(e) => { setPassword(e.target.value); resign.clearError(); }} autoComplete="current-password" />
          <Field label='Type "DELETE" to confirm' value={confirmText} onChange={(e) => setConfirmText(e.target.value)} />
          <FormError>{resign.error}</FormError>
          <div className="flex flex-wrap gap-3">
            <Button type="submit" variant="danger" icon={KeyRound} loading={resign.busy} disabled={!ready}>Delete my account</Button>
            <Button onClick={() => { setOpen(false); setPassword(""); setConfirmText(""); resign.clearError(); }}>Cancel</Button>
          </div>
        </form>
      )}
    </Panel>
  );
}