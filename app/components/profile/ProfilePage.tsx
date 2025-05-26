'use client';
import { useProfile } from '../../hooks/useProfile';
import { Listings } from './Listing';
import { useListings } from '../../hooks/useListing';
import Image from 'next/image';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Star, Calendar, Clock, Shield, ChevronUp } from 'lucide-react';
import { format } from 'date-fns';

export default function ProfilePage() {
  // Gunakan custom hook untuk profil
  const {
    user,
    formData,
    previewUrl,
    error,
    editingField,
    isDetailOpen,
    setEditingField,
    setIsDetailOpen,
    handleInputChange,
    handleFileChange,
    handleSubmitField,
    getFieldStatus,
    setPreviewUrl,
    setFormData,
  } = useProfile();

  // Gunakan custom hook untuk listings
  const {
    listings,
    categories,
    sort,
    category,
    search,
    setSort,
    setCategory,
    setSearch,
  } = useListings();

  // Format tanggal created_at jadi "MMM YYYY"
  const formatMemberSince = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return format(date, 'MMM yyyy');
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'N/A';
    }
  };

  if (!user) {
    return <div>Harap login untuk melihat profil Anda.</div>;
  }

  return (
    <div className="container mx-auto px-10 py-8">
      {/* Header Profil */}
      <div className="mb-6">
        {/* Label "Incaran > @username" */}
        <p className="text-sm text-gray-500 mb-2">
          Incaran {'>'} @{user.name.toLowerCase().replace(/\s/g, '')}
        </p>

        <div className="flex justify-between items-start">
          {/* Kiri: Foto, Nama, Email, Rating */}
          <div className="flex items-center">
            <div className="relative w-20 h-20 mr-4">
              <Image
                src={previewUrl || getValidAvatar(user.avatar)}
                alt={user.name}
                fill
                className={`rounded-full object-cover ${previewUrl ? 'border-2 border-blue-500' : ''}`}
                unoptimized
                onError={(e) => (e.currentTarget.src = '/default-avatar.png')}
              />
            </div>
            <div>
              <h2 className="text-lg font-semibold">{user.name}</h2>
              <div className="flex items-center mt-1">
                <Star className="w-4 h-4 text-yellow-400 mr-1" />
                <span className="text-sm text-gray-600">5.0 (1 review)</span>
              </div>
            </div>
          </div>

          {/* Kanan: Stats dan Info Tambahan */}
          <div className="flex flex-col items-end space-y-4">
            {/* Stats */}
            <div className="flex space-x-6">
              <div className="text-right">
                <p className="text-sm font-semibold">{user.followers || 0}</p>
                <p className="text-xs text-gray-600">Pengikut</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold">{user.following || 0}</p>
                <p className="text-xs text-gray-600">Mengikuti</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold">{user.sold || 0}</p>
                <p className="text-xs text-gray-600">Terjual</p>
              </div>
            </div>

            {/* Info Tambahan */}
            <div className="flex space-x-6">
              <div className="flex flex-col items-center">
                <Calendar className="w-5 h-5 text-gray-500 mb-1" />
                <p className="text-xs text-gray-600">{formatMemberSince(user.created_at || '')}</p>
              </div>
              <div className="flex flex-col items-center">
                <Clock className="w-5 h-5 text-gray-500 mb-1" />
                <p className="text-xs text-gray-600">Ya</p>
              </div>
              <div className="flex flex-col items-center">
                <Shield className="w-5 h-5 text-gray-500 mb-1" />
                <p className="text-xs text-gray-600">Ya</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bio */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Bio</h3>
        {editingField !== 'bio' ? (
          <div className="flex justify-between items-start">
            <p className="text-sm text-gray-700">{user.bio || 'Belum ada bio'}</p>
            <button
              onClick={() => setEditingField('bio')}
              className="text-blue-500 text-sm hover:underline"
            >
              {user.bio ? 'Edit' : 'Tambah'}
            </button>
          </div>
        ) : (
          <div>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              placeholder="Tulis bio Anda..."
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 h-24 resize-none"
            />
            <div className="mt-2">
              <button
                type="button"
                onClick={() => handleSubmitField('bio')}
                className="bg-primary text-white px-3 py-1 rounded-md mr-2"
              >
                Simpan
              </button>
              <button
                type="button"
                onClick={() => setEditingField(null)}
                className="text-gray-500 px-3 py-1 rounded-md"
              >
                Batal
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Detail Profil (Dropdown) */}
      <div className="bg-white  rounded-lg  max-w-md w-full md:w-auto mx-auto md:mx-0 md:ml-0">
        <button
          onClick={() => setIsDetailOpen(!isDetailOpen)}
          className="flex justify-between items-center w-full focus:outline-none"
        >
          <h3 className="text-lg font-semibold">{isDetailOpen ? 'About' : 'Detail'}</h3>
          {isDetailOpen ? (
            <div className="flex items-center text-black">
              <span className="text-sm mr-1">See Less</span>
              <ChevronUp className="w-5 h-5" />
            </div>
          ) : (
            <div className="flex items-center text-black">
              <span className="text-sm mr-1">See More</span>
              <ChevronUp className="w-5 h-5 transform rotate-180" />
            </div>
          )}
        </button>

        {isDetailOpen && (
          <div className="mt-3">
            {error && <p className="text-red-500 mb-2">{error}</p>}

            {/* Detail Items */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 text-gray-500 mr-2" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Member Sejak</p>
                  <p className="text-sm text-gray-500">{formatMemberSince(user.created_at || '')}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 text-gray-500 mr-2" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Confirmed Phone</p>
                  <p className="text-sm text-gray-500">
                    {user.phone_number || 'Belum diisi'} ({getFieldStatus(user.phone_number)})
                  </p>
                  {editingField === 'phone_number' ? (
                    <div className="mt-1">
                      <input
                        type="text"
                        name="phone_number"
                        value={formData.phone_number}
                        onChange={handleInputChange}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-sm"
                      />
                      <div className="mt-1">
                        <button
                          type="button"
                          onClick={() => handleSubmitField('phone_number')}
                          className="bg-primary text-white px-2 py-1 rounded-md mr-1 text-sm"
                        >
                          Simpan
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingField(null)}
                          className="text-gray-500 px-2 py-1 rounded-md text-sm"
                        >
                          Batal
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setEditingField('phone_number')}
                      className="text-blue-500 text-sm hover:underline mt-1"
                    >
                      {getFieldStatus(user.phone_number) === 'Verified' ? 'Edit' : 'Tambah'}
                    </button>
                  )}
                </div>
              </div>
              <div className="flex items-center">
                <Shield className="w-4 h-4 text-gray-500 mr-2" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Confirmed Email</p>
                  <p className="text-sm text-gray-500">{user.email} (Verified)</p>
                </div>
              </div>
            </div>

            {/* Foto Profil */}
            <div className="flex justify-between items-center mb-2">
              <div>
                <p className="text-sm font-medium text-gray-700">Foto Profil</p>
                <p className="text-sm text-gray-500">
                  ({getFieldStatus(user.avatar !== '/default-avatar.png' ? user.avatar : null)})
                </p>
                {editingField === 'profile_picture' && (
                  <div className="mt-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="block w-full text-sm text-gray-500"
                    />
                    {previewUrl && (
                      <div className="mt-1">
                        <p className="text-sm text-gray-500">Pratinjau ditampilkan di atas</p>
                        <button
                          type="button"
                          onClick={() => {
                            setFormData((prev: typeof formData) => ({ ...prev, profile_picture: null }));
                            setFormData((prev) => ({ ...prev, profile_picture: null }));
                          }}
                          className="text-sm text-red-500 hover:underline"
                        >
                          Hapus Pratinjau
                        </button>
                      </div>
                    )}
                    <div className="mt-1">
                      <button
                        type="button"
                        onClick={() => handleSubmitField('profile_picture')}
                        className="bg-primary text-white px-2 py-1 rounded-md mr-1 text-sm"
                      >
                        Simpan
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingField(null);
                          setPreviewUrl(null);
                          setFormData((prev) => ({ ...prev, profile_picture: null }));
                        }}
                        className="text-gray-500 px-2 py-1 rounded-md text-sm"
                      >
                        Batal
                      </button>
                    </div>
                  </div>
                )}
              </div>
              {editingField !== 'profile_picture' && (
                <button
                  onClick={() => setEditingField('profile_picture')}
                  className="text-blue-500 text-sm hover:underline"
                >
                  {getFieldStatus(user.avatar !== '/default-avatar.png' ? user.avatar : null) === 'Verified' ? 'Edit' : 'Tambah'}
                </button>
              )}
            </div>

            {/* Alamat */}
            <div className="flex justify-between items-center mb-2">
              <div>
                <p className="text-sm font-medium text-gray-700">Alamat</p>
                {editingField !== 'address' ? (
                  <p className="text-sm text-gray-500">{user.address || 'Belum diisi'} ({getFieldStatus(user.address)})</p>
                ) : (
                  <div className="mt-1">
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-sm"
                    />
                    <div className="mt-1">
                      <button
                        type="button"
                        onClick={() => handleSubmitField('address')}
                        className="bg-primary text-white px-2 py-1 rounded-md mr-1 text-sm"
                      >
                        Simpan
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingField(null)}
                        className="text-gray-500 px-2 py-1 rounded-md text-sm"
                      >
                        Batal
                      </button>
                    </div>
                  </div>
                )}
              </div>
              {editingField !== 'address' && (
                <button
                  onClick={() => setEditingField('address')}
                  className="text-blue-500 text-sm hover:underline"
                >
                  {getFieldStatus(user.address) === 'Verified' ? 'Edit' : 'Tambah'}
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Garis Pemisah */}
      <hr className="my-6 border-gray-200" />

      {/* Listings */}
      <Listings
      listings={listings}
      sort={sort}
      category={category}
      search={search}
      setSort={setSort}
      setCategory={setCategory}
      setSearch={setSearch}
    />


      {/* Toast Container untuk notifikasi */}
      <ToastContainer />
    </div>
  );
}

// Validasi avatar untuk Image
const getValidAvatar = (avatar: string) => {
  if (avatar && (avatar.startsWith('http') || avatar.startsWith('/'))) {
    return avatar;
  }
  return '/default-avatar.png';
};