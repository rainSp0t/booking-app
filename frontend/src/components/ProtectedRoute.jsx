import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ requiredRole }) {
    const { isAuthenticated, role } = useAuth();

    console.log("ProtectedRoute:", {
        isAuthenticated,
        role,
        requiredRole
    });

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (requiredRole && role !== requiredRole) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}