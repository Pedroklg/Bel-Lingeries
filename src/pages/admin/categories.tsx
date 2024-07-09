import { useEffect, useState } from "react";
import { Category } from "@/types/models";
import { fetchAllCategories } from "@/services/categoryService";
import { deleteCategory, updateCategory, createCategory } from "@/services/admin/categoryService";
import { set } from "react-hook-form";

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

  const addCategory = () => {
    createCategory(category);
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      if (isEditing) {
        updateCategory(category.id, category);
      } else {
        addCategory();
      }
      console.log("Category added");
      setCategory({ id: 0, name: "", products: [] });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          id="name"
          value={category.name}
          onChange={(e) => setCategory({ ...category, name: e.target.value })}
        />
        <button type="submit">Add Category</button>
      </form>
      <ul>
        {categories.map((category) => (
          <div>
            <li key={category.id}>{category.name}</li>
            <button onClick={handleDelete(category.id)}>
              Delete
            </button>
            <button onClick={handleEdit(category.id)}>
              Edit
            </button>
          </div>
        ))}
      </ul>
    </div>
  );
}

export default Categories;