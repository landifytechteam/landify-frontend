import { useState } from "react";
import { Modal } from "../dashboard/Modal";
import { Button, FormError } from "../dashboard/ui";
import { Field, Select } from "../dashboard/controls";
import { useAction } from "../../context/hooks";
import { partnerApi } from "../../context/salespartner/partnerApi";
import { isEmail, isNigerianPhone } from "../../utils/validation";

const EMPTY = { fullName: "", email: "", phone: "", propertyId: "" };

/**
 * "Add New Client" dialog. `properties` = [{ value, label }] for the optional
 * property picker. `onCreated(client)` runs after a successful save.
 */
export function AddClientModal({ open, onClose, properties = [], onCreated }) {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const save = useAction(partnerApi.createClient);

  const set = (name) => (e) => {
    const value = typeof e === "string" ? e : e.target.value;
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((errs) => ({ ...errs, [name]: undefined }));
  };

  const close = () => {
    setForm(EMPTY);
    setErrors({});
    save.clearError();
    onClose();
  };

  const submit = async (e) => {
    e.preventDefault();
    const next = {};
    if (!form.fullName.trim()) next.fullName = "Enter the client's full name.";
    if (!isEmail(form.email)) next.email = "Enter a valid email address.";
    if (!isNigerianPhone(form.phone)) next.phone = "Enter a valid Nigerian phone number.";
    setErrors(next);
    if (Object.keys(next).length) return;

    const property = properties.find((o) => o.value === form.propertyId);
    const body = { ...form, propertyId: form.propertyId || undefined, propertyName: property?.label };
    const created = await save.run(body);
    if (created) {
      onCreated?.(created);
      close();
    }
  };

  return (
    <Modal
      open={open}
      onClose={close}
      title="Add new client"
      description="They'll appear in My Clients as Pending until your Company Admin confirms them."
      footer={
        <>
          <Button onClick={close}>Cancel</Button>
          <Button variant="primary" type="submit" form="add-client-form" loading={save.busy}>
            Add client
          </Button>
        </>
      }
    >
      <form id="add-client-form" onSubmit={submit} noValidate className="space-y-4">
        <FormError>{save.error}</FormError>
        <Field label="Full name" value={form.fullName} onChange={set("fullName")} error={errors.fullName} autoComplete="off" />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Email address" type="email" value={form.email} onChange={set("email")} error={errors.email} />
          <Field label="Phone number" type="tel" value={form.phone} onChange={set("phone")} error={errors.phone} placeholder="0801 234 5678" />
        </div>
        <Select label="Interested in (optional)" value={form.propertyId} onChange={set("propertyId")} options={properties} placeholder="Not sure yet" />
      </form>
    </Modal>
  );
}
