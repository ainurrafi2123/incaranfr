"use client";

import { useState, useEffect } from "react";
import { Search, ChevronDown, Trash2, Edit } from "lucide-react";
import { useListings } from "../../hooks/useListing"; // Import hook useListings
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import axios from "axios";

const BASE_URL = "http://localhost:8000";

interface ProductImage {
  id: number;
  image_url: string;
  is_cover: number;
}

interface Category {
  id: number;
  name: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  status: string;
  created_at: string;
  updated_at: string;
  product_condition: string;
  category?: Category;
  description?: string;
  images?: ProductImage[];
}

interface DashboardData {
  user_info: {
    id: number;
    name: string;
    email: string;
  };
  product_stats: {
    total_products: number;
    published_products: number;
    draft_products: number;
    total_stock: number;
    total_value: number;
    avg_price: number;
  };
  condition_breakdown: {
    new: number;
    like_new: number;
    lightly_used: number;
    used_good: number;
    used_frequent: number;
  };
  recent_products: Product[];
}

interface ListingsResponse {
  data: Product[];
  statistics: {
    total: number;
    published: number;
    draft: number;
    total_value: number;
  };
  user_id: number;
  user_name: string;
}

const getCoverImage = (images?: ProductImage[]) => {
  if (!images || images.length === 0) return "/default-item.png";
  const cover = images.find((img) => img.is_cover === 1);
  return cover
    ? `${BASE_URL}/storage/${cover.image_url}`
    : `${BASE_URL}/storage/${images[0].image_url}`;
};

