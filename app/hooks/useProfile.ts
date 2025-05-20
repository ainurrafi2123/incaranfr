import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const BASE_URL = 'http://localhost:8000';

interface User {
  name: string;
  email: string;
  avatar: string;
  address: string;
  phone_number: string;
  bio: string;
  created_at: string;
  followers: number;
  following: number;
  sold: number;
}


interface FormData {
  address: string;
  phone_number: string;
  bio: string;
  profile_picture: File | null;
}


export const useProfile = () => {
  const [user, setUser] = useState<User | null>(null);
  
  const [formData, setFormData] = useState<FormData>({
    address: '',
    phone_number: '',
    bio: '',
    profile_picture: null,
  });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string>('');
  const [editingField, setEditingField] = useState<string | null>(null);
  
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Ambil data user dari localStorage saat komponen dimuat
  useEffect(() => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const name = localStorage.getItem('name') || 'User';
        const email = localStorage.getItem('email') || '';
        const avatar = localStorage.getItem('avatar') || '/default-avatar.png';
        const address = localStorage.getItem('address') || '';
        const phone_number = localStorage.getItem('phone_number') || '';
        const bio = localStorage.getItem('bio') || '';
        const created_at = localStorage.getItem('created_at') || '';
        const followers = 0;
        const following = 0;
        const sold = 1;
        setUser({ name, email, avatar, address, phone_number, bio, created_at, followers, following, sold });
        setFormData({ address, phone_number, bio, profile_picture: null });
        console.log('User loaded from localStorage:', {
          name,
          email,
          avatar,
          address,
          phone_number,
          bio,
          created_at,
        });
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      setUser(null);
    }
  }, []);

  // Handle perubahan input form
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle upload file profile_picture
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (!['image/jpeg', 'image/png', 'image/jpg', 'image/gif'].includes(file.type)) {
        toast.error('Harap unggah gambar (JPEG, PNG, JPG, GIF)');
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Ukuran file maksimal 2MB');
        return;
      }
      setFormData((prev) => ({ ...prev, profile_picture: file }));
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setFormData((prev) => ({ ...prev, profile_picture: null }));
      setPreviewUrl(null);
    }
  };

  // Handle submit per field
  const handleSubmitField = async (field: string) => {
    try {
      setError('');
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token tidak ditemukan, silakan login kembali.');
      }

      const formDataToSend = new FormData();
      if (field === 'profile_picture' && formData.profile_picture) {
        formDataToSend.append('profile_picture', formData.profile_picture);
      } else if (field === 'address') {
        formDataToSend.append('address', formData.address);
      } else if (field === 'phone_number') {
        formDataToSend.append('phone_number', formData.phone_number);
      } else if (field === 'bio') {
        formDataToSend.append('bio', formData.bio);
      }

      const response = await axios.post(
        `${BASE_URL}/api/update-profile`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      const updatedUser = response.data.user;

      // Update localStorage
      localStorage.setItem('address', updatedUser.address || '');
      localStorage.setItem('phone_number', updatedUser.phone_number || '');
      localStorage.setItem('bio', updatedUser.bio || '');
      localStorage.setItem('name', updatedUser.name || localStorage.getItem('name') || 'User');
      localStorage.setItem('created_at', updatedUser.created_at || '');
      let avatar = '/default-avatar.png';
      if (updatedUser.profile_picture) {
        avatar = updatedUser.profile_picture.startsWith('http')
          ? updatedUser.profile_picture
          : `${BASE_URL}/storage/${updatedUser.profile_picture}`;
      }
      localStorage.setItem('avatar', avatar);

      // Update state
      setUser((prev) =>
        prev
          ? {
              ...prev,
              name: updatedUser.name || prev.name,
              address: updatedUser.address || '',
              phone_number: updatedUser.phone_number || '',
              bio: updatedUser.bio || '',
              created_at: updatedUser.created_at || '',
              avatar,
            }
          : null
      );
      setFormData({
        address: updatedUser.address || '',
        phone_number: updatedUser.phone_number || '',
        bio: updatedUser.bio || '',
        profile_picture: null,
      });
      setPreviewUrl(null);
      setEditingField(null);

      toast.success('Data berhasil diperbarui!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      window.dispatchEvent(new Event('storage'));
      console.log('Field updated:', updatedUser);
    } catch (error: any) {
      const errorMsg = error.response?.data?.error || 'Gagal memperbarui data';
      setError(errorMsg);
      toast.error(errorMsg, {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      console.error('Error updating field:', error.response?.data || error.message);
    }
  };

  // Bersihkan previewUrl saat komponen unmount
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Cek status field (Verified/Not Verified)
  const getFieldStatus = (value: string | null) => {
    return value && value.trim() !== '' ? 'Verified' : 'Not Verified';
  };

  return {
    user,
    formData,
    setFormData,
    previewUrl,
    setPreviewUrl,
    error,
    editingField,
    isDetailOpen,
    setEditingField,
    setIsDetailOpen,
    handleInputChange,
    handleFileChange,
    handleSubmitField,
    getFieldStatus,
  };
};