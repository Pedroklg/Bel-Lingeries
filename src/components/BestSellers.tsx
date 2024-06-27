// BestSellers.tsx
import React, { useEffect, useState } from 'react';
import { Box, Grid, Typography } from '@mui/material';
import { Product } from '../types/models';
import { fetchBestSellers } from '../services/productGETService';
import ProductCard from './common/ProductCard';
import { palette } from '../theme';

const { belDarkCyan } = palette;

interface Props {
    limit: number;
}

const BestSellersProducts: React.FC<Props> = ({ limit }) => {
    const [bestSellersProducts, setBestSellersProducts] = useState<Product[]>([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const products = await fetchBestSellers(limit);
                setBestSellersProducts(products);
            } catch (error) {
                console.error('Error fetching newest products:', error);
            }
        };

        fetchProducts();
    }, [limit]);

    return (
        <Box sx={{ padding: '1rem' }}>
            <Typography variant="h4" sx={{ marginBottom: '2rem', textAlign: 'center', color: belDarkCyan, fontWeight: 'bold' }}>
                Mais Vendidos
            </Typography>
            <Grid container spacing={3} justifyContent="center" style={{ padding: '20px' }}>
                {bestSellersProducts.map(product => (
                    <Grid item key={product.id}>
                        <ProductCard product={product} />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default BestSellersProducts;
