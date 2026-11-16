import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { KeyRound } from "lucide-react";
import { CenteredAuthCard, FormAlert } from "../components/auth/CenteredAuthCard";
import { PasswordField } from "../components/auth/TextField";
import { SubmitButton } from "../components/auth/SubmitButton";
import { authRoutes, PASSWORD_HINT } from "../data/auth";
import { maskEmail } from "../utils/apiError";
import useAuth from "../context/useAuth";

const strongEnough = (p) => p.length >= 8 && /[a-z]/.test(p) && /[A-Z]/.test(p) && /\d/.test(p);

/**
 * Last step of "forgot password". Arrives from the code page with
 *   location.state = { email, token }   (token = the 6-digit reset code)
 * and calls POST /auth/reset-password { email, token, newPassword }.
 */
export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const { email, token } = useLocation().state || {};
  const { loading, error, clearError, resetPassword } = useAuth();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState({});

  // Opened directly (no email/code): start the flow again
  if (!email || !token) return <Navigate to={authRoutes.forgotPassword} replace />;

  async function handleSubmit(e) {
    e.preventDefault();
    const next = {};
    if (!strongEnough(password)) next.password = PASSWORD_HINT;
    if (confirm !== password) next.confirm = "Passwords don't match.";
    setErrors(next);
    if (Object.keys(next).length) return;

    const ok = await resetPassword({ email, token, newPassword: password });
    if (!ok) return; // `error` is shown below

    navigate(authRoutes.login, {
      replace: true,
      state: { notice: "Your password has been reset. Log in with your new password." },
    });
  }

  return (
    <CenteredAuthCard
      icon={KeyRound}
      accent="check"
      title="Set a New Password"
      subtitle={
        <>
          Choose a new password for
          <br />
          <span className="font-medium text-ink">{maskEmail(email)}</span>
        </>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <PasswordField
          id="newPassword"
          label="New Password"
          autoComplete="new-password"
          autoFocus
          value={password}
          error={errors.password}
          onChange={(e) => {
            setPassword(e.target.value);
            setErrors((x) => ({ ...x, password: undefined }));
            clearError();
          }}
        />
        <PasswordField
          id="confirmPassword"
          label="Confirm New Password"
          autoComplete="new-password"
          value={confirm}
          error={errors.confirm}
          onChange={(e) => {
            setConfirm(e.target.value);
            setErrors((x) => ({ ...x, confirm: undefined }));
            clearError();
          }}
        />

        <FormAlert>{error}</FormAlert>
        {error && (
          <p className="-mt-2 text-sm text-body">
            Wrong or expired code?{" "}
            <Link to={authRoutes.otp} state={{ email, purpose: "reset" }} replace className="font-medium text-brand-600 hover:underline">
              Enter the code again
            </Link>
          </p>
        )}

        <SubmitButton loading={loading}>Reset Password</SubmitButton>
      </form>
    </CenteredAuthCard>
  );
}