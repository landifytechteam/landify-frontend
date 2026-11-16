import { useState } from "react";
import { Modal } from "../dashboard/Modal";
import { Button, FormError } from "../dashboard/ui";
import { Field, Select } from "../dashboard/controls";

const STATES = [
  "Abia",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "FCT",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Lagos",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Rivers",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara",
];

const empty = {
  name: "",
  legalName: "",
  rcNumber: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
};

/**
 * Add / edit company form in a dialog. Pass `company` to edit, leave it out to add.
 * `onSubmit(values)` should return truthy when it saved, so the dialog closes.
 */
export function CompanyFormModal({ open, onClose, company, ...formProps }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      title={company ? "Edit company" : "Add company"}
      description={
        company
          ? `${company.name} · ${company.id}`
          : "New companies start as Under review until their registration is verified."
      }
    >
      <CompanyForm onClose={onClose} company={company} {...formProps} />
    </Modal>
  );
}

function CompanyForm({ onClose, company, onSubmit, busy, error }) {
  const [values, setValues] = useState(empty);
  const [touched, setTouched] = useState(false);

  const set = (name) => (e) =>
    setValues((v) => ({ ...v, [name]: e?.target ? e.target.value : e }));

  const errors = {
    name: !values.name.trim() && "Enter the company name.",
    rcNumber: !values.rcNumber.trim() && "Enter the CAC registration number.",
    email:
      !/^\S+@\S+\.\S+$/.test(values.email) && "Enter a valid email address.",
    state: !values.state && "Choose a state.",
  };
  const show = (key) => (touched ? errors[key] || undefined : undefined);

  const submit = async (e) => {
    e.preventDefault();
    setTouched(true);
    if (Object.values(errors).some(Boolean)) return;
    const body = {
      ...values,
      legalName: values.legalName.trim() || values.name.trim(),
    };
    if (await onSubmit(body)) onClose();
  };

  return (
    <form onSubmit={submit} className="space-y-5" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Company name"
          value={values.name}
          onChange={set("name")}
          error={show("name")}
          placeholder="e.g. TerraVale Estates"
        />
        <Field
          label="Registered legal name"
          value={values.legalName}
          onChange={set("legalName")}
          hint="Leave blank to use the company name"
        />
        <Field
          label="CAC registration number"
          value={values.rcNumber}
          onChange={set("rcNumber")}
          error={show("rcNumber")}
          placeholder="RC 1234567"
        />
        <Field
          label="Company email"
          type="email"
          value={values.email}
          onChange={set("email")}
          error={show("email")}
          placeholder="governance@company.com"
        />
        <Field
          label="Phone"
          value={values.phone}
          onChange={set("phone")}
          placeholder="+234 800 000 0000"
        />
        <Field
          label="City"
          value={values.city}
          onChange={set("city")}
          placeholder="e.g. Lekki"
        />
        <div>
          <Select
            label="State"
            value={values.state}
            onChange={set("state")}
            options={STATES}
            placeholder="Choose a state"
          />
          {show("state") && (
            <span className="mt-1.5 block text-xs text-red-600">
              {show("state")}
            </span>
          )}
        </div>
        <Field
          label="Registered address"
          value={values.address}
          onChange={set("address")}
          className="sm:col-span-2"
        />
      </div>
      <FormError>{error}</FormError>
      <div className="flex flex-col-reverse gap-3 border-t border-line pt-5 sm:flex-row sm:justify-end">
        <Button onClick={onClose}>Cancel</Button>
        <Button type="submit" variant="primary" loading={busy}>
          {company ? "Save changes" : "Add company"}
        </Button>
      </div>
    </form>
  );
}

// const pick = (c) => Object.fromEntries(Object.keys(empty).map((k) => [k, c[k] ?? ""]));
