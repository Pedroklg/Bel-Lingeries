import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { fetchProductById } from '@/services/productGETService';
import { ProductResponse, ProductSize, ProductColor, APIProductVariant, APIAdditionalImage } from '../../types/api';
import MainLayout from '@/layouts/MainLayout';
import { Typography, Button, Grid, Box, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css/bundle';
import { useCart } from '@/context/CartContext';

const ProductPage = () => {
  const router = useRouter();
  const { id } = router.query as { id: string };
  const [product, setProduct] = useState<ProductResponse | null>(null);
  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(null);
  const [availableSizes, setAvailableSizes] = useState<ProductSize[]>([]);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const { addToCart } = useCart(); // Access addToCart function from CartContext

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
          setSelectedImage(initialColor.frontImage); // Set initial big image
          setAvailableSizes(productData.variants.map(variant => ({
            size: variant.size,
            stock: variant.stock,
          })));
          setSelectedSize(initialColor.size); // Set initial size
        }
      }
    };
    getProduct();
  }, [id]);

  const handleColorChange = (color: ProductColor) => {
    setSelectedColor(color);
    const variant = product?.variants.find(variant => variant.color === color.color);
    if (variant) {
      setSelectedImage(variant.frontImage); // Update big image when color changes
      setAvailableSizes([{
        size: variant.size,
        stock: variant.stock,
      }]);
      setSelectedSize(variant.size); // Update size when color changes
    }
  };

  const handleThumbnailClick = (image: string) => {
    setSelectedImage(image); // Update big image on thumbnail click
  };

  const handleSizeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedSize(event.target.value as string);
  };

  const handleAddToCart = () => {
    if (product && selectedColor && selectedSize) {
      const selectedVariant = product.variants.find(variant => 
        variant.color === selectedColor.color && variant.size === selectedSize
      );
      if (selectedVariant) {
        addToCart(product, selectedVariant, 1); // Assuming quantity is 1 for simplicity
      }
    }
  };

  if (!product) return <div>Loading...</div>;

  // Gather all images from all variants
  let allImages: string[] = [];
  product.variants.forEach(variant => {
    allImages.push(variant.frontImage);
    allImages.push(variant.backImage);
    variant.additionalImages.forEach(image => allImages.push(image.imageUrl));
  });

  return (
    <MainLayout>
      <Grid container spacing={2}>
        {/* Main Image and Thumbnails Column */}
        <Grid item xs={12} sm={8} md={9}>
          <Box my={4} sx={{ width: "100%", height: "600px", position: 'relative' }}>
            <Swiper
              navigation
              pagination={{ clickable: true }}
              effect="fade"
              loop={true}
              className="mySwiper"
              onSwiper={(swiper) => {
                // Update selected image when swiper active index changes
                setSelectedImage(allImages[swiper.activeIndex]);
              }}
            >
              {allImages.map((image, index) => (
                <SwiperSlide key={index}>
                  <img src={image} alt={`Image ${index}`} style={{ maxWidth: '100%' }} />
                </SwiperSlide>
              ))}
            </Swiper>
          </Box>
        </Grid>

        <Grid item xs={12} sm={4} md={3}>
          {/* Thumbnails */}
          <Box mt={4} sx={{ maxHeight: "600px", overflowY: "auto" }}>
            <Swiper
              direction="vertical"
              slidesPerView={6}
              spaceBetween={10}
              scrollbar={{ draggable: true, hide: true }}
              loop={true}
              className="mySwiper"
              style={{ height: "100%" }}
            >
              {allImages.map((image, index) => (
                <SwiperSlide key={index}>
                  <img
                    src={image}
                    alt={`Thumbnail ${index}`}
                    style={{ width: '100%', cursor: 'pointer' }}
                    onClick={() => handleThumbnailClick(image)}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </Box>
        </Grid>

        {/* Product Details */}
        <Grid item xs={12} sm={8} md={9}>
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
                    <div
                      className={`w-8 h-8 rounded-full cursor-pointer ${selectedColor?.color === variant.color ? 'border-2 border-black' : ''}`}
                      style={{ backgroundColor: variant.color }}
                      onClick={() => handleColorChange({
                        color: variant.color,
                        frontImage: variant.frontImage,
                        backImage: variant.backImage,
                        additionalImages: variant.additionalImages.map((image: APIAdditionalImage) => image.imageUrl),
                      })}
                    ></div>
                  </Grid>
                ))}
              </Grid>
            </Box>

            <Box my={4}>
              <Typography variant="h6" gutterBottom>
                Available Sizes
              </Typography>
              <Grid container spacing={2}>
                {availableSizes.map((size, index) => (
                  <Grid item key={index}>
                    <div
                      className={`w-8 h-8 flex items-center justify-center rounded-full cursor-pointer ${selectedSize === size.size ? 'border-2 border-black' : ''}`}
                      onClick={() => setSelectedSize(size.size)}
                    >
                      {size.size}
                    </div>
                  </Grid>
                ))}
              </Grid>
            </Box>

            <Button variant="contained" color="primary" onClick={handleAddToCart}>
              Add to Cart
            </Button>
          </Box>
        </Grid>
      </Grid>
    </MainLayout>
  );
};

export default ProductPage;
