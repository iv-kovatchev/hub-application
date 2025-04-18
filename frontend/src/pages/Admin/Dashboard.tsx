import { useEffect, useState } from "react";
import { Container, Typography, Alert, CircularProgress } from "@mui/material";
import { fetchAdminData } from "../../api/admin"; // ✅ Import API function

const AdminPage = () => {
    const [adminMessage, setAdminMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        fetchAdminData()
            .then((data) => {

                console.log(data);
                setAdminMessage(data.message);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message || "Access Denied");
                setLoading(false);
            });
    }, []);

    return (
        <Container maxWidth="md">
            <Typography variant="h3" align="center" sx={{ mt: 5 }}>
                Admin Dashboard
            </Typography>
            {loading ? (
                <CircularProgress sx={{ display: "block", margin: "auto", mt: 3 }} />
            ) : error ? (
                <Alert severity="error">{error}</Alert>
            ) : (
                <Typography variant="body1" align="center" sx={{ mt: 2 }}>
                    {adminMessage}
                </Typography>
            )}
        </Container>
    );
};

export default AdminPage;
