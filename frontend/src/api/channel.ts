import { fetchData } from "./fetchData";

export interface ChannelResponse {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  createdByUserName: string;
}

interface Channel {
  name: string;
  description?: string | null;
  imageUrl?: string | null;
}

export const fetchChannels = async (): Promise<ChannelResponse[]> => {
  return fetchData("/api/channels", { method: "GET" });
};

export const fetchUserChannels = async (userId: string): Promise<ChannelResponse[]> => {
  return fetchData(`/api/channels/user/${userId}`, { method: "GET" });
};

export const createChannel = async (data: Channel): Promise<ChannelResponse> => {
  return fetchData("/api/channels", {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  });
};

export const updateChannel = async (id: string, data: Channel): Promise<ChannelResponse> => {
  return fetchData(`/api/channels/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  });
}

export const deleteChannelById = async (channelId: string): Promise<void> => {
  return fetchData(`/api/channels/${channelId}`, { method: "DELETE" });
}