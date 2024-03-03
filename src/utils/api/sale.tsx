import { apiURL_Local } from "./api";

export interface saleAPIData {
    request_: string;
    completed: boolean;
    client_: string;
    completedAt: Date;
    failed: boolean;
}

export const getSales = async (token: string) => {
    try {
        const res = await apiURL_Local.get(`api/sale`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return res.data;
    } catch {
        throw 500;
    }
}

export const getSaleByID = async (id:string, token: string) => {
    try {
        const res = await apiURL_Local.get(`api/sale/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return res.data;
    } catch {
        throw 500;
    }
}

export const createSale = async (saleData: saleAPIData, token: string) => {
    try {
        const res = await apiURL_Local.post(`api/sale`, saleData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return res.data;
    } catch {
        throw 500;
    }
}

export const updateSale = async (id: string, saleData: saleAPIData, token: string) => {
    try {
        const res = await apiURL_Local.patch(`api/sale/${id}`, saleData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return res.data;
    } catch {
        throw 500;
    }
}

export const deleteSale = async (id: string, token: string) => {
    try {
        const res = await apiURL_Local.delete(`api/sale/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return res.data;
    } catch {
        throw 500;
    }
}