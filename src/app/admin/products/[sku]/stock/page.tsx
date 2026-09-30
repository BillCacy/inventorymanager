import { notFound } from "next/navigation";
import { getProductsBySku } from "@/lib/catalog";
import { studioEditUrl } from "@/lib/studio";
import { StockForm } from "@/components/admin/StockForm";

type Params = Promise<{ sku: string }>;

export default async function ProductStockPage({ params }: { params: Params }) {
  const { sku } = await params;
  const decodedSku = decodeURIComponent(sku);

  const product = (await getProductsBySku([decodedSku])).get(decodedSku);

  if (!product) {
    notFound();
  }

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900">Stock for {product.name}</h2>
      <p className="mt-1 text-sm text-gray-500">
        SKU {product.sku}. Name, description, price and images are edited in{" "}
        <a
          href={studioEditUrl(product.sanityId)}
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-600 hover:underline"
        >
          Sanity Studio
        </a>
        .
      </p>
      <div className="mt-6">
        <StockForm sku={product.sku} initialStock={product.stock} />
      </div>
    </div>
  );
}
