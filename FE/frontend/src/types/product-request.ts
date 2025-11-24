export interface ProductCreateRequest {
  name: string;
  description?: string;
  sku: string;
  basePrice: number;
  categoryId: string;
  isActive: boolean;
  variants: Array<{
    color?: string;
    size?: string;
    additionalPrice: number;
    stockQuantity: number;
  }>;
  imageUrls: string[];
}

export interface ProductUpdateRequest extends ProductCreateRequest {}
