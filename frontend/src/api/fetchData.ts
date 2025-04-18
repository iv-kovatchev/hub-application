import { refreshAccessToken, logout } from "./auth";

const API_BASE_URL = import.meta.env.VITE_BASE_URL;

export const fetchData = async (endpoint: string, options: RequestInit = {}): Promise<any> => {
  let token = localStorage.getItem("accessToken");

  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const config: RequestInit = {
    ...options,
    headers,
    credentials: "include",
  };

  let response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (response.status === 401) {
    console.warn("Access token expired, attempting refresh...");

    const newToken = await refreshAccessToken();
    if (!newToken) {
      console.error("Refresh token failed. Logging out.");
      logout();
      return null;
    }

    headers.Authorization = `Bearer ${newToken}`;
    response = await fetch(`${API_BASE_URL}${endpoint}`, { ...config, headers });

    if (response.status === 401) {
      console.error("Token refresh failed again. Logging out.");
      logout();
      return null;
    }
  }

  if (!response.ok) {
    let message = `API Error: ${response.statusText}`;
    const body = await response.json();

    if (body?.message) {
      message = body.message;
    }

    throw new Error(message);
  }

  if (response.status === 204) return null;

  return response.json();
};
