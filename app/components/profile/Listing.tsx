"use client";
import Image from "next/image";
import { Search } from "lucide-react";

interface ProductImage {
  id: number;
  product_id: number;
  image_url: string;
  is_cover: number;
  created_at: string;
}

interface Listing {
  id: number;
  name: string;
  price: number;
  images: ProductImage[];
}

interface ListingsProps {
  listings: Listing[];
  categories: string[];
  brands: string[];
  activeTab: "for_sale" | "sold";
  sort: string;
  category: string;
  brand: string;
  search: string;
  setActiveTab: (tab: "for_sale" | "sold") => void;
  setSort: (sort: string) => void;
  setCategory: (category: string) => void;
  setBrand: (brand: string) => void;
  setSearch: (search: string) => void;
}

// Ganti dengan BASE_URL sesuai config kamu
const BASE_URL = "http://localhost:8000";

const getCoverImage = (images: ProductImage[]) => {
  if (!images || images.length === 0) return "/default-item.png";

  const cover = images.find((img) => img.is_cover === 1);
  if (cover) return `${BASE_URL}/storage/${cover.image_url}`;

  // fallback gambar pertama kalau tidak ada cover
  return `${BASE_URL}/storage/${images[0].image_url}`;
};

export const Listings: React.FC<ListingsProps> = ({
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
}) => {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-4">{listings.length} Items</h3>

      {/* Tabs dan Filter */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab("for_sale")}
            className={`px-4 py-2 rounded-md ${
              activeTab === "for_sale"
                ? "bg-primary text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            For Sale
          </button>
          <button
            onClick={() => setActiveTab("sold")}
            className={`px-4 py-2 rounded-md ${
              activeTab === "sold"
                ? "bg-primary text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Sold
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="border rounded-md px-3 py-2 text-sm"
          >
            <option value="newest">Sort by: Newest</option>
            <option value="oldest">Sort by: Oldest</option>
            <option value="price_low">Sort by: Price Low to High</option>
            <option value="price_high">Sort by: Price High to Low</option>
          </select>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border rounded-md px-3 py-2 text-sm"
          >
            <option value="">Category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            className="border rounded-md px-3 py-2 text-sm"
          >
            <option value="">Brand</option>
            {brands.map((br) => (
              <option key={br} value={br}>
                {br}
              </option>
            ))}
          </select>

          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari apa saja"
              className="border rounded-md pl-10 pr-3 py-2 text-sm w-full sm:w-64"
            />
            <Search className="w-5 h-5 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
          </div>
        </div>
      </div>

      {/* Item Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {listings.length === 0 && <p>Tidak ada produk</p>}
        {listings.map((item) => (
          <div key={item.id} className="border rounded-md p-2">
            <div className="relative w-full pt-[100%] rounded-md overflow-hidden mb-2">
              <Image
                src={getCoverImage(item.images) || "/default-item.png"}
                alt={item.name}
                fill
                sizes="150px"
                style={{ objectFit: "cover" }}
                className="rounded-md"
                unoptimized
                loading="lazy"
              />
            </div>
            <h4 className="text-sm font-semibold truncate">{item.name}</h4>
            <p className="text-sm text-primary font-semibold">
              Rp {item.price.toLocaleString("id-ID")}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
