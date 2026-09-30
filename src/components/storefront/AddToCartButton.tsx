"use client";

import { useState } from "react";
import { useCart } from "@/components/storefront/CartProvider";
import { Button } from "@/components/ui/Button";

type Product = {
  id: string | null;
  slug: string;
  name: string;
  priceCents: number;
  imageUrl: string;
  stock: number;
};

export function AddToCartButton({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const productId = product.id;

  if (!productId || product.stock <= 0) {
    return (
      <Button disabled className="w-full">
        Out of stock
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <select
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
        className="rounded-md border border-gray-300 px-2 py-2 text-sm"
      >
        {Array.from({ length: Math.min(product.stock, 10) }, (_, i) => i + 1).map(
          (n) => (
            <option key={n} value={n}>
              {n}
            </option>
          )
        )}
      </select>
      <Button
        onClick={() => {
          addItem(
            {
              productId,
              name: product.name,
              slug: product.slug,
              priceCents: product.priceCents,
              imageUrl: product.imageUrl,
              stock: product.stock,
            },
            quantity
          );
          setAdded(true);
        }}
        className="flex-1"
      >
        {added ? "Added!" : "Add to cart"}
      </Button>
    </div>
  );
}
