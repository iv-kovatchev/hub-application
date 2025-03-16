import { fetchData } from "./fetchData";

export const fetchChannels = async () => {
    return fetchData("/api/channels", { method: "GET" });
  };