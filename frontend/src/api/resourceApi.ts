import { http } from "./http";
import type { Resource, ResourceCategory } from "../types/resource";

type ApiResponse<T> = {
  message: string;
  data: T;
};

export type SearchFilters = {
  query?: string;
  category?: ResourceCategory;
  location?: string;
  minCapacity?: number;
  active?: boolean;
};

export async function fetchResources() {
  const response = await http.get<ApiResponse<Resource[]>>("/resources");
  return response.data.data;
}

export async function searchResources(filters: SearchFilters) {
  const params = new URLSearchParams();
  if (filters.query) params.append("query", filters.query);
  if (filters.category) params.append("category", filters.category);
  if (filters.location) params.append("location", filters.location);
  if (filters.minCapacity) params.append("minCapacity", String(filters.minCapacity));
  if (filters.active !== undefined) params.append("active", String(filters.active));
  
  const response = await http.get<ApiResponse<Resource[]>>(`/resources/search?${params}`);
  return response.data.data;
}

export async function createResource(payload: Omit<Resource, "id" | "active">) {
  const response = await http.post<ApiResponse<Resource>>("/resources", payload);
  return response.data.data;
}

