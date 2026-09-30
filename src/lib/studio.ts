import { studioUrl } from "@/sanity/client";

export function studioEditUrl(documentId: string): string {
  return `${studioUrl}/intent/edit/id=${documentId};type=product`;
}

export function studioCreateProductUrl(): string {
  return `${studioUrl}/intent/create/template=product;type=product`;
}
