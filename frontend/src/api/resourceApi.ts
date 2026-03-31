import { http } from "./http";
import type { Resource } from "../types/resource";

type ApiResponse<T> = {
  message: string;
  data: T;
};

export async function fetchResources() {
  const response = await http.get<ApiResponse<Resource[]>>("/resources");
  return response.data.data;
}

