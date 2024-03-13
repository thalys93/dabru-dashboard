import { apiURL_Local } from "./api";

export interface userData {
    name: string;
    lastName: string;
    email: string;
    avatar: string;
    role?: string;
    createdAt?: string;
    updatedAt?: string;
    phone:string;
    gender: string;
    birthDate: string;
}

export const getUserData = async (token: string, id: string) => {
    try {
        const res = await apiURL_Local.get('api/users/' + id, {
            headers: {
                Authorization: `Bearer ${token}`
            }            
        });

        return res.data;
    } catch {
        throw 500;
    }
}

export const patchUserData = async (token: string, id: string, userData: userData) => {
    try {
        const res = await apiURL_Local.patch('api/users/' + id, userData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return res.data;
    } catch {
        throw 500;
    }
}