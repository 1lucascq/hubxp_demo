import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CreateProduct, CreateProductBeforeImage, Product } from '../types/index';
import baseURL from '../api/api.ts';

const fetchProducts = async (): Promise<Product[]> => {
    const response = await fetch(`${baseURL}/product`);
    if (!response.ok) throw new Error('Failed to fetch products');
    return response.json();
};

export function useProducts() {
    return useQuery<Product[]>({
        queryKey: ['products'],
        queryFn: fetchProducts,
        select: (data) =>
            data.map((product) => ({
                ...product,
                isInCart: false,
            })),
    });
}

const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${baseURL}/upload/image`, {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) throw new Error('Failed to upload image');
    const { imageUrl } = await response.json();
    return imageUrl;
};

const createProduct = async (productData: CreateProductBeforeImage): Promise<Product> => {
    const imageUrl = await uploadImage(productData.imageFile);

    const productPayload = {
        name: productData.name,
        description: productData.description,
        price: productData.price,
        imageUrl: imageUrl,
        categories: productData.categories,
    };

    const response = await fetch(`${baseURL}/product`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productPayload),
    });

    if (!response.ok) throw new Error('Failed to create product');
    return response.json();
};

export function useCreateProduct() {
    const queryClient = useQueryClient();

    // <Return type of `createProduct`, Error, Input type for `mutate`>
    return useMutation<Product, Error, CreateProductBeforeImage>({
        mutationFn: createProduct,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
        },
    });
}

const editProduct = async (productId: string, productData: Partial<CreateProduct>): Promise<Product> => {
    const response = await fetch(`${baseURL}/product/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
    });
    if (!response.ok) throw new Error('Failed to edit product');
    return response.json();
};

export function useEditProduct() {
    const queryClient = useQueryClient();

    return useMutation<Product, Error, { productId: string; productData: Partial<CreateProduct> }>({
        mutationFn: ({ productId, productData }) => editProduct(productId, productData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
        },
    });
}

const deleteProduct = async (productId: string): Promise<void> => {
    const response = await fetch(`${baseURL}/product/${productId}`, {
        method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete product');
};

export function useDeleteProduct() {
    const queryClient = useQueryClient();

    return useMutation<void, Error, string>({
        mutationFn: deleteProduct,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
        },
    });
}
