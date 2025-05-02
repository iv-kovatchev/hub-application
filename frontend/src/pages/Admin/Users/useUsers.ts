import { useEffect, useState } from "react";
import { fetchUsers, UserResponse } from "../../../api/user";

export const useUsers = () => {
    const [users, setUsers] = useState<UserResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [openBanModal, setOpenBanModal] = useState(false);
    const [banning, setBanning] = useState(false);

    useEffect(() => {
        const loadUsers = async () => {
            try {
                const data = await fetchUsers()
    
                console.log(data);
                setUsers(data);
            } catch (err) {
                setError("Failed to fetch channels.");
            } finally {
                setLoading(false);
            }
        };

        loadUsers();
    }, []);

    const closeBanModal = () => {
        setOpenDeleteModal(false);
        setSelectedChannel(null);
    };

    return {
        users,
        loading,
        error
    }
}