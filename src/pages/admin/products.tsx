import React, { useState, useEffect } from 'react';
import { Product, ProductVariant, Category, Collection } from '@prisma/client';
import { Grid, Button, TextField, Select, MenuItem, InputLabel } from '@mui/material';
import {
    createProduct,
    updateProduct,
    getProducts,
} from '@/services/admin/productService';
import { fetchProductById } from '@/services/productGETService';
import {
    createProductVariant,
    getAllProductVariants,
    getProductVariantProductId,
    updateProductVariant,
    deleteProductVariant,
} from '@/services/admin/productVariantService';
import { getCategories } from '@/services/admin/categoryService';
import { getCollections } from '@/services/admin/collectionService';
import AdminLayout from '@/layouts/AdminLayout';

interface ProductsPageProps {
    initialProduct?: Product; // Optional initial product for update
}

const ProductsPage: React.FC<ProductsPageProps> = ({ initialProduct = null }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [productVariants, setProductVariants] = useState<ProductVariant[]>([]);
    const [product, setProduct] = useState<Product | null>(initialProduct);
    const [selectedVariant, setSelectedVariant] = useState<ProductVariant>({ id: 0, productId: 0, color: '', size: '', stock: 0, frontImage: '', backImage: '' });
    const [categories, setCategories] = useState<Category[]>([]);
    const [collections, setCollections] = useState<Collection[]>([]);
    const [isEditMode, setIsEditMode] = useState<boolean>(false); // Track whether in edit mode

    useEffect(() => {
        const fetchData = async () => {
            try {
                const fetchedProducts = await getProducts();
                setProducts(fetchedProducts);

                const fetchedCategories = await getCategories();
                setCategories(fetchedCategories);

                const fetchedCollections = await getCollections();
                setCollections(fetchedCollections);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        // Fetch product variants when a product is selected
        const fetchProductVariants = async () => {
            if (product && product.id) {
                try {
                    const variants = await getProductVariantProductId(product.id);
                    variants.length > 0 ? setProductVariants(variants) : setProductVariants([]);
                } catch (error) {
                    console.error('Error fetching product details:', error);
                }
            }
        };

        fetchProductVariants();
    }, [product]);

    const handleProductSelectChange = async (productId: number) => {
        const actualProduct = await fetchProductById(productId);
        setProduct(actualProduct as Product);

        if (productId) {
            try {
                const variants = await getProductVariantProductId(productId);
                variants.length > 0 ? setProductVariants(variants) : setProductVariants([]);
                setIsEditMode(true);
            } catch (error) {
                console.error('Error fetching product details:', error);
            }
        }
    };

    const handleProductSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const form = e.target as HTMLFormElement;
            const formData = new FormData(form);
            const updatedProduct: Product = {
                id: product?.id ?? 0,
                name: formData.get('name')?.toString() ?? '',
                description: formData.get('description')?.toString() ?? '',
                price: Number(formData.get('price')) ?? 0,
                collectionId: Number(formData.get('collectionId')) || null,
                categoryId: Number(formData.get('categoryId')) || null,
                createdAt: new Date(), // This should be set based on your backend logic
                soldCount: 0, // This should be set based on your backend logic
            };

            if (isEditMode && product && product?.id !== null) {
                await updateProduct(product.id, product);
            } else {
                const createdProduct = await createProduct(updatedProduct);
                setProduct(createdProduct.id); // Set selected product after creation
            }

            // Refresh products list
            const fetchedProducts = await getProducts();
            setProducts(fetchedProducts);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleVariantSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const newVariant: ProductVariant = {
                id: 0, // This will be managed by the backend
                productId: product?.id ?? 0,
                color: selectedVariant.color,
                size: selectedVariant.size,
                stock: selectedVariant.stock,
                frontImage: selectedVariant.frontImage,
                backImage: selectedVariant.backImage,
            };

            await createProductVariant(newVariant);
            // Refresh variants list
            const fetchedVariants = await getAllProductVariants();
            setProductVariants(fetchedVariants);
            // Reset form
            setSelectedVariant({
                id: 0,
                productId: product?.id ?? 0,
                color: '',
                size: '',
                stock: 0,
                frontImage: '',
                backImage: '',
            });
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleUpdateVariant = async (updatedVariant: ProductVariant) => {
        try {
            await updateProductVariant(updatedVariant.id, updatedVariant);
            // Refresh variants list
            const fetchedVariants = await getAllProductVariants();
            setProductVariants(fetchedVariants);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleDeleteVariant = async (variantId: number) => {
        try {
            await deleteProductVariant(variantId);
            // Refresh variants list
            const fetchedVariants = await getAllProductVariants();
            setProductVariants(fetchedVariants);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleVariantChange = (e: React.ChangeEvent<{ name: string; value: unknown }>) => {
        const { name, value } = e.target;
        setSelectedVariant({
            ...selectedVariant,
            [name]: value as string,
        });
    };

    return (
        <AdminLayout>
            <div>
                <h1>Products</h1>

                {/* Product Select Dropdown */}
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <InputLabel>Select Product</InputLabel>
                        <Select
                            fullWidth
                            value={product?.id || ''}
                            onChange={(e) => handleProductSelectChange(Number(e.target.value))}
                        >
                            <MenuItem value="">Create New Product</MenuItem>
                            {products.map((product) => (
                                <MenuItem key={product.id} value={product.id}>
                                    {product.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </Grid>
                </Grid>

                {/* Product Form */}
                {product && product?.id !== null && (
                    <form onSubmit={handleProductSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    name="name"
                                    label="Name"
                                    fullWidth
                                    value={product.name || ''}
                                    onChange={(e) => setProduct({ ...product, name: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    name="description"
                                    label="Description"
                                    fullWidth
                                    value={product.description || ''}
                                    onChange={(e) => setProduct({ ...product, description: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    name="price"
                                    label="Price"
                                    type="number"
                                    fullWidth
                                    value={product.price || 0}
                                    onChange={(e) => setProduct({ ...product, price: Number(e.target.value) })}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <InputLabel>Category</InputLabel>
                                <Select
                                    name="categoryId"
                                    fullWidth
                                    value={product.categoryId || ''}
                                    onChange={(e) => setProduct({ ...product, categoryId: Number(e.target.value) })}
                                >
                                    <MenuItem value="">Select Category</MenuItem>
                                    {categories.map((category) => (
                                        <MenuItem key={category.id} value={category.id}>
                                            {category.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <InputLabel>Collection</InputLabel>
                                <Select
                                    name="collectionId"
                                    fullWidth
                                    value={product.collectionId || ''}
                                    onChange={(e) => setProduct({ ...product, collectionId: Number(e.target.value) })}
                                >
                                    <MenuItem value="">Select Collection</MenuItem>
                                    {collections.map((collection) => (
                                        <MenuItem key={collection.id} value={collection.id}>
                                            {collection.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </Grid>
                            <Grid item xs={12}>
                                <Button type="submit" variant="contained" color="primary">
                                    {isEditMode ? 'Update Product' : 'Create Product'}
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                )}

                {/* Product Variants Section */}
                {product && product.id !== null && (
                    <>
                        <h2>Product Variants</h2>
                        {/* Render product variants here */}
                        {productVariants.length > 0 && productVariants.map((variant) => (
                            <div key={variant.id}>
                                <p>Color: {variant.color}</p>
                                <p>Size: {variant.size}</p>
                                <p>Stock: {variant.stock}</p>
                                <Button onClick={() => handleUpdateVariant(variant)}>Update</Button>
                                <Button onClick={() => handleDeleteVariant(variant.id)}>Delete</Button>
                            </div>
                        ))}

                        {/* Create Product Variant Form */}
                        <form onSubmit={handleVariantSubmit}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        name="color"
                                        label="Color"
                                        fullWidth
                                        value={selectedVariant.color}
                                        onChange={handleVariantChange}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        name="size"
                                        label="Size"
                                        fullWidth
                                        value={selectedVariant.size}
                                        onChange={handleVariantChange}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        name="stock"
                                        label="Stock"
                                        type="number"
                                        fullWidth
                                        value={selectedVariant.stock}
                                        onChange={handleVariantChange}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        name="frontImage"
                                        label="Front Image"
                                        fullWidth
                                        value={selectedVariant.frontImage}
                                        onChange={handleVariantChange}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        name="backImage"
                                        label="Back Image"
                                        fullWidth
                                        value={selectedVariant.backImage}
                                        onChange={handleVariantChange}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Button type="submit" variant="contained" color="primary">
                                        Create Variant
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    </>
                )}
            </div>
        </AdminLayout>
    );
};

export default ProductsPage;
