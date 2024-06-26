import React, { useState, useEffect } from 'react';
import { Container, Grid, Typography, CircularProgress, Box } from '@mui/material';
import { Product } from '../types/models';
import ProductCard from '../components/common/ProductCard';
import FilterBar from '../components/FilterBar';
import MainLayout from '@/layouts/MainLayout';
import { fetchAllProducts } from '../services/productService';
import { useRouter } from 'next/router';

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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

  // Effect to apply filters when URL query parameters change
  useEffect(() => {
    applyFiltersFromQueryParams();
  }, [router.query, products]);

  // Function to apply filters based on URL query parameters
  const applyFiltersFromQueryParams = () => {
    const queryParams = router.query;
    const filters: any = {};

    if (queryParams.search) {
      filters.search = queryParams.search.toString();
    }
    if (queryParams.category) {
      filters.category = Number(queryParams.category);
    }
    if (queryParams.collection) {
      filters.collection = Number(queryParams.collection);
    }
    if (queryParams.minPrice && queryParams.maxPrice) {
      filters.priceRange = [Number(queryParams.minPrice), Number(queryParams.maxPrice)];
    }

    applyFilters(filters);
  };

  // Function to apply filters and update filtered products
  const applyFilters = (filters: any) => {
    const { search, category, collection, priceRange } = filters;

    let filtered = products;

    if (search) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category) {
      filtered = filtered.filter(product => product.categoryId === category);
    }

    if (collection) {
      filtered = filtered.filter(product => product.collectionId === collection);
    }

    if (priceRange && priceRange.length === 2) {
      const [min, max] = priceRange;
      filtered = filtered.filter(product => product.price >= min && product.price <= max);
    }

    setFilteredProducts(filtered);
  };

  // Callback function to handle filter changes from FilterBar
  const handleFilterChange = (filters: any) => {
    const { search, category, collection, priceRange } = filters;

    const queryParams: any = {};
    if (search) {
      queryParams.search = search;
    }
    if (category) {
      queryParams.category = category;
    }
    if (collection) {
      queryParams.collection = collection;
    }
    if (priceRange && priceRange.length === 2) {
      queryParams.minPrice = priceRange[0];
      queryParams.maxPrice = priceRange[1];
    }

    // Update URL query parameters
    router.push({
      pathname: router.pathname,
      query: queryParams,
    });
  };

  return (
    <MainLayout>
      <Container>
        <Typography variant="h3" component="h1" className="text-center my-8">
          Produtos
        </Typography>
        <FilterBar
          onFilter={handleFilterChange}
          initialFilters={{
            search: router.query.search ? router.query.search.toString() : '',
            category: router.query.category ? Number(router.query.category) : null,
            collection: router.query.collection ? Number(router.query.collection) : null,
            priceRange: [
              router.query.minPrice ? Number(router.query.minPrice) : 0,
              router.query.maxPrice ? Number(router.query.maxPrice) : Infinity,
            ],
          }}
        />
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
