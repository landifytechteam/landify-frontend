import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LockKeyhole, Mail } from "lucide-react";
import { CenteredAuthCard, FormAlert } from "../components/auth/CenteredAuthCard";
import { TextField } from "../components/auth/TextField";
import { SubmitButton } from "../components/auth/SubmitButton";
import { OrDivider } from "../components/auth/SocialAuth";
import { authRoutes } from "../data/auth";
import { isEmail } from "../utils/validation";
import useAuth from "../context/useAuth";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const { requestPasswordReset, loading, error, clearError } = useAuth();

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  useEffect(() => {
    clearError();
  }, [clearError]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!isEmail(email)) {
      setEmailError("Enter a valid email address.");
      return;
    }

    const cleanEmail = email.trim();
    const sent = await requestPasswordReset({ email: cleanEmail });
    if (!sent) return;

    navigate(authRoutes.otp, { state: { email: cleanEmail, purpose: "reset" } });
  }

  return (
    <CenteredAuthCard
      icon={LockKeyhole}
      accent="dot"
      title="Forgot Your Password?"
      subtitle="Enter your registered email address to receive password reset instructions."
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        <TextField
          id="email"
          type="email"
          label="Email Address"
          icon={Mail}
          placeholder="e.g. you@example.com"
          autoComplete="email"
          autoFocus
          error={emailError}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setEmailError("");
          }}
        />

        <FormAlert>{error}</FormAlert>

        <SubmitButton loading={loading}>Send Reset Code</SubmitButton>
      </form>

      <OrDivider />

      <p className="text-center text-[15px] text-body">
        Remember your password?{" "}
        <Link to={authRoutes.login} className="font-semibold text-brand-600 hover:underline">
          Back to Login
        </Link>
      </p>
    </CenteredAuthCard>
  );
}