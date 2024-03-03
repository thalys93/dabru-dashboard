import { apiURL_Local } from "./api";

export interface APIsendOrder {
    client_: string;
    address: [];
    paymentForm: string;
    total: string;
    cartItems: [];
    date: Date;
    sale: []
}

// End Points com Token
export const getOrders = async (token: string) => {
    try {
        const res = await apiURL_Local.get(`auth/request`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });        
        return res.data;
    } catch {
        throw 500;
    }
}

export const getOrdersByID = async (id:string, token: string) => {
    try {
        const res = await apiURL_Local.get(`auth/request/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return res.data;
    } catch {
        throw 500;
    }
}

export const updateOrder = async (id: string, orderData: APIsendOrder, token: string) => {
    try {
        const res = await apiURL_Local.patch(`auth/request/${id}`, orderData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return res.data;
    } catch {
        throw 500;
    }
}

export const deleteOrder = async (id: string, token: string) => {
    try {
        const res = await apiURL_Local.delete(`auth/request/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return res.data;
    } catch {
        throw 500;
    }
}


// End Points Publicos
export const registerOrder = async (orderData: APIsendOrder) => {
    try {
        const res = await apiURL_Local.post(`api/request`, orderData);
        return res.data;
    } catch {
        throw 500;
    }
}