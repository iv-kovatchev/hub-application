import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const GuestRoute: React.FC = () => {
  const { user } = useAuth();

  return user ? <Navigate to="/dashboard" replace /> : <Outlet />;
};

export default GuestRoute;
