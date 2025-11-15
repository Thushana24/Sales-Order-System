
import type { Client } from "@/types";
import apiClient from "./Client";

export const clientsApi = {
  getAll: async (): Promise<Client[]> => {
    const { data } = await apiClient.get<Client[]>("/Clients");
    return data;
  },

  getById: async (id: number): Promise<Client> => {
    const { data } = await apiClient.get<Client>(`/Clients/${id}`);
    return data;
  },
};
