import React from 'react';
import { Box, Grid2, styled } from '@mui/material';
import ProductCard from './ProductCard.tsx';
import { Product } from '../../types/index.ts';

interface ProductListProps {
    products: Product[];
}

const CustomGrid = styled(Grid2)({
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '2rem',
});

export default function ProductList({ products }: ProductListProps) {
    if (!products || products.length === 0) {
        return <div>No products available</div>;
    }

    return (
        <Box sx={{ flexGrow: 1 }}>
            <CustomGrid>
                {products.map((product: any) => (
                    <Grid2 key={product._id}>
                        <ProductCard product={product} />
                    </Grid2>
                ))}
            </CustomGrid>
        </Box>
    );
}
