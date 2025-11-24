export interface ProductImage {
  id: string;
  productId: string;
  imageUrls: string;
  isPrimary: boolean;
}

export interface ProductVariant {
  id: string | null;     
  productId?: string;
  color?: string;
  size?: string;
  additionalPrice: number;
  stockQuantity: number;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  sku: string;
  basePrice: number;
  categoryId: string;
  isActive: boolean;
  variants: ProductVariant[];
  imageUrls: string[];   
  createdAt: string;
  updatedAt: string;
  rowVersion: string;
}


export interface CreateProductRequest {
  name: string;
  description?: string;
  sku: string;
  basePrice: number;
  categoryId: string;
  variants: ProductVariant[];
  imageUrls: string[];
}

export interface UpdateProductRequest {
  name: string;
  description?: string;
  basePrice: number;
  categoryId: string;
  rowVersion: string;              
  variants: ProductVariant[];
  imageUrls: string[];
}
