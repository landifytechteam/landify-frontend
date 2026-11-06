import { createContext, useCallback, useEffect, useState, useRef } from "react";
import api, { setAccessToken } from "../api/axios";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

const getErrorMessage = (err, fallback) => {
  const message = err.response?.data?.message;
  if (Array.isArray(message)) return message.join(" ");
  return message || fallback;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [initializing, setInitializing] = useState(true);
  const didRestore = useRef(false);

  useEffect(() => {
    if (didRestore.current) return;
    didRestore.current = true;
    
    const restoreSession = async () => {
      try {
        const refreshRes = await api.post("/auth/refresh-token", {});
        setAccessToken(refreshRes.data.accessToken);
        setUser(refreshRes.data.user);
      } catch {
        // no valid session, so the user just stays logged out
      } finally {
        setInitializing(false);
      }
    };
    restoreSession();
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post("/auth/login", credentials);
      setAccessToken(response.data.accessToken);
      setUser(response.data.user);

      return response.data.user;
    } catch (err) {
      setError(getErrorMessage(err, "Login failed"));

      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      //
    } finally {
      setAccessToken(null);
      setUser(null);
      navigate("/login");
    }
  };

  const register = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      await api.post("/auth/register", credentials);

      return true;
    } catch (err) {
      setError(getErrorMessage(err, "Registration failed"));

      return false;
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async ({ email, code, }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post("/auth/verify-otp", { email, otp:code });
      const data = response.data ?? {};

      if (data.accessToken) {
        setAccessToken(data.accessToken);
        setUser(data.user);
      }
      return data;
    } catch (err) {
      setError(getErrorMessage(err, "The code didn't work. Check it and try again."));

      return null;
    } finally {
      setLoading(false);
    }
  }
  
  const resendOtp = async ({ email }) => {
    setError(null);
    try {
      await api.post("/auth/resend-otp", { email });

      return true;
    } catch (err) {
      setError(getErrorMessage(err, "We couldn't send a new code. Try again shortly."));

      return false;
    } 
  };

  const requestPasswordReset = async ({ email }) => {
    setLoading(true);
    setError(null);
    try {
      await api.post("/auth/forgot-password", { email });

      return true;
    } catch (err) {
      setError(getErrorMessage(err, "We couldn't send a password reset email. Try again shortly."));

      return false;
    } finally {
      setLoading(false);
    }
  }

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        clearError,
        login,
        logout,
        register,
        verifyOtp,
        resendOtp,
        requestPasswordReset,
        initializing,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
