import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const BASE_URL = 'http://localhost:8000';

export const useListings = () => {
  const [listings, setListings] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [activeTab, setActiveTab] = useState('published'); // Ganti 'for_sale' jadi 'published'
  const [sort, setSort] = useState('newest');
  const [category, setCategory] = useState('');
  const [brand, setBrand] = useState('');
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFiltered = async (token: string) => {
  setIsLoading(true);
  setError(null);

  try {
    const response = await axios.get(`${BASE_URL}/api/products`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Cache-Control': 'no-cache',
      },
    });
    console.log('Full response:', response.data); // Log seluruh response
    setListings(response.data.data || []);
  } catch (error) {
    let errorMessage = 'Server error';
    if (typeof error === 'object' && error !== null) {
      if ('response' in error && typeof (error as any).response === 'object' && (error as any).response !== null) {
        errorMessage = (error as any).response.data?.message || 'Server error';
        console.error('Gagal fetch produk:', (error as any).response.data || (error as any).message);
      } else if ('message' in error) {
        errorMessage = (error as any).message;
        console.error('Gagal fetch produk:', (error as any).message);
      }
    } else {
      console.error('Gagal fetch produk:', error);
    }
    setError('Gagal memuat produk. Silakan coba lagi.');
    toast.error(`Gagal memuat produk: ${errorMessage}`, {
      position: 'top-right',
      autoClose: 3000,
    });
  } finally {
    setIsLoading(false);
  }
};

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Tidak ada pengguna yang login. Silakan login kembali.');
      toast.error('Silakan login untuk melihat produk.', {
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }
    fetchFiltered(token);
  }, [sort, category, brand, search, activeTab]);

  useEffect(() => {
    const handleStorageChange = () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setListings([]);
        setError('Sesi berakhir. Silakan login kembali.');
        toast.error('Sesi berakhir. Silakan login kembali.', {
          position: 'top-right',
          autoClose: 3000,
        });
      } else {
        fetchFiltered(token);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [sort, category, brand, search, activeTab]);

  return {
    listings,
    categories,
    brands,
    activeTab,
    sort,
    category,
    brand,
    search,
    isLoading,
    error,
    setActiveTab,
    setSort,
    setCategory,
    setBrand,
    setSearch,
  };
};