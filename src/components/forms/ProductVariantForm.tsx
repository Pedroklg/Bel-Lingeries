import React, { useState, useEffect } from 'react';
import { Select, MenuItem, FormControl, InputLabel, Button, TextField, SelectChangeEvent } from '@mui/material';
import { createProductVariant, getProductVariantById, updateProductVariant } from '../../services/admin/productVariantService';
import { fetchAllProducts } from '../../services/productGETService';
import { Product, ProductVariant } from '../../types/models';

const ProductVariantForm = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [formData, setFormData] = useState<{
    color: string;
    size: string;
    stock: string;
    frontImage: File | null;
    backImage: File | null;
    additionalImages: File[];
  }>({
    color: '',
    size: '',
    stock: '',
    frontImage: null,
    backImage: null,
    additionalImages: [],
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const products = await fetchAllProducts();
      setProducts(products);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchVariantsForProduct = async (productId: string) => {
    try {
      const fetchedVariants = await getProductVariantById(Number(productId));
      const variantsArray = Array.isArray(fetchedVariants) ? fetchedVariants : [fetchedVariants]; // Ensure variants is an array
      setVariants(variantsArray as ProductVariant[]);
    } catch (error) {
      console.error(`Error fetching variants for product ${productId}:`, error);
      setVariants([]);
    }
  };

  const handleProductChange = (event: SelectChangeEvent<number>, child: React.ReactNode) => {
    const productId = event.target.value;
    const product = products.find(product => product.id === productId);
    setSelectedProduct(product || null);
    fetchVariantsForProduct(productId.toString());
  };

  const handleVariantChange = (event: SelectChangeEvent<number>, child: React.ReactNode) => {
    const variantId = event.target.value;
    const selected = variants.find(variant => variant.id === variantId);
    setSelectedVariant(selected || null);
    setFormData({
      color: selected ? selected.color : '',
      size: selected ? selected.size : '',
      stock: selected ? selected.stock.toString() : '',
      frontImage: null,
      backImage: null,
      additionalImages: [],
    });
  };

  const handleFormDataChange = (event: React.ChangeEvent<any>) => {
    const { name, value } = event.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (event: React.ChangeEvent<any>) => {
    const { name, files } = event.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: files[0],
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      let response;
      if (selectedVariant) {
        const formDataWithId = new FormData();
        formDataWithId.append('updatedColor', formData.color);
        formDataWithId.append('updatedSize', formData.size);
        formDataWithId.append('updatedStock', formData.stock);
        if (formData.frontImage) formDataWithId.append('frontImage', formData.frontImage);
        if (formData.backImage) formDataWithId.append('backImage', formData.backImage);
        for (let i = 0; i < formData.additionalImages.length; i++) {
          formDataWithId.append('additionalImages', formData.additionalImages[i]);
        }
        response = await updateProductVariant(selectedVariant.id, formDataWithId);
      } else {
        const formDataWithoutId = new FormData();
        formDataWithoutId.append('color', formData.color);
        formDataWithoutId.append('size', formData.size);
        formDataWithoutId.append('stock', formData.stock);
        formDataWithoutId.append('productId', selectedProduct?.id.toString() || '');
        formDataWithoutId.append('frontImage', formData.frontImage || '');
        formDataWithoutId.append('backImage', formData.backImage || '');
        for (let i = 0; i < formData.additionalImages.length; i++) {
          formDataWithoutId.append('additionalImages', formData.additionalImages[i]);
        }
        response = await createProductVariant(formDataWithoutId);
      }
      console.log('Variant saved:', response);
      setFormData({
        color: '',
        size: '',
        stock: '',
        frontImage: null,
        backImage: null,
        additionalImages: [],
      });
      setSelectedVariant(null);
      if (selectedProduct) {
        fetchVariantsForProduct(selectedProduct.id.toString());
      }
    } catch (error) {
      console.error('Error saving variant:', error);
    }
  };

  return (
    <div>
      <FormControl fullWidth>
        <InputLabel id="product-select-label">Select Product</InputLabel>
        <Select
          labelId="product-select-label"
          id="product-select"
          value={selectedProduct?.id || ''}
          label="Select Product"
          onChange={handleProductChange}
        >
          {products.map((product) => (
            <MenuItem key={product.id} value={product.id}>
              {product.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth>
        <InputLabel id="variant-select-label">Select Variant (Optional)</InputLabel>
        <Select
          labelId="variant-select-label"
          id="variant-select"
          value={selectedVariant ? selectedVariant.id : ''}
          label="Select Variant (Optional)"
          onChange={handleVariantChange}
        >
          <MenuItem value="">
            <em>Create New Variant</em>
          </MenuItem>
          {variants.map((variant) => (
            <MenuItem key={variant.id} value={variant.id}>
              {`${variant.color} - ${variant.size}`}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <form onSubmit={handleSubmit}>
        <TextField
          name="color"
          label="Color"
          value={formData.color}
          onChange={handleFormDataChange}
          fullWidth
          required
        />
        <TextField
          name="size"
          label="Size"
          value={formData.size}
          onChange={handleFormDataChange}
          fullWidth
          required
        />
        <TextField
          name="stock"
          label="Stock"
          value={formData.stock}
          onChange={handleFormDataChange}
          fullWidth
          type="number"
          required
        />

        <div>
          <label>Front Image (800x600px):</label>
          <input
            type="file"
            accept="image/*"
            name="frontImage"
            onChange={handleImageChange}
          />
          {formData.frontImage && (
            <img src={URL.createObjectURL(formData.frontImage)} alt="Main" width={200} height={200} />
          )}
        </div>
        <div>
          <label>Back Image (800x600px):</label>
          <input
            type="file"
            accept="image/*"
            name="backImage"
            onChange={handleImageChange}
          />
          {formData.backImage && (
            <img src={URL.createObjectURL(formData.backImage)} alt="Main" width={200} height={200} />
          )}
        </div>

        <div>
          <label>Additional Images (800x600px):</label>
          {[...Array(9)].map((_, index) => (
            <div key={index}>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const files = e.target.files;
                  if (files) {
                    setFormData(prevData => ({
                      ...prevData,
                      additionalImages: [...prevData.additionalImages, files[0]],
                    }));
                  }
                }}
              />
              {formData.additionalImages[index] && (
                <img src={URL.createObjectURL(formData.additionalImages[index])} alt={`Image ${index + 1}`} width={200} height={200} />
              )}
            </div>
          ))}
        </div>

        <Button variant="contained" color="primary" type="submit">
          {selectedVariant ? 'Update Variant' : 'Create Variant'}
        </Button>
      </form>
    </div>
  );
};

export default ProductVariantForm;
