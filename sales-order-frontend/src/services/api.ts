import axios, { AxiosInstance, AxiosError } from "axios";
import type {
  Client,
  Item,
  SalesOrder,
  CreateSalesOrder,
  UpdateSalesOrder,
} from "@/types";


const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://localhost:7058/api";

// Create axios instance with default config
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 seconds
});

// Request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error("API Request Error:", error);
    return Promise.reject(error);
  },
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      console.error(
        "API Response Error:",
        error.response.status,
        error.response.data,
      );
    } else if (error.request) {
      console.error("API Network Error:", error.message);
    } else {
      console.error("API Error:", error.message);
    }
    return Promise.reject(error);
  },
);

// Client APIs
export const getAllClients = async (): Promise<Client[]> => {
  const response = await api.get<Client[]>("/Clients");
  return response.data;
};

export const getClientById = async (id: number): Promise<Client> => {
  const response = await api.get<Client>(`/Clients/${id}`);
  return response.data;
};

// Item APIs
export const getAllItems = async (): Promise<Item[]> => {
  const response = await api.get<Item[]>("/Items");
  return response.data;
};

export const getItemById = async (id: number): Promise<Item> => {
  const response = await api.get<Item>(`/Items/${id}`);
  return response.data;
};

// Sales Order APIs
export const getAllSalesOrders = async (): Promise<SalesOrder[]> => {
  const response = await api.get<SalesOrder[]>("/SalesOrders");
  return response.data;
};

export const getSalesOrderById = async (id: number): Promise<SalesOrder> => {
  const response = await api.get<SalesOrder>(`/SalesOrders/${id}`);
  return response.data;
};

export const createSalesOrder = async (
  orderData: CreateSalesOrder,
): Promise<SalesOrder> => {
  const response = await api.post<SalesOrder>("/SalesOrders", orderData);
  return response.data;
};

export const updateSalesOrder = async (
  id: number,
  orderData: UpdateSalesOrder,
): Promise<SalesOrder> => {
  const response = await api.put<SalesOrder>(`/SalesOrders/${id}`, orderData);
  return response.data;
};

export const deleteSalesOrder = async (id: number): Promise<void> => {
  await api.delete(`/SalesOrders/${id}`);
};

export default api;
