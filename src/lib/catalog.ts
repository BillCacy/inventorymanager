import type { PortableTextBlock } from "next-sanity";
import type { SanityImageSource } from "@sanity/image-url";
import { prisma } from "@/lib/prisma";
import { client } from "@/sanity/client";
import { urlFor } from "@/sanity/image";
import {
  ALL_PRODUCTS_QUERY,
  CATEGORIES_QUERY,
  NEWEST_PRODUCTS_QUERY,
  PRODUCTS_BY_SKU_QUERY,
  PRODUCT_BY_SLUG_QUERY,
  STOREFRONT_PRODUCTS_QUERY,
} from "@/sanity/queries";

// Catalog content comes from Sanity; stock comes from Postgres. The two are
// joined on SKU.

type SanityProduct = {
  _id: string;
  name: string;
  slug: string;
  sku: string;
  price: number | null;
  status: "active" | "hidden" | null;
  description: PortableTextBlock[] | null;
  category: { name: string; slug: string } | null;
  image: (SanityImageSource & { alt?: string }) | null;
};

export type Category = { name: string; slug: string };

export type CatalogProduct = {
  /** Postgres inventory id; null when no inventory record exists yet. */
  id: string | null;
  sanityId: string;
  sku: string;
  slug: string;
  name: string;
  description: PortableTextBlock[];
  priceCents: number;
  imageUrl: string;
  stock: number;
  isActive: boolean;
  category: Category;
};

const cached = { next: { revalidate: 30 } };

const UNCATEGORIZED: Category = { name: "Uncategorized", slug: "" };

function imageUrlFor(image: SanityProduct["image"]): string {
  if (!image) return "";
  return urlFor(image).width(800).height(800).fit("crop").auto("format").url();
}

async function withStock(products: SanityProduct[]): Promise<CatalogProduct[]> {
  const inventory = await prisma.product.findMany({
    where: { sku: { in: products.map((p) => p.sku) } },
    select: { id: true, sku: true, stock: true },
  });
  const bySku = new Map(inventory.map((row) => [row.sku, row]));

  return products.map((product) => {
    const row = bySku.get(product.sku);
    return {
      id: row?.id ?? null,
      sanityId: product._id,
      sku: product.sku,
      slug: product.slug,
      name: product.name,
      description: product.description ?? [],
      priceCents: Math.round((product.price ?? 0) * 100),
      imageUrl: imageUrlFor(product.image),
      stock: row?.stock ?? 0,
      isActive: product.status === "active",
      category: product.category ?? UNCATEGORIZED,
    };
  });
}

export async function getCategories(): Promise<Category[]> {
  return client.fetch<Category[]>(CATEGORIES_QUERY, {}, cached);
}

export async function getStorefrontProducts(filters: {
  category?: string;
  q?: string;
}): Promise<CatalogProduct[]> {
  const q = filters.q?.trim();
  const products = await client.fetch<SanityProduct[]>(
    STOREFRONT_PRODUCTS_QUERY,
    { category: filters.category || null, q: q ? `${q}*` : null },
    cached
  );
  return withStock(products);
}

export async function getNewestProducts(): Promise<CatalogProduct[]> {
  const products = await client.fetch<SanityProduct[]>(NEWEST_PRODUCTS_QUERY, {}, cached);
  return withStock(products);
}

export async function getProductBySlug(slug: string): Promise<CatalogProduct | null> {
  const product = await client.fetch<SanityProduct | null>(
    PRODUCT_BY_SLUG_QUERY,
    { slug },
    cached
  );
  if (!product) return null;
  const [withInventory] = await withStock([product]);
  return withInventory;
}

/** Every product in Sanity (including hidden ones), for the admin area. */
export async function getAllProducts(): Promise<CatalogProduct[]> {
  const products = await client.fetch<SanityProduct[]>(ALL_PRODUCTS_QUERY, {}, cached);
  return withStock(products);
}

/**
 * Uncached, straight from the Sanity API (not the CDN). Used where prices and
 * visibility must be current, such as checkout.
 */
export async function getProductsBySku(skus: string[]): Promise<Map<string, CatalogProduct>> {
  const products = await client
    .withConfig({ useCdn: false })
    .fetch<SanityProduct[]>(PRODUCTS_BY_SKU_QUERY, { skus }, { cache: "no-store" });
  const merged = await withStock(products);
  return new Map(merged.map((product) => [product.sku, product]));
}
