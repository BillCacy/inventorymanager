import { NextResponse } from "next/server";
import { getStorefrontProducts } from "@/lib/catalog";

// Products are created and edited in Sanity Studio; this endpoint is read-only.
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") ?? undefined;
  const q = searchParams.get("q") ?? undefined;

  const products = await getStorefrontProducts({ category, q });

  return NextResponse.json(products);
}
