import { Product, ProductsResponse, ProductsFilters } from '../types';

interface DummyJSONProduct {
    id: number;
    title: string;
    description: string;
    category: string;
    price: number;
    discountPercentage: number;
    rating: number;
    stock: number;
    tags: string[];
    brand: string;
    sku: string;
    weight: number;
    dimensions: {
        width: number;
        height: number;
        depth: number;
    };
    warrantyInformation: string;
    shippingInformation: string;
    availabilityStatus: string;
    reviews: {
        rating: number;
        comment: string;
        date: string;
        reviewerName: string;
        reviewerEmail: string;
    }[];
    returnPolicy: string;
    minimumOrderQuantity: number;
    meta: {
        createdAt: string;
        updatedAt: string;
        barcode: string;
        qrCode: string;
    };
    images: string[];
    thumbnail: string;
}

interface DummyJSONResponse {
    products: DummyJSONProduct[];
    total: number;
    skip: number;
    limit: number;
}

const convertDummyProduct = (product: DummyJSONProduct): Product => ({
    id: product.id,
    name: product.title,
    category: product.category,
    vendor: product.brand || 'Неизвестный бренд',
    sku: product.sku || `SKU-${product.id}`,
    rating: product.rating,
    price: product.price,
    thumbnail: product.images[0],
});

export const fetchProducts = async (filters: ProductsFilters): Promise<ProductsResponse> => {
    try {
        let url = 'https://dummyjson.com/products';
        const params = new URLSearchParams({
            limit: filters.pageSize.toString(),
            skip: ((filters.page - 1) * filters.pageSize).toString(),
        });

        // Сортировка (DummyJSON поддерживает sortBy и order)
        if (filters.sortBy) {
            params.append('sortBy', filters.sortBy);
            params.append('order', filters.sortOrder || 'asc');
        }

        if (filters.search) {
            url = `https://dummyjson.com/products/search?q=${encodeURIComponent(filters.search)}`;
            if (params.toString()) {
                url += `&${params.toString()}`;
            }
        } else if (filters.category && filters.category !== 'all' && filters.category !== 'Все') {
            url = `https://dummyjson.com/products/category/${encodeURIComponent(filters.category)}?${params.toString()}`;
        } else {
            url += `?${params.toString()}`;
        }

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: DummyJSONResponse = await response.json();

        return {
            products: data.products.map(convertDummyProduct),
            total: data.total,
        };
    } catch (error) {
        console.error('Ошибка загрузки продуктов:', error);
        throw error;
    }
};
