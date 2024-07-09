import { useState, useEffect } from "react";
import { Button, TextField, Select, MenuItem, Grid } from "@mui/material";
import { Category, Collection } from "../../types/models";
import { getCategories } from "@/services/admin/categoryService";
import { getCollections } from "@/services/admin/collectionService";
import { SelectChangeEvent } from "@mui/material";
import { createProduct } from "@/services/admin/productService";

function ProductForm() {
    const [collections, setCollections] = useState<Collection[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [formData, setFormData] = useState<{
        name: string;
        description: string;
        price: string;
        image: File | null;
        categoryId: string;
        collectionId: string;
    }>({
        name: '',
        description: '',
        price: '',
        image: null,
        categoryId: '',
        collectionId: '',
    });

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await getCategories();
                setCategories(response);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        const fetchCollections = async () => {
            try {
                const response = await getCollections();
                setCollections(response);
            } catch (error) {
                console.error('Error fetching collections:', error);
            }
        };
        fetchCategories();
        fetchCollections();
    }, []);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [event.target.id]: event.target.value,
        });
    };

    const handleChangeCategory = (event: SelectChangeEvent<number>) => {
        const selectedCategoryId = event.target.value;
        setFormData({
            ...formData,
            categoryId: selectedCategoryId.toString(),
        });
    };

    const handleChangeCollection = (event: SelectChangeEvent<number>) => {
        const selectedCollectionId = event.target.value;
        setFormData({
            ...formData,
            collectionId: selectedCollectionId.toString(),
        });
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formNewProduct = new FormData();
        formNewProduct.append('name', formData.name);
        formNewProduct.append('description', formData.description);
        formNewProduct.append('price', formData.price);
        formNewProduct.append('categoryId', formData.categoryId);
        formNewProduct.append('collectionId', formData.collectionId);

        try {
            const response = await createProduct(formData);
            console.log(response);
            setFormData({
                name: '',
                description: '',
                price: '',
                image: null,
                categoryId: '',
                collectionId: '',
            });
        } catch (error) {
            console.error('Error creating product:', error);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            id="name"
                            label="Product Name"
                            variant="outlined"
                            value={formData.name}
                            onChange={handleChange}
                            sx={{ color: ''}}
                            
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            id="description"
                            label="Product Description"
                            variant="outlined"
                            value={formData.description}
                            onChange={handleChange}
                            sx={{ color: ''}}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            id="price"
                            label="Product Price"
                            variant="outlined"
                            value={formData.price}
                            onChange={handleChange}
                            sx={{ color: ''}}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Select
                            fullWidth
                            labelId="categoryId"
                            id="categoryId"
                            value={Number(formData.categoryId) || ''}
                            label="Select Category"
                            onChange={handleChangeCategory}
                        >
                            {categories.map((category) => (
                                <MenuItem key={category.id} value={category.id}>
                                    {category.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Select
                            fullWidth
                            id="collectionId"
                            value={Number(formData.collectionId) || ''}
                            label="Select Collection"
                            onChange={handleChangeCollection}
                        >
                            {collections.map((collection) => (
                                <MenuItem key={collection.id} value={collection.id}>
                                    {collection.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </Grid>
                    <Grid item xs={12}>
                        <Button fullWidth variant="contained" color="primary" type="submit">
                            Criar Produto
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </div>
    );
}

export default ProductForm;
