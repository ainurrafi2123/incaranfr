"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // ✅ pakai ini untuk App Router
import { ChevronRight } from "lucide-react";

const ProductCatalog = () => {
  interface Product {
    id: number;
    name: string;
    price: string;
    category: {
      name: string;
    };
    images?: {
      is_cover: boolean;
      image_url: string;
    }[];
  }

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter(); // ✅ inisialisasi router

  // Fetch data dari API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:8000/api/products/public");
        const data = await response.json();
        setProducts(data.data);
        setError(null);
      } catch (err) {
        setError("Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Mengelompokkan produk berdasarkan kategori
  const groupProductsByCategory = () => {
    const grouped: Record<string, { category: { name: string }; products: Product[] }> = {};
    products.forEach((product) => {
      const categoryName = product.category.name;
      if (!grouped[categoryName]) {
        grouped[categoryName] = {
          category: product.category,
          products: [],
        };
      }
      grouped[categoryName].products.push(product);
    });
    return grouped;
  };

  // Format harga ke IDR
  const formatPrice = (price: string | number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(parseFloat(price.toString()));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  const groupedData = groupProductsByCategory();

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {Object.entries(groupedData).map(([categoryName, categoryData]) => (
          <div key={categoryName} className="mb-12">
            {/* Header kategori */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">{categoryName}</h2>
              <button className="flex items-center text-blue-600 hover:text-blue-800 font-medium">
                See all
                <ChevronRight className="ml-1 h-4 w-4" />
              </button>
            </div>

            {/* Grid produk */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {categoryData.products.map((product) => (
                <div
                  key={product.id}
                  className="group cursor-pointer"
                  onClick={() => router.push(`/products/${product.id}`)} // ✅ routing saat klik produk
                >
                  {/* Gambar produk */}
                  <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden mb-3">
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={`http://localhost:8000/storage/${
                          product.images.find((img) => img.is_cover)?.image_url || product.images[0].image_url
                        }`}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://via.placeholder.com/200x200?text=No+Image";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-gray-400 text-2xl">📷</div>
                      </div>
                    )}
                  </div>

                  {/* Info produk */}
                  <div>
                    <h3 className="font-medium text-gray-900 text-sm mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-lg font-bold text-gray-900">{formatPrice(product.price)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductCatalog;
