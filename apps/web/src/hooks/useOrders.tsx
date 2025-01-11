import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import baseURL from '../api/api.ts';
import { CreateOrder, Order } from '../types/index.ts';

export const fetchOrders = async () => {
    const response = await fetch(`${baseURL}/order`);
    if (!response.ok) throw new Error('Failed to fetch orders');
    return response.json();
};

export function useFetchOrders() {
    return useQuery({
        queryKey: ['orders'],
        queryFn: fetchOrders,
    });
}

export const createOrder = async (orderData: CreateOrder): Promise<Order> => {
    const response = await fetch(`${baseURL}/order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
    });
    if (!response.ok) throw new Error('Failed to create order');
    return response.json();
};

export function useCreateOrder() {
    const queryClient = useQueryClient();

    return useMutation<Order, Error, CreateOrder>({
        mutationFn: createOrder,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['orders'] });
        },
    });
}
