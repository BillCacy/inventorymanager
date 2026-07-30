import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatCents } from "@/lib/format";
import { StatCard } from "@/components/admin/StatCard";
import { StockBadge } from "@/components/admin/StockBadge";

export default async function AdminDashboardPage() {
  const [productCount, orderCount, pendingOrders, lowStockProducts, revenue] =
    await Promise.all([
      prisma.product.count(),
      prisma.order.count(),
      prisma.order.count({ where: { status: "PENDING" } }),
      prisma.product.findMany({
        where: { stock: { lt: 5 } },
        include: { category: true },
        orderBy: { stock: "asc" },
        take: 10,
      }),
      prisma.order.aggregate({
        _sum: { totalCents: true },
        where: { status: { in: ["PAID", "SHIPPED"] } },
      }),
    ]);

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Products" value={productCount} />
        <StatCard label="Orders" value={orderCount} />
        <StatCard label="Pending orders" value={pendingOrders} />
        <StatCard
          label="Revenue (paid + shipped)"
          value={formatCents(revenue._sum.totalCents ?? 0)}
        />
      </div>

      <div className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Low stock alerts</h2>
          <Link href="/admin/products" className="text-sm text-indigo-600 hover:underline">
            Manage products
          </Link>
        </div>

        {lowStockProducts.length === 0 ? (
          <p className="mt-4 text-sm text-gray-500">All products are well stocked.</p>
        ) : (
          <div className="mt-4 overflow-x-auto rounded-lg border border-gray-200 bg-white">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-4 py-2">Product</th>
                  <th className="px-4 py-2">Category</th>
                  <th className="px-4 py-2">Stock</th>
                  <th className="px-4 py-2" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {lowStockProducts.map((product) => (
                  <tr key={product.id}>
                    <td className="px-4 py-2 font-medium text-gray-900">{product.name}</td>
                    <td className="px-4 py-2 text-gray-500">{product.category.name}</td>
                    <td className="px-4 py-2">
                      <StockBadge stock={product.stock} />
                    </td>
                    <td className="px-4 py-2 text-right">
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="text-indigo-600 hover:underline"
                      >
                        Restock
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
