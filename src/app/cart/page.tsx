"use client";

import Link from "next/link";
import { useCart } from "@/components/storefront/CartProvider";
import { formatCents } from "@/lib/format";
import { Button } from "@/components/ui/Button";

export default function CartPage() {
  const { items, setQuantity, removeItem, totalCents } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
        <h1 className="text-2xl font-bold text-gray-900">Your cart is empty</h1>
        <p className="mt-2 text-gray-600">Browse the catalog to add items.</p>
        <Link
          href="/products"
          className="mt-6 inline-block rounded-md bg-indigo-600 px-6 py-3 text-sm font-medium text-white hover:bg-indigo-500"
        >
          Shop products
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold text-gray-900">Your cart</h1>

      <ul className="mt-6 divide-y divide-gray-200 border-y border-gray-200">
        {items.map((item) => (
          <li key={item.productId} className="flex items-center gap-4 py-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.imageUrl}
              alt={item.name}
              className="h-16 w-16 rounded-md object-cover"
            />
            <div className="flex-1">
              <Link
                href={`/products/${item.slug}`}
                className="font-medium text-gray-900 hover:text-indigo-600"
              >
                {item.name}
              </Link>
              <p className="text-sm text-gray-500">{formatCents(item.priceCents)} each</p>
            </div>
            <select
              value={item.quantity}
              onChange={(e) => setQuantity(item.productId, Number(e.target.value))}
              className="rounded-md border border-gray-300 px-2 py-1 text-sm"
            >
              {Array.from({ length: Math.min(item.stock, 10) }, (_, i) => i + 1).map(
                (n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                )
              )}
            </select>
            <span className="w-20 text-right font-medium text-gray-900">
              {formatCents(item.priceCents * item.quantity)}
            </span>
            <button
              onClick={() => removeItem(item.productId)}
              className="text-sm text-red-600 hover:underline"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex items-center justify-between">
        <span className="text-lg font-semibold text-gray-900">
          Total: {formatCents(totalCents)}
        </span>
        <Link href="/checkout">
          <Button>Checkout</Button>
        </Link>
      </div>
    </div>
  );
}
