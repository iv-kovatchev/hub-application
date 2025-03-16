import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminRoute = () => {
    const { user, userRole } = useAuth();

    return user && userRole === "Admin" ? <Outlet /> : <Navigate to="/dashboard" replace />;
};

export default AdminRoute;