import React, { useState } from 'react';
import { Box, Card, CardContent, CardMedia, Typography } from '@mui/material';
import { Product, ProductVariant } from '../../types/models';
import router from 'next/router';
import { palette } from '@/theme';

const { belOrange } = palette;

interface ProductCardProps {
    product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    const handleColorClick = (variant: ProductVariant) => {
        setSelectedVariant(variant);
    };

    const handleClick = (id: number) => {
        router.push(`/product/${id}`);
    };

    // Determine which images to display based on selectedVariant or default to the first variant
    const frontImage =
        selectedVariant?.frontImage || (product.variants.length > 0 && product.variants[0].frontImage) || 'alguma-imagem-padrao.jpg';
    const backImage =
        selectedVariant?.backImage || (product.variants.length > 0 && product.variants[0].backImage) || 'alguma-imagem-padrao.jpg';
    const availableColors = product.variants.length > 0 ? product.variants.map(variant => variant.color) : [];
    const price = product.price.toFixed(2); // Format price as needed

    return (
        <Card
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            component="div"
            sx={{ maxWidth: 300, margin: 'auto', marginBottom: 20, height: '25rem', width: '18rem' }}
            className="rounded-lg overflow-hidden shadow-lg"
        >
            <CardMedia
                onClick={() => handleClick(product.id)}
                component="img"
                sx={{ height: '15rem', cursor: 'pointer', objectFit: 'cover' }}
                image={isHovered ? backImage : frontImage}
                alt={`${product.name} ${isHovered ? 'back' : 'front'} ${selectedVariant ? selectedVariant.color : ''}`}
            />
            <CardContent>
                <Typography
                    gutterBottom
                    variant="h5"
                    component="div"
                    onClick={() => handleClick(product.id)}
                >
                    {product.name}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'column' }}>
                    <div className="flex gap-2 self-start p-1">
                        {availableColors.map((color, index) => (
                            <div
                                key={index}
                                className="w-6 h-6 rounded-full border cursor-pointer"
                                style={{ backgroundColor: color }}
                                onClick={() => handleColorClick(product.variants[index])}
                            ></div>
                        ))}
                    </div>
                    <Typography
                        variant="body2"
                        sx={{ color: belOrange, fontWeight: 'bold', paddingTop: '1rem', fontSize: '1.2rem' }}
                        onClick={() => handleClick(product.id)}
                    >
                        R$ {price}
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );
};

export default ProductCard;
