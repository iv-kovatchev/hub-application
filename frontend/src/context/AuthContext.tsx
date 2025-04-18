import React, { createContext, useContext, useEffect, useState } from "react";
import {
  login as apiLogin,
  logout as apiLogout,
  refreshAccessToken,
  register as apiRegister,
  UserRegister
} from "../api/auth";
import { jwtDecode } from "jwt-decode";

interface AuthContextType {
  userId: string | null;
  user: string | null;
  userRole: string | null;
  loading: boolean;
  register: (userData: UserRegister) => Promise<void>;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

interface JwtPayload {
  sub: string,
  unique_name: string;
  role?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create a provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      try {
        const decoded: JwtPayload = jwtDecode(token);
        setUser(decoded.unique_name);
        setUserId(decoded.sub);
        setUserRole(decoded.role || "User");
        setLoading(false);
      } catch (error) {
        console.error("Error decoding token:", error);
        logout();
      }
    } else {
      refreshAccessToken().then((newToken) => {
        if (newToken) {
          console.log("Refresh successful. User is authenticated.");
          localStorage.setItem("accessToken", newToken);

          try {
            const decoded: JwtPayload = jwtDecode(newToken);
            setUserId(null);
            setUser(decoded.unique_name);
            setUserRole(decoded.role || "User");
          } catch (error) {
            console.error("Error decoding refreshed token:", error);
            logout();
          }
        } else {
          console.log("Refresh failed. User is logged out.");
        }
        setLoading(false);
      });
    }
  }, []);

  // ✅ Register function
  const register = async (userData: UserRegister) => {
    const data = await apiRegister(userData);

    if (data.accessToken) {
      localStorage.setItem("accessToken", data.accessToken); // Store token

      setUser(userData.username); // Automatically log in after registration
    }
  };

  const login = async (username: string, password: string) => {
    const data = await apiLogin(username, password);
    if (data.accessToken) {
      try {
        const decoded: JwtPayload = jwtDecode(data.accessToken);
        setUserId(decoded.sub);
        setUser(decoded.unique_name);
        setUserRole(decoded.role || "User");
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  };

  const logout = () => {
    apiLogout();
    setUserId(null);
    setUser(null);
    setUserRole(null);
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ userId, user, userRole, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use AuthContext
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};