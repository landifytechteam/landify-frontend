import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";

// page layouts
const LazyMainLayout = lazy(() => import("./layout/MainLayout"));

// pages
const LazyHomePage = lazy(() => import("./pages/LandingPage"));
const LazyPropertiesPage = lazy(() => import("./pages/PropertiesPage"));
const LazyLoginPage = lazy(() => import("./pages/LoginPage"));
const LazySignupPage = lazy(() => import("./pages/SignupPage"));
const LazyForgotPasswordPage = lazy(() => import("./pages/ForgetPasswordPage"));
const LazyVerifyOtpPage = lazy(() => import("./pages/VerifyOtpPage"));

// layouts
const LazyDashboardLayout = lazy(
  () => import("./components/dashboard/DashboardLayout"),
);
// superadmin
const LazySuperAdminLandingPage = lazy(
  () => import("./pages/superadmin/SuperAdminDashboard"),
);

// admin
const LazyProtectedRoute = lazy(() => import("./components/ProtectedRoute"));
const LazyAdminLandingPage = lazy(
  () => import("./pages/admin/AdminLandingPage"),
);

// salespartner
const LazySalesPartnerLandingPage = lazy(
  () => import("./pages/salespartner/SalesPartnerLandingPage"),
);

// clients
const LazyClientsLandingPage = lazy(
  () => import("./pages/clients/ClientsLandingPage"),
);

function App() {
  return (
    <>
      <Suspense fallback="Loading...">
        <Routes>
          <Route path="/" element={<LazyMainLayout />}>
            <Route index element={<LazyHomePage />} />
            <Route path="properties" element={<LazyPropertiesPage />} />
          </Route>
          <Route path="login" element={<LazyLoginPage />} />
          <Route path="signup" element={<LazySignupPage />} />
          <Route path="forgot-password" element={<LazyForgotPasswordPage />} />
          <Route path="verify-otp" element={<LazyVerifyOtpPage />} />
          <Route element={<LazyProtectedRoute allowedRoles={["Super Admin"]} />}>
            <Route
              path="/superadmin"
              element={
                <LazyDashboardLayout
                  role="superadmin"
                  badges={{ moderation: 8 }}
                />
              }
            >
              <Route index element={<LazySuperAdminLandingPage />} />
            </Route>
          </Route>
          <Route element={<LazyProtectedRoute allowedRoles={["Company Admin"]} />}>
            <Route
              path="/admin"
              element={
                <LazyDashboardLayout role="admin" badges={{ moderation: 8 }} />
              }
            >
              <Route index element={<LazyAdminLandingPage />} />
            </Route>
          </Route>
          <Route element={<LazyProtectedRoute allowedRoles={["Sales Partner"]} />}>
            <Route
              path="/salespartner"
              element={
                <LazyDashboardLayout
                  role="salespartner"
                  badges={{ moderation: 8 }}
                />
              }
            >
              <Route index element={<LazySalesPartnerLandingPage />} />
            </Route>
          </Route>
          <Route element={<LazyProtectedRoute allowedRoles={["Client"]} />}>
            <Route
              path="/client"
              element={
                <LazyDashboardLayout role="client" badges={{ moderation: 8 }} />
              }
            >
              <Route index element={<LazyClientsLandingPage />} />
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
