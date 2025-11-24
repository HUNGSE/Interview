import { ProductCreateRequest } from "../types/product-request";

export function mapToBackendRequest(data: ProductCreateRequest) {
  return {
    name: data.name,
    description: data.description,
    sku: data.sku,
    basePrice: Number(data.basePrice),
    categoryId: data.categoryId,
    isActive: data.isActive,
    variants: data.variants.map(v => ({
      color: v.color,
      size: v.size,
      additionalPrice: Number(v.additionalPrice),
      stockQuantity: Number(v.stockQuantity),
    })),
    imageUrls: data.imageUrls,
  };
}
