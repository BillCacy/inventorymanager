import Link from "next/link";
import { getAllProducts } from "@/lib/catalog";
import { formatCents } from "@/lib/format";
import { studioCreateProductUrl, studioEditUrl } from "@/lib/studio";
import { Button } from "@/components/ui/Button";
import { StockBadge } from "@/components/admin/StockBadge";

export default async function AdminProductsPage() {
  const products = await getAllProducts();

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Products</h2>
          <p className="text-sm text-gray-500">
            Product content is managed in Sanity Studio. Stock levels are managed here.
          </p>
        </div>
        <a href={studioCreateProductUrl()} target="_blank" rel="noopener noreferrer">
          <Button>New product in Studio</Button>
        </a>
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
              <tr key={product.sanityId}>
                <td className="px-4 py-2">
                  <div className="font-medium text-gray-900">{product.name}</div>
                  <div className="text-xs text-gray-500">{product.sku}</div>
                </td>
                <td className="px-4 py-2 text-gray-500">{product.category.name}</td>
                <td className="px-4 py-2">{formatCents(product.priceCents)}</td>
                <td className="px-4 py-2">
                  <StockBadge stock={product.stock} />
                </td>
                <td className="px-4 py-2 text-gray-500">
                  {product.isActive ? "Active" : "Hidden"}
                </td>
                <td className="space-x-3 whitespace-nowrap px-4 py-2 text-right">
                  <Link
                    href={`/admin/products/${encodeURIComponent(product.sku)}/stock`}
                    className="text-indigo-600 hover:underline"
                  >
                    Update stock
                  </Link>
                  <a
                    href={studioEditUrl(product.sanityId)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:underline"
                  >
                    Edit in Studio
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
