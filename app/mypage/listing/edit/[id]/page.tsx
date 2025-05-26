"use client";

import Navbar from "../../../../components/Navbar";
import { useRouter, useParams } from "next/navigation";
import ProductForm from "../../../../components/ui/FormEditProducts";
import { useProduct } from "../../../../hooks/useProducts";

export default function EditProductPage() {
  const params = useParams(); // ambil params dari hook next/navigation
  const { id } = params; 
  const stringId = Array.isArray(id) ? id[0] : id ?? "";
  const { product, isLoading, error } = useProduct(stringId);
  const router = useRouter();

  if (isLoading) {
    return <div className="min-h-screen bg-gray-50 p-6">Memuat...</div>;
  }

  if (error) {
    return <div className="min-h-screen bg-gray-50 p-6 text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div>
        <Navbar />
      </div>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Edit Produk</h1>
      <ProductForm
        product={product ?? undefined}
        onSubmitSuccess={() => router.push("/listing")}
      />
    </div>
  );
}
