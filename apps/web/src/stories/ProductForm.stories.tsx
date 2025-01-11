import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import ProductForm from '../components/product/ProductForm.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();
queryClient.setQueryData(
    ['categories'],
    [
        { _id: '1', name: 'Electronics' },
        { _id: '2', name: 'Books' },
        { _id: '3', name: 'Clothing' },
    ],
);

const meta = {
    title: 'Forms/ProductForm',
    component: ProductForm,
    parameters: {
        layout: 'centered',
    },
    decorators: [
        (Story) => (
            <QueryClientProvider client={queryClient}>
                <Story />
            </QueryClientProvider>
        ),
    ],
    tags: ['autodocs'],
} satisfies Meta<typeof ProductForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
    args: {
        submitButtonText: 'Create Product',
        onSubmit: (data) => console.log('Form submitted:', data),
    },
};

export const WithInitialData: Story = {
    args: {
        submitButtonText: 'Edit Product',
        initialData: {
            name: 'Example Product',
            description: 'This is an example product description',
            price: 99.99,
            categories: [
                { _id: '1', name: 'Electronics' },
                { _id: '2', name: 'Books' },
            ],
        },
        onSubmit: (data) => console.log('Form submitted:', data),
        onDelete: () => console.log('Delete clicked'),
    },
};
