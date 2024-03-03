import { apiURL_Local } from "./api";
import { APIsendOrder } from "./orders";

export interface clientData {
    name: string;
    email: string;
    address: [];
    phone: string;
    lastName: string;
    request: APIsendOrder[];
}

// Rotas Públicas
export const getClients = async () => {
    try {
        const res = await apiURL_Local.get(`api/clients`);
        return res.data;
    } catch {
        throw 500;
    }
}

// Rotas Privadas
export const getAllClients = async (token: string) => {
    try {
        const res = await apiURL_Local.get(`auth/clients/`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return res.data;
    } catch {
        throw 500;
    }

}

export const getClientByID = async (id:string, token: string) => {
    try {
        const res = await apiURL_Local.get(`auth/clients/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return res.data;
    } catch {
        throw 500;
    }
}

export const patchClients = async (id: string, clientData: clientData, token: string) => {
    try {
        const res = await apiURL_Local.patch(`auth/clients/${id}`, clientData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return res.data;
    } catch {
        throw 500;
    }
}

export const deleteClients = async (id: string, token: string) => {
    try {
        const res = await apiURL_Local.delete(`auth/clients/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return res.data;
    } catch {
        throw 500;
    }
}