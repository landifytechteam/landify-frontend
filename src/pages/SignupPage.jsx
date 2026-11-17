import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Building2, Info, Mail, Phone, User } from "lucide-react";
import { AuthLayout, AuthHeading, SecureNote } from "../components/auth/AuthLayout";
import { SubmitButton } from "../components/auth/SubmitButton";
import { FieldError, PasswordField, TextField } from "../components/auth/TextField";
import { OrDivider } from "../components/auth/SocialAuth";
import { AccountTypePicker } from "../components/auth/AccountTypePicker";
import { GoogleSignInButton } from "../components/auth/GoogleSignInButton";
import { accountTypes, authRoutes, getRole, homeForRole, PASSWORD_HINT } from "../data/auth";
import { validateSignup } from "../utils/validation";
import useAuth from "../context/useAuth";

const COMPANY = "Company Admin";
const GOOGLE_ENABLED = Boolean(import.meta.env.VITE_GOOGLE_CLIENT_ID);

// Wording for the name / email fields, depending on who is signing up
const LABELS = {
  person: {
    name: "Full Name",
    namePlaceholder: "Enter your full name",
    nameIcon: User,
    nameError: "Enter your full name.",
    email: "Email Address",
    emailPlaceholder: "you@example.com",
    phone: "Phone Number",
  },
  company: {
    name: "Company Name",
    namePlaceholder: "Enter your registered company name",
    nameIcon: Building2,
    nameError: "Enter your company name.",
    email: "Company Email Address",
    emailPlaceholder: "info@yourcompany.com",
    phone: "Company Phone Number",
  },
};

function initialRole(slug) {
  return accountTypes.find((t) => t.slug === slug)?.value ?? "Client";
}

export default function SignupPage() {
  const { loading, error, register, clearError, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [form, setForm] = useState(() => ({
    accountType: initialRole(searchParams.get("role")),
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agree: false,
  }));
  const [fieldErrors, setFieldErrors] = useState({});

  const isCompany = form.accountType === COMPANY;
  const labels = isCompany ? LABELS.company : LABELS.person;

  useEffect(() => {
    clearError();
  }, [clearError]);

  const clearFieldError = (name) => {
    if (fieldErrors[name]) setFieldErrors((e) => ({ ...e, [name]: undefined }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((v) => ({ ...v, [name]: type === "checkbox" ? checked : value }));
    clearFieldError(name); // clear a field's error as soon as the user edits it
  };

  const handleAccountType = (type) => {
    setForm((v) => ({ ...v, accountType: type }));
    clearFieldError("accountType");
  };

  async function handleSubmit(e) {
    e.preventDefault();

    const found = validateSignup(form);
    if (found.fullName) found.fullName = labels.nameError; // "company name" wording for companies
    setFieldErrors(found);
    if (Object.keys(found).length) return;

    // The backend requires confirmPassword too (it answers "expected string,
    // received undefined" without it). `agree` is only for this form, so it's not sent.
    // A company's name goes in `fullName`, the field the backend expects.
    // eslint-disable-next-line no-unused-vars
    const { agree, ...payload } = form;

    const data = await register(payload);
    if (!data) return; // `error` is shown above the button

    navigate(authRoutes.otp, {
      state: { email: payload.email, purpose: "signup", debugOtp: data.debugOtp },
    });
  }

  return (
    <AuthLayout badge="Secure sign up">
      <AuthHeading
        eyebrow="Welcome to Landify"
        title={isCompany ? "Register your company" : "Create your account"}
        subtitle={
          isCompany
            ? "Set up your company workspace to list properties and manage clients."
            : "A smarter property journey starts with a few details."
        }
      />

      <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
        {/* Account type first, so the fields below match who is signing up */}
        <AccountTypePicker value={form.accountType} onChange={handleAccountType} error={fieldErrors.accountType} />

        <TextField
          id="fullName"
          label={labels.name}
          icon={labels.nameIcon}
          placeholder={labels.namePlaceholder}
          autoComplete={isCompany ? "organization" : "name"}
          required
          error={fieldErrors.fullName}
          value={form.fullName}
          onChange={handleChange}
        />
        <TextField
          id="email"
          type="email"
          label={labels.email}
          icon={Mail}
          placeholder={labels.emailPlaceholder}
          autoComplete="email"
          required
          error={fieldErrors.email}
          value={form.email}
          onChange={handleChange}
        />
        <TextField
          id="phone"
          type="tel"
          label={labels.phone}
          icon={Phone}
          placeholder="+234 801 234 5678"
          autoComplete="tel"
          required
          error={fieldErrors.phone}
          value={form.phone}
          onChange={handleChange}
        />

        <div>
          <div className="grid gap-4 sm:grid-cols-2">
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
              <Link to={authRoutes.terms} className="font-semibold text-brand-600 underline">
                Terms &amp; Conditions
              </Link>{" "}
              and{" "}
              <Link to={authRoutes.privacy} className="font-semibold text-brand-600 underline">
                Privacy Policy
              </Link>
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

        <SubmitButton loading={loading}>{isCompany ? "Register Company" : "Create Account"}</SubmitButton>
      </form>

      {/* POST /auth/google gets the chosen account type, so Google works for every type */}
      {GOOGLE_ENABLED && (
        <>
          <OrDivider />
          <GoogleSignInButton
            text="signup_with"
            onToken={async (idToken) => {
              const user = await loginWithGoogle(idToken, form.accountType);
              if (user) navigate(homeForRole[getRole(user)] ?? "/", { replace: true });
            }}
          />
        </>
      )}

      <p className="mt-5 text-center text-sm text-body">
        Already have an account?{" "}
        <Link to={authRoutes.login} className="font-medium text-brand-600 hover:underline">
          Log In
        </Link>
      </p>

      <SecureNote />
    </AuthLayout>
  );
}