import React, { useState } from 'react';
import Grid2 from '@mui/material/Grid2';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { FormControl, InputLabel, MenuItem, Select, Box, CircularProgress, styled } from '@mui/material';
import { useFetchDashboardData } from '../hooks/useDashboard.tsx';
import { Category, Product } from '../types/index.ts';
import { useQueryClient } from '@tanstack/react-query';

interface KPICardProps {
    title: string;
    value: number;
}

const CustomGrid = styled(Grid2)({
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1rem',
});

function KPICard({ title, value }: KPICardProps) {
    return (
        <Card sx={{ minWidth: 240 }}>
            <CardContent>
                <Typography variant="h6" component="div">
                    {title}
                </Typography>
                <Typography variant="h4" component="div">
                    {value}
                </Typography>
            </CardContent>
        </Card>
    );
}

export default function Dashboard() {
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [selectedProduct, setSelectedProduct] = useState<string>('');

    const queryClient = useQueryClient();
    const products = queryClient.getQueryData<Product[]>(['products']);
    const categories = queryClient.getQueryData<Category[]>(['categories']);

    const filters = {
        ...(selectedCategory && { categoryId: selectedCategory }),
        ...(selectedProduct && { productId: selectedProduct }),
    };

    const { data, isLoading } = useFetchDashboardData(filters);

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box>
            <Grid2 container spacing={2} sx={{ mb: 3 }}>
                <Grid2 size={6}>
                    <FormControl fullWidth>
                        <InputLabel>Category</InputLabel>
                        <Select
                            value={selectedCategory}
                            label="Category"
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                            <MenuItem value="">None</MenuItem>
                            {categories?.map((category) => (
                                <MenuItem key={category._id} value={category._id}>
                                    {category.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid2>
                <Grid2 size={6}>
                    <FormControl fullWidth>
                        <InputLabel>Product</InputLabel>
                        <Select
                            value={selectedProduct}
                            label="Product"
                            onChange={(e) => setSelectedProduct(e.target.value)}
                        >
                            <MenuItem value="">None</MenuItem>
                            {products?.map((product) => (
                                <MenuItem key={product._id} value={product._id}>
                                    {product.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid2>
            </Grid2>

            <CustomGrid container spacing={3}>
                <KPICard title="Total Orders" value={data?.totalOrders || 0} />
                <KPICard title="Average Order Value" value={data?.averageOrderValue?.toFixed(2) || '0.00'} />
                <KPICard title="Revenue" value={data?.totalRevenue?.toFixed(2) || '0.00'} />
            </CustomGrid>
        </Box>
    );
}
