import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Box, CircularProgress } from "@mui/material";

const AdminRoute = () => {
    const { user, userRole, loading } = useAuth();

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                <CircularProgress /> {/* ✅ Show loading spinner while checking auth */}
            </Box>
        );
    }

    return user && userRole === "Admin" ? <Outlet /> : <Navigate to="/dashboard" replace />;
};

export default AdminRoute;