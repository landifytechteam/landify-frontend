import { useEffect, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { Clock, Info, Shield } from "lucide-react";
import { CenteredAuthCard, FormAlert, InfoNote } from "../components/auth/CenteredAuthCard";
import { OtpInput } from "../components/auth/OtpInput";
import { SubmitButton } from "../components/auth/SubmitButton";
import { OrDivider } from "../components/auth/SocialAuth";
import { authRoutes } from "../data/auth";
import { maskEmail } from "../utils/apiError";
import useAuth from "../context/useAuth";

const CODE_LENGTH = 6;
const RESEND_SECONDS = 60;

const emptyCode = () => Array(CODE_LENGTH).fill("");
const formatTime = (s) =>
  `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

/**
 * One page for both flows. The page that sends the user here passes:
 *   navigate(authRoutes.otp, { state: { email, purpose: "signup" | "reset", debugOtp? } })
 *
 * - signup: checks the code with POST /auth/verify-otp, then goes to login.
 * - reset:  the backend checks reset codes together with the new password
 *           (POST /auth/reset-password), so this page just collects the code
 *           and passes it on to the Reset password page.
 */
export default function VerifyOtpPage() {
  const navigate = useNavigate();
  const { email, purpose = "signup", debugOtp: firstDebugOtp } = useLocation().state || {};
  const { loading, error, clearError, verifyOtp, resendOtp } = useAuth();

  const [code, setCode] = useState(emptyCode);
  const [codeError, setCodeError] = useState("");
  const [notice, setNotice] = useState("");
  const [resending, setResending] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
  // Test-mode code from the backend; replaced when "Resend Code" returns a new one
  const [debugOtp, setDebugOtp] = useState(firstDebugOtp);

  // Count down one second at a time until the user may ask for a new code
  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft]);

  // Don't show an error left over from the previous page
  useEffect(() => {
    clearError();
  }, [clearError]);

  const startOver = purpose === "reset" ? authRoutes.forgotPassword : authRoutes.signup;

  // Opened directly with no email to verify: send them back to start the flow
  if (!email) return <Navigate to={startOver} replace />;

  const handleCodeChange = (next) => {
    setCode(next);
    setCodeError("");
    if (error) clearError();
  };

  async function handleSubmit(e) {
    e.preventDefault();
    const joined = code.join("");
    if (joined.length < CODE_LENGTH) {
      setCodeError(`Enter all ${CODE_LENGTH} digits of the code.`);
      return;
    }

    setNotice("");

    if (purpose === "reset") {
      navigate(authRoutes.resetPassword, { state: { email, token: joined } });
      return;
    }

    const data = await verifyOtp({ email, code: joined });
    if (!data) {
      // Wrong or expired code: the context has set `error`, so clear the boxes for a retry
      setCode(emptyCode());
      return;
    }

    navigate(authRoutes.login, {
      state: { notice: "Your email is verified. Log in to continue." },
      replace: true,
    });
  }

  async function handleResend() {
    setResending(true);
    setNotice("");
    const sent = await resendOtp({ email, purpose });
    setResending(false);
    if (!sent) return;
    if (sent.debugOtp) setDebugOtp(sent.debugOtp);

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

        {/* The backend sends `debugOtp` while email delivery is in test mode.
            import.meta.env.DEV is true only under `npm run dev`, so it never shows on the live site. */}
        {import.meta.env.DEV && debugOtp && purpose === "signup" && (
          <p className="rounded-md border border-dashed border-gold-500 bg-[#fbf6e6] px-3 py-2 text-center text-sm text-ink">
            Test mode code: <span className="font-semibold tracking-[0.3em]">{debugOtp}</span>
          </p>
        )}

        <FormAlert>{error}</FormAlert>

        <SubmitButton loading={loading}>{purpose === "reset" ? "Continue" : "Verify Code"}</SubmitButton>
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