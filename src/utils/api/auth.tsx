import axios from "axios";
import { apiURL_Local } from "./api";

export interface LoginProps {
    email: string;
    password: string;
}

export const doLogin = async (userData: LoginProps) => {
    try {
        const response = await apiURL_Local.post(`auth/login`, userData);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw (error.response?.status || 500) as number;
        }
        else {
            throw 500;
        }
    }
}

