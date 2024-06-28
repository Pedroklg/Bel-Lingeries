import React, { useState, useEffect } from 'react';
import { Collection } from '@prisma/client';
import { Grid, Button, TextField } from '@mui/material';
import { createCollection, getCollections, updateCollection, deleteCollection } from '@/services/admin/collectionService';

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
      // Refresh collections list
      const fetchedCollections = await getCollections();
      setCollections(fetchedCollections);
      // Reset form
      setCollection({ id: 0, name: '', image: ''});
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDelete = async (collectionId: number) => {
    try {
      await deleteCollection(collectionId);
      // Refresh collections list
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
    <div>
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
            <TextField
              name="image"
              label="Image URL"
              fullWidth
              value={collection.image}
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
        <ul>
          {collections.map((col) => (
            <li key={col.id}>
              <div>Name: {col.name}</div>
              <div>Image: {col.image}</div>
              <div>
                <Button variant="contained" color="secondary" onClick={() => handleDelete(col.id)}>
                  Delete
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CollectionsPage;