export default function ProductListingsPage() {
  type TabType = "draft" | "for_sale";
  const {
    listings: products,
    isLoading,
    error,
    sort,
    setSort,
    activeTab,
    setActiveTab,
    search,
    setSearch,
  } = useListings() as {
    listings: Product[];
    isLoading: boolean;
    error: string | null;
    sort: string;
    setSort: (sort: string) => void;
    activeTab: TabType;
    setActiveTab: (tab: TabType) => void;
    search: string;
    setSearch: (search: string) => void;
  };

  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedCondition, setSelectedCondition] = useState<string>("");
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);

  // Fetch categories from /api/category-products
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/category-products`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setCategories(response.data.data || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Gagal mengambil data kategori.");
      }
    };
    fetchCategories();
  }, []);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/dashboard`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setDashboardData(response.data.data);
      } catch (error) {
        console.error("Error fetching dashboard:", error);
        toast.error("Gagal mengambil data dashboard.");
      }
    };
    fetchDashboard();
  }, []);

  const handleSelectAll = () => {
    if (selectedItems.length === filteredProducts.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredProducts.map((product) => product.id));
    }
  };

  const handleSelectItem = (id: number) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((item) => item !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const handlePublish = async (productId: number) => {
    try {
      await axios.put(
        `${BASE_URL}/api/products/${productId}`,
        { status: "published" },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      toast.success("Produk berhasil dipublikasikan!", {
        position: "top-right",
        autoClose: 2000,
      });
      window.location.reload();
    } catch (error) {
      console.error("Error publishing product:", error);
      toast.error("Gagal mempublikasikan produk.");
    }
  };

  const handleUnpublish = async (productId: number) => {
    try {
      await axios.put(
        `${BASE_URL}/api/products/${productId}`,
        { status: "draft" },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      toast.success("Produk dikembalikan ke draft!", {
        position: "top-right",
        autoClose: 2000,
      });
      window.location.reload();
    } catch (error) {
      console.error("Error unpublishing product:", error);
      toast.error("Gagal mengubah status produk.");
    }
  };

  const handleDelete = async (productId: number) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus produk ini?")) {
      try {
        await axios.delete(`${BASE_URL}/api/products/${productId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        toast.success("Produk dihapus!", {
          position: "top-right",
          autoClose: 2000,
        });
        window.location.reload();
      } catch (error) {
        console.error("Error deleting product:", error);
        toast.error("Gagal menghapus produk.");
      }
    }
  };

  const router = useRouter();
  const handleEdit = (productId: number) => {
    router.push(`listing/edit/${productId}`);
    console.log(`Edit produk ID: ${productId}`);
    toast.info(`Navigasi ke halaman edit produk ID ${productId}`);
  };

  const sortProducts = (productsToSort: Product[]) => {
    return [...productsToSort].sort((a, b) => {
      if (sort === "newest") {
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      } else if (sort === "oldest") {
        return (
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      } else if (sort === "price-high") {
        return b.price - a.price;
      } else if (sort === "price-low") {
        return a.price - b.price;
      }
      return 0;
    });
  };

  const getFilteredProducts = () => {
    let filtered: Product[] = [];
    
    switch (activeTab) {
      case "draft":
        filtered = products.filter((product: Product) => product.status === "draft");
        break;
      case "for_sale":
        filtered = products.filter((product: Product) => product.status === "published");
        break;
      default:
        filtered = products;
    }

    if (search.trim()) {
      filtered = filtered.filter((product: Product) =>
        product.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(
        (product: Product) => product.category?.id.toString() === selectedCategory
      );
    }

    if (selectedCondition) {
      filtered = filtered.filter(
        (product: Product) => product.product_condition === selectedCondition
      );
    }

    return sortProducts(filtered);
  };

  const filteredProducts = getFilteredProducts();

  const tabs = [
    {
      id: "draft",
      label: "Draft",
      count: products.filter((p: Product) => p.status === "draft").length,
    },
    {
      id: "for_sale",
      label: "Dijual",
      count: products.filter((p: Product) => p.status === "published").length,
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Draft</span>;
      case "published":
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Aktif</span>;
      default:
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  const getBulkActions = () => {
    if (activeTab === "draft") {
      return (
        <>
          <button
            className={`px-4 py-1.5 rounded font-medium text-sm ${
              selectedItems.length > 0
                ? "bg-green-200 text-green-800 hover:bg-green-300"
                : "bg-gray-100 text-gray-400"
            }`}
            disabled={selectedItems.length === 0}
            onClick={() => selectedItems.forEach((id) => handlePublish(id))}
          >
            Publikasikan
          </button>
          <button
            className={`px-4 py-1.5 rounded font-medium text-sm flex items-center ${
              selectedItems.length > 0
                ? "bg-red-200 text-red-800 hover:bg-red-300"
                : "bg-gray-100 text-gray-400"
            }`}
            disabled={selectedItems.length === 0}
            onClick={() => selectedItems.forEach((id) => handleDelete(id))}
          >
            <Trash2 size={16} className="mr-1" />
            Hapus
          </button>
        </>
      );
    } else if (activeTab === "for_sale") {
      return (
        <>
          <button
            className={`px-4 py-1.5 rounded font-medium text-sm ${
              selectedItems.length > 0
                ? "bg-yellow-200 text-yellow-800 hover:bg-yellow-300"
                : "bg-gray-100 text-gray-400"
            }`}
            disabled={selectedItems.length === 0}
            onClick={() => selectedItems.forEach((id) => handleUnpublish(id))}
          >
            Jadikan Draft
          </button>
          <button
            className={`px-4 py-1.5 rounded font-medium text-sm flex items-center ${
              selectedItems.length > 0
                ? "bg-red-200 text-red-800 hover:bg-red-300"
                : "bg-gray-100 text-gray-400"
            }`}
            disabled={selectedItems.length === 0}
            onClick={() => selectedItems.forEach((id) => handleDelete(id))}
          >
            <Trash2 size={16} className="mr-1" />
            Hapus
          </button>
        </>
      );
    }
    return null;
  };

  const getRowActions = (product: Product) => {
    if (product.status === "draft") {
      return (
        <>
          <button
            onClick={() => handleEdit(product.id)}
            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
          >
            Edit
          </button>
          <button
            onClick={() => handlePublish(product.id)}
            className="text-green-600 hover:text-green-800 text-sm font-medium"
          >
            Publikasikan
          </button>
          <button
            onClick={() => handleDelete(product.id)}
            className="text-red-600 hover:text-red-800 text-sm font-medium"
          >
            Hapus
          </button>
        </>
      );
    } else if (product.status === "published") {
      return (
        <>
          <button
            onClick={() => handleEdit(product.id)}
            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
          >
            Edit
          </button>
          <button
            onClick={() => handleUnpublish(product.id)}
            className="text-yellow-600 hover:text-yellow-800 text-sm font-medium"
          >
            Draft
          </button>
          <button
            onClick={() => handleDelete(product.id)}
            className="text-red-600 hover:text-red-800 text-sm font-medium"
          >
            Hapus
          </button>
        </>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50 font-satoshi">
      <main className="container mx-auto py-8 px-8">
        {/* Dashboard Section */}
        {dashboardData && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Dashboard</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-600">Statistik Produk</h4>
                <p>Total Produk: {dashboardData.product_stats.total_products}</p>
                <p>Produk Aktif: {dashboardData.product_stats.published_products}</p>
                <p>Produk Draft: {dashboardData.product_stats.draft_products}</p>
                <p>Total Nilai: Rp {dashboardData.product_stats.total_value.toLocaleString("id-ID")}</p>
                <p>Rata-rata Harga: Rp {dashboardData.product_stats.avg_price.toLocaleString("id-ID")}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-600">Kondisi Produk</h4>
                <p>Baru: {dashboardData.condition_breakdown.new}</p>
                <p>Seperti Baru: {dashboardData.condition_breakdown.like_new}</p>
                <p>Sedikit Bekas: {dashboardData.condition_breakdown.lightly_used}</p>
                <p>Bekas Baik: {dashboardData.condition_breakdown.used_good}</p>
                <p>Bekas Sering: {dashboardData.condition_breakdown.used_frequent}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-600">Produk Terbaru</h4>
                {dashboardData.recent_products.map((product) => (
                  <div key={product.id} className="flex items-center space-x-2 mt-2">
                    <img
                      src={getCoverImage(product.images)}
                      alt={product.name}
                      className="w-8 h-8 object-cover rounded"
                    />
                    <span className="text-sm">{product.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Daftar Produk Saya</h2>
          <button className="bg-accent hover:bg-opacity-90 text-white px-5 py-2.5 rounded-md font-medium">
            Tambah Produk Baru
          </button>
        </div>

        <div className="flex space-x-1 mb-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as "draft" | "for_sale")}
              className={`px-5 py-3 rounded-t-lg font-medium transition-all flex items-center ${
                activeTab === tab.id
                  ? "bg-white text-indigo-600 shadow-sm border-t-2 border-accent"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span
                  className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                    activeTab === tab.id
                      ? "bg-accent text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 mb-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5 text-accent rounded border-gray-300"
                  checked={
                    selectedItems.length === filteredProducts.length &&
                    filteredProducts.length > 0
                  }
                  onChange={handleSelectAll}
                />
                <span className="ml-2 text-gray-700">Pilih Semua</span>
              </label>
              {getBulkActions()}
            </div>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Cari dalam daftar produk"
                  className="pl-9 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 w-64"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <Search
                  className="absolute left-3 top-2.5 text-gray-400"
                  size={16}
                />
              </div>
              <select
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">Semua Kategori</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <select
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                value={selectedCondition}
                onChange={(e) => setSelectedCondition(e.target.value)}
              >
                <option value="">Semua Kondisi</option>
                <option value="new">Baru</option>
                <option value="like_new">Seperti Baru</option>
                <option value="lightly_used">Sedikit Bekas</option>
                <option value="used_good">Bekas Baik</option>
                <option value="used_frequent">Bekas Sering</option>
              </select>
              <select
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="newest">Terbaru</option>
                <option value="oldest">Terlama</option>
                <option value="price-high">Harga Tertinggi</option>
                <option value="price-low">Harga Terendah</option>
              </select>
            </div>
          </div>
        </div>

        <table className="w-full border-collapse rounded-lg overflow-hidden shadow-sm">
          <thead className="bg-gray-100 border-b border-gray-300">
            <tr>
              <th className="p-3 w-12">
                <input
                  type="checkbox"
                  checked={
                    selectedItems.length === filteredProducts.length &&
                    filteredProducts.length > 0
                  }
                  onChange={handleSelectAll}
                  className="form-checkbox h-5 w-5 text-accent rounded border-gray-300"
                />
              </th>
              <th className="p-3 text-left">Produk</th>
              <th className="p-3 text-left">Harga</th>
              <th className="p-3 text-center">Status</th>
              <th className="p-3 text-center">Kondisi</th>
              <th className="p-3 text-center">Terakhir Diubah</th>
              <th className="p-3 w-48 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                  Memuat produk...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-red-500">
                  {error}
                </td>
              </tr>
            ) : filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                  {search.trim()
                    ? `Tidak ada produk yang cocok dengan pencarian "${search}"`
                    : `Tidak ada produk dalam kategori ${activeTab === "draft" ? "Draft" : "Dijual"}`}
                </td>
              </tr>
            ) : (
              filteredProducts.map((product) => (
                <tr key={product.id} className="bg-white hover:bg-gray-50">
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(product.id)}
                      onChange={() => handleSelectItem(product.id)}
                      className="form-checkbox h-5 w-5 text-accent rounded border-gray-300"
                    />
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center space-x-4">
                      <img
                        src={getCoverImage(product.images)}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                      <div>
                        <div className="font-medium text-gray-800">
                          {product.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {product.category?.name || "Tanpa Kategori"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-gray-700 font-semibold">
                    Rp {product.price.toLocaleString("id-ID")}
                  </td>
                  <td className="px-4 py-4 text-center">
                    {getStatusBadge(product.status)}
                  </td>
                  <td className="px-4 py-4 text-center text-gray-600 text-sm">
                    {product.product_condition
                      ? {
                          new: "Baru",
                          like_new: "Seperti Baru",
                          lightly_used: "Sedikit Bekas",
                          used_good: "Bekas Baik",
                          used_frequent: "Bekas Sering",
                        }[product.product_condition]
                      : "-"}
                  </td>
                  <td className="px-4 py-4 text-center text-gray-600 text-sm">
                    {new Date(product.updated_at).toLocaleDateString("id-ID", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="px-4 py-4 text-right">
                    <div className="flex justify-end space-x-2 flex-wrap">
                      {getRowActions(product)}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </main>
    </div>
  );
}