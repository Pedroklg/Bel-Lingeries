import React, { useState, useEffect, use } from 'react';
import { Container, Grid, Typography, CircularProgress, Box, FormControl, MenuItem, InputLabel, Select } from '@mui/material';
import { Product } from '../types/models';
import ProductCard from '../components/common/ProductCard';
import FilterBar from '../components/FilterBar';
import MainLayout from '@/layouts/MainLayout';
import { SelectChangeEvent } from '@mui/material/Select';
import { fetchAllProducts } from '../services/productService';
import { useRouter } from 'next/router';

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]); // State for all products
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]); // State for filtered products
  const [loading, setLoading] = useState(true); // Loading state
  const [sortOption, setSortOption] = useState<string>('newest'); // State for sorting option
  const router = useRouter(); // Next.js router instance

  useEffect(() => {
    // Function to fetch all products on component mount
    const loadProducts = async () => {
      try {
        const fetchedProducts = await fetchAllProducts();
        setProducts(fetchedProducts);
        setFilteredProducts(fetchedProducts); // Initialize filtered products with all products
        setLoading(false); // Set loading to false after products are fetched
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false); // Ensure loading state is updated even in case of errors
      }
    };
    loadProducts(); // Call the loadProducts function on component mount
  }, []); // Empty dependency array means this effect runs only once on mount

  useEffect(() => {
    // Function to apply filters from query parameters
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

      applyFilters(filters); // Call applyFilters with extracted filters
    };

    applyFiltersFromQueryParams(); // Call this function whenever router.query changes
  }, [router.query]); // Depend on router.query for changes

  const applySort = () => {
    let sortedProducts = [...filteredProducts]; // Copy filtered products array

    // Sorting logic based on selected sortOption
    if (sortOption === 'newest') {
      sortedProducts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortOption === 'mostSold') {
      sortedProducts.sort((a, b) => b.soldCount - a.soldCount);
    } else if (sortOption === 'priceAsc') {
      sortedProducts.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'priceDesc') {
      sortedProducts.sort((a, b) => b.price - a.price);
    }

    setFilteredProducts(sortedProducts); // Update filteredProducts state with sorted array
  };

  const handleSortChange = (option: string) => {
    setSortOption(option);
    applySort();
  };

  const applyFilters = (filters: any) => {
    const { search, category, collection, priceRange } = filters;

    let filtered = [...products]; // Make a copy to avoid mutating state directly

    // Filter logic based on applied filters
    if (search) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category !== null && category !== undefined) {
      filtered = filtered.filter(product => product.categoryId === category);
    }

    if (collection !== null && collection !== undefined) {
      filtered = filtered.filter(product => product.collectionId === collection);
    }

    if (priceRange && priceRange.length === 2) {
      const [min, max] = priceRange;
      filtered = filtered.filter(product => product.price >= min && product.price <= max);
    }

    setFilteredProducts(filtered); // Update filteredProducts state with filtered array
  };

  const handleFilterChange = (filters: any) => {
    applyFilters(filters); // Callback function to apply filters from FilterBar
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
        <FormControl variant="outlined" style={{ minWidth: 120, marginBottom: 20 }}>
          <InputLabel id="sort-label">Sort by</InputLabel>
          <Select
            labelId="sort-label"
            value={sortOption}
            onChange={(e: SelectChangeEvent) => handleSortChange(e.target.value as string)}
            label="Sort by"
          >
            <MenuItem value="newest">Newest</MenuItem>
            <MenuItem value="mostSold">Most Sold</MenuItem>
            <MenuItem value="priceAsc">Price Ascending</MenuItem>
            <MenuItem value="priceDesc">Price Descending</MenuItem>
          </Select>
        </FormControl>
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
