"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input, Label, Select, Textarea } from "@/components/ui/Input";

type Category = { id: string; name: string };

type ProductFormValues = {
  name: string;
  slug: string;
  description: string;
  priceCents: number;
  sku: string;
  imageUrl: string;
  stock: number;
  isActive: boolean;
  categoryId: string;
};

export function ProductForm({
  categories,
  productId,
  initialValues,
}: {
  categories: Category[];
  productId?: string;
  initialValues?: ProductFormValues;
}) {
  const router = useRouter();
  const isEdit = Boolean(productId);

  const [values, setValues] = useState<ProductFormValues>(
    initialValues ?? {
      name: "",
      slug: "",
      description: "",
      priceCents: 0,
      sku: "",
      imageUrl: "",
      stock: 0,
      isActive: true,
      categoryId: categories[0]?.id ?? "",
    }
  );
  const [priceInput, setPriceInput] = useState(
    initialValues ? (initialValues.priceCents / 100).toFixed(2) : "0.00"
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const res = await fetch(isEdit ? `/api/products/${productId}` : "/api/products", {
      method: isEdit ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    setSubmitting(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Failed to save product.");
      return;
    }

    router.push("/admin/products");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          required
          value={values.name}
          onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
        />
      </div>

      <div>
        <Label htmlFor="slug">Slug</Label>
        <Input
          id="slug"
          required
          value={values.slug}
          onChange={(e) => setValues((v) => ({ ...v, slug: e.target.value }))}
          placeholder="wireless-earbuds-pro"
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          required
          rows={4}
          value={values.description}
          onChange={(e) => setValues((v) => ({ ...v, description: e.target.value }))}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="price">Price (USD)</Label>
          <Input
            id="price"
            type="number"
            min="0"
            step="0.01"
            required
            value={priceInput}
            onChange={(e) => {
              setPriceInput(e.target.value);
              const cents = Math.round(Number(e.target.value || 0) * 100);
              setValues((v) => ({ ...v, priceCents: cents }));
            }}
          />
        </div>
        <div>
          <Label htmlFor="stock">Stock</Label>
          <Input
            id="stock"
            type="number"
            min="0"
            required
            value={values.stock}
            onChange={(e) =>
              setValues((v) => ({ ...v, stock: Number(e.target.value) }))
            }
          />
        </div>
      </div>

      <div>
        <Label htmlFor="sku">SKU</Label>
        <Input
          id="sku"
          required
          value={values.sku}
          onChange={(e) => setValues((v) => ({ ...v, sku: e.target.value }))}
        />
      </div>

      <div>
        <Label htmlFor="imageUrl">Image URL</Label>
        <Input
          id="imageUrl"
          type="url"
          required
          value={values.imageUrl}
          onChange={(e) => setValues((v) => ({ ...v, imageUrl: e.target.value }))}
        />
      </div>

      <div>
        <Label htmlFor="categoryId">Category</Label>
        <Select
          id="categoryId"
          required
          value={values.categoryId}
          onChange={(e) => setValues((v) => ({ ...v, categoryId: e.target.value }))}
        >
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </Select>
      </div>

      <label className="flex items-center gap-2 text-sm text-gray-700">
        <input
          type="checkbox"
          checked={values.isActive}
          onChange={(e) => setValues((v) => ({ ...v, isActive: e.target.checked }))}
        />
        Visible in storefront
      </label>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <Button type="submit" disabled={submitting}>
        {submitting ? "Saving..." : isEdit ? "Save changes" : "Create product"}
      </Button>
    </form>
  );
}
