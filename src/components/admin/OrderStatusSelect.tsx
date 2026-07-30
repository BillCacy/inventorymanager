"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const STATUSES = ["PENDING", "PAID", "SHIPPED", "CANCELLED"] as const;

export function OrderStatusSelect({
  orderId,
  status,
}: {
  orderId: string;
  status: (typeof STATUSES)[number];
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setPending(true);
    const res = await fetch(`/api/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: e.target.value }),
    });
    setPending(false);

    if (!res.ok) {
      window.alert("Failed to update order status.");
      return;
    }
    router.refresh();
  }

  return (
    <select
      defaultValue={status}
      disabled={pending}
      onChange={handleChange}
      className="rounded-md border border-gray-300 px-2 py-1 text-sm"
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}
