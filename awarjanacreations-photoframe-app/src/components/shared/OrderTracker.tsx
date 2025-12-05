// src/components/shared/OrderTracker.tsx
import React from "react";

type Props = {
  status: string;
};

const statusMap: Record<string, { label: string; color: string }> = {
  pending: { label: "Pending", color: "bg-yellow-300 text-black" },
  confirmed: { label: "Confirmed", color: "bg-green-500 text-white" },
  in_progress: { label: "In progress", color: "bg-blue-400 text-white" },
  completed: { label: "Completed", color: "bg-green-700 text-white" },
  cancelled: { label: "Cancelled", color: "bg-red-500 text-white" },
  ready: { label: "Ready for pickup", color: "bg-indigo-500 text-white" },
};

const OrderTracker: React.FC<Props> = ({ status }) => {
  const s = statusMap[status] ?? { label: status ?? "Unknown", color: "bg-gray-300 text-black" };

  return (
    <div className="my-4">
      <div className="flex items-center gap-3">
        <span className="font-semibold">Order Status:</span>
        <span className={`px-2 py-1 rounded ${s.color}`}>{s.label}</span>
      </div>
    </div>
  );
};

export default OrderTracker;
