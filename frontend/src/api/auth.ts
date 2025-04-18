// change
const API_BASE_URL = import.meta.env.VITE_BASE_URL_API;

export interface AuthResponse {
    accessToken: string;
}

export interface UserRegister {
    username: string,
    password: string,
    firstname?: string,
    lastname?: string,
    location?: string
}

export const register = async (userData: UserRegister): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
        credentials: "include",
    });

    if (!response.ok) {
        console.log(response);
        throw new Error("Registration failed: Username might be taken or server issue.");
    }

    const data: AuthResponse = await response.json();

    // Store access token securely
    localStorage.setItem("accessToken", data.accessToken);

    return data;
};

export const login = async (username: string, password: string): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Login failed: Invalid credentials or server issue.");
    }

    const data: AuthResponse = await response.json();

    // Store access token securely
    localStorage.setItem("accessToken", data.accessToken);
    return data;
};

// Logout securely (removes tokens)
export const logout = async (): Promise<void> => {
    await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        credentials: "include", // Ensures refresh token cookie is cleared
    });

    localStorage.removeItem("accessToken");
};

export const refreshAccessToken = async (): Promise<string | null> => {
    const existingToken = localStorage.getItem("accessToken");

    //Only attempt refresh if there's an existing token
    if (!existingToken) {
        console.log("No access token found, skipping refresh request.");
        return null;
    }

    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: "POST",
        credentials: "include", // Required to send HTTP-only refresh token
    });

    if (!response.ok) {
        console.error("Refresh token failed. Logging out...");
        logout();
        return null;
    }

    const data = await response.json();
    localStorage.setItem("accessToken", data.accessToken);
    return data.accessToken;
};