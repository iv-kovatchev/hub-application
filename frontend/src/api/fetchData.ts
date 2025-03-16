import { refreshAccessToken, logout } from "./auth";

const API_BASE_URL = "http://localhost:5098";

export const fetchData = async (endpoint: string, options: RequestInit = {}): Promise<any> => {
  let token = sessionStorage.getItem("accessToken");

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
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
};
