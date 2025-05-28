"use client";
import React, { useState, useEffect } from "react";
import {
  Search,
  Eye,
  Edit,
  Trash2,
  Package,
  ShoppingCart,
  User,
  Calendar,
  CreditCard,
} from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios"; // Import axios for API calls
import { toast } from "react-toastify";

// TypeScript interfaces for order structure
interface ProductCoverImage {
  image_url: string;
  is_cover: number;
}

interface Product {
  id: number;
  user_id: number;
  name: string;
  description: string;
  price: string;
  cover_image: ProductCoverImage;
}

interface OrderDetail {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  unit_price: string;
  total_price: string;
  product: Product;
}

interface UserType {
  id: number;
  name: string;
  email: string;
  profile_picture: string;
}

interface Order {
  id: number;
  user_id: number;
  order_number: string;
  total_price: string;
  status: string;
  created_at: string;
  updated_at: string;
  user: UserType;
  details: OrderDetail[];
}

const OrderManagementTable = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState("sales"); // 'sales' or 'purchases'
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Set currentUserId from localStorage after component mounts
    if (typeof window !== "undefined") {
      const userId = localStorage.getItem("id_user"); // Corrected key to match Auth.ts
      setCurrentUserId(userId ? Number(userId) : null);
    }
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        if (typeof window !== "undefined") {
          const token = localStorage.getItem("token");
          if (!token) {
            toast.error("Silakan login untuk melihat pesanan.", {
              position: "top-right",
              autoClose: 3000,
            });
            router.push("/login");
            return;
          }

          // Use axios instance from Auth.ts (which has interceptors)
          const response = await axios.get("http://localhost:8000/api/orders", {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });

          setOrders(response.data);
        }
      } catch (error: any) {
        console.error("Error fetching orders:", error);
        toast.error("Gagal memuat pesanan. Silakan coba lagi.", {
          position: "top-right",
          autoClose: 3000,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [router]);

  const getFilteredOrders = () => {
    if (currentUserId === null) return []; // Return empty array if userId is not set

    let filtered = orders.filter((order) => {
      if (activeTab === "sales") {
        return order.details.some(
          (detail) => detail.product.user_id === currentUserId
        );
      } else {
        return (
          order.user_id === currentUserId &&
          order.details.some(
            (detail) => detail.product.user_id !== currentUserId
          )
        );
      }
    });

    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.user.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    return filtered;
  };

  type OrderStatus = "pending" | "paid" | "completed";
  const getStatusBadge = (status: string) => {
    const statusConfig: Record<
      OrderStatus,
      { bg: string; text: string; label: string }
    > = {
      pending: {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        label: "Pending",
      },
      paid: { bg: "bg-blue-100", text: "text-blue-800", label: "Paid" },
      completed: {
        bg: "bg-green-100",
        text: "text-green-800",
        label: "Completed",
      },
    };

    const config = statusConfig[status as OrderStatus] || statusConfig.pending;

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
      >
        {config.label}
      </span>
    );
  };

  const formatPrice = (price: string | number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(typeof price === "string" ? parseFloat(price) : price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleStatusUpdate = async (orderId: number, newStatus: string) => {
    try {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Silakan login untuk memperbarui pesanan.", {
            position: "top-right",
            autoClose: 3000,
          });
          router.push("/login");
          return;
        }

        // Use axios instance from Auth.ts
        const response = await axios.put(
          `http://localhost:8000/api/orders/${orderId}`,
          { status: newStatus },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        setOrders((prev) =>
          prev.map((order) =>
            order.id === orderId ? { ...order, status: newStatus } : order
          )
        );

        toast.success(`Status pesanan diperbarui ke ${newStatus}`, {
          position: "top-right",
          autoClose: 2000,
        });
      }
    } catch (error: any) {
      console.error("Error updating order status:", error);
      toast.error("Gagal memperbarui status pesanan.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const filteredOrders = getFilteredOrders();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (currentUserId === null) {
    return (
      <div className="text-center py-12">
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          User tidak ditemukan
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Silakan login untuk melihat pesanan.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">Kelola Pesanan</h2>
      </div>

      {/* Tabs */}
      <div className="px-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-6">
          <button
            onClick={() => setActiveTab("sales")}
            className={`py-3 px-1 border-b-2 font-medium text-sm ${
              activeTab === "sales"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center space-x-2">
              <Package className="w-4 h-4" />
              <span>Penjualan</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab("purchases")}
            className={`py-3 px-1 border-b-2 font-medium text-sm ${
              activeTab === "purchases"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center space-x-2">
              <ShoppingCart className="w-4 h-4" />
              <span>Pembelian</span>
            </div>
          </button>
        </nav>
      </div>

      {/* Filters */}
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 sm:space-x-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Cari nomor pesanan atau nama..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Semua Status</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div className="text-sm text-gray-600">
            Total: {filteredOrders.length} pesanan
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pesanan
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {activeTab === "sales" ? "Pembeli" : "Produk"}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Produk
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tanggal
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredOrders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {order.order_number}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-8 w-8">
                      <img
                        className="h-8 w-8 rounded-full object-cover"
                        src={`http://localhost:8000/storage/${order.user.profile_picture}`}
                        alt={order.user.name}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "/default-avatar.png"; // Match default avatar from Auth.ts
                        }}
                      />
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">
                        {order.user.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.user.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-3">
                    {order.details.map((detail) => (
                      <div
                        key={detail.id}
                        className="flex items-center space-x-2"
                      >
                        <div className="flex-shrink-0 h-10 w-10">
                          <img
                            className="h-10 w-10 rounded-md object-cover"
                            src={`http://localhost:8000/storage/${detail.product.cover_image?.image_url}`}
                            alt={detail.product.name}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "/default-avatar.png"; // Use consistent fallback
                            }}
                          />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {detail.product.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            Qty: {detail.quantity}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {formatPrice(order.total_price)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {activeTab === "sales" ? (
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusUpdate(order.id, e.target.value)
                      }
                      className="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                      <option value="completed">Completed</option>
                    </select>
                  ) : (
                    getStatusBadge(order.status)
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(order.created_at)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => console.log("View order:", order.id)}
                      className="text-blue-600 hover:text-blue-900 p-1"
                      title="Lihat Detail"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    {activeTab === "sales" && (
                      <button
                        onClick={() => console.log("Edit order:", order.id)}
                        className="text-green-600 hover:text-green-900 p-1"
                        title="Edit Pesanan"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredOrders.length === 0 && (
        <div className="text-center py-12">
          <Package className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            Tidak ada pesanan
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {activeTab === "sales"
              ? "Belum ada yang membeli produk Anda."
              : "Anda belum melakukan pembelian."}
          </p>
        </div>
      )}
    </div>
  );
};

export default OrderManagementTable;