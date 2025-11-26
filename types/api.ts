export interface User {
    id: string;
    email: string;
    name: string;
    avatar_url?: string;
    is_store: boolean;
    tier?: string;
    created_at: string;
}

export interface Category {
    id: string;
    name: string;
    slug: string;
    image_url?: string;
}

export interface Language {
    id: string;
    name: string;
    code: string;
    flag_url?: string;
}

export interface Sale {
    id: string;
    name: string;
    description: string;
    price: number | string;
    quantity: number;
    reserved_quantity?: number | null;
    image_url?: string | null;
    status: 'available' | 'reserved' | 'shipped' | 'delivered' | 'completed' | 'cancelled';
    views?: number;
    seller: Partial<User> & { id: string };
    buyer_id?: string | null;
    store_id?: string | null;
    category: Partial<Category> & { id: string };
    language: Partial<Language> & { id: string };
    shipping_proof_url?: string | null;
    delivery_proof_url?: string | null;
    reserved_at?: string | null;
    shipped_at?: string | null;
    delivered_at?: string | null;
    completed_at?: string | null;
    cancelled_at?: string | null;
    original_quantity?: number;
    parent_sale_id?: string | null;
    created_at: string;
}

export interface SalesResponse {
    success?: boolean;
    data: Sale[];
    total: number;
    page: number;
    totalPages: number;
}

export interface Purchase {
    id: string;
    sale: Sale;
    user: User;
    quantity: number;
    total_price: number;
    created_at: string;
}
