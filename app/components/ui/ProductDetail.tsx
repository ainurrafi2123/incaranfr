"use client";
import { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Shield,
  Star,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios"; // Import axios from Auth.ts
import { toast } from "react-toastify";

const ProductDetail = ({ productId = 7 }) => {
  const [product, setProduct] = useState<{
    id: number;
    user_id: number;
    name: string;
    description: string;
    additional_description: string;
    price: string;
    stock_quantity: number;
    user_category_id: number;
    product_condition: string;
    status: string;
    created_at: string;
    updated_at: string;
    category: {
      id: number;
      user_id: number;
      name: string;
      description: string;
      created_at: string;
      updated_at: string;
    };
    images: {
      id: number;
      product_id: number;
      image_url: string;
      is_cover: number;
      created_at: string;
    }[];
    user: {
      id: number;
      name: string;
      email: string;
      profile_picture: string;
    };
  } | null>(null);
  const [category, setCategory] = useState<{
    id: number;
    user_id: number;
    name: string;
    description: string;
    created_at: string;
    updated_at: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [showDescription, setShowDescription] = useState(false);
  const [quantity, setQuantity] = useState(1); // New state for quantity
  const [isOrdering, setIsOrdering] = useState(false); // New state for order processing
  const router = useRouter();

  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:8000/api/products/public/${productId}`
        );
        const data = await response.json();

        if (data.message === "Detail produk publik berhasil diambil") {
          setProduct(data.data);
          setError(null);
        } else {
          throw new Error(data.message || "Gagal mengambil detail produk");
        }
      } catch (err) {
        setError("Gagal mengambil detail produk");
      } finally {
        setLoading(false);
      }
    };

    const fetchCategoryDetail = async () => {
      try {
        if (product?.category?.id) {
          const response = await fetch(
            `http://localhost:8000/api/category-products/${product.category.id}`
          );
          const data = await response.json();
          if (data.data) {
            setCategory(data.data);
          }
        }
      } catch (err) {
        console.error("Gagal mengambil detail kategori:", err);
      }
    };

    fetchProductDetail();
    fetchCategoryDetail();
  }, [productId, product?.category?.id]);

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(parseFloat(price));
  };

  const formatDate = (dateString: string) => {
    const now = new Date();
    const updatedDate = new Date(dateString);
    const diffTime = Math.abs(now.getTime() - updatedDate.getTime());
    const diffMinutes = Math.floor(diffTime / (1000 * 60));

    if (diffMinutes < 60) return `${diffMinutes} menit lalu`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)} jam lalu`;
    return `${Math.floor(diffMinutes / 1440)} hari lalu`;
  };

  const nextImage = () => {
    if (product?.images?.length ?? 0 > 1) {
      setCurrentImageIndex((prev) =>
        prev === (product?.images?.length ?? 0) - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if ((product?.images?.length ?? 0) > 1) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? (product?.images?.length ?? 0) - 1 : prev - 1
      );
    }
  };

  const toggleDescription = () => {
    setShowDescription(!showDescription);
  };

  // New function to handle "Beli Sekarang"
  const handleBuyNow = async () => {
    if (!product) return;

    if (quantity < 1 || quantity > product.stock_quantity) {
      toast.error(
        `barang terjual habis `,
        {
          position: "top-right",
          autoClose: 3000,
        }
      );
      return;
    }

    try {
      setIsOrdering(true);
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Silakan login untuk membuat pesanan.", {
            position: "top-right",
            autoClose: 3000,
          });
          router.push("/login");
          return;
        }

        const response = await axios.post(
          "http://localhost:8000/api/orders",
          {
            items: [
              {
                product_id: product.id,
                quantity: quantity,
              },
            ],
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        toast.success("Pesanan berhasil dibuat!", {
          position: "top-right",
          autoClose: 2000,
        });

        // Optionally redirect to an order confirmation page
        router.push(`/mypage/profile`);
      }
    } catch (error: any) {
      console.error("Error creating order:", error);
      toast.error(
        error.response?.data?.message || "Gagal membuat pesanan.",
        {
          position: "top-right",
          autoClose: 3000,
        }
      );
    } finally {
      setIsOrdering(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-black mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat detail produk...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500">{error || "Produk tidak ditemukan"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Bagian Kiri - Gambar */}
          <div className="space-y-6">
            {/* Gambar Utama */}
            <div className="relative aspect-[4/3] bg-gray-100 rounded-xl overflow-hidden">
              {product.images && product.images.length > 0 ? (
                <>
                  <img
                    src={`http://localhost:8000/storage/${product.images[currentImageIndex].image_url}`}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://via.placeholder.com/600x450?text=Tidak+Ada+Gambar";
                    }}
                  />

                  {/* Tombol Navigasi */}
                  {product.images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-md transition-all"
                        aria-label="Gambar sebelumnya"
                      >
                        <ChevronLeft className="h-6 w-6" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-md transition-all"
                        aria-label="Gambar berikutnya"
                      >
                        <ChevronRight className="h-6 w-6" />
                      </button>
                    </>
                  )}

                  {/* Tombol Suka */}
                  <button
                    onClick={() => setIsLiked(!isLiked)}
                    className="absolute bottom-4 right-4 bg-white rounded-full p-3 shadow-md hover:shadow-lg transition-all"
                    aria-label={isLiked ? "Batal suka produk" : "Suka produk"}
                  >
                    <Heart
                      className={`h-6 w-6 ${
                        isLiked ? "fill-red-500 text-red-500" : "text-gray-600"
                      }`}
                    />
                    <span className="ml-2 text-base font-medium">0</span>
                  </button>
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-gray-400 text-5xl">📷</div>
                </div>
              )}
            </div>

            {/* Gambar Miniatur */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border-2 transition-all ${
                      currentImageIndex === index
                        ? "border-blue-500"
                        : "border-gray-200"
                    }`}
                    aria-label={`Pilih gambar ${index + 1}`}
                  >
                    <img
                      src={`http://localhost:8000/storage/${image.image_url}`}
                      alt=""
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://via.placeholder.com/96x96?text=Tidak+Ada+Gambar";
                      }}
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Tombol Lihat Lebih Banyak dan Deskripsi */}
            <div className="space-y-3">
              <button
                onClick={toggleDescription}
                className="flex items-center justify-center w-full py-3 text-gray-600 hover:text-gray-800 transition-colors border border-gray-200 rounded-lg"
                aria-label={showDescription ? "Sembunyikan deskripsi" : "Lihat deskripsi"}
              >
                {showDescription ? (
                  <ChevronUp className="h-5 w-5" />
                ) : (
                  <ChevronDown className="h-5 w-5" />
                )}
                <span className="ml-2">
                  {showDescription ? "Sembunyikan Deskripsi" : "Lihat Deskripsi"}
                </span>
              </button>
              {showDescription && (
                <div className="text-sm text-gray-700 bg-gray-50 p-5 rounded-lg">
                  <h3 className="font-semibold mb-3">Deskripsi Produk</h3>
                  <p>{product.description}</p>
                  {product.additional_description &&
                    product.additional_description !== product.description && (
                      <>
                        <h3 className="font-semibold mt-5 mb-3">Informasi Tambahan</h3>
                        <p>{product.additional_description}</p>
                      </>
                    )}
                </div>
              )}
            </div>
          </div>

          {/* Bagian Kanan - Informasi Produk */}
          <div className="space-y-6">
            {/* Judul dan Harga */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-6">
                {product.name}
              </h1>
              <div className="text-4xl font-bold text-gray-900 mb-4">
                {formatPrice(product.price)}
              </div>
              <div className="flex items-center gap-3 text-base text-gray-600">
                <Shield className="h-5 w-5" />
                <span>+Rp15.000 Biaya Perlindungan Pembeli</span>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="space-y-2">
              <label className="text-gray-600 text-base">Kuantitas</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                  className="px-3 py-2 bg-gray-200 rounded-lg text-gray-800"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    if (!isNaN(value) && value >= 1 && value <= product.stock_quantity) {
                      setQuantity(value);
                    }
                  }}
                  className="w-20 text-center border border-gray-300 rounded-lg py-2"
                  min="1"
                  max={product.stock_quantity}
                />
                <button
                  onClick={() => setQuantity((prev) => Math.min(product.stock_quantity, prev + 1))}
                  className="px-3 py-2 bg-gray-200 rounded-lg text-gray-800"
                  disabled={quantity >= product.stock_quantity}
                >
                  +
                </button>
              </div>
              <p className="text-sm text-gray-500">
                Stok tersedia: {product.stock_quantity}
              </p>
            </div>

            {/* Tombol Aksi */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <button className="py-4 px-6 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-lg transition-colors text-lg">
                  Ajukan Penawaran
                </button>
                <button className="py-4 px-6 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-lg transition-colors text-lg">
                  Tambah ke Keranjang
                </button>
              </div>
              <button
                onClick={handleBuyNow}
                className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors text-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
                disabled={isOrdering || product.stock_quantity === 0}
              >
                {isOrdering ? "Memproses..." : "Beli Sekarang"}
              </button>
              <button className="w-full py-4 px-6 bg-black hover:bg-gray-800 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 text-lg">
                <span>PayPal</span>
                <span className="text-base">Checkout</span>
              </button>
            </div>

            {/* Ketentuan */}
            <div className="text-sm text-gray-500 text-center">
              * Dengan melanjutkan checkout, Anda setuju dengan{" "}
              <a href="#" className="underline">
                Kebijakan Privasi
              </a>{" "}
              dan{" "}
              <a href="#" className="underline">
                Ketentuan Layanan
              </a>
            </div>

            {/* Detail Produk */}
            <div className="space-y-5 pt-8 border-t border-gray-200">
              <div className="grid grid-cols-2 gap-6 text-base">
                <div>
                  <span className="text-gray-600">Pengiriman</span>
                  <div className="font-medium">Rp75.000</div>
                </div>
                <div>
                  <span className="text-gray-600">Kondisi</span>
                  <div className="font-medium capitalize">
                    {product.product_condition === "new" ? "Baru" : "Bekas"}
                  </div>
                </div>
              </div>

              <div className="space-y-4 text-base">
                <div className="flex justify-between">
                  <span className="text-gray-600">Merek</span>
                  <span className="font-medium">MCPR</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Kategori</span>
                  <div className="text-right">
                    <div className="text-blue-600 hover:underline cursor-pointer">
                      Pakaian Wanita
                    </div>
                    <div className="text-blue-600 hover:underline cursor-pointer">
                      Atasan & Blus
                    </div>
                    <div className="text-blue-600 hover:underline cursor-pointer">
                      Kaos
                    </div>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Ukuran</span>
                  <span className="font-medium">M</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Diperbarui</span>
                  <span className="font-medium">
                    {formatDate(product.updated_at)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Informasi Penjual */}
        <div className="mt-14 pt-10 border-t border-gray-200">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center">
              <img
                src={`http://localhost:8000/storage/${product.user.profile_picture}`}
                alt={product.user.name}
                className="w-full h-full object-cover rounded-full"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://via.placeholder.com/80x80?text=Tidak+Ada+Gambar";
                }}
              />
            </div>
            <div>
              <h3 className="font-bold text-xl">{product.user.name}</h3>
              <div className="flex items-center gap-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 fill-yellow-400 text-yellow-400"
                  />
                ))}
                <span className="text-base text-gray-600 ml-2">230 ulasan</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;