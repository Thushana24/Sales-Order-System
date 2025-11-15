
import type { Item } from "@/types";
import apiClient from "./client";

export const itemsApi = {
  getAll: async (): Promise<Item[]> => {
    const { data } = await apiClient.get<Item[]>("/Items");
    return data;
  },

  getById: async (id: number): Promise<Item> => {
    const { data } = await apiClient.get<Item>(`/Items/${id}`);
    return data;
  },
};
