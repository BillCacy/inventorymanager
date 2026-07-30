import Link from "next/link";
import { formatCents } from "@/lib/format";
import { Badge } from "@/components/ui/Badge";

type ProductCardData = {
  slug: string;
  name: string;
  priceCents: number;
  imageUrl: string;
  stock: number;
  category: { name: string };
};

export function ProductCard({ product }: { product: ProductCardData }) {
  const outOfStock = product.stock <= 0;
  const lowStock = !outOfStock && product.stock < 5;

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block overflow-hidden rounded-lg border border-gray-200 bg-white transition-shadow hover:shadow-md"
    >
      <div className="aspect-square overflow-hidden bg-gray-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.imageUrl}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
        />
      </div>
      <div className="p-4">
        <p className="text-xs uppercase tracking-wide text-gray-400">
          {product.category.name}
        </p>
        <h3 className="mt-1 font-medium text-gray-900">{product.name}</h3>
        <div className="mt-2 flex items-center justify-between">
          <span className="font-semibold text-gray-900">
            {formatCents(product.priceCents)}
          </span>
          {outOfStock && <Badge tone="red">Out of stock</Badge>}
          {lowStock && <Badge tone="yellow">Low stock</Badge>}
        </div>
      </div>
    </Link>
  );
}
