import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { LoadingState } from "./components/dashboard/ui";

// page layouts
const LazyMainLayout = lazy(() => import("./layout/MainLayout"));

// pages
const LazyHomePage = lazy(() => import("./pages/LandingPage"));
const LazyLoginPage = lazy(() => import("./pages/LoginPage"));
const LazySignupPage = lazy(() => import("./pages/SignupPage"));
const LazyForgotPasswordPage = lazy(() => import("./pages/ForgetPasswordPage"));
const LazyVerifyOtpPage = lazy(() => import("./pages/VerifyOtpPage"));
const LazyResetPasswordPage = lazy(() => import("./pages/ResetPasswordPage"));
const LazyNotFoundPage = lazy(() => import("./pages/NotFoundPage"));

// public
const LazyPropertiesPage = lazy(() => import("./pages/public/PublicPropertiesPage"));
const LazyPropertyDetailPage = lazy(() => import("./pages/public/PropertyDetailPage"));

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
const LazyAccountSecurityPage = lazy(
  () => import("./pages/superadmin/AccountSecurityPage"),
);

// admin
const LazyProtectedRoute = lazy(() => import("./components/ProtectedRoute"));
const LazyAdminLandingPage = lazy(
  () => import("./pages/admin/AdminLandingPage"),
);
const LazyLeads = lazy(() => import("./pages/company/LeadsPage"));

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
      <Suspense fallback={<LoadingState />}>
        <Routes>
          <Route path="/" element={<LazyMainLayout />}>
            <Route index element={<LazyHomePage />} />
            <Route path="properties" element={<LazyPropertiesPage />} />
            <Route path="properties/:propertyId" element={<LazyPropertyDetailPage />} />
            {/* Any unknown URL (e.g. /terms before it exists) shows a 404 instead of a blank page */}
            <Route path="*" element={<LazyNotFoundPage />} />
          </Route>
          <Route path="login" element={<LazyLoginPage />} />
          <Route path="signup" element={<LazySignupPage />} />
          <Route path="forgot-password" element={<LazyForgotPasswordPage />} />
          <Route path="verify-otp" element={<LazyVerifyOtpPage />} />
          <Route path="reset-password" element={<LazyResetPasswordPage />} />
          <Route element={<LazyProtectedRoute allowedRoles={["superadmin"]} />}>
            <Route
              path="/superadmin"
              element={<LazySuperAdminLayout />}
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
              <Route path="account" element={<LazyAccountSecurityPage />} />
              <Route path="*" element={<LazyNotFoundPage />} />
            </Route>
          </Route>
          <Route
            element={<LazyProtectedRoute allowedRoles={["Company Admin"]} />}
          >
            <Route
              path="/admin"
              element={
                <LazyDashboardLayout role="admin" />
              }
            >
              <Route index element={<LazyAdminLandingPage />} />
              <Route path="leads" element={<LazyLeads />} />
              <Route path="*" element={<LazyNotFoundPage />} />
            </Route>
          </Route>
          <Route
            element={<LazyProtectedRoute allowedRoles={["Sales Partner"]} />}
          >
            <Route
              path="/salespartner"
              element={
                <LazyDashboardLayout role="salespartner" />
              }
            >
              <Route index element={<LazySalesPartnerLandingPage />} />
              {/* Same approved, listed properties the public sees */}
              <Route path="properties" element={<LazyPropertiesPage />} />
              <Route path="properties/:propertyId" element={<LazyPropertyDetailPage />} />
              <Route path="*" element={<LazyNotFoundPage />} />
            </Route>
          </Route>
          <Route element={<LazyProtectedRoute allowedRoles={["Client"]} />}>
            <Route
              path="/clients"
              element={
                <LazyDashboardLayout role="client" />
              }
            >
              <Route index element={<LazyClientsLandingPage />} />
              <Route path="*" element={<LazyNotFoundPage />} />
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
