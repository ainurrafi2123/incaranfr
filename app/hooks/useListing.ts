import { useState, useEffect } from 'react';
import axios from 'axios';

const BASE_URL = 'http://localhost:8000';

export const useListings = () => {
  const [listings, setListings] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [activeTab, setActiveTab] = useState<'for_sale' | 'sold'>('for_sale');
  const [sort, setSort] = useState('newest');
  const [category, setCategory] = useState('');
  const [brand, setBrand] = useState('');
  const [search, setSearch] = useState('');

  const fetchShowcaseByUser = async (userId: string | number) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/products/user/${userId}`);
      setListings(response.data.data); // ✅ akses ke array data di dalam respons
    } catch (error) {
      console.error('Gagal fetch showcase produk user:', error);
    }
  };

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return;

    const user = JSON.parse(userStr);
    const userId = user.id; // ✅ ambil dari key yang benar

    if (!userId) return;

    fetchShowcaseByUser(userId);
  }, []);

  return {
    listings,
    categories,
    brands,
    activeTab,
    sort,
    category,
    brand,
    search,
    setActiveTab,
    setSort,
    setCategory,
    setBrand,
    setSearch,
  };
};
