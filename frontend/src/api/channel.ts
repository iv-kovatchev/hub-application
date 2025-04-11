import { fetchData } from "./fetchData";

export interface ChannelResponse {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null; 
  createdByUserName: string;
}

export const fetchChannels = async (): Promise<ChannelResponse[]> => {
    return fetchData("/api/channels", { method: "GET" });
};