import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatCents } from "@/lib/format";
import { Button } from "@/components/ui/Button";
import { StockBadge } from "@/components/admin/StockBadge";
import { DeleteProductButton } from "@/components/admin/DeleteProductButton";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Products</h2>
        <Link href="/admin/products/new">
          <Button>New product</Button>
        </Link>
      </div>

      <div className="mt-4 overflow-x-auto rounded-lg border border-gray-200 bg-white">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
            <tr>
              <th className="px-4 py-2">Product</th>
              <th className="px-4 py-2">Category</th>
              <th className="px-4 py-2">Price</th>
              <th className="px-4 py-2">Stock</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map((product) => (
              <tr key={product.id}>
                <td className="px-4 py-2 font-medium text-gray-900">{product.name}</td>
                <td className="px-4 py-2 text-gray-500">{product.category.name}</td>
                <td className="px-4 py-2">{formatCents(product.priceCents)}</td>
                <td className="px-4 py-2">
                  <StockBadge stock={product.stock} />
                </td>
                <td className="px-4 py-2 text-gray-500">
                  {product.isActive ? "Active" : "Hidden"}
                </td>
                <td className="space-x-3 px-4 py-2 text-right">
                  <Link
                    href={`/admin/products/${product.id}/edit`}
                    className="text-indigo-600 hover:underline"
                  >
                    Edit
                  </Link>
                  <DeleteProductButton productId={product.id} productName={product.name} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
