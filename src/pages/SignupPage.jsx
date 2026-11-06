import { useEffect, useState } from "react";
import { Info, Mail, Phone, User } from "lucide-react";
import { AuthLayout } from "../components/auth/AuthLayout";
import { SubmitButton } from "../components/auth/SubmitButton";
import { TextField } from "../components/auth/TextField";
import { FieldError } from "../components/auth/TextField";
import { PasswordField } from "../components/auth/TextField";
import { AuthHeading } from "../components/auth/AuthLayout";
import { SecureNote } from "../components/auth/AuthLayout";
import { OrDivider } from "../components/auth/SocialAuth";
import { GoogleButton } from "../components/auth/SocialAuth";
import { AccountTypePicker } from "../components/auth/AccountTypePicker";
import { accountTypes, authRoutes, continueWithGoogle, PASSWORD_HINT } from "../data/auth";
import { validateSignup } from "../utils/validation";
import useAuth from "../context/useAuth";
import { useNavigate, useSearchParams } from "react-router-dom";

function initialRole(slug) {
  return accountTypes.find((t) => t.slug === slug)?.value ?? "client";
}

export default function SignupPage() {
  const { loading, error, register, clearError } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [form, setForm] = useState(() => ({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    accountType: initialRole(searchParams.get("role")),
    agree: false,
  }));
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    clearError();
  }, [clearError]);

  const clearFieldError = (name) => {
    if (fieldErrors[name]) setFieldErrors((e) => ({ ...e, [name]: undefined}));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((v) => ({ ...v, [name]: type === "checkbox" ? checked : value }));
    // Clear a field's error as soon as the user edits it
    clearFieldError(name);
  };

  const handleAccountType = (type) => {
    setForm((v) => ({ ...v, accountType: type}));
    clearFieldError("accountType");
  };

  async function handleSubmit(e) {
    e.preventDefault();

    const found = validateSignup(form);
    setFieldErrors(found);
    if (Object.keys(found).length) return;

    // eslint-disable-next-line no-unused-vars
    const { agree, ...payload } = form;

    const success = await register(payload);
    if (!success) return;

    navigate(authRoutes.otp, { state: { email: payload.email, purpose: "signup" } });
  }

  return (
    <AuthLayout badge="Secure sign up">
      <AuthHeading
        eyebrow="Welcome to Landify"
        title="Create your account"
        subtitle="A smarter property journey starts with a few details."
      />

      <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
        <TextField
          id="fullName"
          label="Full Name"
          icon={User}
          placeholder="Enter your full name"
          autoComplete="name"
          required
          error={fieldErrors.fullName}
          value={form.fullName}
          onChange={handleChange}
        />
        <TextField
          id="email"
          type="email"
          label="Email Address"
          icon={Mail}
          placeholder="you@example.com"
          autoComplete="email"
          required
          error={fieldErrors.email}
          value={form.email}
          onChange={handleChange}
        />
        <TextField
          id="phone"
          type="tel"
          label="Phone Number"
          icon={Phone}
          placeholder="+234 801 234 5678"
          autoComplete="tel"
          required
          error={fieldErrors.phone}
          value={form.phone}
          onChange={handleChange}
        />

        <div>
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-4">
            <PasswordField
              id="password"
              label="Password"
              placeholder="Create a password"
              autoComplete="new-password"
              required
              error={fieldErrors.password}
          value={form.password}
          onChange={handleChange}
            />
            <PasswordField
              id="confirmPassword"
              label="Confirm Password"
              placeholder="Repeat password"
              autoComplete="new-password"
              required
              error={fieldErrors.confirmPassword}
          value={form.confirmPassword}
          onChange={handleChange}
            />
          </div>
          <p className="mt-2 flex items-center gap-2 text-xs text-body">
            <Info className="h-3.5 w-3.5 shrink-0" aria-hidden />
            {PASSWORD_HINT}
          </p>
        </div>

        <AccountTypePicker
          value={form.accountType}
          onChange={handleAccountType}
          error={fieldErrors.accountType}
        />

        <div>
          <label className="flex cursor-pointer items-start gap-3 text-sm text-body">
            <input
              type="checkbox"
              name="agree"
              checked={form.agree}
              onChange={handleChange}
              aria-invalid={Boolean(fieldErrors.agree)}
              aria-describedby={fieldErrors.agree ? "agree-error" : undefined}
              className="mt-0.5 h-4.5 w-4.5 shrink-0 cursor-pointer rounded border-line accent-brand-600"
            />
            <span>
              I agree to the{" "}
              <a href={authRoutes.terms} className="font-semibold text-brand-600 underline">
                Terms &amp; Conditions
              </a>{" "}
              and{" "}
              <a href={authRoutes.privacy} className="font-semibold text-brand-600 underline">
                Privacy Policy
              </a>
              .<span className="text-brand-600"> *</span>
            </span>
          </label>
          <FieldError id="agree-error">{fieldErrors.agree}</FieldError>
        </div>

        {error && (
          <p role="alert" className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}

        <SubmitButton loading={loading}>Create Account</SubmitButton>
      </form>

      <OrDivider />
      <GoogleButton onClick={() => continueWithGoogle(form.accountType)}>
        Sign up with Google
      </GoogleButton>

      <p className="mt-5 text-center text-sm text-body">
        Already have an account?{" "}
        <a href={authRoutes.login} className="font-medium text-brand-600 hover:underline">
          Log In
        </a>
      </p>

      <SecureNote />
    </AuthLayout>
  );
}