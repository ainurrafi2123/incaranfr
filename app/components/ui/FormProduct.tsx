"use client";
import { useState, useRef } from 'react';
import { Camera, X, Upload, Plus, Check } from 'lucide-react';

export default function ProductForm() {
  const [images, setImages] = useState<{ id: string; url: string; file: File }[]>([]);
  const [condition, setCondition] = useState('new');
  const [priceType, setPriceType] = useState('sale');
  const [category, setCategory] = useState('sneakers');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const conditions = [
    { id: 'new', label: 'Barang baru' },
    { id: 'like_new', label: 'Seperti baru' },
    { id: 'lightly_used', label: 'Tidak terlalu sering digunakan' },
    { id: 'used_good', label: 'Digunakan dengan baik' },
    { id: 'used_frequent', label: 'Sering digunakan' },
  ];
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length + images.length > 10) {
      alert('Maksimal 10 foto');
      return;
    }
    
    const newImages = files.map(file => ({
      id: Math.random().toString(36).substring(2),
      url: URL.createObjectURL(file),
      file
    }));
    
    setImages(prev => [...prev, ...newImages]);
  };
  
  const removeImage = (id: string) => {
    setImages(prev => prev.filter(image => image.id !== id));
  };
  
  return (
    <div className="flex flex-col md:flex-row gap-6 bg-gray-50 min-h-screen p-6 font-satoshi">
      {/* Left Column - Image Upload */}
      <div className="w-full md:w-1/2 space-y-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Foto Produk</h2>
          
          <div className="border-2 border-dashed border-[#FF9C5A] rounded-lg p-8 bg-[#FFD35A]/10 flex flex-col items-center justify-center">
            <div className="h-24 w-24 bg-[#FFD35A]/30 rounded-full flex items-center justify-center mb-4">
              <Camera size={40} className="text-[#FF9C5A]" />
            </div>
            
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="bg-[#FF9C5A] hover:bg-[#FF9C5A]/90 text-white font-bold py-2 px-6 rounded-md transition-all"
            >
              Pilih Foto
            </button>
            
            <input 
              type="file" 
              ref={fileInputRef}
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            
            <p className="text-gray-600 mt-3 text-center font-inter">
              atau pindahkan foto ke sini<br />
              <span className="text-sm">(Hingga 10 foto)</span>
            </p>
          </div>
          
          {images.length > 0 && (
            <div className="mt-6">
              <h3 className="font-bold mb-3 text-gray-800">Foto yang dipilih</h3>
              <div className="grid grid-cols-3 gap-4">
                {images.map((image, index) => (
                  <div key={image.id} className="relative group">
                    <img 
                      src={image.url} 
                      alt={`Product preview ${index + 1}`} 
                      className="w-full h-32 object-cover rounded-md"
                    />
                    <button
                      onClick={() => removeImage(image.id)}
                      className="absolute top-2 right-2 bg-black/70 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={16} />
                    </button>
                    {index === 0 && (
                      <div className="absolute bottom-2 left-2 bg-[#FF9C5A] text-white text-xs py-1 px-2 rounded font-bold">
                        Sampul
                      </div>
                    )}
                  </div>
                ))}
                
                {images.length < 10 && (
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="h-32 border-2 border-dashed border-[#FFD35A]/50 rounded-md flex flex-col items-center justify-center hover:bg-[#FFD35A]/5 transition-colors"
                  >
                    <Plus size={24} className="text-[#FF9C5A] mb-1" />
                    <span className="text-sm text-gray-600 font-medium">Tambah Foto</span>
                  </button>
                )}
              </div>
            </div>
          )}
          
          <div className="flex items-center mt-6 text-gray-600">
            <div className="p-2 bg-[#FFD35A]/20 rounded-full mr-2">
              <Upload size={16} className="text-[#FF9C5A]" />
            </div>
            <p className="text-sm font-inter">Tip: Atur ulang foto untuk mengganti sampul</p>
          </div>
        </div>
      </div>
      
      {/* Right Column - Form */}
      <div className="w-full md:w-1/2 space-y-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Detail Produk</h2>
          
          {/* Category */}
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">Kategori</label>
            <div className="relative">
              <button 
                className="w-full flex items-center justify-between border border-gray-300 rounded-lg p-3 bg-white focus:outline-none focus:ring-2 focus:ring-[#FF9C5A]"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <div className="flex items-center">
                  <span className="font-medium">{category === 'sneakers' ? 'Sneakers' : 'Kategori Lain'}</span>
                  {category === 'sneakers' && <span className="text-gray-500 mx-2">›</span>}
                  {category === 'sneakers' && <span className="text-gray-500">Sepatu</span>}
                </div>
                <svg className={`w-5 h-5 transition-transform ${isDropdownOpen ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              
              {isDropdownOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg">
                  <div className="p-2">
                    <button 
                      className="w-full text-left px-4 py-2 hover:bg-[#FFD35A]/10 rounded flex items-center"
                      onClick={() => {
                        setCategory('sneakers');
                        setIsDropdownOpen(false);
                      }}
                    >
                      {category === 'sneakers' && <Check size={16} className="mr-2 text-[#FF9C5A]" />}
                      <span>Sneakers</span>
                    </button>
                    <button 
                      className="w-full text-left px-4 py-2 hover:bg-[#FFD35A]/10 rounded flex items-center"
                      onClick={() => {
                        setCategory('clothing');
                        setIsDropdownOpen(false);
                      }}
                    >
                      {category === 'clothing' && <Check size={16} className="mr-2 text-[#FF9C5A]" />}
                      <span>Pakaian</span>
                    </button>
                    <button 
                      className="w-full text-left px-4 py-2 hover:bg-[#FFD35A]/10 rounded flex items-center"
                      onClick={() => {
                        setCategory('accessories');
                        setIsDropdownOpen(false);
                      }}
                    >
                      {category === 'accessories' && <Check size={16} className="mr-2 text-[#FF9C5A]" />}
                      <span>Aksesoris</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Title */}
          <div className="mb-6">
            <label htmlFor="title" className="block text-gray-700 font-medium mb-2">Judul produk</label>
            <input
              type="text"
              id="title"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#FF9C5A] font-inter"
              placeholder="Contoh: Sepatu Sneakers Nike Air Max 270"
            />
          </div>
          
          <div className="border-t border-gray-200 my-6 pt-6">
            <h3 className="font-bold text-lg mb-4 text-gray-800">Rincian produk</h3>
            
            {/* Condition */}
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-3">Kondisi</label>
              <div className="flex flex-wrap gap-2">
                {conditions.map(item => (
                  <button
                    key={item.id}
                    className={`py-2 px-4 rounded-full border font-medium ${
                      condition === item.id 
                        ? 'bg-[#FF9C5A] text-white border-[#FF9C5A]' 
                        : 'border-gray-300 hover:bg-[#FFD35A]/10'
                    }`}
                    onClick={() => setCondition(item.id)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Price */}
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-3">Harga</label>
              <div className="flex gap-3 mb-4">
                <button
                  className={`flex-1 py-3 px-4 rounded-full border font-bold ${
                    priceType === 'sale' 
                      ? 'bg-[#FF9C5A] text-white border-[#FF9C5A]' 
                      : 'border-gray-300 hover:bg-[#FFD35A]/10'
                  }`}
                  onClick={() => setPriceType('sale')}
                >
                  Dijual
                </button>
                <button
                  className={`flex-1 py-3 px-4 rounded-full border font-bold ${
                    priceType === 'free' 
                      ? 'bg-[#FF9C5A] text-white border-[#FF9C5A]' 
                      : 'border-gray-300 hover:bg-[#FFD35A]/10'
                  }`}
                  onClick={() => setPriceType('free')}
                >
                  Gratis
                </button>
              </div>
              
              {priceType === 'sale' && (
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">Rp</span>
                  <input
                    type="number"
                    className="w-full border border-gray-300 rounded-lg p-3 pl-10 focus:outline-none focus:ring-2 focus:ring-[#FF9C5A] font-inter"
                    placeholder="Harga barangmu"
                  />
                </div>
              )}
            </div>
            
            {/* Description */}
            <div className="mb-6">
              <label htmlFor="description" className="block text-gray-700 font-medium mb-2">Deskripsi (Opsional)</label>
              <textarea
                id="description"
                rows={6}
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#FF9C5A] font-inter"
                placeholder="Berikan deskripsi mendetail tentang produk yang dijual..."
              ></textarea>
            </div>
          </div>
        </div>
        
        {/* Submit Button */}
        <div className="bg-white p-6 rounded-lg shadow">
          <button className="w-full bg-[#FF9C5A] hover:bg-[#FF9C5A]/90 text-white font-bold py-3 px-6 rounded-md transition-all">
            Pasang sekarang
          </button>
        </div>
      </div>
    </div>
  );
}