"use client";
import { useState } from "react";
import { toggleVoucherStatus } from "@/actions/voucher-actions";
import { Button } from "@/components/ui/button";
import { Power } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function ToggleVoucherButton({ voucherId, isActive }: { voucherId: string; isActive: boolean }) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleToggle = async () => {
    setIsLoading(true);
    const result = await toggleVoucherStatus(voucherId);
    if (result.success) { toast.success(isActive ? "Đã tắt" : "Đã bật"); router.refresh(); }
    else toast.error(result.error || "Thất bại");
    setIsLoading(false);
  };

  return (
    <Button variant="outline" size="sm" onClick={handleToggle} disabled={isLoading}
      className={isActive ? "text-emerald-600" : "text-gray-400"} title={isActive ? "Tắt" : "Bật"}>
      <Power className="h-4 w-4" />
    </Button>
  );
}
