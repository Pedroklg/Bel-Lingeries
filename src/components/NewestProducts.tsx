// NewestProducts.tsx
import React, { useEffect, useState } from 'react';
import { Box, Grid, Typography } from '@mui/material';
import { Product } from '../types/models';
import { fetchNewestProducts } from '../services/productService';
import ProductCard from './common/ProductCard';
import { palette } from '../theme';

const { belDarkCyan } = palette;

interface Props {
    limit: number;
}

const NewestProducts: React.FC<Props> = ({ limit }) => {
    const [newestProducts, setNewestProducts] = useState<Product[]>([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const products = await fetchNewestProducts(limit);
                setNewestProducts(products);
            } catch (error) {
                console.error('Error fetching newest products:', error);
            }
        };

        fetchProducts();
    }, [limit]);

    return (
        <Box sx={{ padding: '1rem' }}>
            <Typography variant="h4" sx={{ marginBottom: '2rem', textAlign: 'center', color: belDarkCyan, fontWeight: 'bold' }}>
                Novidades
            </Typography>
            <Grid container spacing={3} justifyContent="center" style={{ padding: '20px' }}>
                {newestProducts.map(product => (
                    <Grid item key={product.id}>
                        <ProductCard product={product} />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default NewestProducts;
