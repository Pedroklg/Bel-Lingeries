import React, { useState, useEffect } from 'react';
import { Select, MenuItem, FormControl, InputLabel, Button, TextField, SelectChangeEvent } from '@mui/material';
import { createProductVariant, getProductVariantById, updateProductVariant } from '../../services/admin/productVariantService';
import { fetchAllProducts } from '../../services/productGETService';
import { Product, ProductVariant } from '../../types/models';

const ProductVariantForm = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [variantData, setVariantData] = useState<{
    color: string;
    size: string;
    stock: string;
    frontImage: File | null;
    backImage: File | null;
    additionalImages: File[];
    productId?: string;
    variantID?: string;
  }>({
    color: '',
    size: '',
    stock: '',
    frontImage: null,
    backImage: null,
    additionalImages: [],
    productId: '',
    variantID: '',
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
    setVariantData(prevData => ({
      ...prevData,
      productId: productId.toString(),
    }));
    fetchVariantsForProduct(productId.toString());
  };

  const handleVariantChange = (event: SelectChangeEvent<number>, child: React.ReactNode) => {
    const variantId = event.target.value;
    setVariantData(prevData => ({
      ...prevData,
      variantID: variantId.toString(),
    }));
    const selectedVariant = variants.find(variant => variant.id === variantId);
    setVariantData({
      color: selectedVariant?.color || '',
      size: selectedVariant?.size || '',
      stock: selectedVariant?.stock.toString() || '',
      frontImage: null,
      backImage: null,
      additionalImages: [],
      productId: selectedVariant?.productId.toString() || '',
      variantID: selectedVariant?.id.toString() || '',
    });
  };

  const handlevariantDataChange = (event: React.ChangeEvent<any>) => {
    const { name, value } = event.target;
    setVariantData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (event: React.ChangeEvent<any>) => {
    const { name, files } = event.target;
    setVariantData(prevData => ({
      ...prevData,
      [name]: files[0],
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      let response;
      if (variantData.variantID !== '') {
        response = await updateProductVariant(Number(variantData.variantID), variantData);
        console.log('Variant updated:', response);
      } else {
        response = await createProductVariant(variantData);
      }
      console.log('Variant saved:', response);
      setVariantData({
        color: '',
        size: '',
        stock: '',
        frontImage: null,
        backImage: null,
        additionalImages: [],
        productId: '',
        variantID: '',
      });
      if (variantData.productId !== '') {
        fetchVariantsForProduct(variantData.productId?.toString() || '')
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
          value={Number(variantData.productId) || ''}
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
          value={Number(variantData.variantID) || ''}
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
          value={variantData.color}
          onChange={handlevariantDataChange}
          fullWidth
          required
        />
        <TextField
          name="size"
          label="Size"
          value={variantData.size}
          onChange={handlevariantDataChange}
          fullWidth
          required
        />
        <TextField
          name="stock"
          label="Stock"
          value={variantData.stock}
          onChange={handlevariantDataChange}
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
          {variantData.frontImage && (
            <img src={URL.createObjectURL(variantData.frontImage)} alt="Main" width={200} height={200} />
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
          {variantData.backImage && (
            <img src={URL.createObjectURL(variantData.backImage)} alt="Main" width={200} height={200} />
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
                    setVariantData(prevData => ({
                      ...prevData,
                      additionalImages: [...prevData.additionalImages, files[0]],
                    }));
                  }
                }}
              />
              {variantData.additionalImages[index] && (
                <img src={URL.createObjectURL(variantData.additionalImages[index])} alt={`Image ${index + 1}`} width={200} height={200} />
              )}
            </div>
          ))}
        </div>

        <Button variant="contained" color="primary" type="submit">
          {variantData.productId !== '' ? 'Update Variant' : 'Create Variant'}
        </Button>
      </form>
    </div>
  );
};

export default ProductVariantForm;
