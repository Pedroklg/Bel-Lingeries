import { useEffect, useState } from "react";
import { Product } from "@/types/models";
import AdminLayout from "@/layouts/AdminLayout";
import ProductForm from "@/components/forms/ProductForm";
import ReusableTable from "@/components/ReusableTable";
import { fetchAllProducts } from "@/services/productGETService";

const columns = [
    { id: "id", label: "ID" },
    { id: "name", label: "Name" },
    { id: "description", label: "Description" },
    { id: "price", label: "Price" },
    { id: "categoryId", label: "Category" },
    { id: "collectionId", label: "Collection" },
];

function Products() {
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await fetchAllProducts();
                setProducts(data);
            } catch(error) {
                console.error("Error fetching products", error);
            }
            
        };

        fetchProducts();
    }, []);

    return (
        <AdminLayout>
            <ReusableTable columns={columns} data={products} />
            <ProductForm />
        </AdminLayout>
    );
}

export default Products;