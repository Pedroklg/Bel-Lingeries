import React, { useState, useEffect } from 'react';
import { Container, Grid, Typography, CircularProgress, Box, FormControl, MenuItem, InputLabel, Select } from '@mui/material';
import { Product } from '../types/models';
import ProductCard from '../components/common/ProductCard';
import FilterBar from '../components/FilterBar';
import MainLayout from '@/layouts/MainLayout';
import { SelectChangeEvent } from '@mui/material/Select';
import { fetchAllProducts } from '../services/productGETService';
import { useRouter } from 'next/router';
import { palette } from '@/theme';

const { belDarkCyan, belBlue } = palette;

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState<string>('newest');
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

  useEffect(() => {
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

    applyFiltersFromQueryParams();
  }, [router.query]);

  const applySort = () => {
    let sortedProducts = [...filteredProducts];

    if (sortOption === 'newest') {
      sortedProducts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortOption === 'mostSold') {
      sortedProducts.sort((a, b) => b.soldCount - a.soldCount);
    } else if (sortOption === 'priceAsc') {
      sortedProducts.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'priceDesc') {
      sortedProducts.sort((a, b) => b.price - a.price);
    }

    setFilteredProducts(sortedProducts);
  };

  const handleSortChange = (option: string) => {
    setSortOption(option);
    applySort();
  };

  const applyFilters = (filters: any) => {
    const { search, category, collection, priceRange } = filters;

    let filtered = [...products];

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

    setFilteredProducts(filtered);
  };

  const handleFilterChange = (filters: any) => {
    applyFilters(filters);
  };

  return (
    <MainLayout>
      <Container>
        <Typography variant="h2" component="h1" className="text-center my-8" sx={{ color: belDarkCyan, fontWeight: "bold" }}>
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
          <InputLabel id="sort-label" color="success">Ordenar por</InputLabel>
          <Select
            labelId="sort-label"
            value={sortOption}
            onChange={(e: SelectChangeEvent) => handleSortChange(e.target.value as string)}
            label="Sort by"
            color='success'
            sx={{ bgcolor: belBlue, opacity: 0.8 }}
          >
            <MenuItem value="newest">Mais novos</MenuItem>
            <MenuItem value="mostSold">Mais vendidos</MenuItem>
            <MenuItem value="priceAsc">Preço crescente</MenuItem>
            <MenuItem value="priceDesc">Preço descendente</MenuItem>
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
