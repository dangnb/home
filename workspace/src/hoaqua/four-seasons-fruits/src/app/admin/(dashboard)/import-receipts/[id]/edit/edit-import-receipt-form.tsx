"use client";

// Edit Import Receipt Form - same as create but pre-filled

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Plus, Trash2, Save, ArrowLeft, Package } from "lucide-react";

interface Product {
  id: string;
  name: string;
  unit: string;
  price: number;
}

interface Supplier {
  id: string;
  name: string;
}

interface ReceiptItem {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  product: { id: string; name: string; unit: string; price: number };
}

interface Receipt {
  id: string;
  code: string;
  supplier: string;
  note: string | null;
  items: ReceiptItem[];
}

interface LineItem {
  id: string;
  productId: string;
  unit: string;
  quantity: number;
  unitPrice: number;
}

export function EditImportReceiptForm({
  receipt,
  products,
  suppliers,
}: {
  receipt: Receipt;
  products: Product[];
  suppliers: Supplier[];
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [supplier, setSupplier] = useState(receipt.supplier);
  const [note, setNote] = useState(receipt.note || "");
  const [items, setItems] = useState<LineItem[]>(
    receipt.items.map((item) => ({
      id: item.id,
      productId: item.productId,
      unit: item.product.unit,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
    }))
  );

  const addItem = () => {
    setItems([...items, { id: Date.now().toString(), productId: "", unit: "", quantity: 1, unitPrice: 0 }]);
  };

  const updateItem = (id: string, field: keyof LineItem, value: string | number) => {
    setItems(items.map((item) => {
      if (item.id !== id) return item;
      if (field === "productId") {
        const product = products.find((p) => p.id === value);
        return { ...item, productId: value as string, unit: product?.unit || "", unitPrice: product?.price || 0 };
      }
      return { ...item, [field]: value };
    }));
  };

  const removeItem = (id: string) => setItems(items.filter((i) => i.id !== id));

  const totalAmount = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);

  const handleSubmit = async () => {
    if (!supplier.trim()) { toast.error("Chọn nhà cung cấp"); return; }
    if (items.length === 0) { toast.error("Thêm ít nhất 1 sản phẩm"); return; }
    if (items.some((i) => !i.productId)) { toast.error("Chọn sản phẩm cho tất cả dòng"); return; }

    setIsSubmitting(true);

    const res = await fetch("/api/admin/update-import-receipt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: receipt.id,
        supplier: supplier.trim(),
        note: note.trim() || null,
        items: items.map((i) => ({ productId: i.productId, quantity: i.quantity, unitPrice: i.unitPrice })),
      }),
    });

    if (res.ok) {
      toast.success("Đã cập nhật phiếu nhập");
      router.push("/admin/import-receipts");
      router.refresh();
    } else {
      const data = await res.json();
      toast.error(data.error || "Cập nhật thất bại");
    }
    setIsSubmitting(false);
  };

  return (
    <div className="max-w-4xl space-y-6">
      {/* Supplier Info */}
      <div className="bg-white p-6 rounded-xl border space-y-4">
        <h2 className="font-semibold flex items-center gap-2">
          <Package className="h-4 w-4 text-emerald-600" />
          Thông tin phiếu nhập
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Nhà cung cấp *</Label>
            <select
              value={supplier}
              onChange={(e) => setSupplier(e.target.value)}
              className="w-full h-11 border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">Chọn nhà cung cấp</option>
              {suppliers.map((s) => (
                <option key={s.id} value={s.name}>{s.name}</option>
              ))}
              {/* Keep current value if not in list */}
              {!suppliers.find((s) => s.name === supplier) && supplier && (
                <option value={supplier}>{supplier}</option>
              )}
            </select>
          </div>
          <div className="space-y-2">
            <Label>Ghi chú</Label>
            <Input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Ghi chú" className="h-11" />
          </div>
        </div>
      </div>

      {/* Line Items */}
      <div className="bg-white p-6 rounded-xl border space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">📦 Danh sách sản phẩm nhập</h2>
          <Button type="button" onClick={addItem} variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-1" /> Thêm dòng
          </Button>
        </div>

        {items.length > 0 && (
          <div className="space-y-3">
            <div className="grid grid-cols-12 gap-2 text-xs font-semibold text-gray-500 uppercase px-2">
              <div className="col-span-5">Sản phẩm</div>
              <div className="col-span-2">Số lượng</div>
              <div className="col-span-2">Đơn giá nhập</div>
              <div className="col-span-2 text-right">Thành tiền</div>
              <div className="col-span-1"></div>
            </div>

            {items.map((item) => (
              <div key={item.id} className="grid grid-cols-12 gap-2 items-center bg-gray-50 p-3 rounded-xl">
                <div className="col-span-5">
                  <select
                    value={item.productId}
                    onChange={(e) => updateItem(item.id, "productId", e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="">Chọn sản phẩm</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>{p.name} ({p.unit})</option>
                    ))}
                  </select>
                </div>
                <div className="col-span-2">
                  <div className="flex items-center gap-1">
                    <Input type="number" min="1" value={item.quantity} onChange={(e) => updateItem(item.id, "quantity", parseInt(e.target.value) || 1)} className="h-9 text-center" />
                    <span className="text-xs text-gray-400 shrink-0">{item.unit}</span>
                  </div>
                </div>
                <div className="col-span-2">
                  <Input type="number" min="0" value={item.unitPrice} onChange={(e) => updateItem(item.id, "unitPrice", parseFloat(e.target.value) || 0)} className="h-9" />
                </div>
                <div className="col-span-2 text-right">
                  <span className="text-sm font-semibold">{formatPrice(item.quantity * item.unitPrice)}</span>
                </div>
                <div className="col-span-1 text-right">
                  <button onClick={() => removeItem(item.id)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}

            <div className="flex justify-between items-center pt-4 border-t">
              <span className="font-medium text-gray-700">{items.length} sản phẩm</span>
              <span className="text-xl font-bold text-emerald-600">{formatPrice(totalAmount)}</span>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 sticky bottom-4 bg-white p-4 rounded-xl border shadow-lg">
        <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-emerald-600 hover:bg-emerald-700 px-6">
          <Save className="h-4 w-4 mr-2" />
          {isSubmitting ? "Đang lưu..." : "Cập nhật phiếu"}
        </Button>
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Quay lại
        </Button>
      </div>
    </div>
  );
}
