import { useQuery } from '@tanstack/react-query';
import baseURL from '../api/api.ts';

interface DashboardFilters {
    categoryId?: string;
    productId?: string;
}

export const fetchDashboardData = async (filters?: DashboardFilters) => {
    let URL = `${baseURL}/dashboard`;
    if (filters) {
        const params = new URLSearchParams();
        if (filters.categoryId) params.append('categoryId', filters.categoryId);
        if (filters.productId) params.append('productId', filters.productId);

		const queryString = params.toString();
        if (queryString) URL += `?${queryString}`;
    }
    const response = await fetch(URL);

    if (!response.ok) throw new Error('Failed to fetch dashboard data');
    return response.json();
};

export function useFetchDashboardData(filters?: DashboardFilters) {
	const serializedFilters = JSON.stringify(filters || {});
	const cacheTime = 10 * 60 * 1000;
    return useQuery({
        queryKey: ['dashboard', serializedFilters],
        queryFn: () => fetchDashboardData(filters),
		staleTime: cacheTime,
    });
}
