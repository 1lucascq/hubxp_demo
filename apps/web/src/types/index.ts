export interface Product {
    _id: string;
    name: string;
    price: number;
    imageUrl: string;
    categories: { _id: string; name: string }[];
    description: string;
    isInCart?: boolean;
}

export interface CreateProduct {
    name: string;
    price: number;
    imageUrl: string;
    categories: string[];
    description: string;
}

export interface CreateProductBeforeImage extends Omit<CreateProduct, 'imageUrl'> {
	imageFile: File;
}

export interface Category {
    _id: string;
    name: string;
    products?: { _id: string; name: string }[];
}


export interface CreateCategory {
    name: string;
    products?: string[];
}

export interface Order {
    _id: string;
    total: number;
    date: string;
    products: { _id: string; name: string; price: number }[];
}

export interface CreateOrder {
    total: number;
    date: string;
    products: string[];
}

export interface Dashboard {
    averageOrderValue: number;
    totalOrders: number;
    totalRevenue: number;
}
