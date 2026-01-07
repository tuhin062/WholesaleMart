export interface User {
    id: string;
    email: string;
    name: string;
    role: 'admin' | 'customer';
    token?: string;
}

export interface Product {
    id: string;
    sku: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    image?: string;
    status: 'active' | 'inactive';
    category?: string;
}

export interface CartItem {
    id: string; // usually product id
    product: Product;
    quantity: number;
}

export interface Order {
    id: string;
    readableId?: number;
    userId: string;
    customerPhone?: string;
    items: Array<{
        productId: string;
        productName: string;
        quantity: number;
        price: number;
    }>;
    total: number;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    createdAt: string;
}

export interface OrderCreate {
    items: {
        product_id: string; // Backend uses snake_case keys in Pydantic input unless configured otherwise, let's check.
        // My Pydantic models are camelCase aware? ConfigDict(populate_by_name=True)?
        // I did NOT set populate_by_name=True on OrderCreate/OrderItemCreate.
        // So I must stick to snake_case for INPUT, or update backend.
        // Let's stick to safe snake_case for input payload to avoid issues.
        quantity: number;
    }[];
}
