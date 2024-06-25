import React, { useState, useEffect } from 'react';
import { TextField, MenuItem, Box, Grid, Button } from '@mui/material';
import { Category, Collection } from '../types/models';
import { fetchAllCategories } from '@/services/categoryService';
import { fetchCollections } from '@/services/collectionService';

interface FilterBarProps {
    onFilter: (filters: any) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ onFilter }) => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [collections, setCollections] = useState<Collection[]>([]);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState<number | null>(null); // Changed to number | null
    const [collection, setCollection] = useState<number | null>(null); // Changed to number | null
    const [priceRange, setPriceRange] = useState([0, 1000]);

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
                        value={category || ''} // Ensure it's a string or number
                        onChange={(e) => setCategory(e.target.value === '' ? null : Number(e.target.value))}
                        fullWidth
                    >
                        <MenuItem value="">None</MenuItem> {/* Default option */}
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
                        value={collection || ''} // Ensure it's a string or number
                        onChange={(e) => setCollection(e.target.value === '' ? null : Number(e.target.value))}
                        fullWidth
                    >
                        <MenuItem value="">None</MenuItem> {/* Default option */}
                        {collections.map((col) => (
                            <MenuItem key={col.id} value={col.id}>
                                {col.name}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <TextField
                        label="Price Range"
                        value={`${priceRange[0]} - ${priceRange[1]}`}
                        onChange={(e) => {
                            const [min, max] = e.target.value.split(' - ').map(Number);
                            setPriceRange([min, max]);
                        }}
                        fullWidth
                    />
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