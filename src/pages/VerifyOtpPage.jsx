import { useEffect, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { Clock, Info, Shield } from "lucide-react";
import { CenteredAuthCard, FormAlert, InfoNote } from "../components/auth/CenteredAuthCard";
import { OtpInput } from "../components/auth/OtpInput";
import { SubmitButton } from "../components/auth/SubmitButton";
import { OrDivider } from "../components/auth/SocialAuth";
import { authRoutes, homeForRole, getRole } from "../data/auth";
import useAuth from "../context/useAuth";
import { maskEmail } from "../utils/apiError";

const CODE_LENGTH = 6;
const RESEND_SECONDS = 60;

const emptyCode = () => Array(CODE_LENGTH).fill("");
const formatTime = (s) =>
  `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;


export default function VerifyOtpPage() {
  const navigate = useNavigate();
  const { verifyOtp, resendOtp, loading, error, clearError } = useAuth();
  const { email, purpose = "signup" } = useLocation().state || {};

  const [code, setCode] = useState(emptyCode);
  const [codeError, setCodeError] = useState("");
  const [notice, setNotice] = useState("");
  const [resending, setResending] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);

  // Count down one second at a time until the user may ask for a new code
  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft]);

  useEffect(() => {
    clearError();
  }, [clearError]);

  const startOver = purpose === "reset" ? authRoutes.forgotPassword : authRoutes.signup;

  // Opened directly with no email to verify: send them back to start the flow
  if (!email) return <Navigate to={startOver} replace />;

  const handleCodeChange = (next) => {
    setCode(next);
    setCodeError("");
    if (error)  clearError();
  };

  async function handleSubmit(e) {
    e.preventDefault();
    const joined = code.join("");
    if (joined.length < CODE_LENGTH) {
      setCodeError(`Enter all ${CODE_LENGTH} digits of the code.`);
      return;
    }

    setNotice("");
    const data = await verifyOtp({ email, code: joined, purpose });
    if (!data) {
      setCode(emptyCode());
      return;
    }

    if (purpose === "reset") {
      navigate(authRoutes.resetPassword, {
        state: { email, resetToken: data.resetToken ?? joined },
        replace: true,
      });
    } else if (data.accessToken) {
      navigate(homeForRole[getRole(data.user)], { replace: true });
    } else {
      navigate(authRoutes.login, {
        state: { notice: "Your email is verified. Log in to continue." },
        replace: true,
      });
    }
  }

  async function handleResend() {
    setResending(true);
    setNotice("");
    const sent = await resendOtp({ email, purpose });
    setResending(false);
    if (!sent) return;

    setCode(emptyCode());
    setSecondsLeft(RESEND_SECONDS);
    setNotice(`We've sent a new code to ${maskEmail(email)}.`);
  }

  const canResend = secondsLeft === 0 && !resending;

  return (
    <CenteredAuthCard
      icon={Shield}
      accent="check"
      title={purpose === "reset" ? "Enter Reset Code" : "Verify Your Account"}
      subtitle={
        <>
          We&apos;ve sent a {CODE_LENGTH}-digit code to
          <br />
          <span className="font-medium text-ink">{maskEmail(email)}</span>
        </>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        <div>
          <OtpInput value={code} onChange={handleCodeChange} error={codeError} disabled={loading} autoFocus />
          {codeError && <p className="mt-2 text-xs text-red-600">{codeError}</p>}

          <div className="mt-3 flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-body" aria-live="polite">
              <Clock className="h-4 w-4" aria-hidden />
              {formatTime(secondsLeft)}
            </span>
            <button
              type="button"
              onClick={handleResend}
              disabled={!canResend}
              className="font-medium text-brand-600 hover:underline disabled:cursor-not-allowed disabled:font-normal disabled:text-body/60 disabled:no-underline"
            >
              {resending ? "Sending…" : "Resend Code"}
            </button>
          </div>
        </div>

        {notice ? (
          <InfoNote icon={Info}>{notice}</InfoNote>
        ) : (
          <InfoNote icon={Info}>You can paste the code directly into the boxes.</InfoNote>
        )}

        <FormAlert>{error}</FormAlert>

        <SubmitButton loading={loading}>Verify Code</SubmitButton>
      </form>

      <OrDivider />

      <p className="text-center">
        <Link to={startOver} className="text-[15px] font-medium text-brand-600 hover:underline">
          Use a different email or phone number
        </Link>
      </p>
    </CenteredAuthCard>
  );
}