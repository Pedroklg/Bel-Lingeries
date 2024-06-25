import React, { useEffect, useState } from 'react';
import { Container, Grid, Typography, CircularProgress, Box } from '@mui/material';
import { Product } from '../types/models';
import ProductCard from '../components/common/ProductCard';
import FilterBar from '../components/FilterBar';
import MainLayout from '@/layouts/MainLayout';
import { fetchAllProducts } from '../services/productService';

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const fetchedProducts = await fetchAllProducts();
        setProducts(fetchedProducts);
        setFilteredProducts(fetchedProducts);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const applyFilters = (filters: any) => {
    const { search, category, collection, priceRange } = filters;

    let filtered = products;

    if (search) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category) {
      filtered = filtered.filter(product => product.categoryId === parseInt(category));
    }

    if (collection) {
      filtered = filtered.filter(product => product.collectionId === parseInt(collection));
    }

    if (priceRange) {
      const [min, max] = priceRange;
      filtered = filtered.filter(product => product.price >= min && product.price <= max);
    }

    setFilteredProducts(filtered);
  };

  return (
    <MainLayout>
      <Container>
        <Typography variant="h3" component="h1" className="text-center my-8">
          Produtos
        </Typography>
        <FilterBar onFilter={applyFilters} />
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={10}>
            {filteredProducts.map((product) => (
              <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
                <ProductCard product={product} />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </MainLayout>
  );
};

export default ProductsPage;
