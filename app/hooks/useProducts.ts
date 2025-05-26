import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const BASE_URL = "http://localhost:8000";

interface Product {
  id: number;
  name: string;
  description: string;
  additional_description?: string;
  price: number;
  stock_quantity: number;
  user_category_id: number;
  product_condition: string;
  status: string;
  category?: { id: number; name: string };
  images?: { id: number; image_url: string; is_cover: number }[];
}

export const useProduct = (id: string) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${BASE_URL}/api/products/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setProduct(response.data.data);
        setError(null);
      } catch (err: any) {
        setError(err.response?.data?.message || "Gagal mengambil data produk");
        toast.error("Gagal mengambil data produk.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  return { product, isLoading, error };
};