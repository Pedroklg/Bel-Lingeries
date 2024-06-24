import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { fetchProductById } from '../../services/productService';
import { ProductResponse, ProductSize, ProductColor, APIProductVariant, APIAdditionalImage } from '../../types/api';
import MainLayout from '@/layouts/MainLayout';
import { Typography, Button, Grid, Box } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css/bundle';

const ProductPage = () => {
  const router = useRouter();
  const { id } = router.query as { id: string };
  const [product, setProduct] = useState<ProductResponse | null>(null);
  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(null);
  const [availableSizes, setAvailableSizes] = useState<ProductSize[]>([]);

  useEffect(() => {
    const getProduct = async () => {
      if (id) {
        const productData = await fetchProductById(Number(id));
        setProduct(productData);

        // Set initial color and sizes
        if (productData && productData.variants.length > 0) {
          const initialColor = productData.variants[0] as APIProductVariant;
          setSelectedColor({
            color: initialColor.color,
            frontImage: initialColor.frontImage,
            backImage: initialColor.backImage,
            additionalImages: initialColor.additionalImages.map((image: APIAdditionalImage) => image.imageUrl),
          });
          setAvailableSizes([{
            size: initialColor.size,
            stock: initialColor.stock,
          }]);
        }
      }
    };
    getProduct();
  }, [id]);

  const handleColorChange = (color: ProductColor) => {
    setSelectedColor(color);
    const variant = product?.variants.find(variant => variant.color === color.color);
    if (variant) {
      setAvailableSizes([{
        size: variant.size,
        stock: variant.stock,
      }]);
    }
  };

  if (!product) return <div>Loading...</div>;

  return (
    <MainLayout>
      <Box p={2}>
        <Typography variant="h3" gutterBottom>
          {product.name}
        </Typography>
        <Typography variant="body1" paragraph>
          {product.description}
        </Typography>
        <Typography variant="h5" gutterBottom>
          Price: R$ {product.price.toFixed(2)}
        </Typography>

        <Box my={4}>
          <Typography variant="h6" gutterBottom>
            Select Color
          </Typography>
          <Grid container spacing={2}>
            {product.variants.map((variant, index) => (
              <Grid item key={index}>
                <Button
                  variant={selectedColor?.color === variant.color ? 'contained' : 'outlined'}
                  onClick={() => handleColorChange({
                    color: variant.color,
                    frontImage: variant.frontImage,
                    backImage: variant.backImage,
                    additionalImages: variant.additionalImages.map((image: APIAdditionalImage) => image.imageUrl),
                  })}
                >
                  {variant.color}
                </Button>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box my={4}>
          <Typography variant="h6" gutterBottom>
            Available Sizes
          </Typography>
          <Grid container spacing={1}>
            {availableSizes.map((size, index) => (
              <Grid item key={index}>
                <Typography>{size.size}</Typography>
              </Grid>
            ))}
          </Grid>
        </Box>

        {selectedColor && (
          <Box my={4}>
            <Typography variant="h6" gutterBottom>
              Selected Color Images
            </Typography>
            <Swiper
              navigation
              pagination={{ clickable: true }}
              effect="fade"
              loop={true}
              className="mySwiper"
            >
              <SwiperSlide>
                <img src={selectedColor.frontImage} alt="Front" style={{ maxWidth: '100%' }} />
              </SwiperSlide>
              <SwiperSlide>
                <img src={selectedColor.backImage} alt="Back" style={{ maxWidth: '100%' }} />
              </SwiperSlide>
              {selectedColor.additionalImages.map((image: string, index: number) => (
                <SwiperSlide key={index}>
                  <img src={image} alt={`Additional ${index}`} style={{ maxWidth: '100%' }} />
                </SwiperSlide>
              ))}
            </Swiper>
          </Box>
        )}
      </Box>
    </MainLayout>
  );
};

export default ProductPage;
