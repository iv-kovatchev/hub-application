import { useEffect, useState } from "react";
import { fetchChannels } from "../api/channel";
import { List, ListItem, ListItemText, Typography, CircularProgress, Alert, Container, Box } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

interface Channel {
    id: string;
    name: string;
    description: string;
  }

const Dashboard: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [channels, setChannels] = useState<Channel[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!user) {
            navigate("/sign");
            return;
        }

        const loadChannels = async () => {
            try {
                const data = await fetchChannels();
                setChannels(data);
            } catch (err) {
                setError("Failed to fetch channels.");
            } finally {
                setLoading(false);
            }
        };

        loadChannels();
    }, [user, navigate]);

    return (
        <Container maxWidth="md">
            {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

            {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <>
                    <Typography variant="h6" sx={{ mt: 3 }}>
                        Welcome, {user}!
                    </Typography>

                    <Typography variant="h6" sx={{ mt: 2 }}>
                        Available Channels:
                    </Typography>

                    <List>
                        {channels.length > 0 ? (
                            channels.map((channel, index) => (
                                <ListItem key={index}>
                                    <ListItemText primary={channel.name} secondary={channel.description} />
                                </ListItem>
                            ))
                        ) : (
                            <Typography>No channels available.</Typography>
                        )}
                    </List>
                </>
            )}
        </Container>
    );
};

export default Dashboard;