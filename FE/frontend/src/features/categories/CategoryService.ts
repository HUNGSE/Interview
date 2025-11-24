import axiosClient from '../../api/axiosClient';
export interface Category {
  id: string;
  name: string;
  isActive: boolean;
}
 
 

// GET ALL
export async function getCategories(): Promise<Category[]> {
  return axiosClient.get(`/categories`).then(res => res.data);
}

// GET ONE
export async function getCategory(id: string): Promise<Category> {
  return axiosClient.get(`/categories/${id}`).then(res => res.data);
}

// CREATE
export async function createCategory(data: { name: string }): Promise<Category> {
  return axiosClient.post(`/categories`, data).then(res => res.data);
}

// UPDATE
export async function updateCategory(id: string, data: { name: string }): Promise<boolean> {
  const res = await axiosClient.put(`/categories/${id}`, data);
  return res.status === 204; // No Content
}

// DELETE
export async function deleteCategory(id: string): Promise<boolean> {
  const res = await axiosClient.delete(`/categories/${id}`);
  return res.status === 204;
}