import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { ChannelResponse, deleteChannelById, fetchChannels, updateChannel } from "../../../api/channel";
import { ChannelFormData } from "../../../components/ChannelDialog/ChannelDialog";

export const useChannels = () => {
    const { userId } = useAuth();
    const navigate = useNavigate();
    const [channels, setChannels] = useState<ChannelResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [selectedChannel, setSelectedChannel] = useState<ChannelResponse | null>(null);
    const [deleting, setDeleting] = useState(false);

    const loadChannels = async () => {
        try {
            const data = await fetchChannels()
            setChannels(data);
        } catch (err) {
            setError("Failed to fetch channels.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!userId) {
            navigate("/sign");
            return;
        }

        loadChannels();
    }, [userId, navigate]);

    const handleDeleteClick = (channel: ChannelResponse) => {
        setSelectedChannel(channel);
        setOpenDeleteModal(true);
    }

    const confirmDelete = async () => {
        if (!selectedChannel) return;

        try {
            setDeleting(true);
            await deleteChannelById(selectedChannel.id);
            setChannels(prev => prev.filter(c => c.id !== selectedChannel.id));
            closeDeleteModal();
        } finally {
            setDeleting(false);
        }
    };

    const closeDeleteModal = () => {
        setOpenDeleteModal(false);
        setSelectedChannel(null);
    };

    const openEdit = (channel: ChannelResponse) => {
        setSelectedChannel(channel);
        setOpenEditModal(true);
    }


    const closeEdit = () => {
        setOpenEditModal(false);
        setSelectedChannel(null);
    }

    const handleUpdateChannel = async (data: ChannelFormData) => {
        await updateChannel(selectedChannel!.id, data);
        await loadChannels();
        closeEdit();
    }

    return {
        channels,
        error,
        loading,
        openDeleteModal,
        handleDeleteClick,
        deleting,
        confirmDelete,
        closeDeleteModal,
        openEdit,
        closeEdit,
        handleUpdateChannel,
        openEditModal,
        selectedChannel
    }
}