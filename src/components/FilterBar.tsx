import React, { useState, useEffect } from 'react';
import { TextField, MenuItem, Box, Grid, Button } from '@mui/material';
import { Category, Collection } from '../types/models';
import { fetchAllCategories } from '@/services/categoryService';
import { fetchCollections } from '@/services/collectionService';

interface FilterBarProps {
    onFilter: (filters: any) => void;
    initialFilters?: {
        search?: string;
        category?: number | null;
        collection?: number | null;
        priceRange?: [number, number];
    };
}

const FilterBar: React.FC<FilterBarProps> = ({ onFilter, initialFilters }) => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [collections, setCollections] = useState<Collection[]>([]);
    const [search, setSearch] = useState(initialFilters?.search || '');
    const [category, setCategory] = useState<number | null>(initialFilters?.category ?? null);
    const [collection, setCollection] = useState<number | null>(initialFilters?.collection ?? null);
    const [minPrice, setMinPrice] = useState(initialFilters?.priceRange ? initialFilters.priceRange[0] : '');
    const [maxPrice, setMaxPrice] = useState(initialFilters?.priceRange ? initialFilters.priceRange[1] : Infinity.toString());

    useEffect(() => {
        const fetchFilters = async () => {
            try {
                const fetchedCategories = await fetchAllCategories();
                setCategories(fetchedCategories);
                const fetchedCollections = await fetchCollections();
                setCollections(fetchedCollections);
            } catch (error) {
                console.error('Error fetching filter data:', error);
            }
        };
        fetchFilters();
    }, []);

    const handleFilter = () => {
        const priceRange: [number, number] = [Number(minPrice), Number(maxPrice)];
        priceRange[1] === 0 ? priceRange[1] = Infinity : priceRange[1];
        onFilter({ search, category, collection, priceRange });
    };

    return (
        <Box mb={4}>
            <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={6} md={3}>
                    <TextField
                        label="Search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <TextField
                        select
                        label="Category"
                        value={category || ''}
                        onChange={(e) => setCategory(e.target.value === '' ? null : Number(e.target.value))}
                        fullWidth
                    >
                        <MenuItem value="">None</MenuItem>
                        {categories.map((cat) => (
                            <MenuItem key={cat.id} value={cat.id}>
                                {cat.name}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <TextField
                        select
                        label="Collection"
                        value={collection || ''}
                        onChange={(e) => setCollection(e.target.value === '' ? null : Number(e.target.value))}
                        fullWidth
                    >
                        <MenuItem value="">None</MenuItem>
                        {collections.map((col) => (
                            <MenuItem key={col.id} value={col.id}>
                                {col.name}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={5}>
                            <TextField
                                label="Min"
                                type="number"
                                value={minPrice}
                                onChange={(e) => setMinPrice(e.target.value)}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={2} textAlign="center">
                            <Box my={1}>
                                <span>-</span>
                            </Box>
                        </Grid>
                        <Grid item xs={5}>
                            <TextField
                                label="Max"
                                type="number"
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(e.target.value)}
                                fullWidth
                            />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Button variant="contained" color="primary" onClick={handleFilter}>
                        Apply Filters
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
};

export default FilterBar;