"use client";

import { useState, useEffect, useRef } from "react";
import { Camera, X, Upload, Plus, Check } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";


const BASE_URL = "http://localhost:8000";

interface Category {
  id: number;
  name: string;
}

interface ProductImage {
  id: number;
  image_url: string;
  is_cover: number;
}

interface Product {
  id?: number;
  name: string;
  description: string;
  additional_description?: string;
  price: number;
  stock_quantity: number;
  user_category_id: number;
  product_condition: string;
  status: string;
  category?: Category;
  images?: ProductImage[];
}

interface ProductFormProps {
  product?: Product;
  onSubmitSuccess?: () => void;
}

interface ImageState {
  id: string;
  url: string;
  file?: File;
  isNew?: boolean;
  isCover?: boolean;
  originalId?: number;
}

export default function ProductForm({
  product,
  onSubmitSuccess,
}: ProductFormProps) {
  const [images, setImages] = useState<ImageState[]>([]);
  const [condition, setCondition] = useState("new");
  const [status, setStatus] = useState("published");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [additionalDescription, setAdditionalDescription] = useState("");
  const [stockQuantity, setStockQuantity] = useState("1");
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const conditions = [
    { id: "new", label: "Barang Baru" },
    { id: "like_new", label: "Seperti Baru" },
    { id: "lightly_used", label: "Sedikit Bekas" },
    { id: "used_good", label: "Bekas Baik" },
    { id: "used_frequent", label: "Bekas Sering" },
  ];

  // Initialize form with product data for edit mode
  useEffect(() => {
    if (product) {
      setTitle(product.name || "");
      setDescription(product.description || "");
      setAdditionalDescription(product.additional_description || "");
      setPrice(product.price?.toString() || "");
      setStockQuantity(product.stock_quantity?.toString() || "1");
      setCondition(product.product_condition || "new");
      setStatus(product.status || "published");
      setCategory(product.user_category_id?.toString() || "");

      if (product.images && product.images.length > 0) {
        setImages(
          product.images.map((img) => ({
            id: img.id.toString(),
            url: img.image_url.startsWith("http")
              ? img.image_url
              : `${BASE_URL}/storage/${img.image_url}`,
            isNew: false,
            isCover: img.is_cover === 1,
            originalId: img.id,
          }))
        );
      }
    }
  }, [product]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/category-products/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const categories = Array.isArray(response.data)
          ? response.data
          : response.data.data ?? [];

        setCategories(categories);

        if (!product && categories.length > 0 && !category) {
          setCategory(categories[0].id.toString());
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Gagal mengambil data kategori.");
      }
    };
    fetchCategories();
  }, [product, category]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];

    // Validate file type and size
    const validFiles = files.filter((file) => {
      const isValidType = ["image/jpeg", "image/png", "image/jpg"].includes(
        file.type
      );
      const isValidSize = file.size <= 2 * 1024 * 1024; // 2MB
      if (!isValidType) toast.error(`${file.name}: Format harus JPG atau PNG`);
      if (!isValidSize) toast.error(`${file.name}: Ukuran maksimal 2MB`);
      return isValidType && isValidSize;
    });

    if (validFiles.length + images.length > 10) {
      toast.error("Maksimal 10 foto!");
      return;
    }

    const newImages = validFiles.map((file) => ({
      id: Math.random().toString(36).substring(2),
      url: URL.createObjectURL(file),
      file,
      isNew: true,
      isCover: images.length === 0 && validFiles.length > 0, // First new image becomes cover
    }));

    setImages((prev) => {
      // If new image is set as cover, unset previous cover
      if (newImages.some((img) => img.isCover)) {
        return [
          ...prev.map((img) => ({ ...img, isCover: false })),
          ...newImages,
        ];
      }
      return [...prev, ...newImages];
    });

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeImage = (id: string) => {
    setImages((prev) => {
      const imageToRemove = prev.find((img) => img.id === id);
      const filteredImages = prev.filter((image) => image.id !== id);

      // If removed image was cover and there are other images, set first as cover
      if (imageToRemove?.isCover && filteredImages.length > 0) {
        filteredImages[0].isCover = true;
      }

      // Clean up object URL to prevent memory leaks
      if (imageToRemove?.isNew && imageToRemove.url.startsWith("blob:")) {
        URL.revokeObjectURL(imageToRemove.url);
      }

      return filteredImages;
    });
  };

  const toggleCover = (id: string) => {
    setImages((prev) =>
      prev.map((image) => ({
        ...image,
        isCover: image.id === id,
      }))
    );
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string[] } = {};

    if (!title.trim()) {
      newErrors.name = ["Judul produk harus diisi"];
    }

    if (!description.trim()) {
      newErrors.description = ["Deskripsi harus diisi"];
    }

    if (!price || parseFloat(price) <= 0) {
      newErrors.price = ["Harga harus lebih dari 0"];
    }

    if (!stockQuantity || parseInt(stockQuantity) <= 0) {
      newErrors.stock_quantity = ["Stok harus lebih dari 0"];
    }

    if (!category) {
      newErrors.user_category_id = ["Kategori harus dipilih"];
    }

    if (images.length === 0 && !product?.id) {
      newErrors.images = ["Minimal 1 foto harus diunggah"];
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const buildFormData = (): FormData => {
    const formData = new FormData();

    // Basic product data
    formData.append("name", title.trim());
    formData.append("description", description.trim());
    formData.append("additional_description", additionalDescription.trim());
    formData.append("price", price);
    formData.append("stock_quantity", stockQuantity);
    formData.append("user_category_id", category);
    formData.append("product_condition", condition);
    formData.append("status", status);

    // Handle images
    const newImages = images.filter((img) => img.isNew && img.file);
    const existingImages = images.filter((img) => !img.isNew && img.originalId);

    // Add new images
    newImages.forEach((img, index) => {
      formData.append(`images[${index}]`, img.file!);
      formData.append(`is_cover[${index}]`, img.isCover ? "1" : "0");
    });

    // Handle existing images
    if (existingImages.length > 0) {
      const existingImageIds = existingImages.map((img) => img.originalId!);
      formData.append("existing_image_ids", JSON.stringify(existingImageIds));

      // Set cover status for existing images
      existingImages.forEach((img, index) => {
        const adjustedIndex = newImages.length + index;
        formData.append(`is_cover[${adjustedIndex}]`, img.isCover ? "1" : "0");
      });
    } else {
      formData.append("existing_image_ids", "[]");
    }

    return formData;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Mohon periksa input form.");
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const formData = buildFormData();
      let response;

      if (product?.id) {
        // Edit mode - use full update endpoint
        const url = `${BASE_URL}/api/products/full/${product.id}`;
        response = await axios.post(url, formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
            "X-HTTP-Method-Override": "PUT",
          },
        });
        toast.success("Produk berhasil diperbarui!");
      } else {
        // Create mode - use store endpoint
        const url = `${BASE_URL}/api/products/full`;
        response = await axios.post(url, formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success("Produk berhasil disimpan!");
      }

      // Clean up object URLs
      images.forEach((img) => {
        if (img.isNew && img.url.startsWith("blob:")) {
          URL.revokeObjectURL(img.url);
        }
      });

      if (onSubmitSuccess) {
        onSubmitSuccess();
      }
    } catch (error: any) {
      console.error("Error submitting product:", error);

      if (error.response?.status === 422 && error.response?.data?.errors) {
        setErrors(error.response.data.errors);
        toast.error("Ada kesalahan pada input form.");
      } else if (error.response?.status === 401) {
        toast.error("Sesi login telah berakhir. Silakan login kembali.");
      } else if (error.response?.status === 404) {
        toast.error("Produk tidak ditemukan.");
      } else {
        const message = product?.id
          ? "Gagal memperbarui produk."
          : "Gagal menyimpan produk.";
        toast.error(message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      images.forEach((img) => {
        if (img.isNew && img.url.startsWith("blob:")) {
          URL.revokeObjectURL(img.url);
        }
      });
    };
  }, [images]);

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col md:flex-row gap-6 bg-gray-50 min-h-screen p-6 font-satoshi"
    >
      {/* Left Column - Image Upload */}
      <div className="w-full md:w-1/2 space-y-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Foto Produk</h2>

          <div className="border-2 border-dashed border-[#FF9C5A] rounded-lg p-8 bg-[#FFD35A]/10 flex flex-col items-center justify-center">
            <div className="h-24 w-24 bg-[#FFD35A]/30 rounded-full flex items-center justify-center mb-4">
              <Camera size={40} className="text-[#FF9C5A]" />
            </div>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isSubmitting}
              className="bg-[#FF9C5A] hover:bg-[#FF9C5A]/90 text-white font-bold py-2 px-6 rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Pilih Foto
            </button>

            <input
              type="file"
              ref={fileInputRef}
              multiple
              accept="image/jpeg,image/jpg,image/png"
              onChange={handleImageUpload}
              className="hidden"
              disabled={isSubmitting}
            />

            <p className="text-gray-600 mt-3 text-center">
              atau tarik foto ke sini
              <br />
              <span className="text-sm">
                (Maksimal 10 foto, format: JPG, PNG, maks 2MB)
              </span>
            </p>
          </div>

          {images.length > 0 && (
            <div className="mt-6">
              <h3 className="font-bold mb-3 text-gray-800">
                Foto yang Dipilih ({images.length}/10)
              </h3>
              <div className="grid grid-cols-3 gap-4">
                {images.map((image) => (
                  <div key={image.id} className="relative group">
                    <img
                      src={image.url}
                      alt="Pratinjau produk"
                      className={`w-full h-32 object-cover rounded-md ${
                        image.isCover ? "ring-2 ring-[#FF9C5A]" : ""
                      }`}
                      loading="lazy"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(image.id)}
                      disabled={isSubmitting}
                      className="absolute top-2 right-2 bg-black/70 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity disabled:cursor-not-allowed"
                    >
                      <X size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleCover(image.id)}
                      disabled={isSubmitting}
                      className={`absolute bottom-2 left-2 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity disabled:cursor-not-allowed ${
                        image.isCover
                          ? "bg-[#FF9C5A]"
                          : "bg-gray-800/70 hover:bg-[#FF9C5A]"
                      }`}
                    >
                      {image.isCover ? "✓ Sampul" : "Jadi Sampul"}
                    </button>
                  </div>
                ))}

                {images.length < 10 && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isSubmitting}
                    className="h-32 border-2 border-dashed border-[#FFD35A]/50 rounded-md flex flex-col items-center justify-center hover:bg-[#FFD35A]/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus size={24} className="text-[#FF9C5A] mb-1" />
                    <span className="text-sm text-gray-600 font-medium">
                      Tambah Foto
                    </span>
                  </button>
                )}
              </div>
            </div>
          )}

          {errors.images && (
            <p className="text-red-500 text-sm mt-3">{errors.images[0]}</p>
          )}

          <div className="flex items-center mt-6 text-gray-600">
            <div className="p-2 bg-[#FFD35A]/20 rounded-full mr-2">
              <Upload size={16} className="text-[#FF9C5A]" />
            </div>
            <p className="text-sm">Tip: Klik foto untuk atur sampul</p>
          </div>
        </div>
      </div>

      {/* Right Column - Form */}
      <div className="w-full md:w-1/2 space-y-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4 text-gray-800">
            Detail Produk
          </h2>

          {/* Category */}
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">
              Kategori <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <button
                type="button"
                disabled={isSubmitting}
                className="w-full flex items-center justify-between border border-gray-300 rounded-lg p-3 bg-white focus:outline-none focus:ring-2 focus:ring-[#FF9C5A] disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <span className="font-medium">
                  {categories.find((cat) => cat.id.toString() === category)
                    ?.name || "Pilih Kategori"}
                </span>
                <svg
                  className={`w-5 h-5 transition-transform ${
                    isDropdownOpen ? "transform rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {isDropdownOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg">
                  <div className="p-2 max-h-40 overflow-y-auto">
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        className="w-full text-left px-4 py-2 hover:bg-[#FFD35A]/10 rounded flex items-center"
                        onClick={() => {
                          setCategory(cat.id.toString());
                          setIsDropdownOpen(false);
                        }}
                      >
                        {category === cat.id.toString() && (
                          <Check size={16} className="mr-2 text-[#FF9C5A]" />
                        )}
                        <span>{cat.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {errors.user_category_id && (
              <p className="text-red-500 text-sm mt-1">
                {errors.user_category_id[0]}
              </p>
            )}
          </div>

          {/* Title */}
          <div className="mb-6">
            <label
              htmlFor="title"
              className="block text-gray-700 font-medium mb-2"
            >
              Judul Produk <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isSubmitting}
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#FF9C5A] disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Contoh: Sepatu Sneakers Nike Air Max 270"
              maxLength={255}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name[0]}</p>
            )}
          </div>

          <div className="border-t border-gray-200 my-6 pt-6">
            <h3 className="font-bold text-lg mb-4 text-gray-800">
              Rincian Produk
            </h3>

            {/* Condition */}
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-3">
                Kondisi <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {conditions.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    disabled={isSubmitting}
                    className={`py-2 px-4 rounded-full border font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                      condition === item.id
                        ? "bg-[#FF9C5A] text-white border-[#FF9C5A]"
                        : "border-gray-300 hover:bg-[#FFD35A]/10"
                    }`}
                    onClick={() => setCondition(item.id)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              {errors.product_condition && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.product_condition[0]}
                </p>
              )}
            </div>

            {/* Price */}
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-3">
                Harga <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                  Rp
                </span>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full border border-gray-300 rounded-lg p-3 pl-10 focus:outline-none focus:ring-2 focus:ring-[#FF9C5A] disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Masukkan harga produk"
                  min="0"
                  step="0.01"
                />
              </div>
              {errors.price && (
                <p className="text-red-500 text-sm mt-1">{errors.price[0]}</p>
              )}
            </div>

            {/* Stock Quantity */}
            <div className="mb-6">
              <label
                htmlFor="stock"
                className="block text-gray-700 font-medium mb-3"
              >
                Jumlah Stok <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="stock"
                value={stockQuantity}
                onChange={(e) => setStockQuantity(e.target.value)}
                disabled={isSubmitting}
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#FF9C5A] disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Masukkan jumlah stok"
                min="1"
              />
              {errors.stock_quantity && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.stock_quantity[0]}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="mb-6">
              <label
                htmlFor="description"
                className="block text-gray-700 font-medium mb-2"
              >
                Deskripsi <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                rows={6}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isSubmitting}
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#FF9C5A] disabled:opacity-50 disabled:cursor-not-allowed resize-vertical"
                placeholder="Jelaskan detail produk yang dijual..."
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.description[0]}
                </p>
              )}
            </div>

            {/* Additional Description */}
            <div className="mb-6">
              <label
                htmlFor="additionalDescription"
                className="block text-gray-700 font-medium mb-2"
              >
                Deskripsi Tambahan
              </label>
              <textarea
                id="additionalDescription"
                rows={4}
                value={additionalDescription}
                onChange={(e) => setAdditionalDescription(e.target.value)}
                disabled={isSubmitting}
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#FF9C5A] disabled:opacity-50 disabled:cursor-not-allowed resize-vertical"
                placeholder="Tambahkan detail tambahan (opsional)..."
              />
              {errors.additional_description && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.additional_description[0]}
                </p>
              )}
            </div>

            {/* Status */}
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-3">
                Status <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={isSubmitting}
                  className={`py-2 px-4 rounded-full border font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                    status === "draft"
                      ? "bg-[#FF9C5A] text-white border-[#FF9C5A]"
                      : "border-gray-300 hover:bg-[#FFD35A]/10"
                  }`}
                  onClick={() => setStatus("draft")}
                >
                  Draft
                </button>
                <button
                  type="button"
                  disabled={isSubmitting}
                  className={`py-2 px-4 rounded-full border font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                    status === "published"
                      ? "bg-[#FF9C5A] text-white border-[#FF9C5A]"
                      : "border-gray-300 hover:bg-[#FFD35A]/10"
                  }`}
                  onClick={() => setStatus("published")}
                >
                  Dipublikasikan
                </button>
              </div>
              {errors.status && (
                <p className="text-red-500 text-sm mt-1">{errors.status[0]}</p>
              )}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="bg-white p-6 rounded-lg shadow">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#FF9C5A] hover:bg-[#FF9C5A]/90 text-white font-bold py-3 px-6 rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting
              ? "Sedang menyimpan..."
              : product
              ? "Simpan Perubahan"
              : "Jual Sekarang"}
          </button>
          {images.length === 0 && !product?.id && (
            <p className="text-gray-500 text-sm mt-2 text-center">
              Tambahkan minimal 1 foto untuk melanjutkan
            </p>
          )}
        </div>
      </div>
    </form>
  );
}
