import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "../context/useAuth"
import { authRoutes, homeForRole, getRole } from "../data/auth";
import { PageLoader } from "./ui/PageLoader";


const ProtectedRoute = ({ allowedRoles }) => {
    const { isAuthenticated, user, initializing, loggedOutOnPurpose } = useAuth();
    const location = useLocation();
    
    // Page refresh: the session is being restored from the refresh cookie
    if (initializing) return <PageLoader label="Restoring your session…" />;

    if (!isAuthenticated) {
        // Remember the page so login can bring you back, unless you just logged out yourself
        const state = loggedOutOnPurpose ? undefined : { from: location.pathname + location.search };
        return <Navigate to={authRoutes.login} replace state={state} />;
    }

    if (allowedRoles && !allowedRoles.includes(getRole(user))) {
        return <Navigate to={homeForRole[getRole(user)] ?? "/"} replace />
    }

    return  <Outlet />
};

export default ProtectedRoute;