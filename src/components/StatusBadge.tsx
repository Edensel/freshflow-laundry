import { statusLabels } from "@/lib/business";
import type { OrderStatus } from "@/lib/orders";

const styles: Record<OrderStatus, string> = {
  NEW: "bg-[#eef6ff] text-[#1d65b9]",
  PICKED_UP: "bg-[#eef3ff] text-[#2f5eaa]",
  IN_PROGRESS: "bg-[#fff6df] text-[#7c5a12]",
  READY: "bg-[#eef8e7] text-[#3c7a2f]",
  OUT_FOR_DELIVERY: "bg-[#fff0e8] text-[#af4b26]",
  COMPLETED: "bg-[#eef0f4] text-[#656b72]",
};

export function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${styles[status]}`}
    >
      {statusLabels[status]}
    </span>
  );
}
