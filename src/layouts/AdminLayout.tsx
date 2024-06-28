import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';
import { AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemText, IconButton, Box } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { palette } from '@/theme';
import Image from 'next/image';
import CircularProgress from '@mui/material/CircularProgress';
import { getSession } from 'next-auth/react';

const { belBlue, belLightBeige, belDarkCyan } = palette;

const drawerWidth = 240;

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme(); // Access theme object

  useEffect(() => {
    const checkAuth = async () => {
      const session = await getSession();
      if (!session) {
        router.push('/login');
      } else {
        setAuthorized(true);
      }
    };
    checkAuth();
  }, [user]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    { text: 'Home', href: '/admin/dashboard' },
    { text: 'Products', href: '/admin/products' },
    { text: 'Product Variants', href: '/admin/product-variants' },
    { text: 'Collections', href: '/admin/collections' },
    { text: 'Categories', href: '/admin/categories' },
    { text: 'Orders', href: '/admin/orders' },
    { text: 'Users', href: '/admin/users' },
    { text: 'Voltar para loja', href: '/' },
  ];

  if (!authorized) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  const drawer = (
    <div>
      <Toolbar />
      <List>
        {menuItems.map((item, index) => (
          <ListItem
            key={index}
            onClick={() => router.push(item.href)}
            sx={{ cursor: 'pointer', bgcolor: belBlue, my: 3, display: 'flex', textAlign: 'center', borderRadius: 3 }}
          >
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1, bgcolor: belDarkCyan }}>
        <Toolbar>
          <IconButton
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, color: belLightBeige, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Image src="/logo.png" width={80} height={80} alt="Bel Lingeries" className="m-3" />
          <Typography variant="h6" noWrap sx={{ color: belLightBeige, fontWeight: 'bold', fontSize: '1.5rem' }}>
            Painel de Administrador
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box', bgcolor: belLightBeige, p: 1, marginTop: '2rem' },
          zIndex: theme.zIndex.drawer,
          display: { xs: 'none', sm: 'block' },
        }}
      >
        {drawer}
      </Drawer>
      <Drawer
        variant="temporary"
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box', bgcolor: belLightBeige, p: 1, marginTop: '2rem' },
          zIndex: theme.zIndex.drawer,
          display: { xs: 'block', sm: 'none' },
        }}
      >
        {drawer}
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3, marginTop: '2rem' }}>
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default AdminLayout;