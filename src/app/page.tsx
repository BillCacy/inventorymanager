import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProductGrid } from "@/components/storefront/ProductGrid";

export default async function HomePage() {
  const featured = await prisma.product.findMany({
    where: { isActive: true },
    include: { category: true },
    orderBy: { createdAt: "desc" },
    take: 8,
  });

  return (
    <div>
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-20 text-center sm:px-6">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Smart gear for a connected life
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-gray-600">
            NimbusTech carries audio, wearables, smart home, and computing
            gear picked for everyday use. Browse the catalog and build your
            cart.
          </p>
          <Link
            href="/products"
            className="mt-8 inline-flex items-center justify-center rounded-md bg-indigo-600 px-6 py-3 text-sm font-medium text-white hover:bg-indigo-500"
          >
            Shop all products
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Newest arrivals
          </h2>
          <Link href="/products" className="text-sm text-indigo-600 hover:underline">
            View all
          </Link>
        </div>
        <ProductGrid products={featured} />
      </section>
    </div>
  );
}
