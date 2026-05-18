"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Save } from "lucide-react";

interface Service {
  id: string;
  name: string;
  price: string;
  unit: string;
  description: string;
  order: number;
  active: boolean;
}

export default function AdminServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [newService, setNewService] = useState({ name: "", price: "", unit: "/Ghế", description: "" });

  useEffect(() => {
    fetchServices();
  }, []);

  async function fetchServices() {
    try {
      const res = await fetch("/api/services");
      const data = await res.json();
      setServices(data.services || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function addService(e: React.FormEvent) {
    e.preventDefault();
    const token = localStorage.getItem("admin_token");
    const res = await fetch("/api/services", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(newService),
    });
    if (res.ok) {
      setNewService({ name: "", price: "", unit: "/Ghế", description: "" });
      fetchServices();
    }
  }

  async function deleteService(id: string) {
    if (!confirm("Xóa dịch vụ này?")) return;
    const token = localStorage.getItem("admin_token");
    await fetch(`/api/services/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchServices();
  }

  if (loading) return <div className="text-center py-12 text-gray-500">Đang tải...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Quản lý dịch vụ</h1>

      {/* Add form */}
      <form onSubmit={addService} className="bg-white rounded-xl p-6 shadow-sm mb-8">
        <h2 className="font-semibold text-gray-900 mb-4">Thêm dịch vụ mới</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            value={newService.name}
            onChange={(e) => setNewService({ ...newService, name: e.target.value })}
            className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Tên dịch vụ *"
            required
          />
          <input
            type="text"
            value={newService.price}
            onChange={(e) => setNewService({ ...newService, price: e.target.value })}
            className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Giá (VD: 250.000đ) *"
            required
          />
          <input
            type="text"
            value={newService.unit}
            onChange={(e) => setNewService({ ...newService, unit: e.target.value })}
            className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Đơn vị (VD: /Ghế) *"
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
              <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Tên dịch vụ</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Giá</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Đơn vị</th>
              <th className="text-right px-6 py-4 text-sm font-medium text-gray-500">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {services.map((service) => (
              <tr key={service.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{service.name}</td>
                <td className="px-6 py-4 text-orange-600 font-semibold">{service.price}</td>
                <td className="px-6 py-4 text-gray-600">{service.unit}</td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => deleteService(service.id)}
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {services.length === 0 && (
          <div className="text-center py-12 text-gray-500">Chưa có dịch vụ nào</div>
        )}
      </div>
    </div>
  );
}
