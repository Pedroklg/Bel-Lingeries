import { useState, useEffect } from "react";
import { Button, TextField, Select, MenuItem } from "@mui/material";
import { Category, Collection } from "../../types/models";
import { getCategories } from "@/services/admin/categoryService";
import { getCollections } from "@/services/admin/collectionService";
import { SelectChangeEvent } from "@mui/material";
import { createProduct } from "@/services/admin/productService";

function ProductForm() {
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
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
            }
            catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        const fetchCollections = async () => {
            try {
                const response = await getCollections();
                setCollections(response);
            }
            catch (error) {
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
        const category = categories.find(category => category.id === selectedCategoryId);
        setSelectedCategory(category || null);
    };

    const handleChangeCollection = (event: SelectChangeEvent<number>) => {
        const selectedCollectionId = event.target.value;
        const collection = collections.find(collection => collection.id === selectedCollectionId);
        setSelectedCollection(collection || null);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formNewProduct = new FormData();
        formNewProduct.append('name', formData.name);
        formNewProduct.append('description', formData.description);
        formNewProduct.append('price', formData.price);
        formNewProduct.append('categoryId', selectedCategory?.id.toString() || '');
        formNewProduct.append('collectionId', selectedCollection?.id.toString() || '');
        console.log(formNewProduct);
        try {
            const response = await createProduct(formData);
            console.log(response);
        }
        catch (error) {
            console.error('Error creating product:', error);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <TextField
                    id="name"
                    label="Product Name"
                    variant="outlined"
                    onChange={handleChange}
                />
                <TextField
                    id="description"
                    label="Product Description"
                    variant="outlined"
                    onChange={handleChange}
                />
                <TextField
                    id="price"
                    label="Product Price"
                    variant="outlined"
                    onChange={handleChange}
                />
                <Select
                    labelId="categoryId"
                    id="categoryId"
                    value={selectedCategory?.id || ''}
                    label="Select Category"
                    onChange={handleChangeCategory}
                >
                    {categories.map((category) => (
                        <MenuItem key={category.id} value={category.id}>
                            {category.name}
                        </MenuItem>
                    ))}
                </Select>
                <Select
                    id="collectionId"
                    value={selectedCollection?.id || ''}
                    label="Select Collection"
                    onChange={handleChangeCollection}
                >
                    {collections.map((collection) => (
                        <MenuItem key={collection.id} value={collection.id}>
                            {collection.name}
                        </MenuItem>
                    ))}
                </Select>

                <Button variant="contained" color="primary" type="submit">
                    Criar Produto
                </Button>
            </form>
        </div>
    );
}

export default ProductForm;