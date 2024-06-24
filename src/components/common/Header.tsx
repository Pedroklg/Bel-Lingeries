import { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Button, Menu, MenuItem, Box } from '@mui/material';
import ArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import InstagramIcon from '@mui/icons-material/Instagram';
import Link from 'next/link';
import Image from 'next/image';
import MenuIcon from '@mui/icons-material/Menu';
import Avatar from '@mui/material/Avatar';
import { fetchProductsByCategory } from '@/services/itemsByCategory';
import { Product } from '@/types/models';
import { palette } from '../../theme';
import { useCart } from '@/context/CartContext';

const { belDarkCyan, belDarkBeige, belPink, belLightBeige } = palette;

const Header: React.FC = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [subMenuAnchorEl, setSubMenuAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedMenu, setSelectedMenu] = useState<string>('');
    const [sutias, setSutias] = useState<Product[]>([]);
    const [conjuntos, setConjuntos] = useState<Product[]>([]);
    const [calcinhas, setCalcinhas] = useState<Product[]>([]);
    const [biquinis, setBiquinis] = useState<Product[]>([]);
    const [cartAnchorEl, setCartAnchorEl] = useState<null | HTMLElement>(null);
    const { cartItems } = useCart();

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

    const handleMenuItemClick = (product: Product) => {
        // Implement your logic here for handling menu item clicks
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

    const handleCartClick = (event: React.MouseEvent<HTMLElement>) => {
        setCartAnchorEl(event.currentTarget);
    };

    const handleCartClose = () => {
        setCartAnchorEl(null);
    };

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
                <Link href={"/"} passHref>
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
                        <Image src="/logo.png" width={120} height={120} alt='Bel Lingeries' className='m-3'/>
                    </Typography>
                </Link>
                {/* Right Section - Cart and Menu */}
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {/* Cart Icon */}
                    <IconButton onClick={handleCartClick} sx={{ color: belPink }}>
                        <ShoppingBagIcon fontSize='large' />
                    </IconButton>
                    {/* Menu Icon (mobile menu) */}
                    <Button onClick={toggleMenu}>
                        <MenuIcon fontSize='large' />
                    </Button>
                    {/* Main Menu */}
                    <Menu
                        anchorEl={null}
                        open={menuOpen}
                        onClose={() => setMenuOpen(false)}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                    >
                        {/* Static Example Avatar */}
                        <MenuItem onClick={() => setMenuOpen(false)}>
                            <Avatar>B</Avatar>
                        </MenuItem>
                    </Menu>
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
                    sx={{ color: belDarkCyan, fontWeight: 'bold', fontSize: '0.9rem'}}
                >
                    Conjuntos <ArrowDownIcon />
                </Button>
                <Button
                    onMouseEnter={(e) => handleSubMenuClick(e, 'sutias')}
                    onClick={(e) => handleSubMenuClick(e, 'sutias')}
                    sx={{ color: belDarkCyan, fontWeight: 'bold', fontSize: '0.9rem'}}
                >
                    Sutiãs <ArrowDownIcon />
                </Button>
                <Button
                    onMouseEnter={(e) => handleSubMenuClick(e, 'calcinhas')}
                    onClick={(e) => handleSubMenuClick(e, 'calcinhas')}
                    sx={{ color: belDarkCyan, fontWeight: 'bold', fontSize: '0.9rem'}}
                >
                    Calcinhas <ArrowDownIcon />
                </Button>
                <Button
                    onMouseEnter={(e) => handleSubMenuClick(e, 'biquinis')}
                    onClick={(e) => handleSubMenuClick(e, 'biquinis')}
                    sx={{ color: belDarkCyan, fontWeight: 'bold', fontSize: '0.9rem'}}
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
                        {conjuntos.map((product: Product) => (
                            <MenuItem key={product.id} onClick={() => handleMenuItemClick(product)}>
                                {product.name}
                            </MenuItem>
                        ))}
                    </div>
                )}
                {selectedMenu === 'sutias' && (
                    <div onMouseLeave={handleSubMenuClose}>
                        {sutias.map((product: Product) => (
                            <MenuItem key={product.id} onClick={() => handleMenuItemClick(product)}>
                                {product.name}
                            </MenuItem>
                        ))}
                    </div>
                )}
                {selectedMenu === 'calcinhas' && (
                    <div onMouseLeave={handleSubMenuClose}>
                        {calcinhas.map((product: Product) => (
                            <MenuItem key={product.id} onClick={() => handleMenuItemClick(product)}>
                                {product.name}
                            </MenuItem>
                        ))}
                    </div>
                )}
                {selectedMenu === 'biquinis' && (
                    <div onMouseLeave={handleSubMenuClose}>
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
            {/* Cart Menu */}
            <Menu
                anchorEl={cartAnchorEl}
                open={Boolean(cartAnchorEl)}
                onClose={handleCartClose}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                <MenuItem onClick={handleCartClose}>Item no carrinho 1</MenuItem>
                <MenuItem onClick={handleCartClose}>Item no carrinho 2</MenuItem>
                <MenuItem onClick={handleCartClose}>Item no carrinho 3</MenuItem>
            </Menu>
        </AppBar>
    );
};

export default Header;
