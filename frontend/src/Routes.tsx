import { Routes, Route, Navigate } from "react-router-dom";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard/Dashboard";
import GuestRoute from "./routes/AuthRoute";
import ProtectedRoute from "./routes/ProtectedRoute";
import AdminRoute from "./routes/AdminRoute";
import MyChannels from "./pages/MyChannels/MyChannels";
import Channel from "./pages/Channel";
import { Channels, Users } from "./pages/Admin";

const AppRoutes: React.FC = () => {

    return (
        <Routes>
            {/* Guest Route: Redirects logged-in users to Dashboard */}
            <Route element={<GuestRoute />}>
                <Route path="/sign" element={<Auth />} />
            </Route>

            {/* Protected Route: Redirects unauthenticated users to Login */}
            <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/my-channels" element={<MyChannels />} />
                <Route path="/channels/connected" element={<Channel />} />
            </Route>

            {/* Admin-Only Route */}
            <Route element={<AdminRoute />}>
                <Route path="/admin/users" element={<Users />} />
                <Route path="/admin/channels" element={<Channels />} />
            </Route>

            {/* Default Redirect */}
            <Route path="*" element={<Navigate to="/sign" />} />
        </Routes>
    );
};

export default AppRoutes;
