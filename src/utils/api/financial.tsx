import { AuthHeaders, apiURL_Local } from "./api";

export interface APIsendNewOrder {
    customer_: string;
    address: [];
    paymentForm: string;
    total: string;
    cartItems: [];
    date: Date;
}

export interface APIOrderUnformatted {
    id: number;
    customer_: string;
    address: [{
        cep: string;
        city: string;
        state: string;
        number: string;
        street: string;
        complement: string;
        neighborhood: string;
    }];
    paymentForm: string;
    date: Date;
    total: string;
    status: string;
    createdAt?: Date;
    updatedAt?: Date;
    cartItems: [{
        total: number;
        value: number;
        quantity: number;
        product_id: string;
    }];
}

export interface APIOrderResponse {
    id: number;
    customer_name: string; // ? modificado esse campo
    address: [{
        cep: string;
        city: string;
        state: string;
        number: string;
        street: string;
        complement: string;
        neighborhood: string;
    }];
    paymentForm: string;
    paymentIcon?: JSX.Element;
    date: Date;
    total: string;
    status: string;
    createdAt?: Date;
    updatedAt?: Date;    
    items_number?: number;
    items?: [{
        total: number;
        value: number;
        quantity: number;
        product_id: string;
    }];
    color?: string;
    icon?: JSX.Element;
}

export interface UpdateOrderData {
    id: string;
    customer_: string;
    address: [];
    paymentForm: string;
    total: string;
    cartItems: [];
    date: Date;
    status: string;
}


// Parte de Pedidos
export const getOrders = async (token: string) => {
    try {
        const res = await apiURL_Local.get('api/financial/orders', AuthHeaders(token));
        if (res.data.message === 'Nenhum pedido encontrado') {
            return { message: 'Nenhum pedido encontrado', statusCode: 404 }
        } else {
            return { found: res.data.found, statusCode: 302 }
        }
    } catch (e) {
        return { message: 'Erro ao buscar pedidos', statusCode: 500 }
    }
}

export const getOrdersByID = async (id: string | any , token: string) => {
    try {
        const res = await apiURL_Local.get(`api/financial/orders/${id}`, AuthHeaders(token));
        if (res.data.message === 'Pedido não encontrado') {
            return { message: 'Pedido não encontrado', statusCode: 404 }
        } else {
            return { found: res.data.found, statusCode: 302 }
        }
    } catch (e) {
        return { message: 'Erro ao buscar o pedido', statusCode: 500 }
    }
}

export const patchOrderByID = async (id: string, updateOrder: UpdateOrderData, token: string) => {
    try {
        const res = await apiURL_Local.patch(`api/financial/orders/${id}`, updateOrder, AuthHeaders(token));
        if (res.data.message === 'Pedido não encontrado') {
            return { message: 'Pedido não encontrado', statusCode: 404 }
        } else {
            return { message: 'Pedido atualizado com sucesso', statusCode: 200 }
        }
    } catch (e) {
        return { message: 'Erro ao atualizar o pedido', statusCode: 500 }
    }
}

export const deleteOrderByID = async (id: number, token: string) => {
    try {
        const res = await apiURL_Local.delete(`api/financial/orders/${id}`, AuthHeaders(token));
        if (res.data.message === 'Pedido não encontrado') {
            return { message: 'Pedido não encontrado', statusCode: 404 }
        } else {
            return { message: 'Pedido deletado com sucesso', statusCode: 200 }
        }
    } catch (e) {
        return { message: 'Erro ao deletar o pedido', statusCode: 500 }
    }
}

export const postOrder = async (newOrder: APIsendNewOrder, token: string) => {
    try {
        const res = await apiURL_Local.post('api/financial/orders', newOrder, AuthHeaders(token));
        if (res.data.message === 'Pedido Criado') {
            return { message: 'Pedido Criado', statusCode: 201 }
        } else {
            return { message: 'Erro ao criar o pedido', statusCode: 500 }
        }
    } catch (e) {
        return { message: 'Erro ao criar o pedido', statusCode: 500 }
    }
}

export const countOrders = async (token: string) => {
    try {
        const res = await apiURL_Local.get('api/financial/count-orders', AuthHeaders(token));
        return res.data;
    } catch (e) {
        return { message: 'Erro ao contar pedidos', statusCode: 500 }
    }
}


// Parte de Financeiro
export const sumOrdersTotals = async (token: string) => {
    try {
        const res = await apiURL_Local.get('api/financial/sum-orders-totals', AuthHeaders(token));
        return res.data;
    } catch (e) {
        return { message: 'Erro ao somar totais', statusCode: 500 }
    }
}

export const countSales = async (token: string) => {
    try {
        const res = await apiURL_Local.get(`api/financial/sum-sales`, AuthHeaders(token));
        return res.data;
    } catch (e) {
        return { message: 'Erro ao contar Vendas', statusCode: 500 }
    }
}

export const sumCustomers = async (token: string) => {
    try {
        const res = await apiURL_Local.get(`api/financial/sum-customers`, AuthHeaders(token));
        return res.data;
    } catch (e) {
        return { message: 'Erro ao contar clientes', statusCode: 500 }
    }
}

export const getOrdersStatuses = async (token: string) => {
    try {
        const res = await apiURL_Local.get(`api/financial/orders-status`, AuthHeaders(token));
        return res.data;
    } catch (e) {
        return { message: 'Erro ao buscar status dos pedidos', statusCode: 500 }
    }
}

export const getOrderPayments = async (token: string) => {
    try {
        const res = await apiURL_Local.get(`api/financial/orders-payments`, AuthHeaders(token));
        return res.data;
    } catch (e) {
        return { message: 'Erro ao buscar pagamentos dos pedidos', statusCode: 500 }
    }
}

// Clientes
export const getCustomers = async (token: string) => {
    try {
        const res = await apiURL_Local.get(`api/financial/customers`, AuthHeaders(token));
        return res.data;
    } catch (e) {
        return { message: 'Erro ao buscar clientes', statusCode: 500 }
    }
}

