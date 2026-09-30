import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { getProductsBySku } from "@/lib/catalog";
import { stockSchema } from "@/lib/validations";

type Params = Promise<{ sku: string }>;

export async function GET(_request: Request, { params }: { params: Params }) {
  const { sku } = await params;

  const product = (await getProductsBySku([sku])).get(sku);

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  return NextResponse.json(product);
}

// Content edits happen in Sanity Studio; this only updates the stock level.
export async function PATCH(request: Request, { params }: { params: Params }) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { sku } = await params;
  const body = await request.json();
  const parsed = stockSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid stock value" },
      { status: 400 }
    );
  }

  if (!(await getProductsBySku([sku])).has(sku)) {
    return NextResponse.json({ error: "No product in Sanity has that SKU." }, { status: 404 });
  }

  const inventory = await prisma.product.upsert({
    where: { sku },
    create: { sku, stock: parsed.data.stock },
    update: { stock: parsed.data.stock },
  });

  return NextResponse.json(inventory);
}
