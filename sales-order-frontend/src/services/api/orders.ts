import apiClient from "./client";
import type { SalesOrder, CreateSalesOrder, UpdateSalesOrder } from "@/types";

export const ordersApi = {
  getAll: async (): Promise<SalesOrder[]> => {
    const { data } = await apiClient.get<SalesOrder[]>("/SalesOrders");
    return data;
  },

  getById: async (id: number): Promise<SalesOrder> => {
    const { data } = await apiClient.get<SalesOrder>(`/SalesOrders/${id}`);
    return data;
  },

  create: async (orderData: CreateSalesOrder): Promise<SalesOrder> => {
    const { data } = await apiClient.post<SalesOrder>(
      "/SalesOrders",
      orderData,
    );
    return data;
  },

  update: async (
    id: number,
    orderData: UpdateSalesOrder,
  ): Promise<SalesOrder> => {
    const { data } = await apiClient.put<SalesOrder>(
      `/SalesOrders/${id}`,
      orderData,
    );
    return data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/SalesOrders/${id}`);
  },
};
