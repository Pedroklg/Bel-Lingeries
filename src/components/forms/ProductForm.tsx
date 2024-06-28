import React, { useState } from 'react';
import { Product } from '@prisma/client';
import { TextField, Button, Grid } from '@mui/material';
import { createProduct, updateProduct } from '@/services/admin/productService';

interface ProductFormProps {
  initialProduct?: Product; // Optional initial product for update
}

const ProductForm: React.FC<ProductFormProps> = ({ initialProduct }) => {
  const initialFormData: Partial<Product> = {
    name: '',
    description: '',
    price: 0,
    collectionId: undefined,
    categoryId: undefined,
  };

  const [product, setProduct] = useState<Partial<Product>>(initialProduct ?? initialFormData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (initialProduct) {
        await updateProduct(initialProduct.id, product as Product); // Assert product as Product
      } else {
        await createProduct(product as Product); // Assert product as Product
      }
      // Handle success (e.g., show notification, redirect, etc.)
    } catch (error) {
      console.error('Error:', error);
      // Handle error (e.g., show error message)
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            name="name"
            label="Name"
            fullWidth
            value={product.name || ''}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            name="description"
            label="Description"
            fullWidth
            value={product.description || ''}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            name="price"
            label="Price"
            type="number"
            fullWidth
            value={product.price || 0}
            onChange={handleChange}
          />
        </Grid>
        {/* Add more fields as needed */}
        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="primary">
            {initialProduct ? 'Update Product' : 'Create Product'}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default ProductForm;
