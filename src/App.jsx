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
const LazyDashboardLayout = lazy(() =>
  import("./components/dashboard/DashboardLayout").then((m) => ({
    default: m.DashboardLayout,
  })),
);
// superadmin
const LazySuperAdminLayout = lazy(
  () => import("./pages/superadmin/SuperAdminLayout"),
);
const LazySuperAdminLandingPage = lazy(
  () => import("./pages/superadmin/SuperAdminDashboard"),
);
const LazyCompaniesPage = lazy(
  () => import("./pages/superadmin/CompaniesPage"),
);
const LazyCompanyDetailPage = lazy(
  () => import("./pages/superadmin/CompanyDetailPage"),
);
const LazyAdminAccessPage = lazy(
  () => import("./pages/superadmin/AdminAccessPage"),
);
const LazyModerationQueuePage = lazy(
  () => import("./pages/superadmin/ModerationQueuePage"),
);
const LazySubmissionReviewPage = lazy(
  () => import("./pages/superadmin/SubmissionReviewPage"),
);
const LazyAllPropertiesPage = lazy(
  () => import("./pages/superadmin/AllPropertiesPage"),
);
const LazyAuditActivityPage = lazy(
  () => import("./pages/superadmin/AuditActivityPage"),
);
const LazySystemSettingsPage = lazy(
  () => import("./pages/superadmin/SystemSettingsPage"),
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
          <Route element={<LazyProtectedRoute allowedRoles={["superadmin"]} />}>
            <Route
              path="/superadmin"
              element={
                <LazySuperAdminLayout
                  role="superadmin"
                  badges={{ moderation: 8 }}
                />
              }
            >
              <Route index element={<LazySuperAdminLandingPage />} />
              <Route path="companies" element={<LazyCompaniesPage />} />
              <Route
                path="companies/:companyId"
                element={<LazyCompanyDetailPage />}
              />
              <Route path="admins" element={<LazyAdminAccessPage />} />
              <Route path="moderation" element={<LazyModerationQueuePage />} />
              <Route
                path="moderation/:submissionId"
                element={<LazySubmissionReviewPage />}
              />
              <Route path="properties" element={<LazyAllPropertiesPage />} />
              <Route path="audit" element={<LazyAuditActivityPage />} />
              <Route path="settings" element={<LazySystemSettingsPage />} />
            </Route>
          </Route>
          <Route
            element={<LazyProtectedRoute allowedRoles={["Company Admin"]} />}
          >
            <Route
              path="/admin"
              element={
                <LazyDashboardLayout role="admin" badges={{ moderation: 8 }} />
              }
            >
              <Route index element={<LazyAdminLandingPage />} />
            </Route>
          </Route>
          <Route
            element={<LazyProtectedRoute allowedRoles={["Sales Partner"]} />}
          >
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
              path="/clients"
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
