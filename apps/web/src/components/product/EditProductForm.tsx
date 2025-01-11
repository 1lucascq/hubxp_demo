import React from 'react';
import { Product } from '../../types/index.ts';
import { useEditProduct, useDeleteProduct } from '../../hooks/useProducts.tsx';
import ProductForm from './ProductForm.tsx';

interface EditProductFormProps {
    onClose: () => void;
    initialData: Product;
}

export default function EditProductForm({ onClose, initialData }: EditProductFormProps) {
    const { mutate: editProduct } = useEditProduct();
    const { mutate: deleteProduct } = useDeleteProduct();

    const handleSubmit = (data: any) => {
        editProduct(
            { productId: initialData._id, productData: data },
            {
                onSuccess: () => {
                    onClose();
                },
            },
        );
    };

    const handleDelete = () => {
        deleteProduct(initialData._id, {
            onSuccess: () => {
                onClose();
            },
        });
    };

    return (
        <ProductForm
            initialData={initialData}
            onSubmit={handleSubmit}
            onDelete={handleDelete}
            submitButtonText="Edit Product"
        />
    );
}
