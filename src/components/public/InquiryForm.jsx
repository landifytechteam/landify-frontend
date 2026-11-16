import { useState } from "react";
import { CheckCircle2, Send } from "lucide-react";
import { publicApi } from "../../context/public/publicApi";
import { useAction } from "../../context/hooks";
import { Button, FormError } from "../dashboard/ui";
import { Field } from "../dashboard/controls";

const isEmail = (v) => /^\S+@\S+\.\S+$/.test(v);
const isPhone = (v) => /^\+?[\d\s-]{10,16}$/.test(v.trim());

/**
 * "I'm interested" form on a property page. Sends POST /v1/public/inquiries,
 * which becomes a lead in the company's Leads page.
 */
export function InquiryForm({ property }) {
  const send = useAction(publicApi.submitInquiry);
  const [values, setValues] = useState({
    fullName: "",
    email: "",
    phone: "",
    message: `Hello, I'm interested in ${property.name}. Please send me more details about available plots and payment plans.`,
  });
  const [touched, setTouched] = useState(false);
  const [sent, setSent] = useState(false);

  const set = (key) => (e) => {
    setValues((v) => ({ ...v, [key]: e.target.value }));
    send.clearError();
  };

  const errors = {
    fullName: !values.fullName.trim() && "Enter your full name.",
    email: !isEmail(values.email) && "Enter a valid email address.",
    phone: !isPhone(values.phone) && "Enter a valid phone number, e.g. +2348012345678.",
    message: values.message.trim().length < 10 && "Tell the company a little about what you need.",
  };
  const show = (key) => (touched ? errors[key] || undefined : undefined);

  const submit = async (e) => {
    e.preventDefault();
    setTouched(true);
    if (Object.values(errors).some(Boolean)) return;
    const ok = await send.run({
      companyId: property.companyId,
      propertyId: property.id,
      fullName: values.fullName.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
      message: values.message.trim(),
    });
    if (ok) setSent(true);
  };

  if (sent) {
    return (
      <div className="flex flex-col items-center gap-3 py-6 text-center">
        <CheckCircle2 className="h-10 w-10 text-brand-600" aria-hidden />
        <p className="text-lg font-semibold text-ink">Inquiry sent</p>
        <p className="text-sm text-body">
          {property.companyName || "The company"} will contact you at {values.email} shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-4">
      <Field label="Full name" value={values.fullName} onChange={set("fullName")} error={show("fullName")} autoComplete="name" />
      <Field label="Email address" type="email" value={values.email} onChange={set("email")} error={show("email")} autoComplete="email" />
      <Field label="Phone number" type="tel" value={values.phone} onChange={set("phone")} error={show("phone")} placeholder="+234 801 234 5678" autoComplete="tel" />
      <Field label="Message" multiline value={values.message} onChange={set("message")} error={show("message")} />
      <FormError>{send.error}</FormError>
      <Button type="submit" variant="primary" icon={Send} loading={send.busy} className="w-full">
        Send inquiry
      </Button>
      <p className="text-xs text-body">Your details go only to the company listing this property.</p>
    </form>
  );
}