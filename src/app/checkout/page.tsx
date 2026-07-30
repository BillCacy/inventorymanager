"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/components/storefront/CartProvider";
import { formatCents } from "@/lib/format";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";

export default function CheckoutPage() {
  const { items, totalCents, clear } = useCart();
  const router = useRouter();
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
        <h1 className="text-2xl font-bold text-gray-900">Your cart is empty</h1>
        <Link
          href="/products"
          className="mt-6 inline-block rounded-md bg-indigo-600 px-6 py-3 text-sm font-medium text-white hover:bg-indigo-500"
        >
          Shop products
        </Link>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          customerEmail,
          items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Something went wrong placing your order.");
        setSubmitting(false);
        return;
      }

      clear();
      router.push(`/orders/${data.id}`);
    } catch {
      setError("Something went wrong placing your order.");
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>

      <div className="mt-6 grid grid-cols-1 gap-10 md:grid-cols-2">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="customerName">Full name</Label>
            <Input
              id="customerName"
              required
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="customerEmail">Email</Label>
            <Input
              id="customerEmail"
              type="email"
              required
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? "Placing order..." : `Place order — ${formatCents(totalCents)}`}
          </Button>
          <p className="text-xs text-gray-400">
            This is a demo store. No payment is collected and no real order is shipped.
          </p>
        </form>

        <div>
          <h2 className="font-semibold text-gray-900">Order summary</h2>
          <ul className="mt-3 divide-y divide-gray-200 border-y border-gray-200">
            {items.map((item) => (
              <li key={item.productId} className="flex justify-between py-2 text-sm">
                <span>
                  {item.name} &times; {item.quantity}
                </span>
                <span>{formatCents(item.priceCents * item.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex justify-between font-semibold text-gray-900">
            <span>Total</span>
            <span>{formatCents(totalCents)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
