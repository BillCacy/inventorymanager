import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/ProductForm";

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900">New product</h2>
      <div className="mt-4">
        <ProductForm categories={categories} />
      </div>
    </div>
  );
}
