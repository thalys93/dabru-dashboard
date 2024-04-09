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

interface SuggestionProps {
    userEmail: string;
    userName: string;
    id: string;
    suggestion: string;
}

export const sendSuggestionEmail = async (data: SuggestionProps, userToken: string) => {
    try {      
        const res = await apiURL_Local.post(`auth/send-suggestions`, data , {
            headers: {
                Authorization: `Bearer ${userToken}`
            },
        });
        return res.data;
    } catch (err) {
        throw 500;
    }
}

interface ReportProps {
    userEmail: string;
    userName: string;
    id: string;
    errorReport: string;
}
export const sendReportEmail = async (data: ReportProps,  userToken: string) => {
    try {    
        const res = await apiURL_Local.post(`auth/send-report`, data, {
            headers: {
                Authorization: `Bearer ${userToken}`
            },       
        });
        return res.data;
    } catch (err) {
        throw 500;
    }
}


