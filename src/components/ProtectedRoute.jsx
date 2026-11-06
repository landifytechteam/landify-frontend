import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "../context/useAuth"
import { authRoutes, homeForRole } from "../data/auth";


const ProtectedRoute = ({ allowedRoles }) => {
    const { isAuthenticated, user, initializing } = useAuth();
    const location = useLocation();

    if (initializing) return <p className="p-8 text-center text-body">Loading...</p>

    if (!isAuthenticated) {
        return <Navigate to={authRoutes.login} replace state={{ from: location.pathname }} />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to={homeForRole[user.role] ?? "/"} replace />
    }

    return  <Outlet />
};

export default ProtectedRoute;