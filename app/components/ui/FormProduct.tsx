"use client";
import { useState, useEffect, useRef } from "react";
import { Camera, X, Upload, Plus, Check } from "lucide-react";
import axios from "axios";

export default function ProductForm() {
  const [images, setImages] = useState<
    { id: string; url: string; file: File }[]
  >([]);
  const [condition, setCondition] = useState("new");
  const [priceType, setPriceType] = useState("sale");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    []
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const conditions = [
    { id: "new", label: "Barang baru" },
    { id: "like_new", label: "Seperti baru" },
    { id: "lightly_used", label: "Tidak terlalu sering digunakan" },
    { id: "used_good", label: "Digunakan dengan baik" },
    { id: "used_frequent", label: "Sering digunakan" },
  ];

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/category-products/"
        );
        console.log("response.data:", response.data);

        // cek apakah response.data ada dan bertipe array
        const categories = Array.isArray(response.data)
          ? response.data
          : response.data.data ?? [];

        setCategories(categories);
        if (categories.length > 0) {
          setCategory(categories[0].id);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length + images.length > 10) {
      alert("Maksimal 10 foto");
      return;
    }

    const newImages = files.map((file) => ({
      id: Math.random().toString(36).substring(2),
      url: URL.createObjectURL(file),
      file,
    }));

    setImages((prev) => [...prev, ...newImages]);
  };

  const removeImage = (id: string) => {
    setImages((prev) => prev.filter((image) => image.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const formData = new FormData();
    formData.append("name", title);
    formData.append("description", description);
    formData.append("additional_description", description); // Optional, adjust as needed
    formData.append("price", priceType === "sale" ? price : "0");
    formData.append("product_condition", condition);
    formData.append("status", "published"); // Adjust based on your needs (draft/published)
    formData.append("user_category_id", category);
    formData.append("stock_quantity", "1"); // Adjust as needed

    images.forEach((image, index) => {
      formData.append("images[]", image.file);
      formData.append("is_cover[]", index === 0 ? "1" : "0"); // First image as cover
    });

    try {
      const response = await axios.post(
        "http://localhost:8000/api/products/full",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // ← Ini yang benar
            "Content-Type": "multipart/form-data",
          },
        }
      );
      -alert("Produk berhasil disimpan!");
      // Optionally reset form
      setImages([]);
      setTitle("");
      setDescription("");
      setPrice("");
      setCondition("new");
      setPriceType("sale");
      setCategory(categories[0]?.id || "");
    } catch (error: any) {
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors);
      } else {
        console.error("Error submitting form:", error);
        alert("Terjadi kesalahan saat menyimpan produk.");
      }
    }
  };

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
              atau pindahkan foto ke sini
              <br />
              <span className="text-sm">(Hingga 10 foto)</span>
            </p>
          </div>

          {images.length > 0 && (
            <div className="mt-6">
              <h3 className="font-bold mb-3 text-gray-800">
                Foto yang dipilih
              </h3>
              <div className="grid grid-cols-3 gap-4">
                {images.map((image, index) => (
                  <div key={image.id} className="relative group">
                    <img
                      src={image.url}
                      alt={`Product preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-md"
                    />
                    <button
                      type="button"
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
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="h-32 border-2 border-dashed border-[#FFD35A]/50 rounded-md flex flex-col items-center justify-center hover:bg-[#FFD35A]/5 transition-colors"
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

          <div className="flex items-center mt-6 text-gray-600">
            <div className="p-2 bg-[#FFD35A]/20 rounded-full mr-2">
              <Upload size={16} className="text-[#FF9C5A]" />
            </div>
            <p className="text-sm font-inter">
              Tip: Atur ulang foto untuk mengganti sampul
            </p>
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
              Kategori
            </label>
            <div className="relative">
              <button
                type="button"
                className="w-full flex items-center justify-between border border-gray-300 rounded-lg p-3 bg-white focus:outline-none focus:ring-2 focus:ring-[#FF9C5A]"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <div className="flex items-center">
                  <span className="font-medium">
                    {categories.find((cat) => cat.id === category)?.name ||
                      "Pilih Kategori"}
                  </span>
                </div>
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
                  ></path>
                </svg>
              </button>

              {isDropdownOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg">
                  <div className="p-2">
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        className="w-full text-left px-4 py-2 hover:bg-[#FFD35A]/10 rounded flex items-center"
                        onClick={() => {
                          setCategory(cat.id);
                          setIsDropdownOpen(false);
                        }}
                      >
                        {category === cat.id && (
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
              Judul produk
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#FF9C5A] font-inter"
              placeholder="Contoh: Sepatu Sneakers Nike Air Max 270"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name[0]}</p>
            )}
          </div>

          <div className="border-t border-gray-200 my-6 pt-6">
            <h3 className="font-bold text-lg mb-4 text-gray-800">
              Rincian produk
            </h3>

            {/* Condition */}
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-3">
                Kondisi
              </label>
              <div className="flex flex-wrap gap-2">
                {conditions.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={`py-2 px-4 rounded-full border font-medium ${
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
                Harga
              </label>
              <div className="flex gap-3 mb-4">
                <button
                  type="button"
                  className={`flex-1 py-3 px-4 rounded-full border font-bold ${
                    priceType === "sale"
                      ? "bg-[#FF9C5A] text-white border-[#FF9C5A]"
                      : "border-gray-300 hover:bg-[#FFD35A]/10"
                  }`}
                  onClick={() => setPriceType("sale")}
                >
                  Dijual
                </button>
                <button
                  type="button"
                  className={`flex-1 py-3 px-4 rounded-full border font-bold ${
                    priceType === "free"
                      ? "bg-[#FF9C5A] text-white border-[#FF9C5A]"
                      : "border-gray-300 hover:bg-[#FFD35A]/10"
                  }`}
                  onClick={() => setPriceType("free")}
                >
                  Gratis
                </button>
              </div>

              {priceType === "sale" && (
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                    Rp
                  </span>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-3 pl-10 focus:outline-none focus:ring-2 focus:ring-[#FF9C5A] font-inter"
                    placeholder="Harga barangmu"
                  />
                  {errors.price && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.price[0]}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Description */}
            <div className="mb-6">
              <label
                htmlFor="description"
                className="block text-gray-700 font-medium mb-2"
              >
                Deskripsi
              </label>
              <textarea
                id="description"
                rows={6}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#FF9C5A] font-inter"
                placeholder="Berikan deskripsi mendetail tentang produk yang dijual..."
              ></textarea>
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.description[0]}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="bg-white p-6 rounded-lg shadow">
          <button
            type="submit"
            className="w-full bg-[#FF9C5A] hover:bg-[#FF9C5A]/90 text-white font-bold py-3 px-6 rounded-md transition-all"
          >
            Jual sekarang
          </button>
        </div>
      </div>
    </form>
  );
}
