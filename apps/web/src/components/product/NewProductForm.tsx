import React from 'react';
import { useCreateProduct } from '../../hooks/useProducts.tsx';
import ProductForm from './ProductForm.tsx';

interface NewProductFormProps {
    onClose: () => void;
}

export default function NewProductForm({ onClose }: NewProductFormProps) {
    const { mutate: createProduct } = useCreateProduct();

    const handleSubmit = (data: any) => {
        createProduct(data, {
            onSuccess: () => {
                onClose();
            },
        });
    };

    return <ProductForm onSubmit={handleSubmit} submitButtonText="Create Product" />;
}
