import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const stockSchema = z.object({
  stock: z.coerce.number().int().min(0, "Stock must be zero or greater"),
});

export type StockInput = z.infer<typeof stockSchema>;

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
