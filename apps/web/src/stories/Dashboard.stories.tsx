import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Dashboard from '../pages/Dashboard';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

const mockProducts = [
    { _id: '1', name: 'Product 1', price: 100, description: 'Description 1' },
    { _id: '2', name: 'Product 2', price: 200, description: 'Description 2' },
];

const mockCategories = [
    { _id: '1', name: 'Category 1' },
    { _id: '2', name: 'Category 2' },
];

const mockDashboardData = {
    totalOrders: 150,
    averageOrderValue: 99.99,
    totalRevenue: 14998.5,
};

queryClient.setQueryData(['products'], mockProducts);
queryClient.setQueryData(['categories'], mockCategories);
queryClient.setQueryData(['dashboard'], mockDashboardData);

const meta = {
    title: 'Pages/Dashboard',
    component: Dashboard,
    parameters: {
        layout: 'centered',
    },
    decorators: [
        (Story) => (
            <QueryClientProvider client={queryClient}>
                <div style={{ padding: 20, maxWidth: 1200 }}>
                    <Story />
                </div>
            </QueryClientProvider>
        ),
    ],
    tags: ['autodocs'],
} satisfies Meta<typeof Dashboard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = {
    parameters: {
        mockData: [
            {
                url: '*/dashboard',
                method: 'GET',
                status: 200,
                delay: 2000,
                response: mockDashboardData,
            },
        ],
    },
};

export const WithFilters: Story = {
    parameters: {
        mockData: [
            {
                url: '*/dashboard?categoryId=1',
                method: 'GET',
                status: 200,
                response: {
                    ...mockDashboardData,
                    totalOrders: 50,
                    averageOrderValue: 120,
                    totalRevenue: 6000,
                },
            },
        ],
    },
};
