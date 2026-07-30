import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatCents } from "@/lib/format";
import { Badge } from "@/components/ui/Badge";
import { AddToCartButton } from "@/components/storefront/AddToCartButton";

type Params = Promise<{ slug: string }>;

export default async function ProductDetailPage({ params }: { params: Params }) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  });

  if (!product || !product.isActive) {
    notFound();
  }

  const outOfStock = product.stock <= 0;
  const lowStock = !outOfStock && product.stock < 5;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <nav className="mb-6 text-sm text-gray-500">
        <Link href="/products" className="hover:text-indigo-600">
          Shop
        </Link>{" "}
        /{" "}
        <Link
          href={`/products?category=${product.category.slug}`}
          className="hover:text-indigo-600"
        >
          {product.category.name}
        </Link>
      </nav>

      <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
        <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        </div>

        <div>
          <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
          <p className="mt-1 text-sm text-gray-500">SKU: {product.sku}</p>

          <div className="mt-4 flex items-center gap-3">
            <span className="text-2xl font-semibold text-gray-900">
              {formatCents(product.priceCents)}
            </span>
            {outOfStock && <Badge tone="red">Out of stock</Badge>}
            {lowStock && <Badge tone="yellow">Only {product.stock} left</Badge>}
          </div>

          <p className="mt-6 whitespace-pre-line text-gray-700">
            {product.description}
          </p>

          <div className="mt-8">
            <AddToCartButton product={product} />
          </div>
        </div>
      </div>
    </div>
  );
}
