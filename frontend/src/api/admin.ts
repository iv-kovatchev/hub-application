import { fetchData } from "./fetchData";

export const fetchAdminData = async (): Promise<{ message: string }> => {
    return fetchData("/api/admin", { method: "GET" });
};