"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function DeleteProductButton({
  productId,
  productName,
}: {
  productId: string;
  productName: string;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleDelete() {
    if (!window.confirm(`Delete "${productName}"? This cannot be undone.`)) return;

    setPending(true);
    const res = await fetch(`/api/products/${productId}`, { method: "DELETE" });
    setPending(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      window.alert(data.error ?? "Failed to delete product.");
      return;
    }

    router.refresh();
  }

  return (
    <button
      onClick={handleDelete}
      disabled={pending}
      className="text-red-600 hover:underline disabled:text-gray-400"
    >
      {pending ? "Deleting..." : "Delete"}
    </button>
  );
}
