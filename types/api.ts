export interface User {
    id: string;
    email: string;
    name: string;
    avatar_url?: string;
    is_store: boolean;
    created_at: string;
}

export interface Sale {
    id: string;
    name: string;
    description: string;
    price: number;
    quantity: number;
    image_url?: string;
    status: 'available' | 'reserved' | 'shipped' | 'delivered' | 'completed' | 'cancelled';
    seller: User;
    category: Category;
    language: Language;
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

export interface Purchase {
    id: string;
    sale: Sale;
    user: User;
    quantity: number;
    total_price: number;
    created_at: string;
}
