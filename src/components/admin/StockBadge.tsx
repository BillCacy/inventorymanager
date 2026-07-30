import { Badge } from "@/components/ui/Badge";

export function StockBadge({ stock }: { stock: number }) {
  if (stock <= 0) return <Badge tone="red">Out of stock</Badge>;
  if (stock < 5) return <Badge tone="yellow">Low ({stock})</Badge>;
  return <Badge tone="green">In stock ({stock})</Badge>;
}
