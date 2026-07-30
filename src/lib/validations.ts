import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const productSchema = z.object({
  name: z.string().min(1, "Name is required").max(120),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase, alphanumeric, hyphen-separated"),
  description: z.string().min(1, "Description is required"),
  priceCents: z.coerce.number().int().min(0, "Price must be zero or greater"),
  sku: z.string().min(1, "SKU is required"),
  imageUrl: z.string().url("Must be a valid URL"),
  stock: z.coerce.number().int().min(0, "Stock must be zero or greater"),
  isActive: z.coerce.boolean().default(true),
  categoryId: z.string().min(1, "Category is required"),
});

export type ProductInput = z.infer<typeof productSchema>;

export const orderItemSchema = z.object({
  productId: z.string().min(1),
  quantity: z.coerce.number().int().min(1),
});

export const createOrderSchema = z.object({
  customerName: z.string().min(1, "Name is required").max(120),
  customerEmail: z.string().email("Must be a valid email"),
  items: z.array(orderItemSchema).min(1, "Cart is empty"),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;

export const orderStatusSchema = z.object({
  status: z.enum(["PENDING", "PAID", "SHIPPED", "CANCELLED"]),
});
