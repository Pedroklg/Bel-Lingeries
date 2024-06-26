import React, { useState, useEffect, use } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Button, Menu, MenuItem, Box, Drawer, List, ListItem, ListItemText, Badge } from '@mui/material';
import ArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import InstagramIcon from '@mui/icons-material/Instagram';
import Link from 'next/link';
import Image from 'next/image';
import MenuIcon from '@mui/icons-material/Menu';
import Avatar from '@mui/material/Avatar';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { palette } from '../../theme';
import { fetchProductsByCategory } from '@/services/itemsByCategory';
import { CartItem, Product } from '@/types/models';
import router from 'next/router';

const { belDarkCyan, belDarkBeige, belPink, belLightBeige, belBlue, belOrange } = palette;

const Header: React.FC = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [subMenuAnchorEl, setSubMenuAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedMenu, setSelectedMenu] = useState<string>('');
    const [sutias, setSutias] = useState<Product[]>([]);
    const [conjuntos, setConjuntos] = useState<Product[]>([]);
    const [calcinhas, setCalcinhas] = useState<Product[]>([]);
    const [biquinis, setBiquinis] = useState<Product[]>([]);
    const [cartOpen, setCartOpen] = useState(false);
    const { cartItems, addToCart, removeFromCart, clearCart } = useCart();
    const { user, logout } = useAuth(); // Access user state and logout function from AuthProvider
    const [cartItemTotal, setCartItemTotal] = useState<number>(0);
    const [cartPriceTotal, setCartPriceTotal] = useState<number>(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const dataConjuntos = await fetchProductsByCategory(1); // Category ID for Conjuntos
                setConjuntos(dataConjuntos);

                const dataCalcinhas = await fetchProductsByCategory(2); // Category ID for Calcinhas
                setCalcinhas(dataCalcinhas);

                const dataBiquinis = await fetchProductsByCategory(3); // Category ID for Biquínis
                setBiquinis(dataBiquinis);

                const dataSutias = await fetchProductsByCategory(4); // Category ID for Sutiãs
                setSutias(dataSutias);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchData();
    }, []);

    const handleCategoryClick = (categoryId: number) => async () => {
        router.push(`/products?category=${categoryId}`);
    };

    const handleMenuItemClick = (product: Product) => {
        router.push(`/product/${product.id}`);
    };

    const handleAddItem = (productId: number, variantId: number, quantity: number) => {
        cartItems.map((item) => {
            if (item.product.id === productId && item.variant.id === variantId) {
                addToCart(item.product, item.variant, 1);
            }
        });
    };

    const handleSubtractItem = (productId: number, variantId: number, quantity: number) => {
        if (quantity > 1) {
            cartItems.map((item) => {
                if (item.product.id === productId && item.variant.id === variantId) {
                    addToCart(item.product, item.variant, - 1);
                }
            });
        }
        else {
            handleRemoveFromCart(productId, variantId);
        }
    };

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const handleSubMenuClick = (event: React.MouseEvent<HTMLElement>, menu: string) => {
        setSelectedMenu(menu);
        setSubMenuAnchorEl(event.currentTarget);
    };

    const handleSubMenuClose = () => {
        setSubMenuAnchorEl(null);
    };

    const handleCartClick = () => {
        setCartOpen(!cartOpen);
    };

    const handleCartClose = () => {
        setCartOpen(false);
    };

    const handleAddToCart = (product: Product) => {
        // Example implementation, you might adjust based on your actual product and variant logic
        const variant = product.variants[0]; // Assuming first variant for simplicity
        addToCart(product, variant, 1); // Adding 1 item to the cart
    };

    const handleRemoveFromCart = (productId: number, variantId: number) => {
        removeFromCart(productId, variantId);
    };

    useEffect(() => {
        if (cartItems.length === 0) {
            setCartOpen(false);
        }
        setCartItemTotal(cartItems.reduce((acc, item) => acc + item.quantity, 0));
        setCartPriceTotal(cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0));
    }, [cartItems]);

    return (
        <AppBar position="static" sx={{ backgroundColor: belDarkCyan }}>
            <Toolbar sx={{ justifyContent: 'space-between' }}>
                {/* Left Section */}
                <div className='flex items-center'>
                    {/* Instagram Icon */}
                    <a href="https://www.instagram.com/bel.lingeriespg/" target="_blank" rel="noopener noreferrer" >
                        <IconButton sx={{ color: belLightBeige }}>
                            <InstagramIcon fontSize='large' />
                        </IconButton>
                    </a>
                </div>
                {/* Middle Section - Logo */}
                <Link href="/" passHref>
                    <Typography variant="h6" sx={{
                        color: belDarkBeige,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                        margin: 'auto',
                        '@media (min-width: 640px)': {
                            justifyContent: 'flex-start',
                            textAlign: 'left',
                        },
                    }}>
                        <Image src="/logo.png" width={120} height={120} alt='Bel Lingeries' className='m-3' />
                    </Typography>
                </Link>
                {/* Right Section - Cart and Menu */}
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {/* Cart Icon */}
                    <IconButton onClick={handleCartClick} sx={{ color: belPink }}>
                        <Badge badgeContent={cartItems.length} color="secondary">
                            <ShoppingBagIcon fontSize='large' />
                        </Badge>
                    </IconButton>
                    {/* Menu Icon (mobile menu) */}
                    {user ? (
                        <>
                            <Button onClick={toggleMenu}>
                                <MenuIcon fontSize='large' />
                            </Button>

                            <Drawer
                                anchor="right"
                                open={menuOpen}
                                onClose={() => setMenuOpen(false)}
                            >
                                <Box sx={{ width: 250 }}>
                                    <List>
                                        <ListItem sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                            <Avatar sx={{ color: belPink, bgcolor: belBlue }}>
                                                {user.user?.name?.charAt(0)}
                                            </Avatar>
                                            <ListItemText primary={user.user?.name} />
                                        </ListItem>
                                        <MenuItem onClick={() => setMenuOpen(false)}>Perfil</MenuItem>
                                        <MenuItem onClick={() => setMenuOpen(false)}>Meus Pedidos</MenuItem>
                                        <MenuItem onClick={() => { setMenuOpen(false); setCartOpen(true); }}>Carrinho</MenuItem>
                                        {user?.user?.isAdmin && (
                                            <MenuItem onClick={() => setMenuOpen(false)}>Admin</MenuItem>
                                        )}
                                        <MenuItem onClick={() => { logout(); setMenuOpen(false); }} sx={{ color: belDarkCyan, padding: '0.25rem 0.5rem', bgcolor: belDarkBeige, fontWeight: 'bold', borderRadius: '0.5rem', mx: '1rem' }}>
                                            Logout
                                        </MenuItem>
                                    </List>
                                </Box>
                            </Drawer>
                        </>
                    ) : (
                        <>
                            <Button component={Link} href="/login"
                                sx={{ color: belDarkCyan, padding: '0.25rem 0.5rem', bgcolor: belBlue, fontWeight: 'bold', borderRadius: '0.5rem', mx: '1rem' }}
                            >
                                Login
                            </Button>
                            <Button component={Link} href="/register"
                                sx={{ color: belDarkCyan, padding: '0.25rem 0.5rem', bgcolor: belDarkBeige, fontWeight: 'bold', borderRadius: '0.5rem' }}
                            >
                                Register
                            </Button>
                        </>
                    )}
                </Box>
            </Toolbar>
            {/* Submenu Section */}
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-around',
                backgroundColor: belLightBeige,
                padding: '0.5rem 0',
            }}>
                {/* Dynamic Submenu Buttons */}
                <Button
                    onMouseEnter={(e) => handleSubMenuClick(e, 'conjuntos')}
                    onClick={(e) => handleSubMenuClick(e, 'conjuntos')}
                    sx={{ color: belDarkCyan, fontWeight: 'bold', fontSize: '0.9rem' }}
                >
                    Conjuntos <ArrowDownIcon />
                </Button>
                <Button
                    onMouseEnter={(e) => handleSubMenuClick(e, 'sutias')}
                    onClick={(e) => handleSubMenuClick(e, 'sutias')}
                    sx={{ color: belDarkCyan, fontWeight: 'bold', fontSize: '0.9rem' }}
                >
                    Sutiãs <ArrowDownIcon />
                </Button>
                <Button
                    onMouseEnter={(e) => handleSubMenuClick(e, 'calcinhas')}
                    onClick={(e) => handleSubMenuClick(e, 'calcinhas')}
                    sx={{ color: belDarkCyan, fontWeight: 'bold', fontSize: '0.9rem' }}
                >
                    Calcinhas <ArrowDownIcon />
                </Button>
                <Button
                    onMouseEnter={(e) => handleSubMenuClick(e, 'biquinis')}
                    onClick={(e) => handleSubMenuClick(e, 'biquinis')}
                    sx={{ color: belDarkCyan, fontWeight: 'bold', fontSize: '0.9rem' }}
                >
                    Biquínis <ArrowDownIcon />
                </Button>
            </Box>
            {/* Dynamic Submenu */}
            <Menu
                anchorEl={subMenuAnchorEl}
                open={Boolean(subMenuAnchorEl)}
                onClose={handleSubMenuClose}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                sx={{ display: 'flex', mt: 4 }}
            >
                {/* Dynamic Menu Items based on selectedMenu state */}
                {selectedMenu === 'conjuntos' && (
                    <div onMouseLeave={handleSubMenuClose}>
                        <MenuItem key={'conjuntos'} onClick={handleCategoryClick(1)}>Todos os Conjuntos</MenuItem>
                        {conjuntos.map((product: Product) => (
                            <MenuItem key={product.id} onClick={() => handleMenuItemClick(product)}>
                                {product.name}
                            </MenuItem>
                        ))}
                    </div>
                )}
                {selectedMenu === 'sutias' && (
                    <div onMouseLeave={handleSubMenuClose}>
                        <MenuItem key={'sutias'} onClick={handleCategoryClick(4)}>Todos os Sutiãs</MenuItem>
                        {sutias.map((product: Product) => (
                            <MenuItem key={product.id} onClick={() => handleMenuItemClick(product)}>
                                {product.name}
                            </MenuItem>
                        ))}
                    </div>
                )}
                {selectedMenu === 'calcinhas' && (
                    <div onMouseLeave={handleSubMenuClose}>
                        <MenuItem key={'calcinhas'} onClick={handleCategoryClick(2)}>Todas as calcinhas</MenuItem>
                        {calcinhas.map((product: Product) => (
                            <MenuItem key={product.id} onClick={() => handleMenuItemClick(product)}>
                                {product.name}
                            </MenuItem>
                        ))}
                    </div>
                )}
                {selectedMenu === 'biquinis' && (
                    <div onMouseLeave={handleSubMenuClose}>
                        <MenuItem key={'biquinis'} onClick={handleCategoryClick(3)}>Todos os Biquinis</MenuItem>
                        {biquinis.map((product: Product) => (
                            <MenuItem key={product.id} onClick={() => handleMenuItemClick(product)}>
                                {product.name}
                            </MenuItem>
                        ))}
                    </div>
                )}
                {/* Placeholder when no items */}
                {selectedMenu !== 'conjuntos' && selectedMenu !== 'sutias' && selectedMenu !== 'calcinhas' && selectedMenu !== 'biquinis' && (
                    <MenuItem disabled>Nenhum item encontrado</MenuItem>
                )}
            </Menu>
            {/* Cart Drawer */}
            <Drawer
                anchor="right"
                open={cartOpen}
                onClose={() => setCartOpen(false)}
            >
                <Box sx={{ width: 300 }}>
                    <List>
                        {cartItems.length === 0 ? (
                            <ListItem>
                                <ListItemText primary="Carrinho vazio" />
                            </ListItem>
                        ) : (
                            <>
                                {cartItems.map((item, index) => (
                                    <ListItem key={index} sx={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
                                        <ListItemText
                                            primary={item.product.name}
                                            secondary={`Quantidade: ${item.quantity}`}
                                        />
                                        <ListItemText>
                                            Preço: R$ {(item.product.price * item.quantity).toFixed(2)}
                                        </ListItemText>
                                        <ListItemText>
                                            Tamanho: {item.variant.size}
                                        </ListItemText>
                                        <ListItemText>
                                            Cor: {item.variant.color}
                                        </ListItemText>
                                        <IconButton onClick={() => handleSubtractItem(item.product.id, item.variant.id, item.quantity)}>
                                            -
                                        </IconButton>
                                        <IconButton onClick={() => handleAddItem(item.product.id, item.variant.id, item.quantity)}>
                                            +
                                        </IconButton>
                                        <IconButton onClick={() => handleRemoveFromCart(item.product.id, item.variant.id)}>
                                            Remover
                                        </IconButton>
                                    </ListItem>
                                ))}
                                < ListItem sx={{ bottom: "0" }}>
                                    <ListItemText primary={`Total de itens: ${cartItemTotal}`} />
                                    <ListItemText primary={`Total: R$ ${cartPriceTotal.toFixed(2)}`} />
                                </ListItem>
                                <IconButton onClick={() => console.log("resumo da compra")}>
                                    Finalizar Compra
                                </IconButton>
                            </>
                        )}
                    </List>
                    <Button onClick={clearCart} sx={{ marginTop: 'auto', width: '100%' }}>
                        Limpar Carrinho
                    </Button>
                </Box>
            </Drawer>
        </AppBar >
    );
};

export default Header;
