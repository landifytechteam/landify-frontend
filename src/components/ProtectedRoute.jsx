import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "../context/useAuth"
import { authRoutes, homeForRole, getRole } from "../data/auth";


const ProtectedRoute = ({ allowedRoles }) => {
    const { isAuthenticated, user, initializing } = useAuth();
    const location = useLocation();
    
    if (initializing) return <p className="p-8 text-center text-body">Loading...</p>

    if (!isAuthenticated) {
        return <Navigate to={authRoutes.login} replace state={{ from: location.pathname }} />;
    }

    if (allowedRoles && !allowedRoles.includes(getRole(user))) {
        return <Navigate to={homeForRole[getRole(user)] ?? "/"} replace />
    }

    return  <Outlet />
};

export default ProtectedRoute;