import React, { useState, useEffect } from 'react';
import { Collection } from '@prisma/client';
import { Grid, Button, TextField } from '@mui/material';
import { createCollection, getCollections, updateCollection, deleteCollection } from '@/services/admin/collectionService';
import ReusableTable from '@/components/ReusableTable';
import AdminLayout from '@/layouts/AdminLayout';

const columns = [
  { id: 'id', label: 'ID' },
  { id: 'name', label: 'Name' },
  { id: 'image', label: 'Image' },
];

const CollectionsPage: React.FC = () => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [collection, setCollection] = useState<Collection>({
    id: 0,
    name: '',
    image: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedCollections = await getCollections();
        setCollections(fetchedCollections);
      } catch (error) {
        console.error('Error fetching collections:', error);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (collection.id) {
        await updateCollection(collection.id, collection);
      } else {
        await createCollection(collection);
      }
      const fetchedCollections = await getCollections();
      setCollections(fetchedCollections);
      setCollection({ id: 0, name: '', image: '' });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDelete = async (collectionId: number) => {
    try {
      await deleteCollection(collectionId);
      const fetchedCollections = await getCollections();
      setCollections(fetchedCollections);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCollection((prevCollection) => ({
      ...prevCollection,
      [name]: value,
    }));
  };

  return (
    <AdminLayout>
      <h1>Collections</h1>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              name="name"
              label="Name"
              fullWidth
              value={collection.name}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <input 
              type="file"
              name="image"
              id='image'
              accept="image/*"
              onChange={handleChange}
             />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Button type="submit" variant="contained" color="primary">
              {collection.id ? 'Update Collection' : 'Create Collection'}
            </Button>
          </Grid>
        </Grid>
      </form>

      <div>
        <h2>All Collections</h2>
        <ReusableTable columns={columns} data={collections} />
      </div>
    </AdminLayout>
  );
};

export default CollectionsPage;
