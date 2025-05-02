import { Alert, Box, CircularProgress, Container, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import ChannelsTable from "../../../components/ChannelsTable";
import ChannelDialog from "../../../components/ChannelDialog";
import DeleteDialog from "../../../components/DeleteDialog/DeleteDialong";
import { useChannels } from "./useChannels";

const Channels = () => {
    const { user } = useAuth();

    const {
        loading,
        error,
        channels,
        openDeleteModal,
        handleDeleteClick,
        confirmDelete,
        closeDeleteModal,
        deleting,
        openEdit,
        closeEdit,
        handleUpdateChannel,
        openEditModal,
        selectedChannel
    } = useChannels();

    return (
        <>
            <Container maxWidth="lg">
                {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

                {loading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <>
                        <Typography variant="h6" sx={{ mt: 2 }}>
                            Welcome, {user}!
                        </Typography>

                        <Typography variant="h6" sx={{ mt: 2 }}>
                            Available Channels:
                        </Typography>

                        <ChannelsTable
                            channels={channels}
                            handleDeleteClick={handleDeleteClick}
                            openEdit={openEdit}
                        />
                    </>
                )}
            </Container>

            <ChannelDialog
                key={2}
                open={openEditModal}
                onClose={closeEdit}
                onCreate={handleUpdateChannel}
                channel={selectedChannel}
                title="Edit"
            />

            <DeleteDialog
                title="Delete Channel"
                description="Are you sure you want to delete the channel?"
                open={openDeleteModal}
                onConfirm={confirmDelete}
                onCancel={closeDeleteModal}
                deleting={deleting}
            />
        </>
    );
}

export default Channels;