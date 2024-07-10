import { useEffect, useState } from "react";
import { Category } from "@/types/models";
import { fetchAllCategories } from "@/services/categoryService";
import { deleteCategory, updateCategory, createCategory } from "@/services/admin/categoryService";
import ReusableTable from "@/components/ReusableTable";
import AdminLayout from "@/layouts/AdminLayout";

const columns = [
  { id: "id", label: "ID" },
  { id: "name", label: "Name" },
];

function Categories() {
  const [category, setCategory] = useState<Category>({ id: 0, name: "", products: [] });
  const [categories, setCategories] = useState<Category[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Get categories from the server
    const fetchCategories = async () => {
      const categories = await fetchAllCategories();
      setCategories(categories);
    };

    fetchCategories();
  }, []);

  const addCategory = async () => {
    const newCategory = await createCategory(category);
    setCategories([...categories, newCategory]);
  };

  const handleEdit = (id: number) => () => {
    const category = categories.find((c) => c.id === id);
    if (category) {
      setCategory(category);
      setIsEditing(true);
    }
  };

  const handleDelete = (id: number) => async () => {
    await deleteCategory(id);
    setCategories(categories.filter((c) => c.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await updateCategory(category.id, category);
        setCategories(categories.map((c) => (c.id === category.id ? category : c)));
      } else {
        await addCategory();
      }
      setCategory({ id: 0, name: "", products: [] });
      setIsEditing(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AdminLayout>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            id="name"
            value={category.name}
            onChange={(e) => setCategory({ ...category, name: e.target.value })}
          />
          <button type="submit">{isEditing ? "Update Category" : "Add Category"}</button>
        </form>
        <ReusableTable columns={columns} data={categories} />
    </AdminLayout>
  );
}

export default Categories;