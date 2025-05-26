'use client';

import Navbar from '../../components/Navbar';
import { useParams } from 'next/navigation';
import ProductDetail from '../../components/ui/ProductDetail';

export default function ProductDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  // Validasi ID produk
  const productId = id && !isNaN(Number(id)) ? Number(id) : null;

  if (!productId) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="mt-16 flex items-center justify-center py-10">
          <p className="text-red-500 text-lg font-medium">Invalid product ID</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="mt-16">
        <ProductDetail productId={productId} />
      </div>
    </div>
  );
}
