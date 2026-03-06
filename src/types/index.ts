export interface Product {
    id: number;
    name: string;
    category: string;
    vendor: string;
    sku: string;
    rating: number;
    price: number;
    thumbnail?: string; // Добавляем поле для аватарки
}

export interface ProductsResponse {
    products: Product[];
    total: number;
}

export interface ProductsFilters {
    page: number;
    pageSize: number;
    search: string;
    category: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export type SortOrder = 'ascend' | 'descend' | null;

export interface SortParams {
    field: keyof Product | null;
    order: SortOrder;
}

export interface PaginationParams {
    current: number;
    pageSize: number;
    total: number;
}

export const PRODUCT_CATEGORIES = [
    'Все',
    'Аксессуары',
    'Бытовая техника',
    'Телефоны',
    'Игровые приставки',
    'Электроника'
] as const;

export type ProductCategory = typeof PRODUCT_CATEGORIES[number];