"use client";

import Link from "next/link";
import { useCart } from "@/components/storefront/CartProvider";

export function CartButton() {
  const { totalItems } = useCart();
  return (
    <Link href="/cart" className="relative pr-2 hover:text-indigo-600">
      Cart
      {totalItems > 0 && (
        <span className="absolute -right-1 -top-2 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-indigo-600 px-1 text-[10px] font-semibold text-white">
          {totalItems}
        </span>
      )}
    </Link>
  );
}
