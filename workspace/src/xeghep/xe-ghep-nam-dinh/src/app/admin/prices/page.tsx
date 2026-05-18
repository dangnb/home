"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";

interface PriceEntry {
  id: string;
  route: string;
  price: string;
  unit: string;
  order: number;
}

export default function AdminPrices() {
  const [prices, setPrices] = useState<PriceEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPrice, setNewPrice] = useState({ route: "", price: "", unit: "/Người" });

  useEffect(() => {
    fetchPrices();
  }, []);

  async function fetchPrices() {
    try {
      const res = await fetch("/api/prices");
      const data = await res.json();
      setPrices(data.prices || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function addPrice(e: React.FormEvent) {
    e.preventDefault();
    const token = localStorage.getItem("admin_token");
    const res = await fetch("/api/prices", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(newPrice),
    });
    if (res.ok) {
      setNewPrice({ route: "", price: "", unit: "/Người" });
      fetchPrices();
    }
  }

  async function deletePrice(id: string) {
    if (!confirm("Xóa mục giá này?")) return;
    const token = localStorage.getItem("admin_token");
    await fetch(`/api/prices/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchPrices();
  }

  if (loading) return <div className="text-center py-12 text-gray-500">Đang tải...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Quản lý bảng giá</h1>

      {/* Add form */}
      <form onSubmit={addPrice} className="bg-white rounded-xl p-6 shadow-sm mb-8">
        <h2 className="font-semibold text-gray-900 mb-4">Thêm mục giá mới</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            value={newPrice.route}
            onChange={(e) => setNewPrice({ ...newPrice, route: e.target.value })}
            className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Tuyến (VD: Hà Nội - Hải Hậu) *"
            required
          />
          <input
            type="text"
            value={newPrice.price}
            onChange={(e) => setNewPrice({ ...newPrice, price: e.target.value })}
            className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Giá (VD: 250.000đ) *"
            required
          />
          <input
            type="text"
            value={newPrice.unit}
            onChange={(e) => setNewPrice({ ...newPrice, unit: e.target.value })}
            className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Đơn vị *"
            required
          />
          <button
            type="submit"
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
          >
            <Plus size={16} />
            Thêm
          </button>
        </div>
      </form>

      {/* List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Tuyến đường</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Giá</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Đơn vị</th>
              <th className="text-right px-6 py-4 text-sm font-medium text-gray-500">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {prices.map((price) => (
              <tr key={price.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{price.route}</td>
                <td className="px-6 py-4 text-orange-600 font-semibold">{price.price}</td>
                <td className="px-6 py-4 text-gray-600">{price.unit}</td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => deletePrice(price.id)}
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {prices.length === 0 && (
          <div className="text-center py-12 text-gray-500">Chưa có mục giá nào</div>
        )}
      </div>
    </div>
  );
}
