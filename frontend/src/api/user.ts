import { fetchData } from "./fetchData";

export interface UserResponse {
  id: string
  username: string;
  firstName?: string | null;
  lastName?: string | null;
  location?: string | null;
  profileImg?: string | null;
  isBanned: boolean;
}

interface User {
  firstName?: string | null;
  lastName?: string | null;
  location?: string | null;
  profileImg?: string | null;
  isBanned: boolean;
}

export const fetchUsers = async (): Promise<UserResponse[]> => {
  return fetchData("/api/users", { method: "GET" });
};
