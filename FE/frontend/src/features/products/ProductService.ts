import axiosClient from "../../api/axiosClient";
import { Product } from "../../types/product";
import { ProductCreateRequest, ProductUpdateRequest } from "../../types/product-request";
import { mapToBackendRequest } from "../../utils/mapProductRequest";

export async function getProducts(params?: any) {
  const res = await axiosClient.get("/products", { params });
  return res.data as {
    items: Product[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

export async function getProduct(id: string): Promise<Product> {
  const res = await axiosClient.get(`/products/${id}`);
  return res.data;
}

export async function createProduct(data: ProductCreateRequest): Promise<Product> {
  const body = mapToBackendRequest(data);
  const res = await axiosClient.post(`/products`, body);
  return res.data;
}

export async function updateProduct(id: string, data: any): Promise<Product> {
  await axiosClient.put(`/products/${id}`, data);
  return await getProduct(id); 
}

export async function deleteProduct(id: string): Promise<boolean> {
  const res = await axiosClient.delete(`/products/${id}`);
  return res.status === 204;
}
