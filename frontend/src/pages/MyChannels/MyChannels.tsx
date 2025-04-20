import { Alert, Avatar, Box, Button, Card, CardContent, CircularProgress, Grid, Typography } from "@mui/material";
import { useMyChannels } from "./useMyChannels";
import DeleteDialog from "../../components/DeleteDialog/DeleteDialong";
import AddIcon from "@mui/icons-material/Add";
import ChannelDialog from "../../components/ChannelDialog";

const MyChannels = () => {
    const {
        channels,
        onlineCounts,
        error,
        loading,
        openDeleteModal,
        handleDeleteClick,
        confirmDelete,
        closeDeleteModal,
        deleting,
        openCreate,
        closeCreate,
        openEdit,
        closeEdit,
        handleCreateChannel,
        handleUpdateChannel,
        openCreateModal,
        openEditModal,
        selectedChannel
    } = useMyChannels();

    return (
        <>
            <Box sx={{ p: 4, height: "calc(100vh - 72px)" }}>
                {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

                <Typography variant="h4" mb={4}>My Channels</Typography>

                {loading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <>
                        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 3 }}>
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<AddIcon />}
                                onClick={openCreate}
                            >
                                Create
                            </Button>
                        </Box>

                        <Grid container spacing={3}>
                            {channels.map((channel) => (
                                <Grid item key={channel.id} xs={12} sm={6} lg={3}>
                                    <Card sx={{ display: "flex", height: 210, position: "relative" }}>
                                        <Avatar
                                            alt={channel.name}
                                            src={channel.imageUrl
                                                ? `${import.meta.env.VITE_BASE_URL}${channel.imageUrl}`
                                                : "/images/avatar/2.jpg"}
                                            variant="circular"
                                            sx={{
                                                width: { xs: 40, sm: 56, md: 72 },
                                                height: { xs: 40, sm: 56, md: 72 },
                                                m: 2
                                            }}
                                        />
                                        <Box sx={{ display: "flex", flexDirection: "column", flex: 1, p: 2, minWidth: 0 }}>
                                            <CardContent sx={{ flex: 1, minWidth: 0 }}>
                                                <Typography
                                                    variant="h6"
                                                    sx={{
                                                        display: "-webkit-box",
                                                        WebkitBoxOrient: "vertical",
                                                        WebkitLineClamp: 2,
                                                        overflow: "hidden",
                                                        textOverflow: "ellipsis",
                                                    }}
                                                >{channel.name}
                                                </Typography>
                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                    sx={{
                                                        display: "-webkit-box",
                                                        WebkitBoxOrient: "vertical",
                                                        WebkitLineClamp: 2, // 👈 max lines to show
                                                        overflow: "hidden",
                                                        textOverflow: "ellipsis",
                                                        mt: "8px"
                                                    }}
                                                >
                                                    {channel.description || "No description."}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary" mt={1}>
                                                    👥 {onlineCounts[channel.id] || 0} online
                                                </Typography>
                                            </CardContent>
                                            <Box
                                                sx={{
                                                    mt: "auto",
                                                    display: "flex",
                                                    justifyContent: "flex-end",
                                                    gap: 1,
                                                    pr: 2
                                                }}
                                            >
                                                <Button
                                                    size="small"
                                                    color="primary"
                                                    onClick={() => openEdit(channel)}>Edit</Button>
                                                <Button
                                                    size="small"
                                                    color="error"
                                                    onClick={() => handleDeleteClick(channel)}>Delete</Button>
                                            </Box>
                                        </Box>
                                    </Card>
                                </Grid>

                            ))}
                        </Grid>
                    </>
                )}
            </Box>

            <DeleteDialog
                title="Delete Channel"
                description="Are you sure you want to delete the channel?"
                open={openDeleteModal}
                onConfirm={confirmDelete}
                onCancel={closeDeleteModal}
                deleting={deleting}
            />
            <ChannelDialog
                key={1}
                open={openCreateModal}
                onClose={closeCreate}
                onCreate={handleCreateChannel}
                title="Create"
            />

            <ChannelDialog
                key={2}
                open={openEditModal}
                onClose={closeEdit}
                onCreate={handleUpdateChannel}
                channel={selectedChannel}
                title="Edit"
            />
        </>
    );
};

export default MyChannels;