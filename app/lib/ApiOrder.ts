// lib/api.ts
import axios from 'axios';
import { toast } from 'react-toastify';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.response?.status === 401) {
      toast.error('Sesi telah berakhir. Silakan login kembali.', {
        position: 'top-right',
        autoClose: 3000,
      });
      localStorage.clear();
      window.location.href = '/login';
    }
    return (Promise.reject(error));
  }
);

export const getOrders = async (page: number = 1) => {
  const response = await api.get('/orders', { params: { page, per_page: 10 } });
  return response.data;
};

export const updateOrderStatus = async (id: number, status: string) => {
  const response = await api.put(`/orders/${id}`, { status });
  return response.data;
};

export const deleteOrder = async (id: number) => {
  const response = await api.delete(`/orders/${id}`);
  return response.data;
};

export default api;