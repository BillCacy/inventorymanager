export const CART_STORAGE_KEY = "nimbustech-cart";

export type CartItem = {
  productId: string;
  name: string;
  slug: string;
  priceCents: number;
  imageUrl: string;
  stock: number;
  quantity: number;
};
