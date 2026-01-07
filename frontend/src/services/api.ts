import axios from 'axios';
import { Product, Order } from '../types';

const API_URL = 'http://localhost:8000';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add the auth token header to every request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const authService = {
    login: async (email: string, password: string): Promise<{ access_token: string; role: string; id: string; name: string }> => {
        const response = await api.post('/auth/login', { email, password });
        return response.data;
    },

    sendOtp: async (phone_number: string) => {
        return api.post('/auth/otp/send', { phone_number });
    },

    verifyOtp: async (phone_number: string, otp: string): Promise<{ access_token: string }> => {
        const response = await api.post('/auth/otp/verify', { phone_number, otp });
        return response.data;
    }
};

export const productService = {
    getPublic: async () => {
        const response = await api.get<Product[]>('/products/catalog/public');
        return response.data;
    },
    getAdmin: async () => {
        const response = await api.get<Product[]>('/products/manage/admin');
        return response.data;
    },
    getAll: async (adminView: boolean = false) => {
        // Deprecated, but keeping for compatibility
        if (adminView) {
            return productService.getAdmin();
        } else {
            return productService.getPublic();
        }
    },
    getOne: async (id: string) => {
        const response = await api.get<Product>(`/products/detail/${id}`);
        return response.data;
    },
    create: async (product: Omit<Product, 'id'>) => {
        const response = await api.post<Product>('/products/', product);
        return response.data;
    },
    update: async (id: string, product: Partial<Product>) => {
        const response = await api.put<Product>(`/products/${id}`, product);
        return response.data;
    },
    delete: async (id: string) => {
        const response = await api.delete(`/products/${id}`);
        return response.data;
    },
    updateStatus: async (id: string, status: 'active' | 'inactive') => {
        const response = await api.patch<Product>(`/products/${id}/status?status=${status}`);
        return response.data;
    }
};

export const orderService = {
    getAll: async () => {
        const response = await api.get<Order[]>('/orders/');
        // Mapping backend response (snake_case or mixed) to frontend interface if needed
        // My backend OrderResponse uses from_attributes=True but default alias generator wasn't set to camelCase globally.
        // So backend sends `user_id`, `created_at`. Frontend expects `userId`, `createdAt`.
        // I should map them here or update backend to force camelCase.
        // Updating backend is cleaner but `api.ts` mapping is safer for now without restarting generic config.
        return response.data.map((order: any) => ({
            ...order,
            userId: order.user_id,
            createdAt: order.created_at,
            readableId: order.readable_id,
            customerPhone: order.customer_phone,
            items: order.items.map((item: any) => ({
                ...item,
                productId: item.product_id,
                productName: item.product_name
            }))
        })) as Order[];
    },
    create: async (items: { product_id: string; quantity: number }[]) => {
        const response = await api.post<Order>('/orders/', { items });
        return response.data;
    },
    updateStatus: async (id: string, status: string) => {
        const response = await api.put<Order>(`/orders/${id}/status?status=${status}`);
        return response.data;
    }
};

export const dashboardService = {
    getStats: async () => {
        const response = await api.get('/dashboard/stats');
        return response.data;
    }
};

export default api;
