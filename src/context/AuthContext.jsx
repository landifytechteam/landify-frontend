import { createContext, useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { refreshAccessToken, setAccessToken, setOnSessionExpired } from "../api/axios";
import { userFromToken } from "../utils/jwt";
import { getErrorMessage } from "../utils/apiError";
import { PageLoader } from "../components/ui/PageLoader";

const AuthContext = createContext(null);

// Backup copy of the user for this browser tab, in case the token doesn't
// carry every field. (Only profile info, never the token.)
const USER_KEY = "landify:user";
const rememberUser = (user) => {
  try {
    if (user) sessionStorage.setItem(USER_KEY, JSON.stringify(user));
    else sessionStorage.removeItem(USER_KEY);
  } catch {
    // storage blocked (private mode): fine, the token is enough
  }
};
const rememberedUser = () => {
  try {
    return JSON.parse(sessionStorage.getItem(USER_KEY)) ?? null;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [initializing, setInitializing] = useState(true);
  // Full-screen "Signing you in/out…" message while the session changes (null = none)
  const [busyMessage, setBusyMessage] = useState(null);
  const [loggedOutOnPurpose, setLoggedOutOnPurpose] = useState(false);
  const navigate = useNavigate();
  const restored = useRef(false);

  // Save the token + user after login / Google / anything that signs in
  const startSession = useCallback((accessToken, userData) => {
    setLoggedOutOnPurpose(false);
    setAccessToken(accessToken);
    const next = userData ?? userFromToken(accessToken);
    setUser(next);
    rememberUser(next);
  }, []);

  const endSession = useCallback(() => {
    setAccessToken(null);
    setUser(null);
    rememberUser(null);
  }, []);

  // On page load: swap the refresh cookie for a new access token.
  // The endpoint returns only { accessToken }, so the user comes from the token.
  useEffect(() => {
    if (restored.current) return; // React StrictMode runs effects twice in dev
    restored.current = true;

    refreshAccessToken()
      .then((token) => {
        const fromToken = userFromToken(token);
        const next = fromToken?.accountType ? fromToken : { ...rememberedUser(), ...fromToken };
        setUser(next);
        rememberUser(next);
      })
      .catch(() => endSession()) // no valid session: stay logged out
      .finally(() => setInitializing(false));
  }, [endSession]);

  // If a refresh fails later (cookie expired), drop the user and go to login
  useEffect(() => {
    setOnSessionExpired(() => {
      endSession();
      navigate("/login", { replace: true, state: { notice: "Your session expired. Please log in again." } });
    });
  }, [endSession, navigate]);

  const clearError = useCallback(() => setError(null), []);

  // After a profile edit: merge the saved fields into the logged-in user
  // (so the sidebar name updates straight away)
  const updateUser = useCallback((changes) => {
    setUser((current) => {
      const next = current ? { ...current, ...changes } : current;
      rememberUser(next);
      return next;
    });
  }, []);

  // Runs an API call with loading + error handling. Returns the response data, or null.
  const request = async (call, fallbackMessage, { quiet = false } = {}) => {
    if (!quiet) setLoading(true);
    setError(null);
    try {
      const res = await call();
      return res.data ?? {};
    } catch (err) {
      setError(getErrorMessage(err, fallbackMessage));
      return null;
    } finally {
      if (!quiet) setLoading(false);
    }
  };

  const login = async (credentials) => {
    setBusyMessage("Signing you in…");
    const data = await request(() => api.post("/auth/login", credentials), "Login failed. Check your email and password.");
    setBusyMessage(null);
    if (!data) return null;
    startSession(data.accessToken, data.user);
    return data.user; // the page uses this to pick the dashboard
  };

  // Google sign-in: `idToken` comes from the Google button (see GoogleSignInButton.jsx).
  // `accountType` is sent only from the signup page, so a NEW account gets the type the
  // user picked. Login leaves it out (existing accounts keep their type).
  const loginWithGoogle = async (idToken, accountType) => {
    const body = accountType ? { idToken, accountType } : { idToken };
    setBusyMessage("Signing you in with Google…");
    const data = await request(() => api.post("/auth/google", body), "Google sign-in failed. Try again.");
    setBusyMessage(null);
    if (!data?.accessToken) {
      if (data) setError("Google sign-in didn't return a session. Ask the backend dev to return accessToken + user like /auth/login.");
      return null;
    }
    startSession(data.accessToken, data.user);
    return data.user ?? userFromToken(data.accessToken);
  };

  const logout = async () => {
    setBusyMessage("Signing you out…");
    try {
      await api.post("/auth/logout");
    } catch {
      // even if this fails, log out on this device
    } finally {
      // Mark this as a deliberate logout. ProtectedRoute then doesn't remember
      // the current page as "return here after login" (it used to, so logging
      // out from Settings and back in landed on Settings, even for another user).
      setLoggedOutOnPurpose(true);
      endSession();
      navigate("/login", { replace: true });
      setBusyMessage(null);
    }
  };

  // Body: { fullName, email, phone, password, confirmPassword, accountType: "Client" | "Sales Partner" | "Company Admin", country, state }
  // Returns the response data ({ userId, debugOtp, ... }) or null.
  const register = (payload) =>
    request(() => api.post("/auth/register", { country: "Nigeria", ...payload }), "Registration failed. Please try again.");

  // Sign-up codes only. Reset codes are checked by /auth/reset-password instead.
  const verifyOtp = ({ email, code }) =>
    request(() => api.post("/auth/verify-otp", { email, otp: code }), "That code didn't work. Check it and try again.");

  // `purpose` "reset" sends a new reset code instead of a new sign-up code.
  // Doesn't touch `loading`, so the main button doesn't spin while resending.
  // Returns the response data (may include a new `debugOtp` in test mode), or null.
  const resendOtp = ({ email, purpose = "signup" }) => {
    const path = purpose === "reset" ? "/auth/forgot-password" : "/auth/resend-otp";
    return request(() => api.post(path, { email }), "We couldn't send a new code. Wait a minute and try again.", { quiet: true });
  };

  // Returns the response data (may include a test-mode code, see debugCodeOf), or null.
  const requestPasswordReset = ({ email }) =>
    request(() => api.post("/auth/forgot-password", { email }), "We couldn't send the reset code. Try again shortly.");

  // `token` is the 6-digit code from the reset email
  const resetPassword = async ({ email, token, newPassword }) =>
    Boolean(await request(() => api.post("/auth/reset-password", { email, token, newPassword }), "We couldn't reset your password. The code may have expired."));

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        clearError,
        initializing,
        isAuthenticated: Boolean(user),
        loggedOutOnPurpose,
        login,
        loginWithGoogle,
        logout,
        register,
        verifyOtp,
        resendOtp,
        requestPasswordReset,
        resetPassword,
        endSession,
        updateUser,
      }}
    >
      {children}
      {/* Covers the page (and blocks double clicks) while signing in or out */}
      {busyMessage && <PageLoader overlay label={busyMessage} />}
    </AuthContext.Provider>
  );
};

export default AuthContext;