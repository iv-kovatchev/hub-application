import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Box, CircularProgress } from "@mui/material";

const ProtectedRoute: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
            <CircularProgress /> {/* ✅ Show loading spinner while checking auth */}
        </Box>
    );
}

  return user ? <Outlet /> : <Navigate to="/sign" replace />;
};

export default ProtectedRoute;
