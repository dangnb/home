"use client";

// Order status action buttons - handles transitions with stock management

import { useState } from "react";
import { updateOrderStatus } from "@/actions/stock-actions";
import { Button } from "@/components/ui/button";
import { Check, Truck, PackageCheck, RotateCcw, X } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// Define allowed transitions
const transitions: Record<string, { label: string; next: string; icon: React.ElementType; color: string }[]> = {
  pending: [
    { label: "Duyệt", next: "confirmed", icon: Check, color: "text-blue-600 hover:bg-blue-50" },
    { label: "Hủy", next: "cancelled", icon: X, color: "text-red-500 hover:bg-red-50" },
  ],
  confirmed: [
    { label: "Giao hàng", next: "shipping", icon: Truck, color: "text-purple-600 hover:bg-purple-50" },
    { label: "Hủy", next: "cancelled", icon: X, color: "text-red-500 hover:bg-red-50" },
  ],
  shipping: [
    { label: "Hoàn thành", next: "completed", icon: PackageCheck, color: "text-emerald-600 hover:bg-emerald-50" },
    { label: "Trả hàng", next: "returned", icon: RotateCcw, color: "text-orange-600 hover:bg-orange-50" },
  ],
  completed: [
    { label: "Trả hàng", next: "returned", icon: RotateCcw, color: "text-orange-600 hover:bg-orange-50" },
  ],
  returned: [],
  cancelled: [],
};

export function OrderStatusButtons({ orderId, currentStatus }: { orderId: string; currentStatus: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const actions = transitions[currentStatus] || [];

  if (actions.length === 0) {
    return <span className="text-xs text-gray-400">—</span>;
  }

  const handleAction = async (nextStatus: string, label: string) => {
    const confirmMsg = nextStatus === "cancelled"
      ? "Hủy đơn hàng? Tồn kho sẽ được hoàn lại."
      : nextStatus === "returned"
        ? "Xác nhận trả hàng? Tồn kho sẽ được cộng lại."
        : nextStatus === "confirmed"
          ? "Duyệt đơn hàng? Tồn kho sẽ bị trừ."
          : `Chuyển sang "${label}"?`;

    if (!confirm(confirmMsg)) return;

    setIsLoading(true);
    const result = await updateOrderStatus(orderId, nextStatus);

    if (result.success) {
      toast.success(`Đã chuyển sang "${label}"`);
      router.refresh();
    } else {
      toast.error(result.error || "Thao tác thất bại");
    }
    setIsLoading(false);
  };

  return (
    <div className="flex gap-1 justify-end">
      {actions.map((action) => (
        <Button
          key={action.next}
          variant="ghost"
          size="sm"
          disabled={isLoading}
          onClick={() => handleAction(action.next, action.label)}
          className={action.color}
          title={action.label}
        >
          <action.icon className="h-4 w-4" />
        </Button>
      ))}
    </div>
  );
}
