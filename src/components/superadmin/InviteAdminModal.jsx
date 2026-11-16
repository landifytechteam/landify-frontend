import { useState } from "react";
import { Modal } from "../dashboard/Modal";
import { Button, FormError } from "../dashboard/ui";
import { Field } from "../dashboard/controls";

/**
 * Invite a company administrator for one fixed company (used on the company page).
 * `onInvite({ name, email })` should return truthy when it worked.
 */
export function InviteAdminModal({ open, onClose, company, validityDays = 7, ...formProps }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Invite administrator"
      description={`They'll manage ${company?.name} only. The invitation expires after ${validityDays} days.`}
    >
      <InviteForm onClose={onClose} company={company} {...formProps} />
    </Modal>
  );
}

function InviteForm({ onClose, onInvite, busy, error }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);

  const emailError = !/^\S+@\S+\.\S+$/.test(email)
    ? "Enter a valid email address."
    : undefined;

  const submit = async (e) => {
    e.preventDefault();
    setTouched(true);
    if (emailError) return;
    if (await onInvite({ name, email: email.trim() })) onClose();
  };

  return (
    <form onSubmit={submit} className="space-y-4" noValidate>
      <Field
        label="Full name (optional)"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="e.g. Kemi Adeyemi"
      />
      <Field
        label="Work email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="name@company.com"
        error={touched ? emailError : undefined}
      />
      <FormError>{error}</FormError>
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button onClick={onClose}>Cancel</Button>
        <Button type="submit" variant="primary" loading={busy}>
          Send invitation
        </Button>
      </div>
    </form>
  );
}
