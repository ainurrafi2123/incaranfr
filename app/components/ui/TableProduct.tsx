"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, ChevronDown, Trash2, Clock } from 'lucide-react';

interface ProductImage {
  id: number;
  image_url: string;
  is_cover: number;
}

interface Product {
  id: number;
  name: string;
  price: number;
  status: string;
  created_at: string;
  updated_at: string;
  images?: ProductImage[];
  [key: string]: any; // for any additional fields
}

export default function ProductListingsPage() {
  const [selectedTab, setSelectedTab] = useState('active');
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [sortBy, setSortBy] = useState('newest');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

// Ambil userId dari localStorage saat komponen pertama kali dimuat
useEffect(() => {
  if (typeof window !== 'undefined') {
    const storedUserId = localStorage.getItem('user_id');
    console.log("✅ user_id dari localStorage:", storedUserId); // 👈 Debug userId
    setUserId(storedUserId);
  }
}, []);

// Fetch data produk setelah userId tersedia
useEffect(() => {
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const url = `http://localhost:8000/api/products/user/${userId}`;
      console.log("🌐 Memanggil URL:", url); // 👈 Debug URL API

      const response = await axios.get(url);
      console.log("📦 Respon API:", response.data); // 👈 Debug isi response

      setProducts(response.data.data);
    } catch (error) {
      console.error('❌ Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  if (userId) {
    fetchProducts();
  } else {
    console.warn("⚠️ userId belum tersedia, tidak memanggil API.");
  }
}, [userId]);


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

  const handleDeactivate = async (productId: number) => {
    try {
      await axios.put(`https://your-api-url/products/${productId}/update`, {
        status: 'inactive',
      });
      setProducts(products.map((product) =>
        product.id === productId ? { ...product, status: 'inactive' } : product
      ));
      setSelectedItems(selectedItems.filter((id) => id !== productId));
    } catch (error) {
      console.error('Error deactivating product:', error);
    }
  };

  const handleDelete = async (productId: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
      try {
        await axios.delete(`https://your-api-url/products/${productId}/delete`);
        setProducts(products.filter((product) => product.id !== productId));
        setSelectedItems(selectedItems.filter((id) => id !== productId));
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const handleOffer = (productId: number) => {
    console.log(`Offer untuk produk ID: ${productId}`);
  };

  const handlePromote = (productId: number) => {
    console.log(`Promote untuk produk ID: ${productId}`);
  };

  const sortProducts = (productsToSort: Product[]) => {
    return [...productsToSort].sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      } else if (sortBy === 'oldest') {
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      } else if (sortBy === 'price-high') {
        return b.price - a.price;
      } else if (sortBy === 'price-low') {
        return a.price - b.price;
      }
      return 0;
    });
  };

  const filteredProducts = sortProducts(
    products.filter((product) => product.status === (selectedTab === 'active' ? 'published' : selectedTab))
  );

  const tabs = [
    { id: 'active', label: 'Active', count: products.filter((p) => p.status === 'published').length },
    { id: 'inactive', label: 'Inactive', count: products.filter((p) => p.status === 'inactive').length },
    { id: 'drafts', label: 'Drafts', count: products.filter((p) => p.status === 'draft').length },
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-satoshi">
      <main className="container mx-auto py-8 px-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Daftar Produk Saya</h2>
          <button className="bg-accent hover:bg-opacity-90 text-white px-5 py-2.5 rounded-md font-medium">
            Tambah Produk Baru
          </button>
        </div>

        <div className="mb-6 overflow-x-auto">
          <div className="flex space-x-1 min-w-max">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`px-5 py-3 rounded-t-lg font-medium transition-all flex items-center ${
                  selectedTab === tab.id
                    ? 'bg-white text-indigo-600 shadow-sm border-t-2 border-accent'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span
                    className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                      selectedTab === tab.id ? 'bg-accent text-white' : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 mb-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5 text-accent rounded border-gray-300"
                  checked={selectedItems.length === filteredProducts.length && filteredProducts.length > 0}
                  onChange={handleSelectAll}
                />
                <span className="ml-2 text-gray-700">Pilih Semua</span>
              </label>
              <button
                className={`px-4 py-1.5 rounded font-medium text-sm ${
                  selectedItems.length > 0 ? 'bg-gray-200 text-gray-800' : 'bg-gray-100 text-gray-400'
                }`}
                disabled={selectedItems.length === 0}
                onClick={() => selectedItems.forEach((id) => handleDeactivate(id))}
              >
                Nonaktifkan
              </button>
              <button
                className={`px-4 py-1.5 rounded font-medium text-sm flex items-center ${
                  selectedItems.length > 0 ? 'bg-gray-200 text-gray-800' : 'bg-gray-100 text-gray-400'
                }`}
                disabled={selectedItems.length === 0}
                onClick={() => selectedItems.forEach((id) => handleDelete(id))}
              >
                <Trash2 size={16} className="mr-1" />
                Hapus
              </button>
            </div>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Cari dalam daftar produk"
                  className="pl-9 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 w-64"
                />
                <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
              </div>
              <div className="relative">
                <select
                  className="appearance-none bg-white border border-gray-300 px-4 py-2 pr-8 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="newest">Terbaru</option>
                  <option value="oldest">Terlama</option>
                  <option value="price-high">Harga: Tinggi ke Rendah</option>
                  <option value="price-low">Harga: Rendah ke Tinggi</option>
                </select>
                <ChevronDown className="absolute right-2 top-2.5 text-gray-500 pointer-events-none" size={18} />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left w-12"></th>
                <th className="px-4 py-3 text-left w-24"></th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Nama Produk / Harga</th>
                <th className="px-4 py-3 text-center font-bold text-gray-700">Updated</th>
                <th className="px-4 py-3 text-right w-48"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                    Memuat produk...
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                    Tidak ada produk ditemukan dalam kategori ini
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => {
                  const coverImage = product.images?.find((img) => img.is_cover === 1)?.image_url || '/api/placeholder/80/100';
                  return (
                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4">
                        <input
                          type="checkbox"
                          className="form-checkbox h-5 w-5 text-accent rounded border-gray-300"
                          checked={selectedItems.includes(product.id)}
                          onChange={() => handleSelectItem(product.id)}
                        />
                      </td>
                      <td className="px-4 py-4">
                        <div className="bg-gray-100 rounded overflow-hidden">
                          <img src={coverImage} alt={product.name} className="object-cover h-20 w-16" />
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div>
                          <h3 className="font-medium text-gray-900">{product.name}</h3>
                          <p className="text-accent font-bold">Rp {Number(product.price).toLocaleString('id-ID')}</p>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <div className="flex items-center justify-center">
                          <span className="bg-gray-100 px-3 py-1 rounded-full text-gray-700 font-medium flex items-center">
                            <Clock size={14} className="mr-1 text-gray-500" />
                            {new Date(product.updated_at).toLocaleDateString('id-ID')}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="inline-flex items-center space-x-1">
                          <button
                            className="text-accent hover:text-indigo-700 font-semibold text-sm"
                            onClick={() => handleOffer(product.id)}
                          >
                            Offer
                          </button>
                          <button
                            className="text-accent hover:text-indigo-700 font-semibold text-sm"
                            onClick={() => handlePromote(product.id)}
                          >
                            Promote
                          </button>
                          <button
                            className="text-accent hover:text-indigo-700 font-semibold text-sm"
                            onClick={() => handleDeactivate(product.id)}
                          >
                            Nonaktifkan
                          </button>
                          <button
                            className="text-accent hover:text-indigo-700 font-semibold text-sm"
                            onClick={() => handleDelete(product.id)}
                          >
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
