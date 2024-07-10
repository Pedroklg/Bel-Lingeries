import React, { useState, useEffect } from "react";
import ProductVariantForm from "@/components/forms/ProductVariantForm";
import AdminLayout from "@/layouts/AdminLayout";
import { getProductVariants } from "@/services/admin/productVariantService";
import { Category } from "@/types/models";
import ReusableTable from "@/components/ReusableTable";

const columns = [
    { id: "id", label: "ID" },
    { id: "productId", label: "Product ID" },
    { id: "color", label: "Color" },
    { id: "size", label: "Size" },
    { id: "stock", label: "Stock" },
    { id: "frontImage", label: "Front Image" },
    { id: "backImage", label: "Back Image" },
  ];


function ProductVariant() {
    const [variants, setVariants] = useState<Category[]>([]);

    useEffect(() => {
        const fetchvariants = async () => {
            try {
                const variants = await getProductVariants();
                setVariants(variants);
            } catch (error) {
                console.error("Error fetching variants", error);
            }
        }

        fetchvariants();
    }
        , []);
    return (
        <AdminLayout>
            <ReusableTable columns={columns} data={variants} />
            <ProductVariantForm />
        </AdminLayout>
    );
}

export default ProductVariant;