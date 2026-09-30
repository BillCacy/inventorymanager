import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatCents } from "@/lib/format";
import { Badge } from "@/components/ui/Badge";

type Params = Promise<{ id: string }>;

const statusTone = {
  PENDING: "yellow",
  PAID: "blue",
  SHIPPED: "green",
  CANCELLED: "red",
} as const;

export default async function OrderConfirmationPage({ params }: { params: Params }) {
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });

  if (!order) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Thank you, {order.customerName}!</h1>
        <p className="mt-2 text-gray-600">
          Your order has been placed. A confirmation would normally be sent to{" "}
          {order.customerEmail}.
        </p>
        <p className="mt-4 text-sm text-gray-400">Order ID: {order.id}</p>
        <div className="mt-2">
          <Badge tone={statusTone[order.status]}>{order.status}</Badge>
        </div>
      </div>

      <ul className="mt-8 divide-y divide-gray-200 border-y border-gray-200">
        {order.items.map((item) => (
          <li key={item.id} className="flex justify-between py-3 text-sm">
            <span>
              {item.productName} &times; {item.quantity}
            </span>
            <span>{formatCents(item.unitPriceCents * item.quantity)}</span>
          </li>
        ))}
      </ul>
      <div className="mt-4 flex justify-between font-semibold text-gray-900">
        <span>Total</span>
        <span>{formatCents(order.totalCents)}</span>
      </div>

      <div className="mt-8 text-center">
        <Link href="/products" className="text-sm text-indigo-600 hover:underline">
          Continue shopping
        </Link>
      </div>
    </div>
  );
}
