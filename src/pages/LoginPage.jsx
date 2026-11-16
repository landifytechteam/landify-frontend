import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Mail, CheckCircle2 } from "lucide-react";
import { AuthLayout } from "../components/auth/AuthLayout";
import { SubmitButton } from "../components/auth/SubmitButton";
import { TextField } from "../components/auth/TextField";
import { PasswordField } from "../components/auth/TextField";
import { AuthHeading } from "../components/auth/AuthLayout";
import { SecureNote } from "../components/auth/AuthLayout";
import { OrDivider } from "../components/auth/SocialAuth";
import { GoogleSignInButton } from "../components/auth/GoogleSignInButton";
import { authRoutes, homeForRole, getRole } from "../data/auth";
import { validateLogin } from "../utils/validation";
import useAuth from "../context/useAuth";

const REMEMBERED_EMAIL_KEY = "rememberedEmail";
const GOOGLE_ENABLED = Boolean(import.meta.env.VITE_GOOGLE_CLIENT_ID);

const getRememberedEmail = () => {
  try {
    return localStorage.getItem(REMEMBERED_EMAIL_KEY) || "";
  } catch {
    return "";
  }
};

const saveRememberedEmail = (email) => {
  try {
    if (email) localStorage.setItem(REMEMBERED_EMAIL_KEY, email);
    else localStorage.removeItem(REMEMBERED_EMAIL_KEY);
  } catch {
    // storage unavailable (e.g. private mode) — skip remembering
  }
};

export default function LoginPage() {
  const { loading, error, login, clearError, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const notice = location.state?.notice;

  const [rememberedEmail] = useState(() => getRememberedEmail());
  const [form, setForm] = useState({ email: rememberedEmail, password: "" });
  const [fieldErrors, setFieldErrors] = useState({});
  const [rememberMe, setRememberMe] = useState(!!rememberedEmail);

  useEffect(() => {
    clearError();
  }, [clearError]);

  // ProtectedRoute sends people here with state.from (a string, or a location object).
  // Go back there after login, otherwise to the dashboard for the user's role.
  const goAfterLogin = (user) => {
    const from = location.state?.from;
    const target = (typeof from === "string" ? from : from?.pathname) || homeForRole[getRole(user)] || "/";
    navigate(target, { replace: true });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // clear a field's error as soon as the user starts fixing it
    if (fieldErrors[name])
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // check the form locally before calling the backend
    const found = validateLogin(form);
    setFieldErrors(found);
    if (Object.keys(found).length) return;

    const user = await login(form);
    if (!user) return;
    saveRememberedEmail(rememberMe ? form.email : null);
    goAfterLogin(user);
  };

  return (
    <AuthLayout badge="Secure log in">
      <AuthHeading
        eyebrow="Welcome back"
        title="Log in to your account"
        subtitle="Pick up your property journey where you left off."
      />

      {notice && (
        <p className="mt-6 flex items-center gap-2 rounded-md bg-brand-50 px-4 py-3 text-sm text-brand-600">
          <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden />
          {notice}
        </p>
      )}

      <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
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
        <PasswordField
          id="password"
          label="Password"
          placeholder="Enter your password"
          autoComplete="current-password"
          required
          error={fieldErrors.password}
          value={form.password}
          onChange={handleChange}
        />

        <div className="flex items-center justify-between gap-4">
          <label className="flex cursor-pointer items-center gap-3 text-sm text-body">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4.5 w-4.5 cursor-pointer rounded border-line accent-brand-600"
            />
            Remember me
          </label>
          <Link
            to={authRoutes.forgotPassword}
            className="text-sm font-semibold text-brand-600 hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        {error && (
          <p
            role="alert"
            className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {error}
          </p>
        )}

        <SubmitButton loading={loading}>Log In</SubmitButton>
      </form>

      {GOOGLE_ENABLED && (
        <>
          <OrDivider />
          <GoogleSignInButton
            onToken={async (idToken) => {
              const user = await loginWithGoogle(idToken);
              if (user) goAfterLogin(user);
            }}
          />
        </>
      )}

      <p className="mt-5 text-center text-sm text-body">
        Don&apos;t have an account?{" "}
        <Link
          to={authRoutes.signup}
          className="font-medium text-brand-600 hover:underline"
        >
          Create one
        </Link>
      </p>

      <SecureNote />
    </AuthLayout>
  );
}
