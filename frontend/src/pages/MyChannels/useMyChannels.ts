import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import { ChannelResponse, createChannel, deleteChannelById, fetchUserChannels, updateChannel } from "../../api/channel";
import { ChannelFormData } from "../../components/ChannelDialog/ChannelDialog";
import * as signalR from "@microsoft/signalr";

export const useMyChannels = () => {
    const { userId } = useAuth();
    const navigate = useNavigate();
    const [channels, setChannels] = useState<ChannelResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [openCreateModal, setOpenCreateModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [selectedChannel, setSelectedChannel] = useState<ChannelResponse | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [onlineCounts, setOnlineCounts] = useState<Record<string, number>>({});

    const fetchOnlineCounts = async () => {
        const token = localStorage.getItem("accessToken");
        if (!token) return;

        const connection = new signalR.HubConnectionBuilder()
            .withUrl(`${import.meta.env.VITE_BASE_URL}/chathub`, {
                accessTokenFactory: () => token,
            })
            .withAutomaticReconnect()
            .build();

        try {
            await connection.start();
            const result = await connection.invoke<Record<string, number>>("GetOnlineUserCounts");
            setOnlineCounts(result);
        } catch (err) {
            console.warn("Failed to fetch online counts:", err);
        } finally {
            await connection.stop();
        }
    };

    const loadChannels = async () => {
        try {
            const data = await fetchUserChannels(userId!);
            setChannels(data);
            await fetchOnlineCounts();
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

    const openCreate = () => setOpenCreateModal(true);
    const closeCreate = () => setOpenCreateModal(false);

    const openEdit = (channel: ChannelResponse) => {
        setSelectedChannel(channel);
        setOpenEditModal(true);
    }


    const closeEdit = () => {
        setOpenEditModal(false);
        setSelectedChannel(null);
    }

    const handleCreateChannel = async (data: ChannelFormData) => {
        const newChannel = await createChannel(data);
        setChannels(prev => [...prev, newChannel]);
        closeCreate();
    };

    const handleUpdateChannel = async (data: ChannelFormData) => {
        await updateChannel(selectedChannel!.id, data);
        await loadChannels();
        closeEdit();
    }

    return {
        channels,
        onlineCounts,
        error,
        loading,
        openDeleteModal,
        handleDeleteClick,
        deleting,
        confirmDelete,
        closeDeleteModal,
        openCreate,
        closeCreate,
        openEdit,
        closeEdit,
        handleCreateChannel,
        handleUpdateChannel,
        openCreateModal,
        openEditModal,
        selectedChannel
    }
}