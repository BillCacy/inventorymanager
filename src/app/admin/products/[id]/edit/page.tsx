import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/ProductForm";

type Params = Promise<{ id: string }>;

export default async function EditProductPage({ params }: { params: Params }) {
  const { id } = await params;

  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900">Edit {product.name}</h2>
      <div className="mt-4">
        <ProductForm
          categories={categories}
          productId={product.id}
          initialValues={{
            name: product.name,
            slug: product.slug,
            description: product.description,
            priceCents: product.priceCents,
            sku: product.sku,
            imageUrl: product.imageUrl,
            stock: product.stock,
            isActive: product.isActive,
            categoryId: product.categoryId,
          }}
        />
      </div>
    </div>
  );
}
