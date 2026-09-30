import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { createOrderSchema } from "@/lib/validations";
import { getProductsBySku } from "@/lib/catalog";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const orders = await prisma.order.findMany({
    include: { items: { include: { product: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(orders);
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = createOrderSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid order data" },
      { status: 400 }
    );
  }

  const { customerName, customerEmail, items } = parsed.data;

  try {
    // Prices, names and visibility come from Sanity; fetch them before the
    // transaction so the database transaction stays short.
    const inventory = await prisma.product.findMany({
      where: { id: { in: items.map((item) => item.productId) } },
      select: { id: true, sku: true },
    });
    const catalog = await getProductsBySku(inventory.map((row) => row.sku));

    const order = await prisma.$transaction(async (tx) => {
      let totalCents = 0;
      const orderItemsData: {
        productId: string;
        productName: string;
        quantity: number;
        unitPriceCents: number;
      }[] = [];

      for (const item of items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
        });

        const content = product ? catalog.get(product.sku) : undefined;

        if (!product || !content || !content.isActive) {
          throw new Error("One of the items in your cart is no longer available.");
        }
        if (product.stock < item.quantity) {
          throw new Error(`Not enough stock for ${content.name}.`);
        }

        totalCents += content.priceCents * item.quantity;
        orderItemsData.push({
          productId: product.id,
          productName: content.name,
          quantity: item.quantity,
          unitPriceCents: content.priceCents,
        });

        await tx.product.update({
          where: { id: product.id },
          data: { stock: { decrement: item.quantity } },
        });
      }

      return tx.order.create({
        data: {
          customerName,
          customerEmail,
          totalCents,
          items: { create: orderItemsData },
        },
      });
    });

    return NextResponse.json({ id: order.id }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to place order.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
