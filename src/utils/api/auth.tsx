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

export const sendSuggestionEmail = async (userEmail: string, userName: string, suggestion: string, userToken: string) => {
    try {
        const sendData = {
            userEmail,
            userName,
            suggestion
        }
        const res = await apiURL_Local.post(`auth/send-suggestions`, sendData , {
            headers: {
                Authorization: `Bearer ${userToken}`
            },
        });
        return res.data;
    } catch (err) {
        throw 500;
    }
}

export const sendReportEmail = async (userEmail: string, userName: string, errorReport: string, userToken: string) => {
    try {
        const sendData = {
            userEmail,
            userName,
            errorReport
        }

        const res = await apiURL_Local.post(`auth/send-report`, sendData, {
            headers: {
                Authorization: `Bearer ${userToken}`
            },       
        });
        return res.data;
    } catch (err) {
        throw 500;
    }
}


