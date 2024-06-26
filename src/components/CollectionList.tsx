import { useEffect, useState } from 'react';
import { Box, Typography, Grid, Card, CardMedia } from '@mui/material';
import { Collection } from '../types/models';
import { fetchCollections } from '../services/collectionService';
import { palette } from '../theme';
import router from 'next/router';

const { belDarkCyan } = palette;

const CollectionList: React.FC = () => {
  const [collections, setCollections] = useState<Collection[]>([]);

  useEffect(() => {
    const fetchCollectionsData = async () => {
      try {
        const fetchedCollections = await fetchCollections();
        setCollections(fetchedCollections.slice(0, 4));
      } catch (error) {
        console.error('Error fetching collections:', error);
      }
    };

    fetchCollectionsData();
  }, []);

  const handleClickCollection = (collectionId: number) => () => {
    router.push(`/products?collection=${collectionId}`);
  };

  return (
    <Box sx={{ padding: '2rem' }}>
      <Typography
        variant="h4"
        sx={{ marginBottom: '1rem', textAlign: 'center', color: belDarkCyan, fontWeight: 'bold' }}
      >
        Coleções
      </Typography>
      <Grid container spacing={4}>
        {collections.map((collection) => (
          <Grid item key={collection.id} xs={12} sm={6} md={3}>
            <Card onClick={handleClickCollection(collection.id)}>
              <CardMedia
                component="img"
                sx={{ height: 400, width: 400, objectFit: 'cover' }}
                image={collection.image}
                alt={collection.name}
              />
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default CollectionList;
