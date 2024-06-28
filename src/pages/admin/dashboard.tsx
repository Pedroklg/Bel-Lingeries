import { useEffect, useState } from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import { getOrders } from '@/services/admin/ordersService';
import { useAuth } from '@/context/AuthContext';
import { fetchBestSellers } from '@/services/productGETService';
import { Typography, List, ListItem, ListItemText, Divider, Paper, Grid } from '@mui/material';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [ordersSummary, setOrdersSummary] = useState<any[]>([]);
  const [bestSellers, setBestSellers] = useState<any[]>([]);

  useEffect(() => {
    if (user?.user.isAdmin) {
      fetchOrders();
      fetchBestSellersData();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      const orders = await getOrders();
      setOrdersSummary(orders);
    } catch (error) {
      console.error('Failed to fetch orders summary:', error);
    }
  };

  const fetchBestSellersData = async () => {
    try {
      const sellers = await fetchBestSellers();
      setBestSellers(sellers);
    } catch (error) {
      console.error('Failed to fetch best sellers:', error);
    }
  };

  return (
      <AdminLayout>
        <div>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Paper>
                <Typography variant="h5" gutterBottom>
                  Resumo dos Pedidos
                </Typography>
                <List>
                  {ordersSummary.map((order) => (
                    <div key={order.id}>
                      <ListItem>
                        <ListItemText
                          primary={`Order ID: ${order.id}`}
                          secondary={`Total: ${order.total}`}
                        />
                      </ListItem>
                      <Divider />
                    </div>
                  ))}
                </List>
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper>
                <Typography variant="h5" gutterBottom>
                  Best Sellers
                </Typography>
                <List>
                  {bestSellers.map((product) => (
                    <div key={product.id}>
                      <ListItem>
                        <ListItemText
                          primary={`Name: ${product.name}`}
                          secondary={`Sold Count: ${product.soldCount}`}
                        />
                      </ListItem>
                      <Divider />
                    </div>
                  ))}
                </List>
              </Paper>
            </Grid>
          </Grid>
        </div>
      </AdminLayout>
  );
};

export default DashboardPage;