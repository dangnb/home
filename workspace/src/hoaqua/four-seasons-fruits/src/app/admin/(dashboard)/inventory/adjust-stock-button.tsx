"use client";

// Button to manually adjust stock (nhập kho / điều chỉnh)

import { useState } from "react";
import { adjustStock } from "@/actions/stock-actions";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface AdjustStockButtonProps {
  productId: string;
  productName: string;
  currentStock: number;
  unit: string;
}

export function AdjustStockButton({ productId, productName, currentStock, unit }: AdjustStockButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [quantity, setQuantity] = useState("");
  const [reason, setReason] = useState("");
  const [mode, setMode] = useState<"in" | "adjust">("in");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    const qty = parseInt(quantity);
    if (isNaN(qty) || qty < 0) {
      toast.error("Số lượng không hợp lệ");
      return;
    }

    setIsLoading(true);
    const result = await adjustStock(productId, qty, mode, reason);

    if (result.success) {
      toast.success(`Đã cập nhật tồn kho: ${result.newStock} ${unit}`);
      setIsOpen(false);
      setQuantity("");
      setReason("");
      router.refresh();
    } else {
      toast.error(result.error || "Thất bại");
    }
    setIsLoading(false);
  };

  if (!isOpen) {
    return (
      <Button variant="outline" size="sm" onClick={() => setIsOpen(true)}>
        <Plus className="h-3.5 w-3.5" />
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setIsOpen(false)}>
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl" onClick={(e) => e.stopPropagation()}>
        <h3 className="font-semibold text-lg mb-1">{productName}</h3>
        <p className="text-sm text-gray-500 mb-4">Tồn kho hiện tại: <strong>{currentStock} {unit}</strong></p>

        {/* Mode toggle */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setMode("in")}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
              mode === "in" ? "bg-emerald-600 text-white" : "bg-gray-100 text-gray-600"
            }`}
          >
            Nhập thêm
          </button>
          <button
            onClick={() => setMode("adjust")}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
              mode === "adjust" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"
            }`}
          >
            Đặt số lượng
          </button>
        </div>

        <div className="space-y-3">
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder={mode === "in" ? `Số lượng nhập thêm (${unit})` : `Tồn kho mới (${unit})`}
            min="0"
            className="w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <input
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Lý do (tùy chọn)"
            className="w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex gap-2 mt-4">
          <Button onClick={handleSubmit} disabled={isLoading || !quantity} className="flex-1 bg-emerald-600 hover:bg-emerald-700">
            {isLoading ? "Đang lưu..." : "Xác nhận"}
          </Button>
          <Button variant="outline" onClick={() => setIsOpen(false)} className="flex-1">
            Hủy
          </Button>
        </div>
      </div>
    </div>
  );
}
