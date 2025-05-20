import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const BASE_URL = 'http://localhost:8000';

interface Listing {
  id: number;
  name: string;
  price: number;
  image?: string;
}

interface ListingsState {
  listings: Listing[];
  categories: string[];
  brands: string[];
  activeTab: 'for_sale' | 'sold';
  sort: string;
  category: string;
  brand: string;
  search: string;
}

export const useListings = () => {
  const [state, setState] = useState<ListingsState>({
    listings: [],
    categories: [],
    brands: [],
    activeTab: 'for_sale',
    sort: 'newest',
    category: '',
    brand: '',
    search: '',
  });

  // Fetch listings
  // const fetchListings = async () => {
  //   try {
  //     const token = localStorage.getItem('token');
  //     if (!token) throw new Error('Token tidak ditemukan');

  //     const response = await axios.get(`${BASE_URL}/api/user/listings`, {
  //       headers: { Authorization: `Bearer ${token}` },
  //       params: {
  //         status: state.activeTab,
  //         category: state.category,
  //         brand: state.brand,
  //         search: state.search,
  //         sort: state.sort,
  //       },
  //     });
  //     setState((prev) => ({ ...prev, listings: response.data.listings }));
  //   } catch (error: any) {
  //     console.error('Error fetching listings:', error);
  //     toast.error('Gagal mengambil data listing');
  //   }
  // };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/categories`);
      setState((prev) => ({ ...prev, categories: response.data.categories }));
    } catch (error: any) {
      console.error('Error fetching categories:', error);
    }
  };

  // Fetch brands
  const fetchBrands = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/brands`);
      setState((prev) => ({ ...prev, brands: response.data.brands }));
    } catch (error: any) {
      console.error('Error fetching brands:', error);
    }
  };

  // Trigger fetching on state changes
  useEffect(() => {
    // fetchListings();
    fetchCategories();
    fetchBrands();
  }, [state.activeTab, state.category, state.brand, state.search, state.sort]);

  // Handlers untuk update state
  const setActiveTab = (tab: 'for_sale' | 'sold') => {
    setState((prev) => ({ ...prev, activeTab: tab }));
  };

  const setSort = (sort: string) => {
    setState((prev) => ({ ...prev, sort }));
  };

  const setCategory = (category: string) => {
    setState((prev) => ({ ...prev, category }));
  };

  const setBrand = (brand: string) => {
    setState((prev) => ({ ...prev, brand }));
  };

  const setSearch = (search: string) => {
    setState((prev) => ({ ...prev, search }));
  };

  return {
    listings: state.listings,
    categories: state.categories,
    brands: state.brands,
    activeTab: state.activeTab,
    sort: state.sort,
    category: state.category,
    brand: state.brand,
    search: state.search,
    setActiveTab,
    setSort,
    setCategory,
    setBrand,
    setSearch,
  };
};