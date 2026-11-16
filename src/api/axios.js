import axios from "axios";

// .env  →  VITE_BASE_URL=https://landify-backend.onrender.com/api
// Auth lives at /auth/... and everything else at /v1/..., both under /api.
const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  withCredentials: true, // send the httpOnly refresh-token cookie
});

let accessToken = null;
export const setAccessToken = (token) => {
  accessToken = token;
};

// AuthContext registers a function here so we can log the user out
// when the session can't be renewed.
let onSessionExpired = () => {};
export const setOnSessionExpired = (fn) => {
  onSessionExpired = fn;
};

// 1. Attach the access token to every request
api.interceptors.request.use((config) => {
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});

// 2. If a request fails with 401, get a new access token once, then retry it.
//    Several requests can fail at the same moment, so they all wait for ONE refresh.
let refreshing = null;

// Calls made while logged out (or the refresh itself). A 401 from these means
// "wrong password / bad code", not "token expired", so never refresh-and-retry them.
// Logged-in /auth calls (e.g. /auth/super-admin/credentials) are NOT listed, so they do refresh.
const PUBLIC_AUTH_PATHS = [
  "/auth/login",
  "/auth/register",
  "/auth/google",
  "/auth/logout",
  "/auth/refresh-token",
  "/auth/verify-otp",
  "/auth/resend-otp",
  "/auth/forgot-password",
  "/auth/reset-password",
];

export function refreshAccessToken() {
  refreshing ??= api
    .post("/auth/refresh-token")
    .then((res) => {
      setAccessToken(res.data.accessToken);
      return res.data.accessToken;
    })
    .finally(() => {
      refreshing = null;
    });
  return refreshing;
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    const isPublicAuthCall = PUBLIC_AUTH_PATHS.some((path) => original?.url?.startsWith(path));

    if (error.response?.status === 401 && original && !isPublicAuthCall && !original._retried) {
      original._retried = true;
      try {
        await refreshAccessToken();
        return api(original); // the request interceptor adds the new token
      } catch {
        setAccessToken(null);
        onSessionExpired();
      }
    }
    return Promise.reject(error);
  },
);

export default api;