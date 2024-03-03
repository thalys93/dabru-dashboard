import { apiURL_Local } from "./api";

export interface APIproduct {
    id: string;
    name: string;
    value: number;
    details: {
        imgLink: string;
        observation: string;
        type: string;
        delivery: boolean;
        dimX: number;
        dimY: number;
    };
    description: string;
    quantity: number;
    colors: string[];
}

export interface APIsendProduct {
    id: string;
    name: string;
    value: number;
    details: {
        imgLink: string;
        observation: string;
        type: string;
        delivery: boolean;
        dimX: number;
        dimY: number;
    };
    description: string;
    quantity: number;
    colors: string[];
}

export const getProducts = async () => {
    try {
        const res = await apiURL_Local.get(`api/products`);
        return res.data;
    } catch {
        throw 500;
    }
}

export const getProductByID = async (id:string) => {
    try {
        const res = await apiURL_Local.get(`api/products/${id}`);
        return res.data;
    } catch {
        throw 500;
    }
}

export const registerProduct = async (productData: APIsendProduct, token: string) => {
    try {
        const res = await apiURL_Local.post(`auth/product`, productData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return res.data;
    } catch {
        throw 500;
    }
}

export const updateProduct = async (id: string, productData: APIproduct, token: string) => {
    try {
        const res = await apiURL_Local.patch(`auth/product/${id}`, productData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return res.data;
    } catch {
        throw 500;
    }
}

export const deleteProduct = async (id: string, token: string) => {
    try {
        const res = await apiURL_Local.delete(`auth/product/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return res.data;
    } catch {
        throw 500;
    }
}