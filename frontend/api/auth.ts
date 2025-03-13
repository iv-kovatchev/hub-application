import axios from 'axios';
import { AuthCredentials, User } from "../types/user"


const API_URL = "http://localhost:5098/api/auth"

//Login User
export const loginUser = async (credentials: AuthCredentials): Promise<{ message: string }> => {
    const response = await axios.post(`${API_URL}/login`, credentials);
    return response.data;
}

//Register User
export const registerUser = async (credentials: AuthCredentials): Promise<{ message: string }> => {
    const response = await axios.post(`${API_URL}/register`, credentials);
    return response.data;
};

//Get Logged-in User Info
export const getUser = async (): Promise<User> => {
    const response = await axios.get(`${API_URL}/me`);
    return response.data;
};

//Logout User
export const logoutUser = async () => {
    await axios.post(`${API_URL}/logout`);
};
