import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Category, CreateCategory } from '../types/index.ts';
import baseURL from '../api/api.ts';

const fetchCategories = async (): Promise<Category[]> => {
    const response = await fetch(`${baseURL}/category`);
    if (!response.ok) throw new Error('Failed to fetch categories');
    return response.json();
};

export function useFetchCategories() {
    return useQuery<Category[]>({
        queryKey: ['categories'],
        queryFn: fetchCategories,
        select: (data) =>
            data.map((category) => ({
                ...category,
                isSelected: false,
            })),
    });
}

const createCategory = async (name: CreateCategory): Promise<Category> => {
    const response = await fetch(`${baseURL}/category`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(name),
    });

    if (!response.ok) throw new Error('Failed to create category');
    return response.json();
};

export function useCreateCategory() {
    const queryClient = useQueryClient();

    return useMutation<Category, Error, CreateCategory>({
        mutationFn: createCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
        },
    });
}
